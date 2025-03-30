"use client";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import HiringTestForm from '@/app/components/HiringTestForm';
import InterviewForm from '@/app/components/InterviewForm';

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

  // Hiring test form state
  const [hiringTestForm, setHiringTestForm] = useState({
    testName: "",
    description: "",
    duration: 60,
    passingScore: 70,
    questions: [],
  });

  useEffect(() => {
    fetchApplicants();
    console.log(params.jobid);
  }, [params.jobid]);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applicants/byjob/${params.jobid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();
      setApplicants(data);
      setFilteredApplicants(data);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
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
      // Create hiring test
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

      // Assign test to selected applicants
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
      fetchApplicants();
    } catch (error) {
      console.error("Failed to create hiring test:", error);
    }
  };

  const handleScheduleInterview = async (formData) => {
    try {
      const selectedApplicantsData = applicants.filter(a => 
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
      fetchApplicants();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applicant Management</h1>
        <div className="flex gap-2">
          {selectedApplicants.length > 0 && (
            <>
              <button
                onClick={() => setShowHiringTestModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Test
              </button>
              <button
                onClick={() => setShowInterviewModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Interview
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search applicants..."
            className="input-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select-input"
        >
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Assessment">Assessment</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedApplicants(applicants.map((a) => a.id));
                    } else {
                      setSelectedApplicants([]);
                    }
                  }}
                />
              </th>
              <th className="table-header">Candidate</th>
              <th className="table-header">Status</th>
              <th className="table-header">Applied Date</th>
              <th className="table-header">Score</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(applicant.id)}
                    onChange={() => handleShortlistToggle(applicant.id)}
                  />
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <img
                      src={applicant.avatar || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-sm text-gray-500">
                        {applicant.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span
                    className={`status-badge status-${applicant.status.toLowerCase()}`}
                  >
                    {applicant.status}
                  </span>
                </td>
                <td className="table-cell">
                  {new Date(applicant.createdAt).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  {applicant.score ? `${applicant.score}%` : "-"}
                </td>
                <td className="table-cell">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiring Test Modal */}
      {showHiringTestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <HiringTestForm 
              onSubmit={handleCreateHiringTest}
              onCancel={() => setShowHiringTestModal(false)}
            />
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InterviewForm 
              onSubmit={handleScheduleInterview}
              onCancel={() => setShowInterviewModal(false)}
              attendees={applicants
                .filter(a => selectedApplicants.includes(a.id))
                .map(a => a.email)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
