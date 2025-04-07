"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const interviewId = params.id || searchParams.get("id");

  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timeConstraint, setTimeConstraint] = useState({
    canSubmit: false,
    message: "Loading time constraints...",
  });

  useEffect(() => {
    // Fetch interview details for the current ID
    const fetchInterview = async () => {
      if (!interviewId) {
        setError("No interview ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interviews/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch interview details");
        }

        const data = await response.json();
        setInterview(data);

        // Check if we're within the allowed time window
        const now = new Date();
        const startTime = new Date(data.startDateTime);
        const endTime = new Date(data.endDateTime);
        const startTimeLimit = new Date(startTime.getTime() - 15 * 60000); // 15 mins before
        const endTimeLimit = new Date(endTime.getTime() + 30 * 60000); // 30 mins after

        if (now < startTimeLimit) {
          setTimeConstraint({
            canSubmit: false,
            message: `Feedback submission will be available 15 minutes before the interview starts (${startTimeLimit.toLocaleTimeString()}).`,
          });
        } else if (now > endTimeLimit) {
          setTimeConstraint({
            canSubmit: false,
            message: "The window for submitting feedback has closed.",
          });
        } else {
          setTimeConstraint({
            canSubmit: true,
            message: "You can submit feedback now.",
          });
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
        setError(err.message || "Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/feedback/${interviewId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            feedback,
            score: parseInt(score),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setSuccess("Feedback submitted successfully!");
      // Optionally reset form
      // setFeedback("");
      // setScore(0);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "An error occurred while submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-md-primary"></div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="bg-md-error-container text-md-on-error-container p-4 rounded-xl mx-auto max-w-2xl mt-8">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-md-surface-container rounded-3xl shadow-sm p-6 md:p-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-md-on-surface mb-2">
          Interview Feedback
        </h1>

        {interview && (
          <div className="mb-6">
            <p className="text-md-on-surface-variant mb-1">
              <span className="font-medium">Candidate:</span>{" "}
              {interview.Applicant.Candidate.firstName}
            </p>
            <p className="text-md-on-surface-variant mb-1">
              <span className="font-medium">Email:</span>{" "}
              {interview.Applicant.Candidate.email}
            </p>
            <p className="text-md-on-surface-variant mb-1">
              <span className="font-medium">Position:</span>{" "}
              {interview.Job.title}
            </p>
            <p className="text-md-on-surface-variant mb-1">
              <span className="font-medium">Date:</span>{" "}
              {new Date(interview.startDateTime).toLocaleDateString()}
            </p>
            <p className="text-md-on-surface-variant mb-4">
              <span className="font-medium">Time:</span>{" "}
              {new Date(interview.startDateTime).toLocaleTimeString()} -{" "}
              {new Date(interview.endDateTime).toLocaleTimeString()}
            </p>
          </div>
        )}

        {!timeConstraint.canSubmit ? (
          <div className="bg-md-secondary-container text-md-on-secondary-container p-4 rounded-xl mb-6">
            <h2 className="text-lg font-medium mb-2">Time Restricted</h2>
            <p>{timeConstraint.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="score"
                className="block text-md-on-surface font-medium mb-2"
              >
                Interview Score (0-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="score"
                  min="0"
                  max="10"
                  step="1"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full h-2 bg-md-surface-variant rounded-lg appearance-none cursor-pointer accent-md-primary"
                />
                <span className="bg-md-primary text-md-on-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {score}
                </span>
              </div>
              <div className="flex justify-between text-md-on-surface-variant text-sm mt-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="feedback"
                className="block text-md-on-surface font-medium mb-2"
              >
                Detailed Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback about the interview..."
                className="w-full min-h-[200px] p-4 border border-md-outline rounded-xl focus:ring-2 focus:ring-md-primary focus:border-transparent bg-md-surface text-md-on-surface placeholder-md-on-surface-variant"
                required
              />
            </div>

            {error && (
              <div className="bg-md-error-container text-md-on-error-container p-4 rounded-xl mb-6">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-md-tertiary-container text-md-on-tertiary-container p-4 rounded-xl mb-6">
                <p>{success}</p>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full bg-md-primary hover:bg-md-primary-container text-md-on-primary hover:text-md-on-primary-container py-3 px-6 rounded-full font-medium shadow-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
