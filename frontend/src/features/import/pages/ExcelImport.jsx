import { useState } from "react";
import { useImportJobsMutation } from "../api/import.api.js";
import { toast } from "react-hot-toast";
import UploadZone from "../components/UploadZone.jsx";
import ImportSummary from "../components/ImportSummary.jsx";
import PageHeader from "../../../shared/components/PageHeader.jsx";

function ExcelImport() {
  const [file, setFile] = useState(null);
  const [importJobs, { isLoading }] = useImportJobsMutation();
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await importJobs(formData).unwrap();
      toast.success(response.message || "Excel sheet imported successfully!");
      setSummary(response.data);
      setFile(null); // reset file state
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Import failed. Please verify your file format.");
    }
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
                <span className="font-bold text-indigo-500 font-mono">Title</span> 
                <span className="text-[11px] text-slate-400"> (Required: title, jobTitle, Title)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">Company</span> 
                <span className="text-[11px] text-slate-400"> (Required: company, companyName, Company)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">Location</span> 
                <span className="text-[11px] text-slate-400"> (e.g. Remote, City - extracts remote status)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">Description</span> 
                <span className="text-[11px] text-slate-400"> (Supports raw text, used in similarity scores)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">Salary</span> 
                <span className="text-[11px] text-slate-400"> (e.g. $80K - $120K, £60,000, 1500000 INR)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">Experience</span> 
                <span className="text-[11px] text-slate-400"> (e.g. 3+ years, 5-8 yrs, Entry level)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">Skills</span> 
                <span className="text-[11px] text-slate-400"> (Comma-separated list e.g. React, Node, SQL)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-500 font-mono">PostedDate</span> 
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
