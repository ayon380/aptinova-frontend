"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    // Fetch jobs from API
    // Placeholder data
    const fetchData = async () => {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const jobs = await data.json();
      setJobs(jobs);
    };
    fetchData();
  }, []);

  const handleMenuOpen = (jobId) => {
    setSelectedJobId(jobId);
    setShowMenu(!showMenu);
  };

  const handleViewJob = (jobId) => {
    router.push(`/orgs/jobs/${jobId}`);
    setShowMenu(false);
  };

  const handleCreateJob = () => {
    router.push("/orgs/hrm/jobs/create");
  };

  const viewjobapplicants = (jobId) => {
    router.push(`/orgs/jobs/${jobId}/applicants`);
  };

  const filteredJobs = (Array.isArray(jobs) ? jobs : []).filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-md-primary-container text-md-on-primary-container";
      case "Draft":
        return "bg-md-secondary-container text-md-on-secondary-container";
      case "Closed":
        return "bg-md-error-container text-md-on-error-container";
      default:
        return "bg-md-surface-variant text-md-on-surface-variant";
    }
  };

  return (
    <div className=" mx-auto w-full h-full px-4 py-8 md:pt-5 md:rounded-tl-3xl md:bg-md-surface-container ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-md-on-surface">Job Listings</h1>
        <motion.button
          onClick={handleCreateJob}
          className="bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-200"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-xl">+</span>
          Create Job
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 border border-md-outline rounded-full focus:ring-2 focus:ring-md-primary focus:border-transparent bg-md-surface-container text-md-on-surface placeholder-md-on-surface-variant"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-md-on-surface-variant">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <button className="px-5 py-2.5 text-md-on-surface-variant hover:bg-md-surface-variant rounded-full flex items-center gap-2 transition-colors duration-200">
          <span>Filter</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      <div className="bg-md-surface rounded-3xl shadow-sm overflow-hidden border border-md-outline">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-md-outline">
            <thead className="bg-md-secondary-container">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-md-on-surface-variant tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-md-on-surface-variant tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-md-on-surface-variant tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-md-on-surface-variant tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-md-on-surface-variant tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-md-on-surface-variant tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-md-secondary-container text-md-on-secondary-container divide-y divide-md-outline">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-md-on-surface-variant"
                  >
                    No jobs found. Try a different search term or create a new
                    job.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <motion.tr
                    key={job.id}
                    className="hover:bg-md-surface-container transition-colors duration-150"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/orgs/jobs/${job.id}`}
                        className="text-md-primary hover:text-md-primary-container font-medium"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-md-on-surface">
                      {job.department}
                    </td>
                    <td className="px-6 py-4 text-md-on-surface">
                      {job.location}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewjobapplicants(job.id)}
                        className="text-md-primary hover:text-md-primary-container transition-colors duration-200"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleMenuOpen(job.id)}
                        className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-variant transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showMenu && selectedJobId && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          ></div>
          <motion.div
            className="absolute right-4 mt-2 w-48 rounded-3xl shadow-lg bg-md-surface ring-1 ring-md-outline z-50 overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-1" role="menu">
              <button
                onClick={() => handleViewJob(selectedJobId)}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant transition-colors duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-md-on-surface-variant"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant transition-colors duration-150"
                onClick={() => setShowMenu(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-md-on-surface-variant"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant transition-colors duration-150"
                onClick={() => setShowMenu(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-md-on-surface-variant"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Duplicate
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-3 text-sm text-md-error hover:bg-md-error-container hover:text-md-on-error-container transition-colors duration-150"
                onClick={() => setShowMenu(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Archive
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Empty state - show when no jobs */}
      {jobs.length === 0 && !filteredJobs.length && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-md-surface-container-high p-6 rounded-full mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-md-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-md-on-surface mb-2">
            No jobs posted yet
          </h2>
          <p className="text-md-on-surface-variant mb-6 max-w-md">
            Create your first job listing to start attracting talented
            candidates to your organization
          </p>
          <motion.button
            onClick={handleCreateJob}
            className="bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-xl">+</span>
            Create Your First Job
          </motion.button>
        </div>
      )}
    </div>
  );
}
