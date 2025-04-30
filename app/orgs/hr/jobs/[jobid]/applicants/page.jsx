"use client";
import {
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  LayoutList,
  LayoutGrid,
  KanbanSquare,
  Settings,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/app/store";

// Dynamically import components to reduce initial load time
const HiringTestForm = dynamic(
  () => import("@/app/components/HiringTestForm"),
  {
    loading: () => <LoadingComponent message="Loading test form..." />,
    ssr: false,
  }
);

const InterviewForm = dynamic(() => import("@/app/components/InterviewForm"), {
  loading: () => <LoadingComponent message="Loading interview form..." />,
  ssr: false,
});

const HiringWorkflow = dynamic(
  () => import("@/app/components/HiringWorkflow"),
  {
    loading: () => <LoadingComponent message="Loading workflow view..." />,
    ssr: false,
  }
);

const ApplicantDetailsModal = dynamic(
  () => import("@/app/components/ApplicantDetailsModal"),
  {
    loading: () => <LoadingComponent message="Loading applicant details..." />,
    ssr: false,
  }
);

const LoadingComponent = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-12">
    <Loader2 className="w-10 h-10 text-md-primary animate-spin mb-4" />
    <p className="text-md-on-surface-variant">{message || "Loading..."}</p>
  </div>
);

