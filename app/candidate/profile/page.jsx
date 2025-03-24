"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { startRegistration } from "@simplewebauthn/browser";

export default function CandidateProfile() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [passkeys, setPasskeys] = useState([]);
  const [activeTab, setActiveTab] = useState("personal"); // personal, professional, skills, security
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    experience: "",
    industry: "",
    location: "",
    desiredSalary: "",
    workPreference: "remote",
    country: "",
    currency: "USD",
    skills: [],
    languages: [],
    certifications: [],
    education: [],
    linkedin: "",
    github: "",
    portfolio: "",
    resume: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchPasskeys();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setUser(data);
      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
      if (data.resume) {
        setResumeFileName(data.resume.split('/').pop());
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
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
      fetchPasskeys(); // Refresh the list
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSkillChange = (e, index) => {
    const newSkills = [...user.skills];
    newSkills[index] = e.target.value;
    setUser({ ...user, skills: newSkills });
  };

  const handleAddSkill = () => {
    setUser({ ...user, skills: [...user.skills, ""] });
  };

  const handleRemoveSkill = (index) => {
    const newSkills = user.skills.filter((_, i) => i !== index);
    setUser({ ...user, skills: newSkills });
  };

  const handleLanguageChange = (e, index) => {
    const newLanguages = [...user.languages];
    newLanguages[index] = e.target.value;
    setUser({ ...user, languages: newLanguages });
  };

  const handleAddLanguage = () => {
    setUser({ ...user, languages: [...user.languages, ""] });
  };

  const handleRemoveLanguage = (index) => {
    const newLanguages = user.languages.filter((_, i) => i !== index);
    setUser({ ...user, languages: newLanguages });
  };

  const handleEducationChange = (e, index, field) => {
    const newEducation = [...user.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: e.target.value,
    };
    setUser({ ...user, education: newEducation });
  };

  const handleAddEducation = () => {
    setUser({
      ...user,
      education: [
        ...user.education,
        { degree: "", institution: "", graduationYear: "" },
      ],
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = user.education.filter((_, i) => i !== index);
    setUser({ ...user, education: newEducation });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      
      // Add text fields to formData
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("phone", user.phone || "");
      formData.append("title", user.title || "");
      formData.append("bio", user.bio || "");
      formData.append("experience", user.experience || "");
      formData.append("industry", user.industry || "");
      formData.append("location", user.location || "");
      formData.append("desiredSalary", user.desiredSalary || "");
      formData.append("workPreference", user.workPreference || "remote");
      formData.append("country", user.country || "");
      formData.append("currency", user.currency || "USD");
      formData.append("linkedin", user.linkedin || "");
      formData.append("github", user.github || "");
      formData.append("portfolio", user.portfolio || "");
      
      // Add array fields as JSON strings
      formData.append("skills", JSON.stringify(user.skills || []));
      formData.append("languages", JSON.stringify(user.languages || []));
      formData.append("certifications", JSON.stringify(user.certifications || []));
      formData.append("education", JSON.stringify(user.education || []));
      
      // Add files if they exist
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
      
      if (resumeFile) {
        formData.append("resume", resumeFile);
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
      
      const updatedProfile = await response.json();
      setUser(updatedProfile);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      
      // Reset file states
      setProfileImageFile(null);
      setResumeFile(null);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  // Tab components
  const PersonalInfoTab = () => (
    <div className="bg-md-surface-container p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-md-on-surface">Personal Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-md-primary hover:text-md-primary/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 overflow-hidden rounded-full bg-md-surface-container-high border border-md-outline-variant">
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-md-primary-container text-md-on-primary-container text-4xl font-medium">
                {user.firstName && user.lastName 
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : "?"}
              </div>
            )}
          </div>
          {isEditing && (
            <label className="cursor-pointer px-4 py-2 bg-md-primary text-md-on-primary hover:bg-md-primary/90 transition-colors rounded-full text-sm">
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
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
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
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
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  disabled={true}
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline bg-md-surface-container-high text-md-on-surface-variant"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 text-md-on-surface-variant"
                >
                  Email (cannot be changed)
                </label>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
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
                  id="bio"
                  name="bio"
                  value={user.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="bio"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Bio
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-md-on-surface">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-md-on-surface-variant">{user.title}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-md-on-surface-variant">Email</h4>
                  <p className="text-md-on-surface">{user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-md-on-surface-variant">Phone</h4>
                  <p className="text-md-on-surface">{user.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-md-on-surface-variant mb-1">Bio</h4>
                <p className="text-md-on-surface">{user.bio || "No bio added yet."}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 border border-md-outline-variant rounded-xl">
        <h4 className="text-md font-medium text-md-on-surface mb-2">Resume / CV</h4>
        {isEditing ? (
          <div className="space-y-2">
            <label className="cursor-pointer px-4 py-2 bg-md-primary text-md-on-primary hover:bg-md-primary/90 transition-colors rounded-full text-sm inline-block">
              {resumeFileName ? "Change Resume" : "Upload Resume"}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </label>
            {resumeFileName && (
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-5 h-5 text-md-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <span className="text-md-on-surface">{resumeFileName}</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            {user.resume ? (
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-md-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <div>
                  <p className="text-md-on-surface">{resumeFileName || "Resume"}</p>
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-md-primary hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-md-on-surface-variant text-sm">No resume uploaded yet.</p>
            )}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveProfile}
            className="bg-md-primary hover:bg-md-primary/90 text-md-on-primary px-6 py-2 rounded-full transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const ProfessionalInfoTab = () => (
    <div className="bg-md-surface-container p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-md-on-surface">Professional Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-md-primary hover:text-md-primary/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={user.title}
              onChange={handleInputChange}
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
            />
            <label
              htmlFor="title"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Professional Title
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select
                id="experience"
                name="experience"
                value={user.experience}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
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
                <svg className="w-5 h-5 text-md-on-surface-variant" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                id="industry"
                name="industry"
                value={user.industry}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
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
                <svg className="w-5 h-5 text-md-on-surface-variant" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={user.location}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
              />
              <label
                htmlFor="location"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                Location
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="desiredSalary"
                name="desiredSalary"
                value={user.desiredSalary}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
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

          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">Work Preference</label>
            <div className="grid grid-cols-3 gap-4">
              {["remote", "hybrid", "onsite"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`
                    px-6 py-2 rounded-full transition-colors
                    ${
                      user.workPreference === type
                        ? "bg-md-primary-container text-md-on-primary-container"
                        : "border border-md-outline-variant text-md-on-surface hover:bg-md-surface-variant"
                    }
                  `}
                  onClick={() => setUser({ ...user, workPreference: type })}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={user.linkedin || ""}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
              />
              <label
                htmlFor="linkedin"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                LinkedIn URL
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="github"
                name="github"
                value={user.github || ""}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
              />
              <label
                htmlFor="github"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                GitHub URL
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="portfolio"
                name="portfolio"
                value={user.portfolio || ""}
                onChange={handleInputChange}
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-md appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
              />
              <label
                htmlFor="portfolio"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                Portfolio URL
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveProfile}
              className="bg-md-primary hover:bg-md-primary/90 text-md-on-primary px-6 py-2 rounded-full transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-md-on-surface-variant">Experience</h4>
              <p className="text-md-on-surface">{user.experience || "Not specified"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-md-on-surface-variant">Industry</h4>
              <p className="text-md-on-surface">{user.industry || "Not specified"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-md-on-surface-variant">Location</h4>
              <p className="text-md-on-surface">{user.location || "Not specified"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-md-on-surface-variant">Work Preference</h4>
              <p className="text-md-on-surface capitalize">{user.workPreference || "Not specified"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-md-on-surface-variant">Desired Salary</h4>
              <p className="text-md-on-surface">{user.desiredSalary || "Not specified"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-md-outline-variant">
            <h4 className="text-sm font-medium text-md-on-surface-variant mb-2">Professional Links</h4>
            <div className="flex flex-wrap gap-4">
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-md-surface-container-high rounded-full text-md-primary hover:bg-md-surface-container-highest transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-md-surface-container-high rounded-full text-md-primary hover:bg-md-surface-container-highest transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {user.portfolio && (
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-md-surface-container-high rounded-full text-md-primary hover:bg-md-surface-container-highest transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  Portfolio
                </a>
              )}
              {!user.linkedin && !user.github && !user.portfolio && (
                <p className="text-md-on-surface-variant text-sm">No professional links added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const SkillsTab = () => (
    <div className="bg-md-surface-container p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-md-on-surface">Skills & Experience</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-md-primary hover:text-md-primary/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">Skills</label>
            {user.skills && user.skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(e, index)}
                  className="flex-1 px-4 py-2 rounded-full border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface focus:outline-none"
                  placeholder="Add a skill"
                />
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="p-2 rounded-full text-md-error hover:bg-md-error-container"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handleAddSkill}
              className="mt-2 text-md-primary hover:text-md-primary/80 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Skill
            </button>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">Languages</label>
            {user.languages && user.languages.map((language, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleLanguageChange(e, index)}
                  className="flex-1 px-4 py-2 rounded-full border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface focus:outline-none"
                  placeholder="Add a language"
                />
                <button
                  onClick={() => handleRemoveLanguage(index)}
                  className="p-2 rounded-full text-md-error hover:bg-md-error-container"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handleAddLanguage}
              className="mt-2 text-md-primary hover:text-md-primary/80 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Language
            </button>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">Education</label>
            {user.education && user.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border border-md-outline-variant rounded-2xl bg-md-surface-container-high">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(e, index, 'degree')}
                      className="w-full px-4 py-2 rounded-xl border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface focus:outline-none"
                      placeholder="Degree"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(e, index, 'institution')}
                      className="w-full px-4 py-2 rounded-xl border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface focus:outline-none"
                      placeholder="Institution"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="relative w-1/3">
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => handleEducationChange(e, index, 'graduationYear')}
                      className="w-full px-4 py-2 rounded-xl border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface focus:outline-none"
                      placeholder="Year"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    className="text-md-error hover:text-md-error/80"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddEducation}
              className="mt-2 text-md-primary hover:text-md-primary/80 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Education
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveProfile}
              className="bg-md-primary hover:bg-md-primary/90 text-md-on-primary px-6 py-2 rounded-full transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium text-md-on-surface-variant mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 bg-md-primary-container text-md-on-primary-container rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-md-on-surface-variant text-sm">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-sm font-medium text-md-on-surface-variant mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {user.languages && user.languages.length > 0 ? (
                user.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 bg-md-secondary-container text-md-on-secondary-container rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <p className="text-md-on-surface-variant text-sm">No languages added yet.</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h4 className="text-sm font-medium text-md-on-surface-variant mb-2">Education</h4>
            <div className="space-y-4">
              {user.education && user.education.length > 0 ? (
                user.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-md-surface-container-high rounded-2xl">
                    <div className="flex justify-between">
                      <div>
                        <h5 className="font-medium text-md-on-surface">{edu.degree}</h5>
                        <p className="text-md-on-surface-variant">{edu.institution}</p>
                      </div>
                      <p className="text-md-on-surface-variant">{edu.graduationYear}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-md-on-surface-variant text-sm">No education added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const SecurityTab = () => (
    <div className="bg-md-surface-container p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-md-on-surface">Security Settings</h3>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-medium text-md-on-surface mb-2">Passkey Management</h4>
          <p className="text-md-on-surface-variant mb-4">
            Passkeys let you sign in without a password using your device's authentication methods.
          </p>
          <button
            onClick={handleAddPasskey}
            disabled={isRegistering}
            className="bg-md-primary hover:bg-md-primary/90 text-md-on-primary px-6 py-2 rounded-full transition-colors disabled:opacity-50"
          >
            {isRegistering ? "Registering..." : "Add Passkey"}
          </button>
        </div>

        <div>
          <h4 className="text-lg font-medium text-md-on-surface mb-3">Your Passkeys</h4>
          {passkeys.length === 0 ? (
            <div className="bg-md-surface-container-high rounded-2xl p-6 text-center">
              <div className="text-5xl mb-4">🔑</div>
              <p className="text-md-on-surface-variant">No passkeys registered</p>
              <p className="text-sm text-md-on-surface-variant mt-1">
                Add a passkey to enable password-less login
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {passkeys.map((passkey) => (
                <div
                  key={passkey.cred_id}
                  className="flex items-center justify-between p-4 bg-md-surface-container-high rounded-2xl shadow-sm border border-md-outline-variant hover:border-md-outline transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="text-2xl p-3 bg-md-tertiary-container rounded-full text-md-on-tertiary-container"
                      role="img"
                      aria-label="device icon"
                    >
                      {getDeviceIcon(passkey.deviceOS)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-md-on-surface">
                          {passkey.deviceName}
                        </span>
                        <span className="text-xs text-md-on-surface-variant">•</span>
                        <span className="text-sm text-md-on-surface-variant">
                          {passkey.browser}
                        </span>
                      </div>
                      <div className="text-sm text-md-on-surface-variant">
                        <span>{passkey.deviceOS}</span>
                        <span className="mx-2">•</span>
                        <span>
                          Added {new Date(passkey.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePasskey(passkey.cred_id)}
                    className="ml-4 p-2 text-md-on-surface-variant hover:text-md-error hover:bg-md-error-container/20 rounded-full transition-colors"
                    aria-label="Delete passkey"
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
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-lg font-medium text-md-on-surface mb-3">Password Management</h4>
          <button
            className="mb-4 px-6 py-2 border border-md-outline text-md-on-surface hover:bg-md-surface-container-high rounded-full transition-colors"
          >
            Change Password
          </button>
          <p className="text-sm text-md-on-surface-variant">
            Using passkeys? You won't need to remember or enter your password again.
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-md-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-md-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-md-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-md-on-surface">Your Profile</h1>
          <p className="text-md-on-surface-variant mt-1">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-1 bg-md-surface-container-high p-1 rounded-full">
            {[
              { id: "personal", label: "Personal Info", icon: "👤" },
              { id: "professional", label: "Professional", icon: "💼" },
              { id: "skills", label: "Skills", icon: "🧠" },
              { id: "security", label: "Security", icon: "🔒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-md-primary-container text-md-on-primary-container"
                    : "hover:bg-md-surface-variant text-md-on-surface-variant"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "personal" && <PersonalInfoTab />}
          {activeTab === "professional" && <ProfessionalInfoTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
