"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useStore from "@/app/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function HRMDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setTitle, getCache, setCache } = useStore(); // Get cache functions

  const hrmDashboardCacheKey = "hrmDashboardData"; // Define cache key
  const Router = useRouter(); // Initialize router
  useEffect(() => {
    setTitle("Dashboard");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Check cache first
    const cachedData = getCache(hrmDashboardCacheKey);
    if (cachedData) {
      console.log("Loading dashboard data from cache");
      setDashboardData(cachedData);
      setLoading(false);
      return; // Skip API call if cache exists
    }

    console.log("Fetching dashboard data from API");
    try {
      setLoading(true);
      setError(null); // Reset error state on new fetch attempt
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hrm/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          errorData.message ||
            `Failed to fetch dashboard data (${response.status})`
        );
      }

      const data = await response.json();
      setDashboardData(data);
      setCache(hrmDashboardCacheKey, data); // Store fetched data in cache
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color for visual indicators
  const getStatusColor = (status) => {
    const statusColors = {
      Applied: "#4CAF50", // md-primary-container
      Shortlisted: "#2196F3", // md-tertiary-container
      Interviewed: "#9C27B0", // md-secondary-container
      Offered: "#FF9800", // orange
      Hired: "#00C853", // green
      Rejected: "#F44336", // md-error
    };
    return statusColors[status] || "#9E9E9E"; // Default gray
  };

  // Transform funnel data for visualization
  const transformFunnelData = (funnelData) => {
    if (!funnelData) return [];
    return funnelData.map((item) => ({
      name: item.status,
      count: item.count,
      fill: getStatusColor(item.status),
      conversionRate: parseFloat(item.conversionRate),
    }));
  };

  // Calculate card animation delay based on index
  const getCardDelay = (index) => 0.1 + index * 0.1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
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
    <div className=" overflow-y-scroll h-full overflow-x-hidden w-screen md:w-full p-4 md:p-6">
      {" "}
      {/* Keep padding as is, seems reasonable */}
      {dashboardData && (
        <div className="max-w-screen-2xl mx-auto">
          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(0) }}
              className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl " // Adjusted padding
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Active Jobs
                  </h3>
                  <p className="text-md-on-surface text-2xl sm:text-3xl font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    {dashboardData.summary.activeJobs}
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
              <div className="mt-2 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    parseFloat(dashboardData.jobStats.growth) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {dashboardData.jobStats.growth}
                </span>
                <span className="text-md-on-surface-variant text-xs ml-1">
                  vs last period
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(1) }}
              className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl shadow-sm" // Adjusted padding
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Total Applicants
                  </h3>
                  <p className="text-md-on-surface text-2xl sm:text-3xl font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    {dashboardData.summary.totalApplicants}
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
              <div className="mt-2 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    parseFloat(dashboardData.applicantStats.growth) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {dashboardData.applicantStats.growth}
                </span>
                <span className="text-md-on-surface-variant text-xs ml-1">
                  vs last period
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(2) }}
              className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl shadow-sm" // Adjusted padding
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Recent Applicants
                  </h3>
                  <p className="text-md-on-surface text-2xl sm:text-3xl font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    {dashboardData.applicantStats.recent30Days}
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
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium text-md-on-surface">
                  Last 30 days
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: getCardDelay(3) }}
              className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl shadow-sm" // Adjusted padding
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md-on-surface-variant text-sm font-medium">
                    Avg. Time to Hire
                  </h3>
                  <p className="text-md-on-surface text-2xl sm:text-3xl font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    {dashboardData.timeToHire.average}
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium text-md-on-surface">
                  Days
                </span>
              </div>
            </motion.div>
          </div>

          {/* Charts and Data Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Hiring Funnel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl shadow-sm" // Adjusted padding
            >
              <h2 className="text-lg sm:text-xl font-semibold text-md-on-surface mb-4">
                {" "}
                {/* Adjusted font size */}
                Hiring Funnel
              </h2>
              <div className="h-64 sm:h-80">
                {" "}
                {/* Adjusted height */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transformFunnelData(dashboardData.hiringFunnel)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }} // Adjusted left margin
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tick={{ fontSize: 10 }}
                    />{" "}
                    {/* Adjusted width and font size */}
                    <Tooltip
                      formatter={(value, name, props) => [
                        value,
                        props.payload.name,
                      ]}
                      labelFormatter={() => ""}
                      contentStyle={{
                        backgroundColor: "var(--md-surface-container-high)",
                        borderRadius: "16px",
                        border: "none",
                        padding: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      animationDuration={1500}
                      label={{
                        position: "right",
                        formatter: (value) => `${value}`,
                        fill: "var(--md-on-surface-variant)",
                        fontSize: 10, // Adjusted label font size
                      }}
                    >
                      {transformFunnelData(dashboardData.hiringFunnel).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {dashboardData.hiringFunnel.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    ></div>
                    <span className="text-xs text-md-on-surface truncate">
                      {item.status}: {item.conversionRate}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl shadow-sm" // Adjusted padding
            >
              <h2 className="text-lg sm:text-xl font-semibold text-md-on-surface mb-4">
                {" "}
                {/* Adjusted font size */}
                Upcoming Interviews
              </h2>
              <div className="overflow-hidden h-64 sm:h-80">
                {" "}
                {/* Adjusted height */}
                {dashboardData.upcomingInterviews.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto h-full pr-2 pb-4">
                    {dashboardData.upcomingInterviews.map(
                      (interview, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          key={index}
                          className="p-3 sm:p-4 bg-md-surface-variant rounded-2xl" // Adjusted padding
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center overflow-hidden">
                              {" "}
                              {/* Added overflow-hidden */}
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
                              <div className="overflow-hidden">
                                {" "}
                                {/* Added overflow-hidden */}
                                <h3 className="text-sm sm:text-base text-md-on-surface font-medium truncate max-w-[150px] sm:max-w-[200px]">
                                  {" "}
                                  {/* Adjusted max-width */}
                                  {interview.Candidate?.name || "Candidate"}
                                </h3>
                                <p className="text-md-on-surface-variant text-xs truncate">
                                  {" "}
                                  {/* Added truncate */}
                                  {interview.Job?.title || "Interview"}
                                </p>
                              </div>
                            </div>
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-md-primary text-md-on-primary text-xs rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                            >
                              Join
                            </a>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="text-md-on-surface-variant text-xs">
                              {formatDate(interview.startDateTime)}
                            </div>
                            <div className="text-md-on-surface-variant text-xs">
                              {interview.timezone}
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
            className="bg-md-surface-container md:bg-md-surface-container-highest p-4 sm:p-5 rounded-3xl shadow-sm mb-6" // Adjusted padding
          >
            <h2 className="text-lg sm:text-xl font-semibold text-md-on-surface mb-4">
              {" "}
              {/* Adjusted font size */}
              Recent Applicants
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                      {" "}
                      {/* Adjusted padding */}
                      Candidate
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
                      {" "}
                      {/* Hide on small screens */}
                      Position
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider hidden md:table-cell">
                      {" "}
                      {/* Hide on medium screens */}
                      Contact
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                      {" "}
                      {/* Adjusted padding */}
                      Status
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-md-on-surface-variant uppercase tracking-wider">
                      {" "}
                      {/* Adjusted padding */}
                      Resume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-md-outline-variant">
                  {dashboardData.recentApplicants.map((applicant, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    >
                      <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                        {" "}
                        {/* Adjusted padding */}
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-md-primary-container rounded-full flex items-center justify-center text-md-on-primary-container font-medium text-sm sm:text-base">
                            {" "}
                            {/* Adjusted size */}
                            {applicant.candidate?.name?.charAt(0) || "?"}
                          </div>
                          <div className="ml-2 sm:ml-4">
                            {" "}
                            {/* Adjusted margin */}
                            <div className="text-xs sm:text-sm font-medium text-md-on-surface">
                              {" "}
                              {/* Adjusted font size */}
                              {applicant.candidate?.name || "Unknown"}
                            </div>
                            {/* <div className="text-xs text-md-on-surface-variant">
                              Applied{" "}
                              {new Date(
                                applicant.createdAt
                              ).toLocaleDateString()}
                            </div> */}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap hidden sm:table-cell">
                        {" "}
                        {/* Hide on small screens */}
                        <div className="text-xs sm:text-sm text-md-on-surface">
                          {" "}
                          {/* Adjusted font size */}
                          {applicant.job?.title || "Unknown"}
                        </div>
                        <div className="text-xs text-md-on-surface-variant">
                          {applicant.job?.location || "Remote"}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap hidden md:table-cell">
                        {" "}
                        {/* Hide on medium screens */}
                        <div className="text-xs sm:text-sm text-md-on-surface">
                          {" "}
                          {/* Adjusted font size */}
                          {applicant.candidate?.email || "No email"}
                        </div>
                        <div className="text-xs text-md-on-surface-variant">
                          {applicant.candidate?.phone || "No phone"}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                        {" "}
                        {/* Adjusted padding */}
                        <span
                          className="px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" // Adjusted padding
                          style={{
                            backgroundColor: `${getStatusColor(
                              applicant.status
                            )}20`,
                            color: getStatusColor(applicant.status),
                          }}
                        >
                          {applicant.status || "New"}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-md-on-surface">
                        {" "}
                        {/* Adjusted padding and font size */}
                        {applicant.candidate?.resume ? (
                          <a
                            href={applicant.candidate.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-md-primary hover:text-md-on-primary-container transition-colors"
                          >
                            View Resume
                          </a>
                        ) : (
                          <span className="text-md-on-surface-variant">
                            No resume
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}

                  {dashboardData.recentApplicants.length === 0 && (
                    <tr>
                      <td
                        colSpan="5" // Keep colspan 5, hidden columns still count
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

          {/* Action Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-md-primary-container p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col justify-between mb-4 md:mb-10" // Adjusted padding and margin
            >
              <div>
                <h3 className="text-md-on-primary-container text-base sm:text-lg font-semibold">
                  {" "}
                  {/* Adjusted font size */}
                  Post a New Job
                </h3>
                <p className="text-md-on-primary-container/80 mt-2 text-sm sm:text-base">
                  {" "}
                  {/* Adjusted font size */}
                  Create a new job listing to attract qualified candidates.
                </p>
              </div>
              <button
                onClick={() => {
                  Router.push("/orgs/hrm/jobs/create");
                }}
                className="mt-4 text-md-on-primary-container font-medium inline-flex items-center group"
              >
                Get Started
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
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.55 }}
              className="bg-md-secondary-container p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] sm:min-h-[180px] mb-4 md:mb-0" // Adjusted padding, min-height and margin
            >
              <div>
                <h3 className="text-md-on-secondary-container text-base sm:text-lg font-semibold">
                  {" "}
                  {/* Adjusted font size */}
                  Schedule Interviews
                </h3>
                <p className="text-md-on-secondary-container/80 mt-2 text-sm sm:text-base">
                  {" "}
                  {/* Adjusted font size */}
                  Set up interviews with candidates for open positions.
                </p>
              </div>
              <a
                href="/orgs/hrm/interviews"
                className="mt-4 text-md-on-secondary-container font-medium inline-flex items-center group"
              >
                Schedule Now
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
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-md-tertiary-container p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] sm:min-h-[180px] mb-4 md:mb-0" // Adjusted padding, min-height and margin
            >
              <div>
                <h3 className="text-md-on-tertiary-container text-base sm:text-lg font-semibold">
                  {" "}
                  {/* Adjusted font size */}
                  Review Applications
                </h3>
                <p className="text-md-on-tertiary-container/80 mt-2 text-sm sm:text-base">
                  {" "}
                  {/* Adjusted font size */}
                  Browse through applicants for your open positions.
                </p>
              </div>
              <a
                href="/orgs/hrm/applications"
                className="mt-4 text-md-on-tertiary-container font-medium inline-flex items-center group"
              >
                View Applications
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
}
