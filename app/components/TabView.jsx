"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TabView({ tabs, activeTab, setActiveTab, children }) {
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef(null);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const tabRefs = useRef([]);

  // Initialize tab refs array
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
      const tabElement = tabRefs.current[activeIndex];
      setIndicatorWidth(tabElement.offsetWidth);
      setIndicatorLeft(tabElement.offsetLeft);
    }
  }, [activeTab, tabs]);

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping || startX === null || currentX === null) {
      setIsSwiping(false);
      setStartX(null);
      setCurrentX(null);
      return;
    }

    const swipeDistance = currentX - startX;
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    // If swipe is significant enough and there's a tab to navigate to
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0 && activeIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(tabs[activeIndex - 1].id);
      } else if (swipeDistance < 0 && activeIndex < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(tabs[activeIndex + 1].id);
      }
    }

    setIsSwiping(false);
    setStartX(null);
    setCurrentX(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="px-4 pt-2 pb-0 overflow-x-auto scrollbar-hide">
        <div className="flex relative">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={el => tabRefs.current[index] = el}
              onClick={() => setActiveTab(tab.id)}
              className={`text-base py-3 px-4 whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "text-md-primary"
                  : "text-md-on-surface-variant"
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Animated indicator */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-md-primary rounded-t-full"
            animate={{
              left: indicatorLeft,
              width: indicatorWidth,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Tab content with swipe gestures */}
      <div 
        className="flex-1 overflow-hidden"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: isSwiping ? (currentX > startX ? 100 : -100) : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSwiping ? (currentX > startX ? -100 : 100) : 0 }}
            transition={{ duration: 0.25 }}
            className="h-full overflow-y-auto pb-20"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
