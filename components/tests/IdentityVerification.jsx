import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Mic, // Assuming Mic might be used later for voice stage
  Sun,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Volume2, // Assuming Volume2 might be used later for voice stage
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import * as faceapi from "face-api.js";

// --- Configuration ---
const FACE_API_MODEL_URL = "/models"; // Ensure this path is correct relative to your public folder
const FACE_DETECTION_SCORE_THRESHOLD = 0.5;
const FACE_DETECTION_INPUT_SIZE = 224;
const FACE_DETECTION_INTERVAL_MS = 750; // Adjusted interval for potentially better performance/less CPU load
const FACE_DETECTION_DEBOUNCE_FRAMES = 3;
const SELFIE_COUNTDOWN_SECONDS = 3;
const CAMERA_START_MAX_RETRIES = 3;
const CAMERA_RETRY_DELAY_MS = 1000;
const LIGHTING_BRIGHTNESS_MIN = 50; // Adjusted threshold example
const LIGHTING_BRIGHTNESS_MAX = 200; // Adjusted threshold example
const SELFIE_JPEG_QUALITY = 0.9;

/**
 * @typedef {object} ProctoringContextValue
 * @property {boolean} hasVideoPermission - Indicates if camera permission is granted.
 * @property {boolean} hasAudioPermission - Indicates if microphone permission is granted.
 * @property {MediaStream | null} videoStream - The current video stream.
 * @property {MediaStream | null} audioStream - The current audio stream.
 * @property {(success: boolean) => void} testVoiceDetection - Function to report voice detection result (likely external).
 * @property {(element: HTMLVideoElement | null) => void} setVideoElement - Function to pass the video element to the proctoring context.
 * @property {() => Promise<void>} setupMediaStreams - Function to initialize/request media streams.
 */

/**
 * IdentityVerification Component
 * Handles multi-stage identity verification including selfie capture, lighting check,
 * and face detection. Voice check logic is partially stubbed.
 *
 * @param {object} props
 * @param {() => void} props.onComplete - Callback function when verification is fully completed.
 * @param {ProctoringContextValue} props.proctoring - Context providing media stream management and permissions.
 * @param {boolean} props.isOnline - Network status indicator.
 */
