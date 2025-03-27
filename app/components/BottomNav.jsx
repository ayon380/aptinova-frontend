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
} from "@heroicons/react/24/outline";

import {
  HomeIcon as HomeSolid,
  BriefcaseIcon as BriefcaseSolid,
  ClipboardDocumentCheckIcon as ClipboardSolid,
  UserCircleIcon as UserSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
} from "@heroicons/react/24/solid";

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

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

  const navItems = [
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

  // Material 3 style bottom navigation
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-md-surface z-40 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
    >
      <div className="flex justify-around h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.active ? item.activeIcon : item.icon;
          const activeItem = item.active;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex-1"
              onClick={triggerVibration}
            >
              <motion.div
                className="flex flex-col items-center justify-center h-full"
                animate={activeItem ? { y: -4 } : { y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Active state shows filled icon and active indicator */}
                {activeItem && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute top-1/4 -translate-y-1/2 w-16   h-8 rounded-full bg-md-primary-container"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}

                <motion.div
                  className={`relative z-10 flex flex-col items-center justify-center pt-3 ${
                    activeItem
                      ? "text-md-primary"
                      : "text-md-on-surface-variant"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${activeItem ? "drop-shadow-sm" : ""}`}
                  />
                  <span
                    className={`text-xs mt-1 transition-all ${
                      activeItem ? "opacity-100 font-medium" : "opacity-70"
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
