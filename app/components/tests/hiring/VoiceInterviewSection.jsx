import { useState, useEffect, useRef } from "react";

// Import icons (assuming you're using Heroicons with Tailwind)
// If not, you can use another icon library or SVG directly
const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
      clipRule="evenodd"
    />
  </svg>
);

const MicOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
      clipRule="evenodd"
    />
  </svg>
);

const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
      clipRule="evenodd"
    />
  </svg>
);

const mockInterviewQuestions = [
  {
    id: 1,
    question: "Explain the difference between React state and props.",
    timeLimit: 120, // seconds
  },
  {
    id: 2,
    question:
      "Describe your experience with responsive design and mobile-first approaches.",
    timeLimit: 180,
  },
  {
    id: 3,
    question: "How would you optimize a website's performance?",
    timeLimit: 180,
  },
];

const VoiceInterviewSection = ({ updateTestData, testData }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [answers, setAnswers] = useState(testData.answers || {});
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // Load questions and initialize speech recognition
  useEffect(() => {
    // In a real app, fetch questions from the backend
    setQuestions(mockInterviewQuestions);

    // Initialize Speech Recognition API
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentInterimTranscript = "";
        
        // Process all results from the current session
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          // Get this result's first alternative
          const transcriptPiece = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // This is a final result, add it to our final transcript
            finalTranscriptRef.current += ' ' + transcriptPiece;
            finalTranscriptRef.current = finalTranscriptRef.current.trim();
          } else {
            // This is an interim result
            currentInterimTranscript += transcriptPiece;
          }
        }
        
        // Update the interim transcript state
        setInterimTranscript(currentInterimTranscript);
        
        // Update the combined transcript
        setTranscript(finalTranscriptRef.current + ' ' + currentInterimTranscript);
      };

      recognitionRef.current.onend = () => {
        // If we're still recording but recognition stopped, restart it
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Ignore errors when starting recognition again
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(`Speech recognition error: ${event.error}`);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          // These are not critical errors, just restart recognition
          if (isRecording && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Ignore errors when starting recognition again
            }
          }
        } else {
          // For other errors, stop the recording
          stopRecording();
        }
      };
    } else {
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
    }

    setLoading(false);

    // Cleanup function
    return () => {
      cleanupResources();
    };
  }, []);

  // Set time limit when current question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setTimeLeft(questions[currentQuestionIndex].timeLimit);

      // Load saved answer for this question if it exists
      const currentQuestionId = questions[currentQuestionIndex].id;
      if (answers[currentQuestionId]) {
        setTranscript(answers[currentQuestionId]);
        finalTranscriptRef.current = answers[currentQuestionId];
      } else {
        setTranscript("");
        finalTranscriptRef.current = "";
      }
      setInterimTranscript("");
    }
  }, [currentQuestionIndex, questions, answers]);

  // Clean up all media resources
  const cleanupResources = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping recognition
      }
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping recorder
      }
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // Ignore errors when stopping tracks
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startRecording = async () => {
    setError(null);

    try {
      // Clean up any previous resources first
      cleanupResources();

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        // In a real app, you would upload this blob to your server
        console.log("Audio recording complete, size:", audioBlob.size);
      });

      mediaRecorderRef.current.start();

      if (recognitionRef.current) {
        // Preserve existing transcript if we're resuming
        if (!transcript) {
          setTranscript("");
          setInterimTranscript("");
          finalTranscriptRef.current = "";
        }
        recognitionRef.current.start();
      }

      setIsRecording(true);

      // Start timer
      const currentQuestion = questions[currentQuestionIndex];

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            stopRecording();
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          `Microphone access denied. Please check your browser permissions and ensure microphone access is allowed.`
        );
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setError(
          `No microphone detected. Please connect a microphone and try again.`
        );
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        setError(
          `Your microphone is busy or unavailable. Please close other applications that might be using your microphone.`
        );
      } else {
        setError(
          `Error accessing microphone: ${err.message}. Please ensure your browser has permission to use the microphone.`
        );
      }
    }
  };

  const stopRecording = () => {
    // Add interim results to final transcript before stopping
    if (interimTranscript) {
      finalTranscriptRef.current = (finalTranscriptRef.current + ' ' + interimTranscript).trim();
      setTranscript(finalTranscriptRef.current);
      setInterimTranscript("");
    }
    
    // Only save transcript if we were recording
    if (isRecording && finalTranscriptRef.current) {
      const currentQuestion = questions[currentQuestionIndex];
      const newAnswers = { ...answers, [currentQuestion.id]: finalTranscriptRef.current };
      setAnswers(newAnswers);

      // Check if all questions are answered
      updateTestData({
        answers: newAnswers,
        completed: Object.keys(newAnswers).length >= questions.length,
      });
    }

    cleanupResources();
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    if (isRecording) {
      stopRecording();
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript("");
      setInterimTranscript("");
      finalTranscriptRef.current = "";
    }
  };

  const handlePreviousQuestion = () => {
    if (isRecording) {
      stopRecording();
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      
      const prevQuestionId = questions[currentQuestionIndex - 1].id;
      const prevAnswer = answers[prevQuestionId] || "";
      setTranscript(prevAnswer);
      finalTranscriptRef.current = prevAnswer;
      setInterimTranscript("");
    }
  };

  const handleTextInputChange = (e) => {
    const newValue = e.target.value;
    setTranscript(newValue);
    finalTranscriptRef.current = newValue;
    setInterimTranscript("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 rounded-md bg-blue-50 border border-blue-300 text-blue-700 mb-4">
        No interview questions are available at this time.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Voice Interview</h2>

      <p className="text-sm text-gray-600 mb-4">
        Answer the following questions by speaking into your microphone. Your
        voice will be converted to text in real-time. You may also type your
        answer if you prefer.
      </p>

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-300 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>

          <span
            className={`font-medium ${
              timeLeft < 30 ? "text-red-600" : "text-gray-600"
            }`}
          >
            Time: {formatTime(timeLeft)}
          </span>
        </div>

        <p className="text-base mb-4">{currentQuestion.question}</p>

        <div className="flex justify-center my-4">
          {!isRecording ? (
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              onClick={startRecording}
              disabled={!!error && !error.includes("Speech recognition error")}
            >
              <span className="mr-2">
                <MicIcon />
              </span>
              Start Recording
            </button>
          ) : (
            <button
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={stopRecording}
            >
              <span className="mr-2">
                <StopIcon />
              </span>
              Stop Recording
            </button>
          )}
        </div>

        <div className="mt-6 mb-6">
          <h4 className="text-base font-semibold mb-2">Your answer:</h4>

          <div
            className={`border rounded-md p-4 min-h-[150px] transition-colors duration-300 ${
              isRecording ? "bg-red-50" : "bg-white"
            }`}
          >
            <textarea
              className="w-full min-h-[150px] focus:outline-none resize-none bg-transparent"
              value={transcript}
              onChange={handleTextInputChange}
              disabled={isRecording}
              placeholder={
                isRecording
                  ? "Speaking..."
                  : "Your answer will appear here when you speak. You may also type directly."
              }
            />
            {isRecording && interimTranscript && (
              <div className="text-gray-500 italic text-sm mt-2">
                Hearing: {interimTranscript}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className={`px-4 py-2 border border-gray-300 rounded-md font-medium text-sm ${
              currentQuestionIndex === 0 || isRecording
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || isRecording}
          >
            Previous Question
          </button>
          <button
            className={`px-4 py-2 border border-gray-300 rounded-md font-medium text-sm ${
              currentQuestionIndex === questions.length - 1 || isRecording
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={handleNextQuestion}
            disabled={
              currentQuestionIndex === questions.length - 1 || isRecording
            }
          >
            Next Question
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          {Object.keys(answers).length} of {questions.length} questions answered
        </p>
      </div>
    </div>
  );
};

export default VoiceInterviewSection;
