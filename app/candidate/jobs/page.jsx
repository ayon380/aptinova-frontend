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
import Link from "next/link";


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
  // User info state for the header
  const [userInfo, setUserInfo] = useState(null);
  // Add sorting state
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
    fetchJobs();
    // Set basic user info from localStorage
    setUserInfo({
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
      email: localStorage.getItem("email"),
      profilePicture: localStorage.getItem("profilePicture"),
      tier: localStorage.getItem("userTier") || "free"
    });
  }, [filters, pagination.currentPage, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        sort: sortBy,
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
        `${process.env.NEXT_PUBLIC_BackendURL}/jobs/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
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

  // Add quick filter function
  const applyQuickFilter = (type) => {
    setFilters({
      ...filters,
      employmentType: filters.employmentType === type ? "" : type
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        currentPage: newPage
      });
      window.scrollTo(0, 0);
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
      className={`bg-md-surface-container p-6 rounded-3xl shadow-lg border border-md-outline overflow-y-auto ${
        isMobile
          ? "fixed inset-0 z-50"
          : "sticky top-24 max-h-[calc(100vh-120px)]"
      }`}
    >
      {isMobile && (
        <button
          onClick={() => setShowMobileJob(false)}
          className="absolute right-4 top-4 p-2 bg-md-surface-variant rounded-full hover:bg-md-primary-container text-md-on-surface-variant flex items-center gap-2"
        >
          <span>Back to jobs</span>
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="flex items-center gap-4 mb-6">
        {job.orgLogo ? (
          <img 
            src={job.orgLogo} 
            alt={`${job.company} logo`} 
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-md-primary to-md-tertiary flex items-center justify-center text-md-on-primary font-bold text-2xl">
            {job.company?.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-md-on-surface">{job.title}</h2>
          <p className="text-md-on-surface-variant">{job.company}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-md-primary-container text-md-on-primary-container rounded-full text-sm">
            {job.employmentType}
          </span>
          <span className="px-3 py-1 bg-md-secondary-container text-md-on-secondary-container rounded-full text-sm">
            {formatSalary(job.salary, job.salaryCurrency)}
          </span>
          <span className="px-3 py-1 bg-md-surface-variant text-md-on-surface-variant rounded-full text-sm">
            {job.jobType}
          </span>
          <span className="px-3 py-1 bg-md-tertiary-container text-md-on-tertiary-container rounded-full text-sm">
            {job.jobLevel}
          </span>
          {job.remoteEligibility && (
            <span className="px-3 py-1 bg-md-secondary-container text-md-on-secondary-container rounded-full text-sm">
              Remote Eligible
            </span>
          )}
          {job.visaSponsorshipAvailable && (
            <span className="px-3 py-1 bg-md-tertiary-container text-md-on-tertiary-container rounded-full text-sm">
              Visa Sponsorship
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-md-on-surface">
            <MapPin className="w-5 h-5 text-md-primary" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-md-on-surface">
            <Clock className="w-5 h-5 text-md-primary" />
            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center gap-2 text-md-on-surface">
              <Clock className="w-5 h-5 text-md-primary" />
              <span>
                Apply by {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
          {job.experienceRequired && (
            <div className="flex items-center gap-2 text-md-on-surface">
              <Briefcase className="w-5 h-5 text-md-primary" />
              <span>{job.experienceRequired}+ years experience</span>
            </div>
          )}
        </div>

        <div className="border-t border-md-outline-variant pt-6">
          <h3 className="text-lg font-semibold mb-4 text-md-on-surface">About the role</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        </div>

        <div className="border-t border-md-outline-variant pt-6">
          <h3 className="text-lg font-semibold mb-4 text-md-on-surface">Requirements</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{job.qualifications}</ReactMarkdown>
          </div>
        </div>

        {job.languageRequirements && (
          <div className="border-t border-md-outline-variant pt-6">
            <h3 className="text-lg font-semibold mb-4 text-md-on-surface">
              Language Requirements
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{job.languageRequirements}</ReactMarkdown>
            </div>
          </div>
        )}

        {job.benefits && (
          <div className="border-t border-md-outline-variant pt-6">
            <h3 className="text-lg font-semibold mb-4 text-md-on-surface">Benefits</h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{job.benefits}</ReactMarkdown>
            </div>
          </div>
        )}

        {job.additionalDetails && (
          <div className="border-t border-md-outline-variant pt-6">
            <h3 className="text-lg font-semibold mb-4 text-md-on-surface">
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
            className="w-full bg-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container text-md-on-primary py-3 rounded-3xl font-medium transition-colors text-center block"
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
            className="w-full bg-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container text-md-on-primary py-3 rounded-3xl font-medium transition-colors text-center block"
          >
            Apply Now
          </Link>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="h-dvh bg-md-background text-md-on-background">
      {/* App Header */}
      

      {/* Hero Search Section */}
      <div className="pt-24 pb-8 bg-md-surface">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-md-on-surface-variant" />
            </div>
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-md-surface-container rounded-3xl shadow-sm focus:ring-2 focus:ring-md-primary border border-md-outline outline-none transition-all text-md-on-surface"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchJobs();
              }}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-md-surface-variant rounded-full transition-all text-md-on-surface-variant"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="max-w-2xl mx-auto mt-4 flex flex-wrap gap-2 justify-center">
            {["full-time", "part-time", "contract", "remote"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  filters.employmentType === type
                    ? "bg-md-primary text-md-on-primary"
                    : "bg-md-surface-container text-md-on-surface hover:bg-md-surface-variant"
                }`}
                onClick={() => applyQuickFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mt-4 p-4 bg-md-surface-container rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 border border-md-outline"
            >
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-md-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 bg-md-surface-container-high rounded-3xl border border-md-outline outline-none focus:ring-2 focus:ring-md-primary text-md-on-surface"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>
              <select
                className="w-full px-4 py-2 bg-md-surface-container-high rounded-3xl border border-md-outline outline-none focus:ring-2 focus:ring-md-primary appearance-none cursor-pointer text-md-on-surface"
                value={filters.employmentType}
                onChange={(e) =>
                  setFilters({ ...filters, employmentType: e.target.value })
                }
              >
                <option value="">Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
              <select
                className="w-full px-4 py-2 bg-md-surface-container-high rounded-3xl border border-md-outline outline-none focus:ring-2 focus:ring-md-primary appearance-none cursor-pointer text-md-on-surface"
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
              
              {/* Apply and Reset buttons */}
              <div className="md:col-span-3 flex justify-between mt-2">
                <button 
                  onClick={() => {
                    setFilters({
                      search: "",
                      location: "",
                      employmentType: "",
                      salaryRange: "",
                    });
                    setShowFilters(false);
                  }}
                  className="px-4 py-2 rounded-3xl text-md-on-surface-variant hover:bg-md-surface-variant transition-colors"
                >
                  Reset Filters
                </button>
                <button 
                  onClick={() => {
                    fetchJobs();
                    setShowFilters(false);
                  }}
                  className="px-6 py-2 bg-md-primary text-md-on-primary rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-md-on-surface">
            {loading ? "Searching jobs..." : 
              jobs.length > 0 ? 
                `Found ${pagination.totalItems} job${pagination.totalItems !== 1 ? 's' : ''}` : 
                "No jobs found"}
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-md-on-surface-variant text-sm">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-md-surface-container rounded-xl border border-md-outline text-sm"
            >
              <option value="newest">Newest</option>
              <option value="salary_high">Highest Salary</option>
              <option value="salary_low">Lowest Salary</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="h-32 bg-md-surface-variant rounded-3xl"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <>
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className={`group p-6 bg-md-surface-container rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer border ${
                      selectedJob?.id === job.id ? "border-md-primary border-2" : "border-md-outline"
                    }`}
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {job.orgLogo ? (
                          <img 
                            src={job.orgLogo} 
                            alt={`${job.company} logo`} 
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-md-primary to-md-tertiary flex items-center justify-center text-md-on-primary font-bold text-lg">
                            {job.company?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h2 className="text-lg font-semibold mb-1 group-hover:text-md-primary transition-colors text-md-on-surface">
                            {job.title}
                          </h2>
                          <div className="flex items-center gap-2 text-md-on-surface-variant">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-md-on-surface-variant group-hover:text-md-primary transition-colors" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-md-primary-container text-md-on-primary-container rounded-full text-sm">
                        {job.employmentType}
                      </span>
                      <span className="px-3 py-1 bg-md-secondary-container text-md-on-secondary-container rounded-full text-sm">
                        {formatSalary(job.salary, job.salaryCurrency)}
                      </span>
                      <span className="px-3 py-1 bg-md-surface-variant text-md-on-surface-variant rounded-full text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    </div>
                    <div className="mt-3 text-md-on-surface-variant text-sm">
                      Posted {new Date(job.postedAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
                
                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`p-2 rounded-full ${
                        pagination.currentPage === 1
                          ? "text-md-on-surface-variant opacity-50 cursor-not-allowed"
                          : "bg-md-surface-container hover:bg-md-primary-container text-md-on-surface hover:text-md-on-primary-container"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - pagination.currentPage) <= 1
                      )
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && 
                            <span className="text-md-on-surface-variant">...</span>
                          }
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-full ${
                              pagination.currentPage === page
                                ? "bg-md-primary text-md-on-primary"
                                : "bg-md-surface-container hover:bg-md-surface-variant text-md-on-surface"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))
                    }
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`p-2 rounded-full ${
                        pagination.currentPage === pagination.totalPages
                          ? "text-md-on-surface-variant opacity-50 cursor-not-allowed"
                          : "bg-md-surface-container hover:bg-md-primary-container text-md-on-surface hover:text-md-on-primary-container"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-md-surface-container rounded-3xl border border-dashed border-md-outline">
                <div className="inline-flex justify-center items-center w-16 h-16 bg-md-surface-variant rounded-full mb-4">
                  <Search className="w-8 h-8 text-md-on-surface-variant" />
                </div>
                <h3 className="text-xl font-semibold text-md-on-surface mb-2">No jobs found</h3>
                <p className="text-md-on-surface-variant max-w-md mx-auto mb-6">
                  Try adjusting your search or filter criteria to find more opportunities.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      location: "",
                      employmentType: "",
                      salaryRange: "",
                    });
                    setSortBy("newest");
                    fetchJobs();
                  }}
                  className="px-6 py-2 bg-md-primary text-md-on-primary rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {selectedJob && !showMobileJob && (
                <JobDetails job={selectedJob} isMobile={false} />
              )}
              {!selectedJob && !showMobileJob && !loading && jobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-md-surface-container p-6 rounded-3xl shadow-lg border border-md-outline text-center sticky top-24"
                >
                  <div className="py-8">
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-md-surface-variant rounded-full mb-4">
                      <Briefcase className="w-8 h-8 text-md-on-surface-variant" />
                    </div>
                    <h3 className="text-xl font-semibold text-md-on-surface mb-2">Select a job</h3>
                    <p className="text-md-on-surface-variant">
                      Click on a job from the list to view its details
                    </p>
                  </div>
                </motion.div>
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
