import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
export default function useProctoring() {
  const [warnings, setWarnings] = useState([]);
  const [warningCount, setWarningCount] = useState(0);
  const [shouldTerminateTest, setShouldTerminateTest] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [hasVideoPermission, setHasVideoPermission] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [speakingDetected, setSpeakingDetected] = useState(false);
  const audioContext = useRef(null);
  const audioAnalyser = useRef(null);
  const dataArray = useRef(null);
  const videoRef = useRef(null);
  const audioCheckInterval = useRef(null);
  const videoCheckInterval = useRef(null);
  const params = useParams();
  const { testid } = params; // Extract test ID from URL parameters
  // Add a new warning
  const addWarning = (message) => {
    const warning = {
      message,
      timestamp: new Date(),
    };
    setWarnings((prev) => [...prev, warning]);

    // Optional: Send warning to server for logging
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/${testid}/warning`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(warning),
        }
      )
      .then(response => response.json())
      .then(data => {
        setWarningCount(data.warningCount);
        
        // Check if we should terminate the test
        if (data.shouldExit) {
          setShouldTerminateTest(true);
        }
      })
      .catch(error => {
        console.error("Failed to record warning:", error);
      });
    } catch (error) {
      console.error("Failed to log warning:", error);
    }
  };

  // Reset termination state (used when handling termination cleanup)
  const resetTerminationState = () => {
    setShouldTerminateTest(false);
  };

  // Request fullscreen mode
  const requestFullscreen = () => {
    try {
      let fullscreenPromise;

      if (document.documentElement.requestFullscreen) {
        fullscreenPromise = document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        /* Firefox */
        fullscreenPromise = document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        fullscreenPromise = document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        /* IE/Edge */
        fullscreenPromise = document.documentElement.msRequestFullscreen();
      }

      // Modern browsers return a promise from requestFullscreen
      if (fullscreenPromise) {
        return fullscreenPromise.catch((error) => {
          console.error("Fullscreen error:", error);
          if (error.name === "NotAllowedError") {
            addWarning(
              "Fullscreen denied. Please enable fullscreen permissions."
            );
          } else {
            addWarning("Could not enable fullscreen mode");
          }
        });
      }
    } catch (error) {
      console.error("Fullscreen request failed:", error);
      addWarning("Could not enable fullscreen mode");
    }
    return Promise.resolve(); // Return resolved promise for consistency
  };

  // Prevent zooming to increase text size
  const preventTextZoom = () => {
    // Reset to default zoom level
    if (window.innerWidth) {
      window.document.body.style.zoom = "100%";
      document.body.style.webkitTextSizeAdjust = "100%";
      document.body.style.textSizeAdjust = "100%";
    }

    // Monitor and prevent keyboard zoom shortcuts
    const preventZoomShortcut = (e) => {
      // Ctrl/Cmd + Plus/Minus/Zero (common zoom shortcuts)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
      ) {
        e.preventDefault();
        addWarning("Text zoom attempt detected");
        return false;
      }
    };

    // Monitor and prevent mouse wheel zoom
    const preventWheelZoom = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        addWarning("Text zoom attempt detected");
        return false;
      }
    };

    document.addEventListener("keydown", preventZoomShortcut);
    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      document.removeEventListener("keydown", preventZoomShortcut);
      document.removeEventListener("wheel", preventWheelZoom);
    };
  };

  // Setup audio and video streams
  const setupMediaStreams = async () => {
    try {
      // Request audio permission
      const audioStreamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setAudioStream(audioStreamData);
      setHasAudioPermission(true);

      // Setup audio analysis
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioAnalyser.current = audioContext.current.createAnalyser();
        const source =
          audioContext.current.createMediaStreamSource(audioStreamData);
        source.connect(audioAnalyser.current);
        audioAnalyser.current.fftSize = 256;
        const bufferLength = audioAnalyser.current.frequencyBinCount;
        dataArray.current = new Uint8Array(bufferLength);
      }

      // Request video permission
      try {
        const videoStreamData = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoStream(videoStreamData);
        setHasVideoPermission(true);
      } catch (videoError) {
        console.error("Video permission denied:", videoError);
        addWarning("Webcam access denied. Test monitoring will be limited.");
      }
    } catch (audioError) {
      console.error("Audio permission denied:", audioError);
      addWarning("Microphone access denied. Test monitoring will be limited.");
    }
  };

  // Check if mic is muted
  const checkMicrophoneMuted = () => {
    if (audioStream) {
      const audioTracks = audioStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const muted = !audioTracks[0].enabled || audioTracks[0].muted;
        if (muted) {
          addWarning("Microphone appears to be muted");
          setIsMicMuted(true);
        } else {
          setIsMicMuted(false);
        }
      }
    }
  };

  // Monitor audio levels to detect speaking
  const startAudioMonitoring = () => {
    if (audioAnalyser.current && dataArray.current) {
      // Clear any existing interval first to prevent duplicates
      if (audioCheckInterval.current) {
        clearInterval(audioCheckInterval.current);
      }

      audioCheckInterval.current = setInterval(() => {
        if (audioAnalyser.current) {
          try {
            audioAnalyser.current.getByteFrequencyData(dataArray.current);

            // Calculate average volume level with more sensitivity
            let sum = 0;
            let peakValue = 0;
            for (let i = 0; i < dataArray.current.length; i++) {
              sum += dataArray.current[i];
              peakValue = Math.max(peakValue, dataArray.current[i]);
            }
            const average = sum / dataArray.current.length;

            // Lower threshold for better detection
            const threshold = 20; // More sensitive threshold

            if (average > threshold || peakValue > 50) {
              if (!speakingDetected) {
                setSpeakingDetected(true);
                addWarning("Voice or noise detected");
                console.log(
                  "Voice detected! Avg level:",
                  average,
                  "Peak:",
                  peakValue
                );
              }
            } else {
              setSpeakingDetected(false);
            }
          } catch (err) {
            console.error("Error analyzing audio:", err);
          }
        }
      }, 500); // Check more frequently (twice per second)
    }
  };

  // Stop audio monitoring
  const stopAudioMonitoring = () => {
    if (audioCheckInterval.current) {
      clearInterval(audioCheckInterval.current);
      audioCheckInterval.current = null;
      console.log("Audio monitoring stopped");
    }
    
    // Close audio context if it exists
    if (audioContext.current && audioContext.current.state !== "closed") {
      audioContext.current.close().catch((err) => {
        console.error("Error closing audio context:", err);
      });
    }
  };

  const stopVideoMonitoring = () => {
    if (videoCheckInterval.current) {
      if (Array.isArray(videoCheckInterval.current)) {
        videoCheckInterval.current.forEach((interval) => clearInterval(interval));
      } else {
        clearInterval(videoCheckInterval.current);
      }
      videoCheckInterval.current = null;
      console.log("Video monitoring stopped");
    }
  };

  // Detect developer tools / inspect panel
  const detectDevTools = () => {
    // Method 1: Check window dimensions (devtools changes the relationship between inner and outer dimensions)
    const checkWindowSize = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        addWarning("Developer tools detected");
      }
    };

    // Method 2: Monitor keyboard shortcuts
    const preventDevToolsShortcuts = (e) => {
      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        addWarning("Developer tools shortcut detected");
        return false;
      }
      
      // Ctrl+Shift+I or Cmd+Option+I (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        addWarning("Developer tools shortcut detected");
        return false;
      }
      
      // Ctrl+Shift+J or Cmd+Option+J (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        addWarning("Developer tools shortcut detected");
        return false;
      }
      
      // Ctrl+Shift+C or Cmd+Option+C (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        addWarning("Developer tools shortcut detected");
        return false;
      }
    };

    // Set up both methods
    window.addEventListener('resize', checkWindowSize);
    document.addEventListener('keydown', preventDevToolsShortcuts);
    
    // Initial check
    checkWindowSize();

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', checkWindowSize);
      document.removeEventListener('keydown', preventDevToolsShortcuts);
    };
  };

  // Release all media streams
  const releaseMediaStreams = () => {
    // Release audio stream
    if (audioStream) {
      audioStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Audio track stopped:", track.kind);
      });
      setAudioStream(null);
      setHasAudioPermission(false);
    }
    
    // Release video stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Video track stopped:", track.kind);
      });
      setVideoStream(null);
      setHasVideoPermission(false);
    }
    
    // Clear the video element reference
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }
      videoRef.current = null;
    }
  };

  // Check if voice is audible during setup
  const testVoiceDetection = (callback, duration = 5000) => {
    let detected = false;
    let timer = null;

    // Make sure audioStream exists and is active
    if (!audioStream || !audioStream.active) {
      console.warn("Audio stream not available for voice detection");
      // Try to reinitialize audio but DON'T call callback yet - let the timer run
      setupMediaStreams()
        .then(() => {
          console.log("Reinitialized audio stream for voice test");

          // If reinitialization succeeded, setup the test with the new stream
          if (audioStream && audioStream.active) {
            setupVoiceDetection();
          }
        })
        .catch((err) => {
          console.error("Failed to reinitialize audio stream:", err);
          // Don't call back immediately, wait for timer
        });

      // Wait for the full duration instead of returning immediately
      timer = setTimeout(() => {
        console.log(
          "Voice test complete after waiting period, no stream available"
        );
        callback(false);
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }

    return setupVoiceDetection();

    // Helper function to set up the actual voice detection
    function setupVoiceDetection() {
      // Make sure audio analyzer is initialized
      if (!audioAnalyser.current || !dataArray.current) {
        try {
          // Reinitialize audio context and analyzer
          if (!audioContext.current) {
            audioContext.current = new (window.AudioContext ||
              window.webkitAudioContext)();
          }

          audioAnalyser.current = audioContext.current.createAnalyser();
          const source =
            audioContext.current.createMediaStreamSource(audioStream);
          source.connect(audioAnalyser.current);
          audioAnalyser.current.fftSize = 256;
          const bufferLength = audioAnalyser.current.frequencyBinCount;
          dataArray.current = new Uint8Array(bufferLength);

          console.log("Audio analyzer initialized for voice test");
        } catch (err) {
          console.error("Error initializing audio analyzer:", err);
          // Don't call back immediately, wait for timer
          timer = setTimeout(() => {
            callback(false);
          }, duration);

          return () => {
            clearTimeout(timer);
          };
        }
      }

      console.log("Starting voice detection check...");

      // Check for voice more frequently (every 100ms)
      const checkInterval = setInterval(() => {
        if (audioAnalyser.current) {
          try {
            audioAnalyser.current.getByteFrequencyData(dataArray.current);

            let sum = 0;
            let peakValue = 0;
            for (let i = 0; i < dataArray.current.length; i++) {
              sum += dataArray.current[i];
              peakValue = Math.max(peakValue, dataArray.current[i]);
            }
            const average = sum / dataArray.current.length;

            // Debug info
            if (peakValue > 10) {
              console.log(
                "Audio levels - Avg:",
                average.toFixed(2),
                "Peak:",
                peakValue
              );
            }

            // Lower threshold for better detection (more sensitive)
            if (average > 10 || peakValue > 30) {
              detected = true;
              console.log("Voice detected! Avg:", average, "Peak:", peakValue);
            }
          } catch (err) {
            console.error("Error in voice test:", err);
          }
        }
      }, 100);

      // Always wait for the full duration before calling back
      timer = setTimeout(() => {
        clearInterval(checkInterval);
        console.log("Voice test complete, result:", detected);
        callback(detected);
      }, duration);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timer);
      };
    }
  };

  // Capture selfie for identity verification
  const captureSelfie = () => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        console.error("No video element reference");
        reject(new Error("Video element not available"));
        return;
      }

      if (!videoStream) {
        console.error("No video stream");
        reject(new Error("Video stream not available"));
        return;
      }

      try {
        // Make sure video is ready
        if (videoRef.current.readyState < 2) {
          // HAVE_CURRENT_DATA = 2
          console.log("Video not ready yet, waiting...");
          const checkReady = () => {
            if (videoRef.current.readyState >= 2) {
              captureFrame();
            } else {
              setTimeout(checkReady, 100);
            }
          };
          checkReady();
        } else {
          captureFrame();
        }

        function captureFrame() {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth || 640;
          canvas.height = videoRef.current.videoHeight || 480;

          console.log("Canvas dimensions:", canvas.width, canvas.height);
          console.log("Video readyState:", videoRef.current.readyState);

          // Draw the current video frame to the canvas
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          // Convert to data URL
          const imageDataUrl = canvas.toDataURL("image/jpeg");
          resolve(imageDataUrl);
        }
      } catch (err) {
        console.error("Error capturing selfie:", err);
        reject(err);
      }
    });
  };

  // Check lighting conditions
  const checkLighting = () => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !videoStream) {
        reject(new Error("Video stream not available"));
        return;
      }

      try {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;

        // Draw the current video frame to the canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Analyze the lighting by getting pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calculate average brightness
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Calculate perceived brightness using the formula: (0.299 * r + 0.587 * g + 0.114 * b)
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (data.length / 4);
        const isLightingGood = avgBrightness > 40 && avgBrightness < 220;

        resolve({
          isGood: isLightingGood,
          brightness: avgBrightness,
          message: isLightingGood
            ? "Lighting conditions are good"
            : avgBrightness <= 40
            ? "Lighting is too dark"
            : "Lighting is too bright",
        });
      } catch (err) {
        console.error("Error checking lighting:", err);
        reject(err);
      }
    });
  };

  // Enhanced video monitoring with additional verification
  const startVideoMonitoring = (referenceImageUrl = null) => {
    if (videoStream && hasVideoPermission) {
      // Create video element to use for analysis
      if (!videoRef.current) {
        videoRef.current = document.createElement("video");
        videoRef.current.srcObject = videoStream;
        videoRef.current
          .play()
          .catch((e) => console.error("Error playing video:", e));
      }

      videoCheckInterval.current = setInterval(() => {
        // Here you would normally use a face detection library like tensorflow.js
        // For now, we'll just simulate the capability

        // Simulate person detection (random for demo purposes)
        const personPresent = Math.random() > 0.1; // 90% chance person is present
        const multiplePersons = Math.random() < 0.05; // 5% chance multiple people detected
        const mobileDetected = Math.random() < 0.02; // 2% chance mobile detected

        if (!personPresent) {
          addWarning("No person detected in webcam view");
        }

        if (multiplePersons) {
          addWarning("Multiple people detected in webcam view");
        }

        if (mobileDetected) {
          addWarning("Possible mobile device detected in webcam view");
        }
      }, 5000); // Check every 5 seconds
    }

    // Add this new logic to compare against the reference image
    if (referenceImageUrl && videoRef.current) {
      const referenceImage = new Image();
      referenceImage.src = referenceImageUrl;

      const compareInterval = setInterval(() => {
        if (!videoRef.current || !videoRef.current.videoWidth) return;

        try {
          // Simple simulation - in a real app, you'd use face recognition
          // libraries like face-api.js or tensorflow.js FaceDetection
          const differentPerson = Math.random() < 0.03; // 3% chance of detection

          if (differentPerson) {
            addWarning(
              "Different person detected - potential identity violation"
            );
          }
        } catch (err) {
          console.error("Error comparing faces:", err);
        }
      }, 10000); // Every 10 seconds

      // Add this interval to the cleanup
      if (!videoCheckInterval.current) {
        videoCheckInterval.current = [compareInterval];
      } else if (Array.isArray(videoCheckInterval.current)) {
        videoCheckInterval.current.push(compareInterval);
      } else {
        const originalInterval = videoCheckInterval.current;
        videoCheckInterval.current = [originalInterval, compareInterval];
      }
    }
  };

  // Set a specific video element for use in capturing and monitoring
  const setVideoElement = (element) => {
    videoRef.current = element;

    // If we have a stream, connect it to this element
    if (videoStream && element) {
      element.srcObject = videoStream;
    }
  };

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addWarning("Tab switching detected");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Track fullscreen changes and auto-restore
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen) {
        addWarning("Fullscreen mode exited");
        // Auto-restore fullscreen after a short delay
        setTimeout(() => {
          requestFullscreen();
        }, 500);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Prevent copy/paste
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      addWarning("Copy action detected");
    };

    const handlePaste = (e) => {
      e.preventDefault();
      addWarning("Paste action detected");
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCopy);
    };
  }, []);

  // Prevent right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      addWarning("Right-click detected");
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Prevent text zoom
  useEffect(() => {
    const cleanupPreventTextZoom = preventTextZoom();
    return () => {
      cleanupPreventTextZoom();
    };
  }, []);

  // // Prevent developer tools
  // useEffect(() => {
  //   const cleanupDevToolsDetection = detectDevTools();
  //   return () => {
  //     cleanupDevToolsDetection();
  //   };
  // }, []);

  // Cleanup resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
      if (audioCheckInterval.current) {
        clearInterval(audioCheckInterval.current);
      }
      if (videoCheckInterval.current) {
        if (Array.isArray(videoCheckInterval.current)) {
          videoCheckInterval.current.forEach((interval) =>
            clearInterval(interval)
          );
        } else {
          clearInterval(videoCheckInterval.current);
        }
      }
      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close().catch((err) => {
          console.error("Error closing audio context:", err);
        });
      }
    };
  }, [audioStream, videoStream]);

  return {
    warnings,
    warningCount,
    shouldTerminateTest,
    resetTerminationState,
    isFullscreen,
    requestFullscreen,
    addWarning,
    setupMediaStreams,
    checkMicrophoneMuted,
    startAudioMonitoring,
    stopAudioMonitoring,
    startVideoMonitoring,
    stopVideoMonitoring,
    releaseMediaStreams,
    hasAudioPermission,
    hasVideoPermission,
    isMicMuted,
    speakingDetected,
    testVoiceDetection,
    captureSelfie,
    checkLighting,
    setVideoElement,
    videoStream,
    audioStream,
  };
}
