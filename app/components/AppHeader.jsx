"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion import
import useStore from "../store";

// Modern animated theme toggle component
const ThemeToggle = ({ activeTheme, onThemeChange }) => {
  const variants = {
    light: { x: 0 },
    dark: { x: "100%" },
    system: { x: "200%" },
  };

  const indicators = {
    light: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-md-primary"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>
    ),
    dark: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-md-primary"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </motion.div>
    ),
    system: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-md-primary"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>
    ),
  };

  return (
    <div className="relative h-10 w-full bg-md-surface-container-high rounded-full p-1 overflow-hidden">
      {/* Track */}
      <div className="relative h-full w-full grid grid-cols-3">
        {/* Theme positions */}
        <button
          onClick={() => onThemeChange("light")}
          className="relative z-10 flex items-center justify-center"
          aria-label="Light theme"
        >
          {activeTheme !== "light" && indicators.light}
        </button>
        <button
          onClick={() => onThemeChange("dark")}
          className="relative z-10 flex items-center justify-center"
          aria-label="Dark theme"
        >
          {activeTheme !== "dark" && indicators.dark}
        </button>
        <button
          onClick={() => onThemeChange("system")}
          className="relative z-10 flex items-center justify-center"
          aria-label="System theme"
        >
          {activeTheme !== "system" && indicators.system}
        </button>

        {/* Indicator */}
        <motion.div
          className="absolute w-1/3 h-full bg-md-primary-container rounded-full"
          variants={variants}
          initial={activeTheme}
          animate={activeTheme}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
        />

        {/* Current theme indicator */}
        <motion.div
          className="absolute w-1/3 h-full flex items-center justify-center"
          variants={variants}
          initial={activeTheme}
          animate={activeTheme}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
        >
          {indicators[activeTheme]}
        </motion.div>
      </div>
    </div>
  );
};

export default function AppHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { userdata, title, theme, setTheme } = useStore();

  // Subscription tier colors
  const tierColors = {
    free: "bg-md-tertiary-container",
    pro: "bg-md-primary-container",
    enterprise: "bg-md-secondary-container",
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("aptinova-storage");
    router.push("/auth/login");
  };

  // Enhanced theme changing handler with vibration feedback
  const handleThemeChange = (newTheme) => {
    // Only apply vibration if the browser supports it
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // Short 50ms vibration for feedback
    }

    // Visual animation feedback
    setTheme(newTheme);
  };

  // Get current theme name for display
  const getThemeName = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "System";
    }
  };

  return (
    <>
      <header className="bg-md-surface  top-0 z-30 h-16 flex items-center px-4">
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
              className="fixed inset-0 bg-black/50 z-40"
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
                    {/* Modern Theme selector */}
                    <div className="px-4 py-3">
                      <div className="flex items-center mb-3">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-md-on-surface font-medium"
                        >
                          Theme
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto text-sm text-md-on-surface-variant"
                        >
                          {getThemeName()}
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring" }}
                      >
                        <ThemeToggle
                          activeTheme={theme}
                          onThemeChange={handleThemeChange}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="mt-2 grid grid-cols-3 gap-2"
                      >
                        <div className="text-center text-xs text-md-on-surface-variant">
                          Light
                        </div>
                        <div className="text-center text-xs text-md-on-surface-variant">
                          Dark
                        </div>
                        <div className="text-center text-xs text-md-on-surface-variant">
                          System
                        </div>
                      </motion.div>
                    </div>

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
              className="hidden md:block absolute z-50 bg-md-surface rounded-xl shadow-lg top-16 right-4 w-80"
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
                    {/* Modern Theme selector - Desktop */}
                    <div className="px-4 py-3">
                      <div className="flex items-center mb-3">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-md-on-surface font-medium"
                        >
                          Theme
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto text-sm text-md-on-surface-variant"
                        >
                          {getThemeName()}
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring" }}
                      >
                        <ThemeToggle
                          activeTheme={theme}
                          onThemeChange={handleThemeChange}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="mt-2 grid grid-cols-3 gap-2"
                      >
                        <div className="text-center text-xs text-md-on-surface-variant">
                          Light
                        </div>
                        <div className="text-center text-xs text-md-on-surface-variant">
                          Dark
                        </div>
                        <div className="text-center text-xs text-md-on-surface-variant">
                          System
                        </div>
                      </motion.div>
                    </div>

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
