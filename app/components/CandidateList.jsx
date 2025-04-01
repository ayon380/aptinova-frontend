"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const candidateStatuses = [
  { id: "applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { id: "screening", label: "Screening", color: "bg-purple-100 text-purple-800" },
  { id: "interview", label: "Interview", color: "bg-amber-100 text-amber-800" },
  { id: "assessment", label: "Assessment", color: "bg-emerald-100 text-emerald-800" },
  { id: "offer", label: "Offer", color: "bg-green-100 text-green-800" },
  { id: "hired", label: "Hired", color: "bg-green-200 text-green-900" },
  { id: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export default function CandidateList({ jobId }) {
  // State for candidates and loading
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // State for filtering and sorting
  const [filters, setFilters] = useState({
    name: "",
    status: [],
    experience: null,
    skills: [],
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  
  // State for status dropdown
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Function to fetch candidates with filtering and pagination
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for filtering and pagination
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', pageSize);
      
      // Add filters to query parameters
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.status.length > 0) {
        filters.status.forEach(status => {
          queryParams.append('status', status);
        });
      }
      if (filters.experience) queryParams.append('minExperience', filters.experience);
      if (filters.skills.length > 0) {
        filters.skills.forEach(skill => {
          queryParams.append('skills', skill);
        });
      }
      
      // Add sorting
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);
      
      // Add job ID if provided
      if (jobId) queryParams.append('jobId', jobId);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      
      const data = await response.json();
      setCandidates(data.candidates);
      setTotalPages(data.pagination.totalPages);
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to fetch candidates when dependencies change
  useEffect(() => {
    fetchCandidates();
  }, [currentPage, pageSize, jobId]);
  
  // Function to handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };
  
  // Apply filters function
  const applyFilters = () => {
    fetchCandidates();
  };
  
  // Reset filters function
  const resetFilters = () => {
    setFilters({
      name: "",
      status: [],
      experience: null,
      skills: [],
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    setCurrentPage(1);
  };
  
  // Function to update candidate status
  const updateCandidateStatus = async (candidateId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates/${candidateId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update candidate status');
      }
      
      // Update local state after successful update
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status: newStatus } 
            : candidate
        )
      );
      
      toast.success(`Candidate status updated to ${newStatus}`);
      // Close dropdown
      setSelectedCandidate(null);
      
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full h-full bg-md-surface rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {/* Filter Section */}
      <div className="p-4 border-b border-md-outline">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search candidates..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-md-outline-variant bg-md-surface-variant focus:border-md-primary focus:outline-none w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-md-on-surface-variant w-5 h-5" />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('filterDrawer').showModal()}
              className="p-2 rounded-full hover:bg-md-surface-variant"
            >
              <Filter className="w-5 h-5 text-md-on-surface" />
            </motion.button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="rounded-full border border-md-outline-variant bg-md-surface-variant px-4 py-2"
            >
              <option value="createdAt">Date Applied</option>
              <option value="name">Name</option>
              <option value="experience">Experience</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="rounded-full border border-md-outline-variant bg-md-surface-variant px-4 py-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={applyFilters}
              className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary"
            >
              Apply
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Filter Dialog */}
      <dialog id="filterDrawer" className="rounded-3xl p-0 bg-md-surface shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-md-outline">
          <h3 className="text-xl font-semibold text-md-on-surface">Filter Candidates</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
              Candidate Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {candidateStatuses.map(status => (
                <div key={status.id} className="flex items-center">
                  <input
                    id={`status-${status.id}`}
                    type="checkbox"
                    checked={filters.status.includes(status.id)}
                    onChange={() => {
                      if (filters.status.includes(status.id)) {
                        handleFilterChange('status', filters.status.filter(s => s !== status.id));
                      } else {
                        handleFilterChange('status', [...filters.status, status.id]);
                      }
                    }}
                    className="h-4 w-4 text-md-primary"
                  />
                  <label htmlFor={`status-${status.id}`} className="ml-2 text-md-on-surface">
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
              Minimum Experience (years)
            </label>
            <input
              type="number"
              min="0"
              value={filters.experience || ""}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="w-full rounded-xl border border-md-outline bg-transparent px-4 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={filters.skills.join(", ")}
              onChange={(e) => handleFilterChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full rounded-xl border border-md-outline bg-transparent px-4 py-2"
              placeholder="React, TypeScript, Node.js..."
            />
          </div>
        </div>
        <div className="p-4 border-t border-md-outline flex justify-end gap-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-variant"
          >
            Reset
          </button>
          <button
            onClick={() => {
              applyFilters();
              document.getElementById('filterDrawer').close();
            }}
            className="px-4 py-2 rounded-full bg-md-primary text-md-on-primary"
          >
            Apply Filters
          </button>
        </div>
      </dialog>
      
      {/* Candidates Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-md-error">{error}</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-md-on-surface-variant">No candidates found</p>
            <button 
              onClick={resetFilters}
              className="mt-4 px-6 py-2 rounded-full bg-md-primary text-md-on-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-md-outline">
            <thead className="bg-md-surface-container">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Experience
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Applied On
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-md-surface divide-y divide-md-outline">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-md-surface-variant">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {candidate.profilePicture ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={candidate.profilePicture} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-md-primary-container flex items-center justify-center text-md-on-primary-container font-medium">
                            {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-md-on-surface">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                        <div className="text-sm text-md-on-surface-variant">
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const status = candidateStatuses.find(s => s.id === candidate.status) || candidateStatuses[0];
                      return (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-md-on-surface">
                    {candidate.experience ? `${candidate.experience} years` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-md-on-surface">
                    {new Date(candidate.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => setSelectedCandidate(selectedCandidate === candidate.id ? null : candidate.id)}
                      className="p-2 rounded-full hover:bg-md-surface-container-high"
                    >
                      <MoreHorizontal className="h-5 w-5 text-md-on-surface" />
                    </button>
                    
                    <AnimatePresence>
                      {selectedCandidate === candidate.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 mt-2 w-48 rounded-xl bg-md-surface shadow-lg z-10 border border-md-outline overflow-hidden"
                        >
                          <div className="py-1">
                            {candidateStatuses.map(status => (
                              <button
                                key={status.id}
                                onClick={() => updateCandidateStatus(candidate.id, status.id)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  candidate.status === status.id
                                    ? 'bg-md-primary-container text-md-on-primary-container'
                                    : 'text-md-on-surface hover:bg-md-surface-variant'
                                }`}
                              >
                                Change to: {status.label}
                              </button>
                            ))}
                            <div className="border-t border-md-outline"></div>
                            <a
                              href={`/candidates/${candidate.id}`}
                              className="block px-4 py-2 text-sm text-md-on-surface hover:bg-md-surface-variant"
                            >
                              View Profile
                            </a>
                            <a
                              href={`/candidates/${candidate.id}/interview`}
                              className="block px-4 py-2 text-sm text-md-on-surface hover:bg-md-surface-variant"
                            >
                              Schedule Interview
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="p-4 border-t border-md-outline flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-md-on-surface-variant">
            Showing {candidates.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
            {Math.min(currentPage * pageSize, candidates.length)} of {totalPages * pageSize} results
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            className="ml-4 rounded-full border border-md-outline-variant bg-md-surface-variant px-3 py-1"
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-md-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-md-on-surface" />
          </button>
          
          {/* Page numbers */}
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first page, last page, current page, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-md-primary text-md-on-primary'
                        : 'hover:bg-md-surface-variant text-md-on-surface'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <span key={page} className="px-1">...</span>;
              }
              return null;
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-md-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5 text-md-on-surface" />
          </button>
        </div>
      </div>
    </div>
  );
}
