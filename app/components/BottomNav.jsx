"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Icons
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

export default function NavComponent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Determine user type from pathname
  const getUserType = (path) => {
    if (path.includes("/candidate")) return "candidate";
    if (path.includes("/hrm")) return "hrm";
    if (path.includes("/hr")) return "hr";
    return "candidate"; // default to candidate
  };

  const userType = getUserType(pathname);

  // For haptic feedback
  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50); // Vibrate for 50ms
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Navigation items for Candidate
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
      active: pathname.includes("/candidate/jobs"),
    },
    {
      name: "Applications",
      href: "/candidate/applications",
      icon: ClipboardDocumentCheckIcon,
      activeIcon: ClipboardSolid,
      active: pathname.includes("/candidate/applications"),
    },
    {
      name: "Messages",
      href: "/candidate/messages",
      icon: ChatBubbleLeftRightIcon,
      activeIcon: ChatSolid,
      active: pathname.includes("/candidate/messages"),
    },
    {
      name: "Profile",
      href: "/candidate/profile",
      icon: UserCircleIcon,
      activeIcon: UserSolid,
      active: pathname.includes("/candidate/profile"),
    },
  ];

  // Navigation items for HR
  const hrNavItems = [
    {
      name: "Dashboard",
      href: "/hr/dashboard",
      icon: HomeIcon,
      activeIcon: HomeSolid,
      active: pathname === "/hr/dashboard",
    },
    {
      name: "Candidates",
      href: "/hr/candidates",
      icon: UsersIcon,
      activeIcon: UsersSolid,
      active: pathname.includes("/hr/candidates"),
    },
    {
      name: "Jobs",
      href: "/hr/jobs",
      icon: BriefcaseIcon,
      activeIcon: BriefcaseSolid,
      active: pathname.includes("/hr/jobs"),
    },
    {
      name: "Messages",
      href: "/hr/messages",
      icon: ChatBubbleLeftRightIcon,
      activeIcon: ChatSolid,
      active: pathname.includes("/hr/messages"),
    },
    {
      name: "Profile",
      href: "/hr/profile",
      icon: UserCircleIcon,
      activeIcon: UserSolid,
      active: pathname.includes("/hr/profile"),
    },
  ];

  // Navigation items for HR Manager
  const hrmNavItems = [
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
      active: pathname.includes("/orgs/hrm/team"),
    },
    {
      name: "Analytics",
      href: "/orgs/hrm/analytics",
      icon: ChartBarIcon,
      activeIcon: ChartBarSolid,
      active: pathname.includes("/orgs/hrm/analytics"),
    },
    {
      name: "Jobs",
      href: "/orgs/hrm/jobs",
      icon: BriefcaseIcon,
      activeIcon: BriefcaseSolid,
      active: pathname.includes("/orgs/hrm/jobs"),
    },
    {
      name: "Settings",
      href: "/orgs/hrm/settings",
      icon: Cog6ToothIcon,
      activeIcon: CogSolid,
      active: pathname.includes("/orgs/hrm/settings"),
    },
  ];

  // Select the appropriate navigation items based on user type
  const navItems =
    userType === "hr"
      ? hrNavItems
      : userType === "hrm"
      ? hrmNavItems
      : candidateNavItems;

  // Responsive navigation: sidebar on desktop, bottom nav on mobile
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block h-full bg-md-surface w-96 shadow-sm "
      >
        <div className="flex flex-col text-xl h-full py-8">
          <div className="flex flex-col flex-1 space-y-2 px-2">
            {navItems.map((item, index) => {
              const Icon = item.active ? item.activeIcon : item.icon;
              const activeItem = item.active;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Link href={item.href} onClick={triggerVibration}>
                    <div
                      className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 relative ${
                        activeItem
                          ? "bg-md-primary-container text-md-primary"
                          : "text-md-on-surface-variant hover:bg-md-surface-variant/60"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className={`ml-3 font-medium`}>{item.name}</span>
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

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-md-surface z-40 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]"
      >
        <div className="flex justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.active ? item.activeIcon : item.icon;
            const activeItem = item.active;

            return (
              <Link key={item.name} href={item.href} onClick={triggerVibration}>
                <motion.div
                  className="relative h-full px-3 flex flex-col items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Android-style active indicator */}
                  {activeItem && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute bottom-0 h-0.5 rounded-t-full bg-md-primary"
                      style={{ width: "50%" }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon and text container */}
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Icon
                      className={`h-6 w-6 ${
                        activeItem
                          ? "text-md-primary"
                          : "text-md-on-surface-variant opacity-70"
                      }`}
                    />
                    <span
                      className={`text-[10px] ${
                        activeItem
                          ? "text-md-primary font-medium"
                          : "text-md-on-surface-variant opacity-70"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
