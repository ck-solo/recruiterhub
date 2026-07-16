import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.config.js";
import { importJobsFromBuffer, deleteImportedJobs } from "../services/import.service.js";
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
  console.log(`Loaded file: large_mock_jobs.xlsx (${fileBuffer.length} bytes)`);

  console.log("Starting Step 1 Optimized Profile...");
  const start = performance.now();
  const summary = await importJobsFromBuffer(fileBuffer, "large_mock_jobs.xlsx");
  const end = performance.now();
  const durationSec = ((end - start) / 1000).toFixed(3);

  console.log("\n================ PROFILE SUMMARY ================");
  console.log(`Total Time Taken: ${durationSec} seconds`);
  console.log(`Import Results: ${JSON.stringify(summary, null, 2)}`);
  console.log("=================================================\n");

  // Clean up
  console.log("Cleaning up imported jobs...");
  const cleanupStats = await deleteImportedJobs("large_mock_jobs.xlsx");
  console.log(`Cleaned up: ${JSON.stringify(cleanupStats)}`);

  process.exit(0);
}

runProfile().catch((err) => {
  console.error("Profile run failed:", err);
  process.exit(1);
});
