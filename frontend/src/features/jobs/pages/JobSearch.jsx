import { useState } from "react";
import { useGetJobsQuery } from "../api/jobs.api.js";
import SearchFilters from "../components/SearchFilters.jsx";
import JobList from "../components/JobList.jsx";
import Pagination from "../components/Pagination.jsx";
import PageHeader from "../../../shared/components/PageHeader.jsx";
import Loader from "../../../shared/components/Loader.jsx";
import ErrorState from "../../../shared/components/ErrorState.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";

function JobSearch() {
  // Query Filters State
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [remote, setRemote] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [isDuplicate, setIsDuplicate] = useState("false"); // default hide duplicates
  const [sortBy, setSortBy] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Active triggers (sent to API)
  const [queryParams, setQueryParams] = useState({
    search: "",
    company: "",
    location: "",
    employmentType: "",
    remote: "",
    experience: "",
    salaryMin: "",
    salaryMax: "",
    isDuplicate: "false",
    sortBy: "postedDate",
    sortOrder: "desc",
    page: 1,
    limit: 8,
  });

  const { data: response, isLoading, error, refetch } = useGetJobsQuery(queryParams);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    setQueryParams({
      search,
      company,
      location,
      employmentType,
      remote,
      experience,
      salaryMin,
      salaryMax,
      isDuplicate,
      sortBy,
      sortOrder,
      page: 1,
      limit: 8,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCompany("");
    setLocation("");
    setEmploymentType("");
    setRemote("");
    setExperience("");
    setSalaryMin("");
    setSalaryMax("");
    setIsDuplicate("false");
    setSortBy("postedDate");
    setSortOrder("desc");
    setPage(1);
    setQueryParams({
      search: "",
      company: "",
      location: "",
      employmentType: "",
      remote: "",
      experience: "",
      salaryMin: "",
      salaryMax: "",
      isDuplicate: "false",
      sortBy: "postedDate",
      sortOrder: "desc",
      page: 1,
      limit: 8,
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const jobsData = response?.data || { jobs: [], total: 0, page: 1, pages: 1 };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageHeader
          title="Hiring Database"
          subtitle="Search, filter, and review details of all matching positions in the platform"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <SearchFilters
          search={search}
          setSearch={setSearch}
          company={company}
          setCompany={setCompany}
          location={location}
          setLocation={setLocation}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          remote={remote}
          setRemote={setRemote}
          experience={experience}
          setExperience={setExperience}
          salaryMin={salaryMin}
          setSalaryMin={setSalaryMin}
          salaryMax={salaryMax}
          setSalaryMax={setSalaryMax}
          isDuplicate={isDuplicate}
          setIsDuplicate={setIsDuplicate}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleApplyFilters={handleApplyFilters}
          handleResetFilters={handleResetFilters}
        />

        {/* Jobs List Grid */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <Loader message="Querying jobs database..." />
          ) : error ? (
            <ErrorState
              title="Search Query Failed"
              message={error?.data?.message || "There was a problem carrying out the query."}
              onRetry={refetch}
            />
          ) : jobsData.jobs.length === 0 ? (
            <EmptyState
              title="No Jobs Found"
              message="No job listings match your current filters. Try relaxing your search criteria or clear filters."
              actionLabel="Clear Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider px-2">
                <span>Found {jobsData.total} Matching listings</span>
                <span>Page {jobsData.page} of {jobsData.pages}</span>
              </div>

              {/* Jobs List */}
              <JobList jobs={jobsData.jobs} />

              {/* Pagination Controls */}
              <Pagination
                page={page}
                pages={jobsData.pages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSearch;
