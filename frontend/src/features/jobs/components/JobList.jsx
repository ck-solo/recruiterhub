import JobCard from "./JobCard";

function JobList({ jobs }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}

export default JobList;
