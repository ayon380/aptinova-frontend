import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Mic,
  Video,
  Monitor,
  User,
  Users,
  Smartphone,
  Copy,
  MousePointerClick,
  X,
} from "lucide-react";

export default function ProctoringWarning({ warnings }) {
  const [collapsed, setCollapsed] = useState(false);
  
  // Get only the most recent 5 warnings
  const recentWarnings = warnings.slice(-5).reverse();
  
  const getWarningIcon = (message) => {
    if (message.includes("Voice") || message.includes("noise")) return <Mic className="h-4 w-4" />;
    if (message.includes("webcam")) return <Video className="h-4 w-4" />;
    if (message.includes("Fullscreen")) return <Monitor className="h-4 w-4" />;
    if (message.includes("multiple people")) return <Users className="h-4 w-4" />;
    if (message.includes("No person")) return <User className="h-4 w-4" />;
    if (message.includes("mobile")) return <Smartphone className="h-4 w-4" />;
    if (message.includes("Copy") || message.includes("Paste")) return <Copy className="h-4 w-4" />;
    if (message.includes("Right-click")) return <MousePointerClick className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };
  
  if (collapsed) {
    return (
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
        onClick={() => setCollapsed(false)}
        className="fixed top-16 right-4 z-50 bg-md-error rounded-full p-2 shadow-lg cursor-pointer"
      >
        <AlertTriangle className="h-6 w-6 text-md-on-error" />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      exit={{ y: -50 }}
      className="fixed top-16 right-4 w-96 z-50 bg-md-error-container rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center p-3 border-b border-md-outline-variant">
        <h3 className="font-medium text-md-on-error-container flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Proctoring Alerts
        </h3>
        <button 
          onClick={() => setCollapsed(true)}
          className="text-md-on-surface-variant hover:text-md-on-surface p-1 rounded-full hover:bg-md-surface-container-high transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto p-2">
        {recentWarnings.length > 0 ? (
          <ul className="space-y-1">
            {recentWarnings.map((warning, index) => (
              <li 
                key={index}
                className="p-2 rounded-lg bg-md-surface hover:bg-md-surface-container-low transition-colors text-sm flex items-start"
              >
                <span className="text-md-error mr-2 mt-0.5 flex-shrink-0">
                  {getWarningIcon(warning.message)}
                </span>
                <div>
                  <p className="text-md-on-surface">{warning.message}</p>
                  <p className="text-md-on-surface-variant text-xs">
                    {new Date(warning.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-md-on-surface-variant text-center py-4 italic">No warnings yet</p>
        )}
      </div>
      <div className="p-2 text-xs text-md-on-error-container/60 text-center bg-md-error-container-low rounded-b-xl">
        {warnings.length} total warnings recorded
      </div>
    </motion.div>
  );
}
