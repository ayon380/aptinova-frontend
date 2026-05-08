"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Validator = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Token refresh function
  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.accessToken);
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  const validateAuth = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        // Try to refresh the token
        const refreshed = await refreshToken();
        if (refreshed) {
          // Try again with new token
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
            throw new Error("Authorization failed");
          }

          // Check path against user type from response
          const userData = await retryResponse.json();
          const userType = userData.userType;
          validateUserPath(userType);

          // Success after refresh
          setShowOverlay(false);
        } else {
          throw new Error("Session expired. Please login again.");
        }
      } else {
        // Initial request was successful
        const userData = await response.json();
        const userType = userData.userType;
        validateUserPath(userType);

        setShowOverlay(false);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Validate if user is on the correct path based on their user type
  const validateUserPath = (userType) => {
    const currentPath = pathname || "";
    let correctBasePath = "";
    let redirectPath = "";

    // Determine correct base path for user type
    if (userType === "hrManager") {
      correctBasePath = "/orgs/hrm";
      redirectPath = `${correctBasePath}/dashboard`;
    } else if (userType === "hr") {
      correctBasePath = "/orgs/hr";
      redirectPath = `${correctBasePath}/dashboard`;
    } else if (userType === "candidate") {
      correctBasePath = "/candidate";
      redirectPath = `${correctBasePath}/home`;
    }

    // Check if current path starts with the correct base path
    if (correctBasePath && !currentPath.startsWith(correctBasePath)) {
      // If on wrong path, redirect to the correct path
      console.log(
        `User type ${userType} should be at ${correctBasePath}, redirecting to ${redirectPath}...`
      );
      router.push(redirectPath);
    }
  };

  useEffect(() => {
    validateAuth();
  }, []);

  const handleRedirectToLogin = () => {
    router.push("/auth/login");
  };

  if (!showOverlay || loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-md-primary/20 to-transparent blur-3xl"
          animate={{
            x: ["-30%", "10%", "-30%"],
            y: ["-30%", "5%", "-30%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "20%", left: "30%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-md-secondary/20 to-transparent blur-3xl"
          animate={{
            x: ["40%", "0%", "40%"],
            y: ["10%", "30%", "10%"],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "20%", right: "20%" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-md-surface elevation-3 p-8 rounded-[28px] max-w-md w-full mx-4"
          >
            <div className="flex flex-col items-center text-center p-4">
              <motion.div
                className="w-20 h-20 mb-6 rounded-full bg-md-error-container flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(var(--md-error-rgb), 0)",
                    "0 0 24px rgba(var(--md-error-rgb), 0.25)",
                    "0 0 0 rgba(var(--md-error-rgb), 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="text-4xl text-md-on-error-container"
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: 1,
                    rotate: [0, -5, 0, 5, 0],
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    rotate: {
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 1,
                    },
                  }}
                >
                  ⚠️
                </motion.div>
              </motion.div>

              <h2 className="text-md-on-surface text-2xl font-bold mb-3 tracking-tight">
                Unauthorized Access
              </h2>
              <p className="text-md-error mb-8 text-center">{error}</p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRedirectToLogin}
                className="px-8 py-3.5 bg-md-primary text-md-on-primary rounded-full elevation-1 hover:elevation-2 transition-all duration-300 font-medium"
              >
                Go to Login
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1 }}
                className="mt-6 text-sm text-md-on-surface-variant"
              >
                If you believe this is an error, please contact support.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Validator;
