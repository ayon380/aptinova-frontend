import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, UserCheck, UserX, AlertTriangle } from "lucide-react";

import * as faceapi from "face-api.js";

// --- Configuration ---
const FACE_DETECTION_INTERVAL = 1000;
const FACE_API_MODEL_URL = "/models";
const FACE_DETECTION_SCORE_THRESHOLD = 0.5;
const FACE_DETECTION_DEBOUNCE_FRAMES = 3;

// --- Helper Hook for Interval ---
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// --- Main Component ---
const LiveMonitoring = ({ videoStream }) => {
  const videoRef = useRef(null);
  const faceApiLoaded = useRef(false); // Track if face-api models are loaded
  const [faceWarning, setFaceWarning] = useState(null); // null | 'no_face' | 'multiple_faces' | 'error_loading_models' | 'error_detection'
  const [isModelsLoading, setIsModelsLoading] = useState(true); // Track model loading state
  const faceDetectionHistory = useRef([]);
  const isDetectionRunning = useRef(false);

  // --- Load Face API Models ---
  useEffect(() => {
    const loadModels = async () => {
      if (typeof faceapi === "undefined") {
        console.error(
          "face-api.js not loaded globally. Cannot perform face detection."
        );
        setFaceWarning("error_loading_models");
        setIsModelsLoading(false);
        return;
      }
      try {
        console.log("Loading face-api models from:", FACE_API_MODEL_URL);
        setIsModelsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URL),
        ]);
        faceApiLoaded.current = true;
        console.log("Face-api models loaded successfully.");
        setFaceWarning(null);
      } catch (error) {
        console.error("Error loading face-api models:", error);
        setFaceWarning("error_loading_models");
      } finally {
        setIsModelsLoading(false);
      }
    };
    loadModels();
  }, []);

  // --- Set up Video Stream ---
  useEffect(() => {
    let playAttemptTimeout;
    let isComponentMounted = true;

    const playVideo = async () => {
      if (!isComponentMounted || !videoRef.current) return;

      try {
        if (playAttemptTimeout) {
          clearTimeout(playAttemptTimeout);
        }

        if (videoRef.current.srcObject && videoRef.current.readyState >= 2) {
          console.log("Playing video stream");
          await videoRef.current.play();
        } else if (videoRef.current.srcObject) {
          playAttemptTimeout = setTimeout(playVideo, 300);
        }
      } catch (error) {
        console.error("Error playing video:", error.message);
        if (
          error.name === "AbortError" ||
          error.message.includes("interrupted")
        ) {
          console.log("Play request interrupted, retrying after delay...");
          playAttemptTimeout = setTimeout(playVideo, 500);
        }
      }
    };

    const handleVideoMetadataLoaded = () => {
      console.log("Video metadata loaded, attempting to play");
      playVideo();
    };

    if (videoStream && videoRef.current) {
      console.log("Setting up video stream");
      videoRef.current.addEventListener(
        "loadedmetadata",
        handleVideoMetadataLoaded
      );

      if (videoRef.current.srcObject !== videoStream) {
        if (videoRef.current.srcObject) {
          videoRef.current.pause();
        }
        videoRef.current.srcObject = videoStream;
      }

      if (videoRef.current.readyState >= 2) {
        playVideo();
      }
    } else {
      console.log("Video stream not available or videoRef not ready.");
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      isComponentMounted = false;
      console.log("Cleaning up video stream");

      if (playAttemptTimeout) {
        clearTimeout(playAttemptTimeout);
      }

      if (videoRef.current) {
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleVideoMetadataLoaded
        );
        videoRef.current.pause();

        if (videoRef.current.srcObject) {
          try {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.warn("Error stopping video tracks:", e);
          }
          videoRef.current.srcObject = null;
        }
      }
    };
  }, [videoStream]);

  // --- Face Detection Logic with debouncing ---
  const detectFaces = useCallback(async () => {
    if (isDetectionRunning.current) return;

    if (
      !faceApiLoaded.current ||
      !videoRef.current ||
      videoRef.current.paused ||
      videoRef.current.ended ||
      videoRef.current.readyState < 3
    ) {
      if (faceApiLoaded.current && faceWarning !== "error_loading_models") {
        if (
          faceWarning === "no_face" ||
          faceWarning === "multiple_faces" ||
          faceWarning === "error_detection"
        ) {
          setFaceWarning(null);
        }
      }
      return;
    }

    if (faceWarning === "error_loading_models") return;

    isDetectionRunning.current = true;

    try {
      let detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: FACE_DETECTION_SCORE_THRESHOLD,
        })
      );

      const currentResult =
        detections.length === 0
          ? "no_face"
          : detections.length > 1
          ? "multiple_faces"
          : "one_face";

      faceDetectionHistory.current.push(currentResult);

      if (
        faceDetectionHistory.current.length > FACE_DETECTION_DEBOUNCE_FRAMES
      ) {
        faceDetectionHistory.current.shift();
      }

      if (
        faceDetectionHistory.current.length >= FACE_DETECTION_DEBOUNCE_FRAMES
      ) {
        const counts = {
          no_face: 0,
          multiple_faces: 0,
          one_face: 0,
        };

        faceDetectionHistory.current.forEach((result) => {
          counts[result]++;
        });

        let maxCount = 0;
        let dominantResult = null;

        for (const [result, count] of Object.entries(counts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantResult = result;
          }
        }

        if (
          dominantResult &&
          maxCount > Math.floor(FACE_DETECTION_DEBOUNCE_FRAMES / 2)
        ) {
          if (dominantResult === "no_face") {
            setFaceWarning("no_face");
          } else if (dominantResult === "multiple_faces") {
            setFaceWarning("multiple_faces");
          } else {
            setFaceWarning(null);
          }
        }
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      setFaceWarning("error_detection");
    } finally {
      isDetectionRunning.current = false;
    }
  }, [faceWarning]);

  useInterval(
    detectFaces,
    faceApiLoaded.current && videoStream ? FACE_DETECTION_INTERVAL : null
  );

  // --- Render Logic ---
  return (
    <motion.div
      className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden p-2 w-full max-w-xs sm:max-w-sm border border-gray-200 dark:border-gray-700 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm font-medium">
          <Video className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          Live Monitoring
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="rounded-lg overflow-hidden bg-black aspect-video relative border border-gray-300 dark:border-gray-600">
          {isModelsLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
              <p className="text-white text-sm animate-pulse">
                Loading AI models...
              </p>
            </div>
          )}
          {videoStream ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover block"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
              <Video className="h-8 w-8 mb-1 text-gray-400 dark:text-gray-500" />
              Camera unavailable
            </div>
          )}
          {!isModelsLoading && faceApiLoaded.current && videoStream && (
            <div className="absolute top-1 left-1 p-1 bg-black bg-opacity-60 rounded z-10">
              {faceWarning === "no_face" && (
                <UserX
                  className="h-4 w-4 text-yellow-400"
                  title="No face detected"
                />
              )}
              {faceWarning === "multiple_faces" && (
                <UserX
                  className="h-4 w-4 text-yellow-400"
                  title="Multiple faces detected"
                />
              )}
              {faceWarning === null && (
                <UserCheck
                  className="h-4 w-4 text-green-400"
                  title="Single face detected"
                />
              )}
              {faceWarning === "error_detection" && (
                <AlertTriangle
                  className="h-4 w-4 text-red-500"
                  title="Face detection error"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMonitoring;
