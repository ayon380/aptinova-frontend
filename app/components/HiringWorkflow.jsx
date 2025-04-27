"use client";
import React, { useState, useEffect, memo } from "react"; // Import React and memo
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  User, // Ensure User is imported
  FileText, // Ensure FileText is imported
  VideoIcon, // Ensure VideoIcon is imported
  Award, // Ensure Award is imported
  XCircle, // Ensure XCircle is imported
  Eye,
  MoreVertical,
  Clock,
  Star,
  CalendarClock,
  MessageSquare,
  Loader2,
  AlertCircle,
  X,
  Mail,
  Trophy,
  BarChart,
} from "lucide-react"; // Add missing icons here
import Image from "next/image";

// Define stage type to icon mapping
const StageTypeIcons = {
  Shortlist: User,
  Test: FileText,
  Interview: VideoIcon,
  Onboard: Award,
  Rejected: XCircle,
};

// Define stage type to color mapping
const StageTypeColors = {
  Shortlist: "bg-md-secondary-container text-md-on-secondary-container",
  Test: "bg-md-primary-container text-md-on-primary-container",
  Interview: "bg-md-info-container text-md-on-info-container",
  Onboard: "bg-md-success-container text-md-on-success-container",
  Rejected: "bg-md-error-container text-md-on-error-container",
};

