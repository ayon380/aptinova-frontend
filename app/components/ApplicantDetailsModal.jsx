"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Link as LinkIcon,
  Download,
  Briefcase,
  GraduationCap,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  PenLine,
  MessageSquare,
  CheckCircle,
  XCircle,
  BarChart,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ApplicantProgressBar from "./ApplicantProgressBar";

const ApplicantDetailsModal = ({
  applicant,
  onClose,
  onScheduleInterview,
  onCreateTest,
  onUpdateStatus,
  jobDetails,
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(applicant.notes || []);
  const [profileData, setProfileData] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  if (!applicant) return null;

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote = {
        id: Date.now().toString(),
        text: noteText,
        createdAt: new Date().toISOString(),
        createdBy: "Current User", // This would come from authentication context
      };

      setNotes([newNote, ...notes]);
      setNoteText("");

      // Here you would also call an API to save the note
      // onSaveNote(applicant.id, newNote);
    }
  };
  useEffect(() => {
    // Fetch profile data when the component mounts or when the applicant changes
    if (applicant) {
      fetchProfileData();
    }
  }, [applicant]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicant.id}/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch profile data");
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  // Get all stages from hiring process, organized by type
  const getProcessData = () => {
    if (!applicant?.hiringProcess) return { stages: [], byType: {} };

    try {
      const stages = Array.isArray(applicant.hiringProcess)
        ? applicant.hiringProcess
        : JSON.parse(applicant.hiringProcess);

      // Organize stages by type for easier access
      const byType = stages.reduce((acc, stage) => {
        if (!stage.type) return acc;

        const type = stage.type.toLowerCase();
        if (!acc[type]) acc[type] = [];
        acc[type].push(stage);

        return acc;
      }, {});

      return { stages, byType };
    } catch (e) {
      console.error("Error parsing hiring process", e);
      return { stages: [], byType: {} };
    }
  };

  const { stages, byType } = getProcessData();
  const assessmentStages = byType.test || [];
  const interviewStages = byType.interview || [];

  // Toggle stage expansion in assessment/interview views
  const toggleStageExpansion = (stageId) => {
    if (expandedStage === stageId) {
      setExpandedStage(null);
    } else {
      setExpandedStage(stageId);
    }
  };

  // Get stage display component
  const renderStage = (stage, index) => {
    const isExpanded = expandedStage === `${stage.type}-${index}`;
    const stageIcon =
      stage.type.toLowerCase() === "test" ? (
        <BarChart className="w-5 h-5 text-md-primary" />
      ) : stage.type.toLowerCase() === "interview" ? (
        <VideoIcon className="w-5 h-5 text-md-info" />
      ) : (
        <FileText className="w-5 h-5 text-md-tertiary" />
      );

    return (
      <div
        key={`${stage.type}-${index}`}
        className="bg-md-surface-container rounded-lg p-4 mb-4"
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleStageExpansion(`${stage.type}-${index}`)}
        >
          <h4 className="font-medium text-md-on-surface flex items-center gap-2">
            {stageIcon}
            {stage.name || `${stage.type} ${index + 1}`}
          </h4>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full mr-2 ${
                stage.status === "Completed"
                  ? "bg-md-success-container text-md-on-success-container"
                  : stage.status === "In Progress"
                  ? "bg-md-info-container text-md-on-info-container"
                  : "bg-md-surface-variant text-md-on-surface-variant"
              }`}
            >
              {stage.status}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-md-on-surface-variant" />
            ) : (
              <ChevronDown className="w-5 h-5 text-md-on-surface-variant" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-md-outline-variant">
            {stage.description && (
              <p className="text-md-on-surface-variant text-sm mb-3">
                {stage.description}
              </p>
            )}

            {stage.plannedDate && (
              <p className="text-md-on-surface-variant mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(stage.plannedDate).toLocaleDateString()}
                {stage.status === "Completed" &&
                  stage.completedDate &&
                  ` (Completed: ${new Date(
                    stage.completedDate
                  ).toLocaleDateString()})`}
              </p>
            )}

            {stage.status === "Completed" && stage.score !== undefined && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-md-on-surface mb-2">
                  Score
                </h5>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-md-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        stage.score >= 70
                          ? "bg-md-success"
                          : stage.score >= 40
                          ? "bg-md-warning"
                          : "bg-md-error"
                      }`}
                      style={{ width: `${stage.score}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-md font-medium text-md-on-surface">
                    {stage.score}%
                  </span>
                </div>
              </div>
            )}

            {stage.comments && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-md-on-surface mb-2">
                  Comments
                </h5>
                <div className="p-3 bg-md-surface-container-high rounded-lg text-md-on-surface-variant text-sm">
                  {stage.comments}
                </div>
              </div>
            )}

            {/* Action buttons based on stage type and status */}
            {stage.status !== "Completed" && (
              <div className="flex justify-end mt-2">
                {stage.type.toLowerCase() === "test" && (
                  <button
                    onClick={() => onCreateTest([applicant.id])}
                    className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm flex items-center"
                  >
                    <PenLine className="w-4 h-4 mr-1" />
                    {stage.status === "Pending"
                      ? "Edit Assessment"
                      : "Create Assessment"}
                  </button>
                )}
                {stage.type.toLowerCase() === "interview" && (
                  <button
                    onClick={() => onScheduleInterview([applicant.id])}
                    className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {stage.status === "Pending"
                      ? "Reschedule"
                      : "Schedule Interview"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-md-surface md:rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-md-outline-variant bg-md-surface-container">
          <h2 className="text-xl font-semibold text-md-on-surface">
            Applicant Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-md-surface-variant text-md-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {profileData && (
          <div className="flex-grow overflow-y-auto">
            <div className="p-6">
              {/* Applicant Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-md-surface-container-high border border-md-outline flex-shrink-0">
                  {profileData && profileData.Candidate.profilePicture ? (
                    <Image
                      src={profileData.Candidate.profilePicture}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <User className="h-10 w-10 m-5 text-md-on-surface-variant" />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-md-on-surface">
                    {profileData.Candidate.firstName || applicant.name}
                  </h3>
                  <div className="flex items-center text-md-on-surface-variant mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>
                      {profileData.Candidate.email || applicant.email}
                    </span>
                  </div>

                  <div className="flex items-center text-md-on-surface-variant mt-1">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{profileData.Candidate.phone}</span>
                  </div>

                  {profileData.Candidate.location && (
                    <div className="flex items-center text-md-on-surface-variant mt-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{profileData.Candidate.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-md-on-surface-variant mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Applied on{" "}
                      {new Date(applicant.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${
                        applicant.status === "Applied"
                          ? "bg-md-secondary-container text-md-on-secondary-container"
                          : applicant.status === "Shortlisted"
                          ? "bg-md-tertiary-container text-md-on-tertiary-container"
                          : applicant.status === "Assessment"
                          ? "bg-md-primary-container text-md-on-primary-container"
                          : applicant.status === "Interview"
                          ? "bg-md-info-container text-md-on-info-container"
                          : applicant.status === "Offer"
                          ? "bg-md-success-container text-md-on-success-container"
                          : applicant.status === "Rejected"
                          ? "bg-md-error-container text-md-on-error-container"
                          : "bg-md-surface-variant text-md-on-surface-variant"
                      }`}
                    >
                      {applicant.status}
                    </span>
                    {applicant.score !== null && (
                      <span
                        className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${
                          applicant.score >= 70
                            ? "bg-md-success-container text-md-on-success-container"
                            : applicant.score >= 40
                            ? "bg-md-warning-container text-md-on-warning-container"
                            : "bg-md-error-container text-md-on-error-container"
                        }`}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        {applicant.score}%
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onScheduleInterview([applicant.id])}
                      className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule Interview
                    </button>
                    {applicant.status !== "Rejected" && (
                      <button
                        onClick={() => onUpdateStatus("Rejected")}
                        className="px-4 py-2 rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-error-container hover:text-md-on-error-container transition-colors text-sm flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <ApplicantProgressBar
                currentStatus={applicant.status}
                onUpdateStatus={onUpdateStatus}
                applicant={applicant}
                jobDetails={jobDetails}
                hiringStages={stages}
              />

              {/* Tabs Navigation */}
              <div className="flex border-b border-md-outline-variant mt-6">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "profile"
                      ? "text-md-primary border-b-2 border-md-primary"
                      : "text-md-on-surface-variant hover:text-md-on-surface"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "resume"
                      ? "text-md-primary border-b-2 border-md-primary"
                      : "text-md-on-surface-variant hover:text-md-on-surface"
                  }`}
                  onClick={() => setActiveTab("resume")}
                >
                  Resume
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "assessment"
                      ? "text-md-primary border-b-2 border-md-primary"
                      : "text-md-on-surface-variant hover:text-md-on-surface"
                  }`}
                  onClick={() => setActiveTab("assessment")}
                >
                  Assessment
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "interview"
                      ? "text-md-primary border-b-2 border-md-primary"
                      : "text-md-on-surface-variant hover:text-md-on-surface"
                  }`}
                  onClick={() => setActiveTab("interview")}
                >
                  Interview
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "notes"
                      ? "text-md-primary border-b-2 border-md-primary"
                      : "text-md-on-surface-variant hover:text-md-on-surface"
                  }`}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === "profile" && (
                  <div>
                    {/* Skills Section */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-md-on-surface mb-2">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.Candidate.skills?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-md-surface-container-high text-md-on-surface-variant text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        )) || (
                          <p className="text-md-on-surface-variant">
                            No skills listed
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-md-on-surface mb-2">
                        Experience
                      </h4>
                      {applicant.experience ? (
                        <div className="space-y-4">
                          {applicant.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="p-4 bg-md-surface-container rounded-lg"
                            >
                              <div className="flex justify-between">
                                <h5 className="font-medium text-md-on-surface">
                                  {exp.title}
                                </h5>
                                <span className="text-sm text-md-on-surface-variant">
                                  {exp.startDate} - {exp.endDate || "Present"}
                                </span>
                              </div>
                              <p className="text-md-on-surface-variant">
                                {exp.company}
                              </p>
                              <p className="text-sm text-md-on-surface-variant mt-2">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-md-on-surface-variant">
                          No experience listed
                        </p>
                      )}
                    </div>

                    {/* Education Section */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-md-on-surface mb-2">
                        Education
                      </h4>
                      {applicant.education ? (
                        <div className="space-y-4">
                          {applicant.education.map((edu, index) => (
                            <div
                              key={index}
                              className="p-4 bg-md-surface-container rounded-lg"
                            >
                              <div className="flex justify-between">
                                <h5 className="font-medium text-md-on-surface">
                                  {edu.degree}
                                </h5>
                                <span className="text-sm text-md-on-surface-variant">
                                  {edu.startDate} - {edu.endDate || "Present"}
                                </span>
                              </div>
                              <p className="text-md-on-surface-variant">
                                {edu.institution}
                              </p>
                              <p className="text-sm text-md-on-surface-variant mt-2">
                                {edu.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-md-on-surface-variant">
                          No education listed
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "resume" && (
                  <div>
                    {profileData.Candidate.resume ? (
                      <div className="h-[500px] border border-md-outline-variant rounded-lg overflow-hidden">
                        <iframe
                          src={profileData.Candidate.resume}
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center bg-md-surface-container rounded-lg">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-md-on-surface-variant opacity-50 mx-auto mb-2" />
                          <p className="text-md-on-surface-variant">
                            Resume not available
                          </p>
                        </div>
                      </div>
                    )}

                    {profileData.Candidate.resume && (
                      <div className="mt-4 flex justify-end">
                        <Link
                          href={profileData.Candidate.resume}
                          target="_blank"
                          className="px-4 py-2 rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download Resume
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "assessment" && (
                  <div>
                    {assessmentStages.length > 0 ? (
                      <div>
                        {assessmentStages.map((stage, index) =>
                          renderStage(stage, index)
                        )}

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onCreateTest([applicant.id])}
                            className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm flex items-center"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Add Assessment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="w-12 h-12 text-md-on-surface-variant opacity-50 mx-auto mb-2" />
                        <p className="text-md-on-surface-variant mb-4">
                          No assessment has been assigned yet
                        </p>
                        <button
                          onClick={() => onCreateTest([applicant.id])}
                          className="px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm inline-flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Create Assessment
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "interview" && (
                  <div>
                    {interviewStages.length > 0 ? (
                      <div>
                        {interviewStages.map((stage, index) =>
                          renderStage(stage, index)
                        )}

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onScheduleInterview([applicant.id])}
                            className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm flex items-center"
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Add Interview
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Calendar className="w-12 h-12 text-md-on-surface-variant opacity-50 mx-auto mb-2" />
                        <p className="text-md-on-surface-variant mb-4">
                          No interview has been scheduled yet
                        </p>
                        <button
                          onClick={() => onScheduleInterview([applicant.id])}
                          className="px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors text-sm inline-flex items-center"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule Interview
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-start gap-2">
                        <textarea
                          placeholder="Add a note about this applicant..."
                          className="block w-full rounded-lg border border-md-outline focus:border-md-primary focus:ring-md-primary bg-md-surface-container text-md-on-surface p-3 resize-none h-24"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddNote}
                          disabled={!noteText.trim()}
                          className={`px-4 py-2 rounded-full text-sm flex items-center ${
                            noteText.trim()
                              ? "bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container"
                              : "bg-md-surface-variant text-md-on-surface-variant opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <PenLine className="w-4 h-4 mr-1" />
                          Add Note
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {notes.length > 0 ? (
                        notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-4 bg-md-surface-container rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <MessageSquare className="w-4 h-4 text-md-on-surface-variant mr-2" />
                                <span className="text-sm font-medium text-md-on-surface">
                                  {note.createdBy || "User"}
                                </span>
                              </div>
                              <span className="text-xs text-md-on-surface-variant">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-md-on-surface mt-2 whitespace-pre-wrap">
                              {note.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="w-8 h-8 text-md-on-surface-variant opacity-50 mx-auto mb-2" />
                          <p className="text-md-on-surface-variant">
                            No notes yet. Add one to keep track of important
                            information.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ApplicantDetailsModal;
