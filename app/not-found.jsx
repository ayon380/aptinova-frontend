"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-md-background p-4">
      <div className="text-center max-w-md relative">
        {/* Animated decorative elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-md-primary opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-md-tertiary opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* 404 number */}
          <motion.h1
            className="text-[120px] font-bold text-md-primary leading-none"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            404
          </motion.h1>

          {/* Animated text */}
          <motion.h2
            className="text-2xl font-semibold text-md-on-surface mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            className="mb-8 text-md-on-surface-variant"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Oops! The page you're looking for seems to have wandered off.
          </motion.p>

          {/* Home button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link href="/" className="inline-block">
              <motion.button
                className="px-8 py-3 bg-md-primary text-md-on-primary rounded-full font-medium hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Home
              </motion.button>
            </Link>
          </motion.div>

          {/* Animated illustration */}
          <div className="mt-12 relative">
            <motion.div
              className="mx-auto w-32 h-32 rounded-full bg-md-secondary-container flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <motion.div
                className="text-md-on-secondary-container text-6xl"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🔍
              </motion.div>
            </motion.div>

            {/* Animated dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-md-outline"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