const HiringWorkflow = ({
  applicants = [],
  onMoveApplicant,
  onViewDetails, // This is the function to open the modal
  handleInitiateMove,
  jobDetails,
  isLoading,
  isTopCandidatesMode = false,
  onUpdateJobStatus,
}) => {
  const [columns, setColumns] = useState({});
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(null);
  const [showOfferConfirm, setShowOfferConfirm] = useState(null);
  const [offerNotes, setOfferNotes] = useState("");
  const [markJobFilled, setMarkJobFilled] = useState(false);
  const [processStages, setProcessStages] = useState([]);

  // Parse hiring process from job details
  useEffect(() => {
    if (jobDetails && jobDetails.hiringProcess) {
      try {
        const hiringProcess =
          typeof jobDetails.hiringProcess === "string"
            ? JSON.parse(jobDetails.hiringProcess)
            : jobDetails.hiringProcess;

        // Add stages from hiring process
        const stages = hiringProcess.map((step, index) => ({
          id: step.name,
          title: step.name,
          type: step.type,
          description: step.description,
          order: index + 1,
        }));

        // Always add Rejected as the final stage
        stages.push({
          id: "Rejected",
          title: "Rejected",
          type: "Rejected",
          description: "Rejected candidates",
          order: stages.length + 1,
        });

        setProcessStages(stages);
      } catch (error) {
        console.error("Error parsing hiring process:", error);
        // Fallback to default stages if parsing fails
        setProcessStages([
          {
            id: "Resume Screening",
            title: "Resume Screening",
            type: "Shortlist",
            order: 1,
          },
          {
            id: "Technical Test 1",
            title: "Technical Test 1",
            type: "Test",
            order: 2,
          },
          {
            id: "Technical Interview",
            title: "Technical Interview",
            type: "Interview",
            order: 3,
          },
          {
            id: "HR Interview",
            title: "HR Interview",
            type: "Interview",
            order: 4,
          },
          { id: "Offer", title: "Offer", type: "Onboard", order: 5 },
          { id: "Rejected", title: "Rejected", type: "Rejected", order: 6 },
        ]);
      }
    }
  }, [jobDetails]);

  // Initialize columns based on process stages and applicants
  useEffect(() => {
    if (processStages.length > 0 && applicants.length > 0) {
      const initialColumns = processStages.reduce(
        (acc, stage) => ({
          ...acc,
          [stage.id]: {
            id: stage.id,
            title: stage.title,
            type: stage.type,
            applicantIds: [],
          },
        }),
        {}
      );

      // Distribute applicants to their proper columns
      applicants.forEach((applicant) => {
        let placed = false;
        const applicantStageName = applicant.status;

        // Find the column matching the applicant's status
        const matchingStage = processStages.find(
          (stage) =>
            stage.title === applicantStageName ||
            stage.id === applicantStageName
        );

        if (matchingStage && initialColumns[matchingStage.id]) {
          initialColumns[matchingStage.id].applicantIds.push(applicant.id);
          placed = true;
        }

        // Fallback to the first stage if no match found
        if (!placed) {
          const firstStage = processStages[0];
          if (firstStage && initialColumns[firstStage.id]) {
            initialColumns[firstStage.id].applicantIds.push(applicant.id);
          } else if (initialColumns["Resume Screening"]) {
            initialColumns["Resume Screening"].applicantIds.push(applicant.id);
          }
        }
      });

      setColumns(initialColumns);
    } else if (processStages.length > 0) {
      const initialColumns = processStages.reduce(
        (acc, stage) => ({
          ...acc,
          [stage.id]: {
            id: stage.id,
            title: stage.title,
            type: stage.type,
            applicantIds: [],
          },
        }),
        {}
      );
      setColumns(initialColumns);
    }
  }, [processStages, applicants]);

  const applicantsById = applicants.reduce(
    (acc, applicant) => ({
      ...acc,
      [applicant.id]: applicant,
    }),
    {}
  );

  // Sort columns by their order property
  const getSortedStages = () => {
    return [...processStages]
      .sort((a, b) => a.order - b.order)
      .map((stage) => stage.id);
  };

  const sortApplicantsByScore = (applicantIds, stageId) => {
    if (!isTopCandidatesMode) return applicantIds;

    return [...applicantIds].sort((idA, idB) => {
      const appA = applicantsById[idA];
      const appB = applicantsById[idB];

      if (!appA || !appB) return 0;

      if (stageId === "Assessment") {
        const scoreA = getAssessmentScore(appA) || 0;
        const scoreB = getAssessmentScore(appB) || 0;
        return scoreB - scoreA;
      } else if (stageId === "Interview") {
        const scoreA = getInterviewScore(appA) || 0;
        const scoreB = getInterviewScore(appB) || 0;
        return scoreB - scoreA;
      } else {
        const scoreA = appA.score || 0;
        const scoreB = appB.score || 0;
        return scoreB - scoreA;
      }
    });
  };

  const getApplicantRank = (applicantId, stageId) => {
    if (!isTopCandidatesMode) return null;

    const stageApplicants = columns[stageId]?.applicantIds || [];
    const sortedIds = sortApplicantsByScore(stageApplicants, stageId);

    return sortedIds.indexOf(applicantId) + 1;
  };

  // Function to check if a move is a downgrade
  const isDowngrade = (sourceStageId, destinationStageId) => {
    // Rejected is always allowed
    if (destinationStageId === "Rejected") return false;

    const sourceIndex = processStages.findIndex(
      (stage) => stage.id === sourceStageId
    );
    const destIndex = processStages.findIndex(
      (stage) => stage.id === destinationStageId
    );

    // If destIndex is smaller than sourceIndex, it's a downgrade
    return destIndex < sourceIndex;
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Prevent downgrades (except to Rejected)
    if (isDowngrade(source.droppableId, destination.droppableId)) {
      console.warn(
        "Downgrading applicant stage is not allowed (except to Rejected)."
      );
      return;
    }

    const targetStageId = destination.droppableId;
    const sourceStageId = source.droppableId;
    const stageDefinition = processStages.find(
      (stage) => stage.id === targetStageId
    );

    // Update UI optimistically for smoother drag feel *only* for non-modal moves or within same column
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newApplicantIds = Array.from(column.applicantIds);
      newApplicantIds.splice(source.index, 1);
      newApplicantIds.splice(destination.index, 0, draggableId);
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: { ...column, applicantIds: newApplicantIds },
      }));
      return;
    }

    // Handle moves based on target stage type
    if (
      stageDefinition?.type === "Test" ||
      stageDefinition?.type === "Interview"
    ) {
      handleInitiateMove(draggableId, targetStageId, sourceStageId);
    } else if (targetStageId === "Offer") {
      setShowOfferConfirm({
        applicantId: draggableId,
        sourceStage: sourceStageId,
      });
      const startColumn = columns[sourceStageId];
      const endColumn = columns[targetStageId];
      const startApplicantIds = startColumn.applicantIds.filter(
        (id) => id !== draggableId
      );
      const endApplicantIds = [draggableId, ...endColumn.applicantIds];
      setColumns((prev) => ({
        ...prev,
        [sourceStageId]: { ...startColumn, applicantIds: startApplicantIds },
        [targetStageId]: { ...endColumn, applicantIds: endApplicantIds },
      }));
    } else if (targetStageId === "Rejected") {
      setShowRejectConfirm({
        applicantId: draggableId,
        sourceStage: sourceStageId,
      });
      const startColumn = columns[sourceStageId];
      const endColumn = columns[targetStageId];
      const startApplicantIds = startColumn.applicantIds.filter(
        (id) => id !== draggableId
      );
      const endApplicantIds = [draggableId, ...endColumn.applicantIds];
      setColumns((prev) => ({
        ...prev,
        [sourceStageId]: { ...startColumn, applicantIds: startApplicantIds },
        [targetStageId]: { ...endColumn, applicantIds: endApplicantIds },
      }));
    } else {
      onMoveApplicant(draggableId, targetStageId);
      const startColumn = columns[sourceStageId];
      const endColumn = columns[targetStageId];
      const startApplicantIds = startColumn.applicantIds.filter(
        (id) => id !== draggableId
      );
      const endApplicantIds = [draggableId, ...endColumn.applicantIds];
      setColumns((prev) => ({
        ...prev,
        [sourceStageId]: { ...startColumn, applicantIds: startApplicantIds },
        [targetStageId]: { ...endColumn, applicantIds: endApplicantIds },
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getApplicantScore = (applicant) => {
    if (!applicant) return null;
    return applicant.score;
  };

  const getInterviewScore = (applicant) => {
    if (!applicant?.hiringProcess) return null;
    try {
      const process = JSON.parse(applicant.hiringProcess);
      const interviewStep = process.find(
        (step) =>
          step.type?.toLowerCase() === "interview" &&
          step.status === "completed"
      );
      return interviewStep?.score || null;
    } catch (e) {
      console.error("Error parsing interview score", e);
      return null;
    }
  };

  const getAssessmentScore = (applicant) => {
    if (!applicant?.hiringProcess) return null;
    try {
      const process = JSON.parse(applicant.hiringProcess);
      const assessmentStep = process.find(
        (step) =>
          step.type?.toLowerCase() === "test" && step.status === "completed"
      );
      return assessmentStep?.score || null;
    } catch (e) {
      console.error("Error parsing assessment score", e);
      return null;
    }
  };

  const getInterviewComments = (applicant) => {
    if (!applicant?.hiringProcess) return null;
    try {
      const process = JSON.parse(applicant.hiringProcess);
      const interviewStep = process.find(
        (step) => step.type?.toLowerCase() === "interview"
      );
      return interviewStep?.comments || null;
    } catch (e) {
      console.error("Error parsing interview comments", e);
      return null;
    }
  };

  const handleRejectConfirm = () => {
    if (showRejectConfirm) {
      onMoveApplicant(showRejectConfirm.applicantId, "Rejected");
      setShowRejectConfirm(null);
    }
  };

  const handleOfferConfirm = () => {
    if (showOfferConfirm) {
      onMoveApplicant(showOfferConfirm.applicantId, "Offer", {
        offerNotes: offerNotes,
      });

      if (markJobFilled) {
        onUpdateJobStatus("Filled");
      }

      setShowOfferConfirm(null);
      setOfferNotes("");
      setMarkJobFilled(false);
    }
  };

  const handleCancelAction = (type) => {
    let applicantIdToRevert = null;
    let sourceStageId = null;
    let targetStageId = null;

    if (type === "reject" && showRejectConfirm) {
      applicantIdToRevert = showRejectConfirm.applicantId;
      sourceStageId = showRejectConfirm.sourceStage;
      targetStageId = "Rejected";
      setShowRejectConfirm(null);
    } else if (type === "offer" && showOfferConfirm) {
      applicantIdToRevert = showOfferConfirm.applicantId;
      sourceStageId = showOfferConfirm.sourceStage;
      targetStageId = "Offer";
      setShowOfferConfirm(null);
      setOfferNotes("");
      setMarkJobFilled(false);
    }

    if (applicantIdToRevert && sourceStageId && targetStageId) {
      // Use a functional update to ensure we're working with the latest state
      setColumns((prevColumns) => {
        // Get the current source and target columns
        const sourceColumn = prevColumns[sourceStageId];
        const targetColumn = prevColumns[targetStageId];

        // Check if the applicant is already in the source column
        const applicantAlreadyInSource = sourceColumn.applicantIds.includes(applicantIdToRevert);
        
        // Create new applicantIds arrays
        const newSourceApplicantIds = applicantAlreadyInSource 
          ? sourceColumn.applicantIds 
          : [applicantIdToRevert, ...sourceColumn.applicantIds];
        
        const newTargetApplicantIds = targetColumn.applicantIds.filter(
          id => id !== applicantIdToRevert
        );
        
        // Return the updated columns state
        return {
          ...prevColumns,
          [sourceStageId]: { 
            ...sourceColumn, 
            applicantIds: newSourceApplicantIds 
          },
          [targetStageId]: { 
            ...targetColumn, 
            applicantIds: newTargetApplicantIds 
          }
        };
      });
    }
  };

  if (isLoading || (Object.keys(columns).length === 0 && processStages.length > 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-md-primary animate-spin" />
        <span className="ml-2 text-md-on-surface-variant">
          Loading workflow...
        </span>
      </div>
    );
  }

  const sortedStages = getSortedStages();

  return (
    <div className="mt-6 md:w-[71vw] relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className=" overflow-hidden">
          <div className="flex flex-col md:flex-row md:overflow-x-auto overflow-y-auto pb-4 gap-4 max-h-[calc(100vh-180px)]">
            {sortedStages.map((columnId) => {
              const column = columns[columnId];
              if (!column) {
                return (
                  <div
                    key={columnId}
                    className="flex-shrink-0 w-full md:w-80 flex flex-col bg-md-surface-container rounded-xl shadow-sm border border-md-outline-variant mb-4 md:mb-0 p-4 items-center justify-center"
                  >
                    <Loader2 className="w-6 h-6 text-md-primary animate-spin" />
                    <span className="mt-2 text-sm text-md-on-surface-variant">
                      Loading stage...
                    </span>
                  </div>
                );
              }
              const stage =
                processStages.find((stage) => stage.id === columnId) || {};

              return (
                <div
                  key={columnId}
                  className="flex-shrink-0 w-full md:w-80 flex flex-col bg-md-surface-container rounded-xl shadow-sm overflow-hidden border border-md-outline-variant mb-4 md:mb-0"
                >
                  <div
                    className={`px-4 py-3 flex items-center justify-between ${
                      StageTypeColors[stage.type] ||
                      "bg-md-surface-variant text-md-on-surface-variant"
                    }`}
                  >
                    <div className="flex items-center">
                      {/* {(StageTypeIcons[stage.type] || User)({
                        className: "w-5 h-5 mr-2",
                      })} */}
                      <h3 className="font-medium">{column.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-white/20 px-2 py-0.5 text-sm font-medium">
                        {column.applicantIds.length}
                      </div>
                    </div>
                  </div>

                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow p-2 overflow-y-auto min-h-[500px] ${
                          snapshot.isDraggingOver
                            ? "bg-md-surface-container-high"
                            : "bg-md-surface-container-low"
                        }`}
                      >
                        {column.applicantIds.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-md-on-surface-variant text-sm opacity-60 p-4 border-2 border-dashed border-md-outline-variant rounded-lg">
                            <User className="w-8 h-8 mb-2" />
                            <p>No applicants in this stage</p>
                            <p>Drag candidates here</p>
                          </div>
                        )}

                        {column.applicantIds.map((applicantId, index) => {
                          const applicant = applicantsById[applicantId];
                          if (!applicant) return null;

                          const assessmentScore = getAssessmentScore(applicant);
                          const interviewScore = getInterviewScore(applicant);
                          const interviewComments =
                            getInterviewComments(applicant);

                          const rank = isTopCandidatesMode
                            ? getApplicantRank(applicantId, columnId)
                            : null;
                          const isTopThree = rank && rank <= 3;

                          return (
                            <Draggable
                              key={applicantId}
                              draggableId={applicantId}
                              index={index}
                            >
                              {(providedDraggable, snapshotDraggable) => (
                                <div
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                  onClick={(e) => {
                                    // Prevent click handling if dragging
                                    if (!snapshotDraggable.isDragging) {
                                      onViewDetails(applicantId);
                                    }
                                  }}
                                  className={`mb-2 p-3 bg-md-surface rounded-lg border cursor-pointer ${
                                    snapshotDraggable.isDragging
                                      ? "border-md-primary shadow-md"
                                      : isTopThree
                                      ? "border-md-tertiary shadow-sm"
                                      : "border-md-outline-variant hover:border-md-outline" // Add hover effect
                                  } ${isTopThree ? "relative" : ""}`}
                                >
                                  {rank && rank <= 5 && (
                                    <div
                                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                                        rank === 1
                                          ? "bg-yellow-500 text-black"
                                          : rank === 2
                                          ? "bg-gray-300 text-black"
                                          : rank === 3
                                          ? "bg-amber-700 text-white"
                                          : "bg-md-tertiary-container text-md-on-tertiary-container"
                                      } text-xs font-bold shadow-sm z-10`}
                                    >
                                      {rank}
                                    </div>
                                  )}

                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center overflow-hidden mr-2">
                                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-md-surface-container-high border border-md-outline flex-shrink-0">
                                        {applicant.Candidate?.profilePicture ? (
                                          <Image
                                            src={
                                              applicant.Candidate.profilePicture
                                            }
                                            alt={`${
                                              applicant.Candidate.firstName || ""
                                            } profile picture`}
                                            layout="fill"
                                            objectFit="cover"
                                            onError={(e) => {
                                              e.target.src =
                                                "/default-avatar.png";
                                            }}
                                          />
                                        ) : (
                                          <User className="h-6 w-6 m-2 text-md-on-surface-variant" />
                                        )}
                                      </div>
                                      <div className="ml-2 overflow-hidden">
                                        <h4 className="font-medium text-md-on-surface truncate">
                                          {applicant.Candidate?.firstName ||
                                            "N/A"}{" "}
                                          {applicant.Candidate?.lastName || ""}
                                        </h4>
                                        <p className="text-xs text-md-on-surface-variant truncate">
                                          {applicant.Candidate?.email || "N/A"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent card click when opening menu
                                          setShowActionMenu(
                                            showActionMenu === applicantId
                                              ? null
                                              : applicantId
                                          );
                                        }}
                                        className="p-1 hover:bg-md-surface-container-high rounded-full text-md-on-surface-variant flex-shrink-0"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>

                                      {showActionMenu === applicantId && (
                                        <div className="absolute right-0 mt-1 w-48 bg-md-surface rounded-lg shadow-lg z-10 border border-md-outline-variant overflow-hidden">
                                          {stage?.type === "Interview" &&
                                            processStages[
                                              processStages.findIndex(
                                                (s) => s.id === columnId
                                              ) + 1
                                            ]?.type === "Onboard" && (
                                              <button
                                                onClick={(e) => { // Add stopPropagation
                                                  e.stopPropagation();
                                                  setShowOfferConfirm({
                                                    applicantId: applicantId,
                                                    sourceStage: columnId,
                                                  });
                                                  setShowActionMenu(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-md-success hover:bg-md-success-container/20 flex items-center gap-2"
                                              >
                                                <Award className="w-4 h-4" />
                                                Make Offer
                                              </button>
                                            )}
                                          {columnId !== "Rejected" && (
                                            <button
                                              onClick={(e) => { // Add stopPropagation
                                                e.stopPropagation();
                                                setShowRejectConfirm({
                                                  applicantId: applicantId,
                                                  sourceStage: columnId,
                                                });
                                                setShowActionMenu(null);
                                              }}
                                              className="w-full text-left px-4 py-2 text-sm text-md-error hover:bg-md-error-container/20 flex items-center gap-2"
                                            >
                                              <XCircle className="w-4 h-4" />
                                              Reject Applicant
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-2">
                                    {applicant.Candidate?.skills &&
                                      applicant.Candidate.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {applicant.Candidate.skills
                                            .slice(0, 3)
                                            .map((tag, i) => (
                                              <span
                                                key={i}
                                                className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          {applicant.Candidate.skills.length >
                                            3 && (
                                            <span className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full">
                                              +
                                              {applicant.Candidate.skills.length -
                                                3}
                                            </span>
                                          )}
                                        </div>
                                      )}

                                    {isTopThree && (
                                      <div className="mt-2 flex items-center gap-1 text-xs bg-md-tertiary-container/30 rounded-full px-2 py-0.5">
                                        <Trophy className="w-3.5 h-3.5 text-md-tertiary" />
                                        <span className="font-medium text-md-tertiary">
                                          {rank === 1
                                            ? "Top Candidate"
                                            : `Top ${rank} Candidate`}
                                        </span>
                                      </div>
                                    )}

                                    {assessmentScore !== null && (
                                      <div className="mt-2 flex items-center gap-1 text-xs">
                                        <BarChart className="w-3.5 h-3.5 text-md-primary" />
                                        <span
                                          className={`font-medium ${
                                            assessmentScore >= 70
                                              ? "text-md-success"
                                              : assessmentScore >= 40
                                              ? "text-md-warning"
                                              : "text-md-error"
                                          }`}
                                        >
                                          Assessment: {assessmentScore}%
                                        </span>
                                      </div>
                                    )}

                                    {interviewScore !== null && (
                                      <div className="mt-1 flex items-center gap-1 text-xs">
                                        <VideoIcon className="w-3.5 h-3.5 text-md-info" />
                                        <span
                                          className={`font-medium ${
                                            interviewScore >= 70
                                              ? "text-md-success"
                                              : interviewScore >= 40
                                              ? "text-md-warning"
                                              : "text-md-error"
                                          }`}
                                        >
                                          Interview: {interviewScore}%
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-2 flex justify-between text-xs text-md-on-surface-variant">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDate(applicant.createdAt)}
                                      </span>
                                      {getApplicantScore(applicant) !== null && (
                                        <span
                                          className={`flex items-center gap-1 font-medium ${
                                            applicant.score >= 70
                                              ? "text-md-success"
                                              : applicant.score >= 40
                                              ? "text-md-warning"
                                              : "text-md-error"
                                          }`}
                                        >
                                          <Star className="w-3.5 h-3.5" />
                                          {applicant.score}%
                                        </span>
                                      )}
                                  </div>

                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {/* Rejection Confirmation Dialog */}
      <AnimatePresence>
        {showRejectConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleCancelAction("reject")}
          >
            <motion.div
              className="bg-md-surface rounded-3xl shadow-xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-md-error-container p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/90 p-3 rounded-full">
                      <AlertCircle className="w-6 h-6 text-md-error" />
                    </div>
                    <h3 className="text-xl font-semibold text-md-on-error-container">
                      Confirm Rejection
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCancelAction("reject")}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-md-on-error-container" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-md-on-surface-variant mb-4">
                  Are you sure you want to reject this applicant? This action
                  will move them to the rejected stage and notify the candidate.
                </p>

                <div className="bg-md-surface-container-low rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    {applicantsById[showRejectConfirm?.applicantId]?.Candidate
                      ?.profilePicture ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-md-outline">
                        <Image
                          src={
                            applicantsById[showRejectConfirm?.applicantId]
                              .Candidate.profilePicture
                          }
                          alt=""
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-md-secondary-container flex items-center justify-center">
                        <User className="w-6 h-6 text-md-on-secondary-container" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-md-on-surface">
                        {applicantsById[showRejectConfirm?.applicantId]
                          ?.Candidate?.firstName || "Applicant"}{" "}
                        {applicantsById[showRejectConfirm?.applicantId]
                          ?.Candidate?.lastName || ""}
                      </p>
                      <p className="text-sm text-md-on-surface-variant">
                        {applicantsById[showRejectConfirm?.applicantId]
                          ?.Candidate?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={() => handleCancelAction("reject")}
                    className="px-5 py-2.5 rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-surface-container-high transition-colors"
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleRejectConfirm}
                    className="px-5 py-2.5 rounded-full bg-md-error text-md-on-error hover:bg-md-error/90 transition-colors flex items-center gap-2 shadow-sm"
                    whileTap={{ scale: 0.97 }}
                  >
                    <XCircle className="w-4 h-4" />
                    Confirm Rejection
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Confirmation Dialog */}
      <AnimatePresence>
        {showOfferConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleCancelAction("offer")}
          >
            <motion.div
              className="bg-md-surface rounded-3xl shadow-xl max-w-lg w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-md-success-container p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/90 p-3 rounded-full">
                      <Award className="w-6 h-6 text-md-success" />
                    </div>
                    <h3 className="text-xl font-semibold text-md-on-success-container">
                      Make Job Offer
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCancelAction("offer")}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-md-on-success-container" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-md-surface-container-low rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    {applicantsById[showOfferConfirm?.applicantId]?.Candidate
                      ?.profilePicture ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-md-outline">
                        <Image
                          src={
                            applicantsById[showOfferConfirm?.applicantId]
                              .Candidate.profilePicture
                          }
                          alt=""
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-md-secondary-container flex items-center justify-center">
                        <User className="w-6 h-6 text-md-on-secondary-container" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-md-on-surface">
                        {applicantsById[showOfferConfirm?.applicantId]
                          ?.Candidate?.firstName || "Applicant"}{" "}
                        {applicantsById[showOfferConfirm?.applicantId]
                          ?.Candidate?.lastName || ""}
                      </p>
                      <p className="text-sm text-md-on-surface-variant">
                        {applicantsById[showOfferConfirm?.applicantId]
                          ?.Candidate?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-md-on-surface-variant mb-5">
                  You're about to make a job offer to this candidate. An email
                  will be sent with the offer details and next steps.
                </p>

                <div className="mb-5">
                  <label className="text-sm font-medium text-md-on-surface block mb-2">
                    Offer Notes{" "}
                    <span className="text-md-on-surface-variant">
                      (will be included in email)
                    </span>
                  </label>
                  <textarea
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    className="w-full p-4 rounded-xl border border-md-outline-variant bg-md-surface text-md-on-surface focus:border-md-primary focus:outline-none transition-colors"
                    rows={4}
                    placeholder="Enter salary details, start date, benefits, or any other specific information for this offer..."
                  ></textarea>
                </div>

                <div className="mb-6 bg-md-surface-container-high p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="markJobFilled"
                      checked={markJobFilled}
                      onChange={(e) => setMarkJobFilled(e.target.checked)}
                      className="h-5 w-5 text-md-primary border-md-outline rounded"
                    />
                    <div>
                      <label
                        htmlFor="markJobFilled"
                        className="text-sm font-medium text-md-on-surface cursor-pointer"
                      >
                        Mark job position as Filled
                      </label>
                      <p className="text-xs text-md-on-surface-variant mt-1">
                        This will update the job status and prevent new
                        applications
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={() => handleCancelAction("offer")}
                    className="px-5 py-2.5 rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-surface-container-high transition-colors"
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleOfferConfirm}
                    className="px-5 py-2.5 rounded-full bg-md-success text-md-on-success hover:bg-md-success/90 transition-colors flex items-center gap-2 shadow-sm"
                    whileTap={{ scale: 0.97 }}
                  >
                    <Mail className="w-4 h-4" />
                    Send Offer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(HiringWorkflow);
