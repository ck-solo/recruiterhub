# HireHub

HireHub is a high-performance, full-stack recruitment portal designed for bulk job ingestion, intelligent duplicate listing detection, rich dashboard analytics, and AI-powered resume tailoring. 

---

## 🚀 Quick Start & Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (running locally or via MongoDB Atlas)
* **Google Gemini API Key** (for LLM-based resume tailoring)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by copying the example:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your credentials:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/HireHub
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Start the development server (runs with nodemon):
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend root and set the backend API URL:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🏗️ System Architecture & Design Decisions

### 1. Decoupled Repository-Service Pattern
The backend is structured into four distinct logical layers to enforce single responsibility:
* **Routes:** Maps endpoints to controllers.
* **Controllers:** Handles HTTP validation, sets response payloads, and captures errors using an async wrapper.
* **Services:** Houses all core business rules, algorithms, and logical flows (e.g., ingestion pipelines, AI integration).
* **Repositories:** Direct interface with the MongoDB database using Mongoose. This ensures that changes to the database schemas or ORM query formats do not leak into the business logic.

### 2. High-Performance Bulk Ingestion Pipeline
To safely support uploading sheets with tens of thousands of rows:
* **Batch Pre-fetching:** Instead of querying the database for duplicate candidates line-by-line (N+1 queries), we extract all unique companies from the import list and batch-query existing database jobs in a single round-trip.
* **Write Buffering & Concurrent Inserts:** Ingested jobs are buffered locally in chunks of 2,000. These chunks are inserted into MongoDB using `insertMany` with `{ ordered: false }`. This permits parallel processing by the database driver and continues importing even if individual entries fail.
* **Memory Management:** Local array buffers are emptied inside a `try...finally` block to prevent memory exhaustion in the Node event loop during large files.

### 3. Intelligent Hybrid Duplicate Detection
Duplicates are evaluated based on multi-attribute similarity calculations:
* **Title Similarity:** Computed using the **Jaro-Winkler** distance algorithm to tolerate typos, prefix variations, and minor casing differences.
* **Description & Skills Similarity:** Parsed into normalized tokens and measured using **Jaccard Similarity** (set intersection over union).
* **Weighted Combine:** A combined score is compiled with weights (50% Title, 30% Description, 20% Skills). If the score matches or exceeds `0.82`, the record is marked as a duplicate and linked to its parent canonical listing.

### 4. Cascade Deletion & Reference Healing
When an imported file is deleted, we must clean up duplicate relationships:
* The system isolates which deleted listings were canonical parents.
* If a parent is removed, the oldest remaining duplicate listing under that group is automatically promoted to canonical (`isDuplicate: false`, `duplicateGroupId: null`).
* All other remaining duplicate nodes are updated to point to the newly promoted parent, preventing orphaned references.

### 5. Resilient AI Resume Tailoring (LLM-to-NLP Fallback)
* The primary agent forwards the job description and candidate resume to **Gemini Flash** with a strict prompt structure requiring a JSON response.
* If the external API fails (due to rate limits, network timeouts, or invalid keys), the system gracefully downgrades to a **Local Rule-based NLP Fallback** using regex-based skill intersection and Jaccard similarity on description text.

### 6. Frontend Cache Synchronization
The frontend leverages Redux Toolkit (RTK) Query cache invalidations:
* API mutation endpoints specify `invalidatesTags`.
* For example, deleting an import automatically triggers cache invalidation for `["JobsList", "JobsStats", "DuplicatesList", "JobDetails"]`, prompting the client to fetch fresh state without requiring manual component re-renders.

---

## 📝 Assumptions
1. **Schema Mapping:** Ingested files (CSV/Excel) must contain columns mapping to job properties (e.g., `company`, `title`, `description`, `skills`).
2. **Single-Tenant Scope:** Currently, duplication and canonical groupings operate globally under the assumption of normalized company names within a shared registry.
3. **Synchronous Uploads:** The import file parser executes synchronously within the request context, assuming files do not exceed ordinary corporate server memory thresholds (e.g., under 100,000 rows per sheet).

---

## ⚠️ Known Limitations & Future Improvements
1. **Event-Loop Blocking:** Very large spreadsheets (e.g., >100,000 rows) might block the Node.js single-threaded event loop due to synchronous similarity scoring. Offloading parsing to a worker pool (e.g., Node `worker_threads`) or queuing system (e.g., BullMQ) is recommended for extreme scale.
2. **Payload Size Limits:** Express payload parsers are configured for typical payloads. Extremely large file uploads may hit server proxy timeouts or maximum upload body limitations unless configured for chunked/direct cloud storage uploads.
3. **No Lock System for Simultaneous Imports:** If multiple administrators upload files containing identical companies at the exact same moment, duplicate detection might suffer from a race condition since batch pre-fetching happens before the database transactions commit. Implementing a distributed lock (e.g., Redis Lock) would prevent this.
