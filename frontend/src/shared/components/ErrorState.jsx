function ErrorState({ title = "Search Query Failed", message = "There was a problem carrying out the query.", onRetry }) {
  return (
    <div className="glass-card bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/50 p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
      <div>
        <p className="text-rose-700 dark:text-rose-400 font-semibold mb-2">{title}</p>
        <p className="text-rose-500 dark:text-rose-500 text-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-white dark:text-rose-200 text-xs font-semibold rounded-xl transition shadow-md shadow-rose-600/10"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
