"use client"
import React, { useEffect, useState } from 'react';

const TabWarning = ({ show, onClose, tabSwitches }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Animation duration
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!isVisible && !show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
         style={{ opacity: show ? 1 : 0 }}>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-transform duration-300"
           style={{ transform: show ? 'scale(1)' : 'scale(0.95)' }}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="ml-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Tab Switch Detected
          </h3>
        </div>
        
        <div className="space-y-3 text-neutral-800 dark:text-neutral-200">
          <p>
            We've detected that you left the test window. Remember that this is a proctored assessment and switching tabs or windows is not allowed.
          </p>
          <p>
            <span className="font-semibold">Tab switches detected:</span> {tabSwitches}
          </p>
          <p>
            Excessive tab switching may lead to disqualification from the assessment.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabWarning;
