"use client";
import { useState, useEffect, useRef } from "react"; // Import useRef
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Ensure framer-motion is imported
import useStore from "../store"; // Assuming this path is correct for your project

// Modern animated theme toggle component
const ThemeToggle = ({ activeTheme, onThemeChange }) => {
  // Variants for the sliding indicator background
  const variants = {
    light: { x: 0 },
    dark: { x: "100%" },
    system: { x: "200%" },
  };

  // SVG icons for each theme state
  const indicators = {
    light: (
      <motion.div
        key="light-icon" // Add key for AnimatePresence
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Add exit animation if needed within AnimatePresence context
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Light theme icon (Sun) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-md-primary" // Ensure this class matches your theme system
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
        key="dark-icon"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Dark theme icon (Moon) */}
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
        key="system-icon"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* System theme icon (Desktop/Monitor) */}
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
      {/* Track for the buttons and indicator */}
      <div className="relative h-full w-full grid grid-cols-3">
        {/* Theme selection buttons (clickable areas) */}
        <button
          onClick={() => onThemeChange("light")}
          className="relative z-10 flex items-center justify-center focus:outline-none" // Added focus style removal
          aria-label="Light theme"
        >
          {/* Show icon only if it's NOT the active theme */}
          {activeTheme !== "light" && indicators.light}
        </button>
        <button
          onClick={() => onThemeChange("dark")}
          className="relative z-10 flex items-center justify-center focus:outline-none"
          aria-label="Dark theme"
        >
          {activeTheme !== "dark" && indicators.dark}
        </button>
        <button
          onClick={() => onThemeChange("system")}
          className="relative z-10 flex items-center justify-center focus:outline-none"
          aria-label="System theme"
        >
          {activeTheme !== "system" && indicators.system}
        </button>

        {/* Sliding Indicator Background */}
        <motion.div
          className="absolute w-1/3 h-full bg-md-primary-container rounded-full" // Style for the active indicator background
          variants={variants}
          initial={false} // Don't animate on initial load based on default state
          animate={activeTheme} // Animate to the current active theme position
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
        />

        {/* Animated Icon within the Sliding Indicator */}
        <motion.div
          className="absolute w-1/3 h-full flex items-center justify-center"
          variants={variants}
          initial={false}
          animate={activeTheme}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
        >
          {/* AnimatePresence allows smooth transition between icons */}
          <AnimatePresence initial={false} mode="wait">
             {indicators[activeTheme]}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

// Main App Header Component
export default function AppHeader() {
  // State for controlling the profile menu visibility
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter(); // Next.js router hook
  // Zustand store hook for global state (userdata, title, theme)
  const { userdata, title, theme, setTheme } = useStore();
  // Ref for the mobile bottom sheet element to get its height if needed
  const mobileSheetRef = useRef(null);

  // Color mapping for different subscription tiers
  const tierColors = {
    free: "bg-md-tertiary-container", // Example color class
    pro: "bg-md-primary-container",   // Example color class
    enterprise: "bg-md-secondary-container", // Example color class
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show a notification)
    } finally {
      // Clear local storage related to user session
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("aptinova-storage"); // Clear Zustand persisted state if applicable
      // Redirect to the login page
      router.push("/auth/login");
       // Optionally reset Zustand state if needed
      // useStore.setState({ userdata: null, /* other relevant state resets */ });
    }
  };

  // Function to handle theme changes, includes haptic feedback
  const handleThemeChange = (newTheme) => {
    // Provide haptic feedback if the browser supports the Vibration API
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // Short vibration (50ms)
    }
    // Update the theme using the Zustand store action
    setTheme(newTheme);
  };

  // Helper function to get the display name of the current theme
  const getThemeName = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        // Default to 'System' if the theme state is unexpected
        return "System";
    }
  };

  // *** Handler for mobile bottom sheet drag end ***
  const handleMobileSheetDragEnd = (event, info) => {
    const dragDistanceY = info.offset.y; // Vertical distance dragged
    const dragVelocityY = info.velocity.y; // Vertical velocity at the end of drag

    // --- Thresholds for closing the sheet ---
    // Option 1: Fixed pixel distance
    const minDragDistanceToClose = 100; // Pixels dragged down to trigger close

    // Option 2: Relative distance (e.g., 40% of sheet height)
    // const sheetHeight = mobileSheetRef.current?.offsetHeight || 0;
    // const minDragDistanceToClose = sheetHeight * 0.4;

    // Threshold for velocity (how fast it was "flung")
    const minVelocityToClose = 300; // Velocity threshold

    // --- Check if sheet should close ---
    if (
      dragDistanceY > minDragDistanceToClose || // Dragged down far enough
      dragVelocityY > minVelocityToClose // Or flung downwards fast enough
    ) {
      setShowProfileMenu(false); // Trigger the close animation
    }
    // --- No 'else' needed ---
    // If the conditions aren't met, framer-motion automatically animates
    // the element back to its 'animate' state (y: 0) due to the drag constraints
    // and because the `showProfileMenu` state remains true.
  };


  return (
    <>
      {/* Header Bar */}
      <header className="bg-md-surface top-0 z-30 h-16 flex items-center px-4 sticky"> {/* Made header sticky */}
        {/* Page Title */}
        <h1 className="text-2xl md:text-2xl lg:text-3xl font-medium text-md-on-surface mr-auto truncate"> {/* Adjusted text size and added truncate */}
          {title || "Dashboard"} {/* Fallback title */}
        </h1>

        {/* Profile Picture Button */}
        <motion.button
          onClick={() => setShowProfileMenu(true)}
          className="relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-md-primary rounded-full" // Added focus ring
          aria-label="Open profile menu"
          whileTap={{ scale: 0.95 }} // Scale down effect on tap
        >
          {/* Tier-based border/background */}
          <div
            className={`${
              userdata?.tier
                ? tierColors[userdata.tier]
                : "bg-md-surface-variant" // Default background if no tier
            } rounded-full p-0.5`} // Padding acts as border width
          >
            {/* User Profile Image or Initials */}
            {userdata?.profilePicture ? (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-md-surface"> {/* Added background for consistency */}
                <Image
                  src={userdata.profilePicture}
                  alt={`${userdata.firstName || 'User'}'s profile`} // Added fallback alt text
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={(e) => e.currentTarget.style.display = 'none'} // Hide image on error
                />
                 {/* Fallback initials if image fails to load */}
                 <div className={`w-10 h-10 rounded-full ${tierColors[userdata.tier] || 'bg-md-surface-variant'} flex items-center justify-center absolute top-0 left-0 -z-10`}>
                    <span className="text-md-on-surface text-lg font-medium">
                       {userdata?.firstName?.charAt(0) || userdata?.email?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                 </div>
              </div>
            ) : (
              // Fallback initials display
              <div className="w-10 h-10 rounded-full bg-md-surface flex items-center justify-center">
                <span className="text-md-on-surface text-lg font-medium">
                  {userdata?.firstName?.charAt(0) ||
                    userdata?.email?.charAt(0)?.toUpperCase() ||
                    "?"}
                </span>
              </div>
            )}
          </div>

          {/* Subscription Badge (Pro/Enterprise) */}
          {userdata?.tier && userdata.tier !== "free" && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-md-primary flex items-center justify-center text-[10px] text-md-on-primary font-bold ring-2 ring-md-surface"> {/* Adjusted size, added ring */}
              {userdata.tier === "pro" ? "P" : "E"}
            </div>
          )}
        </motion.button>
      </header>

      {/* Profile Dialog - Uses AnimatePresence for mount/unmount animations */}
      <AnimatePresence>
        {showProfileMenu && (
          <>
            {/* --- Overlay --- */}
            {/* Dims the background when the menu is open */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowProfileMenu(false)} // Close menu on overlay click
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true" // Hide from accessibility tree
            />

            {/* --- Mobile Bottom Sheet --- */}
            {/* Appears from the bottom on smaller screens (hidden on md and up) */}
            <motion.div
              ref={mobileSheetRef} // Assign ref for height calculation (optional)
              className="fixed z-50 bg-md-surface rounded-t-3xl shadow-lg bottom-0 left-0 right-0 md:hidden" // Styles for the sheet
              initial={{ y: "100%" }} // Start position (off-screen bottom)
              animate={{ y: 0 }} // End position (at the bottom edge)
              exit={{ y: "100%" }} // Exit position (off-screen bottom)
              transition={{ // Spring animation for smooth opening/closing
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
              // --- Drag Properties ---
              drag="y" // Enable vertical dragging
              dragConstraints={{ top: 0 }} // Constraint: Cannot drag upwards past the fully open position
              dragElastic={0.2} // Resistance when dragging past constraints (0 = no resistance, 1 = rigid)
              onDragEnd={handleMobileSheetDragEnd} // Function called when dragging ends
              aria-modal="true" // Indicate it's a modal dialog
              role="dialog"
              aria-labelledby="profile-menu-title-mobile"
            >
              {/* Drag Handle Indicator */}
              <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing" aria-hidden="true"> {/* Added cursor styles */}
                <div className="w-12 h-1.5 rounded-full bg-md-outline-variant"></div>
              </div>

              {/* Content inside the bottom sheet */}
              <div className="p-4 pt-0"> {/* Adjusted padding */}
                {/* User Info Section */}
                <div className="flex items-center space-x-4 p-2 mb-4">
                   {/* Profile Picture or Initials */}
                   {userdata?.profilePicture ? (
                     <div className="w-14 h-14 rounded-full overflow-hidden relative bg-md-surface-container-high">
                       <Image
                         src={userdata.profilePicture}
                         alt="Profile" // Alt text should be descriptive
                         width={56}
                         height={56}
                         className="object-cover w-full h-full"
                         onError={(e) => e.currentTarget.style.display = 'none'} // Hide on error
                       />
                        {/* Fallback initials if image fails */}
                        <div className={`w-14 h-14 rounded-full ${tierColors[userdata.tier] || 'bg-md-surface-container-high'} flex items-center justify-center absolute top-0 left-0 -z-10`}>
                          <span className="text-md-on-surface text-xl font-medium">
                            {userdata?.firstName?.charAt(0) || userdata?.email?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
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
                   {/* Name and Email */}
                   <div className="flex-1 truncate"> {/* Allow text truncation */}
                     <h3 id="profile-menu-title-mobile" className="font-medium text-md-on-surface truncate">
                       {userdata?.firstName
                         ? `${userdata.firstName} ${userdata.lastName || ""}`
                         : userdata?.email || "User Profile"} {/* Fallback title */}
                     </h3>
                     <p className="text-sm text-md-on-surface-variant truncate">
                       {userdata?.email}
                     </p>
                     {/* Subscription Tier Badge */}
                     {userdata?.tier && (
                       <div
                         className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium
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

                {/* Divider */}
                <div className="border-t border-md-outline-variant">
                  <nav className="py-2 space-y-1"> {/* Adjusted padding and spacing */}
                    {/* Theme Selector Section */}
                    <div className="px-4 py-3">
                      <div className="flex items-center mb-3">
                        <motion.div // Animated Theme label
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-md-on-surface font-medium text-sm" // Adjusted text size
                        >
                          Theme
                        </motion.div>
                        <motion.div // Animated current theme name
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto text-xs text-md-on-surface-variant" // Adjusted text size
                        >
                          {getThemeName()}
                        </motion.div>
                      </div>
                      {/* Animated Theme Toggle Component */}
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                      >
                        <ThemeToggle
                          activeTheme={theme}
                          onThemeChange={handleThemeChange}
                        />
                      </motion.div>
                      {/* Theme Labels */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="mt-2 grid grid-cols-3 gap-2"
                        aria-hidden="true" // Hide decorative labels
                      >
                        <div className="text-center text-xs text-md-on-surface-variant">Light</div>
                        <div className="text-center text-xs text-md-on-surface-variant">Dark</div>
                        <div className="text-center text-xs text-md-on-surface-variant">System</div>
                      </motion.div>
                    </div>

                    {/* Navigation Links */}
                    {/* My Profile Link */}
                    <Link
                      href="/candidate/profile" // Ensure this path is correct
                      className="flex items-center space-x-3 px-4 py-3 rounded-full hover:bg-md-surface-container-low active:bg-md-surface-container text-md-on-surface w-full text-left text-sm" // Added active state, adjusted padding/text size
                      onClick={() => setShowProfileMenu(false)} // Close menu on click
                    >
                      {/* Profile Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                      <span>My Profile</span>
                    </Link>

                    {/* Settings Link */}
                    <Link
                      href="/settings" // Ensure this path is correct
                      className="flex items-center space-x-3 px-4 py-3 rounded-full hover:bg-md-surface-container-low active:bg-md-surface-container text-md-on-surface w-full text-left text-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      {/* Settings Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                      <span>Settings</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-full hover:bg-md-surface-container-low active:bg-md-surface-container text-md-on-surface w-full text-left text-sm"
                    >
                      {/* Logout Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-2-2V15H4V5h8.586l-2-2H3z" clipRule="evenodd" /><path fillRule="evenodd" d="M14.707 3.293a1 1 0 010 1.414L10.414 9H13a1 1 0 110 2h-5a1 1 0 01-1-1V5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>
            </motion.div>

            {/* --- Desktop Dropdown Menu --- */}
            {/* Appears as a dropdown from the top-right on medium screens and up */}
            <motion.div
              className="hidden md:block absolute z-50 bg-md-surface rounded-2xl shadow-lg top-16 right-4 w-80 origin-top-right" // Added origin, adjusted radius
              initial={{ // Start state (invisible, slightly scaled down and moved up)
                opacity: 0,
                y: -10, // Start slightly above
                scale: 0.95,
              }}
              animate={{ // End state (fully visible, at correct position and scale)
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{ // Exit state (same as initial for smooth fade out)
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              transition={{ // Animation timing and easing
                duration: 0.15, // Faster animation
                ease: "easeOut", // Standard easing
              }}
              aria-modal="true"
              role="dialog"
              aria-labelledby="profile-menu-title-desktop"
            >
              {/* Content inside the dropdown */}
              <div className="p-2"> {/* Reduced padding */}
                {/* User Info Section */}
                 <div className="flex items-center space-x-4 p-3 mb-2 rounded-lg bg-md-surface-container-lowest"> {/* Added background, padding, margin */}
                   {/* Profile Picture or Initials */}
                   {userdata?.profilePicture ? (
                     <div className="w-12 h-12 rounded-full overflow-hidden relative bg-md-surface-container-high"> {/* Adjusted size */}
                       <Image
                         src={userdata.profilePicture}
                         alt="Profile"
                         width={48} // Match container size
                         height={48} // Match container size
                         className="object-cover w-full h-full"
                         onError={(e) => e.currentTarget.style.display = 'none'}
                       />
                        <div className={`w-12 h-12 rounded-full ${tierColors[userdata.tier] || 'bg-md-surface-container-high'} flex items-center justify-center absolute top-0 left-0 -z-10`}>
                          <span className="text-md-on-surface text-lg font-medium">
                            {userdata?.firstName?.charAt(0) || userdata?.email?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                     </div>
                   ) : (
                     <div className="w-12 h-12 rounded-full bg-md-surface-container-high flex items-center justify-center">
                       <span className="text-md-on-surface text-lg font-medium">
                         {userdata?.firstName?.charAt(0) ||
                           userdata?.email?.charAt(0)?.toUpperCase() ||
                           "?"}
                       </span>
                     </div>
                   )}
                   {/* Name and Email */}
                   <div className="flex-1 truncate">
                     <h3 id="profile-menu-title-desktop" className="font-medium text-md-on-surface truncate">
                       {userdata?.firstName
                         ? `${userdata.firstName} ${userdata.lastName || ""}`
                         : userdata?.email || "User Profile"}
                     </h3>
                     <p className="text-sm text-md-on-surface-variant truncate">
                       {userdata?.email}
                     </p>
                     {/* Subscription Tier Badge */}
                     {userdata?.tier && (
                       <div
                         className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium
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

                {/* Divider */}
                <div className="my-1 border-t border-md-outline-variant"> {/* Adjusted margin */}
                  <nav className="py-1 space-y-1">
                    {/* Theme Selector Section - Desktop */}
                    <div className="px-3 py-3"> {/* Adjusted padding */}
                      <div className="flex items-center mb-3">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-md-on-surface font-medium text-sm"
                        >
                          Theme
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto text-xs text-md-on-surface-variant"
                        >
                          {getThemeName()}
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
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
                         aria-hidden="true"
                      >
                        <div className="text-center text-xs text-md-on-surface-variant">Light</div>
                        <div className="text-center text-xs text-md-on-surface-variant">Dark</div>
                        <div className="text-center text-xs text-md-on-surface-variant">System</div>
                      </motion.div>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <Link
                      href="/candidate/profile"
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-md-surface-container-low active:bg-md-surface-container text-md-on-surface w-full text-left text-sm" // Adjusted padding/radius
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-md-surface-container-low active:bg-md-surface-container text-md-on-surface w-full text-left text-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-md-surface-container-low active:bg-md-surface-container text-md-on-surface w-full text-left text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-2-2V15H4V5h8.586l-2-2H3z" clipRule="evenodd" /><path fillRule="evenodd" d="M14.707 3.293a1 1 0 010 1.414L10.414 9H13a1 1 0 110 2h-5a1 1 0 01-1-1V5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
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
