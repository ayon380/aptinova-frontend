"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useStore from "@/app/store";
import { useRouter } from "next/navigation";
// Add these icons for the stats cards
import Link from "next/link";
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const Router = useRouter();
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const { setTitle, setCache, getCache } = useStore();
  
  const CACHE_KEY = 'candidate_applications';

  const fetchApplications = async (forceRefresh = false) => {
    try {
      setRefreshing(forceRefresh);
      
      // Check cache if not forcing refresh
      if (!forceRefresh) {
        const cachedData = getCache(CACHE_KEY);
        if (cachedData) {
          console.log("Using cached applications data");
          setApplications(cachedData);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }
      
      // Cache miss or forced refresh, fetch from API
      console.log("Fetching applications from API");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/applications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();
      
      // Update state and cache
      setApplications(data);
      setCache(CACHE_KEY, data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    triggerVibration();
    fetchApplications(true);
  };

  useEffect(() => {
    fetchApplications();
    setTitle("Home");
  }, []);

  useEffect(() => {
    if (applications.length > 0) {
      setStats({
        total: applications.length,
        pending: applications.filter((app) =>
          ["Applied", "In Progress"].includes(app.status)
        ).length,
        accepted: applications.filter((app) => app.status === "Accepted")
          .length,
        rejected: applications.filter((app) => app.status === "Rejected")
          .length,
      });
    }
  }, [applications]);

  const getStatusClassName = (status) => {
    const classes = {
      Applied: "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      Completed: "bg-purple-100 text-purple-800",
      Rejected: "bg-red-100 text-red-800",
      Accepted: "bg-green-100 text-green-800",
    };
    return `px-2 py-1 rounded-full text-sm ${
      classes[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  const filteredApplications = applications.filter((app) => {
    if (filters.status !== "all" && app.status !== filters.status) return false;
    if (filters.date === "today") {
      const today = new Date().toDateString();
      return new Date(app.createdAt).toDateString() === today;
    }
    if (filters.date === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(app.createdAt) >= weekAgo;
    }
    if (filters.date === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(app.createdAt) >= monthAgo;
    }
    return true;
  });

  // Function to trigger vibration feedback
  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50); // Vibrate for 50ms
    }
  };

  // Handle button click with vibration
  const handleButtonClick = (action) => {
    triggerVibration();
    // Additional action logic here
    console.log(`Action triggered: ${action}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
      </div>
    );
  }

  return (
    <div className="container text-xl bg-md-background mx-auto px-4 sm:px-6 pb-24 md:pb-8">
      {/* Stats Cards with Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-semibold text-md-on-surface">My Applications</h2>
        <motion.button
          onClick={handleRefresh}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full ${refreshing ? 'bg-md-primary-container' : 'bg-md-surface'}`}
          disabled={refreshing}
          aria-label="Refresh applications"
        >
          <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin text-md-primary' : 'text-md-on-surface-variant'}`} />
        </motion.button>
      </div>
      
      {/* Stats Cards - 2x2 Grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[ 
          {
            label: "Total",
            value: stats.total,
            color: "text-md-on-surface",
            bgColor: "bg-md-surface-container",
            icon: (
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-md-on-surface-variant" />
            ),
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            icon: <ClockIcon className="h-6 w-6 text-blue-600" />,
          },
          {
            label: "Accepted",
            value: stats.accepted,
            color: "text-green-600",
            bgColor: "bg-green-50",
            icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
          },
          {
            label: "Rejected",
            value: stats.rejected,
            color: "text-red-600",
            bgColor: "bg-red-50",
            icon: <XCircleIcon className="h-6 w-6 text-red-600" />,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerVibration()}
            className={`${stat.bgColor} p-4 md:p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center`}
          >
            <div className="mb-2">{stat.icon}</div>
            <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-md-on-surface-variant mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile-optimized Filters with icons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative w-full sm:w-auto">
          <select
            value={filters.status}
            onChange={(e) => {
              triggerVibration();
              setFilters({ ...filters, status: e.target.value });
            }}
            className="w-full appearance-none pl-10 pr-10 py-3 rounded-full border border-md-outline bg-md-surface text-md-on-surface focus:outline-none focus:border-md-primary"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FilterIcon className="h-5 w-5 text-md-on-surface-variant" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon className="h-5 w-5 text-md-on-surface-variant" />
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={filters.date}
            onChange={(e) => {
              triggerVibration();
              setFilters({ ...filters, date: e.target.value });
            }}
            className="w-full appearance-none pl-10 pr-10 py-3 rounded-full border border-md-outline bg-md-surface text-md-on-surface focus:outline-none focus:border-md-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <CalendarIcon className="h-5 w-5 text-md-on-surface-variant" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon className="h-5 w-5 text-md-on-surface-variant" />
          </div>
        </div>
      </div>

      {/* Mobile Card View with improved UI */}
      <div className="block md:hidden">
        {filteredApplications.map((application) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerVibration()}
            className="mb-4 bg-md-surface rounded-3xl shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-md-on-surface">
                  {application.jobTitle || "N/A"}
                </h3>
                <p className="text-sm text-md-on-surface-variant flex items-center mt-1">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {application.companyName || "N/A"}
                </p>
              </div>
              <span className={getStatusClassName(application.status)}>
                {application.status}
              </span>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-md-on-surface-variant flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Applied:
                </span>
                <span className="text-md-on-surface">
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md-on-surface-variant flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  Location:
                </span>
                <span className="text-md-on-surface">
                  {application.location || "Remote"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md-on-surface-variant flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  Job Type:
                </span>
                <span className="text-md-on-surface">
                  {application.jobType || "Full Time"}
                </span>
              </div>
            </div>
            <motion.button
              className="w-full mt-4 text-center text-md-primary hover:text-md-on-primary-container hover:bg-md-primary-container px-4 py-3 rounded-full transition-colors flex items-center justify-center"
              onClick={(e) => {
                Router.push("/candidate/applications/" + application.id);
              }}
              whileTap={{ scale: 0.95 }}
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-md-surface rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-md-surface-container">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-md-outline bg-md-surface">
              {filteredApplications.map((application) => (
                <motion.tr
                  key={application.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-md-on-surface">
                    <div className="font-medium">
                      {application.jobTitle || "N/A"}
                    </div>
                    <div className="text-sm text-md-on-surface-variant">
                      {application.jobType || "Full Time"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-md-on-surface">
                      {application.companyName || "N/A"}
                    </div>
                    <div className="text-sm text-md-on-surface-variant">
                      {application.location || "Remote"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusClassName(application.status)}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-md-on-surface">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-md-primary hover:text-md-on-primary-container hover:bg-md-primary-container px-3 py-1 rounded-full transition-colors"
                      onClick={() => {
                        Router.push(
                          "/candidate/applications/" + application.id
                        );
                        triggerVibration();
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-md-on-surface-variant mb-2">
              No applications found
            </div>
            <p className="text-sm text-md-on-surface-variant">
              Try adjusting your filters or apply to more jobs
            </p>
          </div>
        )}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 bg-md-surface rounded-3xl">
          <NoSymbolIcon className="h-12 w-12 mx-auto text-md-on-surface-variant" />
          <div className="text-md-on-surface-variant mb-2 mt-4">
            No applications found
          </div>
          <p className="text-sm text-md-on-surface-variant">
            Try adjusting your filters or apply to more jobs
          </p>
        </div>
      )}

      {/* Mobile-optimized FAB with vibration */}

      <motion
        className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 h-14 px-6 rounded-full bg-md-primary text-md-on-primary shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => triggerVibration()}
      >
        {" "}
        <Link href="/candidate/jobs" className="flex ">
          <BriefcaseIcon className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Browse Jobs</span>
        </Link>
      </motion>
    </div>
  );
}

// Simple icon components
const FilterIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
    />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const BuildingOfficeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
    />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const NoSymbolIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
    />
  </svg>
);
