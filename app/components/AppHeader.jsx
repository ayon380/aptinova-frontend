"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion import
import useStore from "../store";
export default function AppHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { userdata, title, setuserdata } = useStore();
  console.log("userdata", userdata);

  useEffect(() => {
    async function fetchProfile() {
      console.log("fetching profile");

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
      setuserdata(data);
    }
    if (Object.keys(userdata).length === 0) {
      fetchProfile();
    }
    console.log("userdata", userdata);
  }, [userdata, setuserdata]);
  // Subscription tier colors
  const tierColors = {
    free: "bg-md-tertiary-container",
    pro: "bg-md-primary-container",
    enterprise: "bg-md-secondary-container",
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <>
      <header className="bg-md-surface  sticky top-0 z-30 h-16 flex items-center px-4 ">
        <h1 className="text-3xl font-medium text-md-on-surface mr-auto">
          {title}
        </h1>

        <motion.button
          onClick={() => setShowProfileMenu(true)}
          className="relative"
          aria-label="Open profile menu"
          whileTap={{ scale: 0.95 }}
        >
          <div
            className={`${
              userdata?.tier
                ? tierColors[userdata.tier]
                : "bg-md-surface-variant"
            } rounded-full p-0.5`}
          >
            {userdata?.profilePicture ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={userdata.profilePicture}
                  alt={`${userdata.firstName}'s profile`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-md-surface flex items-center justify-center">
                <span className="text-md-on-surface text-lg font-medium">
                  {userdata?.firstName?.charAt(0) ||
                    userdata?.email?.charAt(0)?.toUpperCase() ||
                    "?"}
                </span>
              </div>
            )}
          </div>

          {/* Subscription badge */}
          {userdata?.tier && userdata.tier !== "free" && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-md-primary flex items-center justify-center text-xs text-md-on-primary font-bold">
              {userdata.tier === "pro" ? "P" : "E"}
            </div>
          )}
        </motion.button>
      </header>

      {/* Profile Dialog - Mobile Bottom Sheet / Desktop Dialog */}
      <AnimatePresence>
        {showProfileMenu && (
          <>
            <motion.div
              className="fixed inset-0  bg-black/50 z-40"
              onClick={() => setShowProfileMenu(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Mobile bottom sheet */}
            <motion.div
              className="fixed z-50 bg-md-surface rounded-t-3xl shadow-lg bottom-0 left-0 right-0 md:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
            >
              <div className="flex justify-center py-1.5">
                <div className="w-12 h-1.5 rounded-full bg-md-outline-variant"></div>
              </div>

              <div className="p-4">
                {/* User info */}
                <div className="flex items-center space-x-4 p-2">
                  {userdata?.profilePicture ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <Image
                        src={userdata.profilePicture}
                        alt="Profile"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-md-surface-container-high flex items-center justify-center">
                      <span className="text-md-on-surface text-xl font-medium">
                        {userdata?.firstName?.charAt(0) ||
                          userdata?.email?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-md-on-surface">
                      {userdata?.firstName
                        ? `${userdata.firstName} ${userdata.lastName || ""}`
                        : userdata?.email || "User"}
                    </h3>
                    <p className="text-sm text-md-on-surface-variant">
                      {userdata?.email}
                    </p>
                    {userdata?.tier && (
                      <div
                        className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs
                        ${
                          userdata.tier === "pro"
                            ? "bg-md-primary-container text-md-on-primary-container"
                            : userdata.tier === "enterprise"
                            ? "bg-md-secondary-container text-md-on-secondary-container"
                            : "bg-md-tertiary-container text-md-on-tertiary-container"
                        }`}
                      >
                        {userdata.tier.charAt(0).toUpperCase() +
                          userdata.tier.slice(1)}{" "}
                        Plan
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-md-outline-variant pt-4">
                  <nav className="space-y-2">
                    <Link
                      href="/candidate/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-full hover:bg-md-surface-variant text-md-on-surface w-full text-left"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-md-surface-variant text-md-on-surface w-full text-left"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-md-surface-variant text-md-on-surface w-full text-left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-2-2V15H4V5h8.586l-2-2H3z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M14.707 3.293a1 1 0 010 1.414L10.414 9H13a1 1 0 110 2h-5a1 1 0 01-1-1V5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>
            </motion.div>

            {/* Desktop dropdown */}
            <motion.div
              className="hidden md:block absolute  z-50 bg-md-surface rounded-xl shadow-lg top-16 right-4 w-80"
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
                transformOrigin: "top right",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="p-4">
                {/* User info */}
                <div className="flex items-center space-x-4 p-2">
                  {userdata?.profilePicture ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <Image
                        src={userdata.profilePicture}
                        alt="Profile"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-md-surface-container-high flex items-center justify-center">
                      <span className="text-md-on-surface text-xl font-medium">
                        {userdata?.firstName?.charAt(0) ||
                          userdata?.email?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-md-on-surface">
                      {userdata?.firstName
                        ? `${userdata.firstName} ${userdata.lastName || ""}`
                        : userdata?.email || "User"}
                    </h3>
                    <p className="text-sm text-md-on-surface-variant">
                      {userdata?.email}
                    </p>
                    {userdata?.tier && (
                      <div
                        className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs
                        ${
                          userdata.tier === "pro"
                            ? "bg-md-primary-container text-md-on-primary-container"
                            : userdata.tier === "enterprise"
                            ? "bg-md-secondary-container text-md-on-secondary-container"
                            : "bg-md-tertiary-container text-md-on-tertiary-container"
                        }`}
                      >
                        {userdata.tier.charAt(0).toUpperCase() +
                          userdata.tier.slice(1)}{" "}
                        Plan
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-md-outline-variant pt-4">
                  <nav className="space-y-2">
                    <Link
                      href="/candidate/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-md-surface-variant text-md-on-surface w-full text-left"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-md-surface-variant text-md-on-surface w-full text-left"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-md-surface-variant text-md-on-surface w-full text-left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-2-2V15H4V5h8.586l-2-2H3z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M14.707 3.293a1 1 0 010 1.414L10.414 9H13a1 1 0 110 2h-5a1 1 0 01-1-1V5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
