// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-md-background">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-3xl h-16 w-16 border-t-4 border-b-4 border-md-primary mb-4"></div>
            <h2 className="text-xl font-semibold text-md-on-surface">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const message = searchParams.get("message");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      if (!token) {
        setError(message || " Token not found");
        return;
      }

      try {
        // Store the token
        localStorage.setItem("authToken", token);

        // Verify the token by fetching user data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid authentication token");
        }

        // Token is valid, redirect to dashboard
        router.push("/home");
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("authToken");
      }
    };

    handleCallback();
  }, [token, router, message]);

  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center bg-md-background">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 bg-md-surface-container rounded-3xl shadow-lg"
        >
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-3xl bg-md-error-container flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-md-on-error-container"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-md-on-surface">
              Authentication Error
            </h1>
          </div>
          <p className="text-md-on-surface-variant mb-8 text-lg">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/auth/login")}
            className="w-full bg-md-primary text-md-on-primary py-3 px-4 rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200 font-medium text-lg"
          >
            Return to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex items-center justify-center bg-md-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="relative h-20 w-20 mb-6">
          <div className="absolute top-0 left-0 h-full w-full rounded-3xl border-4 border-md-primary-container"></div>
          <motion.div
            className="absolute top-0 left-0 h-full w-full rounded-3xl border-4 border-t-md-primary border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </div>
        <h2 className="text-2xl font-semibold text-md-on-surface mb-2">
          Completing authentication
        </h2>
        <p className="text-md-on-surface-variant">
          Please wait while we verify your credentials
        </p>
      </motion.div>
    </div>
  );
}
