"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useStore from "@/app/store";
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  FileSpreadsheet,
  FilePieChart,
  TrendingUp,
  Calendar,
  UserCheck,
  Building,
  Award,
  AlertCircle,
  ChevronRight,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users,
  Briefcase,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";

// Custom Tab component with Material You styling
const Tab = ({ active, icon, label, onClick }) => (
  <motion.button
    className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium ${
      active
        ? "bg-md-primary-container text-md-on-primary-container"
        : "text-md-on-surface-variant hover:bg-md-surface-variant"
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    {label}
  </motion.button>
);

// Analytics Card with animation and Material You styling
const AnalyticsCard = ({
  title,
  value,
  trend,
  trendValue,
  icon,
  color,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={`bg-md-surface ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-md-on-surface-variant">
          {title}
        </CardTitle>
        <div
          className={`p-2 rounded-full bg-md-${color}-container text-md-on-${color}-container`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-md-on-surface">{value}</div>
        <p className="text-sm text-md-on-surface-variant mt-2 flex items-center">
          {trend === "up" ? (
            <ArrowUpRight className="text-md-tertiary mr-1" size={16} />
          ) : trend === "down" ? (
            <ArrowDownRight className="text-md-error mr-1" size={16} />
          ) : null}
          <span
            className={
              trend === "up"
                ? "text-md-tertiary"
                : trend === "down"
                ? "text-md-error"
                : ""
            }
          >
            {trendValue}
          </span>
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

const MD_COLORS = [
  "#6750A4",
  "#7D5260",
  "#B4A7D6",
  "#79B3FF",
  "#8E97FD",
  "#FFAD33",
];

export default function AnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [predictiveData, setPredictiveData] = useState(null);
  const [candidateQualityData, setCandidateQualityData] = useState(null);
  const { setTitle } = useStore();
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // In a real app, these would be actual API calls to your endpoints
        const mainResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/hrm/analytics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Replace `yourTokenVariable` with the actual token variable
            },
          }
        );

        const predictiveResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/hrm/analytics/predictive`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Replace `yourTokenVariable` with the actual token variable
            },
          }
        );

        const qualityResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/hrm/analytics/candidate-quality`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Replace `yourTokenVariable` with the actual token variable
            },
          }
        );

        setAnalyticsData(mainResponse.data);
        setPredictiveData(predictiveResponse.data);
        setCandidateQualityData(qualityResponse.data);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
        // In a real app, you would show an error notification
      } finally {
        setLoading(false);
      }
    };

    // For demo purposes, we'll use mock data instead of actual API calls
    const mockData = () => {
      // Mock data that resembles the expected API response
      setAnalyticsData({
        jobPerformance: [
          {
            title: "Senior Developer",
            applicantCount: 45,
            daysActive: 14,
            applicationsPerDay: "3.2",
            shortlistedCount: 12,
            conversionRate: "26.7%",
          },
          {
            title: "UX Designer",
            applicantCount: 38,
            daysActive: 10,
            applicationsPerDay: "3.8",
            shortlistedCount: 8,
            conversionRate: "21.1%",
          },
          {
            title: "Product Manager",
            applicantCount: 24,
            daysActive: 21,
            applicationsPerDay: "1.1",
            shortlistedCount: 6,
            conversionRate: "25.0%",
          },
        ],
        hiringFunnel: [
          {
            status: "Applied",
            current: 145,
            previous: 120,
            percentChange: "20.8%",
            trend: "up",
          },
          {
            status: "Shortlisted",
            current: 50,
            previous: 48,
            percentChange: "4.2%",
            trend: "up",
          },
          {
            status: "Interviewed",
            current: 30,
            previous: 32,
            percentChange: "-6.3%",
            trend: "down",
          },
          {
            status: "Offered",
            current: 12,
            previous: 10,
            percentChange: "20.0%",
            trend: "up",
          },
          {
            status: "Hired",
            current: 8,
            previous: 7,
            percentChange: "14.3%",
            trend: "up",
          },
        ],
        sourceEffectiveness: [
          {
            source: "LinkedIn",
            applicantCount: 75,
            hiredCount: 4,
            conversionRate: "5.3%",
          },
          {
            source: "Indeed",
            applicantCount: 45,
            hiredCount: 2,
            conversionRate: "4.4%",
          },
          {
            source: "Direct Website",
            applicantCount: 25,
            hiredCount: 2,
            conversionRate: "8.0%",
          },
        ],
        monthlyTrends: [
          {
            month: "January",
            year: 2025,
            applicantCount: 85,
            hiredCount: 3,
            hireRate: "3.5%",
          },
          {
            month: "February",
            year: 2025,
            applicantCount: 92,
            hiredCount: 5,
            hireRate: "5.4%",
          },
          {
            month: "March",
            year: 2025,
            applicantCount: 112,
            hiredCount: 6,
            hireRate: "5.4%",
          },
          {
            month: "April",
            year: 2025,
            applicantCount: 145,
            hiredCount: 8,
            hireRate: "5.5%",
          },
        ],
        timeToHireByJobType: [
          { employmentType: "Full-time", avgDaysToHire: "21.5", hiredCount: 6 },
          { employmentType: "Contract", avgDaysToHire: "14.2", hiredCount: 2 },
        ],
      });

      setPredictiveData({
        timeToFillPredictions: {
          byJobType: [
            { jobType: "Engineering", avgDaysToFill: "23.5", jobCount: 12 },
            { jobType: "Design", avgDaysToFill: "18.2", jobCount: 8 },
            { jobType: "Marketing", avgDaysToFill: "15.7", jobCount: 5 },
          ],
          byJobLevel: [
            { jobLevel: "Senior-level", avgDaysToFill: "26.8", jobCount: 8 },
            { jobLevel: "Mid-level", avgDaysToFill: "19.3", jobCount: 14 },
            { jobLevel: "Entry-level", avgDaysToFill: "14.5", jobCount: 6 },
          ],
          overallAverage: "21.4",
        },
        seasonalHiringPatterns: [
          { month: "January", hireCount: 5, percentage: "10.4%" },
          { month: "February", hireCount: 3, percentage: "6.3%" },
          { month: "March", hireCount: 4, percentage: "8.3%" },
          { month: "April", hireCount: 6, percentage: "12.5%" },
          { month: "May", hireCount: 3, percentage: "6.3%" },
          { month: "June", hireCount: 4, percentage: "8.3%" },
          { month: "July", hireCount: 5, percentage: "10.4%" },
          { month: "August", hireCount: 4, percentage: "8.3%" },
          { month: "September", hireCount: 5, percentage: "10.4%" },
          { month: "October", hireCount: 4, percentage: "8.3%" },
          { month: "November", hireCount: 3, percentage: "6.3%" },
          { month: "December", hireCount: 2, percentage: "4.2%" },
        ],
        hiringForecast: {
          previousPeriodJobs: 22,
          forecastedJobs: 28,
          growthRate: "27.3%",
          forecastByJobType: [
            {
              jobType: "Engineering",
              previousCount: 12,
              forecastNextSixMonths: 15,
              percentage: "53.6%",
            },
            {
              jobType: "Design",
              previousCount: 6,
              forecastNextSixMonths: 8,
              percentage: "28.6%",
            },
            {
              jobType: "Marketing",
              previousCount: 4,
              forecastNextSixMonths: 5,
              percentage: "17.9%",
            },
          ],
        },
        pipelineBottlenecks: {
          bottleneckStages: [
            {
              fromStage: "Applied",
              count: 145,
              transitionRate: null,
              dropOffRate: null,
              isBottleneck: false,
            },
            {
              fromStage: "Shortlisted",
              count: 50,
              transitionRate: "34.5%",
              dropOffRate: "65.5%",
              isBottleneck: false,
            },
            {
              fromStage: "Interviewed",
              count: 30,
              transitionRate: "60.0%",
              dropOffRate: "40.0%",
              isBottleneck: false,
            },
            {
              fromStage: "Offered",
              count: 12,
              transitionRate: "40.0%",
              dropOffRate: "60.0%",
              isBottleneck: false,
            },
            {
              fromStage: "Hired",
              count: 8,
              transitionRate: "66.7%",
              dropOffRate: "33.3%",
              isBottleneck: false,
            },
          ],
          allStages: [
            {
              fromStage: "Applied",
              count: 145,
              transitionRate: null,
              dropOffRate: null,
              isBottleneck: false,
            },
            {
              fromStage: "Shortlisted",
              count: 50,
              transitionRate: "34.5%",
              dropOffRate: "65.5%",
              isBottleneck: false,
            },
            {
              fromStage: "Interviewed",
              count: 30,
              transitionRate: "60.0%",
              dropOffRate: "40.0%",
              isBottleneck: false,
            },
            {
              fromStage: "Offered",
              count: 12,
              transitionRate: "40.0%",
              dropOffRate: "60.0%",
              isBottleneck: false,
            },
            {
              fromStage: "Hired",
              count: 8,
              transitionRate: "66.7%",
              dropOffRate: "33.3%",
              isBottleneck: false,
            },
          ],
        },
      });

      setCandidateQualityData({
        testScoreAnalysis: {
          byJob: [
            {
              jobTitle: "Senior Developer",
              avgScore: "78.5",
              medianScore: "82.0",
              applicantCount: 32,
            },
            {
              jobTitle: "UX Designer",
              avgScore: "74.2",
              medianScore: "76.0",
              applicantCount: 18,
            },
            {
              jobTitle: "Product Manager",
              avgScore: "81.3",
              medianScore: "83.0",
              applicantCount: 15,
            },
          ],
          overall: { avgScore: "78.0" },
        },
        sourceQualityAnalysis: {
          bySource: [
            {
              source: "LinkedIn",
              candidateCount: 75,
              avgTestScore: "79.2",
              conversionRate: "5.3%",
              qualityIndex: "33.4",
            },
            {
              source: "Indeed",
              candidateCount: 45,
              avgTestScore: "72.5",
              conversionRate: "4.4%",
              qualityIndex: "30.6",
            },
            {
              source: "Direct",
              candidateCount: 25,
              avgTestScore: "82.3",
              conversionRate: "8.0%",
              qualityIndex: "37.7",
            },
          ],
          recommendedSources: ["Direct", "LinkedIn", "Indeed"],
        },
        skillAnalysis: {
          topPerformingSkills: [
            {
              skillName: "React",
              candidateCount: 28,
              avgScore: 82.5,
              hireRate: "10.7%",
            },
            {
              skillName: "TypeScript",
              candidateCount: 22,
              avgScore: 80.3,
              hireRate: "9.1%",
            },
            {
              skillName: "UX Design",
              candidateCount: 15,
              avgScore: 79.8,
              hireRate: "13.3%",
            },
            {
              skillName: "Product Management",
              candidateCount: 12,
              avgScore: 84.2,
              hireRate: "16.7%",
            },
          ],
        },
        interviewerAnalysis: {
          interviewers: [
            {
              name: "John Smith",
              interviewCount: 20,
              avgScore: 78.5,
              passRate: "75.0%",
              effectivenessScore: "82.5",
            },
            {
              name: "Sarah Johnson",
              interviewCount: 15,
              avgScore: 82.3,
              passRate: "80.0%",
              effectivenessScore: "86.0",
            },
            {
              name: "Michael Brown",
              interviewCount: 18,
              avgScore: 76.1,
              passRate: "72.2%",
              effectivenessScore: "78.1",
            },
          ],
        },
      });

      setLoading(false);
    };

    mockData(); // Using mock data for the demo
    // fetchAnalytics(); // This would be used in a real app
    setTitle("Analytics"); // Set the page title
  }, []);

  const handleExportReport = (reportType) => {
    console.log(`Exporting ${reportType} report`);
    alert(`${reportType} report would download here`);
  };

  // Animation variants for staggered entry of elements
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Calculate top-level metrics
  const getOverviewMetrics = () => {
    if (!analyticsData) return [];

    const hiringData = analyticsData.hiringFunnel;
    const appliedData = hiringData.find((item) => item.status === "Applied");
    const hiredData = hiringData.find((item) => item.status === "Hired");
    const timeToHire = predictiveData?.timeToFillPredictions?.overallAverage || "N/A"; // Default value

    // Example trend calculation (replace with actual logic if available)
    const timeToHireTrend = timeToHire !== "N/A" && parseFloat(timeToHire) < 22 ? "down" : "stable";
    const timeToHireTrendValue = timeToHire !== "N/A" && parseFloat(timeToHire) < 22 ? "-1.5 days" : "";

    return [
      {
        title: "Total Applicants",
        value: appliedData ? appliedData.current : 0,
        trend: appliedData?.trend || "stable",
        trendValue: appliedData?.percentChange || "0%",
        icon: <Users size={18} />,
        color: "primary",
      },
      {
        title: "New Hires",
        value: hiredData ? hiredData.current : 0,
        trend: hiredData?.trend || "stable",
        trendValue: hiredData?.percentChange || "0%",
        icon: <UserCheck size={18} />,
        color: "tertiary",
      },
      {
        title: "Avg Time to Hire",
        value: timeToHire !== "N/A" ? `${timeToHire} days` : "N/A",
        trend: timeToHireTrend,
        trendValue: timeToHireTrendValue,
        icon: <Clock size={18} />,
        color: "secondary",
      },
      {
        title: "Active Jobs",
        value: analyticsData?.jobPerformance?.length || 0,
        trend: "up", // Example trend, replace with actual data if available
        trendValue: "+2 jobs", // Example trend value
        icon: <Briefcase size={18} />,
        color: "tertiary", // Changed color for variety
      },
    ];
  };


  // Prepare data for the hiring funnel chart
  const getFunnelData = () => {
    if (!analyticsData?.hiringFunnel) return [];

    return analyticsData.hiringFunnel.map((stage) => ({
      name: stage.status,
      value: stage.current,
      previousValue: stage.previous,
      percentChange: stage.percentChange,
    }));
  };

  // Prepare data for the monthly trends chart
  const getMonthlyTrendsData = () => {
    if (!analyticsData?.monthlyTrends) return [];
    return analyticsData.monthlyTrends.map((item) => ({
      name: item.month.substring(0, 3),
      applications: item.applicantCount,
      hires: item.hiredCount,
    }));
  };

  // Prepare data for the source effectiveness pie chart
  const getSourceData = () => {
    if (!analyticsData?.sourceEffectiveness) return [];
    return analyticsData.sourceEffectiveness.map((source) => ({
      name: source.source,
      value: source.applicantCount,
      conversionRate: source.conversionRate,
    }));
  };

  // Prepare data for seasonal hiring patterns chart
  const getSeasonalData = () => {
    if (!predictiveData?.seasonalHiringPatterns) return [];
    return predictiveData.seasonalHiringPatterns.map((item) => ({
      name: item.month.substring(0, 3),
      hireCount: item.hireCount,
      percentage: parseFloat(item.percentage),
    }));
  };

  // Prepare data for hiring forecast
  const getForecastData = () => {
    if (!predictiveData?.hiringForecast?.forecastByJobType) return [];
    return predictiveData.hiringForecast.forecastByJobType.map((item) => ({
      name: item.jobType,
      previous: item.previousCount,
      forecast: item.forecastNextSixMonths,
    }));
  };

  // Prepare data for job performance analysis
  const getJobPerformanceData = () => {
    if (!analyticsData?.jobPerformance) return [];
    return analyticsData.jobPerformance.map((job) => ({
      name:
        job.title.length > 15 ? job.title.substring(0, 15) + "..." : job.title,
      applicants: job.applicantCount,
      shortlisted: job.shortlistedCount,
      conversion: parseFloat(job.conversionRate),
    }));
  };

  // Prepare data for candidate quality analysis
  const getCandidateQualityData = () => {
    if (!candidateQualityData?.testScoreAnalysis?.byJob) return [];
    return candidateQualityData.testScoreAnalysis.byJob.map((job) => ({
      name:
        job.jobTitle.length > 12
          ? job.jobTitle.substring(0, 12) + "..."
          : job.jobTitle,
      avgScore: parseFloat(job.avgScore),
      medianScore: parseFloat(job.medianScore),
      candidates: job.applicantCount,
    }));
  };

  // Prepare data for source quality analysis
  const getSourceQualityData = () => {
    if (!candidateQualityData?.sourceQualityAnalysis?.bySource) return [];
    return candidateQualityData.sourceQualityAnalysis.bySource.map(
      (source) => ({
        name: source.source,
        avgScore: parseFloat(source.avgTestScore),
        qualityIndex: parseFloat(source.qualityIndex),
        candidates: source.candidateCount,
        conversionRate: source.conversionRate,
      })
    );
  };

  // Prepare data for skill analysis
  const getSkillAnalysisData = () => {
    if (!candidateQualityData?.skillAnalysis?.topPerformingSkills) return [];
    return candidateQualityData.skillAnalysis.topPerformingSkills.map(
      (skill) => ({
        name: skill.skillName,
        score: skill.avgScore,
        hireRate: parseFloat(skill.hireRate),
        candidates: skill.candidateCount,
      })
    );
  };

  const renderOverviewTab = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 "
    >
      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"> {/* Adjusted gap */}
        {getOverviewMetrics().map((metric, i) => (
          <AnalyticsCard
            key={i}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            trendValue={metric.trendValue}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1   lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Hiring Funnel
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80 "> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFunnelData()}
                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }} // Further reduced left/right margins
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis dataKey="name" fontSize={10} /> {/* Slightly smaller font */}
                    <YAxis fontSize={10} /> {/* Slightly smaller font */}
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name, props) => [value, "Candidates"]}
                      labelFormatter={(value) => `Stage: ${value}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                    <Bar
                      name="Current Period"
                      dataKey="value"
                      fill="var(--md-sys-color-primary)" // Use CSS variables
                      radius={[4, 4, 0, 0]} // Slightly smaller radius
                    />
                    <Bar
                      name="Previous Period"
                      dataKey="previousValue"
                      fill="var(--md-sys-color-primary-container)" // Use CSS variables
                      radius={[4, 4, 0, 0]} // Slightly smaller radius
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Monthly Application Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80 w-full"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getMonthlyTrendsData()}
                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }} // Further reduced left/right margins
                  >
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--md-sys-color-secondary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--md-sys-color-secondary)" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--md-sys-color-tertiary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--md-sys-color-tertiary)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis dataKey="name" fontSize={10} /> {/* Slightly smaller font */}
                    <YAxis fontSize={10} /> {/* Slightly smaller font */}
                    <Tooltip contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                    <Area
                      type="monotone"
                      name="Applications"
                      dataKey="applications"
                      stroke="var(--md-sys-color-secondary)" // Use CSS variables
                      fillOpacity={1}
                      fill="url(#colorApplications)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      name="Hires"
                      dataKey="hires"
                      stroke="var(--md-sys-color-tertiary)" // Use CSS variables
                      fillOpacity={1}
                      fill="url(#colorHires)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-1"> {/* Stays 1 column */}
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Source Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-72 w-full flex items-center justify-center"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}> {/* Added margins */}
                    <Pie
                      data={getSourceData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40} // Add inner radius for Donut chart
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} // Show only percentage on label
                    >
                      {getSourceData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MD_COLORS[index % MD_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name, props) => [`${value} (${(props.payload.percent * 100).toFixed(1)}%)`, name]} // Show count and percentage in tooltip
                    />
                    {/* <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} /> */}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {getSourceData().map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: MD_COLORS[idx % MD_COLORS.length] }}
                      />
                      <span className="text-md-on-surface-variant">{source.name}</span>
                    </div>
                    <div className="font-medium text-md-on-surface">
                      {source.value} ({source.conversionRate}) {/* Show count and conversion */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2"> {/* Spans 2 cols on large screens */}
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Job Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80 w-full"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getJobPerformanceData()}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }} // Adjusted margins
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis type="number" fontSize={10} /> {/* Slightly smaller font */}
                    <YAxis type="category" dataKey="name" width={60} fontSize={9} interval={0} tick={{ width: 55 }} /> {/* Adjusted width/fontSize/tick */}
                    <Tooltip contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                    <Bar name="Applicants" dataKey="applicants" fill="var(--md-sys-color-primary)" radius={[0, 4, 4, 0]} />
                    <Bar name="Shortlisted" dataKey="shortlisted" fill="var(--md-sys-color-secondary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Available Reports Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-md-on-surface">
          Available Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"> {/* Adjusted grid and gap */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Card
              className="cursor-pointer hover:bg-md-surface-variant transition-colors bg-md-surface h-full" // Added h-full
              onClick={() => handleExportReport("Recruitment Funnel")}
            >
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 gap-4"> {/* Adjusted flex direction and gap */}
                <div>
                  <h3 className="font-medium text-md-on-surface">
                    Recruitment Funnel
                  </h3>
                  <p className="text-sm text-md-on-surface-variant mt-1"> {/* Added margin top */}
                    Applications → Interviews → Offers → Hires
                  </p>
                </div>
                <FileSpreadsheet className="text-md-primary mt-2 sm:mt-0 flex-shrink-0" size={24} /> {/* Added size and flex-shrink */}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Card
              className="cursor-pointer hover:bg-md-surface-variant transition-colors bg-md-surface h-full" // Added h-full
              onClick={() => handleExportReport("Time Analysis")}
            >
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 gap-4"> {/* Adjusted flex direction and gap */}
                <div>
                  <h3 className="font-medium text-md-on-surface">
                    Time Analysis
                  </h3>
                  <p className="text-sm text-md-on-surface-variant mt-1"> {/* Added margin top */}
                    Review, interview, and decision timeframes
                  </p>
                </div>
                <FilePieChart className="text-md-tertiary mt-2 sm:mt-0 flex-shrink-0" size={24} /> {/* Added size and flex-shrink */}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Card
              className="cursor-pointer hover:bg-md-surface-variant transition-colors bg-md-surface h-full" // Added h-full
              onClick={() => handleExportReport("Source Effectiveness")}
            >
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 gap-4"> {/* Adjusted flex direction and gap */}
                <div>
                  <h3 className="font-medium text-md-on-surface">
                    Source Effectiveness
                  </h3>
                  <p className="text-sm text-md-on-surface-variant mt-1"> {/* Added margin top */}
                    Quality of candidates by application source
                  </p>
                </div>
                <Download className="text-md-secondary mt-2 sm:mt-0 flex-shrink-0" size={24} /> {/* Added size and flex-shrink */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderPredictiveTab = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="bg-md-secondary-container rounded-2xl p-4 md:p-6 mb-6"> {/* Adjusted padding */}
        <h2 className="text-lg md:text-xl font-semibold mb-2 text-md-on-secondary-container"> {/* Adjusted text size */}
          Predictive Hiring Analytics
        </h2>
        <p className="text-sm md:text-base text-md-on-secondary-container"> {/* Adjusted text size */}
          Leverage AI-powered insights to optimize your hiring process and
          forecast future needs.
        </p>
      </div>

      {/* Hiring Forecast */}
      <motion.div variants={item}>
        <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
          <CardHeader>
            <CardTitle className="text-lg text-md-on-surface">
              Hiring Forecast (Next 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6"> {/* Adjusted grid and gap */}
              <div className="bg-md-primary-container p-4 rounded-xl">
                <div className="text-xs md:text-sm text-md-on-primary-container mb-1"> {/* Adjusted text size */}
                  Previous Period
                </div>
                <div className="text-xl md:text-2xl font-bold text-md-on-primary-container"> {/* Adjusted text size */}
                  {predictiveData?.hiringForecast?.previousPeriodJobs || 0} jobs
                </div>
              </div>

              <div className="bg-md-tertiary-container p-4 rounded-xl">
                <div className="text-xs md:text-sm text-md-on-tertiary-container mb-1"> {/* Adjusted text size */}
                  Forecasted Jobs
                </div>
                <div className="text-xl md:text-2xl font-bold text-md-on-tertiary-container"> {/* Adjusted text size */}
                  {predictiveData?.hiringForecast?.forecastedJobs || 0} jobs
                </div>
              </div>

              <div className="bg-md-secondary-container p-4 rounded-xl">
                <div className="text-xs md:text-sm text-md-on-secondary-container mb-1"> {/* Adjusted text size */}
                  Growth Rate
                </div>
                <div className="text-xl md:text-2xl font-bold text-md-on-secondary-container"> {/* Adjusted text size */}
                  {predictiveData?.hiringForecast?.growthRate || "0%"}
                </div>
              </div>
            </div>

            <div className="h-80 w-full"> {/* Added w-full */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getForecastData()}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                  <XAxis dataKey="name" fontSize={10} /> {/* Slightly smaller font */}
                  <YAxis fontSize={10} /> {/* Slightly smaller font */}
                  <Tooltip contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                  <Bar name="Previous Period" dataKey="previous" fill="var(--md-sys-color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar name="Forecast" dataKey="forecast" fill="var(--md-sys-color-secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seasonal Patterns */}
      <motion.div variants={item}>
        <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
          <CardHeader>
            <CardTitle className="text-lg text-md-on-surface">
              Seasonal Hiring Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full"> {/* Added w-full */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getSeasonalData()}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                  <XAxis dataKey="name" fontSize={10} /> {/* Slightly smaller font */}
                  <YAxis yAxisId="left" orientation="left" stroke="var(--md-sys-color-primary)" fontSize={10} /> {/* Slightly smaller font */}
                  <YAxis yAxisId="right" orientation="right" stroke="var(--md-sys-color-secondary)" fontSize={10} /> {/* Slightly smaller font */}
                  <Tooltip contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                  <Bar yAxisId="left" name="Hire Count" dataKey="hireCount" fill="var(--md-sys-color-primary)" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" name="Percentage" type="monotone" dataKey="percentage" stroke="var(--md-sys-color-secondary)" strokeWidth={2} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Time to Fill Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Time to Fill by Job Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={predictiveData?.timeToFillPredictions?.byJobType || []}
                    margin={{ top: 5, right: 10, left: 10, bottom: 20 }} // Adjusted margins
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis type="number" fontSize={10} label={{ value: "Days", position: "insideBottom", offset: -10, fontSize: 9 }} /> {/* Slightly smaller font */}
                    <YAxis type="category" dataKey="jobType" width={60} fontSize={9} interval={0} tick={{ width: 55 }} /> {/* Adjusted width/fontSize/tick */}
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [`${value} days`, "Avg Time to Fill"]}
                    />
                    {/* <Legend wrapperStyle={{ fontSize: '12px' }} /> */}
                    <Bar name="Avg Days to Fill" dataKey="avgDaysToFill" fill="var(--md-sys-color-primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-md-surface  overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Time to Fill by Job Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={predictiveData?.timeToFillPredictions?.byJobLevel || []}
                    margin={{ top: 5, right: 10, left: 10, bottom: 20 }} // Adjusted margins
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis type="number" fontSize={10} label={{ value: "Days", position: "insideBottom", offset: -10, fontSize: 9 }} /> {/* Slightly smaller font */}
                    <YAxis type="category" dataKey="jobLevel" width={60} fontSize={9} interval={0} tick={{ width: 55 }} /> {/* Adjusted width/fontSize/tick */}
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [`${value} days`, "Avg Time to Fill"]}
                    />
                    {/* <Legend wrapperStyle={{ fontSize: '12px' }} /> */}
                    <Bar name="Avg Days to Fill" dataKey="avgDaysToFill" fill="var(--md-sys-color-secondary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Bottlenecks */}
      <motion.div variants={item}>
        <Card className="bg-md-surface"> {/* Keep overflow for table */}
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-md-on-surface">
              Pipeline Bottlenecks
              <AlertCircle size={16} className="text-md-error" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto"> {/* Ensure this div wraps the table directly */}
              <table className="w-full min-w-[600px]"> 
                <thead>
                  <tr className="text-left border-b border-md-outline">
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Stage</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Count</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Transition Rate</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Drop-off Rate</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {predictiveData?.pipelineBottlenecks?.allStages?.map(
                    (stage, i) => (
                      <tr key={i} className="border-b border-md-outline-variant last:border-b-0"> 
                        <td className="py-3 text-sm text-md-on-surface">{stage.fromStage}</td>
                        <td className="py-3 text-sm text-md-on-surface">{stage.count}</td>
                        <td className="py-3 text-sm text-md-on-surface">{stage.transitionRate || "N/A"}</td>
                        <td className="py-3 text-sm text-md-on-surface">{stage.dropOffRate || "N/A"}</td>
                        <td className="py-3">
                          {stage.isBottleneck ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-md-error-container text-md-on-error-container"> {/* Adjusted padding */}
                              Bottleneck
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-md-tertiary-container text-md-on-tertiary-container"> {/* Adjusted padding */}
                              Healthy
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderCandidateQualityTab = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Test Score Analysis */}
      <motion.div variants={item}>
        <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
          <CardHeader>
            <CardTitle className="text-lg text-md-on-surface">
              Candidate Test Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-md-on-surface-variant">
                  Overall Average Score
                </div>
                <div className="text-2xl font-bold text-md-on-surface">
                  {candidateQualityData?.testScoreAnalysis?.overall?.avgScore || "N/A"}
                </div>
              </div>
              {/* Can add more summary stats here if needed */}
            </div>

            <div className="h-80 w-full"> {/* Added w-full */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getCandidateQualityData()}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                  <XAxis dataKey="name" fontSize={10} /> {/* Slightly smaller font */}
                  <YAxis fontSize={10} /> {/* Slightly smaller font */}
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                    formatter={(value, name) => [
                      name === "candidates" ? value : value.toFixed(1),
                      name === "candidates" ? "Candidates" : name === "avgScore" ? "Avg Score" : "Median Score",
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                  <Bar name="Avg Score" dataKey="avgScore" fill="var(--md-sys-color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar name="Median Score" dataKey="medianScore" fill="var(--md-sys-color-secondary)" radius={[4, 4, 0, 0]} />
                  {/* Consider if Line for candidates makes sense or should be another Bar/Axis */}
                  {/* <Line name="Candidates" type="monotone" dataKey="candidates" stroke="var(--md-sys-color-tertiary)" strokeWidth={2} /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Source Quality & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Source Quality Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getSourceQualityData()}
                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }} // Adjusted margins
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis dataKey="name" fontSize={10} /> {/* Slightly smaller font */}
                    <YAxis fontSize={10} /> {/* Slightly smaller font */}
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name) => [
                        name === "candidates" ? value : value.toFixed(1),
                        name === "candidates" ? "Candidates" : name === "avgScore" ? "Avg Test Score" : "Quality Index",
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                    <Bar name="Avg Score" dataKey="avgScore" fill="var(--md-sys-color-primary)" radius={[4, 4, 0, 0]} />
                    <Bar name="Quality Index" dataKey="qualityIndex" fill="var(--md-sys-color-secondary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-medium mb-2 text-md-on-surface">
                  Recommended Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidateQualityData?.sourceQualityAnalysis?.recommendedSources?.map(
                    (source, i) => (
                      <div
                        key={i}
                        className="px-3 py-1 bg-md-tertiary-container text-md-on-tertiary-container rounded-full text-xs md:text-sm font-medium" // Adjusted text size
                      >
                        {source}
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-md-surface overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader>
              <CardTitle className="text-lg text-md-on-surface">
                Top Performing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full"> {/* Added w-full */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getSkillAnalysisData()}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }} // Adjusted margins
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis type="number" fontSize={10} /> {/* Slightly smaller font */}
                    <YAxis type="category" dataKey="name" width={60} fontSize={9} interval={0} tick={{ width: 55 }} /> {/* Adjusted width/fontSize/tick */}
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name) => [
                        name === "candidates" ? value : value,
                        name === "candidates" ? "Candidates" : name === "score" ? "Avg Score" : "Hire Rate %",
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Slightly smaller font */}
                    <Bar name="Avg Score" dataKey="score" fill="var(--md-sys-color-primary)" radius={[0, 4, 4, 0]} />
                    {/* Consider adding Hire Rate as another bar or on a different axis */}
                    {/* <Bar name="Hire Rate" dataKey="hireRate" fill="var(--md-sys-color-secondary)" radius={[0, 4, 4, 0]} /> */}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interviewer Analysis */}
      <motion.div variants={item}>
        <Card className="bg-md-surface"> {/* Keep overflow for table */}
          <CardHeader>
            <CardTitle className="text-lg text-md-on-surface">
              Interviewer Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto"> {/* Ensure this div wraps the table directly */}
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="text-left border-b border-md-outline">
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Interviewer</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Interviews</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Avg Score</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Pass Rate</th>
                    <th className="pb-2 text-sm font-medium text-md-on-surface-variant">Effectiveness</th>
                  </tr>
                </thead>
                <tbody>
                  {candidateQualityData?.interviewerAnalysis?.interviewers?.map(
                    (interviewer, i) => (
                      <tr key={i} className="border-b border-md-outline-variant last:border-b-0"> 
                        <td className="py-3 text-sm text-md-on-surface">{interviewer.name}</td>
                        <td className="py-3 text-sm text-md-on-surface">{interviewer.interviewCount}</td>
                        <td className="py-3 text-sm text-md-on-surface">{interviewer.avgScore}</td>
                        <td className="py-3 text-sm text-md-on-surface">{interviewer.passRate}</td>
                        <td className="py-3 text-sm text-md-on-surface">
                          <div className="flex items-center gap-2"> {/* Added gap */}
                            <div className="w-full bg-md-surface-variant rounded-full h-2 flex-1"> {/* Added flex-1 */}
                              <div
                                className="bg-md-primary rounded-full h-2"
                                style={{ width: `${Math.min(parseFloat(interviewer.effectivenessScore), 100)}%` }}
                              ></div>
                            </div>
                            <span className="w-8 text-right">{interviewer.effectivenessScore}</span> {/* Fixed width span */}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="container overflow-y-scroll w-screen md:w-full h-full mx-auto py-6 px-4 md:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"> {/* Adjusted padding */}
    
    

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 sm:space-x-4 pb-4 mb-6 border-b border-md-outline-variant [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"> {/* Hide scrollbar */}
        <Tab
          active={activeTab === "overview"}
          icon={<BarChartIcon size={16} />}
          label="Overview"
          onClick={() => setActiveTab("overview")}
        />
        <Tab
          active={activeTab === "predictive"}
          icon={<TrendingUp size={16} />}
          label="Predictive"
          onClick={() => setActiveTab("predictive")}
        />
        <Tab
          active={activeTab === "quality"}
          icon={<Award size={16} />}
          label="Quality"
          onClick={() => setActiveTab("quality")}
        />
        <Tab
          active={activeTab === "efficiency"}
          icon={<Clock size={16} />}
          label="Efficiency"
          onClick={() => setActiveTab("efficiency")}
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-md-primary animate-spin mb-4" />
            <p className="text-lg text-md-on-surface">
              Loading analytics data...
            </p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "predictive" && renderPredictiveTab()}
          {activeTab === "quality" && renderCandidateQualityTab()}
          {activeTab === "efficiency" && (
            <div className="text-center py-16">
              <h3 className="text-xl mb-2 text-md-on-surface">
                Efficiency & ROI Analytics
              </h3>
              <p className="text-md-on-surface-variant mb-4">
                Coming soon in the next update
              </p>
              <Settings className="mx-auto h-16 w-16 text-md-outline" />
            </div>
          )}
        </>
      )}

      {/* Custom Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 p-4 md:p-6 bg-md-tertiary-container rounded-2xl" // Adjusted padding
      >
        <h3 className="text-lg font-medium mb-2 text-md-on-tertiary-container">
          Custom Reports
        </h3>
        <p className="mb-4 text-sm md:text-base text-md-on-tertiary-container"> {/* Adjusted text size */}
          Need a specific report not listed above? Our team can generate custom
          analytics based on your requirements.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-md-tertiary text-md-on-tertiary px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-md transition-shadow"
        >
          Request Custom Report
        </motion.button>
      </motion.div>
    </div>
  );
}
