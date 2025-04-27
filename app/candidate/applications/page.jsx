"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useStore from "@/app/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon as BuildingOfficeIconOutline,
  MapPinIcon as MapPinIconOutline,
  BriefcaseIcon as BriefcaseIconOutline,
  CalendarIcon as CalendarIconOutline,
  EyeIcon as EyeIconOutline,
  NoSymbolIcon as NoSymbolIconOutline,
  AdjustmentsHorizontalIcon, 
  ChevronDownIcon as ChevronDownIconOutline,
} from "@heroicons/react/24/outline";
import { BriefcaseIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";

export default function ApplicationsPage() {
  // ... existing state declarations ...
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
  const CACHE_KEY = "candidate_applications";

  // ... existing fetchApplications, handleRefresh, useEffect hooks ...
  const fetchApplications = async (forceRefresh = false) => {
    try {
      setRefreshing(forceRefresh);
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
    setTitle("My Applications");
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
    } else {
       setStats({ total: 0, pending: 0, accepted: 0, rejected: 0 });
    }
  }, [applications]);


  // Updated Status Badge Styles for Material You
  const getStatusClassName = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center";
    const classes = {
      Applied: `${baseStyle} bg-md-primary-container text-md-on-primary-container`,
      "In Progress": `${baseStyle} bg-md-secondary-container text-md-on-secondary-container`,
      Completed: `${baseStyle} bg-md-tertiary-container text-md-on-tertiary-container`, // Assuming Completed maps to Tertiary
      Rejected: `${baseStyle} bg-md-error-container text-md-on-error-container`,
      Accepted: `${baseStyle} bg-green-100 text-green-700`, // Keep specific green for Accepted for clarity
    };
    return classes[status] || `${baseStyle} bg-md-surface-variant text-md-on-surface-variant`;
  };

  // ... existing filteredApplications logic ...
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

  // ... existing triggerVibration, handleButtonClick ...
  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50); // Vibrate for 50ms
    }
  };

  const handleButtonClick = (action) => {
    triggerVibration();
    console.log(`Action triggered: ${action}`);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-md-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-md-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-md-on-surface font-medium">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto md:bg-md-surface-container min-h-screen p-4 md:p-6 rounded-tl-3xl pb-28 md:pb-12">
      <div className="max-w-screen-xl mx-auto">
        {/* Floating Action Button for Refresh */}
        <div className="fixed right-4 top-4 z-10">  
          <motion.button
            onClick={handleRefresh}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full shadow-md ${
              refreshing
                ? "bg-md-primary-container text-md-on-primary-container"
                : "bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-surface-container-highest"
            } transition-colors duration-150`}
            disabled={refreshing}
            aria-label="Refresh applications"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </motion.button>
        </div>

        {/* Stats Cards - Material You Inspired */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 mt-4">
          {[
            { label: "Total", value: stats.total, icon: ClipboardDocumentCheckIcon, color: "primary" },
            { label: "Pending", value: stats.pending, icon: ClockIcon, color: "secondary" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircleIcon, color: "green" },
            { label: "Rejected", value: stats.rejected, icon: XCircleIcon, color: "error" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const bgColors = {
              primary: "bg-md-primary-container",
              secondary: "bg-md-secondary-container",
              green: "bg-green-100", 
              error: "bg-md-error-container",
            };
            const textColors = {
              primary: "text-md-on-primary-container",
              secondary: "text-md-on-secondary-container",
              green: "text-green-700",
              error: "text-md-on-error-container",
            };
            const iconColors = {
              primary: "text-md-primary",
              secondary: "text-md-secondary",
              green: "text-green-600",
              error: "text-md-error",
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => triggerVibration()}
                className={`${bgColors[stat.color]} p-4 rounded-2xl shadow-sm flex flex-col items-start transition-all duration-200 ease-out border border-md-outline/20`}
              >
                <div className={`p-1.5 rounded-full bg-md-surface mb-3`}>
                   <Icon className={`h-5 w-5 ${iconColors[stat.color]}`} />
                </div>
                <div className={`text-2xl font-semibold ${textColors[stat.color]}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${textColors[stat.color]} opacity-90 mt-1`}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters - Material You Design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mb-6 bg-md-surface-container-highest p-4 rounded-3xl shadow-sm border border-md-outline/20"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="relative flex-1 min-w-[150px]">
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => {
                  triggerVibration();
                  setFilters({ ...filters, status: e.target.value });
                }}
                className="w-full appearance-none pl-10 pr-10 py-3 rounded-lg border border-md-outline bg-md-surface-container text-md-on-surface-variant focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-md-on-surface-variant" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIconOutline className="h-5 w-5 text-md-on-surface-variant" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative flex-1 min-w-[150px]">
              <select
                id="date-filter"
                value={filters.date}
                onChange={(e) => {
                  triggerVibration();
                  setFilters({ ...filters, date: e.target.value });
                }}
                className="w-full appearance-none pl-10 pr-10 py-3 rounded-lg border border-md-outline bg-md-surface-container text-md-on-surface-variant focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CalendarIconOutline className="h-5 w-5 text-md-on-surface-variant" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIconOutline className="h-5 w-5 text-md-on-surface-variant" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conditional Rendering for Applications List or Empty State */}
        {filteredApplications.length > 0 ? (
          <>
            {/* Mobile Card View - Enhanced for Material You */}
            <div className="block md:hidden space-y-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    triggerVibration();
                  }}
                  className="bg-md-surface-container-highest rounded-2xl shadow-sm p-5 border border-md-outline/20 overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <h3 className="font-medium text-md-on-surface text-base leading-tight">
                        {application.jobTitle || "N/A"}
                      </h3>
                      <p className="text-sm text-md-on-surface-variant flex items-center mt-1 opacity-80">
                        <BuildingOfficeIconOutline className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        {application.companyName || "N/A"}
                      </p>
                    </div>
                    <span className={getStatusClassName(application.status)}>
                      {application.status}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-sm mb-4">
                    <div className="flex items-center text-md-on-surface-variant opacity-90">
                      <CalendarIcon className="h-4 w-4 mr-2 text-md-secondary flex-shrink-0" />
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-md-on-surface-variant opacity-90">
                      <MapPinIcon className="h-4 w-4 mr-2 text-md-secondary flex-shrink-0" />
                      {application.location || "Remote"}
                    </div>
                    <div className="flex items-center text-md-on-surface-variant opacity-90">
                      <BriefcaseIcon className="h-4 w-4 mr-2 text-md-secondary flex-shrink-0" />
                      {application.jobType || "Full Time"}
                    </div>
                  </div>
                  <motion.button
                    className="w-full mt-3 text-center bg-md-primary text-md-on-primary hover:opacity-90 px-4 py-2.5 rounded-full text-sm font-medium transition-opacity flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      Router.push("/candidate/applications/" + application.id);
                      triggerVibration();
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <EyeIconOutline className="h-4 w-4 mr-2" />
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table View - Enhanced for Material You */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="hidden md:block bg-md-surface-container-highest rounded-3xl shadow-sm overflow-hidden border border-md-outline/20"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-md-outline/30 bg-md-surface-container-high">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">Job</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">Applied Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-md-outline/20">
                    {filteredApplications.map((application, index) => (
                      <motion.tr
                        key={application.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        whileHover={{ backgroundColor: "var(--md-sys-color-surface-container-high)" }}
                        className="transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-md-on-surface">{application.jobTitle || "N/A"}</div>
                          <div className="text-xs text-md-on-surface-variant opacity-80">{application.jobType || "Full Time"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-md-on-surface">{application.companyName || "N/A"}</div>
                          <div className="text-xs text-md-on-surface-variant opacity-80">{application.location || "Remote"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusClassName(application.status)}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-md-on-surface-variant">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <motion.button
                            className="text-md-on-primary bg-md-primary hover:opacity-90 px-3 py-1.5 rounded-full transition-colors font-medium"
                            onClick={() => {
                              Router.push("/candidate/applications/" + application.id);
                              triggerVibration();
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Details
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : (
          // Empty State - Enhanced for Material You
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center py-16 px-6 bg-md-surface-container-highest rounded-3xl border border-md-outline/20 shadow-sm"
          >
            <NoSymbolIconOutline className="h-16 w-16 mx-auto text-md-on-surface-variant opacity-50" />
            <h3 className="mt-6 text-xl font-medium text-md-on-surface">No Applications Found</h3>
            <p className="mt-3 text-md-on-surface-variant opacity-80 max-w-md mx-auto">
              Try adjusting the filters or browse and apply to new jobs to get started.
            </p>
            <Link href="/candidate/jobs" passHref>
               <motion.button
                  className="mt-8 inline-flex items-center px-6 py-3 bg-md-primary text-md-on-primary rounded-full text-sm font-medium shadow-sm hover:bg-opacity-90 transition-colors"
                  whileTap={{ scale: 0.97 }}
                  onClick={triggerVibration}
                >
                  <BriefcaseIconOutline className="h-5 w-5 mr-2" />
                  Browse Jobs
                </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Extended FAB - Material You */}
        <motion.div
          className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/candidate/jobs" passHref>
            <button
              className="flex items-center justify-center h-14 px-6 rounded-full bg-md-primary text-md-on-primary shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-md-primary"
              onClick={() => triggerVibration()}
              aria-label="Browse Jobs"
            >
              <BriefcaseIconOutline className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline text-sm font-medium">Browse Jobs</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
