"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Loader2,
  Mic,
  Video,
  Volume2,
  Shield,
  X,
  RefreshCw,
} from "lucide-react";
import TestHeader from "@/components/tests/TestHeader";
import QuestionNavigation from "@/components/tests/QuestionNavigation";
import QuestionDisplay from "@/components/tests/QuestionDisplay";
import ProctoringWarning from "@/components/tests/ProctoringWarning";
import OfflineWarning from "@/components/tests/OfflineWarning";
import useProctoring from "@/hooks/useProctoring";
import useTestTimer from "@/hooks/useTestTimer";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { isMobile } from "react-device-detect";
import IdentityVerification from "@/components/tests/IdentityVerification";
import LiveMonitoring from "@/components/tests/LiveMonitoring";

export default function TestPage() {
  const { testid } = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mediaPermissionsGranted, setMediaPermissionsGranted] = useState(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showTerminationWarning, setShowTerminationWarning] = useState(false);

  // Add retry states and confirmation modal state
  const [startRetrying, setStartRetrying] = useState(false);
  const [submitRetrying, setSubmitRetrying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  // Add state for test completion
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [isTestTerminated, setIsTestTerminated] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile);
  }, []);

  // Proctoring hooks with enhanced features
  const {
    warnings,
    isFullscreen,
    requestFullscreen,
    setupMediaStreams,
    checkMicrophoneMuted,
    startAudioMonitoring,
    startVideoMonitoring,
    stopAudioMonitoring, // Make sure this is available from your useProctoring hook
    stopVideoMonitoring, // Make sure this is available from your useProctoring hook
    releaseMediaStreams, // Make sure this is available from your useProctoring hook
    hasAudioPermission,
    hasVideoPermission,
    isMicMuted,
    speakingDetected,
    videoStream,
    audioStream,
    captureSelfie,
    checkLighting,
    testVoiceDetection,
    setVideoElement,
    shouldTerminateTest,
    warningCount,
    resetTerminationState,
  } = useProctoring();

  const {
    timeLeft,
    timeFormatted,
    startTimer,
    isTimeUp,
    pauseTimer,
    resumeTimer,
  } = useTestTimer();

  // Online status hook
  const { isOnline, offlineTimeExceeded, offlineTime } = useOnlineStatus();

  // Request media permissions before test starts
  const requestMediaPermissions = async () => {
    setShowPermissionRequest(true);
    await setupMediaStreams();
    checkMicrophoneMuted();
    setShowPermissionRequest(false);
    setMediaPermissionsGranted(true);
  };

  // Start monitoring once test begins
  useEffect(() => {
    if (testStarted && hasAudioPermission) {
      startAudioMonitoring();
    }
    if (testStarted && hasVideoPermission) {
      startVideoMonitoring();
    }
  }, [testStarted, hasAudioPermission, hasVideoPermission]);

  // Pause timer when offline for too long
  useEffect(() => {
    if (testStarted) {
      if (!isOnline && offlineTimeExceeded) {
        pauseTimer();
      } else if (isOnline && timeLeft !== null) {
        resumeTimer();
      }
    }
  }, [isOnline, offlineTimeExceeded, testStarted]);

  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch test");
        }
        const data = await response.json();

        // Process the test metadata (without questions)
        const processedTest = {
          ...data,
          testName: data.metadata?.title || data.testName,
          description: data.metadata?.description || data.description,
          duration: data.metadata?.durationMinutes || data.duration,
          passingScore: data.metadata?.passingScore || data.passingScore,
          questions: [], // Initialize with empty questions array
        };

        setTest(processedTest);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testid]);

  // Handle start test button click
  const handleStartTest = () => {
    setShowVerification(true);
  };

  // Separate API call function for starting the test
  const startTestAPI = async () => {
    // Call the start endpoint to get questions
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start test: ${response.status}`);
    }

    const data = await response.json();

    // Process the questions
    const processedQuestions = data.questions.map((q, index) => ({
      ...q,
      index, // Add index property for identification
      options:
        Array.isArray(q.options) && q.options[0]?.label
          ? q.options.map((opt) => opt.value)
          : q.options,
    }));

    return processedQuestions;
  };

  // Start test with manual retry logic
  const startTest = async (selfieImage) => {
    try {
      const processedQuestions = await startTestAPI();

      // Update test with questions
      setTest((prev) => ({
        ...prev,
        questions: processedQuestions,
      }));

      // Initialize empty answers array
      const initialAnswers = {};
      processedQuestions.forEach((q, index) => {
        initialAnswers[index] = null;
      });
      setUserAnswers(initialAnswers);

      // No need to set testStarted here again
      requestFullscreen();
      startTimer(test.duration * 60); // Convert minutes to seconds

      // Start monitoring with reference image right after test is successfully started
      startVideoMonitoring(selfieImage);
      startAudioMonitoring();
    } catch (err) {
      throw err; // Just throw the error for manual retry
    }
  };

  // Handle verification complete
  const handleVerificationComplete = async (selfieImage) => {
    setReferenceImage(selfieImage);
    setVerificationComplete(true);
    setShowVerification(false); // Hide verification right away

    // Set testStarted immediately to prevent flash of start screen
    setTestStarted(true);

    try {
      setStartRetrying(false);
      // Call the start endpoint to get questions
      await startTest(selfieImage);
    } catch (err) {
      setError("Failed to start test: " + err.message);
      setStartRetrying(true);
    }
  };

  // Separate API call function for submitting the test
  const submitTestAPI = async (answersArray) => {
    // Call end endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}/end`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to submit test: ${response.status}`);
    }

    return response;
  };

  // Submit test implementation with manual retry logic
  const submitTest = async () => {
    try {
      // Convert object of answers to array format with 1-based indexing for MCQs
      const answersArray = Object.keys(userAnswers)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((key) => {
          const question = test.questions.find(
            (q) => q.index === parseInt(key)
          );
          const answer = userAnswers[key];

          // If this is an MCQ question and answer is a number (option index)
          if (
            question?.type === "multiple_choice" &&
            typeof answer === "number"
          ) {
            // Convert to 1-based indexing by adding 1
            return answer + 1;
          }

          return answer;
        });

      await submitTestAPI(answersArray);

      // Stop proctoring when test is completed
      if (stopVideoMonitoring) stopVideoMonitoring();
      if (stopAudioMonitoring) stopAudioMonitoring();
      if (releaseMediaStreams) releaseMediaStreams();

      // Instead of redirecting immediately, set test as completed
      setIsTestCompleted(true);
      setIsSubmitting(false);
    } catch (err) {
      throw err; // Just throw the error for manual retry
    }
  };

  // Handle submit button click - show confirmation modal first
  const handleSubmitClick = () => {
    setShowSubmitConfirmation(true);
  };

  // Confirm and submit the test
  const confirmAndSubmitTest = async () => {
    setShowSubmitConfirmation(false);
    handleSubmitTest();
  };

  // Submit the test with manual retry logic
  const handleSubmitTest = async () => {
    try {
      setIsSubmitting(true);
      setSubmitRetrying(false);
      await submitTest();
    } catch (err) {
      setError("Failed to submit test: " + err.message);
      setSubmitRetrying(true);
      setIsSubmitting(false);
    }
  };

  // Handle test termination due to excessive warnings
  useEffect(() => {
    if (shouldTerminateTest && testStarted) {
      setShowTerminationWarning(true);

      // Auto-redirect after showing the warning for 5 seconds
      const redirectTimer = setTimeout(() => {
        handleTestTermination();
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [shouldTerminateTest, testStarted]);

  // Handle test termination
  const handleTestTermination = async () => {
    try {
      // Call API to end the test
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            terminatedDueToViolations: true,
            answers: [], // Empty answers array
          }),
        }
      );

      // Stop proctoring when test is terminated
      if (stopVideoMonitoring) stopVideoMonitoring();
      if (stopAudioMonitoring) stopAudioMonitoring();
      if (releaseMediaStreams) releaseMediaStreams();

      resetTerminationState();
      // Instead of redirecting immediately, set test as terminated
      setIsTestTerminated(true);
    } catch (err) {
      console.error("Failed to process test termination:", err);

      // Stop proctoring even if API call fails
      if (stopVideoMonitoring) stopVideoMonitoring();
      if (stopAudioMonitoring) stopAudioMonitoring();
      if (releaseMediaStreams) releaseMediaStreams();

      // Set as terminated anyway
      setIsTestTerminated(true);
    }
  };

  // Update answers when user responds to a question
  const handleAnswerChange = useCallback((questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, []);

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Go to specific question
  const goToQuestion = (index) => {
    if (index >= 0 && index < test.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Handle timer end
  useEffect(() => {
    if (isTimeUp && testStarted) {
      handleSubmitTest();
    }
  }, [isTimeUp, testStarted]);

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-dvh flex items-center justify-center bg-md-surface bg-[radial-gradient(circle_at_top_right,rgba(var(--md-sys-color-primary-rgb),0.05),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(var(--md-sys-color-tertiary-rgb),0.05),transparent_30%)]"
      >
        <div className="p-10 rounded-3xl bg-md-surface-container-high shadow-lg text-center max-w-md w-full backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-md-primary animate-spin mb-4" />
            <h2 className="text-xl font-medium mb-2 text-md-on-surface">
              Preparing Your Test
            </h2>
            <p className="text-md-on-surface-variant mb-4">
              Setting up your secure testing environment...
            </p>
            <div className="w-48 h-2 bg-md-surface-container-low rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-md-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-dvh flex items-center justify-center bg-md-surface bg-[radial-gradient(circle_at_top_right,rgba(var(--md-sys-color-error-rgb),0.05),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(var(--md-sys-color-error-rgb),0.03),transparent_30%)]"
      >
        <div className="p-10 rounded-3xl bg-md-surface-container-high shadow-lg text-center max-w-md w-full backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto mb-6 bg-md-error-container rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-md-on-error-container" />
          </div>
          <h2 className="text-2xl font-medium mb-3 text-md-on-surface">
            Error Loading Test
          </h2>
          <p className="text-md-on-surface-variant mb-6 bg-md-surface-container rounded-xl p-3">
            {error}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
            <button
              onClick={() => router.push("/home")}
              className="px-6 py-2 text-md-on-surface-variant rounded-full hover:bg-md-surface-container transition-all"
            >
              Cancel and Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show test start screen
  if (!testStarted) {
    return (
      <div className="h-dvh flex items-center justify-center bg-md-surface bg-[radial-gradient(circle_at_top_right,rgba(var(--md-sys-color-primary-rgb),0.05),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(var(--md-sys-color-tertiary-rgb),0.05),transparent_30%)]">
        {showVerification ? (
          <IdentityVerification
            onComplete={handleVerificationComplete}
            proctoring={{
              hasVideoPermission,
              hasAudioPermission,
              videoStream,
              audioStream,
              captureSelfie,
              checkLighting,
              testVoiceDetection,
              setVideoElement,
              startAudioMonitoring, // Add this missing function
              setupMediaStreams, // Add this missing function
            }}
            isOnline={isOnline}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl p-8 md:p-10 rounded-3xl bg-md-surface-container-high shadow-lg backdrop-blur-sm relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-md-primary/5 rounded-full -translate-x-20 -translate-y-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-md-tertiary/5 rounded-full translate-x-10 translate-y-10 blur-3xl"></div>

            {isMobileDevice ? (
              <div className="text-center">
                <h1 className="text-2xl font-medium mb-4 text-md-on-surface">
                  Test Not Supported on Mobile Devices
                </h1>
                <p className="text-md-on-surface-variant mb-6">
                  Please use a desktop or laptop to take this test.
                </p>
              </div>
            ) : (
              <>
                {!isOnline && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-md-error-container border border-md-error/20 px-5 py-4 rounded-2xl"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-md-on-error-container mt-1">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-md-on-error-container font-medium">
                          You're offline
                        </h3>
                        <p className="text-md-on-error-container/90 mt-1">
                          Internet connection is required to take this test.
                          Please check your connection.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Media Permissions Request UI */}
                {!mediaPermissionsGranted && !showPermissionRequest && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-md-secondary-container border border-md-secondary/20 px-5 py-4 rounded-2xl"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-md-on-secondary-container mt-1">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-md-on-secondary-container font-medium">
                          Proctoring Required
                        </h3>
                        <p className="text-md-on-secondary-container/90 mt-1 mb-3">
                          This test requires microphone and webcam access for
                          proctoring. Please grant permissions when prompted.
                        </p>
                        <button
                          onClick={requestMediaPermissions}
                          className="px-4 py-2 bg-md-secondary text-md-on-secondary rounded-full hover:bg-md-secondary/90 transition-all text-sm"
                        >
                          Grant Permissions
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Permission status */}
                {showPermissionRequest && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 bg-md-surface-container p-5 rounded-2xl border border-md-outline-variant"
                  >
                    <h3 className="text-md-on-surface font-medium mb-4">
                      Please grant the following permissions:
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div
                          className={`mr-3 ${
                            hasAudioPermission
                              ? "text-md-primary"
                              : "text-md-outline"
                          }`}
                        >
                          <Mic className="h-5 w-5" />
                        </div>
                        <span
                          className={
                            hasAudioPermission
                              ? "text-md-primary"
                              : "text-md-on-surface-variant"
                          }
                        >
                          {hasAudioPermission
                            ? "Microphone access granted"
                            : "Waiting for microphone permission..."}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`mr-3 ${
                            hasVideoPermission
                              ? "text-md-primary"
                              : "text-md-outline"
                          }`}
                        >
                          <Video className="h-5 w-5" />
                        </div>
                        <span
                          className={
                            hasVideoPermission
                              ? "text-md-primary"
                              : "text-md-on-surface-variant"
                          }
                        >
                          {hasVideoPermission
                            ? "Webcam access granted"
                            : "Waiting for webcam permission..."}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Microphone muted warning */}
                {mediaPermissionsGranted && isMicMuted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-md-error-container border border-md-error/20 px-5 py-4 rounded-2xl"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-md-on-error-container mt-1">
                        <Volume2 className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-md-on-error-container font-medium">
                          Microphone appears to be muted
                        </h3>
                        <p className="text-md-on-error-container/90 mt-1">
                          Please ensure your microphone is enabled for test
                          proctoring.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <h1 className="text-3xl font-medium mb-2 text-md-on-surface flex items-center">
                  {test.testName}
                </h1>
                <div className="flex items-center gap-4 text-md-on-surface-variant mb-6">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {test.duration} minutes
                  </span>
                  <span className="w-1.5 h-1.5 bg-md-outline-variant rounded-full"></span>
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" /> {test.questions.length}{" "}
                    questions
                  </span>
                </div>

                <div className="mb-6 bg-md-surface-container p-6 rounded-2xl border border-md-outline-variant">
                  <h2 className="font-medium mb-3 text-lg text-md-on-surface flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4"></path>
                      <path d="M12 8h.01"></path>
                    </svg>
                    Test Instructions
                  </h2>
                  <ul className="list-disc pl-5 space-y-2.5 text-md-on-surface-variant">
                    <li>
                      This test contains{" "}
                      <span className="text-md-on-surface font-medium">
                        {test.questions.length} questions
                      </span>
                      .
                    </li>
                    <li>
                      You have{" "}
                      <span className="text-md-on-surface font-medium">
                        {test.duration} minutes
                      </span>{" "}
                      to complete the test.
                    </li>
                    <li>The test will auto-submit when the timer runs out.</li>
                    <li>
                      Switching tabs or exiting fullscreen will be flagged.
                    </li>
                    <li>You cannot copy or paste during the test.</li>
                    <li>
                      Required passing score:{" "}
                      <span className="text-md-on-surface font-medium">
                        {test.passingScore}%
                      </span>
                    </li>
                    {test.metadata?.totalMarks && (
                      <li>
                        Total marks:{" "}
                        <span className="text-md-on-surface font-medium">
                          {test.metadata.totalMarks}
                        </span>
                      </li>
                    )}
                    {test.metadata?.randomOrder && (
                      <li>Questions are presented in random order.</li>
                    )}
                    <li>
                      <span className="text-md-error font-medium">
                        Important:
                      </span>{" "}
                      Exceeding 10 warnings will automatically terminate your
                      test.
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="font-medium mb-3 text-lg text-md-on-surface flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Description
                  </h2>
                  <p className="text-md-on-surface-variant bg-md-surface-container-low p-4 rounded-xl">
                    {test.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {test.metadata?.createdBy && (
                      <p className="text-md-on-surface-variant/70">
                        Created by:{" "}
                        <span className="text-md-primary">
                          {test.metadata.createdBy}
                        </span>
                      </p>
                    )}
                    {test.metadata?.lastUpdated && (
                      <p className="text-md-on-surface-variant/70">
                        Last updated:{" "}
                        <span className="text-md-primary">
                          {new Date(
                            test.metadata.lastUpdated
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={handleStartTest}
                  disabled={!isOnline || !mediaPermissionsGranted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-colors text-lg font-medium shadow-md flex items-center justify-center ${
                    !isOnline || !mediaPermissionsGranted
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {!isOnline ? (
                    <>Connect to Internet First</>
                  ) : !mediaPermissionsGranted ? (
                    <>Grant Required Permissions First</>
                  ) : (
                    <>Begin Test</>
                  )}
                </motion.button>
                {!isOnline && (
                  <p className="text-sm text-md-error mt-3 text-center">
                    You need to be online to start the test
                  </p>
                )}
                {!mediaPermissionsGranted && isOnline && (
                  <p className="text-sm text-md-error mt-3 text-center">
                    Microphone and webcam access required for proctoring
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  // Show thank you screen if test is completed
  if (isTestCompleted || isTestTerminated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-dvh flex items-center justify-center bg-md-surface bg-[radial-gradient(circle_at_top_right,rgba(var(--md-sys-color-primary-rgb),0.05),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(var(--md-sys-color-tertiary-rgb),0.05),transparent_30%)]"
      >
        <div className="p-10 rounded-3xl bg-md-surface-container-high shadow-lg text-center max-w-lg w-full backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center">
            {isTestCompleted ? (
              <>
                <div className="w-20 h-20 mb-6 bg-md-primary-container rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-md-on-primary-container" />
                </div>
                <h2 className="text-2xl font-medium mb-3 text-md-on-surface">
                  Test Submitted Successfully
                </h2>
                <p className="text-md-on-surface-variant mb-6">
                  Thank you for taking the time to complete this assessment.
                  Your responses have been recorded.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mb-6 bg-md-error-container rounded-full flex items-center justify-center">
                  <X className="w-10 h-10 text-md-on-error-container" />
                </div>
                <h2 className="text-2xl font-medium mb-3 text-md-on-surface">
                  Test Terminated
                </h2>
                <p className="text-md-on-surface-variant mb-6">
                  Your test has been terminated due to excessive violations of
                  test rules. Contact support if you believe this was in error.
                </p>
              </>
            )}

            <motion.button
              onClick={() => router.push("/home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-all shadow-sm flex items-center gap-2"
            >
              Return to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show actual test UI
  return (
    <div className="h-dvh flex flex-col bg-md-surface">
      <TestHeader
        testName={test.testName}
        timeLeft={timeFormatted}
        questionsCount={test.questions.length}
        currentQuestion={currentQuestionIndex + 1}
        onSubmit={handleSubmitClick}
        isSubmitting={isSubmitting}
      />

      <AnimatePresence>
        {warnings.length > 0 && (
          <ProctoringWarning warnings={warnings} warningCount={warningCount} />
        )}

        {/* Show offline notice if user goes offline during test */}
        {!isOnline && (
          <OfflineWarning
            offlineTime={offlineTime}
            timeExceeded={offlineTimeExceeded}
          />
        )}

        {/* Show retry UI for test submission */}
        {submitRetrying && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-x-0 top-16 z-50 flex justify-center"
          >
            <div className="bg-md-tertiary-container p-5 rounded-xl shadow-lg flex items-center gap-4 max-w-md">
              <AlertTriangle className="w-6 h-6 text-md-on-tertiary-container flex-shrink-0" />
              <div className="flex-1">
                <p className="text-md-on-tertiary-container font-medium mb-1">
                  Test Submission Failed
                </p>
                <p className="text-md-on-tertiary-container/80 text-sm mb-2">
                  We couldn't submit your test. Your answers are still saved.
                </p>
                <button
                  onClick={async () => {
                    try {
                      setSubmitRetrying(false);
                      const answersArray = Object.keys(userAnswers)
                        .sort((a, b) => parseInt(a) - parseInt(b))
                        .map((key) => userAnswers[key]);

                      await submitTestAPI(answersArray);
                      setIsTestCompleted(true);
                    } catch (err) {
                      setError("Failed to submit test: " + err.message);
                      setSubmitRetrying(true);
                    }
                  }}
                  className="bg-md-tertiary text-md-on-tertiary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Try Submitting Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Show retry UI for test start */}
        {startRetrying && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-md-surface-container-high p-7 rounded-2xl shadow-lg max-w-md w-full">
              <div className="text-center mb-4">
                <div className="bg-md-tertiary-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-md-on-tertiary-container" />
                </div>
                <h2 className="text-xl font-medium text-md-on-surface mb-3">
                  Unable to Start Test
                </h2>
                <p className="text-md-on-surface-variant mb-5">
                  We're having trouble connecting to the server. Your
                  verification was successful, but we couldn't load the test
                  questions.
                </p>
                <button
                  onClick={async () => {
                    try {
                      setStartRetrying(false);
                      const processedQuestions = await startTestAPI();

                      // Only do the essential setup after successful API call
                      setTest((prev) => ({
                        ...prev,
                        questions: processedQuestions,
                      }));

                      // Initialize empty answers array
                      const initialAnswers = {};
                      processedQuestions.forEach((q, index) => {
                        initialAnswers[index] = null;
                      });
                      setUserAnswers(initialAnswers);

                      // Start the test after getting questions
                      setShowVerification(false);
                      setTestStarted(true);
                      requestFullscreen();
                      startTimer(test.duration * 60);
                      startVideoMonitoring(referenceImage);
                      startAudioMonitoring();
                    } catch (err) {
                      setError("Failed to start test: " + err.message);
                      setStartRetrying(true);
                    }
                  }}
                  className="w-full py-3 bg-md-primary text-md-on-primary rounded-full flex items-center justify-center gap-2 font-medium"
                >
                  <RefreshCw className="w-5 h-5" /> Retry Connection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit confirmation modal */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-md-surface-container-high p-7 rounded-2xl shadow-lg max-w-md w-full"
          >
            <h3 className="text-xl font-medium text-md-on-surface mb-3">
              Submit Test?
            </h3>
            <p className="text-md-on-surface-variant mb-5">
              Are you sure you want to submit your test? Once submitted, you
              cannot make any changes.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitConfirmation(false)}
                className="px-4 py-2 text-md-on-surface-variant rounded-full hover:bg-md-surface-container"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndSubmitTest}
                className="px-5 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-all"
              >
                Yes, Submit Test
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex-1 flex p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <div className="flex flex-col gap-4 w-64">
            <QuestionNavigation
              questions={test.questions}
              currentIndex={currentQuestionIndex}
              answers={userAnswers}
              onSelect={goToQuestion}
            />

            {/* Add LiveMonitoring component below QuestionNavigation */}
            <LiveMonitoring
              videoStream={videoStream}
              audioStream={audioStream}
              warningsCount={warnings.length}
            />
          </div>
        </AnimatePresence>

        <motion.div
          key={currentQuestionIndex} // Force re-render on question change
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-md-surface-container-highest rounded-3xl shadow-sm flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6">
            {test.questions &&
              test.questions.length > 0 &&
              test.questions[currentQuestionIndex] && (
                <QuestionDisplay
                  question={test.questions[currentQuestionIndex]}
                  answer={
                    userAnswers[test.questions[currentQuestionIndex]?.index] ||
                    null
                  }
                  onAnswerChange={handleAnswerChange}
                />
              )}
          </div>

          <div className="p-4 border-t border-md-outline-variant flex justify-between items-center bg-md-surface-container-high">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2.5 rounded-full flex items-center gap-2 ${
                currentQuestionIndex === 0
                  ? "bg-md-surface-container-low cursor-not-allowed text-md-on-surface-variant/50"
                  : "bg-md-secondary-container hover:bg-md-secondary-container/80 text-md-on-secondary-container transition-colors"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <div className="text-sm text-md-on-surface-variant">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </div>

            {currentQuestionIndex === test.questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitClick}
                className="px-6 py-2.5 bg-md-tertiary text-md-on-tertiary rounded-full hover:bg-md-tertiary/90 transition-colors font-medium flex items-center gap-2"
              >
                Submit Test
                <CheckCircle2 className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextQuestion}
                className="px-6 py-2.5 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary/90 transition-colors font-medium flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

}
