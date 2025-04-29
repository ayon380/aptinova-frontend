"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Clock,
  Filter,
  ChevronDown,
  X,
  ArrowLeft,
  DollarSign,
  Share2,
  Bookmark,
  ExternalLink,
  Check,
  Loader2,
  Circle,
  Calendar,
  CheckSquare,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import useStore from "@/app/store"; // Import the store for caching

const JobBoard = () => {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
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
  const [userInfo, setUserInfo] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isSaved, setIsSaved] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetRef = useRef(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Get cache methods from the store
  const { getCache, setCache, setTitle } = useStore();

  // Close bottom sheet when clicking outside
  const handleClickOutside = (e) => {
    if (bottomSheetRef.current && !bottomSheetRef.current.contains(e.target)) {
      closeBottomSheet();
    }
  };

  const openBottomSheet = (job) => {
    setSelectedJob(job);
    setShowBottomSheet(true);
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickOutside);
  };

  const closeBottomSheet = () => {
    setShowBottomSheet(false);
    document.body.style.overflow = "auto";
    document.removeEventListener("mousedown", handleClickOutside);
  };

  const handleApply = async (jobId) => {
    setIsApplying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            appliedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error("Application failed");

      const result = await response.json();
      setApplicationSubmitted(true);
      setTimeout(() => {
        alert("Application submitted successfully!");
      }, 300);
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  // Load initial data
  useEffect(() => {
    setTitle("Job Board");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
    fetchJobs();
    setUserInfo({
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
      email: localStorage.getItem("email"),
      profilePicture: localStorage.getItem("profilePicture"),
      tier: localStorage.getItem("userTier") || "free",
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fetch jobs when filters or pagination changes
  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);

    // Create query params for API call and cache key
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

    // Create a unique cache key based on the current query
    const cacheKey = `jobs-${queryParams.toString()}`;

    // Check if data exists in cache
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      console.log("Using cached job data");
      setJobs(cachedData.jobs || []);
      setPagination({
        currentPage: cachedData.currentPage || 1,
        totalPages: cachedData.totalPages || 1,
        totalItems: cachedData.totalItems || 0,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();

      // Store data in cache
      setCache(cacheKey, data);

      setJobs(data.jobs || []);
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

  const applyQuickFilter = (type) => {
    setFilters({
      ...filters,
      employmentType: filters.employmentType === type ? "" : type,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        currentPage: newPage,
      });
      window.scrollTo(0, 0);
    }
  };

  const formatSalary = (salary, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Format relative time for job postings
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  // Render hiring process timeline
  const renderHiringProcess = (hiringProcess) => {
    // Try to parse if it's a string
    let steps = hiringProcess;
    try {
      if (typeof hiringProcess === "string") {
        steps = JSON.parse(hiringProcess);
      }
    } catch (e) {
      console.error("Error parsing hiring process:", e);
      return <p>Unable to display hiring process</p>;
    }

    // Get icons for each step type
    const getStepIcon = (type) => {
      switch (type) {
        case "Shortlist":
          return <Filter className="w-4 h-4" />;
        case "Test":
          return <Briefcase className="w-4 h-4" />;
        case "Interview":
          return <Users className="w-4 h-4" />;
        case "Onboard":
          return <Building2 className="w-4 h-4" />;
        default:
          return <Circle className="w-4 h-4" />;
      }
    };

    // Get color for each step type
    const getStepColor = (type) => {
      switch (type) {
        case "Shortlist":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "Test":
          return "bg-amber-100 text-amber-700 border-amber-200";
        case "Interview":
          return "bg-purple-100 text-purple-700 border-purple-200";
        case "Onboard":
          return "bg-green-100 text-green-700 border-green-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };

    // Format date with options
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return (
      <div className="relative">
        {/* Timeline visualization */}
        <div
          className="absolute left-4 top-8 bottom-0 w-0.5 bg-md-outline-variant"
          style={{ top: "2rem", bottom: "1rem" }}
        ></div>

        <ul className="space-y-6 relative">
          {steps.map((step, index) => {
            const isCompleted = !!step.completedDate;
            const stepColor = getStepColor(step.type);

            return (
              <li key={index} className="flex items-start space-x-4 relative">
                {/* Timeline dot */}
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full z-10 
                                ${
                                  isCompleted
                                    ? "bg-md-primary text-md-on-primary"
                                    : "bg-md-surface-container-high border-2 border-md-outline text-md-on-surface-variant"
                                }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  {/* Step type badge */}
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${stepColor}`}
                  >
                    {getStepIcon(step.type)}
                    <span className="ml-1">{step.type}</span>
                  </div>

                  <h4 className="text-md-on-surface font-semibold text-base">
                    {step.name}
                  </h4>

                  {step.description && (
                    <p className="text-md-on-surface-variant text-sm mt-1">
                      {step.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {step.plannedDate && (
                      <div className="flex items-center text-xs text-md-on-surface-variant">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>Planned: {formatDate(step.plannedDate)}</span>
                      </div>
                    )}

                    {step.completedDate && (
                      <div className="flex items-center text-xs text-md-primary">
                        <CheckSquare className="w-3.5 h-3.5 mr-1" />
                        <span>Completed: {formatDate(step.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Job Card Component
  const JobCard = ({ job }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden bg-md-surface-container-high rounded-3xl p-5 shadow-sm hover:shadow-md border border-md-outline-variant transition-all"
      onClick={() => Router.push(`/candidate/jobs/${job.id}`)}
    >
      <div className="flex items-start">
        {job.orgLogo ? (
          <div className="p-4">
            <Image
              src={job.orgLogo}
              width={50}
              height={50}
              alt={`${job.company} logo`}
              className="w  rounded-2xl object-cover mr-4 shadow-sm"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-md-primary/80 to-md-tertiary/90 flex items-center justify-center text-md-on-primary font-bold text-xl shadow-sm mr-4">
            {job.company?.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-md-on-surface font-semibold text-lg leading-tight line-clamp-1">
            {job.title}
          </h3>
          <p className="text-md-on-surface-variant mb-1 line-clamp-1">
            {job.company}
          </p>
          <div className="flex items-center text-sm text-md-on-surface-variant space-x-2">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {job.location}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {formatRelativeTime(job.postedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-md-primary-container/80 text-md-on-primary-container rounded-full text-xs font-medium">
          {job.employmentType}
        </span>
        <span className="px-3 py-1 bg-md-secondary-container/80 text-md-on-secondary-container rounded-full text-xs font-medium flex items-center">
          <DollarSign className="w-3 h-3 mr-0.5" />
          {formatSalary(job.salary, job.salaryCurrency)}
        </span>
        {job.jobLevel && (
          <span className="px-3 py-1 bg-md-tertiary-container/80 text-md-on-tertiary-container rounded-full text-xs font-medium">
            {job.jobLevel}
          </span>
        )}
      </div>

      {job.deadline && (
        <div className="mt-3 text-xs font-medium text-md-error">
          <Clock className="w-3.5 h-3.5 inline mr-1" />
          Apply by {new Date(job.deadline).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );

  return (
    // Responsive padding for mobile and desktop
    <div className="h-full w-screen p-4 md:w-full overflow-x-hidden overflow-y-scroll sm:px-4 md:px-0 md:bg-md-surface-container rounded-tl-3xl md:p-6 lg:p-10 text-md-on-background">
      {/* Search and Filter Header */}
      <div className="sticky top-0 z-30 bg-md-surface md:bg-transparent pt-4  w-full pb-3  md:shadow-none px-2 sm:px-4 md:px-2">
        <div className="relative w-full max-w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-md-on-surface-variant" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full max-w-full pl-10 pr-10 py-2 text-sm sm:py-2.5 bg-md-surface-container rounded-full text-md-on-surface focus:outline-none focus:ring-2 focus:ring-md-primary border border-md-outline md:pl-12 md:pr-12 md:py-3 md:text-base"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchJobs();
              }}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-md-surface-variant transition-all text-md-on-surface-variant md:right-2"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto mt-3 pb-1 scrollbar-hide no-scrollbar">
            {[
              "Full-time",
              "Part-time",
              "Contract",
              "Temporary",
              "Internship",
              "Remote",
            ].map((type) => (
              <button
                key={type}
                className={`px-2 py-1 sm:px-2.5 sm:py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-xs md:text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                  filters.employmentType === type
                    ? "bg-md-primary text-md-on-primary"
                    : "bg-md-surface-container-low text-md-on-surface hover:bg-md-surface-container"
                }`}
                onClick={() => applyQuickFilter(type)}
              >
                {type}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 sm:px-2.5 sm:py-1 md:px-4 md:py-2 bg-md-surface-container-low rounded-full text-xs sm:text-xs md:text-sm text-md-on-surface border-none appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-md-primary whitespace-nowrap flex-shrink-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "0.8rem",
              }}
            >
              <option value="newest">Newest</option>
              <option value="salary_high">Highest Salary</option>
              <option value="salary_low">Lowest Salary</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-md-surface-container-high mt-3 p-2 sm:p-3 md:p-4 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-md-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 text-sm md:text-base bg-md-surface-container rounded-full focus:outline-none focus:ring-2 focus:ring-md-primary border border-md-outline text-md-on-surface"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-md-on-surface-variant" />
                    <select
                      className="w-full pl-9 md:pl-10 pr-8 py-2 md:py-2.5 text-sm md:text-base bg-md-surface-container rounded-full border border-md-outline focus:outline-none focus:ring-2 focus:ring-md-primary appearance-none cursor-pointer text-md-on-surface"
                      value={filters.employmentType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          employmentType: e.target.value,
                        })
                      }
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.5rem center",
                        backgroundSize: "0.8rem",
                      }}
                    >
                      <option value="">Job Type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="temporary">Temporary</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-md-on-surface-variant" />
                    <select
                      className="w-full pl-9 md:pl-10 pr-8 py-2 md:py-2.5 text-sm md:text-base bg-md-surface-container rounded-full border border-md-outline focus:outline-none focus:ring-2 focus:ring-md-primary appearance-none cursor-pointer text-md-on-surface"
                      value={filters.salaryRange}
                      onChange={(e) =>
                        setFilters({ ...filters, salaryRange: e.target.value })
                      }
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.5rem center",
                        backgroundSize: "0.8rem",
                      }}
                    >
                      <option value="">Salary Range</option>
                      <option value="0-50k">$0 - $50k</option>
                      <option value="50k-100k">$50k - $100k</option>
                      <option value="100k+">$100k+</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 flex flex-col sm:flex-row gap-2 justify-end mt-2">
                    <button
                      onClick={() => {
                        setFilters({
                          search: "",
                          location: "",
                          employmentType: "",
                          salaryRange: "",
                        });
                      }}
                      className="px-4 py-2 w-full sm:w-auto rounded-full text-sm md:text-base hover:bg-md-surface-variant text-md-on-surface-variant transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        fetchJobs();
                        setShowFilters(false);
                      }}
                      className="px-5 py-2 w-full sm:w-auto text-sm md:text-base bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Job Results */}
      <div className="pt-4 pb-20 md:pb-10 mx-auto overflow-y-auto">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-base p-2 sm:text-base md:text-lg font-medium text-md-on-surface">
            {loading
              ? "Searching..."
              : pagination.totalItems > 0
              ? `${pagination.totalItems} job${
                  pagination.totalItems !== 1 ? "s" : ""
                } found`
              : "No jobs found"}
          </h2>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="h-28 md:h-36 bg-md-surface-container rounded-3xl"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid p-2 grid-cols-1 gap-4 max-w-full">
            <AnimatePresence>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </AnimatePresence>

            {/* Pagination - Mobile friendly version */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 md:mt-8 flex justify-center items-center gap-1 md:gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`p-2 md:p-3 rounded-full ${
                    pagination.currentPage === 1
                      ? "text-md-on-surface-variant/50 cursor-not-allowed"
                      : "bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 rotate-90" />
                </button>

                {/* Mobile simplified pagination */}
                <div className="flex items-center">
                  <span className="text-sm md:hidden">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>

                  {/* Desktop full pagination */}
                  <div className="hidden md:flex items-center">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    )
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pagination.totalPages ||
                          Math.abs(page - pagination.currentPage) <= 1
                      )
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="mx-1 text-md-on-surface-variant">
                              •••
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 md:w-10 md:h-10 mx-1 rounded-full flex items-center justify-center ${
                              pagination.currentPage === page
                                ? "bg-md-primary text-md-on-primary font-medium"
                                : "text-md-on-surface hover:bg-md-surface-container-high"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`p-2 md:p-3 rounded-full ${
                    pagination.currentPage === pagination.totalPages
                      ? "text-md-on-surface-variant/50 cursor-not-allowed"
                      : "bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 md:py-16 bg-md-surface-container rounded-3xl">
            <div className="inline-flex justify-center items-center w-16 h-16 md:w-20 md:h-20 bg-md-surface-variant rounded-full mb-4 md:mb-6">
              <Search className="w-8 h-8 md:w-10 md:h-10 text-md-on-surface-variant" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-md-on-surface mb-2 md:mb-3">
              No jobs found
            </h3>
            <p className="text-sm md:text-base text-md-on-surface-variant max-w-md mx-auto mb-6 md:mb-8 px-4">
              We couldn't find any jobs matching your search criteria. Try
              adjusting your filters or search terms.
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
              className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
