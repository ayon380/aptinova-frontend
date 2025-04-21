"use client";
import React, { useState, useEffect } from "react";
// Remove react-toastify import
// import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/app/store";
import Image from "next/image";

const HRManagerProfile = () => {
  const { setTitle, userdata } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Renamed from saveLoading for consistency
  const [previewImage, setPreviewImage] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  // Add state for custom notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    profilePicture: "",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    setTitle("Profile");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Fetch profile data from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hrm/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile data");
      
      const data = await response.json();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        department: data.department || "",
        role: data.role || "",
        profilePicture: data.profilePicture || "",
      });

      if (data.profilePicture) {
        setPreviewImage(data.profilePicture);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Use custom notification
      setNotification({
        open: true,
        message: "Failed to load profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true); // Use setSaving

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("department", profile.department);
      formData.append("role", profile.role);

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hrm/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      setProfile({
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
        department: updatedProfile.department || "",
        role: updatedProfile.role || "",
        profilePicture: updatedProfile.profilePicture || "",
      });

      // Use custom notification
      setNotification({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      // Use custom notification
      setNotification({
        open: true,
        message: error.message || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setSaving(false); // Use setSaving
    }
  };

  // Add function to hide notification
  const hideNotification = () => {
    setNotification({ ...notification, open: false });
  };


  if (loading) {
    // Use loading indicator from settings page
    return (
      <div className="flex justify-center items-center h-screen max-h-[calc(100vh-120px)] flex-col gap-2 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg text-md-on-surface-variant text-center">
            Loading profile data...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    // Adjust main container styles
    <div className="flex flex-col w-full bg-md-background h-full">
      {/* Use overflow-y-auto and padding like settings page */}
      <div className="flex flex-1 pt-2 md:pt-5 md:rounded-tl-3xl md:bg-md-surface-container h-full overflow-y-auto">
        <div className="flex-1 flex flex-col h-full min-w-0 px-4 md:px-6 py-4 pb-24"> {/* Added padding and pb-24 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto w-full" // Ensure it takes full width within padding
          >
            {/* Profile Header */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center mb-8"
            >
              <div className="mb-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-md-primary-container bg-md-surface-container group">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-md-surface-container text-md-on-surface-variant text-5xl">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <label
                    htmlFor="profile-picture-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity z-10"
                  >
                    <span className="text-white text-sm">Change Photo</span>
                  </label>
                  <input
                    type="file"
                    id="profile-picture-upload"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="sr-only"
                  />
                </div>
                <h1 className="text-2xl font-bold text-md-on-surface text-center mt-4">{profile.name || "HR Manager"}</h1>
                <p className="text-md-on-surface-variant text-center">{profile.role || "Human Resources"}</p>
              </div>
            </motion.div>

            {/* Profile Form - Removed onSubmit here, handled by FAB */}
            <motion.form
              variants={containerVariants}
              className="space-y-6"
              // onSubmit={handleSubmit} // Removed onSubmit
            >
              <motion.div variants={itemVariants} className="bg-md-surface p-4 sm:p-6 rounded-3xl shadow-sm"> {/* Changed container */}
                <h2 className="text-xl font-semibold mb-6 text-md-on-surface">Personal Information</h2>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Adjusted styles
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Adjusted styles
                    >
                      Full Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Adjusted styles
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Adjusted styles
                    >
                      Email Address
                    </label>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-md-surface p-4 sm:p-6 rounded-3xl shadow-sm"> {/* Changed container */}
                <h2 className="text-xl font-semibold mb-6 text-md-on-surface">Professional Information</h2>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={profile.department}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Adjusted styles
                      placeholder=" "
                    />
                    <label
                      htmlFor="department"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Adjusted styles
                    >
                      Department
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="role"
                      id="role"
                      value={profile.role}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Adjusted styles
                      placeholder=" "
                    />
                    <label
                      htmlFor="role"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Adjusted styles
                    >
                      Job Title
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Removed Submit Button */}
              {/* <motion.div
                variants={itemVariants}
                className="flex justify-end"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ... button code ...
              </motion.div> */}
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button (FAB) - Added */}
      <motion.button
        onClick={handleSubmit}
        disabled={saving}
        className="fixed right-4 sm:right-6 bottom-20 z-40 h-12 sm:h-14 px-4 sm:px-6 rounded-full bg-md-primary text-md-on-primary shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        {saving ? (
          <div className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
            <span className="text-sm sm:text-base">Saving</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-sm sm:text-base">Save</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 ml-2"
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

      {/* Notification Toast - Added */}
      <AnimatePresence>
        {notification.open && (
          <motion.div
            className="fixed bottom-24 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div
              className={`py-3 px-4 rounded-full shadow-md flex items-center justify-between ${
                notification.severity === "success"
                  ? "bg-md-primary-container text-md-on-primary-container"
                  : "bg-md-error-container text-md-on-error-container"
              }`}
            >
              <span className="text-sm sm:text-base">
                {notification.message}
              </span>
              <button
                onClick={hideNotification} // Use hideNotification
                className="p-1 rounded-full hover:bg-black/10 ml-2 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRManagerProfile;
