import React from 'react';

export default function ProctoringWarning({ warnings }) {
  if (!warnings || warnings.length === 0) return null;
  
  // Only show the most recent warning
  const latestWarning = warnings[warnings.length - 1];
  
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 mb-4 mx-4 mt-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Warning:</strong> {latestWarning.message}
            <span className="ml-2 text-xs">
              ({new Date(latestWarning.timestamp).toLocaleTimeString()})
            </span>
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            This violation has been recorded. Continuing may result in test disqualification.
          </p>
        </div>
      </div>
    </div>
  );
}
