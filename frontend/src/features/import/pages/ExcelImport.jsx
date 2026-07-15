import { useState, useEffect } from "react";
import { useImportJobsMutation } from "../api/import.api.js";
import { toast } from "react-hot-toast";
import { FiDatabase, FiTrash2 } from "react-icons/fi";
import UploadZone from "../components/UploadZone.jsx";
import ImportSummary from "../components/ImportSummary.jsx";
import PageHeader from "../../../shared/components/PageHeader.jsx";

function ExcelImport() {
  const [file, setFile] = useState(null);
  const [importJobs, { isLoading }] = useImportJobsMutation();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("import_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!isLoading) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      const msg = "Current work will stop and you will have to do it again. Are you sure you want to refresh?";
      e.returnValue = msg;
      return msg;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await importJobs(formData).unwrap();
      toast.success(response.message || "Excel sheet imported successfully!");
      setSummary(response.data);
      
      const newRecord = {
        id: Date.now().toString(),
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
        summary: response.data
      };
      
      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("import_history", JSON.stringify(updatedHistory));
      
      setFile(null); // reset file state
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Import failed. Please verify your file format.");
    }
  };

  const handleDeleteHistory = (recordId) => {
    const updatedHistory = history.filter(item => item.id !== recordId);
    setHistory(updatedHistory);
    localStorage.setItem("import_history", JSON.stringify(updatedHistory));
    toast.success("Import history record deleted.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Import Job Dataset"
        subtitle="Upload Excel sheets (.xlsx) to bulk-populate the platform with job postings and identify duplicates."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form & Results */}
        <div className="lg:col-span-2 space-y-6">
          <UploadZone
            file={file}
            onFileChange={(f) => {
              setFile(f);
              setSummary(null); // clear old summary when file changes
            }}
            onSubmit={handleSubmit}
            loading={isLoading}
          />

          <ImportSummary summary={summary} />

          {/* Import History */}
          {history.length > 0 && (
            <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Import History</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {history.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-start space-x-3 overflow-hidden">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                        <FiDatabase size={20} />
                      </div>
                      <div className="text-left overflow-hidden min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {item.fileName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.timestamp}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">
                            Imported: {item.summary?.imported || 0}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded">
                            Duplicates: {item.summary?.duplicatesFound || 0}
                          </span>
                          {item.summary?.failed > 0 && (
                            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded">
                              Failed: {item.summary?.failed || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(item.id)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 rounded-xl transition shrink-0"
                      title="Delete from history"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info - Schema Guidelines */}
        <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl h-fit space-y-5">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Schema Guidelines</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The platform accepts spreadsheets containing headers related to job posts. It normalizes data formats automatically.
          </p>

          <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Recognized Column Headers</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Title</span> 
                <span className="text-[11px] text-slate-400"> (Required: title, jobTitle, Title)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Company</span> 
                <span className="text-[11px] text-slate-400"> (Required: company, companyName, Company)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Location</span> 
                <span className="text-[11px] text-slate-400"> (e.g. Remote, City - extracts remote status)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Description</span> 
                <span className="text-[11px] text-slate-400"> (Supports raw text, used in similarity scores)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Salary</span> 
                <span className="text-[11px] text-slate-400"> (e.g. $80K - $120K, £60,000, 1500000 INR)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Experience</span> 
                <span className="text-[11px] text-slate-400"> (e.g. 3+ years, 5-8 yrs, Entry level)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">Skills</span> 
                <span className="text-[11px] text-slate-400"> (Comma-separated list e.g. React, Node, SQL)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500 font-mono">PostedDate</span> 
                <span className="text-[11px] text-slate-400"> (Date format or "3 days ago")</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelImport;
