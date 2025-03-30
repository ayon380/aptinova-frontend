"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { startRegistration } from "@simplewebauthn/browser";
import useStore from "@/app/store";
import TabView from "@/app/components/TabView";
import { motion } from "framer-motion";
export default function CandidateProfile() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { userdata, setUserdata } = useStore();
  const [passkeys, setPasskeys] = useState([]);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    experience: "",
    industry: "",
    location: "",
    desiredSalary: "",
    workPreference: "",
    country: "",
    currency: "",
    skills: [],
    languages: [],
    certifications: [],
    education: [],
    linkedin: "",
    github: "",
    portfolio: "",
    bio: "",
    profilePicture: null,
    resume: null,
  });
  const { setTitle } = useStore();
  useEffect(() => {
    setTitle("Profile");
  }, []);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePictureFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
    expiryDate: "",
    doesNotExpire: false,
  });
  const [editEducationIndex, setEditEducationIndex] = useState(-1);
  const [editCertificationIndex, setEditCertificationIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState("personal");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User info state for the header
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchPasskeys();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data.user);
      setUserdata(data.user);
      if (data.profilePicture) {
        setPreviewImage(data.profilePicture);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Update user info when profile data is fetched
  useEffect(() => {
    if (profile.firstName) {
      setUserInfo({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        profilePicture: profile.profilePicture,
        tier: localStorage.getItem("userTier") || "free",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setProfile((prev) => ({ ...prev, skills }));
  };

  const handleLanguagesChange = (e) => {
    const languages = e.target.value
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean);
    setProfile((prev) => ({ ...prev, languages }));
  };

  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCertificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCertification((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addEducation = () => {
    if (!newEducation.institution || !newEducation.degree) {
      toast.error("Institution and degree are required");
      return;
    }

    if (editEducationIndex >= 0) {
      // Edit existing education
      const updatedEducation = [...profile.education];
      updatedEducation[editEducationIndex] = newEducation;
      setProfile((prev) => ({ ...prev, education: updatedEducation }));
      setEditEducationIndex(-1);
    } else {
      // Add new education
      setProfile((prev) => ({
        ...prev,
        education: [...(prev.education || []), newEducation],
      }));
    }

    // Reset form
    setNewEducation({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    });
  };

  const addCertification = () => {
    if (!newCertification.name || !newCertification.issuer) {
      toast.error("Certificate name and issuer are required");
      return;
    }

    if (editCertificationIndex >= 0) {
      // Edit existing certification
      const updatedCertifications = [...profile.certifications];
      updatedCertifications[editCertificationIndex] = newCertification;
      setProfile((prev) => ({
        ...prev,
        certifications: updatedCertifications,
      }));
      setEditCertificationIndex(-1);
    } else {
      // Add new certification
      setProfile((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification],
      }));
    }

    // Reset form
    setNewCertification({
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      doesNotExpire: false,
    });
  };

  const editEducation = (index) => {
    setNewEducation(profile.education[index]);
    setEditEducationIndex(index);
  };

  const editCertification = (index) => {
    setNewCertification(profile.certifications[index]);
    setEditCertificationIndex(index);
  };

  const removeEducation = (index) => {
    const updatedEducation = [...profile.education];
    updatedEducation.splice(index, 1);
    setProfile((prev) => ({ ...prev, education: updatedEducation }));
  };

  const removeCertification = (index) => {
    const updatedCertifications = [...profile.certifications];
    updatedCertifications.splice(index, 1);
    setProfile((prev) => ({ ...prev, certifications: updatedCertifications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const formData = new FormData();

      // Append all text fields
      Object.entries(profile).forEach(([key, value]) => {
        if (
          key !== "profilePicture" &&
          key !== "resume" &&
          key !== "skills" &&
          key !== "languages" &&
          key !== "certifications" &&
          key !== "education"
        ) {
          formData.append(key, value || "");
        }
      });

      // Append arrays as JSON strings
      formData.append("skills", JSON.stringify(profile.skills || []));
      formData.append("languages", JSON.stringify(profile.languages || []));
      formData.append(
        "certifications",
        JSON.stringify(profile.certifications || [])
      );
      formData.append("education", JSON.stringify(profile.education || []));

      // Append files if they exist
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      if (profilePictureFile) {
        formData.append("profileImage", profilePictureFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");

      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const fetchPasskeys = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkeys`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch passkeys");
      const data = await response.json();
      setPasskeys(data);
    } catch (error) {
      toast.error("Failed to load passkeys");
    }
  };

  const handleDeletePasskey = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete passkey");
      toast.success("Passkey deleted successfully");
      fetchPasskeys(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to delete passkey");
    }
  };

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Get OS
    const getOS = () => {
      if (/Windows NT/i.test(userAgent)) return "Windows";
      if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform)) return "MacOS";
      if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent))
        return "Linux";
      if (/Android/i.test(userAgent)) return "Android";
      if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
      return "Unknown OS";
    };

    // Get browser
    const getBrowser = () => {
      if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) return "Chrome";
      if (/Firefox/i.test(userAgent)) return "Firefox";
      if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent))
        return "Safari";
      if (/Edg/i.test(userAgent)) return "Edge";
      return "Unknown Browser";
    };

    return {
      deviceOS: getOS(),
      deviceName: platform,
      platform: navigator.platform,
      browser: getBrowser(),
    };
  };

  // Usage
  console.log(getDeviceInfo());

  const handleAddPasskey = async () => {
    try {
      setIsRegistering(true);

      // Get registration options from server
      const optionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/register/options`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!optionsRes.ok) {
        throw new Error("Failed to get registration options");
      }

      const options = await optionsRes.json();

      console.log(options);
      let attResp;
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration({ optionsJSON: options });
      } catch (error) {
        // Some basic error handling
        if (error.name === "InvalidStateError") {
          window.alert("Registration timed out. Please try again.");
        } else {
          window.alert("An error occurred during registration.");
        }

        throw error;
      }
      // Verify the registration with the server
      const verificationRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/register/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            registration: attResp,
            deviceInfo: getDeviceInfo(),
          }),
        }
      );

      if (!verificationRes.ok) {
        throw new Error("Failed to verify registration");
      }

      toast.success("Passkey registered successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to register passkey");
    } finally {
      setIsRegistering(false);
    }
  };

  const getDeviceIcon = (deviceOS) => {
    switch (deviceOS?.toLowerCase()) {
      case "windows":
        return "💻";
      case "macos":
        return "🍎";
      case "ios":
        return "📱";
      case "android":
        return "🤖";
      case "linux":
        return "🐧";
      default:
        return "🔑";
    }
  };

  // Define tabs with icons for better visual recognition
  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "professional", label: "Professional", icon: "💼" },
    { id: "skills", label: "Skills", icon: "🔧" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "certifications", label: "Certificates", icon: "📜" },
    { id: "social", label: "Social", icon: "🔗" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  return (
    <div className="flex flex-col ml- text-xl h-full w-full bg-md-background">
      {/* Main content with sidebar for larger screens */}
      <div className="flex flex-1 md:pt-5 md:rounded-tl-3xl md:bg-md-surface-container h-full overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile TabView */}
              <div className="md:hidden">
                <TabView
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {/* Form content - shown based on active tab */}
                  <div className="px-4 py-4">
                    {/* Personal Information */}
                    {activeTab === "personal" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Personal Information
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={profile.firstName || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="firstName"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                First Name
                              </label>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={profile.lastName || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="lastName"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Last Name
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                            Profile Image
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-md-surface-container-high flex items-center justify-center border border-md-outline">
                              {previewImage ? (
                                <img
                                  src={previewImage}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-md-on-surface-variant">
                                  <svg
                                    className="w-12 h-12"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="profile-upload"
                                className="cursor-pointer inline-block px-6 py-2 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200"
                              >
                                Choose File
                                <input
                                  type="file"
                                  id="profile-upload"
                                  accept="image/*"
                                  onChange={handleProfileImageChange}
                                  className="sr-only"
                                />
                              </label>
                              {profilePictureFile && (
                                <p className="mt-2 text-xs text-md-on-surface-variant">
                                  {profilePictureFile.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="relative mb-6">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={profile.phone || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="phone"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Phone Number
                          </label>
                        </div>

                        <div className="relative">
                          <textarea
                            name="bio"
                            id="bio"
                            rows="4"
                            value={profile.bio || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none h-32"
                            placeholder=" "
                          ></textarea>
                          <label
                            htmlFor="bio"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Professional Bio
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Professional Information */}
                    {activeTab === "professional" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Professional Information
                        </h2>

                        <div className="relative mb-6">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={profile.title || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="title"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Professional Title
                          </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="number"
                                name="experience"
                                id="experience"
                                value={profile.experience || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="experience"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Years of Experience
                              </label>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="text"
                                name="industry"
                                id="industry"
                                value={profile.industry || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="industry"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Industry
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="text"
                                name="location"
                                id="location"
                                value={profile.location || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="location"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Location
                              </label>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="text"
                                name="country"
                                id="country"
                                value={profile.country || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="country"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Country
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="number"
                                name="desiredSalary"
                                id="desiredSalary"
                                value={profile.desiredSalary || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="desiredSalary"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Desired Salary
                              </label>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="relative">
                              <input
                                type="text"
                                name="currency"
                                id="currency"
                                value={profile.currency || ""}
                                onChange={handleChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="currency"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Currency
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                            Work Preference
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["remote", "hybrid", "onsite"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                className={`
                                  px-6 py-3 rounded-3xl transition-colors duration-200
                                  ${
                                    profile.workPreference === type
                                      ? "bg-md-primary-container text-md-on-primary-container"
                                      : "border border-md-outline-variant text-md-on-surface hover:bg-md-surface-variant"
                                  }
                                `}
                                onClick={() =>
                                  setProfile({
                                    ...profile,
                                    workPreference: type,
                                  })
                                }
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                            Resume
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-md-outline-variant border-dashed rounded-3xl bg-md-surface-container-high">
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
                                    onChange={handleResumeChange}
                                  />
                                </label>
                              </div>
                              {resumeFile && (
                                <p className="text-xs text-md-on-surface-variant mt-2">
                                  Selected file: {resumeFile.name}
                                </p>
                              )}
                              {profile.resume && !resumeFile && (
                                <div className="mt-2">
                                  <a
                                    href={profile.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-md-primary hover:underline text-sm"
                                  >
                                    View current resume
                                  </a>
                                </div>
                              )}
                              <p className="text-xs text-md-on-surface-variant">
                                PDF, DOC up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Skills & Qualifications */}
                    {activeTab === "skills" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Skills & Qualifications
                        </h2>

                        <div className="relative mb-6">
                          <input
                            type="text"
                            id="skills"
                            value={profile.skills?.join(", ") || ""}
                            onChange={handleSkillsChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="skills"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Skills (comma separated)
                          </label>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            id="languages"
                            value={profile.languages?.join(", ") || ""}
                            onChange={handleLanguagesChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="languages"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Languages (comma separated)
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Education Section */}
                    {activeTab === "education" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Education
                        </h2>

                        {profile.education && profile.education.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-md font-medium mb-4 text-md-on-surface">
                              Your Education History
                            </h3>
                            <ul className="space-y-4">
                              {profile.education.map((edu, index) => (
                                <li
                                  key={index}
                                  className="p-4 bg-md-surface-container-high rounded-3xl border border-md-outline"
                                >
                                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                      <div className="font-medium text-md-on-surface">
                                        {edu.institution}
                                      </div>
                                      <div className="text-md-on-surface">
                                        {edu.degree}{" "}
                                        {edu.field && `in ${edu.field}`}
                                      </div>
                                      <div className="text-sm text-md-on-surface-variant">
                                        {edu.startDate &&
                                          new Date(
                                            edu.startDate
                                          ).getFullYear()}{" "}
                                        -
                                        {edu.current
                                          ? " Present"
                                          : edu.endDate &&
                                            ` ${new Date(
                                              edu.endDate
                                            ).getFullYear()}`}
                                      </div>
                                    </div>
                                    <div className="flex space-x-2 self-start">
                                      <button
                                        type="button"
                                        onClick={() => editEducation(index)}
                                        className="p-2 text-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container rounded-full transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Form to add new education */}
                        <div className="p-6 bg-md-surface-container-high rounded-3xl border border-md-outline">
                          <h3 className="text-md font-medium mb-4 text-md-on-surface">
                            {editEducationIndex >= 0
                              ? "Edit Education"
                              : "Add Education"}
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="text"
                                  id="institution"
                                  name="institution"
                                  value={newEducation.institution}
                                  onChange={handleEducationChange}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                  placeholder=" "
                                />
                                <label
                                  htmlFor="institution"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Institution*
                                </label>
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  id="degree"
                                  name="degree"
                                  value={newEducation.degree}
                                  onChange={handleEducationChange}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                  placeholder=" "
                                />
                                <label
                                  htmlFor="degree"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Degree*
                                </label>
                              </div>
                            </div>

                            <div className="relative">
                              <input
                                type="text"
                                id="field"
                                name="field"
                                value={newEducation.field}
                                onChange={handleEducationChange}
                                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                placeholder=" "
                              />
                              <label
                                htmlFor="field"
                                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                              >
                                Field of Study
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="date"
                                  id="startDate"
                                  name="startDate"
                                  value={newEducation.startDate}
                                  onChange={handleEducationChange}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                />
                                <label
                                  htmlFor="startDate"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Start Date
                                </label>
                              </div>
                              <div className="relative">
                                <input
                                  type="date"
                                  id="endDate"
                                  name="endDate"
                                  value={newEducation.endDate}
                                  onChange={handleEducationChange}
                                  disabled={newEducation.current}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface disabled:bg-md-surface-variant disabled:text-md-on-surface-variant"
                                />
                                <label
                                  htmlFor="endDate"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  End Date
                                </label>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="currentEducation"
                                name="current"
                                checked={newEducation.current}
                                onChange={handleEducationChange}
                                className="h-4 w-4 text-md-primary border-md-outline rounded focus:ring-md-primary"
                              />
                              <label
                                htmlFor="currentEducation"
                                className="ml-2 text-md-on-surface"
                              >
                                I am currently studying here
                              </label>
                            </div>

                            <div className="flex justify-end mt-4">
                              {editEducationIndex >= 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditEducationIndex(-1);
                                    setNewEducation({
                                      institution: "",
                                      degree: "",
                                      field: "",
                                      startDate: "",
                                      endDate: "",
                                      current: false,
                                    });
                                  }}
                                  className="mr-3 px-6 py-2 bg-md-surface-variant text-md-on-surface-variant rounded-3xl hover:bg-md-surface-container-high transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={addEducation}
                                className="px-6 py-2 bg-md-primary text-md-on-primary rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                              >
                                {editEducationIndex >= 0 ? "Update" : "Add"}{" "}
                                Education
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Certifications Section */}
                    {activeTab === "certifications" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Certifications
                        </h2>

                        {profile.certifications &&
                          profile.certifications.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-md font-medium mb-4 text-md-on-surface">
                                Your Certifications
                              </h3>
                              <ul className="space-y-4">
                                {profile.certifications.map((cert, index) => (
                                  <li
                                    key={index}
                                    className="p-4 bg-md-surface-container-high rounded-3xl border border-md-outline"
                                  >
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                      <div>
                                        <div className="font-medium text-md-on-surface">
                                          {cert.name}
                                        </div>
                                        <div className="text-md-on-surface">
                                          Issued by {cert.issuer}
                                        </div>
                                        <div className="text-sm text-md-on-surface-variant">
                                          {cert.date &&
                                            `Issued: ${new Date(
                                              cert.date
                                            ).toLocaleDateString()}`}
                                          {!cert.doesNotExpire &&
                                            cert.expiryDate &&
                                            ` • Expires: ${new Date(
                                              cert.expiryDate
                                            ).toLocaleDateString()}`}
                                          {cert.doesNotExpire &&
                                            " • Does not expire"}
                                        </div>
                                      </div>
                                      <div className="flex space-x-2 self-start">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            editCertification(index)
                                          }
                                          className="p-2 text-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container rounded-full transition-colors"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                          </svg>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeCertification(index)
                                          }
                                          className="p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* Form to add new certification */}
                        <div className="p-6 bg-md-surface-container-high rounded-3xl border border-md-outline">
                          <h3 className="text-md font-medium mb-4 text-md-on-surface">
                            {editCertificationIndex >= 0
                              ? "Edit Certification"
                              : "Add Certification"}
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="text"
                                  id="certName"
                                  name="name"
                                  value={newCertification.name}
                                  onChange={handleCertificationChange}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                  placeholder=" "
                                />
                                <label
                                  htmlFor="certName"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Certification Name*
                                </label>
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  id="issuer"
                                  name="issuer"
                                  value={newCertification.issuer}
                                  onChange={handleCertificationChange}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                  placeholder=" "
                                />
                                <label
                                  htmlFor="issuer"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Issuing Organization*
                                </label>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="date"
                                  id="certDate"
                                  name="date"
                                  value={newCertification.date}
                                  onChange={handleCertificationChange}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                />
                                <label
                                  htmlFor="certDate"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Issue Date
                                </label>
                              </div>
                              <div className="relative">
                                <input
                                  type="date"
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={newCertification.expiryDate}
                                  onChange={handleCertificationChange}
                                  disabled={newCertification.doesNotExpire}
                                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface disabled:bg-md-surface-variant disabled:text-md-on-surface-variant"
                                />
                                <label
                                  htmlFor="expiryDate"
                                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                                >
                                  Expiry Date
                                </label>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="doesNotExpire"
                                name="doesNotExpire"
                                checked={newCertification.doesNotExpire}
                                onChange={handleCertificationChange}
                                className="h-4 w-4 text-md-primary border-md-outline rounded focus:ring-md-primary"
                              />
                              <label
                                htmlFor="doesNotExpire"
                                className="ml-2 text-md-on-surface"
                              >
                                This certification does not expire
                              </label>
                            </div>

                            <div className="flex justify-end mt-4">
                              {editCertificationIndex >= 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditCertificationIndex(-1);
                                    setNewCertification({
                                      name: "",
                                      issuer: "",
                                      date: "",
                                      expiryDate: "",
                                      doesNotExpire: false,
                                    });
                                  }}
                                  className="mr-3 px-6 py-2 bg-md-surface-variant text-md-on-surface-variant rounded-3xl hover:bg-md-surface-container-high transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={addCertification}
                                className="px-6 py-2 bg-md-primary text-md-on-primary rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                              >
                                {editCertificationIndex >= 0 ? "Update" : "Add"}{" "}
                                Certification
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {activeTab === "social" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Social Links
                        </h2>

                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="url"
                              id="linkedin"
                              name="linkedin"
                              value={profile.linkedin || ""}
                              onChange={handleChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
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
                              name="github"
                              value={profile.github || ""}
                              onChange={handleChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
                            />
                            <label
                              htmlFor="github"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              GitHub Profile URL
                            </label>
                          </div>

                          <div className="relative">
                            <input
                              type="url"
                              id="portfolio"
                              name="portfolio"
                              value={profile.portfolio || ""}
                              onChange={handleChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
                            />
                            <label
                              htmlFor="portfolio"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Portfolio Website URL
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === "security" && (
                      <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                          Security Settings
                        </h2>

                        <button
                          onClick={handleAddPasskey}
                          disabled={isRegistering}
                          className="px-6 py-3 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors disabled:opacity-50"
                        >
                          {isRegistering ? "Registering..." : "Add Passkey"}
                        </button>

                        <div className="mt-6">
                          <h3 className="text-md font-medium mb-4 text-md-on-surface">
                            Your Passkeys
                          </h3>
                          {passkeys.length === 0 ? (
                            <p className="text-md-on-surface-variant">
                              No passkeys registered
                            </p>
                          ) : (
                            <ul className="space-y-4">
                              {passkeys.map((passkey) => (
                                <li
                                  key={passkey.cred_id}
                                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-md-surface-container-high rounded-3xl border border-md-outline gap-4"
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className="text-2xl"
                                      role="img"
                                      aria-label="device icon"
                                    >
                                      {getDeviceIcon(passkey.deviceOS)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-md-on-surface">
                                          {passkey.deviceName}
                                        </span>
                                        <span className="text-xs text-md-on-surface-variant">
                                          •
                                        </span>
                                        <span className="text-sm text-md-on-surface-variant">
                                          {passkey.browser}
                                        </span>
                                      </div>
                                      <div className="text-sm text-md-on-surface-variant">
                                        <span>{passkey.deviceOS}</span>
                                        <span className="mx-2">•</span>
                                        <span>
                                          Added{" "}
                                          {new Date(
                                            passkey.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeletePasskey(passkey.cred_id)
                                    }
                                    className="p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabView>
              </div>

              {/* Desktop TabView */}
              <div className="hidden md:block mb-4">
                <div className="px-4">
                  <div className="flex overflow-x-auto space-x-2 py-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-3 whitespace-nowrap rounded-full transition-colors ${
                          activeTab === tab.id
                            ? "bg-md-primary-container text-md-on-primary-container font-medium"
                            : "text-md-on-surface hover:bg-md-surface-variant"
                        }`}
                      >
                        <span className="text-xl">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Tabs Content */}
              <div className="hidden md:block  flex-1 overflow-y-auto px-4 py-4">
                {/* Personal Information */}
                {activeTab === "personal" && (
                  <div className=" p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Personal Information
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={profile.firstName || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="firstName"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            First Name
                          </label>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={profile.lastName || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="lastName"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Last Name
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                        Profile Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-md-surface-container-high flex items-center justify-center border border-md-outline">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-md-on-surface-variant">
                              <svg
                                className="w-12 h-12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="profile-upload"
                            className="cursor-pointer inline-block px-6 py-2 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200"
                          >
                            Choose File
                            <input
                              type="file"
                              id="profile-upload"
                              accept="image/*"
                              onChange={handleProfileImageChange}
                              className="sr-only"
                            />
                          </label>
                          {profilePictureFile && (
                            <p className="mt-2 text-xs text-md-on-surface-variant">
                              {profilePictureFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                        placeholder=" "
                      />
                      <label
                        htmlFor="phone"
                        className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                      >
                        Phone Number
                      </label>
                    </div>

                    <div className="relative">
                      <textarea
                        name="bio"
                        id="bio"
                        rows="4"
                        value={profile.bio || ""}
                        onChange={handleChange}
                        className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none h-32"
                        placeholder=" "
                      ></textarea>
                      <label
                        htmlFor="bio"
                        className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                      >
                        Professional Bio
                      </label>
                    </div>
                  </div>
                )}

                {/* Professional Information */}
                {activeTab === "professional" && (
                  <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Professional Information
                    </h2>

                    <div className="relative mb-6">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={profile.title || ""}
                        onChange={handleChange}
                        className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                        placeholder=" "
                      />
                      <label
                        htmlFor="title"
                        className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                      >
                        Professional Title
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="number"
                            name="experience"
                            id="experience"
                            value={profile.experience || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="experience"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Years of Experience
                          </label>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="text"
                            name="industry"
                            id="industry"
                            value={profile.industry || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="industry"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Industry
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={profile.location || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="location"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Location
                          </label>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="text"
                            name="country"
                            id="country"
                            value={profile.country || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="country"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Country
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="number"
                            name="desiredSalary"
                            id="desiredSalary"
                            value={profile.desiredSalary || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="desiredSalary"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Desired Salary
                          </label>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="relative">
                          <input
                            type="text"
                            name="currency"
                            id="currency"
                            value={profile.currency || ""}
                            onChange={handleChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="currency"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Currency
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                        Work Preference
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {["remote", "hybrid", "onsite"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`
                              px-6 py-3 rounded-3xl transition-colors duration-200
                              ${
                                profile.workPreference === type
                                  ? "bg-md-primary-container text-md-on-primary-container"
                                  : "border border-md-outline-variant text-md-on-surface hover:bg-md-surface-variant"
                              }
                            `}
                            onClick={() =>
                              setProfile({ ...profile, workPreference: type })
                            }
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                        Resume
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-md-outline-variant border-dashed rounded-3xl bg-md-surface-container-high">
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
                                onChange={handleResumeChange}
                              />
                            </label>
                          </div>
                          {resumeFile && (
                            <p className="text-xs text-md-on-surface-variant mt-2">
                              Selected file: {resumeFile.name}
                            </p>
                          )}
                          {profile.resume && !resumeFile && (
                            <div className="mt-2">
                              <a
                                href={profile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-md-primary hover:underline text-sm"
                              >
                                View current resume
                              </a>
                            </div>
                          )}
                          <p className="text-xs text-md-on-surface-variant">
                            PDF, DOC up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills & Qualifications */}
                {activeTab === "skills" && (
                  <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Skills & Qualifications
                    </h2>

                    <div className="relative mb-6">
                      <input
                        type="text"
                        id="skills"
                        value={profile.skills?.join(", ") || ""}
                        onChange={handleSkillsChange}
                        className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                        placeholder=" "
                      />
                      <label
                        htmlFor="skills"
                        className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                      >
                        Skills (comma separated)
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        id="languages"
                        value={profile.languages?.join(", ") || ""}
                        onChange={handleLanguagesChange}
                        className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                        placeholder=" "
                      />
                      <label
                        htmlFor="languages"
                        className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                      >
                        Languages (comma separated)
                      </label>
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {activeTab === "education" && (
                  <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Education
                    </h2>

                    {profile.education && profile.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-md font-medium mb-4 text-md-on-surface">
                          Your Education History
                        </h3>
                        <ul className="space-y-4">
                          {profile.education.map((edu, index) => (
                            <li
                              key={index}
                              className="p-4 bg-md-surface-container-high rounded-3xl border border-md-outline"
                            >
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div>
                                  <div className="font-medium text-md-on-surface">
                                    {edu.institution}
                                  </div>
                                  <div className="text-md-on-surface">
                                    {edu.degree}{" "}
                                    {edu.field && `in ${edu.field}`}
                                  </div>
                                  <div className="text-sm text-md-on-surface-variant">
                                    {edu.startDate &&
                                      new Date(
                                        edu.startDate
                                      ).getFullYear()}{" "}
                                    -
                                    {edu.current
                                      ? " Present"
                                      : edu.endDate &&
                                        ` ${new Date(
                                          edu.endDate
                                        ).getFullYear()}`}
                                  </div>
                                </div>
                                <div className="flex space-x-2 self-start">
                                  <button
                                    type="button"
                                    onClick={() => editEducation(index)}
                                    className="p-2 text-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container rounded-full transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Form to add new education */}
                    <div className="p-6 bg-md-surface-container-high rounded-3xl border border-md-outline">
                      <h3 className="text-md font-medium mb-4 text-md-on-surface">
                        {editEducationIndex >= 0
                          ? "Edit Education"
                          : "Add Education"}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              id="institution"
                              name="institution"
                              value={newEducation.institution}
                              onChange={handleEducationChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
                            />
                            <label
                              htmlFor="institution"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Institution*
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              id="degree"
                              name="degree"
                              value={newEducation.degree}
                              onChange={handleEducationChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
                            />
                            <label
                              htmlFor="degree"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Degree*
                            </label>
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            id="field"
                            name="field"
                            value={newEducation.field}
                            onChange={handleEducationChange}
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            placeholder=" "
                          />
                          <label
                            htmlFor="field"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Field of Study
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={newEducation.startDate}
                              onChange={handleEducationChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            />
                            <label
                              htmlFor="startDate"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Start Date
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={newEducation.endDate}
                              onChange={handleEducationChange}
                              disabled={newEducation.current}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface disabled:bg-md-surface-variant disabled:text-md-on-surface-variant"
                            />
                            <label
                              htmlFor="endDate"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              End Date
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="currentEducation"
                            name="current"
                            checked={newEducation.current}
                            onChange={handleEducationChange}
                            className="h-4 w-4 text-md-primary border-md-outline rounded focus:ring-md-primary"
                          />
                          <label
                            htmlFor="currentEducation"
                            className="ml-2 text-md-on-surface"
                          >
                            I am currently studying here
                          </label>
                        </div>

                        <div className="flex justify-end mt-4">
                          {editEducationIndex >= 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditEducationIndex(-1);
                                setNewEducation({
                                  institution: "",
                                  degree: "",
                                  field: "",
                                  startDate: "",
                                  endDate: "",
                                  current: false,
                                });
                              }}
                              className="mr-3 px-6 py-2 bg-md-surface-variant text-md-on-surface-variant rounded-3xl hover:bg-md-surface-container-high transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={addEducation}
                            className="px-6 py-2 bg-md-primary text-md-on-primary rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                          >
                            {editEducationIndex >= 0 ? "Update" : "Add"}{" "}
                            Education
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications Section */}
                {activeTab === "certifications" && (
                  <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Certifications
                    </h2>

                    {profile.certifications &&
                      profile.certifications.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-md font-medium mb-4 text-md-on-surface">
                            Your Certifications
                          </h3>
                          <ul className="space-y-4">
                            {profile.certifications.map((cert, index) => (
                              <li
                                key={index}
                                className="p-4 bg-md-surface-container-high rounded-3xl border border-md-outline"
                              >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                  <div>
                                    <div className="font-medium text-md-on-surface">
                                      {cert.name}
                                    </div>
                                    <div className="text-md-on-surface">
                                      Issued by {cert.issuer}
                                    </div>
                                    <div className="text-sm text-md-on-surface-variant">
                                      {cert.date &&
                                        `Issued: ${new Date(
                                          cert.date
                                        ).toLocaleDateString()}`}
                                      {!cert.doesNotExpire &&
                                        cert.expiryDate &&
                                        ` • Expires: ${new Date(
                                          cert.expiryDate
                                        ).toLocaleDateString()}`}
                                      {cert.doesNotExpire &&
                                        " • Does not expire"}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 self-start">
                                    <button
                                      type="button"
                                      onClick={() => editCertification(index)}
                                      className="p-2 text-md-primary hover:bg-md-primary-container hover:text-md-on-primary-container rounded-full transition-colors"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeCertification(index)}
                                      className="p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Form to add new certification */}
                    <div className="p-6 bg-md-surface-container-high rounded-3xl border border-md-outline">
                      <h3 className="text-md font-medium mb-4 text-md-on-surface">
                        {editCertificationIndex >= 0
                          ? "Edit Certification"
                          : "Add Certification"}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              id="certName"
                              name="name"
                              value={newCertification.name}
                              onChange={handleCertificationChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
                            />
                            <label
                              htmlFor="certName"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Certification Name*
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              id="issuer"
                              name="issuer"
                              value={newCertification.issuer}
                              onChange={handleCertificationChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                              placeholder=" "
                            />
                            <label
                              htmlFor="issuer"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Issuing Organization*
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="date"
                              id="certDate"
                              name="date"
                              value={newCertification.date}
                              onChange={handleCertificationChange}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                            />
                            <label
                              htmlFor="certDate"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Issue Date
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="date"
                              id="expiryDate"
                              name="expiryDate"
                              value={newCertification.expiryDate}
                              onChange={handleCertificationChange}
                              disabled={newCertification.doesNotExpire}
                              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface disabled:bg-md-surface-variant disabled:text-md-on-surface-variant"
                            />
                            <label
                              htmlFor="expiryDate"
                              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                            >
                              Expiry Date
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="doesNotExpire"
                            name="doesNotExpire"
                            checked={newCertification.doesNotExpire}
                            onChange={handleCertificationChange}
                            className="h-4 w-4 text-md-primary border-md-outline rounded focus:ring-md-primary"
                          />
                          <label
                            htmlFor="doesNotExpire"
                            className="ml-2 text-md-on-surface"
                          >
                            This certification does not expire
                          </label>
                        </div>

                        <div className="flex justify-end mt-4">
                          {editCertificationIndex >= 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditCertificationIndex(-1);
                                setNewCertification({
                                  name: "",
                                  issuer: "",
                                  date: "",
                                  expiryDate: "",
                                  doesNotExpire: false,
                                });
                              }}
                              className="mr-3 px-6 py-2 bg-md-surface-variant text-md-on-surface-variant rounded-3xl hover:bg-md-surface-container-high transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={addCertification}
                            className="px-6 py-2 bg-md-primary text-md-on-primary rounded-3xl hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                          >
                            {editCertificationIndex >= 0 ? "Update" : "Add"}{" "}
                            Certification
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {activeTab === "social" && (
                  <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Social Links
                    </h2>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="url"
                          id="linkedin"
                          name="linkedin"
                          value={profile.linkedin || ""}
                          onChange={handleChange}
                          className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                          placeholder=" "
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
                          name="github"
                          value={profile.github || ""}
                          onChange={handleChange}
                          className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                          placeholder=" "
                        />
                        <label
                          htmlFor="github"
                          className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                        >
                          GitHub Profile URL
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="url"
                          id="portfolio"
                          name="portfolio"
                          value={profile.portfolio || ""}
                          onChange={handleChange}
                          className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                          placeholder=" "
                        />
                        <label
                          htmlFor="portfolio"
                          className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                        >
                          Portfolio Website URL
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                      Security Settings
                    </h2>

                    <button
                      onClick={handleAddPasskey}
                      disabled={isRegistering}
                      className="px-6 py-3 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors disabled:opacity-50"
                    >
                      {isRegistering ? "Registering..." : "Add Passkey"}
                    </button>

                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-4 text-md-on-surface">
                        Your Passkeys
                      </h3>
                      {passkeys.length === 0 ? (
                        <p className="text-md-on-surface-variant">
                          No passkeys registered
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {passkeys.map((passkey) => (
                            <li
                              key={passkey.cred_id}
                              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-md-surface-container-high rounded-3xl border border-md-outline gap-4"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="text-2xl"
                                  role="img"
                                  aria-label="device icon"
                                >
                                  {getDeviceIcon(passkey.deviceOS)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-md-on-surface">
                                      {passkey.deviceName}
                                    </span>
                                    <span className="text-xs text-md-on-surface-variant">
                                      •
                                    </span>
                                    <span className="text-sm text-md-on-surface-variant">
                                      {passkey.browser}
                                    </span>
                                  </div>
                                  <div className="text-sm text-md-on-surface-variant">
                                    <span>{passkey.deviceOS}</span>
                                    <span className="mx-2">•</span>
                                    <span>
                                      Added{" "}
                                      {new Date(
                                        passkey.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeletePasskey(passkey.cred_id)
                                }
                                className="p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) - Material Design 3 style */}
      <motion.button
        onClick={handleSubmit}
        disabled={saving}
        className="fixed right-6 bottom-24 z-40 h-14 px-6 rounded-full bg-md-primary text-md-on-primary shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        {saving ? (
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2"
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
            <span>Saving</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span>Save</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </motion.button>

      {/* Resume Preview Modal - Material Design 3 bottom sheet */}
      {showResumePreview && profile.resume && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowResumePreview(false)}
          ></div>
          <motion.div
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:max-w-4xl md:w-full md:-translate-x-1/2 md:-translate-y-1/2 bg-md-surface z-50 rounded-t-3xl md:rounded-3xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ y: "100%", x: "0%", opacity: 1 }}
            animate={{ y: 0, x: "0%", opacity: 1 }}
            exit={{ y: "100%", x: "0%", opacity: 1 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-4 flex justify-between items-center border-b border-md-outline">
              <div className="flex-grow-0 w-8"></div>
              <h3 className="flex-grow text-center text-lg font-medium text-md-on-surface">
                Resume Preview
              </h3>
              <button
                onClick={() => setShowResumePreview(false)}
                className="flex-grow-0 p-2 text-md-on-surface-variant hover:bg-md-surface-variant rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                src={profile.resume}
                className="w-full h-full"
                title="Resume Preview"
              ></iframe>
            </div>
            <div className="p-4 border-t border-md-outline flex justify-end">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
              >
                Download
              </a>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
