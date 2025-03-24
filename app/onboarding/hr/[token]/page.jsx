"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import {
  FiCamera,
  FiCheck,
  FiChevronRight,
  FiSun,
  FiMoon,
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
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error && step !== 4) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/30 p-8 rounded-lg text-center max-w-md w-full">
          <h2 className="text-red-700 dark:text-red-400 text-xl font-semibold mb-2">
            Error
          </h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4">
        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiSun className="hidden dark:block text-yellow-500" size={20} />
          <FiMoon className="block dark:hidden text-gray-700" size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome, {hrData?.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Complete your account setup for {hrData?.organization?.name}
            </p>

            {/* Step Indicator */}
            <div className="flex justify-center items-center space-x-3 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${
                      step === i
                        ? "bg-blue-600 text-white scale-110"
                        : step > i
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {step > i ? <FiCheck className="w-5 h-5" /> : i}
                  </div>
                  {i < 4 && (
                    <div
                      className={`w-12 h-0.5 transition-colors ${
                        step > i
                          ? "bg-green-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content area with consistent padding */}
          <div className="mt-10">
            {/* Step 1: Terms and Conditions */}
            {step === 1 && (
              <div className="mt-8 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 h-60 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
                  <h3 className="font-semibold text-base mb-2">
                    Terms and Conditions
                  </h3>
                  <p>
                    By accepting these terms, you agree to comply with all
                    applicable laws and regulations regarding the use of{" "}
                    {hrData?.organization?.name}'s HR management system.
                  </p>
                  <p className="mt-2">
                    You are responsible for maintaining the confidentiality of
                    employee data and company information accessed through this
                    system.
                  </p>
                  <p className="mt-2">
                    All actions performed under your account will be logged and
                    audited.
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
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    I have read and agree to the Terms and Conditions
                  </label>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={!termsAccepted}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Continue <FiChevronRight className="ml-2" />
                </button>
              </div>
            )}

            {/* Step 2: Profile Picture */}
            {step === 2 && (
              <div className="mt-8 space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer overflow-hidden relative"
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
                        size={36}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    Click to upload a profile picture
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Set Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      Passwords do not match
                    </p>
                  )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={
                      submitting || password !== confirmPassword || !password
                    }
                    className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {submitting ? "Setting up..." : "Complete Setup"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Done */}
            {step === 4 && (
              <div className="mt-8 space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <FiCheck
                    className="text-green-600 dark:text-green-400"
                    size={30}
                  />
                </div>

                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Setup Complete!
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  Your HR account for {hrData?.organization?.name} has been
                  successfully created.
                </p>

                <button
                  onClick={() => (window.location.href = "/auth/login")}
                  className="mt-4 w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
