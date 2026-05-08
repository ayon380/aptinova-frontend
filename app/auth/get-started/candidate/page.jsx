"use client";
import React, { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormProgress } from "@/app/components/FormProgress";
import { SkillInput } from "@/app/components/SkillInput";
import dynamic from "next/dynamic";
const PublicationsSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Publications"),
  { ssr: false }
);
const CertificationsSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Certifications"),
  { ssr: false }
);
const WorkExperienceSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Experience"),
  {
    ssr: false,
  }
);
const AwardsSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Awards"),
  {
    ssr: false,
  }
);
const AchievementsSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Achievements"),
  {
    ssr: false,
  }
);
const EducationSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Education"),
  {
    ssr: false,
  }
);
const ProjectsSection = dynamic(
  () => import("@/app/components/candidate/getstarted/Projects"),
  {
    ssr: false,
  }
);
const skillSuggestions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
  "Agile",
  "Scrum",
];

const languageSuggestions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Portuguese",
  "Italian",
];

const candidateSteps = [
  "Basic Info",
  "Professional Details",
  "Skills & Experience",
  "Additional Info",
  "Plan Selection", // Added new step
];

// Add country-currency mapping
const countryToCurrency = {
  India: "INR",
  // Add more countries and their currencies
};

function CandidateSignupContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [user, setUser] = useState({});
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add payment state
  const [payment, setPayment] = useState({
    status: "pending",
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("authToken", token);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    console.log(user.email);
    if (user.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Update form state to match model schema
  const [form, setForm] = useState({
    email: user.email,
    firstName: "",
    lastName: "",
    phone: "",
    title: "",
    experience: "",
    industry: "",
    location: "",
    desiredSalary: "",
    workPreference: "remote",
    country: "",
    skills: [],
    languages: [],
    certifications: [],
    education: [],
    workExperience: [],
    projects: [],
    publications: [],
    awards: [],
    achievements: [],
    linkedin: "",
    github: "",
    portfolio: "",
    bio: "",
    plan: "FREE", // Match model enum
    status: "dormant",
  });

  const nextStep = () => {
    setFormError(null);
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, candidateSteps.length - 1));
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    } else {
      setFormError("Please fill in all required fields to continue");
    }
  };

  const prevStep = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 "
    >
      <div className="bg-md-surface-container  p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Personal Information
        </h3>

        {/* Profile picture upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-3xl bg-md-surface-container-high flex items-center justify-center overflow-hidden border border-md-outline">
              {form.profilePicture ? (
                <Image
                  src={URL.createObjectURL(form.profilePicture)}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <svg
                  className="w-12 h-12 text-md-on-surface-variant"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              <label
                htmlFor="profile-upload"
                className="cursor-pointer px-6 py-2 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200"
              >
                Choose File
                <input
                  id="profile-upload"
                  name="profile-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </label>
              {selectedProfilePicture && (
                <p className="mt-2 text-xs text-md-on-surface-variant">
                  {selectedProfilePicture}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              id="firstName"
              required
              className="block  w-full px-6 text-xl pt-6 pb-1 rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <label
              htmlFor="firstName"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              First Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="lastName"
              required
              className="block w-full text-xl px-6 pt-6 pb-1 rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <label
              htmlFor="lastName"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Last Name
            </label>
          </div>
        </div>

        <div className="relative">
          <input
            type="tel"
            id="phone"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl  text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <label
            htmlFor="phone"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Phone Number
          </label>
        </div>
      </div>
    </motion.div>
  );

  // Add validation functions
  const validateFields = {
    email: (email) => {
      if (!email) return "Email is required";
      // Using a basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return "Invalid email format";
      return null;
    },
    phone: (phone) => {
      if (!phone) return "Phone number is required";
      // Basic phone validation - can be enhanced
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(phone)) return "Invalid phone number format";
      return null;
    },
    education: (education) => {
      if (!education.length) return "At least one education entry is required";
      
      return null;
    },
    // Add more field validations as needed
  };

  // Update country selection to automatically set currency
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setForm((prev) => ({
      ...prev,
      country,
      currency: countryToCurrency[country] || "USD", // Default to USD if currency not found
    }));
  };

  // Modify professional details render function to update country selection
  const renderProfessionalDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Professional Information
        </h3>

        <div className="relative">
          <input
            type="text"
            id="title"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <label
            htmlFor="title"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Professional Title
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <select
              id="experience"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            >
              <option value=""></option>
              <option value="0-2">0-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            <label
              htmlFor="experience"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Years of Experience
            </label>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-md-on-surface-variant"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 0l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              id="industry"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            >
              <option value=""></option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
            <label
              htmlFor="industry"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Industry
            </label>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-md-on-surface-variant"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 0l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <select
            id="desiredSalary"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            value={form.desiredSalary}
            onChange={(e) =>
              setForm({ ...form, desiredSalary: e.target.value })
            }
          >
            <option value=""></option>
            <option value="0-5">₹0 - ₹5L</option>
            <option value="5-10">₹5L - ₹10L</option>
            <option value="10-30">₹10L - ₹30L</option>
            <option value="30+">₹30L and above</option>
          </select>
          <label
            htmlFor="desiredSalary"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Desired Salary Range
          </label>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-md-on-surface-variant"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 0l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            Work Preference
          </label>
          <div className="grid grid-cols-3 gap-4">
            {["remote", "hybrid", "onsite"].map((type) => (
              <button
                key={type}
                type="button"
                className={`
                  px-6 py-3 rounded-3xl transition-colors duration-200
                  ${
                    form.workPreference === type
                      ? "bg-md-primary-container text-md-on-primary-container"
                      : "border border-md-outline-variant text-md-on-surface hover:bg-md-surface-variant"
                  }
                `}
                onClick={() =>
                  setForm({
                    ...form,
                    workPreference: type,
                  })
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <select
            id="country"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            value={form.country}
            onChange={handleCountryChange}
          >
            <option value=""></option>
            {Object.keys(countryToCurrency).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label
            htmlFor="country"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Country
          </label>
          {/* Add currency display */}
          {form.country && (
            <div className="mt-2 text-sm text-md-on-surface-variant">
              Currency: {countryToCurrency[form.country]}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderSkillsAndExperience = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container overflow-y-auto h-4/5 p-8 rounded-3xl shadow-md space-y-8">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Skills & Experience
        </h3>

        <div>
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            Technical Skills
          </label>
          <div className="bg-md-surface-container-high border border-md-outline rounded-3xl text-xl p-2">
            <SkillInput
              value={form.skills}
              onChange={(skills) => setForm({ ...form, skills })}
              suggestions={skillSuggestions}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            Languages
          </label>
          <div className="bg-md-surface-container-high border border-md-outline rounded-3xl text-xl p-2">
            <SkillInput
              value={form.languages}
              onChange={(languages) => setForm({ ...form, languages })}
              suggestions={languageSuggestions}
            />
          </div>
        </div>

        <CertificationsSection form={form} setForm={setForm} />
        <PublicationsSection form={form} setForm={setForm} />
        <ProjectsSection form={form} setForm={setForm} />
        <WorkExperienceSection form={form} setForm={setForm} />
        <EducationSection form={form} setForm={setForm} />
        <AwardsSection form={form} setForm={setForm} />
        <AchievementsSection form={form} setForm={setForm} />
      </div>
    </motion.div>
  );

  const renderAdditionalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Additional Information
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <input
              type="url"
              id="linkedin"
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.linkedin || ""}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
            <label
              htmlFor="linkedin"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              LinkedIn Profile URL
            </label>
          </div>

          <div className="relative">
            <input
              type="url"
              id="github"
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.github || ""}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
            <label
              htmlFor="github"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              GitHub Profile URL
            </label>
          </div>
        </div>

        <div className="relative">
          <input
            type="url"
            id="portfolio"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.portfolio || ""}
            onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
          />
          <label
            htmlFor="portfolio"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Portfolio Website URL
          </label>
        </div>

        <div className="relative">
          <textarea
            id="bio"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface h-32 resize-none"
            placeholder=" "
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <label
            htmlFor="bio"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Professional Bio
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            Resume
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-md-outline-variant border-dashed rounded-3xl text-xl bg-md-surface-container-high">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-md-on-surface-variant"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-md-on-surface-variant justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-3xl px-6 py-2 bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-md-primary"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {selectedResume && (
                <p className="text-xs text-md-on-surface-variant mt-2">
                  Selected file: {selectedResume}
                </p>
              )}
              <p className="text-xs text-md-on-surface-variant">
                PDF, DOC up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Add new render function for plan selection
  const renderPlanSelection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Choose Your Plan
        </h3>

        <p className="text-md-on-surface-variant mb-8">
          Select the plan that best fits your needs. You can upgrade or
          downgrade at any time.
        </p>

        <div className="grid grid-cols-1 gap-8">
          {/* Free Plan */}
          <div
            className={`
              cursor-pointer rounded-3xl border-2 p-8 transition-all 
              ${
                form.plan === "free"
                  ? "border-md-primary bg-md-primary-container"
                  : "border-md-outline-variant hover:border-md-outline"
              }
            `}
            onClick={() => setForm({ ...form, plan: "free" })}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-medium">Free Plan</h3>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  form.plan === "free"
                    ? "border-md-primary bg-md-primary"
                    : "border-md-outline"
                }`}
              >
                {form.plan === "free" && (
                  <svg
                    className="w-4 h-4 text-md-on-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 00-1.414 0l-4-4a1 1 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            <p className="font-bold text-3xl text-md-on-surface mb-4">
            ₹0 <span className="text-base font-normal">/month</span>
            </p>

            <div className="border-t border-md-outline-variant pt-4 mt-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Limited test taking (up to 3 per month)</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Basic profile features</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Email support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className={`
              cursor-pointer rounded-3xl border-2 p-8 transition-all 
              ${
                form.plan === "pro"
                  ? "border-md-primary bg-md-primary-container"
                  : "border-md-outline-variant hover:border-md-outline"
              }
            `}
            onClick={() => setForm({ ...form, plan: "pro" })}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-medium">Pro Plan</h3>
                <span className="inline-block mt-1 px-3 py-1 bg-md-tertiary-container text-md-on-tertiary-container text-xs rounded-full">
                  Recommended
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  form.plan === "pro"
                    ? "border-md-primary bg-md-primary"
                    : "border-md-outline"
                }`}
              >
                {form.plan === "pro" && (
                  <svg
                    className="w-4 h-4 text-md-on-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 00-1.414 0l-4-4a1 1 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            <p className="font-bold text-3xl text-md-on-surface mb-4">
            ₹999 <span className="text-base font-normal">/month</span>
            </p>

            <div className="border-t border-md-outline-variant pt-4 mt-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Unlimited test taking</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Personalized feedback on each test
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Advanced analytics and reporting
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Priority matching with employers
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-md-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderProfessionalDetails();
      case 2:
        return renderSkillsAndExperience();
      case 3:
        return renderAdditionalInfo();
      case 4:
        return renderPlanSelection();
      default:
        return null;
    }
  };

  // Update validateStep function with new validations
  const validateStep = (step) => {
    let errors = [];

    switch (step) {
      case 0:
        if (!form.firstName) errors.push("First name is required");
        if (!form.lastName) errors.push("Last name is required");
        if (validateFields.phone(form.phone))
          errors.push(validateFields.phone(form.phone));
        break;
      case 1:
        if (!form.title) errors.push("Professional title is required");
        if (!form.experience) errors.push("Experience is required");
        if (!form.industry) errors.push("Industry is required");
        if (!form.country) errors.push("Country is required");
        if (!form.desiredSalary) errors.push("Desired salary is required");
        break;
      case 2:
        if (!form.skills.length) errors.push("At least one skill is required");
        if (validateFields.education(form.education))
          errors.push(validateFields.education(form.education));
        break;
      // ...existing validation cases...
    }

    if (errors.length) {
      setFormError(errors.join(", "));
      return false;
    }
    return true;
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, profilePicture: file });
      setSelectedProfilePicture(file.name);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, resume: file });
      setSelectedResume(file.name);
    }
  };

  // Add function to initialize payment
  const initializePayment = async () => {
    try {
      setPayment({ status: "processing" });

      // Call API to create subscription
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-subscription`,
        {
          userType: "candidate",
          userId: user.id || "021e33f6-87e2-4c5d-bac5-f0227ea7d3e2",
          tier: "PRO", // Use uppercase for tier as per backend
          totalCount: 12, // 12 months subscription
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Store subscription ID from the response
      console.log(response);

      const subscriptionId = response.data.subscription.id;

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "Aptinova",
        description: "Pro Plan Subscription",
        // Fix the handler function to correctly access payment response
        handler: function (response) {
          setPayment({
            subscriptionId: subscriptionId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            status: "completed",
          });

          // Now submit the form with payment details
          handleSubmitAfterPayment(response.razorpay_payment_id);
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          contact: form.phone,
        },
        theme: {
          color: "#7E57C2", // A purple color that might match your theme
        },
      };

      // Open Razorpay payment window
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPayment({
        status: "failed",
        error: error.response?.data?.message || "Payment initialization failed",
      });
    }
  };

  // Function to submit form after payment
  const handleSubmitAfterPayment = async (paymentId) => {
    const formData = new FormData();
    // Add all the form fields
    // formData.append("email", form.email || "ayonsarkar3);
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("phone", form.phone);
    formData.append("title", form.title);
    formData.append("experience", form.experience);
    formData.append("industry", form.industry);
    formData.append("location", form.location);
    formData.append("desiredSalary", form.desiredSalary);
    formData.append("workExperience", JSON.stringify(form.workExperience));
    formData.append("projects", JSON.stringify(form.projects));
    formData.append("awards", JSON.stringify(form.awards));
    formData.append("achievements", JSON.stringify(form.achievements));
    formData.append("workPreference", form.workPreference);
    formData.append("publications", JSON.stringify(form.publications));
    formData.append("country", form.country);
    formData.append("currency", form.currency);
    formData.append("skills", JSON.stringify(form.skills));
    formData.append("languages", JSON.stringify(form.languages));
    formData.append("certifications", JSON.stringify(form.certifications));
    formData.append("education", JSON.stringify(form.education));
    formData.append("linkedin", form.linkedin || "");
    formData.append("github", form.github || "");
    formData.append("portfolio", form.portfolio || "");
    formData.append("bio", form.bio);
    formData.append("plan", form.plan);
    // Add payment details
    formData.append("paymentId", paymentId);

    if (form.resume) {
      formData.append("resume", form.resume);
    }

    if (form.profilePicture) {
      formData.append("profileImage", form.profilePicture);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get-started/candidate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        router.push("/dashboard");
      } else {
        setFormError(
          "Failed to create profile: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setFormError(
        "An error occurred: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modify the original handleSubmit function to check if payment is needed
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setFormError("Please fill in all required fields to continue");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // If user selected pro plan, initiate payment flow
    if (form.plan === "pro") {
      // First make sure Razorpay script is loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          // Show payment modal after script loads
          setShowPaymentModal(true);
        };
        document.body.appendChild(script);
      } else {
        // Razorpay already loaded, show the modal directly
        setShowPaymentModal(true);
      }
      setIsSubmitting(false);
      return;
    }

    // For free plan, proceed with regular submission
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("phone", form.phone);
    formData.append("title", form.title);
    formData.append("experience", form.experience);
    formData.append("industry", form.industry);
    formData.append("location", form.location);
    formData.append("desiredSalary", form.desiredSalary);
    formData.append("workPreference", form.workPreference);
    formData.append("country", form.country);
    formData.append("currency", form.currency);
    formData.append("skills", JSON.stringify(form.skills));
    formData.append("languages", JSON.stringify(form.languages));
    formData.append("certifications", JSON.stringify(form.certifications));
    formData.append("education", JSON.stringify(form.education));
    formData.append("linkedin", form.linkedin || "");
    formData.append("github", form.github || "");
    formData.append("portfolio", form.portfolio || "");
    formData.append("bio", form.bio);
    formData.append("plan", form.plan);
    if (form.resume) {
      formData.append("resume", form.resume);
    }

    if (form.profilePicture) {
      formData.append("profileImage", form.profilePicture);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get-started/candidate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        router.push("/dashboard");
      } else {
        setFormError(
          "Failed to create profile: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setFormError(
        "An error occurred: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment confirmation modal
  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-md-surface-container p-8 rounded-3xl shadow-lg max-w-md w-full">
          <h3 className="text-2xl font-semibold text-md-on-surface mb-4">
            Complete Pro Plan Subscription
          </h3>

          <p className="text-md-on-surface-variant mb-6">
            You&apos;ve selected the Pro Plan. Click the button below to process
            your payment of $10/month.
          </p>

          {payment.status === "failed" && (
            <div className="mb-4 p-4 rounded-lg bg-md-error-container text-md-on-error-container">
              <p>Payment failed: {payment.error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setForm({ ...form, plan: "free" });
              }}
              className="px-6 py-3 rounded-3xl text-md-on-surface-variant bg-md-surface-variant hover:bg-md-surface-container-high transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              onClick={initializePayment}
              disabled={payment.status === "processing"}
              className="px-6 py-3 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200"
            >
              {payment.status === "processing" ? (
                <span className="flex items-center">
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
                  Processing...
                </span>
              ) : (
                "Setup Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-dvh bg-md-background">
      {/* Left pane - only visible on md and larger */}
      <div className="hidden md:flex md:w-1/3 bg-md-primary p-8 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-3xl bg-md-on-primary opacity-5"></div>
          <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-3xl bg-md-on-primary opacity-5"></div>
          <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-3xl bg-md-on-primary opacity-5"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-3xl bg-md-on-primary flex items-center justify-center">
              <span className="text-md-primary text-2xl font-bold">A</span>
            </div>
            <h1 className="text-md-on-primary text-2xl font-bold">Aptinova</h1>
          </div>
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="mb-8 max-w-md">
            <h2 className="text-3xl font-bold text-md-on-primary mb-4">
              Complete Your Profile
            </h2>
            <p className="text-md-on-primary opacity-80 text-lg">
              Set up your professional profile to connect with the best
              opportunities
            </p>
          </div>

          <div className="w-64 h-64 relative mb-8">
            <div className="wavy-line absolute bottom-0 w-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-48 h-48 text-md-on-primary opacity-90 blob"
              >
                <path
                  fill="currentColor"
                  d="M45.7,-64.2C58.9,-53.9,69.2,-39.6,75.6,-23.2C82,-6.8,84.6,11.8,78.9,27.2C73.3,42.6,59.4,54.7,44.1,63.5C28.8,72.3,12,77.8,-3.9,83C-19.7,88.2,-39.5,93,-55.8,85.3C-72,77.6,-84.7,57.5,-87,37.1C-89.3,16.8,-81.1,-3.7,-72.5,-21.5C-63.9,-39.2,-54.8,-54.1,-42,-64.4C-29.1,-74.8,-12.6,-80.6,2.3,-83.7C17.2,-86.8,32.4,-74.5,45.7,-64.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <FormProgress steps={candidateSteps} currentStep={currentStep} />
          </div>
        </div>

        <div className="relative z-10 text-md-on-primary opacity-70 text-sm">
          &copy; {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_APP_NAME || "Aptinova"} All rights reserved.
        </div>
      </div>

      {/* Right pane - main content */}
      <div className="w-full md:w-2/3 flex flex-col">
        {/* Mobile header and progress - only visible on smaller screens */}
        <div className="md:hidden bg-md-surface px-6 py-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-3xl bg-md-primary flex items-center justify-center">
              <span className="text-md-on-primary text-xl font-bold">A</span>
            </div>
            <h1 className="text-md-on-surface text-xl font-bold">Aptinova</h1>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-md-on-surface">
              Complete Your Profile
            </h2>
            <p className="text-md-on-surface-variant text-sm mt-1">
              Step {currentStep + 1} of {candidateSteps.length}:{" "}
              {candidateSteps[currentStep]}
            </p>
          </div>

          <FormProgress steps={candidateSteps} currentStep={currentStep} />
        </div>

        {/* Main form area - fix height issues here */}
        <div className="flex-grow md:mt-10 overflow-auto p-4 md:p-6 bg-md-background">
          <div className="max-w-3xl mx-auto">
            {/* Error message if any */}
            {formError && (
              <div className="mb-4 p-4 rounded-3xl bg-md-error-container text-md-on-error-container">
                <p>{formError}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
                <AnimatePresence mode="wait">
                  {renderCurrentStep()}
                </AnimatePresence>
              </div>

              <div className="flex justify-between pt-4 sticky bottom-0 bg-md-background p-4 -mx-4 md:static md:bg-transparent md:p-0 md:mx-0 border-t md:border-0">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className={`
                    px-6 py-3 rounded-3xl text-md-on-surface-variant bg-md-surface-variant hover:bg-md-surface-container-high transition-colors duration-200
                    ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
                    ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={
                    currentStep === candidateSteps.length - 1
                      ? handleSubmit
                      : nextStep
                  }
                  disabled={isSubmitting}
                  className={`
                    px-6 py-3 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200
                    ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
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
                      {currentStep === candidateSteps.length - 1
                        ? "Submitting..."
                        : "Next..."}
                    </span>
                  ) : currentStep === candidateSteps.length - 1 ? (
                    "Complete Profile"
                  ) : (
                    "Next Step"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Payment modal */}
      {renderPaymentModal()}
    </div>
  );
}

export default function CandidateSignup() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-md-background">
          <div className="animate-spin rounded-3xl h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
        </div>
      }
    >
      <CandidateSignupContent />
    </Suspense>
  );
}
