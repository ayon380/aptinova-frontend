"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Calendar,
  FileText,
  MoreVertical,
  CheckCircle,
  XCircle,
  ChevronRight,
  MessageSquare,
  Clock,
  Award,
  Star,
  StarHalf,
  ThumbsUp,
  ThumbsDown,
  User,
  Loader2,
  CalendarClock,
  PenLine,
  Eye,
  Users,
  ClipboardList,
  BarChart,
  VideoIcon,
  Trophy,
  Medal,
  Mail,
  CheckSquare,
  AlertCircle,
  Briefcase,
  X,
} from "lucide-react";
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
  onViewDetails,
  onScheduleInterview,
  onCreateTest,
  jobDetails,
  isLoading,
  isTopCandidatesMode = false,
  onUpdateJobStatus,
}) => {
  const [columns, setColumns] = useState({});
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(null);
  const [showOfferConfirm, setShowOfferConfirm] = useState(null);
  const [offerNotes, setOfferNotes] = useState("");
  const [markJobFilled, setMarkJobFilled] = useState(false);
  const [dragSourceColumn, setDragSourceColumn] = useState(null);
  const [draggedApplicant, setDraggedApplicant] = useState(null);
  const [processStages, setProcessStages] = useState([]);
  const [interviewSchedulingId, setInterviewSchedulingId] = useState(null);
  const [testCreationId, setTestCreationId] = useState(null);

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

  // Initialize columns based on process stages
  useEffect(() => {
    if (processStages.length > 0) {
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

        // Try to determine current stage from applicant data
        if (applicant.hiringProcess) {
          try {
            const process =
              typeof applicant.hiringProcess === "string"
                ? JSON.parse(applicant.hiringProcess)
                : applicant.hiringProcess;

            // Find the current stage (the one that's not completed yet)
            const currentStage = process.find(
              (step) => step.completedDate === ""
            );
            if (currentStage) {
              const stageColumn = processStages.find(
                (stage) => stage.title === currentStage.name
              );
              if (stageColumn && initialColumns[stageColumn.id]) {
                initialColumns[stageColumn.id].applicantIds.push(applicant.id);
                placed = true;
              }
            }
          } catch (e) {
            console.error("Error parsing applicant hiring process:", e);
          }
        }

        // If we couldn't determine stage from process data, use status
        if (!placed) {
          const status = applicant.status || "Resume Screening";

          // Find a matching column based on status
          const matchingStage = processStages.find(
            (stage) => stage.title === status || stage.id === status
          );

          if (matchingStage && initialColumns[matchingStage.id]) {
            initialColumns[matchingStage.id].applicantIds.push(applicant.id);
          } else {
            // Default to first stage if no match
            const firstStage = processStages[0];
            if (firstStage && initialColumns[firstStage.id]) {
              initialColumns[firstStage.id].applicantIds.push(applicant.id);
            }
          }
        }
      });

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

  // Function to trigger appropriate action based on destination stage
  const triggerStageAction = (applicantId, stageId) => {
    const stage = processStages.find((s) => s.id === stageId);
    if (!stage) return;

    if (stage.type === "Test") {
      setTestCreationId(applicantId);
      onCreateTest([applicantId]);
    } else if (stage.type === "Interview") {
      setInterviewSchedulingId(applicantId);
      onScheduleInterview([applicantId]);
    }
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

    // Check if this move would be a downgrade
    if (isDowngrade(source.droppableId, destination.droppableId)) {
      // Revert the drag - not allowing downgrades
      return;
    }

    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];

    // Store the source column and applicant ID for potential revert
    setDragSourceColumn(source.droppableId);
    setDraggedApplicant(draggableId);

    if (startColumn === endColumn) {
      const newApplicantIds = Array.from(startColumn.applicantIds);
      newApplicantIds.splice(source.index, 1);
      newApplicantIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        applicantIds: newApplicantIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const startApplicantIds = Array.from(startColumn.applicantIds);
      startApplicantIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        applicantIds: startApplicantIds,
      };

      const endApplicantIds = Array.from(endColumn.applicantIds);
      endApplicantIds.splice(destination.index, 0, draggableId);
      const newEndColumn = {
        ...endColumn,
        applicantIds: endApplicantIds,
      };

      if (isTopCandidatesMode && endColumn) {
        const sortedIds = sortApplicantsByScore(
          endColumn.applicantIds,
          endColumn.id
        );

        const newEndColumnSorted = {
          ...newEndColumn,
          applicantIds: sortedIds,
        };

        setColumns({
          ...columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumnSorted.id]: newEndColumnSorted,
        });
      } else {
        setColumns({
          ...columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        });
      }

      if (destination.droppableId === "Rejected") {
        setShowRejectConfirm(draggableId);
      } else if (destination.droppableId === "Offer") {
        setShowOfferConfirm(draggableId);
      } else {
        // For other stages, advance immediately and trigger appropriate action
        onMoveApplicant(draggableId, destination.droppableId);

        // Trigger test creation or interview scheduling based on destination stage
        triggerStageAction(draggableId, destination.droppableId);

        // Clear source tracking if we're confirming the move immediately
        setDragSourceColumn(null);
        setDraggedApplicant(null);
      }
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
      onMoveApplicant(showRejectConfirm, "Rejected");
      setShowRejectConfirm(null);
      // Clear source tracking
      setDragSourceColumn(null);
      setDraggedApplicant(null);
    }
  };

  const handleOfferConfirm = () => {
    if (showOfferConfirm) {
      onMoveApplicant(showOfferConfirm, "Offer", offerNotes);

      if (markJobFilled) {
        onUpdateJobStatus("Filled");
      }

      setShowOfferConfirm(null);
      setOfferNotes("");
      setMarkJobFilled(false);
      // Clear source tracking
      setDragSourceColumn(null);
      setDraggedApplicant(null);
    }
  };

  const handleCancelAction = (type) => {
    // Revert the applicant to its original column
    if (dragSourceColumn && draggedApplicant) {
      const currentColumns = { ...columns };

      // Find which column currently has the applicant
      let currentColumnId = null;
      Object.keys(currentColumns).forEach((colId) => {
        if (currentColumns[colId].applicantIds.includes(draggedApplicant)) {
          currentColumnId = colId;
        }
      });

      if (currentColumnId && currentColumnId !== dragSourceColumn) {
        // Remove from current column
        const currentColumn = currentColumns[currentColumnId];
        const updatedCurrentIds = currentColumn.applicantIds.filter(
          (id) => id !== draggedApplicant
        );

        // Add back to source column
        const sourceColumn = currentColumns[dragSourceColumn];
        const updatedSourceIds = [
          ...sourceColumn.applicantIds,
          draggedApplicant,
        ];

        // Update columns
        setColumns({
          ...currentColumns,
          [currentColumnId]: {
            ...currentColumn,
            applicantIds: updatedCurrentIds,
          },
          [dragSourceColumn]: {
            ...sourceColumn,
            applicantIds: updatedSourceIds,
          },
        });
      }
    }

    // Close modals and clear tracking
    if (type === "reject") {
      setShowRejectConfirm(null);
    } else if (type === "offer") {
      setShowOfferConfirm(null);
      setOfferNotes("");
      setMarkJobFilled(false);
    } else if (type === "interview") {
      setInterviewSchedulingId(null);
    } else if (type === "test") {
      setTestCreationId(null);
    }

    setDragSourceColumn(null);
    setDraggedApplicant(null);
  };

  // Modify the button click handler for advancing a candidate
  const handleAdvanceCandidate = (applicantId, currentColumnId) => {
    // Find the next stage in the workflow
    const currentStageIndex = processStages.findIndex(
      (stage) => stage.id === currentColumnId
    );
    if (
      currentStageIndex === -1 ||
      currentStageIndex >= processStages.length - 2
    )
      return; // -2 to exclude Rejected

    const nextStage = processStages[currentStageIndex + 1];
    if (!nextStage) return;

    // Store source for potential revert
    setDragSourceColumn(currentColumnId);
    setDraggedApplicant(applicantId);

    // Move applicant to next stage
    onMoveApplicant(applicantId, nextStage.id);

    // Trigger appropriate action
    triggerStageAction(applicantId, nextStage.id);
  };

  if (isLoading || Object.keys(columns).length === 0) {
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
    <div className="mt-6 relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto pb-4 gap-4 min-h-[600px]">
          {sortedStages.map((columnId) => {
            const column = columns[columnId];
            const stage =
              processStages.find((stage) => stage.id === columnId) || {};
            const Icon = StageTypeIcons[stage.type] || User;
            const colorClass =
              StageTypeColors[stage.type] ||
              "bg-md-surface-variant text-md-on-surface-variant";
            const applicantsInStage = column.applicantIds
              .map((id) => applicantsById[id])
              .filter(Boolean);

            const sortedApplicantIds = isTopCandidatesMode
              ? sortApplicantsByScore(column.applicantIds, columnId)
              : column.applicantIds;

            return (
              <div
                key={columnId}
                className="flex-shrink-0  flex flex-col bg-md-surface-container rounded-xl shadow-sm overflow-hidden border border-md-outline-variant"
              >
                <div
                  className={`px-4 py-3 flex items-center justify-between ${colorClass}`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">{column.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-white/20 px-2 py-0.5 text-sm font-medium">
                      {column.applicantIds.length}
                    </div>

                    {columnId === "Assessment" &&
                      column.applicantIds.length > 0 && (
                        <button
                          onClick={() => onCreateTest(column.applicantIds)}
                          className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          title="Create assessment for all candidates"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </button>
                      )}

                    {columnId === "Interview" &&
                      column.applicantIds.length > 0 && (
                        <button
                          onClick={() =>
                            onScheduleInterview(column.applicantIds)
                          }
                          className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          title="Schedule interview for all candidates"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-grow p-2 overflow-y-auto min-h-[400px] ${
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

                      {sortedApplicantIds.map((applicantId, index) => {
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
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-2 p-3 bg-md-surface rounded-lg border ${
                                  snapshot.isDragging
                                    ? "border-md-primary shadow-md"
                                    : isTopThree
                                    ? "border-md-tertiary shadow-sm"
                                    : "border-md-outline-variant"
                                } ${
                                  expandedCard === applicantId
                                    ? "ring-2 ring-md-primary"
                                    : ""
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
                                  <div className="flex items-center">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-md-surface-container-high border border-md-outline flex-shrink-0">
                                      {applicant.Candidate ? (
                                        <Image
                                          src={
                                            applicant.Candidate.profilePicture
                                          }
                                          alt=""
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
                                      <h4 className="font-medium text-md-on-surface truncate max-w-[180px]">
                                        {applicant.Candidate.firstName}
                                      </h4>
                                      <p className="text-xs text-md-on-surface-variant truncate max-w-[180px]">
                                        {applicant.Candidate.email}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setShowActionMenu(
                                          showActionMenu === applicantId
                                            ? null
                                            : applicantId
                                        )
                                      }
                                      className="p-1 hover:bg-md-surface-container-high rounded-full text-md-on-surface-variant"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {showActionMenu === applicantId && (
                                      <div className="absolute right-0 mt-1 w-48 bg-md-surface rounded-lg shadow-lg z-10 border border-md-outline-variant overflow-hidden">
                                        <button
                                          onClick={() => {
                                            onViewDetails(applicantId);
                                            setShowActionMenu(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant flex items-center gap-2"
                                        >
                                          <Eye className="w-4 h-4" />
                                          View Details
                                        </button>
                                        <button
                                          onClick={() => {
                                            onScheduleInterview([applicantId]);
                                            setShowActionMenu(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant flex items-center gap-2"
                                        >
                                          <Calendar className="w-4 h-4" />
                                          Schedule Interview
                                        </button>
                                        <button
                                          onClick={() => {
                                            onCreateTest([applicantId]);
                                            setShowActionMenu(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-md-surface-variant flex items-center gap-2"
                                        >
                                          <FileText className="w-4 h-4" />
                                          Create Assessment
                                        </button>
                                        {columnId === "Interview" && (
                                          <button
                                            onClick={() => {
                                              setShowOfferConfirm(applicantId);
                                              setShowActionMenu(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-md-success hover:bg-md-success-container/20 flex items-center gap-2"
                                          >
                                            <Award className="w-4 h-4" />
                                            Make Offer
                                          </button>
                                        )}
                                        <button
                                          onClick={() => {
                                            setShowRejectConfirm(applicantId);
                                            setShowActionMenu(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-md-error hover:bg-md-error-container/20 flex items-center gap-2"
                                        >
                                          <XCircle className="w-4 h-4" />
                                          Reject Applicant
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-2">
                                  {applicant.Candidate.skills && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {applicant.Candidate.skills
                                        .slice(0, 2)
                                        .map((tag, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      {applicant.Candidate.skills.length >
                                        2 && (
                                        <span className="px-2 py-0.5 bg-md-surface-container-high text-md-on-surface-variant text-xs rounded-full">
                                          +
                                          {applicant.Candidate.skills.length -
                                            2}
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

                                  <div
                                    className="mt-2 cursor-pointer"
                                    onClick={() =>
                                      setExpandedCard(
                                        expandedCard === applicantId
                                          ? null
                                          : applicantId
                                      )
                                    }
                                  >
                                    <div className="flex justify-between text-xs text-md-on-surface-variant">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDate(applicant.createdAt)}
                                      </span>

                                      {getApplicantScore(applicant) !==
                                        null && (
                                        <span className="flex items-center gap-1">
                                          <Star
                                            className={`w-3.5 h-3.5 ${
                                              applicant.score >= 70
                                                ? "text-md-success"
                                                : applicant.score >= 40
                                                ? "text-md-warning"
                                                : "text-md-error"
                                            }`}
                                          />
                                          {applicant.score}%
                                        </span>
                                      )}

                                      <ChevronRight
                                        className={`w-3.5 h-3.5 transition-transform ${
                                          expandedCard === applicantId
                                            ? "rotate-90"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {expandedCard === applicantId && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="mt-3 pt-3 border-t border-md-outline-variant"
                                    >
                                      {applicant.interviewDetails && (
                                        <div className="mb-2">
                                          <div className="text-xs font-medium text-md-on-surface mb-1 flex items-center gap-1">
                                            <CalendarClock className="w-3.5 h-3.5" />
                                            Interview Scheduled
                                          </div>
                                          <p className="text-xs text-md-on-surface-variant">
                                            {new Date(
                                              applicant.interviewDetails.scheduledAt
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                      )}

                                      {interviewComments && (
                                        <div className="mb-2">
                                          <div className="text-xs font-medium text-md-on-surface mb-1 flex items-center gap-1">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Feedback
                                          </div>
                                          <p className="text-xs text-md-on-surface-variant bg-md-surface-container-high p-2 rounded-md">
                                            {interviewComments}
                                          </p>
                                        </div>
                                      )}

                                      {applicant.hiringTestId && (
                                        <div className="mb-2">
                                          <div className="text-xs font-medium text-md-on-surface mb-1 flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5" />
                                            Assessment Assigned
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex mt-2 gap-2">
                                        <button
                                          onClick={() => {
                                            onViewDetails(applicantId);
                                          }}
                                          className="flex-1 py-1 text-xs rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center justify-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Details
                                        </button>
                                        <button
                                          onClick={() => {
                                            onScheduleInterview([applicantId]);
                                          }}
                                          className="flex-1 py-1 text-xs rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center justify-center gap-1"
                                        >
                                          <Calendar className="w-3 h-3" />
                                          Interview
                                        </button>
                                        {column.id === "Interview" ? (
                                          <button
                                            onClick={() => {
                                              setShowOfferConfirm(applicantId);
                                            }}
                                            className="flex-1 py-1 text-xs rounded-full bg-md-success text-md-on-success hover:bg-md-success-container hover:text-md-on-success-container transition-colors flex items-center justify-center gap-1"
                                          >
                                            <Award className="w-3 h-3" />
                                            Offer
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              handleAdvanceCandidate(
                                                applicantId,
                                                column.id
                                              )
                                            }
                                            className="flex-1 py-1 text-xs rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center justify-center gap-1"
                                          >
                                            <ChevronRight className="w-3 h-3" />
                                            Advance
                                          </button>
                                        )}
                                      </div>
                                    </motion.div>
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
      </DragDropContext>

      {/* Rejection Confirmation Dialog */}
      <AnimatePresence>
        {showRejectConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-md-surface rounded-3xl shadow-xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                    {applicantsById[showRejectConfirm]?.Candidate
                      ?.profilePicture ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-md-outline">
                        <Image
                          src={
                            applicantsById[showRejectConfirm].Candidate
                              .profilePicture
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
                        {applicantsById[showRejectConfirm]?.Candidate
                          ?.firstName || "Applicant"}
                      </p>
                      <p className="text-sm text-md-on-surface-variant">
                        {applicantsById[showRejectConfirm]?.Candidate?.email ||
                          ""}
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
          >
            <motion.div
              className="bg-md-surface rounded-3xl shadow-xl max-w-lg w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                    {applicantsById[showOfferConfirm]?.Candidate
                      ?.profilePicture ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-md-outline">
                        <Image
                          src={
                            applicantsById[showOfferConfirm].Candidate
                              .profilePicture
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
                        {applicantsById[showOfferConfirm]?.Candidate
                          ?.firstName || "Applicant"}{" "}
                        {applicantsById[showOfferConfirm]?.Candidate
                          ?.lastName || ""}
                      </p>
                      <p className="text-sm text-md-on-surface-variant">
                        {applicantsById[showOfferConfirm]?.Candidate?.email ||
                          ""}
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

      <AnimatePresence>
        {interviewSchedulingId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => handleCancelAction("interview")}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-md-surface p-4 rounded-xl shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">Schedule Interview</h3>
              <p className="text-md-on-surface-variant mb-4">
                Complete the interview setup or cancel to revert the candidate.
              </p>
              {/* We're assuming onScheduleInterview has its own UI, this is just a container */}
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {testCreationId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div class="absolute top-4 right-4">
              <button
                onClick={() => handleCancelAction("test")}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-md-surface p-4 rounded-xl shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">
                Create Technical Test
              </h3>
              <p className="text-md-on-surface-variant mb-4">
                Complete the test setup or cancel to revert the candidate.
              </p>
              {/* We're assuming onCreateTest has its own UI, this is just a container */}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiringWorkflow;
