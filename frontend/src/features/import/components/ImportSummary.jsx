import { FiCheckCircle, FiCopy, FiAlertCircle } from "react-icons/fi";

function ImportSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 rounded-2xl shadow-sm space-y-6 animate-slideUp">
      <h3 className="font-bold text-slate-800 dark:text-white text-base">Import Summary</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Rows</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{summary.totalRows}</p>
        </div>
        {/* Success */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20 rounded-xl text-center">
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex justify-center items-center gap-1">
            <FiCheckCircle size={10} /> Imported
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.imported - summary.duplicatesFound}
          </p>
        </div>
        {/* Duplicates */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 rounded-xl text-center">
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex justify-center items-center gap-1">
            <FiCopy size={10} /> Duplicates
          </p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{summary.duplicatesFound}</p>
        </div>
        {/* Failed */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 rounded-xl text-center">
          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider flex justify-center items-center gap-1">
            <FiAlertCircle size={10} /> Failed
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{summary.failed}</p>
        </div>
      </div>

      {summary.failed > 0 && (
        <div className="flex gap-2.5 p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30 rounded-xl text-rose-700 dark:text-rose-450 text-xs">
          <FiAlertCircle size={16} className="shrink-0" />
          <p>
            {summary.failed} row(s) failed validation checks (missing Title/Company) and were safely skipped without interrupting the pipeline.
          </p>
        </div>
      )}
    </div>
  );
}

export default ImportSummary;
