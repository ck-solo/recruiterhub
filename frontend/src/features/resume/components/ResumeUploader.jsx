import { FiCpu, FiEdit2, FiUploadCloud, FiFileText, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

function ResumeUploader({
  file,
  onFileChange,
  onAnalyze,
  loading,
  selectedJobId,
  setSelectedJobId,
  jobsList = [],
  jobsLoading = false,
}) {
  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm h-fit">
      <h3 className="font-bold text-slate-800 dark:text-white text-base mb-4 flex items-center gap-2">
        <FiEdit2 className="text-indigo-500" /> Input Parameters
      </h3>

      <form onSubmit={onAnalyze} className="space-y-5">
        {/* Job Selection */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Target Job Post</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            disabled={jobsLoading}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:opacity-50"
          >
            <option value="">-- Select a Job listing --</option>
            {jobsList.map((job) => (
              <option key={job._id} value={job._id}>
                {job.company} &bull; {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Resume PDF Upload */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Upload Resume (PDF/XML)
          </label>
          {!file ? (
            <div
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-950/20"
              onClick={() => document.getElementById("resume-file-input").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const isPdf = droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf");
                  const isXml = droppedFile.type === "application/xml" || droppedFile.type === "text/xml" || droppedFile.name.endsWith(".xml");
                  if (isPdf || isXml) {
                    onFileChange(droppedFile);
                  } else {
                    toast.error("Only PDF and XML files are supported.");
                  }
                }
              }}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.xml"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");
                    const isXml = selectedFile.type === "application/xml" || selectedFile.type === "text/xml" || selectedFile.name.endsWith(".xml");
                    if (isPdf || isXml) {
                      onFileChange(selectedFile);
                    } else {
                      toast.error("Only PDF and XML files are supported.");
                    }
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <FiUploadCloud className="text-slate-400 w-8 h-8" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Drag & drop PDF/XML here, or <span className="text-indigo-500">browse</span>
                </span>
                <span className="text-[10px] text-slate-400">Max size 5MB</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center space-x-2.5 overflow-hidden w-[80%]">
                <FiFileText className="text-indigo-500 w-5 h-5 shrink-0" />
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-rose-500 rounded-lg transition"
                title="Remove file"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tailor Button */}
        <button
          type="submit"
          disabled={loading || !selectedJobId || !file}
          className="w-full flex justify-center items-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md shadow-indigo-600/10"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Analyzing Skills Alignments...
            </>
          ) : (
            <>
              <FiCpu /> Analyze & Tailor Resume
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ResumeUploader;
