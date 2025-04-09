"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/app/store";
import Image from "next/image";

const HRManagerProfile = () => {
  const { setTitle, userdata } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  
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
      toast.error("Failed to load profile");
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
      setSaving(true);

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

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <div className="flex-1 px-4 py-8 md:px-8 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
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

          {/* Profile Form */}
          <motion.form 
            variants={containerVariants}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <motion.div variants={itemVariants} className="bg-md-surface-container p-6 rounded-3xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-md-on-surface">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                  />
                  <label
                    htmlFor="name"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
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
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Email Address
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-md-surface-container p-6 rounded-3xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-md-on-surface">Professional Information</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={profile.department}
                    onChange={handleChange}
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                  />
                  <label
                    htmlFor="department"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
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
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-lg appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                  />
                  <label
                    htmlFor="role"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Job Title
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              variants={itemVariants} 
              className="flex justify-end"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors shadow-md disabled:opacity-70 flex items-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                    Saving...
                  </>
                ) : (
                  <>
                    Save Profile
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default HRManagerProfile;
