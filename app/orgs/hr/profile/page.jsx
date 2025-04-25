"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { startRegistration } from "@simplewebauthn/browser";
// Import cache methods from store
import useStore from "@/app/store";
import { motion } from "framer-motion";
import TabView from "@/app/components/TabView";

// Define cache keys
const PROFILE_CACHE_KEY = "hrProfileData";
const PASSKEYS_CACHE_KEY = "hrPasskeysData";

const HR = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  // Get cache methods from store
  const { userdata, setUserdata, setTitle, getCache, setCache } = useStore();
  const [passkeys, setPasskeys] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    setTitle("HR Profile");
    fetchPasskeys();
    fetchProfile();
  }, []); // Removed getCache, setCache from dependency array as they are stable

  const fetchProfile = async () => {
    // Check cache first
    const cachedProfile = getCache(PROFILE_CACHE_KEY);
    if (cachedProfile) {
      console.log("Using cached profile data");
      setProfile(cachedProfile);
      setUserdata(cachedProfile);
      if (cachedProfile.profilePicture) {
        setPreviewImage(cachedProfile.profilePicture);
      }
      setLoading(false); // Ensure loading is false if using cache
      return; // Exit if cache hit
    }

    console.log("Fetching profile data from API");
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
      setUserdata(data);
      if (data.profilePicture) {
        setPreviewImage(data.profilePicture);
      }
      // Store fetched data in cache
      setCache(PROFILE_CACHE_KEY, data);
      console.log("Profile data cached");
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
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

      // Only handling profile picture updates now
      const formData = new FormData();

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hr/profile`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Failed to update profile picture");

        toast.success("Profile picture updated successfully");
        // Clear profile cache after successful update
        setCache(PROFILE_CACHE_KEY, undefined);
        console.log("Profile cache cleared after update");
        fetchProfile(); // Refresh profile data
      } else {
        toast.info("No changes to save");
        setSaving(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile picture");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Passkey Management (similar to candidate profile)
  const fetchPasskeys = async () => {
    // Check cache first
    const cachedPasskeys = getCache(PASSKEYS_CACHE_KEY);
    if (cachedPasskeys) {
      console.log("Using cached passkeys data");
      setPasskeys(cachedPasskeys);
      return; // Exit if cache hit
    }

    console.log("Fetching passkeys data from API");
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
      // Store fetched data in cache
      setCache(PASSKEYS_CACHE_KEY, data);
      console.log("Passkeys data cached");
    } catch (error) {
      toast.error("Failed to load passkeys");
      console.error(error);
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
      // Clear passkeys cache after successful deletion
      setCache(PASSKEYS_CACHE_KEY, undefined);
      console.log("Passkeys cache cleared after deletion");
      fetchPasskeys(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to delete passkey");
      console.error(error);
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
          toast.error("Registration timed out. Please try again.");
        } else {
          toast.error("An error occurred during registration.");
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
      // Clear passkeys cache after successful registration
      setCache(PASSKEYS_CACHE_KEY, undefined);
      console.log("Passkeys cache cleared after registration");
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

  // Define tabs with icons for better visual recognition
  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
      </div>
    );
  }

  return (
    <div className="text-xl h-full w-full">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile TabView */}
        <div className="md:hidden">
          <TabView
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {/* Personal Information */}
            {activeTab === "personal" && (
              <div className=" p-6 sm:p-8  shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Personal Information
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                    Full Name
                  </label>
                  <div className="px-6 py-3 rounded-3xl border border-md-outline bg-md-surface-container-high text-md-on-surface">
                    {profile.name || "Not provided"}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                    Email Address
                  </label>
                  <div className="px-6 py-3 rounded-3xl border border-md-outline bg-md-surface-container-high text-md-on-surface">
                    {profile.email || "Not provided"}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                    Department
                  </label>
                  <div className="px-6 py-3 rounded-3xl border border-md-outline bg-md-surface-container-high text-md-on-surface">
                    {profile.department || "Not provided"}
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
                          onChange={handleProfilePictureChange}
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
                            onClick={() => handleDeletePasskey(passkey.cred_id)}
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
        <div className="hidden md:block flex-1 overflow-y-auto px-4 py-4">
          {/* Personal Information */}
          {activeTab === "personal" && (
            <div className="bg-md-surface-container p-6 sm:p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                Personal Information
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                  Full Name
                </label>
                <div className="px-6 py-3 rounded-3xl border border-md-outline bg-md-surface-container-high text-md-on-surface">
                  {profile.name || "Not provided"}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                  Email Address
                </label>
                <div className="px-6 py-3 rounded-3xl border border-md-outline bg-md-surface-container-high text-md-on-surface">
                  {profile.email || "Not provided"}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                  Department
                </label>
                <div className="px-6 py-3 rounded-3xl border border-md-outline bg-md-surface-container-high text-md-on-surface">
                  {profile.department || "Not provided"}
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
                      htmlFor="profile-upload-desktop"
                      className="cursor-pointer inline-block px-6 py-2 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200"
                    >
                      Choose File
                      <input
                        type="file"
                        id="profile-upload-desktop"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
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
                          onClick={() => handleDeletePasskey(passkey.cred_id)}
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
    </div>
  );
};

export default HR;
