import { useState, useEffect } from 'react';

export default function useProctoring() {
  const [warnings, setWarnings] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Add a new warning
  const addWarning = (message) => {
    const warning = {
      message,
      timestamp: new Date(),
    };
    setWarnings(prev => [...prev, warning]);
    
    // Optional: Send warning to server for logging
    try {
      fetch('/api/test-warnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warning),
      });
    } catch (error) {
      console.error('Failed to log warning:', error);
    }
  };
  
  // Request fullscreen mode
  const requestFullscreen = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
        document.documentElement.msRequestFullscreen();
      }
    } catch (error) {
      addWarning('Could not enable fullscreen mode');
    }
  };
  
  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addWarning('Tab switching detected');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ));
      
      if (!document.fullscreenElement && 
          !document.mozFullScreenElement && 
          !document.webkitFullscreenElement && 
          !document.msFullscreenElement) {
        addWarning('Fullscreen mode exited');
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  // Prevent copy/paste
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      addWarning('Copy action detected');
    };
    
    const handlePaste = (e) => {
      e.preventDefault();
      addWarning('Paste action detected');
    };
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCopy);
    
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCopy);
    };
  }, []);
  
  // Prevent right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      addWarning('Right-click detected');
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  return {
    warnings,
    isFullscreen,
    requestFullscreen,
    addWarning
  };
}
