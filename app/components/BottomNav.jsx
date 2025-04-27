"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Icons - Outline
import {
  HomeIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Icons - Solid (for active state)
import {
  HomeIcon as HomeSolid,
  BriefcaseIcon as BriefcaseSolid,
  ClipboardDocumentCheckIcon as ClipboardSolid,
  UserCircleIcon as UserSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  UsersIcon as UsersSolid,
  ChartBarIcon as ChartBarSolid,
  Cog6ToothIcon as CogSolid,
} from "@heroicons/react/24/solid";

// Main Navigation Component
export default function NavComponent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // --- User Type Determination ---
  // Determines the user type based on the current URL path
  const getUserType = (path) => {
    if (path.includes("/candidate")) return "candidate";
    if (path.includes("/hrm")) return "hrm"; // HR Manager path check
    if (path.includes("/hr")) return "hr"; // HR path check
    return "candidate"; // Default to candidate if no match
  };

  const userType = getUserType(pathname);

  // --- Haptic Feedback ---
  // Triggers a short vibration on supported devices
  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20); // Vibrate for 50 milliseconds
    }
  };

  // --- Mount State ---
  // Ensures the component only renders client-side to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null if not mounted yet (prevents server-side rendering issues)
  if (!mounted) return null;

  // --- Navigation Items Definitions ---
  // Define navigation items for each user type

  // Candidate Navigation Items
  const candidateNavItems = [
    {
      name: "Home",
      href: "/candidate/home",
      icon: HomeIcon,
      activeIcon: HomeSolid,
      active: pathname === "/candidate/home",
    },
    {
      name: "Jobs",
      href: "/candidate/jobs",
      icon: BriefcaseIcon,
      activeIcon: BriefcaseSolid,
      active: pathname.startsWith("/candidate/jobs"), // Use startsWith for nested routes
    },
    {
      name: "Applications",
      href: "/candidate/applications",
      icon: ClipboardDocumentCheckIcon,
      activeIcon: ClipboardSolid,
      active: pathname.startsWith("/candidate/applications"),
    },

    {
      name: "Profile",
      href: "/candidate/profile",
      icon: UserCircleIcon,
      activeIcon: UserSolid,
      active: pathname.startsWith("/candidate/profile"),
    },
  ];

  // HR Navigation Items
  const hrNavItems = [
    {
      name: "Dashboard",
      href: "/orgs/hr/dashboard",
      icon: HomeIcon,
      activeIcon: HomeSolid,
      active: pathname === "/orgs/hr/dashboard",
    },
    {
      name: "Jobs",
      href: "/orgs/hr/jobs",
      icon: BriefcaseIcon,
      activeIcon: BriefcaseSolid,
      active: pathname.startsWith("/orgs/hr/jobs"),
    },

    {
      name: "Profile",
      href: "/orgs/hr/profile",
      icon: UserCircleIcon,
      activeIcon: UserSolid,
      active: pathname.startsWith("/orgs/hr/profile"),
    },
  ];

  // HR Manager Navigation Items
  const hrmNavItems = [
    // Note: Adjusted paths to match the original code (/orgs/hrm/...)
    {
      name: "Dashboard",
      href: "/orgs/hrm/dashboard",
      icon: HomeIcon,
      activeIcon: HomeSolid,
      active: pathname === "/orgs/hrm/dashboard",
    },
    {
      name: "Team",
      href: "/orgs/hrm/team",
      icon: UsersIcon,
      activeIcon: UsersSolid,
      active: pathname.startsWith("/orgs/hrm/team"),
    },
    {
      name: "Analytics",
      href: "/orgs/hrm/analytics",
      icon: ChartBarIcon,
      activeIcon: ChartBarSolid,
      active: pathname.startsWith("/orgs/hrm/analytics"),
    },
    {
      name: "Jobs",
      href: "/orgs/hrm/jobs",
      icon: BriefcaseIcon,
      activeIcon: BriefcaseSolid,
      active: pathname.startsWith("/orgs/hrm/jobs"),
    },
    {
      name: "Settings",
      href: "/orgs/hrm/settings",
      icon: Cog6ToothIcon,
      activeIcon: CogSolid,
      active: pathname.startsWith("/orgs/hrm/settings"),
    },
    {
      name: "Profile",
      href: "/orgs/hrm/profile",
      icon: UserCircleIcon,
      activeIcon: UserSolid,
      active: pathname.startsWith("/orgs/hrm/profile"),
    },
  ];

  // Select the correct set of navigation items based on the determined user type
  const navItems =
    userType === "hr"
      ? hrNavItems
      : userType === "hrm"
      ? hrmNavItems
      : candidateNavItems;

  // --- Component Return ---
  // Renders the Desktop Sidebar and Mobile Bottom Navigation
  return (
    <>
      {/* --- Desktop Sidebar (Hidden on Medium screens and below) --- */}
      <motion.div
        initial={{ x: -20, opacity: 0 }} // Initial animation state
        animate={{ x: 0, opacity: 1 }} // Animate to final state
        transition={{ duration: 0.3 }} // Animation duration
        className="hidden md:block h-full bg-md-surface w-1/5 shadow-sm" // Changed w-1/4 back to w-72/6/
      >
        <div className="flex flex-col text-xl h-full py-8">
          {" "}
          {/* Flex container for sidebar content */}
          <div className="flex flex-col flex-1 space-y-2 px-2">
            {" "}
            {/* Container for nav items with spacing */}
            {navItems.map((item, index) => {
              // Determine which icon to use (active or inactive)
              const Icon = item.active ? item.activeIcon : item.icon;
              const activeItem = item.active;

              return (
                <motion.div
                  key={item.name} // Unique key for each item
                  initial={{ opacity: 0, y: 10 }} // Initial animation state for item
                  animate={{ opacity: 1, y: 0 }} // Animate item to final state
                  transition={{ delay: 0.1 * index, duration: 0.3 }} // Staggered animation delay
                >
                  <Link href={item.href} onClick={triggerVibration}>
                    {" "}
                    {/* Link component for navigation */}
                    <div
                      className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 relative ${
                        // Styling for the link container
                        activeItem
                          ? "bg-md-primary-container text-md-primary" // Active state styles
                          : "text-md-on-surface-variant hover:bg-md-surface-variant/60" // Inactive state styles
                      }`}
                    >
                      <Icon className="h-6 w-6" /> {/* Icon */}
                      <span className={`ml-3 font-medium`}>
                        {item.name}
                      </span>{" "}
                      {/* Text Label */}
                      {/* Optional: Small dot indicator for active item (desktop) */}
                      {activeItem && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 rounded-full bg-md-primary"
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* --- Mobile Bottom Navigation (Visible on Medium screens and below) --- */}
      <motion.div
        initial={{ y: 100 }} // Start off-screen below
        animate={{ y: 0 }} // Animate to position 0 (bottom)
        transition={{ type: "spring", stiffness: 300, damping: 30 }} // Spring animation for entry
        // Styling: visible only on mobile, fixed position, background, z-index, shadow
        className="md:hidden fixed bottom-0 left-0 right-0 bg-md-surface-container h-20 z-40 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]"
      >
        <div className="flex justify-around h-full items-center px-2">
          {" "}
          {/* Flex container to distribute items evenly */}
          {navItems.map((item) => {
            // Determine icon and active state
            const Icon = item.active ? item.activeIcon : item.icon;
            const activeItem = item.active;

            return (
              <Link
                key={item.name} // Unique key
                href={item.href} // Navigation target
                onClick={triggerVibration} // Haptic feedback on click
                className="flex-1 flex justify-center items-center h-full" // Make link take up equal space and center content
              >
                <motion.div
                  className="relative flex flex-col items-center justify-center space-y-1 w-16" // Container for icon and text
                  whileTap={{ scale: 0.95 }} // Scale down effect on tap
                >
                  {/* Material 3 Style Active Indicator (Pill Shape) */}
                  <div className="relative flex justify-center items-center h-8 w-16 mb-0.5">
                    {" "}
                    {/* Container for the icon and its active indicator */}
                    {activeItem && (
                      <motion.div
                        layoutId="activeMobileIndicator" // Shared layout ID for animation
                        // Styling for the active pill indicator
                        className="absolute inset-0 bg-md-secondary-container rounded-full z-0"
                        transition={{
                          // Animation transition for the indicator
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                    {/* Icon */}
                    <Icon
                      className={`relative z-10 h-6 w-6 transition-colors duration-200 ${
                        // Icon styling with z-index to be above indicator
                        activeItem
                          ? "text-md-on-secondary-container" // Active icon color
                          : "text-md-on-surface-variant" // Inactive icon color
                      }`}
                    />
                  </div>

                  {/* Text Label */}
                  <span
                    className={`text-[11px] transition-colors duration-200 ${
                      // Text label styling
                      activeItem
                        ? "text-md-on-surface font-medium" // Active text color and weight
                        : "text-md-on-surface-variant" // Inactive text color
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
