"use client";
import React, { useState, useEffect } from "react";
import useStore from "../store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const { userdata, setUserdata, userType, setuserType } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elementPositions, setElementPositions] = useState([]);
  const [isExiting, setIsExiting] = useState(false); // State for exit animation
  const [targetRoute, setTargetRoute] = useState(null); // State for navigation target

  // Function to handle navigation with exit animation
  const handleNavigation = (path) => {
    setTargetRoute(path);
    setIsExiting(true);
  };

  // Effect to perform navigation after exit animation
  useEffect(() => {
    if (isExiting && targetRoute) {
      const timer = setTimeout(() => {
        router.push(targetRoute);
      }, 500); // Match exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isExiting, targetRoute, router]);

  // Token refresh function
  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include", // Important for cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      // Store the new access token
      localStorage.setItem("authToken", data.accessToken);
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    // Clear all auth data
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!res.ok) {
      console.error("Logout failed:", res.statusText);
      return;
    }
    localStorage.removeItem("authToken");
    setUserdata(null);
    setuserType(null);

    // Trigger exit animation and redirect
    handleNavigation("/auth/login");
  };

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        // Try to refresh the token if the API call fails
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the original request with the new token
          const retryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              credentials: "include",
            }
          );

          if (!retryResponse.ok) {
            throw new Error("Failed to fetch profile data after token refresh");
          }

          const data = await retryResponse.json();
          setUserdata(data.user);
          setuserType(data.userType);

          // Route based on user type
          if (data.userType === "candidate") {
            handleNavigation("/candidate/home"); // Uncomment when candidate route is ready
          } else if (data.userType === "hr") {
            handleNavigation("/orgs/hr/dashboard");
          } else if (data.userType === "hrManager") {
            handleNavigation("/orgs/hrm/dashboard");
          }
          return;
        } else {
          throw new Error("Session expired. Please login again.");
        }
      }

      const data = await response.json();
      setUserdata(data.user);
      setuserType(data.userType);
      console.log("User data:", data.user, "User type:", data.userType);

      // Route based on user type
      if (data.userType === "candidate") {
        handleNavigation("/candidate/home"); // Uncomment when candidate route is ready
      } else if (data.userType === "hr") {
        handleNavigation("/orgs/hr/dashboard");
      } else if (data.userType == "hrManager") {
        console.log("HR Manager detected, navigating to HRM dashboard.");

        handleNavigation("/orgs/hrm/dashboard");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Something went wrong. Please try again.");

      // If token refresh failed, redirect to login
      if (err.message === "Session expired. Please login again.") {
        // Clear auth data
        localStorage.removeItem("authToken");
        // No need for setTimeout here, error message is shown
        // The user can click Logout which triggers handleNavigation
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userdata || !userType) {
      fetchUserProfile();
    } else {
      // If we already have the data, route accordingly
      if (userType === "candidate") {
        handleNavigation("/candidate/home"); // Uncomment when candidate route is ready
      } else if (userType === "hr") {
        handleNavigation("/orgs/hr/dashboard");
      } else if (userType === "hrManager") {
        handleNavigation("/orgs/hrm/dashboard");
      } else {
        // Fallback if userType is somehow invalid but data exists
        setLoading(false); // Ensure loading stops
        setError("Invalid user type detected.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userdata, userType]); // Keep dependencies minimal for initial load logic

  // Floating SVG elements configurations
  const floatingElements = [
    { icon: "👨‍💼", delay: 0, duration: 20, x: [-20, 20], y: [-15, 15] },
    { icon: "👩‍💻", delay: 1.5, duration: 18, x: [10, -10], y: [10, -10] },
    { icon: "📝", delay: 0.8, duration: 15, x: [-10, 10], y: [5, -5] },
    { icon: "🔍", delay: 2, duration: 19, x: [15, -15], y: [-10, 10] },
    { icon: "💼", delay: 1.2, duration: 17, x: [5, -5], y: [-20, 20] },
    { icon: "📊", delay: 0.5, duration: 22, x: [20, -20], y: [15, -15] },
  ];

  // Generate positions on client-side only
  useEffect(() => {
    const positions = floatingElements.map(() => ({
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
    }));
    setElementPositions(positions);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-md-background p-4 relative overflow-hidden">
      {/* Background floating elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl sm:text-5xl opacity-10 select-none pointer-events-none"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: element.x,
            y: element.y,
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: element.duration,
              ease: "easeInOut",
              delay: element.delay,
            },
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: element.duration * 1.2,
              ease: "easeInOut",
              delay: element.delay,
            },
          }}
          style={
            elementPositions[index]
              ? {
                  top: `${elementPositions[index].top}%`,
                  left: `${elementPositions[index].left}%`,
                }
              : { visibility: "hidden" }
          }
        >
          {element.icon}
        </motion.div>
      ))}

      {/* AnimatePresence for the main content exit */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            key="main-content"
            className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }} // Changed: Zoom in effect
            transition={{ duration: 0.4, ease: "easeInOut" }} // Kept the faster duration
          >
            {/* Logo with entry animation */}
            <motion.div
              className="w-32 h-32 mb-6 rounded-3xl bg-md-primary-container flex items-center justify-center text-md-on-primary-container"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="h-24 w-24 rounded-2xl bg-md-primary flex items-center justify-center relative overflow-hidden group">
                <span className="text-md-on-primary text-7xl font-bold relative z-10">
                  A
                </span>
                <div className="absolute inset-0 bg-gradient-to-tr from-md-primary via-md-primary to-md-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>

            {/* Title with entry animation */}
            <motion.h1
              className="text-3xl font-bold mb-2 text-md-on-background"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Welcome to Aptinova
            </motion.h1>

            {/* Description with entry animation */}
            <motion.p
              className="text-md-on-surface-variant mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Your comprehensive talent acquisition platform
            </motion.p>

            {/* AnimatePresence for loading/error states */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  {/* Android-style loading animation */}
                  <div className="mb-6">
                    <div className="relative w-16 h-16">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-md-primary"
                          initial={{
                            opacity: 0.1,
                          }}
                          animate={{
                            opacity: [0.1, 1, 0.1],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `rotate(${
                              i * 30
                            }deg) translateY(-8px) translateX(-50%)`,
                            transformOrigin: "0 8px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-md-on-surface-variant text-lg">
                    Getting things ready for you...
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center bg-md-surface p-6 rounded-xl shadow-lg"
                >
                  <div className="mb-4 text-6xl text-md-error">
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{
                        scale: 1,
                        rotate: [0, -10, 0, 10, 0],
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        rotate: {
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        },
                      }}
                    >
                      ⚠️
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-md-error mb-6 text-center font-medium text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {error}
                  </motion.p>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Reset state before retrying
                        setError(null);
                        setLoading(true);
                        setIsExiting(false); // Ensure not exiting if retrying
                        fetchUserProfile();
                      }}
                      className="px-6 py-3 bg-md-primary text-md-on-primary rounded-full shadow-md hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">🔄</span> Try Again
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout} // Already uses handleNavigation
                      className="px-6 py-3 bg-md-error text-md-on-error rounded-full shadow-md hover:bg-md-error-container hover:text-md-on-error-container transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">🚪</span> Logout
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="absolute bottom-4 text-sm text-md-on-surface-variant text-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} AptInova. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Page;
