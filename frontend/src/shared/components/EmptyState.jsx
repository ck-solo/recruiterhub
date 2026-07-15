function EmptyState({
  title = "No Results Found",
  message = "No matching records were found.",
  icon,
  actionLabel,
  onAction,
}) {
  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-12 rounded-2xl text-center">
      {icon && <div className="mx-auto w-fit mb-4">{icon}</div>}
      <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-1">{title}</p>
      {message && <p className="text-slate-400 text-xs max-w-sm mx-auto">{message}</p>}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
