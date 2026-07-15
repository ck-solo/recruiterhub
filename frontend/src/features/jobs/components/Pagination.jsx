import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ page, pages, handlePageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-between items-center pt-4">
      <button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition"
      >
        <FiChevronLeft /> Prev
      </button>

      <span className="text-xs text-slate-400 font-bold">
        Page {page} of {pages}
      </span>

      <button
        disabled={page === pages}
        onClick={() => handlePageChange(page + 1)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition"
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
