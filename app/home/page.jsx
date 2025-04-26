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

    // Add a small animation delay before redirecting
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
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
            router.push("/candidate/home");
          } else if (data.userType === "hr") {
            router.push("/orgs/hr/dashboard");
          } else if (data.userType === "hrManager") {
            router.push("/orgs/hrm/dashboard");
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
        router.push("/candidate/home");
      } else if (data.userType === "hr") {
        router.push("/orgs/hr/dashboard");
      } else if (data.userType === "hrManager") {
        router.push("/orgs/hrm/dashboard");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Something went wrong. Please try again.");

      // If token refresh failed, redirect to login
      if (err.message === "Session expired. Please login again.") {
        // Clear auth data
        localStorage.removeItem("authToken");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
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
        router.push("/candidate/home");
      } else if (userType === "hr") {
        router.push("/orgs/hr/dashboard");
      } else if (userType === "hrManager") {
        router.push("/orgs/hrm/dashboard");
      }
    }
  }, []);

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

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo placeholder - replace with your actual logo */}
        <div className="w-32 h-32 mb-6 rounded-3xl bg-md-primary-container flex items-center justify-center text-md-on-primary-container">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-20 h-20 flex items-center justify-center text-5xl"
          >
            🚀
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-md-on-background">
          Welcome to AptInova
        </h1>

        <p className="text-md-on-surface-variant mb-8">
          Your comprehensive talent acquisition platform
        </p>

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
                  onClick={fetchUserProfile}
                  className="px-6 py-3 bg-md-primary text-md-on-primary rounded-full shadow-md hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">🔄</span> Try Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-6 py-3 bg-md-error text-md-on-error rounded-full shadow-md hover:bg-md-error-container hover:text-md-on-error-container transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">🚪</span> Logout
                </motion.button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

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
