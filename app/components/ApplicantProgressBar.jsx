"use client";
import { useState, useEffect } from "react";
import {
  User,
  Star,
  FileText,
  Calendar,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BarChart,
  VideoIcon,
  Briefcase,
  PenLine,
  Clock,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Default stage definitions when no custom stages are provided
const defaultStages = [
  { id: "Applied", icon: User, label: "Applied", type: "apply" },
  { id: "Shortlisted", icon: Star, label: "Shortlisted", type: "shortlist" },
  { id: "Assessment", icon: BarChart, label: "Assessment", type: "test" },
  { id: "Interview", icon: VideoIcon, label: "Interview", type: "interview" },
  { id: "Offer", icon: Award, label: "Offer", type: "onboard" },
];

// Map stage types to icons
const typeToIcon = {
  apply: User,
  shortlist: Star,
  test: BarChart,
  interview: VideoIcon,
  onboard: Award,
  offer: Briefcase,
  default: FileText,
};

const ApplicantProgressBar = ({ 
  currentStatus, 
  onUpdateStatus, 
  applicant, 
  jobDetails,
  hiringStages = []
}) => {
  const [expanded, setExpanded] = useState(false);
  const [stages, setStages] = useState(defaultStages);
  const [stageProgress, setStageProgress] = useState({});
  
  // Generate stages based on hiringStages prop
  useEffect(() => {
    if (hiringStages && hiringStages.length > 0) {
      // Use the entire hiring process as stages, preserving the original order
      const customStages = hiringStages.map((stage, index) => {
        const type = stage.type?.toLowerCase() || 'default';
        const Icon = typeToIcon[type] || typeToIcon.default;
        
        return {
          id: stage.name || `${stage.type}-${index}`, // Use name as the primary identifier
          uniqueId: `${stage.name}-${index}`, // Ensure uniqueness
          type: type,
          icon: Icon,
          label: stage.name || stage.type,
          details: stage,
          originalIndex: index // Keep track of the original order
        };
      }).sort((a, b) => a.originalIndex - b.originalIndex); // Maintain original order
      
      // Create a progress map for all stages
      const progressMap = hiringStages.reduce((acc, stage, index) => {
        // Use the stage name as the key if available, otherwise use type-index
        const key = stage.name || `${stage.type?.toLowerCase() || 'default'}-${index}`;
        acc[key] = stage;
        return acc;
      }, {});
      
      setStageProgress(progressMap);
      
      // Add Applied as the first stage if it doesn't exist
      if (!customStages.find(s => s.type === 'apply')) {
        customStages.unshift({
          id: 'Applied',
          uniqueId: 'Applied-0',
          type: 'apply',
          icon: User,
          label: 'Applied',
          originalIndex: -1
        });
      }
      
      setStages(customStages.length > 0 ? customStages : defaultStages);
    }
  }, [hiringStages]);
  
  // Find the current stage index - match by name first, then by type
  const currentStageIndex = stages.findIndex((stage) => {
    // First try to match by name (exact match)
    if (stage.details?.name === currentStatus) {
      return true;
    }
    
    // Then try to match by id (which might be the name)
    if (stage.id === currentStatus) {
      return true;
    }
    
    // Then try to match by type (case-insensitive)
    const stageType = stage.type?.toLowerCase();
    const currentType = typeof currentStatus === 'string' ? currentStatus.toLowerCase() : '';
    
    return stageType === currentType;
  });

  if (!currentStatus) return null;

  const getStageColor = (index, isCurrent) => {
    if (isCurrent) {
      return "bg-gradient-to-r from-md-primary to-md-secondary text-md-on-primary";
    } else if (index <= currentStageIndex) {
      return "bg-md-primary-container text-md-on-primary-container";
    } else {
      return "bg-md-surface-variant text-md-on-surface-variant";
    }
  };

  const getStatusDetails = (stage) => {
    // Try to get details using the stage's unique name first
    if (stage.details) return stage.details;
    
    // Then try by name or id
    if (stageProgress[stage.id]) return stageProgress[stage.id];
    
    // If all else fails, try by type
    const stageType = stage.type?.toLowerCase();
    const matchingStages = hiringStages?.filter(s => 
      s.type?.toLowerCase() === stageType
    );
    
    if (matchingStages?.length > 0) {
      // Return the most relevant stage of this type
      return matchingStages.sort((a, b) => {
        if (a.status === 'In Progress') return -1;
        if (b.status === 'In Progress') return 1;
        if (a.status === 'Pending') return -1;
        if (b.status === 'Pending') return 1;
        return 0;
      })[0];
    }
    
    return null;
  };

  return (
    <motion.div 
      className="w-full bg-md-surface-container rounded-xl p-4 shadow-sm border border-md-outline-variant"
      initial={{ opacity: 0.8, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-md-on-surface font-medium flex items-center">
          <Clock className="w-5 h-5 mr-2 text-md-primary" />
          Application Progress
        </h3>
        <button className="p-1 rounded-full hover:bg-md-surface-variant transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 overflow-hidden"
          >
            <div className="relative">
              {/* Progress Line with animation */}
              <motion.div 
                className="absolute left-4 top-0 bottom-0 w-1 bg-md-outline-variant z-0 rounded-full overflow-hidden"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="absolute left-0 top-0 w-full bg-md-primary opacity-50"
                  initial={{ height: "0%" }}
                  animate={{ 
                    height: `${Math.min(100, (currentStageIndex / (stages.length - 1)) * 100)}%` 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </motion.div>

              {/* Stages */}
              {stages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const StageIcon = stage.icon;
                const details = getStatusDetails(stage);
                const stageColor = getStageColor(index, isCurrent);

                return (
                  <motion.div
                    key={stage.uniqueId || `stage-${index}`}
                    className={`relative z-10 mb-6 last:mb-0 flex items-start ${
                      isCompleted || isCurrent
                        ? "text-md-on-surface"
                        : "text-md-on-surface-variant opacity-60"
                    }`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${stageColor} transition-colors duration-300`}
                    >
                      <StageIcon className="w-5 h-5" />
                    </div>

                    <div className="ml-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{stage.label}</h4>
                        {isCompleted && (
                          <span className="text-sm text-md-success flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-sm bg-md-primary-container text-md-on-primary-container px-2 py-0.5 rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </div>

                      {details && (
                        <div className="text-sm text-md-on-surface-variant mt-2 bg-md-surface-container-high p-3 rounded-lg border border-md-outline-variant/30">
                          {details.name && <p className="font-medium">{details.name}</p>}
                          {details.description && (
                            <p className="opacity-80 mt-1">{details.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            {details.status && (
                              <div className="flex items-center">
                                <span className="text-xs font-medium mr-1">Status:</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  details.status === "Completed" 
                                    ? "bg-md-success-container text-md-on-success-container" 
                                    : details.status === "In Progress"
                                    ? "bg-md-info-container text-md-on-info-container"
                                    : "bg-md-surface-variant text-md-on-surface-variant"
                                }`}>
                                  {details.status}
                                </span>
                              </div>
                            )}
                            
                            {details.score !== null && details.score !== undefined && (
                              <div className="flex items-center">
                                <span className="text-xs font-medium mr-1">Score:</span>
                                <div className="flex items-center">
                                  <div className="w-16 h-1.5 bg-md-surface-container-high rounded-full overflow-hidden mr-1">
                                    <div
                                      className={`h-full ${
                                        details.score >= 70
                                          ? "bg-md-success"
                                          : details.score >= 40
                                          ? "bg-md-warning"
                                          : "bg-md-error"
                                      }`}
                                      style={{ width: `${details.score}%` }}
                                    ></div>
                                  </div>
                                  <span
                                    className={`text-xs font-medium ${
                                      details.score >= 70
                                        ? "text-md-success"
                                        : details.score >= 40
                                        ? "text-md-warning"
                                        : "text-md-error"
                                    }`}
                                  >
                                    {details.score}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {details.comments && (
                            <div className="mt-2">
                              <p className="text-xs font-medium mb-0.5">Feedback:</p>
                              <p className="text-xs bg-md-surface p-2 rounded">{details.comments}</p>
                            </div>
                          )}
                          
                          {details.plannedDate && (
                            <p className="text-xs mt-2 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {details.completedDate
                                ? `Completed: ${new Date(details.completedDate).toLocaleDateString()}`
                                : `Planned: ${new Date(details.plannedDate).toLocaleDateString()}`}
                            </p>
                          )}
                        </div>
                      )}

                      {isCurrent && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {index < stages.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (index < stages.length - 1) {
                                  // Use the next stage's name or id as the status to update to
                                  const nextStage = stages[index + 1];
                                  const nextStatus = nextStage.details?.name || nextStage.id;
                                  onUpdateStatus(nextStatus);
                                }
                              }}
                              className="px-3 py-1.5 text-xs rounded-full 
                                bg-gradient-to-r from-md-primary to-md-primary-container 
                                text-md-on-primary hover:shadow-md 
                                transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                              <CheckCircle className="w-3 h-3 mr-1 inline-block" />
                              Advance to Next Stage
                            </button>
                          )}

                          {/* Add stage-specific action buttons */}
                          {stage.type === "test" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (typeof onCreateTest === 'function') {
                                  onCreateTest([applicant.id]);
                                }
                              }}
                              className="px-3 py-1.5 text-xs rounded-full 
                                border border-md-outline-variant
                                bg-md-surface-container-high text-md-on-surface 
                                hover:bg-md-secondary-container hover:text-md-on-secondary-container 
                                hover:border-md-secondary-container
                                transition-colors"
                            >
                              <BarChart className="w-3 h-3 mr-1 inline-block" />
                              {details && details.status === "Pending" ? "Edit" : "Create"} Assessment
                            </button>
                          )}

                          {stage.type === "interview" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (typeof onScheduleInterview === 'function') {
                                  onScheduleInterview([applicant.id]);
                                }
                              }}
                              className="px-3 py-1.5 text-xs rounded-full 
                                border border-md-outline-variant
                                bg-md-surface-container-high text-md-on-surface 
                                hover:bg-md-tertiary-container hover:text-md-on-tertiary-container 
                                hover:border-md-tertiary-container
                                transition-colors"
                            >
                              <VideoIcon className="w-3 h-3 mr-1 inline-block" />
                              {details && details.status === "Pending" ? "Reschedule" : "Schedule"} Interview
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApplicantProgressBar;
