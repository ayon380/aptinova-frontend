"use client";
import { useState, useEffect } from "react";
import useStore from "../../../store"; // Import the store

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHR, setNewHR] = useState({ name: "", email: "", department: "" });
  const [error, setError] = useState("");

  // Get cache functions from the store
  const { getCache, setCache } = useStore();

  useEffect(() => {
    fetchTeamMembers();
  }, [page, searchTerm]); // Dependencies remain the same

  const fetchTeamMembers = async () => {
    const cacheKey = `team-members-${page}-${searchTerm}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      console.log("Using cached data for:", cacheKey);
      setTeamMembers(cachedData.hrs);
      setPagination(cachedData.pagination);
      setLoading(false);
      return; // Exit if cache hit
    }

    console.log("Fetching data for:", cacheKey);
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/hrs?page=${page}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to fetch team members");
      }

      setTeamMembers(data.hrs);
      setPagination(data.pagination);
      setCache(cacheKey, { hrs: data.hrs, pagination: data.pagination }); // Store fetched data in cache
      setError(""); // Clear previous errors on success
    } catch (err) {
      setError(err.message || "Failed to fetch team members");
      // Optionally clear cache on error or handle differently
      // setCache(cacheKey, null); // Example: invalidate cache on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddHR = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/hr/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(newHR),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg);
      }

      setShowAddModal(false);
      setNewHR({ name: "", email: "", department: "" });
      // Refetching will update the cache automatically via fetchTeamMembers
      fetchTeamMembers();
      setError(""); // Clear error on success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this HR?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/hr/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete HR");
      // Refetching will update the cache automatically via fetchTeamMembers
      fetchTeamMembers();
      setError(""); // Clear error on success
    } catch (err) {
      setError("Failed to delete HR");
    }
  };

  return (
    <div className="p-6 bg-md-surface-container rounded-tl-3xl h-full ">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-md-on-surface">
          HR Team Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add HR
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-md-on-surface-variant"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search HR team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md pl-12 pr-4 py-3 bg-md-surface-container-high border border-md-outline rounded-full focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary text-md-on-surface placeholder:text-md-on-surface-variant"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-md-error-container text-md-on-error-container rounded-3xl">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-md-surface-container rounded-3xl p-4 shadow-md animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-md-surface-variant h-12 w-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-md-surface-variant rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-md-surface-variant rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-md-surface-variant rounded"></div>
                <div className="h-3 bg-md-surface-variant rounded w-5/6"></div>
                <div className="h-3 bg-md-surface-variant rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {teamMembers.length === 0 ? (
            <div className="col-span-full p-8 flex flex-col items-center justify-center bg-md-surface-container rounded-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-md-outline mb-3"
              >
                <path
                  fillRule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                  clipRule="evenodd"
                />
                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
              </svg>
              <p className="text-md-on-surface-variant text-center">
                No team members found
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                Add HR Team Member
              </button>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.id || member._id}
                className="bg-md-surface rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={member.profilePicture || "/default-avatar.png"}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-md-outline-variant"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md-on-surface font-medium truncate">
                          {member.name}
                        </h3>
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium
                              ${
                                member.status === "active"
                                  ? "bg-md-primary-container text-md-on-primary-container"
                                  : "bg-md-tertiary-container text-md-on-tertiary-container"
                              }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                member.status === "active"
                                  ? "bg-md-primary"
                                  : "bg-md-tertiary"
                              }`}
                            ></span>
                            {member.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-md-on-surface-variant text-sm truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="px-3 py-2 bg-md-surface-container-low rounded-xl">
                      <p className="text-md-on-surface-variant text-xs">
                        Department
                      </p>
                      <p className="text-md-on-surface font-medium truncate">
                        {member.department}
                      </p>
                    </div>
                    <div className="px-3 py-2 bg-md-surface-container-low rounded-xl">
                      <p className="text-md-on-surface-variant text-xs">
                        Joined
                      </p>
                      <p className="text-md-on-surface font-medium">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="rounded-full p-3 text-md-on-surface-variant hover:bg-md-error-container hover:text-md-on-error-container transition-colors"
                      aria-label="Delete HR"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 001.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {pagination && (
        <div className="sticky bottom-4 mx-auto max-w-4xl bg-md-surface-container-high border border-md-outline-variant shadow-md rounded-3xl p-4 z-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="text-sm text-md-on-surface-variant">
              Showing {(page - 1) * 10 + 1} to{" "}
              {Math.min(page * 10, pagination.total)} of {pagination.total}{" "}
              results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full flex items-center gap-1 disabled:opacity-50 disabled:bg-md-surface-variant disabled:text-md-on-surface-variant bg-md-surface-container-high hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded-full flex items-center gap-1 disabled:opacity-50 disabled:bg-md-surface-variant disabled:text-md-on-surface-variant bg-md-surface-container-high hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12l-6.97-6.97a.75.75 0 011.06-1.06l7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div
            className="bg-md-surface rounded-3xl w-full max-w-md overflow-hidden shadow-lg animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-md-outline-variant">
              <h2 className="text-xl font-medium text-md-on-surface">
                Add New HR Team Member
              </h2>
              <p className="text-md-on-surface-variant text-sm mt-1">
                Fill in the details to add a new HR team member to your
                organization. They will receive an invitation email.
              </p>
            </div>
            <form onSubmit={handleAddHR} className="p-6">
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newHR.name}
                    onChange={(e) =>
                      setNewHR({ ...newHR, name: e.target.value })
                    }
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="name"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Full Name *
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newHR.email}
                    onChange={(e) =>
                      setNewHR({ ...newHR, email: e.target.value })
                    }
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Work Email *
                  </label>
                  <p className="mt-1 text-xs text-md-on-surface-variant ml-6">
                    This email will be used for login and communications
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={newHR.department}
                    onChange={(e) =>
                      setNewHR({ ...newHR, department: e.target.value })
                    }
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="department"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Department *
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Phone Number (optional)
                  </label>
                </div>
              </div>

              <div className="mt-4 p-3 bg-md-tertiary-container rounded-2xl text-md-on-tertiary-container text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    New team members will receive an invitation email with
                    instructions to set up their account.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 border border-md-outline-variant text-md-on-surface rounded-full hover:bg-md-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                >
                  Add HR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
