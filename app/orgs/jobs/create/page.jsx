"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useTheme } from "@/contexts/ThemeContext";
import MDEditor from "@/components/common/MDEditor";
import { motion } from "framer-motion";
import { jobService } from "@/services/jobService";
import ReactMarkdown from "react-markdown";

const steps = ["Job Details", "Job Description", "Requirements", "Review"];
const JOB_LEVELS = ["Entry-level", "Mid-level", "Senior-level", "Director", "Executive"];
const REMOTE_TYPES = ["On-site", "Remote", "Hybrid"];

export default function CreateJobPage() {
  const router = useRouter();
  // const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    salaryCurrency: "USD",
    benefits: "", // Changed to string
    employmentType: "",
    deadline: "",
    experienceRequired: "",
    qualifications: "", // Changed to string
    status: "Open",
    jobType: "",
    industry: "",
    applicationLink: "",
    remoteEligibility: false,
    jobLevel: "",
    languageRequirements: [],
    visaSponsorshipAvailable: false,
    additionalDetails: "",
  });

  // Validate form completeness to enable/disable Next button
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    validateCurrentStep();
  }, [jobData, activeStep]);

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        // Basic details validation
        const basicValid =
          jobData.title.length >= 2 &&
          jobData.title.length <= 100 &&
          jobData.employmentType &&
          jobData.jobType;
        setIsStepValid(basicValid);
        break;
      case 1:
        // Description validation
        setIsStepValid(
          jobData.description.length >= 20 && jobData.description.length <= 5000
        );
        break;
      case 2:
        // Requirements validation
        setIsStepValid(true); // Modified since qualifications are now optional
        break;
      case 3:
        setIsStepValid(true);
        break;
      default:
        setIsStepValid(false);
    }
  };

  const handleJobDataChange = (field, value) => {
    setJobData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const transformedData = {
        ...jobData,
        salary: parseFloat(jobData.salary) || null,
        deadline: jobData.deadline
          ? new Date(jobData.deadline).toISOString()
          : null,
        experienceRequired: parseInt(jobData.experienceRequired) || null,
        postedAt: new Date().toISOString(),
        status: "Open",
      };

      await jobService.createJob(transformedData);

      // Show success confirmation
      alert("Job posted successfully!");
      router.push("/orgs/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job posting");
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="job-title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={jobData.title}
                  onChange={(e) => handleJobDataChange("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    value={jobData.department}
                    onChange={(e) =>
                      handleJobDataChange("department", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none bg-white dark:bg-gray-800 transition-all duration-200"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="employment-type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employment-type"
                    value={jobData.employmentType}
                    onChange={(e) =>
                      handleJobDataChange("employmentType", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none bg-white dark:bg-gray-800 transition-all duration-200"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={jobData.location}
                  onChange={(e) =>
                    handleJobDataChange("location", e.target.value)
                  }
                  placeholder="Enter location or 'Remote'"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter city, country or 'Remote'
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Salary Range (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={jobData.salaryCurrency}
                      onChange={(e) =>
                        handleJobDataChange("salaryCurrency", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none bg-white dark:bg-gray-800 transition-all duration-200"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      value={jobData.salary}
                      onChange={(e) =>
                        handleJobDataChange("salary", e.target.value)
                      }
                      placeholder="Amount"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="job-level"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Job Level
                </label>
                <select
                  id="job-level"
                  value={jobData.jobLevel}
                  onChange={(e) =>
                    handleJobDataChange("jobLevel", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none bg-white dark:bg-gray-800 transition-all duration-200"
                >
                  <option value="">Select Level</option>
                  {JOB_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="remote-type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Remote Type
                </label>
                <select
                  id="remote-type"
                  value={jobData.jobType}
                  onChange={(e) =>
                    handleJobDataChange("jobType", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none bg-white dark:bg-gray-800 transition-all duration-200"
                >
                  <option value="">Select Type</option>
                  {REMOTE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="visa-sponsorship"
                  type="checkbox"
                  checked={jobData.visaSponsorshipAvailable}
                  onChange={(e) =>
                    handleJobDataChange(
                      "visaSponsorshipAvailable",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="visa-sponsorship"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Visa Sponsorship Available
                </label>
              </div>

              <div className="form-row">
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Application Deadline
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  value={jobData.deadline}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleJobDataChange("deadline", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="form-row">
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Salary
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    id="salary"
                    value={jobData.salary}
                    onChange={(e) => handleJobDataChange("salary", e.target.value)}
                    placeholder="Enter salary amount"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <select
                    value={jobData.salaryCurrency}
                    onChange={(e) => handleJobDataChange("salaryCurrency", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="section-subtitle">
              Job Description <span className="required">*</span>
            </p>
            <p className="editor-tip">
              Write a compelling job description to attract the right
              candidates.
            </p>
            <MDEditor
              value={jobData.description}
              onChange={(value) => handleJobDataChange("description", value)}
              placeholder="Write a detailed job description using Markdown..."
              className="enhanced-editor"
            />
            <div className="markdown-tips">
              <p>Markdown Tips:</p>
              <ul>
                <li>
                  <code># Heading 1</code> for sections
                </li>
                <li>
                  <code>**Bold Text**</code> for emphasis
                </li>
                <li>
                  <code>- Item</code> for bullet lists
                </li>
              </ul>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            className="form-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-row full-width">
              <p className="section-subtitle">
                Requirements and Qualifications{" "}
                <span className="required">*</span>
              </p>
              <MDEditor
                value={jobData.qualifications}
                onChange={(value) =>
                  handleJobDataChange("qualifications", value)
                }
                placeholder="List job requirements using Markdown..."
                className="enhanced-editor"
              />
            </div>
            <div className="form-row full-width">
              <p className="section-subtitle">Benefits and Perks</p>
              <MDEditor
                value={jobData.benefits}
                onChange={(value) => handleJobDataChange("benefits", value)}
                placeholder="Describe benefits using Markdown..."
                className="enhanced-editor"
              />
            </div>
            <div className="form-row full-width">
              <p className="section-subtitle">Language Requirements</p>
              <MDEditor
                value={jobData.languageRequirements}
                onChange={(value) =>
                  handleJobDataChange("languageRequirements", value)
                }
                placeholder="List language requirements using Markdown..."
                className="enhanced-editor"
              />
            </div>
            <div className="form-row full-width">
              <p className="section-subtitle">Experience Required</p>
              <input
                type="number"
                value={jobData.experienceRequired}
                onChange={(e) =>
                  handleJobDataChange("experienceRequired", e.target.value)
                }
                placeholder="Enter years of experience required"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
              />
            </div>
            <div className="form-row full-width">
              <p className="section-subtitle">Application Link</p>
              <input
                type="url"
                value={jobData.applicationLink}
                onChange={(e) =>
                  handleJobDataChange("applicationLink", e.target.value)
                }
                placeholder="Enter application link"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Job Posting Review
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {jobData.title || "Job Title"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {jobData.department || "Department"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {jobData.employmentType || "Type"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                      {jobData.location || "Location"}
                    </span>
                  </div>
                </div>

                {(jobData.salary || jobData.salaryCurrency) && (
                  <div className="salary-display">
                    <span className="salary-icon">💰</span>
                    {jobData.salaryCurrency} {jobData.salary}
                  </div>
                )}

                <hr className="divider" />

                <div className="content-section">
                  <h3 className="section-heading">
                    <span className="section-icon">📝</span> Description
                  </h3>
                  <div className="markdown-preview">
                    <ReactMarkdown>{jobData.description}</ReactMarkdown>
                  </div>
                </div>

                <div className="content-section">
                  <h3 className="section-heading">
                    <span className="section-icon">✅</span> Requirements
                  </h3>
                  <div className="markdown-preview">
                    <ReactMarkdown>{jobData.qualifications}</ReactMarkdown>
                  </div>
                </div>

                {jobData.benefits && (
                  <div className="content-section">
                    <h3 className="section-heading">
                      <span className="section-icon">🎁</span> Benefits
                    </h3>
                    <div className="markdown-preview">
                      <ReactMarkdown>{jobData.benefits}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {jobData.languageRequirements && (
                  <div className="content-section">
                    <h3 className="section-heading">
                      <span className="section-icon">🌐</span> Language
                      Requirements
                    </h3>
                    <div className="markdown-preview">
                      <ReactMarkdown>
                        {jobData.languageRequirements}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {jobData.experienceRequired && (
                  <div className="content-section">
                    <h3 className="section-heading">
                      <span className="section-icon">📈</span> Experience
                      Required
                    </h3>
                    <div className="markdown-preview">
                      {jobData.experienceRequired} years
                    </div>
                  </div>
                )}

                {jobData.applicationLink && (
                  <div className="content-section">
                    <h3 className="section-heading">
                      <span className="section-icon">🔗</span> Application Link
                    </h3>
                    <div className="markdown-preview">
                      <a
                        href={jobData.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {jobData.applicationLink}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-dvh bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Job
        </h1>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${
                      index === activeStep
                        ? "border-blue-500 bg-blue-500 text-white"
                        : index < activeStep
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 dark:border-gray-600"
                    } transition-all duration-200`}
                  onClick={() => index < activeStep && setActiveStep(index)}
                >
                  {index < activeStep ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="hidden md:block ml-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-300 dark:bg-gray-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {renderStepContent(activeStep)}
        </div>

        <div className="flex justify-between items-center">
          <button
            className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            ← Back
          </button>
          <div className="space-x-4">
            <button
              className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => router.push("/orgs/jobs")}
            >
              Cancel
            </button>
            {activeStep === steps.length - 1 ? (
              <button
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Job ✓"}
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={handleNext}
                disabled={!isStepValid}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
