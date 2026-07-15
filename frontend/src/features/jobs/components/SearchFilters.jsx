import { FiSearch } from "react-icons/fi";
import { memo } from "react";

function SearchFilters({
  search,
  setSearch,
  company,
  setCompany,
  location,
  setLocation,
  employmentType,
  setEmploymentType,
  remote,
  setRemote,
  experience,
  setExperience,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  isDuplicate,
  setIsDuplicate,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleApplyFilters,
  handleResetFilters,
}) {
  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl h-fit space-y-5 lg:sticky lg:top-4">
      <h3 className="font-bold text-slate-800 dark:text-white text-base">Faceted Search</h3>

      <form onSubmit={handleApplyFilters} className="space-y-4">
        {/* Search */}
        <div className="space-y-1">
          <label htmlFor="keywords-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Keywords</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              id="keywords-filter"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, skills, keyword..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Company */}
        <div className="space-y-1">
          <label htmlFor="company-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Company</label>
          <input
            id="company-filter"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Google, Microsoft..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label htmlFor="location-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Location</label>
          <input
            id="location-filter"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="New York, Remote..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Employment Type */}
        <div className="space-y-1">
          <label htmlFor="job-type-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Job Type</label>
          <select
            id="job-type-filter"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <label htmlFor="exp-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Exp. (Years)</label>
          <input
            id="exp-filter"
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 3"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-1">
          <label htmlFor="salary-min-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Salary Range</label>
          <div className="flex gap-2 items-center">
            <input
              id="salary-min-filter"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="Min"
              className="w-1/2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="Max"
              aria-label="Maximum salary filter"
              className="w-1/2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Remote */}
        <div className="space-y-1">
          <label htmlFor="workplace-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Workplace</label>
          <select
            id="workplace-filter"
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="">Anywhere</option>
            <option value="true">Remote Only</option>
            <option value="false">On-site / Hybrid</option>
          </select>
        </div>

        {/* Duplicate Filter */}
        <div className="space-y-1">
          <label htmlFor="duplicates-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Duplicates</label>
          <select
            id="duplicates-filter"
            value={isDuplicate}
            onChange={(e) => setIsDuplicate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="">Show All</option>
            <option value="false">Unique Jobs Only</option>
            <option value="true">Duplicate Matches Only</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="space-y-1">
          <label htmlFor="sort-by-filter" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Sort By</label>
          <div className="flex gap-2">
            <select
              id="sort-by-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-2/3 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="postedDate">Date Posted</option>
              <option value="salaryMin">Salary Min</option>
              <option value="experienceMin">Experience</option>
              <option value="title">Job Title</option>
              <option value="company">Company</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort order"
              className="w-1/3 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition active:scale-95 shadow-sm"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="w-1/2 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-semibold transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(SearchFilters);
