"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import TestHeader from "@/components/tests/TestHeader";
import QuestionNavigation from "@/components/tests/QuestionNavigation";
import QuestionDisplay from "@/components/tests/QuestionDisplay";
import ProctoringWarning from "@/components/tests/ProctoringWarning";
import OfflineWarning from "@/components/tests/OfflineWarning";
import useProctoring from "@/hooks/useProctoring";
import useTestTimer from "@/hooks/useTestTimer";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/common/ThemeToggle";
export default function TestPage() {
  const { testid } = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const { theme } = useTheme();

  // Proctoring hooks
  const { warnings, isFullscreen, requestFullscreen } = useProctoring();
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
        // const data = await response.json();
        const data = {
          metadata: {
            title: "Comprehensive Knowledge and Programming Test",
            description:
              "This test evaluates general knowledge, programming skills, and conceptual understanding of various topics.",
            durationMinutes: 90,
            totalMarks: 100,
            createdBy: "Test Administrator",
            lastUpdated: "2024-09-07",
            passingScore: 50,
            randomOrder: true,
          },
          questions: [
            {
              id: "q1",
              number: 1,
              type: "multiple-choice",
              text: "What is the capital of France?",
              options: [
                { label: "A", value: "Berlin" },
                { label: "B", value: "Madrid" },
                { label: "C", value: "Paris" },
                { label: "D", value: "Rome" },
              ],
              correctAnswer: "C",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q2",
              number: 2,
              type: "multiple-choice",
              text: "Which planet is known as the Red Planet?",
              options: [
                { label: "A", value: "Earth" },
                { label: "B", value: "Mars" },
                { label: "C", value: "Jupiter" },
                { label: "D", value: "Saturn" },
              ],
              correctAnswer: "B",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q3",
              number: 3,
              type: "multiple-choice",
              text: "What is the largest ocean on Earth?",
              options: [
                { label: "A", value: "Atlantic Ocean" },
                { label: "B", value: "Indian Ocean" },
                { label: "C", value: "Arctic Ocean" },
                { label: "D", value: "Pacific Ocean" },
              ],
              correctAnswer: "D",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q4",
              number: 4,
              type: "multiple-choice",
              text: "Who wrote 'To Kill a Mockingbird'?",
              options: [
                { label: "A", value: "Harper Lee" },
                { label: "B", value: "Mark Twain" },
                { label: "C", value: "Ernest Hemingway" },
                { label: "D", value: "F. Scott Fitzgerald" },
              ],
              correctAnswer: "A",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q5",
              number: 5,
              type: "multiple-choice",
              text: "What is the chemical symbol for water?",
              options: [
                { label: "A", value: "H2O" },
                { label: "B", value: "O2" },
                { label: "C", value: "CO2" },
                { label: "D", value: "NaCl" },
              ],
              correctAnswer: "A",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q6",
              number: 6,
              type: "multiple-choice",
              text: "Which element has the atomic number 1?",
              options: [
                { label: "A", value: "Helium" },
                { label: "B", value: "Hydrogen" },
                { label: "C", value: "Oxygen" },
                { label: "D", value: "Carbon" },
              ],
              correctAnswer: "B",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q7",
              number: 7,
              type: "multiple-choice",
              text: "What is the speed of light?",
              options: [
                { label: "A", value: "300,000 km/s" },
                { label: "B", value: "150,000 km/s" },
                { label: "C", value: "450,000 km/s" },
                { label: "D", value: "600,000 km/s" },
              ],
              correctAnswer: "A",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q8",
              number: 8,
              type: "multiple-choice",
              text: "Who painted the Mona Lisa?",
              options: [
                { label: "A", value: "Vincent van Gogh" },
                { label: "B", value: "Pablo Picasso" },
                { label: "C", value: "Leonardo da Vinci" },
                { label: "D", value: "Claude Monet" },
              ],
              correctAnswer: "C",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q9",
              number: 9,
              type: "multiple-choice",
              text: "What is the smallest unit of life?",
              options: [
                { label: "A", value: "Atom" },
                { label: "B", value: "Molecule" },
                { label: "C", value: "Cell" },
                { label: "D", value: "Organ" },
              ],
              correctAnswer: "C",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q10",
              number: 10,
              type: "multiple-choice",
              text: "What is the hardest natural substance on Earth?",
              options: [
                { label: "A", value: "Gold" },
                { label: "B", value: "Iron" },
                { label: "C", value: "Diamond" },
                { label: "D", value: "Platinum" },
              ],
              correctAnswer: "C",
              marks: 2,
              negativeMarks: 0.5,
              required: true,
            },
            {
              id: "q11",
              number: 11,
              type: "code",
              text: "Write a function in JavaScript that reverses a string.",
              code: "function reverseString(str) {\n  // Your code here\n}",
              testCases: [
                { input: "hello", expectedOutput: "olleh", marks: 1 },
                { input: "world", expectedOutput: "dlrow", marks: 1 },
                { input: "JavaScript", expectedOutput: "tpircSavaJ", marks: 2 },
              ],
              constraints: {
                timeoutMs: 1000,
                memoryLimitMb: 50,
              },
              marks: 4,
              required: true,
            },
            {
              id: "q12",
              number: 12,
              type: "code",
              text: "Write a Python function that returns the factorial of a number.",
              code: "def factorial(n):\n  // Your code here",
              testCases: [
                { input: 5, expectedOutput: 120, marks: 1 },
                { input: 0, expectedOutput: 1, marks: 1 },
                { input: 3, expectedOutput: 6, marks: 2 },
              ],
              constraints: {
                timeoutMs: 1000,
                memoryLimitMb: 50,
              },
              marks: 4,
              required: true,
            },
            {
              id: "q13",
              number: 13,
              type: "text",
              text: "Explain the concept of polymorphism in object-oriented programming.",
              correctAnswer:
                "Polymorphism is the ability of an object to take on many forms. It allows methods to do different things based on the object it is acting upon.",
              marks: 5,
              negativeMarks: 0,
              required: true,
              evaluationCriteria: {
                clarity: 2,
                accuracy: 2,
                examples: 1,
              },
            },
            {
              id: "q14",
              number: 14,
              type: "text",
              text: "Describe the process of normalization in database design.",
              correctAnswer:
                "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller tables and defining relationships between them.",
              marks: 5,
              negativeMarks: 0,
              required: true,
              evaluationCriteria: {
                clarity: 2,
                accuracy: 2,
                examples: 1,
              },
            },
          ],
        };

        // Process the test format to match our application's expectation
        const processedTest = {
          ...data,
          testName: data.metadata?.title || data.testName,
          description: data.metadata?.description || data.description,
          duration: data.metadata?.durationMinutes || data.duration,
          passingScore: data.metadata?.passingScore || data.passingScore,
          questions: data.questions.map((q) => ({
            ...q,
            options:
              Array.isArray(q.options) && q.options[0]?.label
                ? q.options.map((opt) => opt.value)
                : q.options,
          })),
        };

        setTest(processedTest);
        // Initialize empty answers object
        const initialAnswers = {};
        processedTest.questions.forEach((q) => {
          initialAnswers[q.id] = null;
        });
        setUserAnswers(initialAnswers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testid]);

  // Start the test
  const handleStartTest = async () => {
    try {
      //   const response = await fetch(`/api/tests/${testid}/start`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //   });
      //   if (!response.ok) throw new Error("Failed to start test");
      setTestStarted(true);
      requestFullscreen();
      startTimer(test.duration * 60); // Convert minutes to seconds
    } catch (err) {
      setError("Failed to start test: " + err.message);
    }
  };

  // Submit the test
  const handleSubmitTest = async () => {
    try {
      // End the test first
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Format answers before submission
      const formattedAnswers = {};
      Object.entries(userAnswers).forEach(([id, answer]) => {
        const question = test.questions.find((q) => q.id === id);
        if (question?.type === "multiple-choice") {
          // Find the label for the selected value
          const option = question.options.find(
            (opt) => opt.value === answer || opt === answer
          );
          formattedAnswers[id] = option?.label || answer;
        } else {
          formattedAnswers[id] = answer;
        }
      });

      // Submit answers
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ answers: formattedAnswers }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit test");

      // Navigate to results or completion page
      router.push(`/tests/complete?testid=${testid}`);
    } catch (err) {
      setError("Failed to submit test: " + err.message);
    }
  };

  // Update answers when user responds to a question
  const handleAnswerChange = useCallback((questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
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
      <div className="h-dvh flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">
            Loading your test...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show test start screen
  if (!testStarted) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-2xl p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>

          {!isOnline && (
            <div className="mb-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 px-4 py-3 rounded">
              <div className="flex">
                <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You are currently offline. Internet connection is required
                    to take the test.
                  </p>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {test.testName}
          </h1>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Test Instructions:
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>This test contains {test.questions.length} questions.</li>
              <li>You have {test.duration} minutes to complete the test.</li>
              <li>The test will auto-submit when the timer runs out.</li>
              <li>Switching tabs or exiting fullscreen will be flagged.</li>
              <li>You cannot copy or paste during the test.</li>
              <li>Required passing score: {test.passingScore}%</li>
              {test.metadata?.totalMarks && (
                <li>Total marks: {test.metadata.totalMarks}</li>
              )}
              {test.metadata?.randomOrder && (
                <li>Questions are presented in random order.</li>
              )}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Description:
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {test.description}
            </p>
            {test.metadata?.createdBy && (
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Created by: {test.metadata.createdBy}
              </p>
            )}
            {test.metadata?.lastUpdated && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Last updated:{" "}
                {new Date(test.metadata.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={handleStartTest}
            disabled={!isOnline}
            className={`w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
              !isOnline ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Start Test
          </button>
          {!isOnline && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2 text-center">
              You need to be online to start the test
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show actual test UI
  return (
    <div className="h-dvh flex flex-col bg-gray-50 dark:bg-gray-900">
      <TestHeader
        testName={test.testName}
        timeLeft={timeFormatted}
        questionsCount={test.questions.length}
        currentQuestion={currentQuestionIndex + 1}
      />

      {warnings.length > 0 && <ProctoringWarning warnings={warnings} />}

      {/* Show offline notice if user goes offline during test */}
      {!isOnline && (
        <OfflineWarning
          offlineTime={offlineTime}
          timeExceeded={offlineTimeExceeded}
        />
      )}

      <div className="flex-1 flex p-4 gap-4">
        <QuestionNavigation
          questions={test.questions}
          currentIndex={currentQuestionIndex}
          answers={userAnswers}
          onSelect={goToQuestion}
        />

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <QuestionDisplay
            question={test.questions[currentQuestionIndex]}
            answer={userAnswers[test.questions[currentQuestionIndex].id]}
            onAnswerChange={handleAnswerChange}
          />

          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              }`}
            >
              Previous
            </button>

            {currentQuestionIndex === test.questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
