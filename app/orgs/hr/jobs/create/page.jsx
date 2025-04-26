"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useTheme } from "@/contexts/ThemeContext";
import MDEditor from "@/components/common/MDEditor";
import { motion } from "framer-motion";
import { jobService } from "@/services/jobService";
import ReactMarkdown from "react-markdown";

const steps = [
  "Job Details",
  "Job Description",
  "Requirements",
  "Hiring Process",
  "Review",
];
const JOB_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior-level",
  "Director",
  "Executive",
];
const REMOTE_TYPES = ["On-site", "Remote", "Hybrid"];
const HIRING_STEP_TYPES = ["Shortlist", "Test", "Interview", "Onboard"];

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
    visaSponsorshipAvailable: false,
    additionalDetails: "",
    hiringProcess: [
      {
        type: "Shortlist",
        name: "Resume Screening",
        description: "Initial review of submitted applications",
        plannedDate: "",
        completedDate: "",
      },
    ],
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
        // Hiring process validation
        const hiringProcessValid =
          jobData.hiringProcess.length > 0 &&
          jobData.hiringProcess.every(
            (step) => step.type && step.name && step.name.trim() !== ""
          );
        setIsStepValid(hiringProcessValid);
        break;
      case 4:
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
        hiringProcess: JSON.stringify(jobData.hiringProcess),
      };

      await jobService.createJob(transformedData);

      // Show success confirmation
      alert("Job posted successfully!");
      router.push("/orgs/hr/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job posting");
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle hiring process steps
  const addHiringStep = () => {
    setJobData((prevData) => ({
      ...prevData,
      hiringProcess: [
        ...prevData.hiringProcess,
        {
          type: "Shortlist",
          name: "",
          description: "",
          plannedDate: "",
          completedDate: "",
        },
      ],
    }));
  };

  const updateHiringStep = (index, field, value) => {
    const updatedSteps = [...jobData.hiringProcess];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    handleJobDataChange("hiringProcess", updatedSteps);
  };

  const removeHiringStep = (index) => {
    const updatedSteps = jobData.hiringProcess.filter((_, i) => i !== index);
    handleJobDataChange("hiringProcess", updatedSteps);
  };

  const moveHiringStep = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === jobData.hiringProcess.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedSteps = [...jobData.hiringProcess];
    [updatedSteps[index], updatedSteps[newIndex]] = [
      updatedSteps[newIndex],
      updatedSteps[index],
    ];

    handleJobDataChange("hiringProcess", updatedSteps);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            className="space-y-6 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6 ">
              <div>
                <label
                  htmlFor="job-title"
                  className="block text-sm font-medium "
                >
                  Job Title <span className="text-md-error">*</span>
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={jobData.title}
                  onChange={(e) => handleJobDataChange("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium mb-1"
                  >
                    Department <span className="text-md-error">*</span>
                  </label>
                  <select
                    id="department"
                    value={jobData.department}
                    onChange={(e) =>
                      handleJobDataChange("department", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent appearance-none transition-all duration-200"
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
                    className="block text-sm font-medium mb-1"
                  >
                    Employment Type <span className="text-md-error">*</span>
                  </label>
                  <select
                    id="employment-type"
                    value={jobData.employmentType}
                    onChange={(e) =>
                      handleJobDataChange("employmentType", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent appearance-none transition-all duration-200"
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
                  className="block text-sm font-medium mb-1"
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
                  className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent transition-all duration-200"
                />
                <p className="mt-1 text-sm text-md-on-surface-variant">
                  Enter city, country or 'Remote'
                </p>
              </div>

              <div className="p-6 bg-md-primary-container md:bg-md-secondary-container rounded-xl">
                <h3 className="text-lg font-medium mb-4">
                  Salary Information (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium mb-1"
                    >
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={jobData.salaryCurrency}
                      onChange={(e) =>
                        handleJobDataChange("salaryCurrency", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface focus:ring-2 focus:ring-md-primary focus:border-transparent appearance-none transition-all duration-200"
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
                      className="block text-sm font-medium mb-1"
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
                      className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface focus:ring-2 focus:ring-md-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="job-level"
                  className="block text-sm font-medium mb-1"
                >
                  Job Level
                </label>
                <select
                  id="job-level"
                  value={jobData.jobLevel}
                  onChange={(e) =>
                    handleJobDataChange("jobLevel", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent appearance-none transition-all duration-200"
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
                  className="block text-sm font-medium mb-1"
                >
                  Remote Type
                </label>
                <select
                  id="remote-type"
                  value={jobData.jobType}
                  onChange={(e) =>
                    handleJobDataChange("jobType", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent appearance-none transition-all duration-200"
                >
                  <option value="">Select Type</option>
                  {REMOTE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-6 bg-md-primary-container md:bg-md-secondary-container rounded-xl">
                <div className="flex items-center mb-4">
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
                    className="h-5 w-5 text-md-primary border-md-outline rounded focus:ring-md-primary"
                  />
                  <label
                    htmlFor="visa-sponsorship"
                    className="ml-2 block text-sm"
                  >
                    Visa Sponsorship Available
                  </label>
                </div>

                <div className="form-row  mb-4">
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium mb-1"
                  >
                    Application Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="deadline"
                    value={jobData.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleJobDataChange("deadline", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent"
                  />
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
            className="space-y-6"
          >
            <p className="text-lg font-medium mb-2 text-md-on-surface">
              Job Description <span className="text-md-error">*</span>
            </p>
            <p className="text-md-on-surface-variant mb-4">
              Write a compelling job description to attract the right
              candidates.
            </p>
            <div className="bg-md-surface p-1 rounded-xl">
              <MDEditor
                value={jobData.description}
                onChange={(value) => handleJobDataChange("description", value)}
                placeholder="Write a detailed job description using Markdown..."
                className="enhanced-editor rounded-xl"
              />
            </div>
            <div className="p-4 bg-md-secondary-container text-md-on-secondary-container rounded-xl mt-4">
              <p className="font-medium mb-2">Markdown Tips:</p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center">
                  <code className="bg-md-surface-variant text-md-on-surface-variant px-2 py-1 rounded-md mr-2">
                    # Heading 1
                  </code>
                  <span>for sections</span>
                </li>
                <li className="flex items-center">
                  <code className="bg-md-surface-variant text-md-on-surface-variant px-2 py-1 rounded-md mr-2">
                    **Bold Text**
                  </code>
                  <span>for emphasis</span>
                </li>
                <li className="flex items-center">
                  <code className="bg-md-surface-variant text-md-on-surface-variant px-2 py-1 rounded-md mr-2">
                    - Item
                  </code>
                  <span>for bullet lists</span>
                </li>
              </ul>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-md-surface-container p-6 rounded-xl mb-6">
              <p className="text-lg font-medium mb-2">
                Requirements and Qualifications{" "}
                <span className="text-md-error">*</span>
              </p>
              <div className="bg-md-surface p-1 rounded-xl">
                <MDEditor
                  value={jobData.qualifications}
                  onChange={(value) =>
                    handleJobDataChange("qualifications", value)
                  }
                  placeholder="List job requirements using Markdown..."
                  className="enhanced-editor rounded-xl"
                />
              </div>
            </div>

            <div className="bg-md-surface-container p-6 rounded-xl mb-6">
              <p className="text-lg font-medium mb-2">Benefits and Perks</p>
              <div className="bg-md-surface p-1 rounded-xl">
                <MDEditor
                  value={jobData.benefits}
                  onChange={(value) => handleJobDataChange("benefits", value)}
                  placeholder="Describe benefits using Markdown..."
                  className="enhanced-editor rounded-xl"
                />
              </div>
            </div>

            <div className="bg-md-surface-container p-6 rounded-xl mb-6">
              <p className="text-lg font-medium mb-2">Language Requirements</p>
              <div className="bg-md-surface p-1 rounded-xl">
                <MDEditor
                  value={jobData.languageRequirements}
                  onChange={(value) =>
                    handleJobDataChange("languageRequirements", value)
                  }
                  placeholder="List language requirements using Markdown..."
                  className="enhanced-editor rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-md-surface-container p-6 rounded-xl">
                <p className="text-lg font-medium mb-2">Experience Required</p>
                <input
                  type="number"
                  value={jobData.experienceRequired}
                  onChange={(e) =>
                    handleJobDataChange("experienceRequired", e.target.value)
                  }
                  placeholder="Enter years of experience"
                  className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface focus:ring-2 focus:ring-md-primary focus:border-transparent"
                />
              </div>

              <div className="bg-md-surface-container p-6 rounded-xl">
                <p className="text-lg font-medium mb-2">Application Link</p>
                <input
                  type="url"
                  value={jobData.applicationLink}
                  onChange={(e) =>
                    handleJobDataChange("applicationLink", e.target.value)
                  }
                  placeholder="Enter application URL"
                  className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface focus:ring-2 focus:ring-md-primary focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-md-surface-container p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Define Hiring Process</h2>
              <p className="text-md-on-surface-variant mb-6">
                Specify the steps candidates will go through in your hiring
                process.
              </p>

              <div className="space-y-6">
                {jobData.hiringProcess.map((step, index) => (
                  <div
                    key={index}
                    className="bg-md-surface p-6 rounded-xl border border-md-outline"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">Step {index + 1}</h3>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => moveHiringStep(index, "up")}
                          disabled={index === 0}
                          className="p-2 rounded-full hover:bg-md-surface-variant disabled:opacity-50"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHiringStep(index, "down")}
                          disabled={index === jobData.hiringProcess.length - 1}
                          className="p-2 rounded-full hover:bg-md-surface-variant disabled:opacity-50"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHiringStep(index)}
                          className="p-2 rounded-full text-md-error hover:bg-md-error-container"
                          title="Remove step"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Type <span className="text-md-error">*</span>
                        </label>
                        <select
                          value={step.type}
                          onChange={(e) =>
                            updateHiringStep(index, "type", e.target.value)
                          }
                          className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent appearance-none transition-all duration-200"
                          required
                        >
                          {HIRING_STEP_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name <span className="text-md-error">*</span>
                        </label>
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) =>
                            updateHiringStep(index, "name", e.target.value)
                          }
                          placeholder="e.g. Phone Screening, Technical Interview"
                          className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) =>
                          updateHiringStep(index, "description", e.target.value)
                        }
                        placeholder="Describe this hiring step"
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Planned Date
                        </label>
                        <input
                          type="date"
                          value={step.plannedDate}
                          onChange={(e) =>
                            updateHiringStep(
                              index,
                              "plannedDate",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 rounded-xl border border-md-outline bg-md-surface-container focus:ring-2 focus:ring-md-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addHiringStep}
                  className="w-full py-3 border-2 border-dashed border-md-outline rounded-xl hover:bg-md-surface-variant transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">+</span> Add Hiring Step
                </button>
              </div>
            </div>

            <div className="bg-md-secondary-container text-md-on-secondary-container p-4 rounded-xl">
              <h3 className="font-medium mb-2">
                Tips for a Good Hiring Process:
              </h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  Order steps chronologically as candidates will experience them
                </li>
                <li>Be specific about what each step entails</li>
                <li>Include approximate timeframes when possible</li>
                <li>
                  Common steps include: application review, screening call,
                  assessments, interviews, reference checks, and onboarding
                </li>
              </ul>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-md-surface rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Job Posting Review</h2>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-xl font-semibold">
                    {jobData.title || "Job Title"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-md-primary-container text-md-on-primary-container">
                      {jobData.department || "Department"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-md-secondary-container text-md-on-secondary-container">
                      {jobData.employmentType || "Type"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-md-tertiary-container text-md-on-tertiary-container">
                      {jobData.location || "Location"}
                    </span>
                  </div>
                </div>

                {(jobData.salary || jobData.salaryCurrency) && (
                  <div className="flex items-center p-3 bg-md-surface-container rounded-xl">
                    <span className="mr-2 text-xl">💰</span>
                    <span className="font-medium">
                      {jobData.salaryCurrency} {jobData.salary}
                    </span>
                  </div>
                )}

                <hr className="border-md-outline" />

                <div className="p-4 bg-md-surface-container rounded-xl">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <span className="mr-2">📝</span> Description
                  </h3>
                  <div className="prose prose-md max-w-none bg-md-surface p-4 rounded-lg">
                    <ReactMarkdown>{jobData.description}</ReactMarkdown>
                  </div>
                </div>

                <div className="p-4 bg-md-surface-container rounded-xl">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <span className="mr-2">✅</span> Requirements
                  </h3>
                  <div className="prose prose-md max-w-none bg-md-surface p-4 rounded-lg">
                    <ReactMarkdown>{jobData.qualifications}</ReactMarkdown>
                  </div>
                </div>

                {jobData.benefits && (
                  <div className="p-4 bg-md-surface-container rounded-xl">
                    <h3 className="flex items-center text-lg font-medium mb-3">
                      <span className="mr-2">🎁</span> Benefits
                    </h3>
                    <div className="prose prose-md max-w-none bg-md-surface p-4 rounded-lg">
                      <ReactMarkdown>{jobData.benefits}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {jobData.languageRequirements && (
                  <div className="p-4 bg-md-surface-container rounded-xl">
                    <h3 className="flex items-center text-lg font-medium mb-3">
                      <span className="mr-2">🌐</span> Language Requirements
                    </h3>
                    <div className="prose prose-md max-w-none bg-md-surface p-4 rounded-lg">
                      <ReactMarkdown>
                        {jobData.languageRequirements}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {jobData.experienceRequired && (
                  <div className="p-4 bg-md-surface-container rounded-xl">
                    <h3 className="flex items-center text-lg font-medium mb-3">
                      <span className="mr-2">📈</span> Experience Required
                    </h3>
                    <div className="bg-md-surface p-4 rounded-lg">
                      {jobData.experienceRequired} years
                    </div>
                  </div>
                )}

                {jobData.applicationLink && (
                  <div className="p-4 bg-md-surface-container rounded-xl">
                    <h3 className="flex items-center text-lg font-medium mb-3">
                      <span className="mr-2">🔗</span> Application Link
                    </h3>
                    <div className="bg-md-surface p-4 rounded-lg">
                      <a
                        href={jobData.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md-primary hover:text-md-primary-container transition-colors"
                      >
                        {jobData.applicationLink}
                      </a>
                    </div>
                  </div>
                )}

                {jobData.hiringProcess.length > 0 && (
                  <div className="p-4 bg-md-surface-container rounded-xl">
                    <h3 className="flex items-center text-lg font-medium mb-3">
                      <span className="mr-2">📋</span> Hiring Process
                    </h3>
                    <div className="bg-md-surface p-4 rounded-lg">
                      <ol className="space-y-3">
                        {jobData.hiringProcess.map((step, index) => (
                          <li
                            key={index}
                            className="p-3 border-l-4 border-md-primary-container pl-3"
                          >
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">
                                  {index + 1}. {step.name}
                                </span>
                                <span className="ml-2 px-2 py-0.5 bg-md-secondary-container text-md-on-secondary-container rounded-full text-xs">
                                  {step.type}
                                </span>
                              </div>
                              {step.plannedDate && (
                                <span className="text-sm text-md-on-surface-variant">
                                  {step.plannedDate}
                                </span>
                              )}
                            </div>
                            {step.description && (
                              <p className="text-sm mt-1 text-md-on-surface-variant">
                                {step.description}
                              </p>
                            )}
                          </li>
                        ))}
                      </ol>
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
    <div className="w-full h-full overflow-y-auto md:pt-5 md:rounded-tl-3xl md:bg-md-surface-container py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto pb-20">
        {error && (
          <div className="mb-4 p-4 bg-md-error-container text-md-on-error-container rounded-xl border border-md-error">
            {error}
          </div>
        )}
        <h1 className="text-3xl font-bold mb-8">Create New Job</h1>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${
                      index === activeStep
                        ? "border-md-primary bg-md-primary text-md-on-primary"
                        : index < activeStep
                        ? "border-md-tertiary bg-md-tertiary text-md-on-tertiary"
                        : "border-md-outline bg-md-surface-container"
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
                <div className="hidden md:block ml-4 text-sm font-medium">
                  {label}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-md-outline"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className=" rounded-2xl  md:p-8 mb-8">
          {renderStepContent(activeStep)}
        </div>

        <div className="flex justify-between items-center">
          <button
            className="px-6 py-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-variant transition-colors duration-200"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            ← Back
          </button>
          <div className="space-x-4">
            <button
              className="px-6 py-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-variant transition-colors duration-200"
              onClick={() => router.push("/orgs/hr/jobs")}
            >
              Cancel
            </button>
            {activeStep === steps.length - 1 ? (
              <button
                className={`px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container 
                disabled:opacity-50 disabled:bg-md-surface-variant disabled:text-md-on-surface-variant transition-colors duration-200`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Job ✓"}
              </button>
            ) : (
              <button
                className={`px-6 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container 
                disabled:opacity-50 disabled:bg-md-surface-variant disabled:text-md-on-surface-variant transition-colors duration-200`}
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
