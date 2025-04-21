"use client";
import { useState, useEffect, useCallback } from "react"; // Import useCallback
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import useStore from "@/app/store"; // Import the store

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { getCache, setCache, setTitle } = useStore(); // Get cache functions from store
  // Set the title using the store
  useEffect(() => {
    setTitle("Job Listings");
  }, [setTitle]); // Set the title when the component mounts
  // Extracted fetchData logic
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true); // Start loading
      const cacheKey = "/jobs";
      const cachedJobs = !forceRefresh ? getCache(cacheKey) : undefined;

      if (cachedJobs) {
        console.log("Loading jobs from cache");
        setJobs(cachedJobs);
        setIsLoading(false); // Stop loading
      } else {
        console.log(
          forceRefresh ? "Forcing refresh..." : "Fetching jobs from API"
        );
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              cache: "no-store", // Ensure fresh data is fetched
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jobsData = await response.json();
          setJobs(jobsData);
          setCache(cacheKey, jobsData); // Cache the fetched data
          console.log("Jobs fetched and cached");
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
          // Handle error appropriately, maybe show a message to the user
        } finally {
          setIsLoading(false); // Stop loading regardless of outcome
        }
      }
    },
    [getCache, setCache]
  ); // Dependencies for useCallback

  useEffect(() => {
    fetchData(); // Fetch data on initial mount
  }, [fetchData]); // fetchData is now stable due to useCallback

  const handleRefresh = () => {
    fetchData(true); // Call fetchData with forceRefresh = true
  };

  const handleMenuOpen = (jobId) => {
    setSelectedJobId(jobId);
    setShowMenu(!showMenu);
  };

  const handleViewJob = (jobId) => {
    router.push(`/orgs/hrm/jobs/${jobId}`);
    setShowMenu(false);
  };

  const handleCreateJob = () => {
    router.push("/orgs/hrm/jobs/create");
  };

  const viewjobapplicants = (jobId) => {
    router.push(`/orgs/hrm/jobs/${jobId}/applicants`);
  };

  const filteredJobs = (Array.isArray(jobs) ? jobs : []).filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.department &&
        job.department.toLowerCase().includes(searchTerm.toLowerCase())) || // Add null check for department
      (job.location &&
        job.location.toLowerCase().includes(searchTerm.toLowerCase())) // Add null check for location
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
    <div className=" mx-auto w-full h-full p-4 md:p-10 ">
      {/* Combined Top Bar: Search, Refresh, Create */}
      {/* Changed flex-col md:flex-row to flex flex-row */}
      <div className="flex flex-row justify-between items-center mb-6 gap-2 md:gap-4">
        {/* Search Input */}
        {/* Added flex-grow to allow shrinking/growing, removed md:w-auto */}
        <div className="relative flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..." // Shortened placeholder for mobile
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Adjusted padding, kept md:w-80 for larger screens but allows shrinking
              className="w-full md:w-80 pl-10 pr-4 py-2.5 border border-md-outline rounded-full focus:ring-2 focus:ring-md-primary focus:border-transparent bg-md-surface-container text-md-on-surface placeholder-md-on-surface-variant text-sm"
            />
            {/* Adjusted icon position slightly */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-md-on-surface-variant">
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

        {/* Buttons Group (Refresh & Create) */}
        {/* Removed w-full, added flex-shrink-0 */}
        <div className="flex gap-2 flex-shrink-0 items-center">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading} // Disable button while loading
            // Adjusted padding
            className={`p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-variant transition-colors duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Refresh jobs"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} // Add spin animation when loading
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: isLoading ? Infinity : 0,
                ease: "linear",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </motion.svg>
          </button>

          {/* Create Job Button */}
          <motion.button
            onClick={handleCreateJob}
            // Adjusted padding, text size potentially smaller if needed
            className="bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container px-3 py-2 md:px-5 md:py-2.5 rounded-full flex items-center gap-1 md:gap-2 shadow-sm transition-colors duration-200 text-sm whitespace-nowrap"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-lg md:text-xl">+</span>
            {/* Changed sm:hidden to md:hidden, sm:inline to md:inline */}
            <span className="hidden md:inline">Create Job</span>
            <span className="md:hidden">New</span>{" "}
            {/* Even shorter text for mobile */}
          </motion.button>
        </div>
      </div>

      {/* Conditional Rendering: Cards for mobile, Table for larger screens */}
      {isLoading && !jobs.length ? (
        <div className="px-6 py-12 text-center text-md-on-surface-variant">
          Loading jobs...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="px-6 py-12 text-center text-md-on-surface-variant">
          {searchTerm
            ? "No jobs match your search."
            : "No jobs found. Create a new job to get started."}
        </div>
      ) : (
        <>
          {/* Card Layout for Mobile (hidden on md and up) */}
          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className="bg-md-surface-container rounded-2xl p-4 shadow-sm border border-md-outline-variant relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/orgs/hrm/jobs/${job.id}`}
                      className="text-md-primary font-medium text-lg mr-4"
                    >
                      {job.title}
                    </Link>
                    <span
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  {(job.department || job.location) && (
                    <div className="text-sm text-md-on-surface-variant mb-3 space-y-1">
                      {job.department && <p>Dept: {job.department}</p>}
                      {job.location && <p>Location: {job.location}</p>}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => viewjobapplicants(job.id)}
                      className="text-md-primary text-sm transition-colors duration-200"
                    >
                      View Applicants
                    </button>
                    <div className="relative">
                      {" "}
                      {/* Container for button and menu */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click if needed
                          handleMenuOpen(job.id);
                        }}
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
                      {/* Action Menu - positioned relative to the button */}
                      {showMenu && selectedJobId === job.id && (
                        <motion.div
                          className="absolute right-0 mt-1 w-48 rounded-xl shadow-lg bg-md-surface ring-1 ring-md-outline z-50 overflow-hidden" // Adjusted rounding and position
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                        >
                          {/* Menu items remain the same */}
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
                              onClick={() => setShowMenu(false)} // Add relevant onClick later
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
                              onClick={() => setShowMenu(false)} // Add relevant onClick later
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
                              onClick={() => setShowMenu(false)} // Add relevant onClick later
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
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Table Layout for Medium screens and up (hidden below md) */}
          <div className="hidden md:block rounded-3xl shadow-sm overflow-hidden border border-md-outline-variant">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-md-outline">
                <thead className="bg-md-secondary-container">
                  <tr>
                    {/* ... existing th elements ... */}
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
                    <th className="px-6 py-4 text-right text-sm font-medium text-md-on-surface-variant tracking-wider relative">
                      {" "}
                      {/* Added relative positioning */}
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-md-surface text-md-on-surface divide-y divide-md-outline">
                  {/* Changed bg color */}
                  <AnimatePresence>
                    {filteredJobs.map((job) => (
                      <motion.tr
                        key={job.id}
                        className="hover:bg-md-surface-variant transition-colors duration-150" // Changed hover color
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/orgs/hrm/jobs/${job.id}`}
                            className="text-md-primary hover:underline font-medium"
                          >
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md-on-surface-variant">
                          {" "}
                          {/* Adjusted text color */}
                          {job.department || "-"} {/* Handle null */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md-on-surface-variant">
                          {" "}
                          {/* Adjusted text color */}
                          {job.location || "-"} {/* Handle null */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => viewjobapplicants(job.id)}
                            className="text-md-primary hover:underline transition-colors duration-200 text-sm"
                          >
                            View Applicants
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right relative">
                          {" "}
                          {/* Added relative positioning */}
                          <button
                            onClick={() => handleMenuOpen(job.id)}
                            className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-highest transition-colors duration-200" // Adjusted hover bg
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
                          {/* Action Menu - positioned relative to the cell */}
                          {showMenu && selectedJobId === job.id && (
                            <motion.div
                              className="absolute right-6 mt-1 w-48 rounded-xl shadow-lg bg-md-surface ring-1 ring-md-outline z-50 overflow-hidden" // Adjusted rounding and position
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              {/* Menu items remain the same */}
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
                                  onClick={() => setShowMenu(false)} // Add relevant onClick later
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
                                  onClick={() => setShowMenu(false)} // Add relevant onClick later
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
                                  onClick={() => setShowMenu(false)} // Add relevant onClick later
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
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {/* Global Click Catcher for Menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        ></div>
      )}
      {/* Empty state - show when no jobs (adjust padding/text if needed) */}
      {jobs.length === 0 &&
        !filteredJobs.length &&
        !isLoading && ( // Ensure not shown during initial load
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            {" "}
            {/* Added horizontal padding */}
            {/* ... existing empty state svg and text ... */}
            <div className="bg-md-surface-container-high p-4 md:p-6 rounded-full mb-4 md:mb-6">
              {" "}
              {/* Adjusted padding */}
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
            <h2 className="text-lg md:text-xl font-medium text-md-on-surface mb-2">
              No jobs posted yet
            </h2>
            <p className="text-sm md:text-base text-md-on-surface-variant mb-6 max-w-md">
              Create your first job listing to start attracting talented
              candidates to your organization
            </p>
            <motion.button
              onClick={handleCreateJob}
              className="bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container px-5 py-2.5 md:px-6 md:py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-200 text-sm md:text-base" // Adjusted padding and text size
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-lg md:text-xl">+</span>
              Create Your First Job
            </motion.button>
          </div>
        )}
    </div>
  );
}
