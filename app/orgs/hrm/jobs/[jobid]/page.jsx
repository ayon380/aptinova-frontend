"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import useStore from "../../../../store";
import { RefreshCw, Loader } from "lucide-react";
//v0.31

export default function JobDetailsPage() {
  const router = useRouter();
  const { jobid } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const SearchParams = useSearchParams();
  const { getCache, setCache, setTitle } = useStore();

  const token = SearchParams.get("authToken");
  if (token) {
    localStorage.setItem("authToken", token);
  }
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isApplying, setIsApplying] = useState(false);

  const fetchJobDetails = async (skipCache = false) => {
    try {
      setIsLoading(true);

      // Create a cache key based on the job ID
      const cacheKey = `job-${jobid}`;

      // Check if we have cached data and skipCache is false
      if (!skipCache) {
        const cachedJob = getCache(cacheKey);
        if (cachedJob) {
          console.log("Using cached job data");
          setJob(cachedJob);
          setIsLoading(false);
          return;
        }
      }

      // If no cache or skipCache is true, fetch from API
      console.log("Fetching job data from API");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch job details");

      const jobData = await response.json();

      // Cache the fetched job data
      setCache(cacheKey, jobData);

      setJob(jobData);
    } catch (error) {
      console.error("Error fetching job:", error);
      alert("Failed to load job details");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to refresh job data from API
  const refreshJobDetails = () => {
    setIsRefreshing(true);
    fetchJobDetails(true); // Skip cache when refreshing
  };
  useEffect(() => {
    setTitle("Job Details");
    // Fetch job details when the component mounts or jobid changes
  }, []);
  useEffect(() => {
    fetchJobDetails();
  }, [jobid]);

  if (isLoading && !job)
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
        <div className="bg-md-surface-container p-4 sm:p-8 rounded-3xl shadow-sm flex items-center gap-3 sm:gap-4">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-md-primary"></div>
          <span className="text-sm sm:text-base text-md-on-surface-variant font-medium">
            Loading job details...
          </span>
        </div>
      </div>
    );

  // Parse hiring process steps if available
  const hiringProcess = job?.hiringProcess ? JSON.parse(job.hiringProcess) : [];

  return (
    <div className="container overflow-y-scroll  h-full mx-auto md:bg-md-surface-container w-full px-3 py-4 md:p-6 lg:p-10 md:py-8 rounded-tl-3xl">
      {/* Back Button and Refresh Button */}
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <button
          onClick={() => router.back()}
          className="text-md-primary hover:text-md-primary-hover flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-md-surface-variant transition-all duration-200 text-sm sm:text-base"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="currentColor"
            />
          </svg>
          Back to Jobs
        </button>

        <button
          onClick={refreshJobDetails}
          disabled={isRefreshing}
          className="text-md-primary hover:text-md-primary-hover flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-md-surface-variant transition-all duration-200 text-sm sm:text-base disabled:opacity-50"
          title="Refresh job data"
        >
          {isRefreshing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Header */}
      <div className="bg-md-surface rounded-2xl sm:rounded-3xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-md-outline-variant transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4 md:gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-md-on-surface mb-2">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm text-md-on-surface-variant mb-3 sm:mb-4">
              <span className="font-medium">{job.OrgName}</span>
              <span className="text-md-outline">•</span>
              <span>{job.location}</span>
              <span className="text-md-outline">•</span>
              <span>{job.jobType}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-md-primary-container text-md-on-primary-container rounded-full text-xs sm:text-sm">
                {job.employmentType}
              </span>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-md-secondary-container text-md-on-secondary-container rounded-full text-xs sm:text-sm">
                {job.status}
              </span>
              {job.visaSponsorshipAvailable && (
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-md-tertiary-container text-md-on-tertiary-container rounded-full text-xs sm:text-sm">
                  Visa Sponsorship
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-md-outline-variant mb-4 sm:mb-6">
        <nav className="flex gap-2 sm:gap-4 overflow-x-auto pb-1 scrollbar-none">
          {["overview", "requirements", "benefits", "hiring process"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab
                    ? "border-md-primary text-md-primary"
                    : "border-transparent text-md-on-surface-variant hover:text-md-on-surface hover:border-md-outline-variant"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-md-surface rounded-2xl sm:rounded-3xl shadow-sm p-3 sm:p-4 md:p-6 border border-md-outline-variant">
        {activeTab === "overview" && (
          <div className="prose max-w-none prose-md-primary prose-sm sm:prose-base">
            <div className="mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 bg-md-surface-container rounded-xl sm:rounded-2xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 text-md-on-surface">
                Salary
              </h3>
              <p className="text-md-on-surface-variant flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-md-tertiary-container text-md-on-tertiary-container rounded-full">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.99 8.18 9.5C8.18 11.29 9.67 12.19 11.84 12.71C13.79 13.17 14.18 13.86 14.18 14.58C14.18 15.11 13.79 15.97 12.08 15.97C10.48 15.97 9.85 15.25 9.76 14.33H8.04C8.14 15.93 9.4 16.96 10.9 17.26V19H13.24V17.3C14.76 17.02 15.98 16.13 15.98 14.56C15.98 12.36 14.07 11.6 12.31 11.14Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                {job.salaryCurrency} {job.salary.toLocaleString()} per year
              </p>
            </div>
            <div className="bg-md-surface-container text-md-on-surface p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl markdown-body text-sm sm:text-base">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="prose max-w-none prose-md-primary prose-sm sm:prose-base">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-md-on-surface flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-md-secondary-container text-md-on-secondary-container rounded-full">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 5.18L10.59 16.6L6.35 12.36L7.76 10.95L10.59 13.78L20.59 3.78L22 5.18ZM19.79 10.22C19.92 10.79 20 11.39 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C13.58 4 15.04 4.46 16.28 5.25L17.72 3.81C16.1 2.67 14.13 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 10.81 21.78 9.67 21.4 8.61L19.79 10.22Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Qualifications
            </h3>
            <div className="bg-md-surface-container p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl markdown-body text-sm sm:text-base">
              <ReactMarkdown>{job.qualifications}</ReactMarkdown>
            </div>
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-md-surface-variant rounded-xl sm:rounded-2xl">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 text-md-on-surface-variant text-sm sm:text-base">
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-md-primary-container text-md-on-primary-container rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>
                    Required Experience:{" "}
                    <span className="font-medium text-md-on-surface">
                      {job.experienceRequired}+ years
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-md-on-surface-variant text-sm sm:text-base">
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-md-tertiary-container text-md-on-tertiary-container rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>
                    Level:{" "}
                    <span className="font-medium text-md-on-surface">
                      {job.jobLevel}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="prose max-w-none prose-md-primary prose-sm sm:prose-base">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-md-on-surface flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-md-tertiary-container text-md-on-tertiary-container rounded-full">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6H17.82C17.93 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C13.95 2 13.04 2.54 12.5 3.35L12 4L11.5 3.34C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5C6 5.35 6.07 5.69 6.18 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM15 4C15.55 4 16 4.45 16 5C16 5.55 15.55 6 15 6C14.45 6 14 5.55 14 5C14 4.45 14.45 4 15 4ZM9 4C9.55 4 10 4.45 10 5C10 5.55 9.55 6 9 6C8.45 6 8 5.55 8 5C8 4.45 8.45 4 9 4ZM20 19H4V17H20V19ZM20 14H4V8H9.08L7 10.83L8.62 12L11 8.76L12 7.4L13 8.76L15.38 12L17 10.83L14.92 8H20V14Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Benefits & Perks
            </h3>
            <div className="bg-md-surface-container p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl markdown-body text-sm sm:text-base">
              <ReactMarkdown>{job.benefits}</ReactMarkdown>
            </div>
          </div>
        )}

        {activeTab === "hiring process" && (
          <div className="prose max-w-none prose-md-primary prose-sm sm:prose-base">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-md-on-surface flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-md-primary-container text-md-on-primary-container rounded-full">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Hiring Process Timeline
            </h3>

            <div className="max-h-[50vh] md:max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {hiringProcess.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-md-outline-variant"></div>
                  {hiringProcess.map((step, index) => (
                    <div
                      key={index}
                      className="relative pl-8 sm:pl-10 md:pl-12 pb-4 sm:pb-6 md:pb-8 last:pb-0"
                    >
                      <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10">
                        {step.type === "Shortlist" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-md-tertiary-container text-md-on-tertiary-container flex items-center justify-center">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 10H2V12H14V10ZM14 6H2V8H14V6ZM2 16H10V14H2V16ZM21.5 11.5L23 13L16 20L11.5 15.5L13 14L16 17L21.5 11.5Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                        {step.type === "Test" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V5H20V19ZM18 15H6V17H18V15ZM12 7H6V13H12V7ZM10 11H8V9H10V11ZM18 11H14V13H18V11ZM18 7H14V9H18V7Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                        {step.type === "Interview" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-md-primary-container text-md-on-primary-container flex items-center justify-center">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.5 6.5H13V10H16.5V6.5ZM17.5 10H21V6.5H17.5V10ZM13 11H21V17.5H13V11ZM11 17.5H3V11H11V17.5ZM11 10H7.5V6.5H11V10ZM6.5 10H3V6.5H6.5V10Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                        {step.type === "Onboard" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-md-success-container text-md-on-success-container flex items-center justify-center">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 6C1 6 1 18 1 18C1 18 5 12 15 12V16L21 9L15 2V6Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="bg-md-surface-container rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                          <h4 className="text-sm sm:text-base md:text-lg font-medium text-md-on-surface m-0">
                            {step.name}
                          </h4>
                          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-md-surface-variant text-md-on-surface-variant rounded-full text-xs">
                            {step.type}
                          </span>
                        </div>

                        {step.description && (
                          <p className="text-md-on-surface-variant mb-3 sm:mb-4 text-xs sm:text-sm">
                            {step.description}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row flex-wrap gap-1.5 sm:gap-2 text-xs">
                          <div className="flex items-center gap-1 text-md-on-surface-variant">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3.01 3.9 3.01 5L3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM19 7H5V5H19V7ZM12 11H7V16H12V11Z"
                                fill="currentColor"
                              />
                            </svg>
                            <span>
                              Planned:{" "}
                              {new Date(step.plannedDate).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          {step.completedDate && (
                            <div className="flex items-center gap-1 text-md-success">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                                  fill="currentColor"
                                />
                              </svg>
                              <span>
                                Completed:{" "}
                                {new Date(
                                  step.completedDate
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-md-surface-container rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-md-on-surface-variant text-sm sm:text-base">
                  No hiring process details available for this position.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-md-surface-variant rounded-xl sm:rounded-2xl text-md-on-surface-variant flex flex-col sm:flex-row sm:flex-wrap sm:justify-between items-start sm:items-center gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"
              fill="currentColor"
            />
          </svg>
          <span>
            Posted:{" "}
            {new Date(job.postedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {job.deadline && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 17V19H6V17H18ZM7 14H5V12H7V14ZM7 10H5V8H7V10ZM7 6H5V4H7V6ZM11 14H9V12H11V14ZM11 10H9V8H11V10ZM11 6H9V4H11V6ZM15 14H13V12H15V14ZM15 10H13V8H15V10ZM15 6H13V4H15V6ZM19 14H17V12H19V14ZM19 10H17V8H19V10ZM19 6H17V4H19V6Z"
                fill="currentColor"
              />
            </svg>
            <span>
              Deadline:{" "}
              {new Date(job.deadline).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Add cache status indicator */}
        <div className="text-xs opacity-70 ml-auto">
          {isRefreshing
            ? "Updating..."
            : "Last updated: " + new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Add style for horizontal scrollbars */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .markdown-body {
          word-break: break-word;
        }
        @media (max-width: 640px) {
          .markdown-body pre {
            max-width: calc(100vw - 3rem);
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
