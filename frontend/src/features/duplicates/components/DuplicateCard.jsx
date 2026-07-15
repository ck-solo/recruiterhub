function DuplicateCard({ job, variant, canonicalJob, duplicateScore }) {
  const isDuplicate = variant === "duplicate";

  // Comparison helpers
  const titleDiffers = isDuplicate && canonicalJob &&
    canonicalJob.title.toLowerCase() !== job.title.toLowerCase();

  const locationDiffers = isDuplicate && canonicalJob &&
    canonicalJob.location.toLowerCase() !== job.location?.toLowerCase();

  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-5 rounded-2xl space-y-4 h-fit">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
        {isDuplicate ? (
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/20 px-2 py-0.5 rounded flex items-center gap-1">
            Duplicate Match (Score: {(duplicateScore * 100).toFixed(0)}%)
          </span>
        ) : (
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/20 px-2 py-0.5 rounded">
            Canonical Record (Master)
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Job Title</h4>
        <p className={`text-sm font-black ${
          titleDiffers
            ? "text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 px-1 rounded"
            : "text-slate-850 dark:text-white"
        }`}>
          {job.title}
        </p>
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Company</h4>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-350">{job.company}</p>
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location / Remote</h4>
        <p className={`text-xs font-semibold ${
          locationDiffers
            ? "text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 px-1 rounded"
            : "text-slate-600 dark:text-slate-400"
        }`}>
          {job.location} {job.remote && "(Remote)"}
        </p>
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Salary Range</h4>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {job.salaryMin !== null
            ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}`
            : job.salary || "Not Specified"}
        </p>
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Experience</h4>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {job.experience || "Not Specified"}
        </p>
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {job.skills.length > 0 ? (
            job.skills.map(s => {
              const inCanonical = !isDuplicate || (canonicalJob && canonicalJob.skillsNormalized?.includes(s.toLowerCase()));
              return (
                <span
                  key={s}
                  className={`px-2 py-0.5 text-[10px] rounded ${
                    !inCanonical 
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-450 border border-amber-200/20" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {s}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-slate-400">None Specified</span>
          )}
        </div>
      </div>

      <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-850">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Description Snippet</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-6">
          {job.description}
        </p>
      </div>
    </div>
  );
}

export default DuplicateCard;
