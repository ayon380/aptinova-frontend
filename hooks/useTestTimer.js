import { useState, useEffect, useRef } from 'react';

export default function useTestTimer() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  
  // Format seconds into HH:MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? `0${v}` : v)
      .join(':');
  };
  
  // Start timer with given seconds
  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    setIsTimeUp(false);
    setIsPaused(false);
  };
  
  // Pause the timer
  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Resume the timer
  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  // Timer logic
  useEffect(() => {
    if (timeLeft === null || isPaused) return;
    
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          clearInterval(intervalRef.current);
          setIsTimeUp(true);
          return 0;
        }
        return time - 1;
      });
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, isPaused]);
  
  // Flash timer when time is running out
  const [isFlashing, setIsFlashing] = useState(false);
  
  useEffect(() => {
    if (timeLeft !== null && timeLeft < 300) { // Less than 5 minutes
      setIsFlashing(true);
    } else {
      setIsFlashing(false);
    }
  }, [timeLeft]);
  
  return {
    timeLeft,
    timeFormatted: formatTime(timeLeft),
    isTimeUp,
    startTimer,
    pauseTimer,
    resumeTimer,
    isPaused,
    isFlashing
  };
}
