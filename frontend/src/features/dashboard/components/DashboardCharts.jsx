import { FiActivity, FiBriefcase, FiCompass, FiDollarSign, FiTrendingUp } from "react-icons/fi";

function DashboardCharts({
  employmentTypeDistribution = {},
  topCompanies = [],
  skillsFreq = [],
  salaryRanges = [],
}) {
  // 1. Employment Type Calculations
  const empTypes = Object.entries(employmentTypeDistribution);
  const totalEmpJobs = empTypes.reduce((sum, [_, count]) => sum + count, 0);
  const sortedEmpTypes = empTypes.sort((a, b) => b[1] - a[1]);

  // 2. Top Companies Calculations
  const maxCompanyJobs = topCompanies.length > 0 ? Math.max(...topCompanies.map((c) => c.count)) : 1;

  // 3. Top Skills Calculations
  const maxSkillCount = skillsFreq.length > 0 ? Math.max(...skillsFreq.map((s) => s.count)) : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Employment Type Distribution */}
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <FiBriefcase className="text-emerald-500" size={18} />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Employment Types</h3>
        </div>
        
        {sortedEmpTypes.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No employment type data available</p>
        ) : (
          <div className="space-y-3 pt-2">
            {sortedEmpTypes.map(([type, count]) => {
              const percentage = totalEmpJobs > 0 ? Math.round((count / totalEmpJobs) * 100) : 0;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-350">{type || "Unknown"}</span>
                    <span className="text-slate-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Hiring Companies */}
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <FiTrendingUp className="text-emerald-500" size={18} />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Top Hiring Companies</h3>
        </div>

        {topCompanies.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No company hiring data available</p>
        ) : (
          <div className="space-y-3 pt-2">
            {topCompanies.slice(0, 5).map((company) => {
              const percentage = Math.round((company.count / maxCompanyJobs) * 100);
              return (
                <div key={company.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-350">{company.name}</span>
                    <span className="text-slate-400">{company.count} jobs</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Skills */}
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <FiActivity className="text-amber-500" size={18} />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Trending Skills</h3>
        </div>

        {skillsFreq.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No skill frequency data available</p>
        ) : (
          <div className="space-y-3 pt-2">
            {skillsFreq.slice(0, 5).map((skill) => {
              const percentage = Math.round((skill.count / maxSkillCount) * 100);
              return (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-350 capitalize">{skill.name}</span>
                    <span className="text-slate-400">{skill.count} matches</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {/* Cloud tags for remaining skills */}
            {skillsFreq.length > 5 && (
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100/50 dark:border-slate-800/40">
                {skillsFreq.slice(5, 12).map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-800/60 capitalize"
                  >
                    {skill.name} ({skill.count})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Salary Distribution */}
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <FiDollarSign className="text-rose-500" size={18} />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Salary Insight Overview</h3>
        </div>

        {salaryRanges.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No salary statistics data available</p>
        ) : (
          <div className="space-y-4 pt-2 overflow-y-auto max-h-[220px]">
            {salaryRanges.map((range) => (
              <div
                key={range._id}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-2"
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded">
                    Currency: {range._id || "Not Specified"}
                  </span>
                  <span className="text-slate-400">{range.count} Jobs listed</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
                      Avg Min Salary
                    </span>
                    <span className="font-black text-slate-800 dark:text-white">
                      {Math.round(range.avgMinSalary).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
                      Avg Max Salary
                    </span>
                    <span className="font-black text-slate-800 dark:text-white">
                      {Math.round(range.avgMaxSalary).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Range graphic */}
                <div className="pt-1.5 space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 relative">
                    <div className="bg-emerald-500 h-full rounded-full absolute left-1/4 right-1/4"></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>Min: {range.minSalary?.toLocaleString()}</span>
                    <span>Max: {range.maxSalary?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCharts;
