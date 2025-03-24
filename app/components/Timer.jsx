"use client"
import { useState, useEffect } from 'react';

const Timer = ({ remainingTime }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (remainingTime < 300) { // last 5 minutes
      return 'text-red-500';
    } else if (remainingTime < 900) { // last 15 minutes
      return 'text-amber-500';
    }
    return 'text-neutral-700 dark:text-neutral-300';
  };
  
  return (
    <div className="flex items-center">
      <svg className="w-5 h-5 mr-2 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      <div className={`font-mono font-medium ${getTimerColor()}`}>
        {formatTime(remainingTime)}
      </div>
    </div>
  );
};

export default Timer;
