import { FiCpu, FiAlertTriangle, FiCheckCircle, FiMinusCircle, FiList, FiChevronRight } from "react-icons/fi";
import Loader from "../../../shared/components/Loader.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";

function ResumeResult({ analysis, loading }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/25";
    if (score >= 50) return "text-amber-500 stroke-amber-500 bg-amber-500/10 border-amber-500/25";
    return "text-rose-500 stroke-rose-500 bg-rose-500/10 border-rose-500/25";
  };

  if (loading) {
    return (
      <div className="h-full min-h-[50vh] flex items-center justify-center">
        <Loader message="Analyzing Resume..." />
      </div>
    );
  }

  if (!analysis) {
    return (
      <EmptyState
        title="Awaiting AI Match Query"
        message="Upload a PDF resume and hit matching button on the left to activate the Resume Tailoring analysis pipeline."
        icon={
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-full w-fit mx-auto">
            <FiCpu size={32} />
          </div>
        }
      />
    );
  }

  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 rounded-2xl shadow-sm space-y-6 animate-slideUp">
      {/* Score and Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div className="text-center sm:text-left space-y-1">
          <h3 className="font-black text-xl text-slate-800 dark:text-white">Analysis Match Report</h3>
          <p className="text-xs text-slate-400 dark:text-slate-450">
            A comprehensive overview of keywords matching, strengths, gaps, and improvements.
          </p>
        </div>

        {/* Score Dial */}
        <div className={`flex flex-col items-center justify-center p-4 border rounded-2xl w-32 h-32 shrink-0 ${getScoreColor(analysis.matchScore)}`}>
          <span className="text-3xl font-black">{analysis.matchScore}%</span>
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1 text-slate-500 dark:text-slate-450">Match Score</span>
        </div>
      </div>

      {/* Missing Skills Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiAlertTriangle className="text-amber-500" />
          Missing Skills
        </h4>
        {analysis.missingSkills.length === 0 ? (
          <p className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
            <FiCheckCircle /> Excellent! All technical skills mentioned in the job description are present in the resume.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Strengths & Weaknesses side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-850">
        {/* Strengths */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" /> Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((str, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-405">
                <FiChevronRight className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiMinusCircle className="text-rose-500" /> Gaps & Concerns
          </h4>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-405">
                <FiChevronRight className="text-rose-500 shrink-0 mt-0.5" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-850">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiList className="text-indigo-500" /> Suggestions for Improvement
        </h4>
        <ol className="space-y-3">
          {analysis.suggestions.map((sug, idx) => (
            <li key={idx} className="flex gap-3 text-xs text-slate-600 dark:text-slate-405 leading-relaxed">
              <span className="w-5 h-5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{sug}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ResumeResult;
