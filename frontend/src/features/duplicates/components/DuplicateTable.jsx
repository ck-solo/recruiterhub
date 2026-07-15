function DuplicateTable({ duplicateGroups, selectedGroupId, onSelectGroup }) {
  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-slate-100 dark:border-slate-850">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">
          Duplicate Groups ({duplicateGroups.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
        {duplicateGroups.map((group) => {
          const isSelected = group._id === selectedGroupId;
          return (
            <button
              key={group._id}
              onClick={() => onSelectGroup(group._id)}
              className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors flex justify-between items-start gap-2 ${
                isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-800 dark:text-white truncate">
                  {group.canonical.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{group.canonical.company}</p>
                <p className="text-[10px] text-slate-400 mt-1">{group.canonical.location}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/30 text-amber-600 dark:text-amber-400 rounded">
                {group.duplicates.length} Matches
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DuplicateTable;
