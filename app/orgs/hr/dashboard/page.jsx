"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useStore from "@/app/store";
import Image from "next/image";

// Chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Page = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setTitle, getCache, setCache } = useStore();

  const hrDashboardCacheKey = "hrDashboardData";

  useEffect(() => {
    setTitle("HR Dashboard");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Check cache first
    const cachedData = getCache(hrDashboardCacheKey);
    if (cachedData) {
      console.log("Loading dashboard data from cache");
      setDashboardData(cachedData);
      setLoading(false);
      return;
    }

    console.log("Fetching dashboard data from API");
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch dashboard data (${response.status})`
        );
      }

      const data = await response.json();
      setDashboardData(data);
      setCache(hrDashboardCacheKey, data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color for visual indicators
  const getStatusColor = (status) => {
    const statusColors = {
      Open: "#4CAF50",
      Closed: "#F44336",
      Paused: "#FFC107",
      Filled: "#2196F3",
      "In Progress": "#9C27B0",
      Pending: "#FF9800",
      Completed: "#00C853",
    };
    return statusColors[status] || "#9E9E9E";
  };

  // Transform job status data for pie chart
  const prepareJobStatusData = (statusCounts) => {
    if (!statusCounts) return [];
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: getStatusColor(status),
    }));
  };

  // Calculate card animation delay
  const getCardDelay = (index) => 0.1 + index * 0.1;

  // Render profile avatar with initials if no image
  const renderAvatar = (name, profilePicture) => {
    if (profilePicture) {
      return (
        <Image
          src={profilePicture}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
        />
      );
    }

    // Get initials from name
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="w-10 h-10 bg-md-primary-container rounded-full flex items-center justify-center text-md-on-primary-container font-medium">
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-md-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-md-on-surface font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-md-background">
        <div className="text-center p-6 bg-md-error-container rounded-3xl max-w-md">
          <svg
            className="w-12 h-12 text-md-on-error-container mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-semibold text-md-on-error-container mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-md-on-error-container">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll min-h-screen p-4 md:p-6">
      {dashboardData && (
        <div className="max-w-screen-2xl mx-auto">
         
          {/* Statistics Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(0) }}
              className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Total Jobs
                  </h3>
                  <p className="text-md-on-surface text-3xl font-bold">
                    {dashboardData.stats.totalJobs}
                  </p>
                </div>
                <div className="bg-md-primary-container p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-md-on-primary-container"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium text-md-on-surface">
                  {dashboardData.stats.openJobs} Open
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(1) }}
              className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Total Applicants
                  </h3>
                  <p className="text-md-on-surface text-3xl font-bold">
                    {dashboardData.stats.totalApplicants}
                  </p>
                </div>
                <div className="bg-md-secondary-container p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-md-on-secondary-container"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium text-md-on-surface">
                  {dashboardData.stats.recentApplications} Recent
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(2) }}
              className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Pending Interviews
                  </h3>
                  <p className="text-md-on-surface text-3xl font-bold">
                    {dashboardData.stats.pendingInterviews}
                  </p>
                </div>
                <div className="bg-md-tertiary-container p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-md-on-tertiary-container"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium text-md-on-surface">
                  Upcoming
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(3) }}
              className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Total Items
                  </h3>
                  <p className="text-md-on-surface text-3xl font-bold">
                    {dashboardData.totalItems.jobs +
                      dashboardData.totalItems.applicants +
                      dashboardData.totalItems.interviews}
                  </p>
                </div>
                <div className="bg-md-error-container p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-md-on-error-container"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium text-md-on-surface">
                  Managed Items
                </span>
              </div>
            </motion.div>
          </div>

          {/* Charts and Data Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Job Status Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm"
            >
              <h2 className="text-xl font-semibold text-md-on-surface mb-4">
                Job Status Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareJobStatusData(dashboardData.jobStatusCounts)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {prepareJobStatusData(dashboardData.jobStatusCounts).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        value,
                        props.payload.name,
                      ]}
                      contentStyle={{
                        backgroundColor: "var(--md-surface-container-high)",
                        borderRadius: "16px",
                        border: "none",
                        padding: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {prepareJobStatusData(dashboardData.jobStatusCounts).map(
                  (item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-xs text-md-on-surface">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm"
            >
              <h2 className="text-xl font-semibold text-md-on-surface mb-4">
                Upcoming Interviews
              </h2>
              <div className="overflow-hidden h-80">
                {dashboardData.upcomingInterviews &&
                dashboardData.upcomingInterviews.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto h-full pr-2 pb-4">
                    {dashboardData.upcomingInterviews.map(
                      (interview, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          key={index}
                          className="p-4 bg-md-surface-variant rounded-2xl"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-md-primary-container p-2 rounded-full mr-3">
                                <svg
                                  className="w-5 h-5 text-md-on-primary-container"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-md-on-surface truncate max-w-[150px] sm:max-w-[200px]">
                                  {interview.candidateName}
                                </h3>
                                <p className="text-md-on-surface-variant text-xs truncate">
                                  {interview.jobTitle}
                                </p>
                              </div>
                            </div>
                            <span
                              className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                              style={{
                                backgroundColor: `${getStatusColor(
                                  interview.status
                                )}20`,
                                color: getStatusColor(interview.status),
                              }}
                            >
                              {interview.status}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="text-md-on-surface-variant text-xs">
                              {formatDate(interview.scheduledDate)}
                            </div>
                            <div className="text-md-on-surface-variant text-xs">
                              {interview.scheduledTime}
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg
                      className="w-12 h-12 text-md-on-surface-variant opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-3 text-md-on-surface-variant">
                      No upcoming interviews
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Applicants Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm mb-6"
          >
            <h2 className="text-xl font-semibold text-md-on-surface mb-4">
              Recent Applicants
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
                      Position
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                      Applied On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-md-outline-variant">
                  {dashboardData.recentApplicants &&
                  dashboardData.recentApplicants.length > 0 ? (
                    dashboardData.recentApplicants.map((applicant, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.4 + index * 0.05,
                        }}
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-4">
                              {renderAvatar(
                                applicant.candidateName,
                                applicant.profilePicture
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-md-on-surface">
                                {applicant.candidateName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-md-on-surface">
                            {applicant.jobTitle}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                            style={{
                              backgroundColor: `${getStatusColor(
                                applicant.status
                              )}20`,
                              color: getStatusColor(applicant.status),
                            }}
                          >
                            {applicant.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-md-on-surface">
                          {formatDate(applicant.appliedDate)}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-md-on-surface-variant"
                      >
                        No recent applicants
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Job Summaries Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-md-surface-container-highest p-5 rounded-3xl shadow-sm mb-6"
          >
            <h2 className="text-xl font-semibold text-md-on-surface mb-4">
              Job Summaries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.jobSummaries &&
              dashboardData.jobSummaries.length > 0 ? (
                dashboardData.jobSummaries.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    className="bg-md-surface-variant p-4 rounded-2xl"
                  >
                    <div className="flex items-center mb-3">
                      {job.organization?.logo ? (
                        <div className="mr-3">
                          <Image
                            src={job.organization.logo}
                            alt={job.organization.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-md-secondary-container rounded-full flex items-center justify-center text-md-on-secondary-container mr-3">
                          {job.organization?.name?.charAt(0) || "O"}
                        </div>
                      )}
                      <div className="truncate">
                        <h3 className="text-sm font-medium text-md-on-surface truncate">
                          {job.title}
                        </h3>
                        <p className="text-xs text-md-on-surface-variant">
                          {job.organization?.name || "Unknown Organization"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{
                          backgroundColor: `${getStatusColor(job.status)}20`,
                          color: getStatusColor(job.status),
                        }}
                      >
                        {job.status}
                      </span>
                      <span className="text-xs text-md-on-surface-variant">
                        {job.applicantCount} applicants
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-md-on-surface-variant flex justify-between">
                      <span>Posted: {formatDate(job.postedAt)}</span>
                      {job.deadline && (
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-md-on-surface-variant">
                  No job summaries available
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-md-primary-container p-5 rounded-3xl shadow-sm flex flex-col justify-between mb-4 md:mb-0"
            >
              <div>
                <h3 className="text-md-on-primary-container text-lg font-semibold">
                  Manage Jobs
                </h3>
                <p className="text-md-on-primary-container/80 mt-2">
                  Review and manage your current job listings.
                </p>
              </div>
              <a
                href="/orgs/hr/jobs"
                className="mt-4 text-md-on-primary-container font-medium inline-flex items-center group"
              >
                View Jobs
                <svg
                  className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.65 }}
              className="bg-md-secondary-container p-5 rounded-3xl shadow-sm flex flex-col justify-between mb-4 md:mb-0"
            >
              <div>
                <h3 className="text-md-on-secondary-container text-lg font-semibold">
                  Review Applicants
                </h3>
                <p className="text-md-on-secondary-container/80 mt-2">
                  Browse and evaluate candidates for your positions.
                </p>
              </div>
              <a
                href="/orgs/hr/applicants"
                className="mt-4 text-md-on-secondary-container font-medium inline-flex items-center group"
              >
                View Applicants
                <svg
                  className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="bg-md-tertiary-container p-5 rounded-3xl shadow-sm flex flex-col justify-between mb-4 md:mb-0"
            >
              <div>
                <h3 className="text-md-on-tertiary-container text-lg font-semibold">
                  Manage Interviews
                </h3>
                <p className="text-md-on-tertiary-container/80 mt-2">
                  Schedule and track interviews with candidates.
                </p>
              </div>
              <a
                href="/orgs/hr/interviews"
                className="mt-4 text-md-on-tertiary-container font-medium inline-flex items-center group"
              >
                Manage Interviews
                <svg
                  className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
