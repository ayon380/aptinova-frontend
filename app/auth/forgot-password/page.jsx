"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    userType: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Password reset link has been sent to your email",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to process request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen text-xl bg-md-background">
      {/* Left pane - Image and brand content */}
      <div className="hidden md:flex md:w-1/2 bg-md-primary p-8 flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="h-12 w-12 rounded-xl bg-md-on-primary flex items-center justify-center">
            <span className="text-md-primary text-2xl font-bold">A</span>
          </div>
          <h1 className="text-md-on-primary text-2xl font-bold">Aptinova</h1>
        </div>

        {/* Floating SVG shapes */}
        <div className="absolute inset-0 w-full h-full">
          {/* Shape 1 - Circle */}
          <div className="absolute top-20 right-20 animate-pulse-slow opacity-30 z-0">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
              className="text-md-on-primary"
            >
              <circle cx="60" cy="60" r="50" fill="currentColor" />
            </svg>
          </div>

          {/* Shape 2 - Blob */}
          <div className="absolute bottom-40 left-10 animate-float opacity-60 z-0">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 h-40 text-md-on-primary"
            >
              <path
                fill="currentColor"
                d="M39.9,-67.1C52.6,-59.5,64.5,-50.7,71.8,-38.4C79.1,-26.2,81.7,-10.5,79.2,4.1C76.6,18.8,68.9,32.4,58.8,43.2C48.8,54,36.4,62,23.1,67.8C9.9,73.5,-4.3,77,-17.4,74.5C-30.5,72,-42.6,63.6,-53.3,52.7C-64,41.9,-73.4,28.7,-75.7,14.3C-78,-0.1,-73.1,-15.7,-65.8,-29.4C-58.4,-43.1,-48.7,-54.8,-36.8,-62.7C-24.9,-70.6,-10.7,-74.5,1.6,-77.1C14,-79.7,27.3,-74.8,39.9,-67.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          {/* Shape 3 - Blob */}
          <div className="absolute top-1/2 right-20 animate-float-reverse opacity-50 z-0">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-32 text-md-on-primary"
            >
              <path
                fill="currentColor"
                d="M46.5,-78.3C59.9,-70.9,70.3,-58.1,77.1,-43.6C83.8,-29.1,86.9,-12.9,84.2,2C81.5,16.9,74.1,30.4,65.1,43.1C56.1,55.8,45.5,67.5,32.4,73.5C19.3,79.5,3.7,79.7,-12.4,77.4C-28.5,75.2,-45.1,70.5,-56.6,60.3C-68.2,50.1,-74.8,34.6,-78.9,18.1C-83,1.6,-84.7,-15.8,-79.4,-30.4C-74.1,-45,-61.7,-56.9,-47.8,-64.3C-33.9,-71.7,-16.9,-74.7,-0.2,-74.3C16.5,-73.9,33.1,-70.2,46.5,-78.3Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          {/* Shape 4 - Triangle */}
          <div className="absolute bottom-20 right-40 animate-spin-slow opacity-40 z-0">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
              className="text-md-on-primary"
            >
              <polygon points="40,5 75,75 5,75" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="text-center flex flex-col items-center z-10">
          <div className="mb-8 max-w-md">
            <h2 className="text-3xl font-bold text-md-on-primary mb-4">
              Password Recovery
            </h2>
            <p className="text-md-on-primary opacity-80 text-lg">
              Don't worry, we'll help you get back into your account
            </p>
          </div>
        </div>

        <div className="text-md-on-primary text-sm z-10">
          &copy; {new Date().getFullYear()}{" "}
          {`${process.env.NEXT_PUBLIC_APP_NAME}`} All rights reserved.
        </div>
      </div>

      {/* Right pane - Forgot password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Small logo for mobile only */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-md-primary flex items-center justify-center">
              <span className="text-md-on-primary text-xl font-bold">A</span>
            </div>
            <h1 className="text-md-on-surface text-xl font-bold">Aptinova</h1>
          </div>

          <div className="bg-md-surface-container p-8 rounded-3xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-md-on-surface">
              Forgot Password
            </h1>

            {status.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  status.type === "success"
                    ? "bg-md-tertiary-container text-md-on-tertiary-container"
                    : "bg-md-error-container text-md-on-error-container"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <label
                  htmlFor="email"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Email Address
                </label>
              </div>

              <div className="relative">
                <select
                  id="userType"
                  required
                  className="block w-full px-8 pt-6 pb-1 rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary  bg-transparent text-md-on-surface"
                  value={formData.userType}
                  onChange={(e) =>
                    setFormData({ ...formData, userType: e.target.value })
                  }
                >
                  {/* <option
                    value=""
                    disabled
                    className="text-md-on-surface-variant bg-inherit"
                  ></option>
                  <option>Select User Type</option> */}
                  <option value="candidate">Candidate</option>
                  <option value="hr">HR</option>
                  <option value="hrManager">HR Manager</option>
                </select>
                <label
                  htmlFor="userType"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-8 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  User Type
                </label>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-md-on-surface-variant"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-md-primary font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        @keyframes float-slow {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-3deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        @keyframes pulse-slow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
