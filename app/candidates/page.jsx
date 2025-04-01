"use client";
import { useState } from "react";
import CandidateList from "../components/CandidateList";

export default function CandidatesPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Candidates</h1>
      
      {/* Optional job filter dropdown */}
      <div className="mb-4">
        <select 
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value || null)}
          className="rounded-full border border-md-outline px-4 py-2"
        >
          <option value="">All Jobs</option>
          <option value="job-1">Senior Developer</option>
          <option value="job-2">Project Manager</option>
          <option value="job-3">UX Designer</option>
        </select>
      </div>
      
      {/* Candidate list with pagination and status management */}
      <CandidateList jobId={selectedJob} />
    </div>
  );
}
