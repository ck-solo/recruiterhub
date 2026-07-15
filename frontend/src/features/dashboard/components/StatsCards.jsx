import { FiBriefcase, FiCopy, FiGlobe, FiMapPin, FiGrid } from "react-icons/fi";

function StatsCards({ stats, isLoading }) {
  const cardData = [
    {
      label: "Total Jobs",
      value: stats?.totalJobs,
      icon: <FiBriefcase className="text-indigo-500" size={20} />,
      colorClass: "border-indigo-200 dark:border-indigo-950/40 bg-indigo-500/[0.01]",
    },
    {
      label: "Total Companies",
      value: stats?.totalCompanies,
      icon: <FiGrid className="text-emerald-500" size={20} />,
      colorClass: "border-emerald-200 dark:border-emerald-950/40 bg-emerald-500/[0.01]",
    },
    {
      label: "Duplicate Jobs",
      value: stats?.duplicateJobs,
      icon: <FiCopy className="text-amber-500" size={20} />,
      colorClass: "border-amber-200 dark:border-amber-950/40 bg-amber-500/[0.01]",
    },
    {
      label: "Remote Jobs",
      value: stats?.remoteJobs,
      icon: <FiGlobe className="text-sky-500" size={20} />,
      colorClass: "border-sky-200 dark:border-sky-950/40 bg-sky-500/[0.01]",
    },
    {
      label: "Unique Locations",
      value: stats?.totalLocations,
      icon: <FiMapPin className="text-rose-500" size={20} />,
      colorClass: "border-rose-200 dark:border-rose-950/40 bg-rose-500/[0.01]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className={`glass-card p-5 bg-white dark:bg-slate-900 border rounded-2xl transition hover:shadow-md ${card.colorClass}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {card.label}
            </span>
            {card.icon}
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-8 w-24 rounded-lg"></div>
            ) : (
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {card.value !== undefined && card.value !== null ? card.value.toLocaleString() : "--"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
