import { FiUploadCloud, FiFile, FiSlash } from "react-icons/fi";
import { toast } from "react-hot-toast";

function UploadZone({ file, onFileChange, onSubmit, loading }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (
        droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.name.endsWith(".xlsx")
      ) {
        onFileChange(droppedFile);
      } else {
        toast.error("Please upload a valid Excel (.xlsx) file.");
      }
    }
  };

  return (
    <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 rounded-2xl shadow-sm">
      <h3 className="font-bold text-slate-800 dark:text-white text-base mb-4">Select Spreadsheet</h3>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Drag and Drop Zone */}
        <div
          tabIndex={0}
          role="button"
          aria-label="Upload Excel dataset"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("file-input").click();
            }
          }}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl p-8 md:p-12 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-950/20 group outline-none"
          onClick={() => document.getElementById("file-input").click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                if (
                  selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                  selectedFile.name.endsWith(".xlsx")
                ) {
                  onFileChange(selectedFile);
                } else {
                  toast.error("Please upload a valid Excel (.xlsx) file.");
                }
              }
            }}
          />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full group-hover:scale-110 transition-transform">
              <FiUploadCloud size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Drag & drop your Excel file here, or <span className="text-emerald-600 dark:text-emerald-400">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Accepts only standard Excel files (.xlsx) up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Selected File Details */}
        {file && (
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <FiFile size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <FiSlash size={16} />
            </button>
          </div>
        )}

        {/* Upload Action Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full flex justify-center items-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md shadow-emerald-600/10"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Analyzing & Normalizing Rows...
            </>
          ) : (
            "Process Dataset"
          )}
        </button>
      </form>
    </div>
  );
}

export default UploadZone;
