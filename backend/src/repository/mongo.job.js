import { Job } from "../models/job.model.js";

// --- Constants ---
const ALLOWED_SORT_FIELDS = [
  "postedDate",
  "createdAt",
  "salaryMin",
  "salaryMax",
  "company",
  "title"
];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// --- Helper Functions ---

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseBool = (val) => {
  if (typeof val === "boolean") return val;
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
};

const parseNum = (val) => {
  const num = Number(val);
  return (
    val !== undefined && 
    val !== null && 
    val !== "" && 
    !Number.isNaN(num) 
      ? num 
      : undefined
  );
};

const buildSearchFilter = (search) => {
  if (!search) return {};
  const cleanSearch = escapeRegex(search.trim());
  return {
    $or: [
      { title: { $regex: cleanSearch, $options: "i" } },
      { company: { $regex: cleanSearch, $options: "i" } },
      { description: { $regex: cleanSearch, $options: "i" } },
      { skills: { $regex: cleanSearch, $options: "i" } },
    ],
  };
};

const buildExperienceFilter = (experience) => {
  const expNum = parseNum(experience);
  if (expNum === undefined) return {};
  return {
    $or: [
      { experienceMin: { $lte: expNum }, experienceMax: { $gte: expNum } },
      { experienceMin: { $lte: expNum }, experienceMax: null },
      { experienceMin: null, experienceMax: null },
    ],
  };
};

// --- Repository Class ---

class MongoJobRepository {
  async createJob(jobData) {
    return await new Job(jobData).save();
  }

  async bulkWriteJobs(operations) {
    if (!operations?.length) return { insertedCount: 0, modifiedCount: 0 };
    return await Job.bulkWrite(operations);
  }

  async findJobs({ search, company, location, employmentType, remote, experience, salaryMin, salaryMax, isDuplicate, page = 1, limit = 10, sortBy = "postedDate", sortOrder = "desc" }) {
    
    // Pagination & Sorting Validation using Constants
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(limit) || DEFAULT_PAGE_SIZE));
    const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "postedDate";
    
    // Normalized sort order (handles "ASC", "Asc", "asc")
    const validSortOrder = String(sortOrder).toLowerCase().startsWith("asc") ? 1 : -1;

    // Data Parsing
    const parsedDup = parseBool(isDuplicate);
    const parsedRemote = parseBool(remote);
    const minVal = parseNum(salaryMin);
    const maxVal = parseNum(salaryMax);

    // 1. Build the base query for direct matches
    const query = {
      ...(parsedDup !== undefined && { isDuplicate: parsedDup }),
      ...(parsedRemote !== undefined && { remote: parsedRemote }),
      ...(company && { companyNormalized: company.trim().toLowerCase() }),
      ...(location && { locationNormalized: { $regex: escapeRegex(location.trim().toLowerCase()), $options: "i" } }),
      ...(employmentType && { employmentType }),
      ...(minVal !== undefined && { salaryMax: { $gte: minVal } }),
      ...(maxVal !== undefined && { salaryMin: { $lte: maxVal } }),
    };

    // 2. Safely handle multiple $or conditions using $and 
    const andConditions = [];
    
    const searchFilter = buildSearchFilter(search);
    if (searchFilter.$or) andConditions.push(searchFilter);

    const expFilter = buildExperienceFilter(experience);
    if (expFilter.$or) andConditions.push(expFilter);

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const sort = { [validSortBy]: validSortOrder };
    const skip = (validPage - 1) * validLimit;

    // Execute with .lean() for read performance
    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(validLimit).lean().exec(),
      Job.countDocuments(query).exec(),
    ]);

    return { jobs, total, page: validPage, limit: validLimit, pages: Math.ceil(total / validLimit) };
  }

  async findJobById(id) {
    const job = await Job.findById(id).lean().exec();
    if (!job) return null;

    const isDup = job.isDuplicate;

    const [canonical, duplicates] = await Promise.all([
      isDup ? Job.findById(job.duplicateGroupId).lean().exec() : Promise.resolve(null),
      !isDup ? Job.find({ duplicateGroupId: job._id }).lean().exec() : Promise.resolve([]),
    ]);

    return { job, duplicates, canonical };
  }

  async findDuplicates() {
    return await Job.aggregate([
      { $match: { isDuplicate: true } },
      { $group: { _id: "$duplicateGroupId", duplicates: { $push: "$$ROOT" } } },
      { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "canonical" } },
      { $unwind: "$canonical" },
      { $sort: { "canonical.createdAt": -1 } },
    ]);
  }

  async updateJob(id, updates) {
    return await Job.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async findCanonicalCandidatesByCompany(companyNormalized) {
    return await Job.find({ companyNormalized, isDuplicate: false }).lean().exec();
  }

  async getDashboardCounts() {
    const stats = await Job.aggregate([{
      $facet: {
        totalJobs: [{ $count: "count" }],
        duplicateJobs: [{ $match: { isDuplicate: true } }, { $count: "count" }],
        remoteJobs: [{ $match: { remote: true } }, { $count: "count" }],
        companies: [{ $group: { _id: "$companyNormalized" } }, { $count: "count" }],
        locations: [{ $group: { _id: "$locationNormalized" } }, { $count: "count" }],
      },
    }]);

    const getVal = (facetResult) => facetResult[0]?.count || 0;
    const s = stats[0];

    return {
      totalJobs: getVal(s.totalJobs),
      duplicateJobs: getVal(s.duplicateJobs),
      remoteJobs: getVal(s.remoteJobs),
      totalCompanies: getVal(s.companies),
      totalLocations: getVal(s.locations),
    };
  }

  async getAnalyticsStats() {
    const [empTypeDist, topCompanies, salaryRanges, skillsFreq, recentJobs] = await Promise.all([
      Job.aggregate([{ $group: { _id: "$employmentType", count: { $sum: 1 } } }]),
      Job.aggregate([
        { $match: { isDuplicate: false } },
        { $group: { _id: "$company", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { name: "$_id", count: 1, _id: 0 } }
      ]),
      Job.aggregate([
        { $match: { salaryMin: { $ne: null } } },
        { $group: {
            _id: "$currency", avgMinSalary: { $avg: "$salaryMin" },
            avgMaxSalary: { $avg: "$salaryMax" }, minSalary: { $min: "$salaryMin" },
            maxSalary: { $max: "$salaryMax" }, count: { $sum: 1 }
        }}
      ]),
      Job.aggregate([
        { $unwind: "$skills" },
        { $group: { _id: { $toLower: { $trim: { input: "$skills" } } }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
        { $project: { name: "$_id", count: 1, _id: 0 } }
      ]),
      Job.find({ isDuplicate: false }).sort({ postedDate: -1 }).limit(5).lean().exec()
    ]);

    const employmentTypeDistribution = empTypeDist.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return { employmentTypeDistribution, topCompanies, salaryRanges, skillsFreq, recentJobs };
  }
}

export default new MongoJobRepository();