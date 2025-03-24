import { useEffect, useRef } from 'react';

const AntiCheatSystem = ({ onCheatDetected }) => {
  const warningsRef = useRef(0);
  const fullscreenWarningRef = useRef(false);
  const lastActivityRef = useRef(Date.now());
  const blurEventsRef = useRef(0);
  
  useEffect(() => {
    // Track visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurEventsRef.current += 1;
        onCheatDetected(`Tab switching detected (${blurEventsRef.current} times)`);
      }
    };
    
    // Track fullscreen exit
    const handleFullscreenChange = () => {
      const isFullscreen = !!(document.fullscreenElement || 
                            document.mozFullScreenElement || 
                            document.webkitFullscreenElement || 
                            document.msFullscreenElement);
      
      if (!isFullscreen && !fullscreenWarningRef.current) {
        fullscreenWarningRef.current = true;
        onCheatDetected("Exiting fullscreen mode detected");
        
        // Attempt to re-enter fullscreen
        try {
          const docElm = document.documentElement;
          if (docElm.requestFullscreen) {
            setTimeout(() => docElm.requestFullscreen(), 1000);
          } else if (docElm.mozRequestFullScreen) {
            setTimeout(() => docElm.mozRequestFullScreen(), 1000);
          } else if (docElm.webkitRequestFullscreen) {
            setTimeout(() => docElm.webkitRequestFullscreen(), 1000);
          } else if (docElm.msRequestFullscreen) {
            setTimeout(() => docElm.msRequestFullscreen(), 1000);
          }
        } catch (err) {
          console.error("Permissions check failed:", err);
          onCheatDetected("Error re-entering fullscreen: " + err.message);
        }
      } else if (isFullscreen) {
        fullscreenWarningRef.current = false;
      }
    };
    
    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      warningsRef.current += 1;
      if (warningsRef.current <= 3) {
        onCheatDetected("Right-click detected");
      }
      return false;
    };
    
    // Prevent keyboard shortcuts
    const handleKeyDown = (e) => {
      // Block common shortcut combinations
      if ((e.ctrlKey || e.metaKey) && 
         (e.key === 'c' || e.key === 'v' || e.key === 'f' || 
          e.key === 'p' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        warningsRef.current += 1;
        if (warningsRef.current <= 3) {
          onCheatDetected(`Keyboard shortcut detected: Ctrl+${e.key}`);
        }
        return false;
      }
      
      // Block F12 and other function keys
      if (['F12', 'F11', 'F10'].includes(e.key)) {
        e.preventDefault();
        warningsRef.current += 1;
        if (warningsRef.current <= 3) {
          onCheatDetected(`Function key detected: ${e.key}`);
        }
        return false;
      }
      
      // Reset the activity timer
      lastActivityRef.current = Date.now();
    };
    
    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Set an interval to check for inactivity (not actually used as a cheat detection,
    // but could be extended to detect if someone is away for too long)
    const activityInterval = setInterval(() => {
      const inactiveTime = (Date.now() - lastActivityRef.current) / 1000;
      if (inactiveTime > 300) { // 5 minutes
        onCheatDetected("Unusual inactivity detected");
        lastActivityRef.current = Date.now(); // Reset to prevent multiple warnings
      }
    }, 60000); // Check every minute
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(activityInterval);
    };
  }, [onCheatDetected]);
  
  // This component doesn't render anything
  return null;
};

export default AntiCheatSystem;
