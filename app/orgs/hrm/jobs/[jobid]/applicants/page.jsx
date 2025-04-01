"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  User,
  Users,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import HiringTestForm from "@/app/components/HiringTestForm";
import InterviewForm from "@/app/components/InterviewForm";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showHiringTestModal, setShowHiringTestModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Status dropdown state
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Hiring test form state
  const [hiringTestForm, setHiringTestForm] = useState({
    testName: "",
    description: "",
    duration: 60,
    passingScore: 70,
    questions: [],
  });

  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActioning, setIsActioning] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    fetchApplicants();
  }, [params.jobid, currentPage, itemsPerPage, searchTerm, filterStatus]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatusDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.jobid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setJobDetails(data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  };

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      if (filterStatus) {
        queryParams.append("status", filterStatus);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applicants/byjob/${
          params.jobid
        }?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();

      setApplicants(data.applicants || data);
      setFilteredApplicants(data.applicants || data);

      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      setActionError("Failed to load applicants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlistToggle = (applicantId) => {
    setSelectedApplicants((prev) =>
      prev.includes(applicantId)
        ? prev.filter((id) => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleCreateHiringTest = async (formData) => {
    try {
      setIsActioning(true);
      setActionError(null);
      const testResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            ...formData,
            jobId: params.jobid,
          }),
        }
      );
      const test = await testResponse.json();

      await Promise.all(
        selectedApplicants.map((applicantId) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                hiringTestId: test.id,
                status: "Assessment",
              }),
            }
          )
        )
      );

      setShowHiringTestModal(false);
      setActionSuccess("Hiring test successfully created and assigned!");
      fetchApplicants();
    } catch (error) {
      console.error("Failed to create hiring test:", error);
      setActionError("Failed to create hiring test. Please try again.");
    } finally {
      setIsActioning(false);
    }
  };

  const handleScheduleInterview = async (formData) => {
    try {
      setIsActioning(true);
      setActionError(null);
      const selectedApplicantsData = applicants.filter((a) =>
        selectedApplicants.includes(a.id)
      );

      await Promise.all(
        selectedApplicants.map((applicantId) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                status: "Interview",
                interviewDetails: {
                  ...formData,
                  scheduledAt: `${formData.date}T${formData.time}`,
                  googleCalendarEventId: formData.eventId,
                },
              }),
            }
          )
        )
      );

      setShowInterviewModal(false);
      setSelectedApplicants([]);
      setActionSuccess("Interviews successfully scheduled!");
      fetchApplicants();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      setActionError("Failed to schedule interview. Please try again.");
    } finally {
      setIsActioning(false);
    }
  };

  const updateApplicantStatus = async (applicantId, newStatus) => {
    try {
      setIsActioning(true);
      setActionError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        fetchApplicants();
        setOpenStatusDropdown(null);
        setActionSuccess(`Applicant status updated to ${newStatus}`);
      } else {
        console.error("Failed to update status");
        setActionError("Failed to update applicant status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating applicant status:", error);
      setActionError("Failed to update applicant status. Please try again.");
    } finally {
      setIsActioning(false);
    }
  };

  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => {
        setActionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-md-secondary-container text-md-on-secondary-container";
      case "shortlisted":
        return "bg-md-tertiary-container text-md-on-tertiary-container";
      case "assessment":
        return "bg-md-primary-container text-md-on-primary-container";
      case "interview":
        return "bg-md-primary-container text-md-on-primary-container";
      case "offer":
        return "bg-md-success-container text-md-on-success-container";
      case "rejected":
        return "bg-md-error-container text-md-on-error-container";
      default:
        return "bg-md-surface-variant text-md-on-surface-variant";
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="md:pt-5 md:rounded-tl-3xl md:bg-md-surface-container md:p-10 flex-grow overflow-auto flex flex-col">
        <div className="container mx-auto px-4 py-8 relative flex flex-col flex-grow">
          <Link
            href={`/orgs/hrm/jobs/${params.jobid}`}
            className="inline-flex items-center gap-2 mb-6 text-md-on-surface-variant hover:text-md-primary transition-colors p-2 rounded-lg hover:bg-md-surface-container-high"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Details</span>
          </Link>

          {jobDetails && (
            <div className="bg-md-surface-container-high rounded-2xl p-4 mb-8 shadow-sm border border-md-outline-variant">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-md-on-surface">
                    {jobDetails.title}
                  </h2>
                  <p className="text-md-on-surface-variant">
                    {jobDetails.department}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-md-surface-container rounded-full px-3 py-1">
                    <Users className="w-4 h-4 text-md-on-surface-variant" />
                    <span className="text-md-on-surface-variant font-medium">
                      {totalItems} Applicants
                    </span>
                  </div>
                  {jobDetails.status && (
                    <div className="px-3 py-1 rounded-full bg-md-secondary-container text-md-on-secondary-container text-sm font-medium">
                      {jobDetails.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-md-on-surface">
              Applicant Management
            </h1>
            <div className="flex gap-2">
              {selectedApplicants.length > 0 ? (
                <>
                  <div className="px-3 py-1 rounded-full bg-md-primary-container text-md-on-primary-container text-sm flex items-center gap-1 mr-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{selectedApplicants.length} selected</span>
                  </div>
                  <motion.button
                    onClick={() => setShowHiringTestModal(true)}
                    className="px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200 flex items-center gap-2"
                    whileTap={{ scale: 0.95 }}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Create Test
                  </motion.button>
                  <motion.button
                    onClick={() => setShowInterviewModal(true)}
                    className="px-6 py-2 rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-secondary-container hover:text-md-on-secondary-container transition-colors duration-200 flex items-center gap-2"
                    whileTap={{ scale: 0.95 }}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    Schedule Interview
                  </motion.button>
                </>
              ) : (
                <div className="hidden sm:block text-md-on-surface-variant text-sm">
                  Select applicants to perform actions
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {actionSuccess && (
              <motion.div
                className="mb-4 p-4 bg-md-success-container text-md-on-success-container rounded-xl flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle className="w-5 h-5" />
                <span>{actionSuccess}</span>
                <button
                  onClick={() => setActionSuccess(null)}
                  className="ml-auto text-md-on-success-container hover:bg-md-success-container-high rounded-full p-1"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {actionError && (
              <motion.div
                className="mb-4 p-4 bg-md-error-container text-md-on-error-container rounded-xl flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle className="w-5 h-5" />
                <span>{actionError}</span>
                <button
                  onClick={() => setActionError(null)}
                  className="ml-auto text-md-on-error-container hover:bg-md-error-container-high rounded-full p-1"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email or skills..."
                  className="block w-full pl-12 pr-6 pt-4 pb-4 rounded-full text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-md-surface-container text-md-on-surface"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-md-on-surface-variant w-5 h-5" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-md-on-surface-variant hover:text-md-on-surface p-1 rounded-full hover:bg-md-surface-variant"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full sm:w-48">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full px-6 py-4 rounded-full text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-md-surface-container text-md-on-surface pr-10"
                >
                  <option value="">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-md-on-surface-variant w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="block w-full px-6 py-4 rounded-full text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-md-surface-container text-md-on-surface"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>

          <div className="bg-md-surface rounded-3xl shadow-sm overflow-hidden border border-md-outline flex-grow flex flex-col">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 flex-grow">
                <Loader2 className="w-10 h-10 text-md-primary animate-spin mb-4" />
                <p className="text-md-on-surface-variant">
                  Loading applicants...
                </p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 flex-grow">
                <User className="w-16 h-16 text-md-on-surface-variant mb-4 opacity-40" />
                <h3 className="text-xl font-medium text-md-on-surface mb-2">
                  No applicants found
                </h3>
                <p className="text-md-on-surface-variant mb-6 text-center max-w-md">
                  {searchTerm || filterStatus
                    ? "Try changing your search or filter criteria"
                    : "There are no applicants for this job posting yet"}
                </p>
                {(searchTerm || filterStatus) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("");
                    }}
                    className="px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-auto flex-grow">
                <table className="min-w-full divide-y divide-md-outline-variant">
                  <thead className="bg-md-surface-container">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-md-primary border-md-outline rounded focus:ring-md-primary focus:ring-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedApplicants(
                                  applicants.map((a) => a.id)
                                );
                              } else {
                                setSelectedApplicants([]);
                              }
                            }}
                            checked={
                              applicants.length > 0 &&
                              selectedApplicants.length === applicants.length
                            }
                          />
                          <span className="ml-2 hidden md:inline-block">
                            Select All
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-md-surface divide-y divide-md-outline-variant">
                    {filteredApplicants.map((applicant) => (
                      <motion.tr
                        key={applicant.id}
                        className={`hover:bg-md-surface-variant ${
                          selectedApplicants.includes(applicant.id)
                            ? "bg-md-primary-container/20"
                            : ""
                        }`}
                        whileHover={{
                          backgroundColor:
                            "rgba(var(--md-surface-variant-rgb), 1)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedApplicants.includes(applicant.id)}
                            onChange={() => handleShortlistToggle(applicant.id)}
                            className="h-5 w-5 text-md-primary border-md-outline rounded focus:ring-md-primary focus:ring-2"
                          />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-md-surface-container-high border border-md-outline flex-shrink-0">
                              <img
                                src={applicant.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/default-avatar.png";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-medium text-md-on-surface hover:text-md-primary cursor-pointer">
                                {applicant.name}
                              </div>
                              <div className="text-sm text-md-on-surface-variant">
                                {applicant.email}
                              </div>
                              {applicant.tags && applicant.tags.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {applicant.tags.slice(0, 2).map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {applicant.tags.length > 2 && (
                                    <span className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full">
                                      +{applicant.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 inline-flex text-sm leading-5 font-medium rounded-full ${getStatusBadgeClass(
                              applicant.status
                            )}`}
                          >
                            {applicant.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-md-on-surface">
                          {new Date(applicant.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {applicant.score ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-md-surface-container-high rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    applicant.score >= 70
                                      ? "bg-md-success"
                                      : applicant.score >= 40
                                      ? "bg-md-warning"
                                      : "bg-md-error"
                                  }`}
                                  style={{ width: `${applicant.score}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-md-on-surface">
                                {applicant.score}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-md-on-surface-variant">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm relative">
                          <button
                            className="p-2 hover:bg-md-surface-container-high rounded-full text-md-on-surface-variant transition-colors"
                            onClick={() =>
                              setOpenStatusDropdown(
                                openStatusDropdown === applicant.id
                                  ? null
                                  : applicant.id
                              )
                            }
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openStatusDropdown === applicant.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 mt-2 w-60 rounded-xl shadow-lg bg-md-surface z-10 border border-md-outline overflow-hidden"
                            >
                              <div className="py-1 rounded-md bg-md-surface shadow-xs">
                                <div className="px-4 py-3 text-sm font-medium text-md-on-surface border-b border-md-outline-variant">
                                  Change status
                                </div>
                                <button
                                  onClick={() =>
                                    updateApplicantStatus(
                                      applicant.id,
                                      "Applied"
                                    )
                                  }
                                  className="block px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-2"
                                >
                                  <div className="w-3 h-3 rounded-full bg-md-secondary-container"></div>
                                  Applied
                                </button>
                                <button
                                  onClick={() =>
                                    updateApplicantStatus(
                                      applicant.id,
                                      "Shortlisted"
                                    )
                                  }
                                  className="block px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-2"
                                >
                                  <div className="w-3 h-3 rounded-full bg-md-tertiary-container"></div>
                                  Shortlisted
                                </button>
                                <button
                                  onClick={() =>
                                    updateApplicantStatus(
                                      applicant.id,
                                      "Assessment"
                                    )
                                  }
                                  className="block px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-2"
                                >
                                  <div className="w-3 h-3 rounded-full bg-md-primary-container"></div>
                                  Assessment
                                </button>
                                <button
                                  onClick={() =>
                                    updateApplicantStatus(
                                      applicant.id,
                                      "Interview"
                                    )
                                  }
                                  className="block px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-2"
                                >
                                  <div className="w-3 h-3 rounded-full bg-md-primary-container"></div>
                                  Interview
                                </button>
                                <button
                                  onClick={() =>
                                    updateApplicantStatus(applicant.id, "Offer")
                                  }
                                  className="block px-4 py-3 text-sm text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-2"
                                >
                                  <div className="w-3 h-3 rounded-full bg-md-success-container"></div>
                                  Offer
                                </button>
                                <button
                                  onClick={() =>
                                    updateApplicantStatus(
                                      applicant.id,
                                      "Rejected"
                                    )
                                  }
                                  className="block px-4 py-3 text-sm text-md-error hover:bg-md-surface-variant w-full text-left flex items-center gap-2"
                                >
                                  <div className="w-3 h-3 rounded-full bg-md-error-container"></div>
                                  Rejected
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {!isLoading && filteredApplicants.length > 0 && (
            <div className="mt-4 px-6 py-4 flex items-center justify-between border-t border-md-outline-variant bg-md-surface-container-high shadow-md rounded-xl">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1 || isLoading
                      ? "text-md-on-surface-variant bg-md-surface-variant cursor-not-allowed"
                      : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages || isLoading
                      ? "text-md-on-surface-variant bg-md-surface-variant cursor-not-allowed"
                      : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-md-on-surface-variant">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-md-outline-variant ${
                        currentPage === 1 || isLoading
                          ? "text-md-on-surface-variant bg-md-surface-variant cursor-not-allowed"
                          : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;

                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1) ||
                        totalPages <= 5
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                            className={`relative inline-flex items-center px-4 py-2 border border-md-outline-variant ${
                              currentPage === pageNum
                                ? "z-10 bg-md-primary text-md-on-primary"
                                : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }

                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span
                            key={`ellipsis-${pageNum}`}
                            className="relative inline-flex items-center px-4 py-2 border border-md-outline-variant bg-md-surface-container-high text-md-on-surface-variant"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                      className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-md-outline-variant ${
                        currentPage === totalPages || isLoading
                          ? "text-md-on-surface-variant bg-md-surface-variant cursor-not-allowed"
                          : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showHiringTestModal && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="md:max-w-4xl w-full h-full md:h-auto md:rounded-3xl bg-md-surface overflow-hidden shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <HiringTestForm
                    onSubmit={handleCreateHiringTest}
                    onCancel={() => setShowHiringTestModal(false)}
                    isSubmitting={isActioning}
                    selectedCount={selectedApplicants.length}
                  />
                </motion.div>
              </motion.div>
            )}

            {showInterviewModal && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="md:max-w-lg w-full md:h-auto md:rounded-3xl bg-md-surface overflow-hidden shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <InterviewForm
                    onSubmit={handleScheduleInterview}
                    onCancel={() => setShowInterviewModal(false)}
                    isSubmitting={isActioning}
                    attendees={applicants
                      .filter((a) => selectedApplicants.includes(a.id))
                      .map((a) => ({
                        email: a.email,
                        name: a.name,
                      }))}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
