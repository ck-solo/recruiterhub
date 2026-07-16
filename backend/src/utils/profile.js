import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.config.js";
import { parseExcelBuffer } from "../utils/xlsx.utils.js";
import { normalizeJobRow } from "../utils/dataNormalizer.js";
import { jaroWinkler, jaccardSimilarity } from "../utils/similarity.js";
import MongoJobRepository from "../repository/mongo.job.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runProfile() {
  console.log("Connecting to Database...");
  await connectDB();

  const filePath = path.join(__dirname, "../../../mock_jobs.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const { rawRows } = parseExcelBuffer(fileBuffer);

  const batchCanonicalCache = {};

  for (let index = 0; index < rawRows.length; index++) {
    const rawRow = rawRows[index];
    try {
      const normalized = normalizeJobRow(rawRow);
      normalized.source = "mock_jobs.xlsx";

      const dbCandidates = await MongoJobRepository.findCanonicalCandidatesByCompany(normalized.companyNormalized);
      const cacheCandidates = batchCanonicalCache[normalized.companyNormalized] || [];
      const allCandidates = [...dbCandidates, ...cacheCandidates];

      console.log(`Row ${index + 2}: Company "${normalized.company}", Normalized: "${normalized.companyNormalized}". DB Candidates: ${dbCandidates.length}, Cache Candidates: ${cacheCandidates.length}`);

      let bestMatch = null;
      let highestScore = 0;

      for (const candidate of allCandidates) {
        const titleScore = jaroWinkler(normalized.titleNormalized, candidate.titleNormalized);
        const descScore = jaccardSimilarity(normalized.description, candidate.description);
        const candidateSkillsStr = candidate.skillsNormalized.join(" ");
        const normalizedSkillsStr = normalized.skillsNormalized.join(" ");
        const skillsScore = jaccardSimilarity(normalizedSkillsStr, candidateSkillsStr);
        const combinedScore = (0.5 * titleScore) + (0.3 * descScore) + (0.2 * skillsScore);

        console.log(`  Comparing with "${candidate.title}" (ID: ${candidate._id}): titleScore=${titleScore.toFixed(3)}, descScore=${descScore.toFixed(3)}, skillsScore=${skillsScore.toFixed(3)}, combined=${combinedScore.toFixed(3)}`);

        if (combinedScore > highestScore) {
          highestScore = combinedScore;
          bestMatch = candidate;
        }
      }

      const DUPLICATE_THRESHOLD = 0.82;
      if (bestMatch && highestScore >= DUPLICATE_THRESHOLD) {
        normalized.isDuplicate = true;
        normalized.duplicateGroupId = bestMatch._id;
        normalized.duplicateScore = parseFloat(highestScore.toFixed(3));
        console.log(`  -> DUPLICATE FOUND: group=${bestMatch._id}, score=${highestScore.toFixed(3)}`);
      }

      const saved = await MongoJobRepository.createJob(normalized);

      if (!normalized.isDuplicate) {
        if (!batchCanonicalCache[normalized.companyNormalized]) {
          batchCanonicalCache[normalized.companyNormalized] = [];
        }
        batchCanonicalCache[normalized.companyNormalized].push(saved);
      }
    } catch (error) {
      console.log(`  Row ${index + 2} failed: ${error.message}`);
    }
  }

  // Clean up database
  await MongoJobRepository.deleteJobsByIds(
    (await MongoJobRepository.findJobsBySource("mock_jobs.xlsx")).map(j => j._id)
  );
  process.exit(0);
}

runProfile().catch(err => {
  console.error(err);
  process.exit(1);
});
