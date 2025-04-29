"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiCamera,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function HROnboarding() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hrData, setHrData] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Terms, 2: Profile Picture, 3: Password, 4: Done
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchHrData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/teams/hr/onboarding/${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch HR data");
        }

        setHrData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHrData();
  }, [token]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      // Create form data to upload profile picture
      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      formData.append("termsAccepted", termsAccepted);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/hr/complete-onboarding`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Failed to complete onboarding");
      }

      // Move to completion step
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-md-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <svg
              className="animate-spin h-16 w-16 text-md-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-md-on-surface text-lg">
            Loading your onboarding...
          </p>
        </div>
      </div>
    );
  }

  if (error && step !== 4) {
    return (
      <div className="h-dvh flex items-center justify-center bg-md-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-md-error-container p-8 rounded-3xl text-center max-w-md w-full shadow-lg"
        >
          <div className="bg-md-error/10 p-4 rounded-full inline-flex mb-4">
            <FiX className="h-8 w-8 text-md-error" />
          </div>
          <h2 className="text-md-on-error-container text-xl font-semibold mb-2">
            Error
          </h2>
          <p className="text-md-on-error-container mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-6 py-3 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-all shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-md-background px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="flex-1 -mt-10 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-md-surface p-8 sm:p-10 rounded-3xl shadow-xl transition-colors"
        >
          <div className="text-center">
            {hrData?.organization?.logo && (
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image
                  src={hrData.organization.logo}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-md-on-surface mb-3">
                Welcome, {hrData?.name}
              </h2>
              <p className="text-lg text-md-on-surface-variant">
                Complete your account setup for {hrData?.organization?.name}
              </p>
            </motion.div>

            {/* Step Indicator */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: step === i ? 1.1 : 1,
                      backgroundColor:
                        step === i
                          ? "var(--md-sys-color-primary)"
                          : step > i
                          ? "var(--md-sys-color-tertiary-container)"
                          : "var(--md-sys-color-surface-container)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${
                      step === i
                        ? "bg-md-primary text-md-on-primary shadow-md"
                        : step > i
                        ? "bg-md-tertiary-container text-md-on-tertiary-container"
                        : "bg-md-surface-container text-md-on-surface-variant"
                    }`}
                  >
                    {step > i ? <FiCheck className="w-5 h-5" /> : i}
                  </motion.div>
                  {i < 4 && (
                    <div
                      className={`w-6 h-0.5 transition-colors duration-500 ${
                        step > i ? "bg-md-tertiary-container" : "bg-md-outline"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content area with animated transitions */}
          <div className="mt-10 px-2 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Terms and Conditions */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 space-y-6"
                >
                  <div className="bg-md-surface-container rounded-3xl p-6  text-sm text-md-on-surface shadow-sm">
                    <h3 className="font-semibold text-base mb-3">
                      Terms and Conditions
                    </h3>
                    <p>
                      By accepting these terms, you agree to comply with all
                      applicable laws and regulations regarding the use of{" "}
                      {hrData?.organization?.name}'s HR management system.
                    </p>
                    <p className="mt-2">
                      You are responsible for maintaining the confidentiality of
                      employee data and company information accessed through
                      this system.
                    </p>
                    <p className="mt-2">
                      All actions performed under your account will be logged
                      and audited.
                    </p>
                    <p className="mt-2">
                      Your use of this system is subject to the organization's
                      data protection policies and privacy practices.
                    </p>
                    <p className="mt-2">
                      Unauthorized access or misuse of this system may result in
                      disciplinary action, termination of employment, or legal
                      consequences.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <motion.div whileTap={{ scale: 0.9 }} className="relative">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-5 w-5 text-md-primary focus:ring-md-primary-container border-md-outline-variant rounded mt-1 cursor-pointer"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                    </motion.div>
                    <label
                      htmlFor="terms"
                      className="ml-3 block text-md-on-surface cursor-pointer"
                    >
                      I have read and agree to the Terms and Conditions
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: termsAccepted ? 1.03 : 1 }}
                    whileTap={{ scale: termsAccepted ? 0.97 : 1 }}
                    onClick={handleNextStep}
                    disabled={!termsAccepted}
                    className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-md font-medium rounded-full text-md-on-primary bg-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-md-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Continue
                    <FiChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Profile Picture */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: step === 1 ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-40 h-40 rounded-full bg-md-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden relative shadow-md hover:shadow-lg transition-all"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt="Profile preview"
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <FiCamera
                          size={42}
                          className="text-md-on-surface-variant"
                        />
                      )}
                    </motion.div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 text-md-on-surface-variant"
                    >
                      Click to upload a profile picture
                    </motion.p>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePrevStep}
                      className="py-3 px-6 border border-md-outline rounded-full text-md font-medium text-md-on-surface hover:bg-md-surface-container-high transition-all duration-200"
                    >
                      <FiChevronLeft className="inline mr-2" />
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNextStep}
                      className="py-3 px-6 border border-transparent rounded-full text-md font-medium text-md-on-primary bg-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-md-primary transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Continue
                      <FiChevronRight className="inline ml-2" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="rounded-3xl shadow-sm space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-md-on-surface-variant mb-1 ml-1"
                      >
                        Set Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="appearance-none rounded-full relative block w-full px-6 py-3 border border-md-outline focus:border-md-primary placeholder-md-on-surface-variant text-md-on-surface bg-md-surface-container focus:outline-none focus:ring-2 focus:ring-md-primary/30 transition-all duration-200"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-md-on-surface-variant"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-md-on-surface-variant mb-1 ml-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          className="appearance-none rounded-full relative block w-full px-6 py-3 border border-md-outline focus:border-md-primary placeholder-md-on-surface-variant text-md-on-surface bg-md-surface-container focus:outline-none focus:ring-2 focus:ring-md-primary/30 transition-all duration-200"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-md-on-surface-variant"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {password &&
                    confirmPassword &&
                    password !== confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-md-error flex items-center"
                      >
                        <FiX className="inline mr-1" /> Passwords do not match
                      </motion.p>
                    )}

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handlePrevStep}
                      className="py-3 px-6 border border-md-outline rounded-full text-md font-medium text-md-on-surface hover:bg-md-surface-container-high transition-all duration-200"
                    >
                      <FiChevronLeft className="inline mr-2" />
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale:
                          submitting ||
                          password !== confirmPassword ||
                          !password
                            ? 1
                            : 1.03,
                      }}
                      whileTap={{
                        scale:
                          submitting ||
                          password !== confirmPassword ||
                          !password
                            ? 1
                            : 0.97,
                      }}
                      type="submit"
                      disabled={
                        submitting || password !== confirmPassword || !password
                      }
                      className="py-3 px-6 border border-transparent rounded-full text-md font-medium text-md-on-primary bg-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-md-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Setting up...
                        </div>
                      ) : (
                        <>
                          Complete Setup
                          <FiChevronRight className="inline ml-2" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* Step 4: Done */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="mt-8 space-y-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="mx-auto w-20 h-20 bg-md-tertiary-container rounded-full flex items-center justify-center mb-4 shadow-md"
                  >
                    <FiCheck
                      className="text-md-on-tertiary-container"
                      size={36}
                    />
                  </motion.div>

                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-medium text-md-on-surface"
                  >
                    Setup Complete!
                  </motion.h3>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-md-on-surface-variant"
                  >
                    Your HR account for {hrData?.organization?.name} has been
                    successfully created.
                  </motion.p>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      (window.location.href = "/auth/login?userType=hr")
                    }
                    className="mt-6 w-full py-3 px-6 border border-transparent rounded-full text-md font-medium text-md-on-primary bg-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-md-primary transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Go to Login
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Footer branding - subtle */}
      <div className="py-4 text-center">
        <p className="text-xs text-md-on-surface-variant">
          Powered by Aptinova
        </p>
      </div>
    </div>
  );
}
