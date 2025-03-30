"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function JobDetailsPage() {
  const router = useRouter();
  const { jobid } = useParams();
  const [job, setJob] = useState(null);
  const SearchParams = useSearchParams();
  const token = SearchParams.get("authToken");
  if (token) {
    localStorage.setItem("authToken", token);
  }
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming token is stored in localStorage
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch job details");
        const jobData = await response.json();
        setJob(jobData);
      } catch (error) {
        console.error("Error fetching job:", error);
        alert("Failed to load job details");
      }
    };

    fetchJobDetails();
  }, [jobid]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobid}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            // Add any additional application data here
            appliedAt: new Date().toISOString(),
          }),
        }
      );
      if (!response.ok) throw new Error("Application failed");
      const result = await response.json();
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    }
    setIsApplying(false);
  };

  if (!job) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        ← Back to Jobs
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span>{job.OrgName}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.jobType}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {job.employmentType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {job.status}
              </span>
              {job.visaSponsorshipAvailable && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Visa Sponsorship
                </span>
              )}
            </div>
          </div>
          {token && (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
              transition-colors ${
                isApplying ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isApplying ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {["overview", "requirements", "benefits"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors
                ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === "overview" && (
          <div className="prose max-w-none">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Salary</h3>
              <p className="text-gray-700">
                {job.salaryCurrency} {job.salary.toLocaleString()} per year
              </p>
            </div>
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Qualifications</h3>
            <ReactMarkdown>{job.qualifications}</ReactMarkdown>
            <div className="mt-4">
              <p className="text-gray-700">
                Required Experience: {job.experienceRequired}+ years
              </p>
              <p className="text-gray-700">Level: {job.jobLevel}</p>
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Benefits & Perks</h3>
            <ReactMarkdown>{job.benefits}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-500">
        Posted: {new Date(job.postedAt).toLocaleDateString()}
        {job.deadline && (
          <span>
            {" "}
            • Deadline: {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
