import { parseExcelBuffer } from "../utils/xlsx.utils.js";
import { normalizeJobRow } from "../utils/dataNormalizer.js";
import { jaroWinkler, jaccardSimilarity } from "../utils/similarity.js";
import MongoJobRepository from "../repository/mongo.job.js"


/**
 * Imports jobs from an uploaded Excel spreadsheet buffer
 */
export async function importJobsFromBuffer(fileBuffer, originalName) {

    console.log(`Starting excel import: ${originalName}`);

    const { rawRows, sheetName } = parseExcelBuffer(fileBuffer);
    console.log(`Found ${rawRows.length} rows in sheet "${sheetName}"`);

    const summary = {
        totalRows: rawRows.length,
        imported: 0,
        updated: 0,
        failed: 0,
        duplicatesFound: 0,
    };

    // Cache to check intra-batch unique jobs quickly
    const batchCanonicalCache = {};

    for (let index = 0; index < rawRows.length; index++) {
        const rawRow = rawRows[index];
        try {
            // 1. Data Normalization
            const normalized = normalizeJobRow(rawRow);
            if (originalName) {
                normalized.source = originalName;
            }

            // 2. Duplicate Detection
            // Query candidates under the same company from the DB
            const dbCandidates = await MongoJobRepository.findCanonicalCandidatesByCompany(normalized.companyNormalized);

            // Also get candidates from current batch cache
            const cacheCandidates = batchCanonicalCache[normalized.companyNormalized] || [];
            const allCandidates = [...dbCandidates, ...cacheCandidates];

            let bestMatch = null;
            let highestScore = 0;

            for (const candidate of allCandidates) {
                // Similarity calculations
                const titleScore = jaroWinkler(normalized.titleNormalized, candidate.titleNormalized);
                const descScore = jaccardSimilarity(normalized.description, candidate.description);

                // Calculate skill overlap similarity
                const candidateSkillsStr = candidate.skillsNormalized.join(" ");
                const normalizedSkillsStr = normalized.skillsNormalized.join(" ");
                const skillsScore = jaccardSimilarity(normalizedSkillsStr, candidateSkillsStr);

                // Combined score weighted: 50% title, 30% description, 20% skills
                const combinedScore = (0.5 * titleScore) + (0.3 * descScore) + (0.2 * skillsScore);

                if (combinedScore > highestScore) {
                    highestScore = combinedScore;
                    bestMatch = candidate;
                }
            }

            // Duplicate threshold (e.g. 82%)
            const DUPLICATE_THRESHOLD = 0.82;

            if (bestMatch && highestScore >= DUPLICATE_THRESHOLD) {
                normalized.isDuplicate = true;
                normalized.duplicateGroupId = bestMatch._id;
                normalized.duplicateScore = parseFloat(highestScore.toFixed(3));
                summary.duplicatesFound++;
            }

            // Save row to database immediately so it is available for subsequent rows
            const saved = await MongoJobRepository.createJob(normalized);

            // If it's a new canonical job, cache it for the remainder of this batch
            if (!normalized.isDuplicate) {
                if (!batchCanonicalCache[normalized.companyNormalized]) {
                    batchCanonicalCache[normalized.companyNormalized] = [];
                }
                batchCanonicalCache[normalized.companyNormalized].push(saved);
            }

            summary.imported++;
        } catch (error) {
            console.log(`Import failed at row ${index + 2}: ${error.message}`);
            summary.failed++;
        }
    }

    console.log(`Import complete: ${JSON.stringify(summary)}`);
    return summary;
}

/**
 * Deletes all jobs imported from a specific filename and cleans up duplicate groups.
 */
export async function deleteImportedJobs(filename) {
    console.log(`Starting deletion of jobs imported from file: ${filename}`);

    // 1. Find all jobs matching the source filename
    const jobsToDelete = await MongoJobRepository.findJobsBySource(filename);
    const idsToDelete = jobsToDelete.map(j => j._id);

    if (idsToDelete.length === 0) {
        console.log(`No jobs found matching source: ${filename}`);
        return { deletedCount: 0, promotedCount: 0 };
    }

    // 2. Filter canonical jobs being deleted (non-duplicates)
    const canonicalIdsDeleted = jobsToDelete
        .filter(j => !j.isDuplicate)
        .map(j => j._id);

    // 3. Delete jobs from database
    const deleteResult = await MongoJobRepository.deleteJobsByIds(idsToDelete);

    // 4. Resolve remaining duplicate jobs that referenced the deleted canonical ones
    let promotedCount = 0;
    for (const canonicalId of canonicalIdsDeleted) {
        const remaining = await MongoJobRepository.findDuplicatesByGroupId(canonicalId);
        // Exclude any remaining duplicates that were also deleted in this batch (should be none since idsToDelete is deleted, but safety first)
        const activeRemaining = remaining.filter(r => !idsToDelete.some(id => id.toString() === r._id.toString()));

        if (activeRemaining.length > 0) {
            // Sort by creation date ascending (oldest first) to find the new canonical listing
            const sortedRemaining = activeRemaining.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const newCanonical = sortedRemaining[0];

            // Promote oldest duplicate to canonical
            await MongoJobRepository.updateJob(newCanonical._id, {
                isDuplicate: false,
                duplicateGroupId: null,
                duplicateScore: 0
            });
            promotedCount++;

            // Point the rest of the duplicate group to the new canonical
            if (sortedRemaining.length > 1) {
                const restIds = sortedRemaining.slice(1).map(r => r._id);
                await MongoJobRepository.updateJobsDuplicateGroup(restIds, newCanonical._id);
            }
        }
    }

    console.log(`Deletion finished. Deleted jobs count: ${deleteResult.deletedCount}. Promoted duplicates count: ${promotedCount}`);
    return {
        deletedCount: deleteResult.deletedCount,
        promotedCount
    };
}