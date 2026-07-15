import { Link } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiDollarSign, FiCalendar, FiCheckCircle, FiCopy } from "react-icons/fi";
import { memo } from "react";

function JobCard({ job }) {
  return (
    <div
      className={`glass-card p-5 bg-white dark:bg-slate-900 border rounded-2xl transition hover:shadow-md hover:scale-[1.005] ${
        job.isDuplicate 
          ? "border-amber-200 dark:border-amber-950/40 bg-amber-500/[0.01]" 
          : "border-slate-200/50 dark:border-slate-800/50"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/jobs/${job._id}`}
              className="text-base font-black text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {job.title}
            </Link>
            {job.isDuplicate ? (
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/30 text-[9px] font-bold uppercase rounded flex items-center gap-1">
                <FiCopy size={8} /> Duplicate Match
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30 text-[9px] font-bold uppercase rounded flex items-center gap-1">
                <FiCheckCircle size={8} /> Canonical
              </span>
            )}
            {job.remote && (
              <span className="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/30 text-[9px] font-bold uppercase rounded">
                Remote
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-350">
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <FiMapPin className="text-slate-400" />
              {job.location || "Location Not Specified"}
            </span>
            <span className="flex items-center gap-1">
              <FiBriefcase className="text-slate-400" />
              {job.employmentType}
            </span>
            <span className="flex items-center gap-1">
              <FiDollarSign className="text-slate-400" />
              {job.salaryMin !== null ? (
                <span>
                  {job.currency} {job.salaryMin.toLocaleString()}{" "}
                  {job.salaryMax && job.salaryMax !== job.salaryMin ? `- ${job.salaryMax.toLocaleString()}` : ""}
                </span>
              ) : (
                <span>{job.salary || "Not Disclosed"}</span>
              )}
            </span>
          </div>
        </div>

        {/* Right metadata / action */}
        <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 shrink-0">
          <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <FiCalendar />
            {new Date(job.postedDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
          
          <Link
            to={`/jobs/${job._id}`}
            className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>

      {/* Skill Tags */}
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100/50 dark:border-slate-800/40">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 py-0.5 bg-slate-55 text-slate-400 text-[10px] font-semibold">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(JobCard);