export default function IdentityVerification({
  onComplete,
  proctoring,
  isOnline, // isOnline prop seems unused in the provided snippet, consider removing if not needed
}) {
  const [stage, setStage] = useState("intro"); // intro, camera, lighting, voice, complete
  const [selfieImage, setSelfieImage] = useState(null); // Base64 image data
  const [lightingResult, setLightingResult] = useState(null); // { isGood: boolean, brightness: number, message: string } | null
  const [voiceResult, setVoiceResult] = useState(null); // null: pending, true: success, false: failed (Stubbed)
  const [isRetrying, setIsRetrying] = useState(false); // Flag for retry states
  const [countdown, setCountdown] = useState(null); // number | null for selfie countdown
  const [videoReady, setVideoReady] = useState(false); // Is the video element playing the stream?
  const [faceDetected, setFaceDetected] = useState(false); // Is a single face correctly detected?
  const [faceCheckMessage, setFaceCheckMessage] = useState(""); // User feedback message for face detection
  const [audioError, setAudioError] = useState(null); // State for audio-specific errors (Stubbed)
  const [isVoiceTestRunning, setIsVoiceTestRunning] = useState(false); // Track if voice test is active (Stubbed)
  const [transcribedText, setTranscribedText] = useState(""); // For speech recognition results (Stubbed)
  const [recognitionSupported, setRecognitionSupported] = useState(true); // Speech recognition browser support (Stubbed)
  const [cameraError, setCameraError] = useState(null); // Error message specific to camera setup
  const [cameraStartRetries, setCameraStartRetries] = useState(0); // Retry counter for camera start

  // Face API states
  const [faceApiLoaded, setFaceApiLoaded] = useState(false); // Are face-api models loaded?
  const [isModelsLoading, setIsModelsLoading] = useState(true); // Is face-api currently loading models?
  const [faceWarning, setFaceWarning] = useState(null); // null | 'no_face' | 'multiple_faces' | 'error_loading_models' | 'error_detection'
  const isDetectionRunning = useRef(false); // Prevent concurrent face detection runs
  const faceDetectionHistory = useRef([]); // Array for debouncing face detection results

  // Refs
  const videoRef = useRef(null);
  const countdownIntervalRef = useRef(null); // Ref for countdown interval ID
  const voiceTestTimeoutRef = useRef(null); // Ref for voice test timeout ID (Stubbed)
  // const canvasRef = useRef(document.createElement("canvas")); // No need for ref if created on demand
  const faceDetectionIntervalRef = useRef(null); // Ref for face detection interval ID
  const audioContextRef = useRef(null); // Ref for temporary audio context (Stubbed)
  const audioSourceNodeRef = useRef(null); // Ref for audio source node (Stubbed)
  const speechRecognitionRef = useRef(null); // Ref for speech recognition instance (Stubbed)

  // Destructure from proctoring context for clarity
  const {
    hasVideoPermission,
    hasAudioPermission, // Assuming used in voice stage
    videoStream,
    audioStream, // Assuming used in voice stage
    testVoiceDetection, // Assuming used in voice stage
    setVideoElement,
    setupMediaStreams, // Crucial for potential resets
  } = proctoring;

  // --- Effect: Load Face API Models ---
  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      // Check if faceapi is globally available (script loaded)
      if (typeof faceapi === "undefined") {
        console.error("face-api.js script not loaded.");
        if (isMounted) {
          setFaceWarning("error_loading_models");
          setIsModelsLoading(false);
          setFaceApiLoaded(false); // Explicitly set to false
        }
        return;
      }

      try {
        console.log("Loading face-api models from:", FACE_API_MODEL_URL);
        setIsModelsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URL),
          // Add other models here if needed (e.g., landmarks, expressions)
          // faceapi.nets.faceLandmark68TinyNet.loadFromUri(FACE_API_MODEL_URL),
        ]);
        if (isMounted) {
          setFaceApiLoaded(true);
          console.log("Face-api models loaded successfully.");
          setFaceWarning(null); // Clear any previous loading error
        }
      } catch (error) {
        console.error("Error loading face-api models:", error);
        if (isMounted) {
          setFaceWarning("error_loading_models");
          setFaceApiLoaded(false);
        }
      } finally {
        if (isMounted) {
          setIsModelsLoading(false);
        }
      }
    };

    loadModels();

    return () => {
      isMounted = false;
    };
  }, []); // Runs once on mount

  // --- Effect: Setup Video Stream ---
  useEffect(() => {
    let isMounted = true;
    let playAttemptTimeoutId = null;

    const cleanupVideo = () => {
      console.log("Cleaning up video effect...");
      if (playAttemptTimeoutId) clearTimeout(playAttemptTimeoutId);
      if (videoRef.current) {
        // Remove event listeners
        videoRef.current.onloadedmetadata = null;
        videoRef.current.oncanplay = null;
        // Pause and detach stream
        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
        if (videoRef.current.srcObject) {
          // Stop tracks to release camera
          videoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }
      // Stop face detection when cleaning up video/leaving camera stage
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
        console.log("Cleared face detection interval during video cleanup.");
      }
      setVideoReady(false); // Reset video ready state
      setFaceDetected(false); // Reset face detected state
      setFaceWarning(null);
      setFaceCheckMessage("");
    };

    const startVideoStreamInternal = async (retryCount) => {
      if (!isMounted || !videoRef.current || !videoStream) {
        console.log("Conditions not met for starting video stream.");
        return;
      }

      console.log(`Attempting to start video stream (Retry: ${retryCount})`);
      setCameraError(null); // Clear previous errors on new attempt

      try {
        // Assign stream if not already assigned or if it's different
        if (videoRef.current.srcObject !== videoStream) {
          console.log("Assigning new video stream to video element.");
          videoRef.current.srcObject = videoStream;
          // Inform proctoring context about the video element
          if (setVideoElement) setVideoElement(videoRef.current);
        }

        // Wait for metadata to load before playing (important for dimensions)
        if (videoRef.current.readyState < videoRef.current.HAVE_METADATA) {
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => {
              console.log("Video metadata loaded.");
              resolve();
            };
          });
        }

        // Attempt to play
        await videoRef.current.play();
        console.log("Video playing successfully.");
        if (isMounted) {
          setVideoReady(true);
          // Face detection will be started by the dedicated effect below
        }
      } catch (err) {
        console.error(
          `Error starting video (Retry ${retryCount}):`,
          err.name,
          err.message
        );
        if (!isMounted) return; // Component unmounted

        let errorMsg = `Camera error: ${err.message || "Unknown issue"}`;
        if (err.name === "NotAllowedError") {
          errorMsg = "Camera access denied. Please check browser permissions.";
        } else if (err.name === "NotReadableError") {
          errorMsg =
            "Camera is busy or unavailable. Close other apps using the camera and retry.";
        } else if (err.name === "AbortError") {
          errorMsg = "Camera setup was aborted. Please retry.";
        } else if (err.name === "NotFoundError") {
          errorMsg =
            "No camera found. Please ensure a camera is connected and enabled.";
        }
        setCameraError(errorMsg);
        setVideoReady(false); // Ensure video is marked as not ready

        // Retry logic
        if (retryCount < CAMERA_START_MAX_RETRIES) {
          console.log(`Retrying camera setup in ${CAMERA_RETRY_DELAY_MS}ms...`);
          playAttemptTimeoutId = setTimeout(() => {
            if (isMounted) {
              setCameraStartRetries(retryCount + 1); // Trigger re-run via state change
            }
          }, CAMERA_RETRY_DELAY_MS);
        } else {
          console.error("Max retries reached for camera initialization.");
          setCameraError(`${errorMsg} (Max retries reached)`);
        }
      }
    };

    if (
      stage === "camera" &&
      videoStream &&
      videoRef.current &&
      hasVideoPermission
    ) {
      console.log("Video setup effect triggered for camera stage.");
      // Start the process, using cameraStartRetries state to trigger retries
      startVideoStreamInternal(cameraStartRetries);
    } else if (stage !== "camera") {
      cleanupVideo(); // Clean up if we navigate away from the camera stage
    }

    // Cleanup function for this effect
    return () => {
      isMounted = false;
      cleanupVideo();
    };
    // Dependencies: stage, videoStream, hasVideoPermission trigger the setup.
    // cameraStartRetries triggers retries within the setup.
    // setVideoElement is a stable function from context.
  }, [
    stage,
    videoStream,
    hasVideoPermission,
    cameraStartRetries,
    setVideoElement,
  ]);

  // --- Face Detection Logic ---
  const detectFaces = useCallback(async () => {
    if (isDetectionRunning.current) {
      // console.log("Face detection already in progress, skipping.");
      return;
    }
    if (
      !faceApiLoaded ||
      faceWarning === "error_loading_models" ||
      !videoRef.current ||
      videoRef.current.paused ||
      videoRef.current.ended ||
      videoRef.current.readyState < 3 // HAVE_FUTURE_DATA or higher
    ) {
      // console.log("Conditions not met for face detection run.");
      // // If video stream is problematic, reset face state? Maybe not here.
      // setFaceWarning(null); // Avoid keeping stale warnings if video isn't ready
      // setFaceDetected(false);
      return;
    }

    isDetectionRunning.current = true;
    // console.log("Running face detection...");

    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: FACE_DETECTION_INPUT_SIZE,
          scoreThreshold: FACE_DETECTION_SCORE_THRESHOLD,
        })
      );

      const currentResult =
        detections.length === 0
          ? "no_face"
          : detections.length > 1
          ? "multiple_faces"
          : "one_face";

      // Debouncing logic
      faceDetectionHistory.current.push(currentResult);
      if (
        faceDetectionHistory.current.length > FACE_DETECTION_DEBOUNCE_FRAMES
      ) {
        faceDetectionHistory.current.shift();
      }

      // Determine stable result only if enough history is available
      if (
        faceDetectionHistory.current.length >= FACE_DETECTION_DEBOUNCE_FRAMES
      ) {
        const counts = faceDetectionHistory.current.reduce(
          (acc, result) => {
            acc[result] = (acc[result] || 0) + 1;
            return acc;
          },
          { no_face: 0, multiple_faces: 0, one_face: 0 }
        );

        // Find the most frequent result in the history
        const dominantResult = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );

        // Require a clear majority to change state
        const threshold = Math.ceil(FACE_DETECTION_DEBOUNCE_FRAMES / 2);

        if (counts[dominantResult] >= threshold) {
          if (dominantResult === "no_face") {
            if (faceWarning !== "no_face") setFaceWarning("no_face");
            if (faceDetected) setFaceDetected(false);
            setFaceCheckMessage("No face detected");
          } else if (dominantResult === "multiple_faces") {
            if (faceWarning !== "multiple_faces")
              setFaceWarning("multiple_faces");
            if (faceDetected) setFaceDetected(false);
            setFaceCheckMessage("Multiple faces detected");
          } else {
            // one_face
            if (faceWarning !== null) setFaceWarning(null);
            if (!faceDetected) setFaceDetected(true);
            setFaceCheckMessage("Face centered");
          }
        } else {
          // If no clear dominant result, maybe maintain previous state or indicate uncertainty
          // console.log("Face detection result unstable.");
          // For simplicity, we can keep the last stable state or reset
          // Let's keep the last state for now unless explicitly 'no_face' or 'multiple'
        }
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      setFaceWarning("error_detection");
      setFaceDetected(false);
      setFaceCheckMessage("Error detecting face");
    } finally {
      isDetectionRunning.current = false;
    }
  }, [faceApiLoaded, faceWarning, faceDetected]); // Dependencies for detectFaces logic

  // --- Effect: Start/Stop Face Detection ---
  // Separated effect to handle starting detection only when conditions are met
  useEffect(() => {
    let isMounted = true;
    if (
      stage === "camera" &&
      videoReady &&
      faceApiLoaded &&
      !isModelsLoading &&
      !faceDetectionIntervalRef.current // Prevent multiple intervals
    ) {
      console.log("Conditions met: Starting face detection interval.");
      // Clear previous detection history
      faceDetectionHistory.current = [];
      isDetectionRunning.current = false;

      // Start the interval
      faceDetectionIntervalRef.current = setInterval(() => {
        if (isMounted) detectFaces(); // Call detectFaces periodically
      }, FACE_DETECTION_INTERVAL_MS);
    } else if (stage !== "camera" || !videoReady || !faceApiLoaded) {
      // Stop detection if conditions are no longer met or leaving stage
      if (faceDetectionIntervalRef.current) {
        console.log(
          "Conditions no longer met: Stopping face detection interval."
        );
        clearInterval(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
      }
    }

    // Cleanup interval on component unmount or when dependencies change causing stop
    return () => {
      isMounted = false;
      if (faceDetectionIntervalRef.current) {
        console.log("Cleaning up face detection interval.");
        clearInterval(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
      }
    };
    // Dependencies that determine if detection should run
  }, [stage, videoReady, faceApiLoaded, isModelsLoading, detectFaces]); // detectFaces is memoized

  // --- Cleanup Audio Context --- (Stubbed - for voice stage)
  const closeAudioContext = useCallback(() => {
    // ... (keep existing implementation) ...
    console.log("Audio context cleanup called (if applicable).");
  }, []);

  // --- General Cleanup Effect ---
  useEffect(() => {
    // Return the cleanup function that runs on component unmount
    return () => {
      console.log(
        "IdentityVerification component unmounting. Cleaning up timers and context."
      );
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (voiceTestTimeoutRef.current) {
        // Stubbed
        clearTimeout(voiceTestTimeoutRef.current);
      }
      // Face detection interval is cleaned up in its own effect or video cleanup
      closeAudioContext(); // Stubbed

      // Ensure video resources are released if the component unmounts unexpectedly
      if (videoRef.current && videoRef.current.srcObject) {
        console.log("Unmount: Stopping video tracks.");
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [closeAudioContext]); // Include closeAudioContext dependency

  // --- Speech Recognition Check --- (Stubbed - for voice stage)
  useEffect(() => {
    // ... (keep existing implementation) ...
  }, []);

  // Add this top-level useEffect to handle auto-completion after verification
  useEffect(() => {
    // Only run when in the complete stage
    if (stage === "complete" && selfieImage) {
      // Set a timer to call onComplete with the captured selfie
      const timer = setTimeout(() => {
        if (onComplete) onComplete(selfieImage);
      }, 1500);
      
      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [stage, selfieImage, onComplete]);

  // --- Stage Navigation / Actions ---

  const handleRetryCamera = () => {
    console.log("Retrying camera initialization...");
    setCameraStartRetries(0); // Reset retry count
    setCameraError(null); // Clear existing error
    setVideoReady(false); // Reset ready state
    // Re-request streams if the proctoring context provides a way
    if (setupMediaStreams) {
      console.log("Attempting to reset media streams via setupMediaStreams...");
      setupMediaStreams().catch((err) => {
        console.error("Error resetting media streams:", err);
        setCameraError(
          "Failed to reset camera. Please check permissions or device connection."
        );
      });
    } else {
      console.warn(
        "setupMediaStreams function not available in proctoring context for camera reset."
      );
      // The main video setup effect will try again due to state changes
    }
  };

  const beginSelfieCapture = () => {
    setSelfieImage(null);
    setLightingResult(null);
    setAudioError(null); // Clear previous audio errors if any
    setIsRetrying(false);
    setCameraError(null); // Clear camera errors when entering stage
    setCameraStartRetries(0); // Reset retries when entering stage
    setFaceDetected(false); // Reset face state
    setFaceWarning(null);
    setFaceCheckMessage("");
    faceDetectionHistory.current = []; // Clear history
    setStage("camera");
  };

  const startSelfieCountdown = () => {
    // Double-check conditions - button should be disabled, but good to be safe
    if (
      !videoReady ||
      !faceDetected ||
      countdown !== null ||
      isModelsLoading ||
      !faceApiLoaded
    ) {
      console.warn("Cannot start selfie countdown, conditions not met:", {
        videoReady,
        faceDetected,
        countdown,
        isModelsLoading,
        faceApiLoaded,
      });
      setIsRetrying(true); // Show a general retry message maybe?
      setFaceCheckMessage(
        !faceDetected
          ? "Face not centered properly."
          : "Camera or models not ready."
      );
      return;
    }

    setIsRetrying(false); // Clear previous retry states
    setCountdown(SELFIE_COUNTDOWN_SECONDS);
    console.log("Starting selfie countdown...");

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === null) return null; // Should not happen, but safe check

        // Critical check: Ensure face is still detected during countdown
        if (faceWarning === "no_face" || faceWarning === "multiple_faces") {
          console.warn("Face issue during countdown:", faceWarning);
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          setCountdown(null);
          setIsRetrying(true); // Indicate an issue occurred
          setFaceCheckMessage(
            faceWarning === "no_face"
              ? "Face lost during countdown. Reposition and try again."
              : "Multiple faces detected. Ensure only you are visible."
          );
          // Keep faceDetected as false because the condition failed
          setFaceDetected(false);
          return null; // Stop countdown
        }

        // Countdown logic
        if (prevCount <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          takeSelfie(); // Capture image when countdown reaches zero
          return null; // Reset countdown state
        }
        return prevCount - 1; // Decrement countdown
      });
    }, 1000); // Update every second
  };

  const takeSelfie = async () => {
    console.log("Attempting to take selfie...");
    if (!videoRef.current || !videoReady) {
      console.error("Selfie failed: Video element or stream not ready.");
      setIsRetrying(true);
      setFaceCheckMessage("Camera error occurred. Please retry.");
      setCountdown(null); // Ensure countdown state is cleared
      // Don't change stage, let user retry camera stage
      return;
    }

    // Final check right before capture (redundant if countdown check works, but safer)
    if (faceWarning === "no_face" || faceWarning === "multiple_faces") {
      console.warn("Face issue detected at capture moment:", faceWarning);
      setIsRetrying(true);
      setFaceCheckMessage(
        faceWarning === "no_face"
          ? "No face detected at capture. Reposition and try again."
          : "Multiple faces detected. Ensure only you are visible."
      );
      setCountdown(null);
      setFaceDetected(false);
      return;
    }

    try {
      const videoElement = videoRef.current;
      const captureCanvas = document.createElement("canvas"); // Create canvas on demand

      // Use the actual video dimensions for the canvas
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      if (!width || !height) {
        throw new Error("Video dimensions are not available.");
      }

      captureCanvas.width = width;
      captureCanvas.height = height;

      const ctx = captureCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get 2D context from canvas.");
      }

      // Draw the current video frame onto the canvas
      ctx.drawImage(videoElement, 0, 0, width, height);

      // Get the image as a JPEG data URL
      const image = captureCanvas.toDataURL("image/jpeg", SELFIE_JPEG_QUALITY);
      setSelfieImage(image);
      console.log("Selfie captured successfully.");

      // --- Perform Lighting Check on the captured image ---
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let totalLuma = 0;
      const pixelCount = data.length / 4; // Each pixel has 4 values (R, G, B, A)

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard Luma calculation for perceived brightness
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuma += luma;
      }

      const avgBrightness = pixelCount > 0 ? totalLuma / pixelCount : 0;
      const isLightingGood =
        avgBrightness >= LIGHTING_BRIGHTNESS_MIN &&
        avgBrightness <= LIGHTING_BRIGHTNESS_MAX;

      console.log(
        `Lighting Check - Avg Brightness: ${avgBrightness.toFixed(
          2
        )} (Good: ${isLightingGood})`
      );

      setLightingResult({
        isGood: isLightingGood,
        brightness: avgBrightness,
        message: isLightingGood
          ? "Lighting conditions look good."
          : avgBrightness < LIGHTING_BRIGHTNESS_MIN
          ? "It looks too dark. Please find a brighter area or add more light."
          : "It looks too bright or glary. Try facing away from direct light sources.",
      });

      // Successfully captured and checked lighting, move to next stage
      setStage("lighting");
    } catch (err) {
      console.error("Error capturing or processing selfie:", err);
      setIsRetrying(true);
      setFaceCheckMessage(`Capture failed: ${err.message}. Please try again.`);
      setStage("camera"); // Stay on camera stage on error
    } finally {
      // Ensure countdown state is cleared regardless of success/failure
      setCountdown(null);
      // Stop face detection after attempting capture (success or fail)
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
        console.log("Cleared face detection interval after selfie attempt.");
      }
    }
  };

  // Handler for the lighting stage confirmation
  const proceedFromLighting = () => {
    // In a real scenario, you might block proceeding if lighting is bad,
    // or just move to the next stage (e.g., voice check)
    console.log("Proceeding from lighting stage.");
    // setStage("voice"); // Uncomment when voice stage is implemented
    setStage("complete"); // Temporary: Skip voice to complete
  };

  // Handler for retrying the selfie from the lighting stage
  const retrySelfieFromLighting = () => {
    console.log("Retrying selfie from lighting stage.");
    beginSelfieCapture(); // Go back to the start of the camera process
  };

  // --- Render Logic ---

  const renderStageContent = () => {
    switch (stage) {
      case "intro":
        return (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-md-on-surface">
              Identity Verification Setup
            </h2>
            <p className="text-md-on-surface-variant mb-6">
              We need to quickly verify your identity using your camera and
              microphone. Please ensure you are in a well-lit, quiet
              environment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <div className="flex items-center p-3 bg-md-surface-container rounded-lg">
                <Camera className="w-5 h-5 text-md-primary mr-2" />
                <span className="text-sm text-md-on-surface-variant">
                  Camera Check
                </span>
              </div>
              <div className="flex items-center p-3 bg-md-surface-container rounded-lg">
                <Sun className="w-5 h-5 text-md-primary mr-2" />
                <span className="text-sm text-md-on-surface-variant">
                  Lighting Check
                </span>
              </div>
              {/* Add Voice Check indicator if implementing */}
              {/* <div className="flex items-center p-3 bg-md-surface-container rounded-lg">
                    <Mic className="w-5 h-5 text-md-primary mr-2" />
                    <span className="text-sm text-md-on-surface-variant">Voice Check</span>
                </div> */}
            </div>
            <button
              onClick={beginSelfieCapture}
              className="px-6 py-3 bg-md-primary text-md-on-primary rounded-full transition-all shadow-sm hover:bg-md-primary/90 hover:scale-105 active:scale-95 flex items-center justify-center mx-auto gap-2"
            >
              Start Setup <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      case "camera":
        const isButtonDisabled =
          !hasVideoPermission ||
          !videoReady ||
          countdown !== null ||
          !faceDetected || // Must have a detected face to start countdown
          isModelsLoading ||
          !!cameraError; // Disable if there's an active camera error

        return (
          <div className="text-center">
            <h2 className="text-xl font-medium mb-3 text-md-on-surface">
              Take Verification Selfie
            </h2>
            <p className="text-md-on-surface-variant mb-4">
              Position your face clearly within the circle and look directly at
              the camera.
            </p>
            {/* Video Container */}
            <div className="relative mx-auto mb-6 overflow-hidden rounded-xl border-2 border-md-outline shadow-sm bg-black h-[320px] max-w-[426px]">
              {hasVideoPermission ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted // Muted is crucial for autoplay policies
                    style={{ transform: "scaleX(-1)" }} // Mirror mode typical for selfies
                  />

                  {/* Loading/Starting Overlays */}
                  {isModelsLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 text-white">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p className="text-sm">Loading AI models...</p>
                    </div>
                  )}
                  {!isModelsLoading && !videoReady && !cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 text-white">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p className="text-sm">
                        Starting camera{" "}
                        {".".repeat((cameraStartRetries % 3) + 1)}
                      </p>
                    </div>
                  )}
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 text-center p-4">
                      <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
                      <p className="text-red-300 text-sm mb-4">{cameraError}</p>
                      <button
                        onClick={handleRetryCamera}
                        className="px-4 py-2 bg-md-surface text-xs rounded text-md-on-surface flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry Camera
                      </button>
                    </div>
                  )}

                  {/* Countdown Overlay */}
                  {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                      <div className="text-white text-7xl font-bold drop-shadow-lg animate-ping">
                        {countdown}
                      </div>
                    </div>
                  )}

                  {/* Face Detection Status Icon (only when video is ready and models loaded) */}
                  {videoReady && faceApiLoaded && !isModelsLoading && (
                    <div
                      className="absolute top-2 left-2 p-1.5 bg-black bg-opacity-60 rounded-full z-10"
                      title={faceCheckMessage}
                    >
                      {faceWarning === "no_face" && (
                        <UserX className="h-5 w-5 text-yellow-400" />
                      )}
                      {faceWarning === "multiple_faces" && (
                        <UserX className="h-5 w-5 text-orange-400" />
                      )}
                      {faceWarning === "error_detection" && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {faceWarning === null &&
                        faceDetected && ( // Only show check if face is detected and no warnings
                          <UserCheck className="h-5 w-5 text-green-400" />
                        )}
                      {/* Optional: Add an icon for "detecting" or intermediate state? */}
                      {faceWarning === null && !faceDetected && (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" /> // Indicate detection is active but not successful yet
                      )}
                    </div>
                  )}

                  {/* Face Outline Guide (visible when video is ready) */}
                  {videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
                      <div
                        className={`w-52 h-52 border-2 ${
                          countdown !== null
                            ? "border-blue-400" // Color during countdown
                            : faceDetected
                            ? "border-green-400 shadow-lg shadow-green-500/30" // Color when face is OK
                            : "border-dashed border-white/50" // Default guide
                        } rounded-full transition-colors duration-300`}
                        style={{
                          boxShadow:
                            faceDetected && countdown === null
                              ? "0 0 15px 5px rgba(74, 222, 128, 0.5)"
                              : "none",
                        }} // More prominent glow
                      />
                    </div>
                  )}
                </>
              ) : (
                // No Video Permission
                <div className="h-full flex flex-col items-center justify-center bg-md-surface-container-low p-4">
                  <AlertTriangle className="w-10 h-10 text-md-error mb-3" />
                  <div className="text-md-on-surface-variant font-medium text-center">
                    Camera Access Required
                  </div>
                  <p className="text-sm text-md-on-surface-variant mt-1 text-center">
                    Please grant camera permission in your browser settings and
                    refresh the page or click retry.
                  </p>
                  <button
                    onClick={handleRetryCamera} // Retry might trigger permission prompt again
                    className="mt-4 px-4 py-2 bg-md-surface text-xs rounded text-md-on-surface flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              )}
            </div>{" "}
            {/* End Video Container */}
            {/* Status Message Area */}
            <div className="h-6 mb-4">
              {" "}
              {/* Reserve space to prevent layout jumps */}
              {videoReady && !countdown && !cameraError && (
                <p
                  className={`text-sm font-medium transition-colors duration-200 ${
                    faceDetected ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {isModelsLoading
                    ? "Initializing..."
                    : faceCheckMessage || "Position face in circle"}
                </p>
              )}
              {isRetrying && ( // General retry message if countdown failed etc.
                <p className="text-sm text-md-error">
                  {faceCheckMessage ||
                    "An issue occurred. Please adjust and try again."}
                </p>
              )}
            </div>
            {/* Action Button */}
            <button
              onClick={startSelfieCountdown}
              disabled={isButtonDisabled}
              className={`px-6 py-3 w-48 text-center bg-md-primary text-md-on-primary rounded-full transition-all shadow-sm flex items-center justify-center mx-auto ${
                isButtonDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-md-primary/90 hover:scale-105 active:scale-95"
              }`}
            >
              {isModelsLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                </>
              ) : !hasVideoPermission ? (
                "Permission Needed"
              ) : cameraError ? (
                "Camera Error"
              ) : !videoReady ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Starting...
                </>
              ) : countdown !== null ? (
                `Capturing...`
              ) : !faceDetected ? (
                "Center Your Face"
              ) : (
                "Take Photo"
              )}
            </button>
          </div>
        );

      case "lighting":
        return (
          <div className="text-center">
            <h2 className="text-xl font-medium mb-3 text-md-on-surface">
              Lighting Check
            </h2>
            <img
              src={selfieImage}
              alt="Verification Selfie"
              className="rounded-lg shadow-md mx-auto mb-4 w-auto max-h-60 border border-md-outline"
            />
            {lightingResult ? (
              <>
                <div
                  className={`flex items-center justify-center p-3 rounded-lg mb-4 ${
                    lightingResult.isGood ? "bg-green-100" : "bg-amber-100"
                  }`}
                >
                  {lightingResult.isGood ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 mr-2" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      lightingResult.isGood
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {lightingResult.message}
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={retrySelfieFromLighting}
                    className="px-5 py-2 bg-md-surface-container text-md-on-surface rounded-full border border-md-outline flex items-center justify-center gap-2 hover:bg-md-surface-container-low"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake Photo
                  </button>
                  <button
                    onClick={proceedFromLighting}
                    // Optionally disable if lighting is bad: disabled={!lightingResult.isGood}
                    className={`px-5 py-2 bg-md-primary text-md-on-primary rounded-full flex items-center justify-center gap-2 shadow-sm hover:bg-md-primary/90 active:scale-95 ${
                      !lightingResult.isGood ? "opacity-70" : ""
                    }`} // Indicate less ideal but allow proceeding
                  >
                    {lightingResult.isGood ? "Continue" : "Continue Anyway"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {!lightingResult.isGood && (
                  <p className="text-xs text-md-on-surface-variant mt-3">
                    Proceeding with poor lighting may affect verification
                    accuracy.
                  </p>
                )}
              </>
            ) : (
              // Should not happen if logic is correct, but show loading state
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-md-primary animate-spin mr-2" />
                <span className="text-md-on-surface-variant">
                  Analyzing lighting...
                </span>
              </div>
            )}
          </div>
        );

      //   case "voice":
      //     // --- Implement Voice Test UI Here ---
      //     return (
      //       <div>
      //         <h2 className="text-xl font-medium mb-3 text-md-on-surface">Voice Check</h2>
      //         {/* Add instructions, record button, status indicators, error messages */}
      //         <p className="text-md-on-surface-variant mb-4">
      //             Please say the phrase displayed clearly into your microphone.
      //         </p>
      //         {/* ... button to start recording ... */}
      //         {/* ... display status (listening, processing, success, fail) ... */}
      //         {/* ... button to proceed or retry ... */}
      //         <button onClick={() => setStage('complete')} className="...">Complete Setup</button> {/* Placeholder */}
      //       </div>
      //     );

      case "complete":
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-3 text-md-on-surface">
              Verification Complete
            </h2>
            <p className="text-md-on-surface-variant mb-6">
              All checks passed successfully. Starting your test...
            </p>
            <div className="flex items-center justify-center gap-2 text-md-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Starting test</span>
            </div>
            {/* The useEffect at the component level will handle the completion */}
          </div>
        );

      default:
        return <div>Unknown stage: {stage}</div>;
    }
  };

  // --- Main Render ---
  return (
    <motion.div
      key={stage} // Animate when stage changes
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-md-surface-container-high rounded-3xl p-6 md:p-8 shadow-lg backdrop-blur-sm max-w-2xl w-full mx-auto my-4 border border-md-outline/20" // Adjusted max-width and added subtle border
    >
      {renderStageContent()}
    </motion.div>
  );
}
