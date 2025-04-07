"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const { applicationid } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicationid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch application details");
        const applicationData = await response.json();
        setApplication(applicationData);
      } catch (error) {
        console.error("Error fetching application:", error);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationid]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="bg-md-surface-container p-8 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-md-primary"></div>
          <span className="text-md-on-surface-variant font-medium">
            Loading application details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="bg-md-error-container p-8 rounded-3xl shadow-sm flex items-center gap-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-md-on-error-container"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-md-on-error-container font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="bg-md-surface-container p-8 rounded-3xl shadow-sm">
          <span className="text-md-on-surface-variant font-medium">
            Application not found
          </span>
        </div>
      </div>
    );
  }

  const job = application.Job;
  const hiringProcess = application.hiringProcess
    ? JSON.parse(application.hiringProcess)
    : [];

  // Get the current status step
  const getCurrentStep = () => {
    if (!hiringProcess.length) return null;
    
    // Find the latest step without a completedDate
    const currentSteps = hiringProcess.filter(step => !step.completedDate);
    return currentSteps.length ? currentSteps[0] : hiringProcess[hiringProcess.length - 1];
  };

  const currentStep = getCurrentStep();

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-md-primary-container text-md-on-primary-container";
      case "In Progress":
        return "bg-md-secondary-container text-md-on-secondary-container";
      case "Assessment":
        return "bg-md-tertiary-container text-md-on-tertiary-container";
      case "Completed":
        return "bg-md-success-container text-md-on-success-container";
      case "Accepted":
        return "bg-md-success-container text-md-on-success-container";
      case "Rejected":
        return "bg-md-error-container text-md-on-error-container";
      default:
        return "bg-md-surface-variant text-md-on-surface-variant";
    }
  };

  return (
    <div className="md:bg-md-surface-container h-full rounded-tl-3xl w-full px-4 md:p-10 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-md-primary hover:text-md-primary-hover flex items-center gap-2 rounded-full px-4 py-2 hover:bg-md-surface-variant transition-all duration-200"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
            fill="currentColor"
          />
        </svg>
        Back to Applications
      </button>

      {/* Application Header */}
      <div className="bg-md-surface rounded-3xl shadow-sm p-6 mb-6 border border-md-outline-variant transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold text-md-on-surface mb-2">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-md-on-surface-variant mb-4">
              <span className="font-medium">{job.OrgName}</span>
              <span className="text-md-outline">•</span>
              <span>{job.location}</span>
              <span className="text-md-outline">•</span>
              <span>{job.jobType}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-md-primary-container text-md-on-primary-container rounded-full text-sm">
                {job.employmentType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
          </div>

          <Link
            href={`/candidate/jobs/${job.id}`}
            className="px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container
              transition-all duration-200 shadow-sm hover:shadow"
          >
            View Job
          </Link>
        </div>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Application Timeline */}
        <div className="md:col-span-2 bg-md-surface rounded-3xl shadow-sm p-6 border border-md-outline-variant">
          <h2 className="text-xl font-semibold mb-4 text-md-on-surface flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-md-primary-container text-md-on-primary-container rounded-full">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM5 7V5H19V7H5ZM7 11H12V16H7V11Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Application Timeline
          </h2>

          {hiringProcess.length > 0 ? (
            <div className="relative max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-md-outline-variant"></div>
              {hiringProcess.map((step, index) => (
                <div key={index} className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10">
                    {step.type === "Shortlist" && (
                      <div className="w-8 h-8 rounded-full bg-md-tertiary-container text-md-on-tertiary-container flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
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
                      <div className="w-8 h-8 rounded-full bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
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
                      <div className="w-8 h-8 rounded-full bg-md-primary-container text-md-on-primary-container flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
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
                      <div className="w-8 h-8 rounded-full bg-md-success-container text-md-on-success-container flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
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

                  <div className={`rounded-2xl p-4 ${
                    currentStep && step.name === currentStep.name 
                      ? "bg-md-secondary-container" 
                      : "bg-md-surface-container"
                  }`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-lg font-medium text-md-on-surface m-0">
                        {step.name}
                      </h4>
                      <span className="px-3 py-1 bg-md-surface-variant text-md-on-surface-variant rounded-full text-xs">
                        {step.type}
                      </span>
                      {step.status && (
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(step.status)}`}>
                          {step.status}
                        </span>
                      )}
                    </div>

                    {step.description && (
                      <p className="text-md-on-surface-variant mb-2">
                        {step.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-md-on-surface-variant">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM19 7H5V5H19V7ZM12 11H7V16H12V11Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>
                          {step.plannedDate && `Planned: ${new Date(step.plannedDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`}
                        </span>
                      </div>
                      
                      {step.completedDate && (
                        <div className="flex items-center gap-1 text-md-success">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span>
                            Completed: {new Date(step.completedDate).toLocaleDateString(undefined, {
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
            <div className="bg-md-surface-container rounded-2xl p-6 text-center text-md-on-surface-variant">
              No hiring process details available for this application.
            </div>
          )}
        </div>

        {/* Application Status Card */}
        <div className="bg-md-surface rounded-3xl shadow-sm p-6 border border-md-outline-variant">
          <h2 className="text-xl font-semibold mb-4 text-md-on-surface flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-md-tertiary-container text-md-on-tertiary-container rounded-full">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4.58 16.59L4 17.17V4H20V16ZM11 12H13V14H11V12ZM11 6H13V10H11V6Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Application Status
          </h2>

          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-2xl ${getStatusColor(application.status)}`}>
              <p className="font-medium">Current Status</p>
              <h3 className="text-2xl font-bold">{application.status}</h3>
            </div>

            <div className="p-4 bg-md-surface-container rounded-2xl">
              <p className="font-medium text-md-on-surface">Application Details</p>
              <div className="mt-3 space-y-3">
                <div className="flex justify-between items-center text-md-on-surface-variant">
                  <span>Applied on</span>
                  <span className="font-medium text-md-on-surface">
                    {new Date(application.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                
                {application.startTime && (
                  <div className="flex justify-between items-center text-md-on-surface-variant">
                    <span>Process started</span>
                    <span className="font-medium text-md-on-surface">
                      {new Date(application.startTime).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                
                {currentStep && (
                  <div className="flex justify-between items-center text-md-on-surface-variant">
                    <span>Current stage</span>
                    <span className="font-medium text-md-on-surface">
                      {currentStep.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/candidate/jobs/${job.id}`}
              className="mt-2 w-full px-6 py-3 bg-md-surface-variant text-md-on-surface-variant rounded-full hover:bg-md-secondary-container hover:text-md-on-secondary-container
                transition-all duration-200 text-center"
            >
              View Job Details
            </Link>
          </div>
        </div>
      </div>

      {/* Job Description Preview */}
      <div className="bg-md-surface rounded-3xl shadow-sm p-6 border border-md-outline-variant">
        <h2 className="text-xl font-semibold mb-4 text-md-on-surface flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-md-secondary-container text-md-on-secondary-container rounded-full">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM9 13V19H7V13H9ZM15 15V19H17V15H15ZM11 11V19H13V11H11Z"
                fill="currentColor"
              />
            </svg>
          </span>
          Job Summary
        </h2>

        <div className="bg-md-surface-container p-6 rounded-2xl markdown-body max-h-[30vh] overflow-y-auto custom-scrollbar">
          <ReactMarkdown>
            {job.description.length > 500 
              ? job.description.substring(0, 500) + "..." 
              : job.description}
          </ReactMarkdown>
          
          <Link
            href={`/candidate/jobs/${job.id}`}
            className="mt-4 inline-block px-4 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container
              transition-all duration-200 text-sm"
          >
            Read Full Description
          </Link>
        </div>
      </div>
    </div>
  );
}
