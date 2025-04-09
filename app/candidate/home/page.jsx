"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/app/store";
import { format } from "date-fns";

// Component for empty state placeholders
const EmptyState = ({ message, icon }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl border border-dashed border-md-outline bg-md-surface-container-low text-center"
  >
    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{icon}</div>
    <p className="text-md-on-surface-variant text-base sm:text-lg">{message}</p>
  </motion.div>
);

// Shimmer loading effect component
const ShimmerLoading = ({ className }) => (
  <div
    className={`animate-pulse bg-md-surface-variant rounded-3xl ${className}`}
  ></div>
);

const Page = () => {
  const { userdata, setTitle } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    setTitle("Home");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/home`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError(error.message);
      toast.error("Failed to load dashboard: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date in a readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Get status color based on application status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-md-tertiary-container text-md-on-tertiary-container";
      case "screening":
        return "bg-md-secondary-container text-md-on-secondary-container";
      case "interviewing":
        return "bg-md-primary-container text-md-on-primary-container";
      case "offered":
        return "bg-md-success-container text-md-on-success-container";
      case "rejected":
        return "bg-md-error-container text-md-on-error-container";
      case "hired":
        return "bg-md-success-container text-md-on-success-container";
      default:
        return "bg-md-surface-variant text-md-on-surface-variant";
    }
  };

  // Get status icon based on application status
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "📝";
      case "screening":
        return "🔍";
      case "interviewing":
        return "👥";
      case "offered":
        return "🎉";
      case "rejected":
        return "❌";
      case "hired":
        return "✅";
      default:
        return "📋";
    }
  };

  // Get event icon based on event type
  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "interview":
        return "👥";
      case "test":
        return "📝";
      case "assessment":
        return "🧠";
      case "offer":
        return "💼";
      case "background check":
        return "🔍";
      default:
        return "📅";
    }
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-6 w-full">
        {/* Loading skeleton for dashboard */}
        <div className="mb-6 sm:mb-8">
          <ShimmerLoading className="h-10 sm:h-12 mb-3 sm:mb-4 w-2/3" />
          <ShimmerLoading className="h-5 sm:h-6 mb-2 w-1/2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <ShimmerLoading className="h-28 sm:h-32" />
          <ShimmerLoading className="h-28 sm:h-32" />
          <ShimmerLoading className="h-28 sm:h-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <ShimmerLoading className="h-7 sm:h-8 mb-3 sm:mb-4 w-1/3" />
            <div className="space-y-3 sm:space-y-4">
              <ShimmerLoading className="h-20 sm:h-24" />
              <ShimmerLoading className="h-20 sm:h-24" />
              <ShimmerLoading className="h-20 sm:h-24" />
            </div>
          </div>
          <div>
            <ShimmerLoading className="h-7 sm:h-8 mb-3 sm:mb-4 w-1/3" />
            <div className="space-y-3 sm:space-y-4">
              <ShimmerLoading className="h-20 sm:h-24" />
              <ShimmerLoading className="h-20 sm:h-24" />
              <ShimmerLoading className="h-20 sm:h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-6"
      >
        <div className="text-md-error text-5xl sm:text-6xl mb-3 sm:mb-4">
          ⚠️
        </div>
        <h2 className="text-lg sm:text-xl font-medium text-md-on-surface mb-2">
          Something went wrong
        </h2>
        <p className="text-md-on-surface-variant mb-5 sm:mb-6 text-center">
          {error}
        </p>
        <button
          onClick={fetchDashboardData}
          className="px-5 sm:px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-all"
        >
          Try again
        </button>
      </motion.div>
    );
  }

  // For empty dashboard - new user
  const isEmptyDashboard =
    dashboardData && dashboardData.applications.stats.total === 0;

  return (
    <div className="p-3 sm:p-6 h-full overflow-y-scroll md:overflow-hidden w-full">
      {dashboardData && (
        <>
          {/* Greeting Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-md-on-surface mb-1">
              Hello, {dashboardData.profile.firstName}! 👋
            </h1>
            <p className="text-md-on-surface-variant text-base sm:text-lg">
              {isEmptyDashboard
                ? "Welcome to your dashboard. Start applying for jobs to see your progress!"
                : "Here's what's happening with your job applications"}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            {/* Total Applications Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-md-surface-container rounded-3xl p-4 sm:p-6 shadow-sm border border-md-outline"
            >
              <div className="text-3xl sm:text-4xl text-md-primary mb-1 sm:mb-2">
                {dashboardData.applications.stats.total || 0}
              </div>
              <div className="text-md-on-surface font-medium">
                Total Applications
              </div>
              <p className="text-md-on-surface-variant text-xs sm:text-sm mt-1">
                Jobs you've applied to
              </p>
            </motion.div>

            {/* Active Applications Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-md-surface-container rounded-3xl p-4 sm:p-6 shadow-sm border border-md-outline"
            >
              <div className="text-3xl sm:text-4xl text-md-tertiary mb-1 sm:mb-2">
                {((dashboardData.applications.stats.byStatus || {}).screening ||
                  0) +
                  ((dashboardData.applications.stats.byStatus || {})
                    .interviewing || 0)}
              </div>
              <div className="text-md-on-surface font-medium">
                Active Applications
              </div>
              <p className="text-md-on-surface-variant text-xs sm:text-sm mt-1">
                In screening or interview stages
              </p>
            </motion.div>

            {/* Upcoming Events Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-md-surface-container rounded-3xl p-4 sm:p-6 shadow-sm border border-md-outline"
            >
              <div className="text-3xl sm:text-4xl text-md-secondary mb-1 sm:mb-2">
                {(dashboardData.upcomingEvents || []).length}
              </div>
              <div className="text-md-on-surface font-medium">
                Upcoming Events
              </div>
              <p className="text-md-on-surface-variant text-xs sm:text-sm mt-1">
                Interviews and assessments
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-md-on-surface mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">📝</span> Recent Applications
              </h2>

              {isEmptyDashboard ? (
                <EmptyState
                  message="You haven't applied to any jobs yet. Start your search!"
                  icon="🔍"
                />
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence>
                    {(dashboardData.applications.recent || []).map(
                      (application, index) => (
                        <motion.div
                          key={application.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.01 }}
                          className="bg-md-surface-container rounded-3xl p-4 sm:p-5 border border-md-outline shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                              {/* Company Logo */}
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-md-surface-container-highest flex items-center justify-center overflow-hidden">
                                {application.organization.logo ? (
                                  <img
                                    src={application.organization.logo}
                                    alt={application.organization.companyName}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-lg sm:text-xl">
                                    {application.organization.companyName.charAt(
                                      0
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Job Details */}
                              <div>
                                <h3 className="font-medium text-md-on-surface">
                                  {application.job.title}
                                </h3>
                                <p className="text-md-on-surface-variant text-sm">
                                  {application.organization.companyName}
                                </p>
                                <p className="text-xs text-md-on-surface-variant mt-1">
                                  Applied on{" "}
                                  {format(
                                    new Date(application.appliedAt),
                                    "MMM d, yyyy"
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div
                              className={`flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(
                                application.status
                              )} self-start sm:self-auto`}
                            >
                              <span className="mr-1">
                                {getStatusIcon(application.status)}
                              </span>
                              {application.status}
                            </div>
                          </div>

                          {/* Application Score */}
                          {application.score !== null && (
                            <div className="mt-3 pt-3 border-t border-md-outline-variant">
                              <div className="flex items-center">
                                <span className="text-md-on-surface-variant text-xs sm:text-sm mr-2">
                                  Match Score:
                                </span>
                                <div className="bg-md-surface-container-low rounded-full h-2 flex-grow">
                                  <div
                                    className="bg-md-primary h-2 rounded-full"
                                    style={{ width: `${application.score}%` }}
                                  ></div>
                                </div>
                                <span className="text-md-on-surface ml-2 text-xs sm:text-sm font-medium">
                                  {application.score}%
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  {/* View All Link */}
                  {dashboardData.applications.stats.total > 5 && (
                    <div className="text-center mt-4">
                      <a
                        href="/candidate/applications"
                        className="inline-flex items-center text-md-primary hover:text-md-on-primary-container hover:bg-md-primary-container px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base"
                      >
                        View all {dashboardData.applications.stats.total}{" "}
                        applications
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Upcoming Events Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-md-on-surface mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">📅</span> Upcoming Events
              </h2>

              {!dashboardData.upcomingEvents ||
              dashboardData.upcomingEvents.length === 0 ? (
                <EmptyState
                  message="No upcoming events scheduled. Check back later!"
                  icon="🗓️"
                />
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 sm:left-5 top-6 bottom-0 w-px bg-md-outline-variant"></div>

                  {/* Events */}
                  <div className="space-y-4 sm:space-y-6">
                    <AnimatePresence>
                      {dashboardData.upcomingEvents.map((event, index) => (
                        <motion.div
                          key={`event-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start relative"
                        >
                          {/* Timeline dot */}
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-md-secondary-container flex items-center justify-center z-10">
                            <span className="text-sm sm:text-base">
                              {getEventIcon(event.type)}
                            </span>
                          </div>

                          {/* Event details */}
                          <div className="ml-3 sm:ml-4 bg-md-surface-container rounded-3xl p-3 sm:p-4 border border-md-outline flex-grow shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="font-medium text-md-on-surface text-sm sm:text-base">
                                  {event.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-md-on-surface-variant">
                                  {event.jobTitle} at {event.companyName}
                                </p>
                              </div>
                              <div className="mt-1 md:mt-0 text-md-tertiary font-medium text-xs sm:text-sm">
                                {formatDate(event.date)}
                              </div>
                            </div>
                            {event.description && (
                              <p className="mt-2 text-xs sm:text-sm text-md-on-surface">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* View Calendar Link */}
                  <div className="text-center mt-5 sm:mt-6 pt-4 sm:pt-6 border-t border-md-outline-variant">
                    <a
                      href="/candidate/calendar"
                      className="inline-flex items-center text-md-primary hover:text-md-on-primary-container hover:bg-md-primary-container px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base"
                    >
                      Open full calendar
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
