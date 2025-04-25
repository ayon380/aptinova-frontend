"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TabView from "@/app/components/TabView";
import axios from "axios"; // Import axios for the form submission
import useStore from "@/app/store";

const OrganizationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { setTitle, setCache, getCache } = useStore();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [organization, setOrganization] = useState({
    companyName: "",
    email: "",
    website: "",
    phone: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    headquarters: "",
    type: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    contactPerson: {
      name: "",
      position: "",
      email: "",
      phone: "",
    },
    description: "",
    logo: "",
    linkedin: "",
    twitter: "",
    subdomain: "",
    benefits: {
      healthInsurance: false,
      dentalInsurance: false,
      retirement: false,
      paidTimeOff: false,
      flexibleHours: false,
      remoteWork: false,
      professionalDevelopment: false,
      other: "",
    },
    culture: {
      values: "",
      mission: "",
      vision: "",
    },
  });

  useEffect(() => {
    setTitle("Organization Settings");
    fetchOrganizationData(false);
  }, []);

  // Pull to refresh functionality
  useEffect(() => {
    let startY = 0;
    let endY = 0;
    const threshold = 100;

    const touchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const touchMove = (e) => {
      endY = e.touches[0].clientY;
    };

    const touchEnd = () => {
      if (endY - startY > threshold && window.scrollY === 0 && !refreshing) {
        handlePullToRefresh();
      }
    };

    document.addEventListener("touchstart", touchStart);
    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchEnd);

    return () => {
      document.removeEventListener("touchstart", touchStart);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
    };
  }, [refreshing]);

  const handlePullToRefresh = () => {
    setRefreshing(true);
    fetchOrganizationData(true).finally(() => {
      setTimeout(() => setRefreshing(false), 1000);
    });
  };

  const fetchOrganizationData = async (forceRefresh = false) => {
    setLoading(true);

    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = getCache("organizationData");
      if (cachedData) {
        console.log("Using cached organization data");
        setOrganization(cachedData);
        if (cachedData.logo) {
          setLogoPreview(cachedData.logo);
        }
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hrm/organization`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();

      // Ensure all properties exist before setting state to avoid null values
      const safeData = {
        ...organization,
        ...data,
        contactPerson: {
          ...organization.contactPerson,
          ...(data.contactPerson || {}),
        },
        benefits: {
          ...organization.benefits,
          ...(data.benefits || {}),
        },
        culture: {
          ...organization.culture,
          ...(data.culture || {}),
        },
      };

      // Cache the data
      setCache("organizationData", safeData);

      setOrganization(safeData);
      if (data.logo) {
        setLogoPreview(data.logo);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching organization data:", error);
      setNotification({
        open: true,
        message: "Failed to load organization data",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setOrganization({
        ...organization,
        [parent]: {
          ...organization[parent],
          [child]: value,
        },
      });
    } else {
      setOrganization({ ...organization, [name]: value });
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(organization).forEach((key) => {
        if (
          key === "contactPerson" ||
          key === "benefits" ||
          key === "culture"
        ) {
          formData.append(key, JSON.stringify(organization[key]));
        } else {
          formData.append(key, organization[key]);
        }
      });

      // Append logo file if it exists
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/hrm/organization`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Update cache with new data
      setCache("organizationData", response.data);

      setOrganization(response.data);
      setNotification({
        open: true,
        message: "Organization updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating organization:", error);
      setNotification({
        open: true,
        message: "Failed to update organization",
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const hideNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
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
            Loading organization data...
          </p>
        </motion.div>
      </div>
    );
  }

  // Define tabs with icons for better visual recognition
  const tabs = [
    { id: "company", label: "Company Info", icon: "💼" },
    { id: "contact", label: "Location & Contact", icon: "📍" },
    { id: "person", label: "Contact Person", icon: "👤" },
    { id: "culture", label: "Culture & Benefits", icon: "🏆" },
  ];

  return (
    <div className="flex flex-col w-screen p-5 md:w-full bg-md-background ">
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-2">
          <div className="bg-md-primary-container text-md-on-primary-container py-2 px-4 rounded-full shadow-md flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-current rounded-full mr-2 border-t-transparent"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Changed overflow-hidden to overflow-y-auto */}
      <div className="flex flex-1 pt-2 md:pt-5 md:rounded-tl-3xl md:bg-md-surface-container h-full overflow-y-auto">
        {/* Added min-w-0 */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Mobile TabView - Horizontal scrollable tabs */}
          <div className="md:hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex px-4 py-2 space-x-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-3 py-2 whitespace-nowrap rounded-full transition-colors text-sm ${
                      activeTab === tab.id
                        ? "bg-md-primary-container text-md-on-primary-container font-medium"
                        : "text-md-on-surface hover:bg-md-surface-variant"
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Removed px-3 */}
            <div className="py-2 pb-24 overflow-y-auto">
              {renderTabContent(activeTab)}
            </div>
          </div>

          {/* Desktop Header and Tabs */}
          <div className="hidden md:block mb-4">
            <div className="px-6 mb-4">
              <h1 className="text-3xl font-bold text-md-on-surface mb-2">
                Organization Settings
              </h1>
              <div className="flex items-center flex-wrap">
                <p className="text-md-on-surface-variant">
                  Manage your organization's profile and settings
                </p>
                <button
                  onClick={() => fetchOrganizationData(true)}
                  className="ml-4 text-md-primary flex items-center text-sm hover:underline"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 9h7V2l-2.35 2.35z" />
                  </svg>
                  Refresh Data
                </button>
              </div>
            </div>
            <div className="px-4 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 py-2 min-w-max">
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

          {/* Desktop Tab Content */}
          {/* Changed overflow-hidden to overflow-y-auto */}
          <div className="hidden md:block flex-1 overflow-y-auto px-6 py-4 pb-24">
            {renderTabContent(activeTab)}
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) - Material Design 3 style */}
      <motion.button
        onClick={handleSubmit}
        disabled={saveLoading}
        className="fixed right-4 sm:right-6 bottom-24 z-40 h-12 sm:h-14 px-4 sm:px-6 rounded-full bg-md-primary text-md-on-primary shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        {saveLoading ? (
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

      {/* Notification Toast */}
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
                onClick={() =>
                  setNotification({ ...notification, open: false })
                }
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

  function renderTabContent(tab) {
    switch (tab) {
      case "company":
        return (
          <motion.div
            key="company-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full "
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-md-surface-container-high flex items-center justify-center border border-md-outline mb-4">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-md-on-surface-variant">
                      <svg
                        className="w-10 h-10 md:w-16 md:h-16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <div className="px-4 py-2 text-xs md:text-base md:px-6 md:py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200">
                      Upload Logo
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                    </div>
                  </motion.div>
                </label>
              </div>

              {/* Removed overflow-hidden */}
              <div className="w-full md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={organization.companyName || ""}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="companyName"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Company Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="industry"
                      id="industry"
                      value={organization.industry || ""}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="industry"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Industry
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="type"
                      id="type"
                      value={organization.type || ""}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="type"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Company Type
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="companySize"
                      id="companySize"
                      value={organization.companySize || ""}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="companySize"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Company Size
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      name="foundedYear"
                      id="foundedYear"
                      value={organization.foundedYear || ""}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="foundedYear"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Founded Year
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="subdomain"
                      id="subdomain"
                      value={organization.subdomain || ""}
                      onChange={handleChange}
                      className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="subdomain"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Subdomain
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  value={organization.description || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="description"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Company Description
                </label>
              </div>
            </div>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            key="location-contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-md-surface-container p-4 sm:p-8 rounded-3xl shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={organization.email || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={organization.phone || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="phone"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Phone
                </label>
              </div>

              <div className="relative md:col-span-2">
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={organization.website || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="website"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Website
                </label>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-md-on-surface">
              Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={organization.address || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="address"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Address
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={organization.city || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="city"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  City
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={organization.country || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="country"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Country
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  value={organization.zipCode || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="zipCode"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  ZIP Code
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="headquarters"
                  id="headquarters"
                  value={organization.headquarters || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="headquarters"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Headquarters
                </label>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-md-on-surface">
              Social Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 md:left-6 top-1/2 -mt-2 text-md-on-surface-variant">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  value={organization.linkedin || ""}
                  onChange={handleChange}
                  className="block w-full pl-12 md:pl-14 pr-4 md:pr-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="linkedin"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-12 md:left-14 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  LinkedIn
                </label>
              </div>

              <div className="relative">
                <div className="absolute left-4 md:left-6 top-1/2 -mt-2 text-md-on-surface-variant">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.028 10.028 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="twitter"
                  id="twitter"
                  value={organization.twitter || ""}
                  onChange={handleChange}
                  className="block w-full pl-12 md:pl-14 pr-4 md:pr-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="twitter"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-12 md:left-14 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Twitter
                </label>
              </div>
            </div>
          </motion.div>
        );

      case "person":
        return (
          <motion.div
            key="contact-person"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-md-surface-container p-4 sm:p-8 rounded-3xl shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
              Primary Contact Person
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  name="contactPerson.name"
                  id="contactName"
                  value={organization.contactPerson.name || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="contactName"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Contact Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="contactPerson.position"
                  id="position"
                  value={organization.contactPerson.position || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="position"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Position
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="contactPerson.email"
                  id="contactEmail"
                  value={organization.contactPerson.email || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="contactEmail"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="contactPerson.phone"
                  id="contactPhone"
                  value={organization.contactPerson.phone || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                  placeholder=" "
                />
                <label
                  htmlFor="contactPhone"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Phone
                </label>
              </div>
            </div>

            <div className="mt-6">
              <div className="p-4 bg-md-surface-variant rounded-3xl">
                <p className="text-md-on-surface-variant text-center">
                  The contact person will be the main point of contact for all
                  communications related to your organization.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "culture":
        return (
          <motion.div
            key="culture-benefits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-md-surface-container p-4 sm:p-8 rounded-3xl shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
              Company Culture
            </h2>

            <div className="mb-6">
              <div className="relative">
                <textarea
                  name="culture.mission"
                  id="mission"
                  rows="3"
                  value={organization.culture.mission || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="mission"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Mission
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <textarea
                  name="culture.vision"
                  id="vision"
                  rows="3"
                  value={organization.culture.vision || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="vision"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Vision
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <textarea
                  name="culture.values"
                  id="values"
                  rows="4"
                  value={organization.culture.values || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="values"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Company Values
                </label>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-md-on-surface">
              Employee Benefits
            </h3>

            <div className="mb-6">
              <div className="relative">
                <textarea
                  name="benefits.other"
                  id="benefits"
                  rows="4"
                  value={organization.benefits.other || ""}
                  onChange={handleChange}
                  className="block w-full px-4 md:px-6 pt-6 pb-1 rounded-3xl text-base md:text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="benefits"
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-4 md:left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                >
                  Benefits Description
                </label>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  }
};

export default OrganizationSettings;
