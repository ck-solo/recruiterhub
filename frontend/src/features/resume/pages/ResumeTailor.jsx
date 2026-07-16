import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetJobsQuery } from "../../jobs/api/jobs.api.js";
import { useAnalyzeResumeMutation } from "../api/resume.api.js";
import { toast } from "react-hot-toast";
import ResumeUploader from "../components/ResumeUploader.jsx";
import ResumeResult from "../components/ResumeResult.jsx";
import PageHeader from "../../../shared/components/PageHeader.jsx";

function ResumeTailor() {
  const [searchParams] = useSearchParams();
  const queryJobId = searchParams.get("jobId") || "";

  // Form states
  const [selectedJobId, setSelectedJobId] = useState(queryJobId);
  const [resumeFile, setResumeFile] = useState(null);
  const [tailorResult, setTailorResult] = useState(null);

  // Fetch jobs for dropdown selection
  const { data: jobsResponse, isLoading: jobsLoading } = useGetJobsQuery({ isDuplicate: false, limit: 100 });
  const [analyzeResume, { isLoading: isTailoring }] = useAnalyzeResumeMutation();

  const jobsList = jobsResponse?.data?.jobs || [];

  // Update selectedJobId if URL parameter changes
  useEffect(() => {
    if (queryJobId) {
      setSelectedJobId(queryJobId);
    }
  }, [queryJobId]);

  // Reset selected job and tailor result if the selected job is no longer available (e.g. deleted)
  useEffect(() => {
    if (!jobsLoading && selectedJobId) {
      const jobStillExists = jobsList.some((job) => job._id === selectedJobId);
      if (!jobStillExists) {
        setSelectedJobId("");
        setTailorResult(null);
      }
    }
  }, [jobsList, jobsLoading, selectedJobId]);

  useEffect(() => {
    if (!isTailoring) return;

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
  }, [isTailoring]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobId) {
      toast.error("Please select a target job posting.");
      return;
    }
    if (!resumeFile) {
      toast.error("Please upload a PDF resume to analyze.");
      return;
    }

    try {
      const body = new FormData();
      body.append("jobId", selectedJobId);
      body.append("resume", resumeFile);

      const response = await analyzeResume(body).unwrap();
      
      toast.success("Resume matched successfully!");
      setTailorResult(response.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "AI Tailoring failed. Please check backend log details.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="AI Resume Tailoring Agent"
        subtitle="Select a unique job listing and upload a PDF resume to evaluate skills fitment and get optimization suggestions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <ResumeUploader
          file={resumeFile}
          onFileChange={setResumeFile}
          onAnalyze={handleSubmit}
          loading={isTailoring}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          jobsList={jobsList}
          jobsLoading={jobsLoading}
        />

        {/* Output/Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          <ResumeResult
            analysis={tailorResult}
            loading={isTailoring}
          />
        </div>
      </div>
    </div>
  );
}

export default ResumeTailor;
