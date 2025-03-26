"use client";
import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  Clock,
  Filter,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import  Link  from "next/link";
const JobBoard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showMobileJob, setShowMobileJob] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const Router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    employmentType: "",
    salaryRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
    fetchJobs();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.employmentType && {
          employmentType: filters.employmentType,
        }),
        ...(filters.salaryRange && {
          ...(filters.salaryRange === "0-50k" && { maxSalary: 50000 }),
          ...(filters.salaryRange === "50k-100k" && {
            minSalary: 50000,
            maxSalary: 100000,
          }),
          ...(filters.salaryRange === "100k+" && { minSalary: 100000 }),
        }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BackendURL}/jobs/all?${queryParams}`
      );
      const data = await response.json();
      setJobs(data);
      // Assuming the pagination data is included in the response
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (window.innerWidth < 1024) {
      setShowMobileJob(true);
    }
  };

  const formatSalary = (salary, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const JobDetails = ({ job, isMobile }) => (
    <motion.div
      initial={{ opacity: 0, ...(isMobile ? { y: "100%" } : { x: 20 }) }}
      animate={{ opacity: 1, ...(isMobile ? { y: 0 } : { x: 0 }) }}
      exit={{ opacity: 0, ...(isMobile ? { y: "100%" } : { x: 20 }) }}
      className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-y-auto ${
        isMobile
          ? "fixed inset-0 z-50"
          : "sticky top-24 max-h-[calc(100vh-120px)]"
      }`}
    >
      {isMobile && (
        <button
          onClick={() => setShowMobileJob(false)}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
          {job.company?.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{job.title}</h2>
          <p className="text-gray-500 dark:text-gray-400">{job.company}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
            {job.employmentType}
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
            {formatSalary(job.salary, job.salaryCurrency)}
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
            {job.jobType}
          </span>
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm">
            {job.jobLevel}
          </span>
          {job.remoteEligibility && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm">
              Remote Eligible
            </span>
          )}
          {job.visaSponsorshipAvailable && (
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
              Visa Sponsorship
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock className="w-5 h-5" />
            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-5 h-5" />
              <span>
                Apply by {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
          {job.experienceRequired && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Briefcase className="w-5 h-5" />
              <span>{job.experienceRequired}+ years experience</span>
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-800 pt-6">
          <h3 className="text-lg font-semibold mb-4">About the role</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        </div>

        <div className="border-t dark:border-gray-800 pt-6">
          <h3 className="text-lg font-semibold mb-4">Requirements</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{job.qualifications}</ReactMarkdown>
          </div>
        </div>

        {job.languageRequirements && (
          <div className="border-t dark:border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Language Requirements
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{job.languageRequirements}</ReactMarkdown>
            </div>
          </div>
        )}

        {job.benefits && (
          <div className="border-t dark:border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Benefits</h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{job.benefits}</ReactMarkdown>
            </div>
          </div>
        )}

        {job.additionalDetails && (
          <div className="border-t dark:border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Additional Information
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{job.additionalDetails}</ReactMarkdown>
            </div>
          </div>
        )}

        {job.applicationLink ? (
          <a
            href={job.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors text-center block"
          >
            Apply Now
          </a>
        ) : (
          <Link
            href={`http://${job.subdomain}.${
              process.env.NEXT_PUBLIC_AppURL
            }/orgs/jobs/${job.id}?authToken=${localStorage.getItem(
              "authToken"
            )}`}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
          >
            Apply Now
          </Link>
        )}
      </div>
    </motion.div>
  );

  return (
    <div
      className={`h-dvh ${
        darkMode ? "dark bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Minimal Header */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            devjobs
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Search Section */}
      <div className="pt-24 pb-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 border-none outline-none transition-all"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mt-4 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>
              <select
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                value={filters.employmentType}
                onChange={(e) =>
                  setFilters({ ...filters, employmentType: e.target.value })
                }
              >
                <option value="">Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
              <select
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                value={filters.salaryRange}
                onChange={(e) =>
                  setFilters({ ...filters, salaryRange: e.target.value })
                }
              >
                <option value="">Salary Range</option>
                <option value="0-50k">$0 - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k+">$100k+</option>
              </select>
            </motion.div>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`group p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-800 ${
                    selectedJob?.id === job.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {job.company?.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                          {job.title}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                      {job.employmentType}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                      {job.salary}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {selectedJob && !showMobileJob && (
                <JobDetails job={selectedJob} isMobile={false} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Job Details */}
      <AnimatePresence>
        {showMobileJob && selectedJob && (
          <JobDetails job={selectedJob} isMobile={true} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobBoard;
