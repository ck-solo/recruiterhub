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

  const filePath = path.join(__dirname, "../../../large_mock_jobs.xlsx");
  if (!fs.existsSync(filePath)) {
    console.error(`Mock file not found at ${filePath}. Please run generateLargeMockExcel.js first.`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);

  const startMemory = process.memoryUsage();
  const startTotal = performance.now();

  // Stage 1: Excel parsing
  const stage1Start = performance.now();
  const { rawRows } = parseExcelBuffer(fileBuffer);
  const stage1End = performance.now();

  console.log(`Found ${rawRows.length} rows in sheet.`);

  const summary = {
    totalRows: rawRows.length,
    imported: 0,
    updated: 0,
    failed: 0,
    duplicatesFound: 0,
  };

  const batchCanonicalCache = {};
  
  let totalNormTime = 0;
  let totalDbQueryTime = 0;
  let totalSimTime = 0;
  let totalDbSaveTime = 0;

  for (let index = 0; index < rawRows.length; index++) {
    const rawRow = rawRows[index];
    try {
      // Data Normalization
      const normStart = performance.now();
      const normalized = normalizeJobRow(rawRow);
      normalized.source = "large_mock_jobs.xlsx";
      totalNormTime += performance.now() - normStart;

      // Duplicate Detection DB Query
      const dbQueryStart = performance.now();
      const dbCandidates = await MongoJobRepository.findCanonicalCandidatesByCompany(normalized.companyNormalized);
      totalDbQueryTime += performance.now() - dbQueryStart;

      // Duplicate Detection Similarity Calculations
      const simStart = performance.now();
      const cacheCandidates = batchCanonicalCache[normalized.companyNormalized] || [];
      const allCandidates = [...dbCandidates, ...cacheCandidates];

      let bestMatch = null;
      let highestScore = 0;

      for (const candidate of allCandidates) {
        const titleScore = jaroWinkler(normalized.titleNormalized, candidate.titleNormalized);
        const descScore = jaccardSimilarity(normalized.description, candidate.description);
        const candidateSkillsStr = candidate.skillsNormalized.join(" ");
        const normalizedSkillsStr = normalized.skillsNormalized.join(" ");
        const skillsScore = jaccardSimilarity(normalizedSkillsStr, candidateSkillsStr);
        const combinedScore = (0.5 * titleScore) + (0.3 * descScore) + (0.2 * skillsScore);

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
        summary.duplicatesFound++;
      }
      totalSimTime += performance.now() - simStart;

      // Save row to DB
      const dbSaveStart = performance.now();
      const saved = await MongoJobRepository.createJob(normalized);
      totalDbSaveTime += performance.now() - dbSaveStart;

      if (!normalized.isDuplicate) {
        if (!batchCanonicalCache[normalized.companyNormalized]) {
          batchCanonicalCache[normalized.companyNormalized] = [];
        }
        batchCanonicalCache[normalized.companyNormalized].push(saved);
      }

      summary.imported++;
    } catch (error) {
      summary.failed++;
    }

    if ((index + 1) % 100 === 0) {
      console.log(`Processed ${index + 1} / ${rawRows.length} rows...`);
    }
  }

  const endTotal = performance.now();
  const endMemory = process.memoryUsage();

  console.log("\n================ PROFILE RESULTS ================");
  console.log(`Excel Parsing:  ${(stage1End - stage1Start).toFixed(2)} ms`);
  console.log(`Normalization:  ${totalNormTime.toFixed(2)} ms`);
  console.log(`DB Candidates:  ${totalDbQueryTime.toFixed(2)} ms`);
  console.log(`Similarity:     ${totalSimTime.toFixed(2)} ms`);
  console.log(`DB Save:        ${totalDbSaveTime.toFixed(2)} ms`);
  console.log(`Total Time:     ${((endTotal - startTotal) / 1000).toFixed(2)} seconds`);
  console.log(`Memory Used:    ${((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Import Summary: ${JSON.stringify(summary, null, 2)}`);
  console.log("=================================================\n");

  console.log("Cleaning up database...");
  await MongoJobRepository.deleteJobsByIds(
    (await MongoJobRepository.findJobsBySource("large_mock_jobs.xlsx")).map(j => j._id)
  );

  process.exit(0);
}

runProfile().catch(err => {
  console.error("Profile run failed:", err);
  process.exit(1);
});
