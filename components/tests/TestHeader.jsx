import React from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function TestHeader({ testName, timeLeft, questionsCount, currentQuestion }) {
  // Calculate percentage of time left (assuming 5 minutes warning threshold)
  const isTimeRunningOut = timeLeft.includes('00:') || 
                          (timeLeft.includes('00:0') && !timeLeft.includes('00:00:'));
  const isVeryLow = timeLeft.includes('00:00:');
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{testName}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentQuestion} of {questionsCount}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center">
          <div className="mr-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Time Remaining:</span>
          </div>
          <div className={`font-mono text-xl font-bold rounded-md px-3 py-1 ${
            isVeryLow 
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 animate-pulse' 
              : isTimeRunningOut 
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' 
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          }`}>
            {timeLeft}
          </div>
        </div>
      </div>
    </div>
  );
}
