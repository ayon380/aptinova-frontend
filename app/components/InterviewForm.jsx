import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2, Users, AlertCircle } from "lucide-react";

export default function InterviewForm({
  onSubmit,
  onCancel,
  attendees,
  jobId,
}) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: 30,
    location: "",
    type: "online",
    notes: "",
    interviewers: [""], // Start with one empty interviewer field
  });

  // Add error tracking states
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    // Duration validation
    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else if (formData.duration < 15) {
      newErrors.duration = "Duration must be at least 15 minutes";
    }

    // Interviewers validation
    const validInterviewers = formData.interviewers.filter(
      (email) => email.trim() !== ""
    );
    if (validInterviewers.length === 0) {
      newErrors.interviewers = "At least one interviewer is required";
    } else {
      // Validate email format for each interviewer
      formData.interviewers.forEach((email, index) => {
        if (email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (!newErrors.interviewers) {
            newErrors.interviewers = {};
          }
          newErrors.interviewers[index] = "Invalid email format";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and set submitting state
    setApiError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate end date time based on duration
      const startDateTime = `${formData.date}T${formData.time}:00`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            summary: `Interview for ${attendees.map((a) => a.name).join(", ")}`,
            description: formData.notes,
            startDateTime: startDateTime,
            duration: formData.duration,
            interviewers: formData.interviewers.filter(
              (email) => email.trim() !== ""
            ),
            jobId: jobId, // Include job ID
            applicantId: attendees.length === 1 ? attendees[0].id : null, // Only include if single applicant
            attendees: attendees,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      onSubmit({
        ...formData,
        eventId: data.eventId,
      });
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setApiError(
        error.message || "Failed to schedule interview. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInterviewerField = () => {
    setFormData({
      ...formData,
      interviewers: [...formData.interviewers, ""],
    });
  };

  const removeInterviewerField = (index) => {
    const updatedInterviewers = [...formData.interviewers];
    updatedInterviewers.splice(index, 1);
    setFormData({
      ...formData,
      interviewers: updatedInterviewers,
    });
  };

  const handleInterviewerChange = (index, value) => {
    const updatedInterviewers = [...formData.interviewers];
    updatedInterviewers[index] = value;
    setFormData({
      ...formData,
      interviewers: updatedInterviewers,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-md-surface rounded-3xl shadow-lg max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-md-outline bg-md-surface-container">
          <div className="flex items-center gap-3">
            <div className="bg-md-primary-container p-2 rounded-full">
              <Users className="w-5 h-5 text-md-on-primary-container" />
            </div>
            <h2 className="text-xl font-semibold text-md-on-surface">
              Schedule Interview
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-high"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {attendees.length > 0 && (
            <div className="mb-6 bg-md-surface-container-low p-4 rounded-xl">
              <h3 className="text-sm font-medium text-md-on-surface-variant mb-2">
                Candidates
              </h3>
              <div className="flex flex-wrap gap-2">
                {attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-md-secondary-container text-md-on-secondary-container text-sm rounded-full"
                  >
                    {attendee.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {apiError && (
            <div className="p-4 rounded-xl bg-md-error-container text-md-on-error-container flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) {
                    const newErrors = { ...errors };
                    delete newErrors.date;
                    setErrors(newErrors);
                  }
                }}
                className={`block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border ${
                  errors.date
                    ? "border-md-error"
                    : "border-md-outline focus:border-md-primary"
                } bg-transparent text-md-on-surface`}
                placeholder=" "
                required
              />
              <label
                htmlFor="date"
                className={`absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${
                  errors.date
                    ? "text-md-error"
                    : "text-md-on-surface-variant peer-focus:text-md-primary"
                }`}
              >
                Date
              </label>
              {errors.date && (
                <p className="text-md-error text-xs mt-1 ml-2">{errors.date}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => {
                  setFormData({ ...formData, time: e.target.value });
                  if (errors.time) {
                    const newErrors = { ...errors };
                    delete newErrors.time;
                    setErrors(newErrors);
                  }
                }}
                className={`block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border ${
                  errors.time
                    ? "border-md-error"
                    : "border-md-outline focus:border-md-primary"
                } bg-transparent text-md-on-surface`}
                placeholder=" "
                required
              />
              <label
                htmlFor="time"
                className={`absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${
                  errors.time
                    ? "text-md-error"
                    : "text-md-on-surface-variant peer-focus:text-md-primary"
                }`}
              >
                Time
              </label>
              {errors.time && (
                <p className="text-md-error text-xs mt-1 ml-2">{errors.time}</p>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value) || "",
                });
                if (errors.duration) {
                  const newErrors = { ...errors };
                  delete newErrors.duration;
                  setErrors(newErrors);
                }
              }}
              className={`block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border ${
                errors.duration
                  ? "border-md-error"
                  : "border-md-outline focus:border-md-primary"
              } bg-transparent text-md-on-surface`}
              placeholder=" "
              min="15"
              required
            />
            <label
              htmlFor="duration"
              className={`absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${
                errors.duration
                  ? "text-md-error"
                  : "text-md-on-surface-variant peer-focus:text-md-primary"
              }`}
            >
              Duration (minutes)
            </label>
            {errors.duration && (
              <p className="text-md-error text-xs mt-1 ml-2">
                {errors.duration}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-md-on-surface">
              Interviewers
            </label>

            {typeof errors.interviewers === "string" && (
              <p className="text-md-error text-xs mb-2">
                {errors.interviewers}
              </p>
            )}

            {formData.interviewers.map((interviewer, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={interviewer}
                    onChange={(e) => {
                      handleInterviewerChange(index, e.target.value);
                      if (errors.interviewers && errors.interviewers[index]) {
                        const newErrors = { ...errors };
                        if (newErrors.interviewers) {
                          delete newErrors.interviewers[index];
                          if (
                            Object.keys(newErrors.interviewers).length === 0
                          ) {
                            delete newErrors.interviewers;
                          }
                        }
                        setErrors(newErrors);
                      }
                    }}
                    className={`block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border ${
                      errors.interviewers && errors.interviewers[index]
                        ? "border-md-error"
                        : "border-md-outline focus:border-md-primary"
                    } bg-transparent text-md-on-surface`}
                    placeholder=" "
                  />
                  <label
                    className={`absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${
                      errors.interviewers && errors.interviewers[index]
                        ? "text-md-error"
                        : "text-md-on-surface-variant peer-focus:text-md-primary"
                    }`}
                  >
                    Interviewer Email
                  </label>
                  {errors.interviewers && errors.interviewers[index] && (
                    <p className="text-md-error text-xs mt-1 ml-2">
                      {errors.interviewers[index]}
                    </p>
                  )}
                </div>

                {formData.interviewers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInterviewerField(index)}
                    className="p-2 rounded-full text-md-error hover:bg-md-error-container/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addInterviewerField}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-md-outline text-md-on-surface-variant hover:bg-md-surface-variant mt-2"
            >
              <Plus className="w-4 h-4" /> Add Another Interviewer
            </button>
          </div>

          <div className="relative">
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none h-32"
              placeholder=" "
            />
            <label
              htmlFor="notes"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Notes
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-3xl border border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-3xl ${
                isSubmitting
                  ? "bg-md-surface-variant text-md-on-surface-variant"
                  : "bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container"
              } transition-colors relative`}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Schedule</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-md-on-surface-variant"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                </>
              ) : (
                "Schedule"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