export default function ApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showHiringTestModal, setShowHiringTestModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const { setTitle } = useStore();
  const [showApplicantDetailsModal, setShowApplicantDetailsModal] =
    useState(false);
  const [selectedApplicantDetails, setSelectedApplicantDetails] =
    useState(null);
  const [showJobStatusMenu, setShowJobStatusMenu] = useState(false);
  const jobStatusMenuRef = useRef(null); // Ref for job status menu

  // View modes
  const [viewMode, setViewMode] = useState("kanban"); // "list", "kanban"

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
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // New loading state for applicant details

  // State to manage pending applicant moves requiring modal interaction
  const [pendingMove, setPendingMove] = useState(null); // { applicantId: string, targetStage: string, sourceStage: string } | null

  const fetchJobDetails = useCallback(async () => {
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
      setJobDetails(data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  }, [params.jobid]);

  const fetchApplicants = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: viewMode === "list" ? currentPage : 1,
        limit: viewMode === "list" ? itemsPerPage : 100, // Load more for kanban view
      });

      // Only apply search and filters in list view
      if (viewMode === "list") {
        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        if (filterStatus) {
          queryParams.append("status", filterStatus);
        }
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
  }, [
    params.jobid,
    viewMode,
    currentPage,
    itemsPerPage,
    searchTerm,
    filterStatus,
  ]);

  useEffect(() => {
    fetchJobDetails();
    fetchApplicants();
  }, [fetchJobDetails, fetchApplicants]); // Use useCallback dependencies

  useEffect(() => {
    setTitle("Applicant Management");
  }, [setTitle]); // Add setTitle to dependency array

  useEffect(() => {
    function handleClickOutside(event) {
      // Close applicant status dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatusDropdown(null);
      }
      // Close job status dropdown
      if (
        jobStatusMenuRef.current &&
        !jobStatusMenuRef.current.contains(event.target)
      ) {
        setShowJobStatusMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Keep dependencies empty to run only once

  // Define updateApplicantStatus *before* functions that depend on it
  const updateApplicantStatus = useCallback(
    async (applicantId, newStatus, details = null) => {
      try {
        setIsActioning(true);
        setActionError(null);
        setActionSuccess(null);

        const payload = {
          status: newStatus,
          ...(details && { details }), // Include details if provided (e.g., hiringTestId, interviewDetails, offerNotes)
        };

        // Special handling for Offer notes
        if (details?.offerNotes && newStatus === "Offer") {
          payload.details.offerDetails = { notes: details.offerNotes };
          delete payload.details.offerNotes; // Clean up
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to update applicant status."
          );
        }

        setActionSuccess(`Applicant status updated to ${newStatus}.`);
        fetchApplicants(); // Refresh data after successful update
      } catch (error) {
        console.error("Failed to update applicant status:", error);
        setActionError(
          error.message ||
            "Failed to update applicant status. Please try again."
        );
        // Optionally revert UI or handle error state
      } finally {
        setIsActioning(false);
      }
    },
    [fetchApplicants]
  ); // Add fetchApplicants as dependency

  const handleCreateHiringTest = useCallback(
    async (formData) => {
      if (!pendingMove) return; // Ensure there's a pending move

      try {
        setIsActioning(true);
        setActionError(null);
        setActionSuccess(null); // Clear previous success message

        let testId;
        const applicantIdToUpdate = pendingMove.applicantId;
        const targetStage = pendingMove.targetStage;

        // Check if we're using a ready-made test
        if (formData.readyMadeTestId) {
          testId = formData.readyMadeTestId;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                id: testId,
                jobId: params.jobid,
              }),
            }
          );
          const test = await response.json();
          testId = test.id;
          if (!response.ok) {
            throw new Error("Failed to assign ready-made test to job.");
          }
        } else {
          // Create a new test
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
          if (!testResponse.ok) {
            const errorData = await testResponse.json();
            throw new Error(
              errorData.message || "Failed to create hiring test."
            );
          }
          const test = await testResponse.json();
          testId = test.id;

          // Debug log to verify test ID
          console.log("Created test with ID:", testId);

          // Validate test ID before proceeding
          if (!testId) {
            throw new Error(
              "Failed to get a valid test ID from the server response"
            );
          }
        }

        // Assign the test to the specific applicant and update status
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
                  hiringTestId: testId,
                  status: targetStage, // Update status to the target stage
                  // status: "Assessment",
                }),
              }
            )
          )
        );
        fetchApplicants(); // Refresh applicants after assignment
        setShowHiringTestModal(false);
        setActionSuccess("Hiring test successfully created and assigned!");
        setPendingMove(null); // Clear pending move on success
        // fetchApplicants(); // updateApplicantStatus already fetches
      } catch (error) {
        console.error("Failed to create hiring test:", error);
        setActionError(
          error.message || "Failed to create hiring test. Please try again."
        );
        setPendingMove(null); // Clear pending move on failure
      } finally {
        setIsActioning(false);
      }
    },
    [pendingMove, params.jobid, updateApplicantStatus]
  ); // Add dependencies like pendingMove, params.jobid, updateApplicantStatus

  const handleScheduleInterview = useCallback(
    async (formData) => {
      if (!pendingMove) return; // Ensure there's a pending move
      console.log("Scheduling interview with formData:", formData); // Debug log

      try {
        setIsActioning(true);
        setActionError(null);
        setActionSuccess(null); // Clear previous success message

        const applicantIdToUpdate = pendingMove.applicantId;
        const targetStage = pendingMove.targetStage;

        // The interview scheduling endpoint now handles applicant update
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interviews/schedule`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              summary: `Interview for ${
                applicants.find((a) => a.id === applicantIdToUpdate)?.Candidate
                  ?.firstName || "applicant"
              }`,
              description: formData.notes,
              startDateTime: `${formData.date}T${formData.time}:00`,
              duration: formData.duration,
              interviewers: formData.interviewers.filter(
                (email) => email.trim() !== ""
              ),
              jobId: params.jobid,
              applicantId: applicantIdToUpdate, // Pass applicant ID
              targetStage: targetStage, // Pass target stage for status update
              attendees: [
                {
                  id: applicantIdToUpdate,
                  name:
                    applicants.find((a) => a.id === applicantIdToUpdate)
                      ?.Candidate?.firstName || "applicant",
                  email: applicants.find((a) => a.id === applicantIdToUpdate)
                    ?.Candidate?.email,
                },
              ], // Simplified attendees
            }),
          }
        );

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantIdToUpdate}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              status: targetStage, // Update status to the target stage
              // status: "Assessment",
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Server error: ${response.status}`
          );
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // No need to call updateApplicantStatus separately if backend handles it
        setShowInterviewModal(false);
        setSelectedApplicants([]); // Clear selection if needed
        setActionSuccess("Interview successfully scheduled!");
        setPendingMove(null); // Clear pending move on success
        fetchApplicants(); // Refetch to update UI
      } catch (error) {
        console.error("Failed to schedule interview:", error);
        setActionError(
          error.message || "Failed to schedule interview. Please try again."
        );
        setPendingMove(null); // Clear pending move on failure
      } finally {
        setIsActioning(false);
      }
    },
    [pendingMove, params.jobid, applicants, fetchApplicants]
  ); // Add dependencies like pendingMove, params.jobid, applicants, fetchApplicants

  // Initiates the move process, potentially opening modals
  const handleInitiateMove = useCallback(
    (applicantId, targetStage, sourceStage) => {
      const applicant = applicants.find((a) => a.id === applicantId);
      if (!applicant) return;

      setPendingMove({ applicantId, targetStage, sourceStage });
      setSelectedApplicants([applicantId]); // Select the applicant for modal context

      // Ensure hiringProcess is an array before using .find()
      let hiringProcessArray = [];
      if (jobDetails?.hiringProcess) {
        try {
          hiringProcessArray =
            typeof jobDetails.hiringProcess === "string"
              ? JSON.parse(jobDetails.hiringProcess)
              : jobDetails.hiringProcess;
          // Ensure it's actually an array after potential parsing
          if (!Array.isArray(hiringProcessArray)) {
            console.error(
              "Parsed hiringProcess is not an array:",
              hiringProcessArray
            );
            hiringProcessArray = []; // Fallback to empty array
          }
        } catch (error) {
          console.error(
            "Error parsing hiringProcess in handleInitiateMove:",
            error
          );
          hiringProcessArray = []; // Fallback on parsing error
        }
      }

      const stageDefinition = hiringProcessArray.find(
        (stage) => stage.name === targetStage
      );

      if (stageDefinition?.type === "Test") {
        setShowHiringTestModal(true);
      } else if (stageDefinition?.type === "Interview") {
        setShowInterviewModal(true);
      } else {
        // For direct moves like Offer/Reject, confirmation might be handled within HiringWorkflow
        // If confirmation happens there, HiringWorkflow calls updateApplicantStatus directly.
        // If no confirmation needed, or for simpler stages:
        // updateApplicantStatus(applicantId, targetStage);
        // setPendingMove(null); // Clear immediately if no modal
        console.warn(
          `Move to stage "${targetStage}" does not trigger a modal. Confirmation/update handled elsewhere or needs implementation.`
        );
        // Keep pendingMove until Offer/Reject confirmation calls updateApplicantStatus
        if (targetStage !== "Offer" && targetStage !== "Rejected") {
          setPendingMove(null); // Clear if not Offer/Reject
        }
      }
    },
    [applicants, jobDetails]
  ); // Add applicants and jobDetails as dependencies

  // Cancel handlers for modals
  const handleCancelTest = useCallback(() => {
    setShowHiringTestModal(false);
    setPendingMove(null); // Clear pending move on cancel
    setSelectedApplicants([]);
  }, []); // No dependencies needed if only setting state

  const handleCancelInterview = useCallback(() => {
    setShowInterviewModal(false);
    setPendingMove(null); // Clear pending move on cancel
    setSelectedApplicants([]);
  }, []); // No dependencies needed if only setting state

  const updateJobStatus = useCallback(
    async (newStatus) => {
      try {
        setIsActioning(true);
        setActionError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.jobid}/status`,
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
          // Update job details in local state
          setJobDetails((prev) => ({
            ...prev,
            status: newStatus,
          }));

          setShowJobStatusMenu(false);
          setActionSuccess(`Job status updated to ${newStatus}`);
        } else {
          console.error("Failed to update job status");
          setActionError("Failed to update job status. Please try again.");
        }
      } catch (error) {
        console.error("Error updating job status:", error);
        setActionError("Failed to update job status. Please try again.");
      } finally {
        setIsActioning(false);
      }
    },
    [params.jobid]
  ); // Add params.jobid as dependency

  const handleViewDetails = useCallback(async (applicantId) => {
    try {
      setIsLoadingDetails(true); // Use the separate loading state for details
      setActionError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantId}/profile`, // Fetch full details if needed, or use existing data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applicant details.");
      }
      const applicantData = await response.json();
      setSelectedApplicantDetails(applicantData);
      setShowApplicantDetailsModal(true);
    } catch (error) {
      console.error("Failed to fetch applicant details:", error);
      setActionError("Failed to load applicant details.");
      setSelectedApplicantDetails(null); // Clear details on error
    } finally {
      setIsLoadingDetails(false); // Use the separate loading state for details
    }
  }, []); // No dependencies needed if only using applicantId and setting state

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
        return "bg-md-info-container text-md-on-info-container";
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

  // Define handlers for workflow actions to be memoized
  const handleScheduleInterviewClick = useCallback((applicantIds) => {
    setSelectedApplicants(applicantIds);
    setShowInterviewModal(true);
  }, []); // Dependencies: setSelectedApplicants, setShowInterviewModal (usually stable)

  const handleCreateTestClick = useCallback((applicantIds) => {
    setSelectedApplicants(applicantIds);
    setShowHiringTestModal(true);
  }, []); // Dependencies: setSelectedApplicants, setShowHiringTestModal (usually stable)

  return (
    <div className="flex flex-col h-full w-full">
      {" "}
      {/* Removed overflow-y-scroll */}
      <div className="md:pt-5  w-full h-full  md:p-10 flex-grow overflow-auto flex flex-col">
        {" "}
        {/* Keep overflow-auto */}
        <div className="container h-full w-full mx-auto px-4 py-8 relative flex flex-col flex-grow">
          {" "}
          {/* Removed overflow-y-scroll */}
          <Link
            href={`/orgs/hr/jobs/${params.jobid}`}
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
                    {jobDetails.location} • {jobDetails.employmentType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-md-surface-container rounded-full px-3 py-1">
                    <Users className="w-4 h-4 text-md-on-surface-variant" />
                    <span className="text-md-on-surface-variant font-medium">
                      {totalItems} Applicants
                    </span>
                  </div>
                  <div className="relative" ref={jobStatusMenuRef}>
                    {" "}
                    {/* Add ref here */}
                    <button
                      onClick={() => setShowJobStatusMenu(!showJobStatusMenu)}
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                        jobDetails.status === "Filled"
                          ? "bg-md-success-container text-md-on-success-container"
                          : "bg-md-secondary-container text-md-on-secondary-container"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      {jobDetails.status || "Open"}
                    </button>
                    {showJobStatusMenu && (
                      <div className="absolute right-0 mt-1 w-48 bg-md-surface rounded-lg shadow-lg z-10 border border-md-outline-variant overflow-hidden">
                        <div className="px-4 py-2 text-sm font-medium text-md-on-surface border-b border-md-outline-variant">
                          Update Job Status
                        </div>
                        <button
                          onClick={() => updateJobStatus("Open")}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded-full bg-md-secondary-container"></div>
                          Open
                        </button>
                        <button
                          onClick={() => updateJobStatus("Filled")}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded-full bg-md-success-container"></div>
                          Filled
                        </button>
                        <button
                          onClick={() => updateJobStatus("Closed")}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded-full bg-md-error-container"></div>
                          Closed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
              <Link
                href={`/orgs/hr/jobs`}
                className="text-md-on-surface-variant hover:text-md-primary transition-colors px-2 py-1 rounded-lg hover:bg-md-surface-container-high"
              >
                <ArrowLeft className="w-5 h-5 sm:hidden" />
                <span className="hidden sm:inline">View All Jobs</span>
              </Link>

              <div className="flex bg-md-surface-container-high rounded-full border border-md-outline overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 flex items-center gap-1 text-sm ${
                    viewMode === "list"
                      ? "bg-md-primary text-md-on-primary"
                      : "bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-1.5 flex items-center gap-1 text-sm ${
                    viewMode === "kanban"
                      ? "bg-md-primary text-md-on-primary"
                      : "bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant"
                  }`}
                >
                  <KanbanSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Kanban</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              {selectedApplicants.length > 0 ? (
                <>
                  <div className="px-3 py-1 rounded-full bg-md-primary-container text-md-on-primary-container text-sm flex items-center gap-1 mr-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{selectedApplicants.length} selected</span>
                  </div>
                  <motion.button
                    onClick={() => setShowHiringTestModal(true)}
                    className="px-3 sm:px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200 flex items-center gap-2"
                    whileTap={{ scale: 0.95 }}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Create Test</span>
                    <span className="sm:hidden">Test</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setShowInterviewModal(true)}
                    className="px-3 sm:px-6 py-2 rounded-full bg-md-primary-container text-md-on-primary-container hover:bg-md-secondary-container hover:text-md-on-secondary-container transition-colors duration-200 flex items-center gap-2"
                    whileTap={{ scale: 0.95 }}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Schedule Interview</span>
                    <span className="sm:hidden">Interview</span>
                  </motion.button>
                </>
              ) : (
                <div className="hidden sm:block text-md-on-surface-variant text-sm">
                  Select applicants to perform actions
                </div>
              )}
            </div>
          </div>
          {/* Only show search and filter UI in list mode */}
          {viewMode === "list" && (
            <div className="bg-md-surface-container p-4 rounded-xl mb-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email or skills..."
                    className="block w-full pl-12 pr-6 pt-3 pb-3 rounded-full text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-md-surface text-md-on-surface"
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

              <div className="w-full sm:w-40">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full px-6 py-3 rounded-full text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-md-surface text-md-on-surface pr-10"
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

              {viewMode === "list" && (
                <div className="w-full sm:w-36">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="block w-full px-6 py-3 rounded-full text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-md-surface text-md-on-surface"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
              )}
            </div>
          )}
          {viewMode === "kanban" ? (
            <Suspense
              fallback={<LoadingComponent message="Loading kanban board..." />}
            >
              <HiringWorkflow
                applicants={filteredApplicants} // Use filtered applicants for Kanban
                onMoveApplicant={updateApplicantStatus} // Pass memoized callback
                onViewDetails={handleViewDetails} // Pass memoized callback
                onScheduleInterview={handleScheduleInterviewClick} // Pass memoized callback
                onCreateTest={handleCreateTestClick} // Pass memoized callback
                jobDetails={jobDetails}
                isLoading={isLoading} // Pass isLoading state
                onUpdateJobStatus={updateJobStatus} // Pass memoized callback
                handleInitiateMove={handleInitiateMove} // Pass memoized callback
              />
            </Suspense>
          ) : (
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
                <>
                  {/* Desktop Table View */}
                  <div className="overflow-auto flex-grow hidden md:block">
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
                                  selectedApplicants.length ===
                                    applicants.length
                                }
                              />
                              <span className="ml-2">Select All</span>
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
                                checked={selectedApplicants.includes(
                                  applicant.id
                                )}
                                onChange={() =>
                                  handleShortlistToggle(applicant.id)
                                }
                                className="h-5 w-5 text-md-primary border-md-outline rounded focus:ring-md-primary focus:ring-2"
                              />
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-md-surface-container-high border border-md-outline flex-shrink-0">
                                  <img
                                    src={applicant.Candidate.profilePicture}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "/default-avatar.png";
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div
                                    className="text-base font-medium text-md-on-surface hover:text-md-primary cursor-pointer"
                                    onClick={() =>
                                      handleViewDetails(applicant.id)
                                    }
                                  >
                                    {applicant.Candidate.firstName}{" "}
                                  </div>
                                  <div className="text-sm text-md-on-surface-variant">
                                    {applicant.Candidate.email}
                                  </div>
                                  {applicant.tags &&
                                    applicant.tags.length > 0 && (
                                      <div className="flex gap-1 mt-1 flex-wrap">
                                        {applicant.tags
                                          .slice(0, 2)
                                          .map((tag, i) => (
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
                                  ref={dropdownRef} // Keep ref for desktop dropdown
                                  className="absolute right-0 mt-2 w-60 rounded-xl shadow-lg bg-md-surface z-10 border border-md-outline overflow-hidden"
                                >
                                  {/* Desktop Dropdown Content */}
                                  <div className="p-1">
                                    <button
                                      onClick={() =>
                                        handleViewDetails(applicant.id)
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg flex items-center gap-2"
                                    >
                                      <User className="w-4 h-4" /> View Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedApplicants([applicant.id]);
                                        setShowInterviewModal(true);
                                        setOpenStatusDropdown(null);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg flex items-center gap-2"
                                    >
                                      <Calendar className="w-4 h-4" /> Schedule
                                      Interview
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedApplicants([applicant.id]);
                                        setShowHiringTestModal(true);
                                        setOpenStatusDropdown(null);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg flex items-center gap-2"
                                    >
                                      <FileText className="w-4 h-4" /> Create
                                      Assessment
                                    </button>
                                    <div className="my-1 border-t border-md-outline-variant"></div>
                                    <div className="px-4 pt-2 pb-1 text-xs font-medium text-md-on-surface-variant">
                                      Change Status
                                    </div>
                                    {/* Status change buttons */}
                                    <button
                                      onClick={() =>
                                        updateApplicantStatus(
                                          applicant.id,
                                          "Applied"
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg"
                                    >
                                      Applied
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicantStatus(
                                          applicant.id,
                                          "Shortlisted"
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg"
                                    >
                                      Shortlisted
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicantStatus(
                                          applicant.id,
                                          "Assessment"
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg"
                                    >
                                      Assessment
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicantStatus(
                                          applicant.id,
                                          "Interview"
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg"
                                    >
                                      Interview
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicantStatus(
                                          applicant.id,
                                          "Offer"
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant rounded-lg"
                                    >
                                      Offer
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateApplicantStatus(
                                          applicant.id,
                                          "Rejected"
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm text-md-error hover:bg-md-error-container/20 rounded-lg"
                                    >
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

                  {/* Mobile Card View */}
                  <div className="md:hidden overflow-auto flex-grow">
                    <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-md-surface-container">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-md-primary border-md-outline rounded focus:ring-md-primary"
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
                        <span className="ml-2 text-xs font-medium text-md-on-surface-variant">
                          Select All
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-md-outline-variant">
                      {filteredApplicants.map((applicant) => (
                        <motion.div
                          key={applicant.id}
                          className={`p-4 ${
                            selectedApplicants.includes(applicant.id)
                              ? "bg-md-primary-container/10"
                              : ""
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedApplicants.includes(
                                  applicant.id
                                )}
                                onChange={() =>
                                  handleShortlistToggle(applicant.id)
                                }
                                className="h-5 w-5 text-md-primary border-md-outline rounded focus:ring-md-primary mr-3"
                              />
                              <div
                                className="flex-shrink-0"
                                onClick={() => handleViewDetails(applicant.id)}
                              >
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-md-surface-container-high border border-md-outline">
                                  <img
                                    src={applicant.Candidate.profilePicture}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "/default-avatar.png";
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <span
                                className={`inline-flex text-xs leading-5 font-medium rounded-full px-2 py-1 ${getStatusBadgeClass(
                                  applicant.status
                                )}`}
                              >
                                {applicant.status}
                              </span>
                              <button
                                className="ml-2 p-2 hover:bg-md-surface-container-high rounded-full text-md-on-surface-variant"
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
                                  className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center"
                                  onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                      setOpenStatusDropdown(null);
                                    }
                                  }}
                                >
                                  <motion.div
                                    className="bg-md-surface rounded-t-xl w-full max-h-[80vh] overflow-auto"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                  >
                                    <div className="px-4 py-3 text-md font-medium text-md-on-surface border-b border-md-outline-variant sticky top-0 bg-md-surface z-10 flex justify-between items-center">
                                      <div>
                                        Actions for{" "}
                                        {applicant.Candidate.firstName}
                                      </div>
                                      <button
                                        onClick={() =>
                                          setOpenStatusDropdown(null)
                                        }
                                        className="rounded-full p-1 hover:bg-md-surface-variant"
                                      >
                                        <XCircle className="w-5 h-5" />
                                      </button>
                                    </div>
                                    <div className="p-2">
                                      <button
                                        onClick={() => {
                                          handleViewDetails(applicant.id);
                                          setOpenStatusDropdown(null);
                                        }}
                                        className="block px-4 py-3 text-md text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-3 rounded-lg"
                                      >
                                        <User className="w-5 h-5" />
                                        View Details
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedApplicants([applicant.id]);
                                          setShowInterviewModal(true);
                                          setOpenStatusDropdown(null);
                                        }}
                                        className="block px-4 py-3 text-md text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-3 rounded-lg"
                                      >
                                        <Calendar className="w-5 h-5" />
                                        Schedule Interview
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedApplicants([applicant.id]);
                                          setShowHiringTestModal(true);
                                          setOpenStatusDropdown(null);
                                        }}
                                        className="block px-4 py-3 text-md text-md-on-surface hover:bg-md-surface-variant w-full text-left flex items-center gap-3 rounded-lg"
                                      >
                                        <FileText className="w-5 h-5" />
                                        Create Assessment
                                      </button>
                                    </div>
                                    <div className="px-4 py-2 text-md font-medium text-md-on-surface border-b border-t border-md-outline-variant">
                                      Change status
                                    </div>
                                    <div className="p-2 grid grid-cols-2 gap-2">
                                      <button
                                        onClick={() =>
                                          updateApplicantStatus(
                                            applicant.id,
                                            "Applied"
                                          )
                                        }
                                        className="flex flex-col items-center justify-center py-3 px-2 rounded-lg hover:bg-md-surface-variant"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-md-secondary-container mb-1"></div>
                                        <span className="text-sm">Applied</span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateApplicantStatus(
                                            applicant.id,
                                            "Shortlisted"
                                          )
                                        }
                                        className="flex flex-col items-center justify-center py-3 px-2 rounded-lg hover:bg-md-surface-variant"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-md-tertiary-container mb-1"></div>
                                        <span className="text-sm">
                                          Shortlisted
                                        </span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateApplicantStatus(
                                            applicant.id,
                                            "Assessment"
                                          )
                                        }
                                        className="flex flex-col items-center justify-center py-3 px-2 rounded-lg hover:bg-md-surface-variant"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-md-primary-container mb-1"></div>
                                        <span className="text-sm">
                                          Assessment
                                        </span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateApplicantStatus(
                                            applicant.id,
                                            "Interview"
                                          )
                                        }
                                        className="flex flex-col items-center justify-center py-3 px-2 rounded-lg hover:bg-md-surface-variant"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-md-info-container mb-1"></div>
                                        <span className="text-sm">
                                          Interview
                                        </span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateApplicantStatus(
                                            applicant.id,
                                            "Offer"
                                          )
                                        }
                                        className="flex flex-col items-center justify-center py-3 px-2 rounded-lg hover:bg-md-surface-variant"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-md-success-container mb-1"></div>
                                        <span className="text-sm">Offer</span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateApplicantStatus(
                                            applicant.id,
                                            "Rejected"
                                          )
                                        }
                                        className="flex flex-col items-center justify-center py-3 px-2 rounded-lg hover:bg-md-surface-variant"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-md-error-container mb-1"></div>
                                        <span className="text-sm text-md-error">
                                          Rejected
                                        </span>
                                      </button>
                                    </div>
                                  </motion.div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 pl-10">
                            <div
                              className="text-base font-medium text-md-on-surface"
                              onClick={() => handleViewDetails(applicant.id)}
                            >
                              {applicant.name}
                            </div>
                            <div className="text-sm text-md-on-surface-variant">
                              {applicant.email}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-md-on-surface-variant">
                                Applied{" "}
                                {new Date(
                                  applicant.createdAt
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>

                              {applicant.score ? (
                                <div className="flex items-center gap-1">
                                  <div className="w-12 h-2 bg-md-surface-container-high rounded-full overflow-hidden">
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
                                  <span className="text-xs font-medium text-md-on-surface">
                                    {applicant.score}%
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {applicant.tags && applicant.tags.length > 0 && (
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {applicant.tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {applicant.tags.length > 3 && (
                                  <span className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full">
                                    +{applicant.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {viewMode === "list" &&
            !isLoading &&
            filteredApplicants.length > 0 && (
              <div className="mt-4 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-t border-md-outline-variant bg-md-surface-container-high shadow-md rounded-xl">
                <div className="flex justify-between w-full sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === 1 || isLoading
                        ? "text-md-on-surface-variant bg-md-surface-variant cursor-not-allowed"
                        : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-sm text-md-on-surface-variant">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === totalPages || isLoading
                        ? "text-md-on-surface-variant bg-md-surface-variant cursor-not-allowed"
                        : "text-md-on-surface bg-md-surface-container-high hover:bg-md-surface-variant"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
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

                      {/* ...existing pagination buttons... */}

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
          {/* ...existing code for modals... */}
          {showHiringTestModal && (
            <HiringTestForm
              onSubmit={handleCreateHiringTest}
              onCancel={handleCancelTest} // Pass cancel handler
            />
          )}
          {showInterviewModal && (
            <InterviewForm
              onSubmit={handleScheduleInterview}
              onCancel={handleCancelInterview} // Pass cancel handler
              // Pass only the selected applicant for the interview
              attendees={applicants.filter((a) =>
                selectedApplicants.includes(a.id)
              )}
              jobId={params.jobid}
            />
          )}
          {showApplicantDetailsModal && selectedApplicantDetails && (
            <ApplicantDetailsModal
              applicant={selectedApplicantDetails}
              jobDetails={jobDetails}
              onClose={() => {
                setShowApplicantDetailsModal(false);
                setSelectedApplicantDetails(null); // Clear details on close
              }}
              onUpdateStatus={(newStatus, notes) =>
                updateApplicantStatus(
                  selectedApplicantDetails.id,
                  newStatus,
                  notes ? { offerNotes: notes } : null
                )
              }
              isLoading={isLoadingDetails} // Pass the details loading state
            />
          )}
        </div>
      </div>
    </div>
  );
}
