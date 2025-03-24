import { useState, useEffect } from 'react';

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineSince, setOfflineSince] = useState(null);
  const [offlineTimeExceeded, setOfflineTimeExceeded] = useState(false);
  const offlineThresholdMs = 2 * 60 * 1000; // 2 minutes in milliseconds
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSince(null);
      setOfflineTimeExceeded(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(new Date());
    };
    
    // Check initial status
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setOfflineSince(new Date());
    }

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check if offline time has exceeded threshold
    const intervalId = setInterval(() => {
      if (offlineSince && !offlineTimeExceeded) {
        const offlineTime = new Date() - offlineSince;
        if (offlineTime > offlineThresholdMs) {
          setOfflineTimeExceeded(true);
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [offlineSince, offlineTimeExceeded]);

  return { 
    isOnline, 
    offlineSince, 
    offlineTimeExceeded,
    offlineTime: offlineSince ? (new Date() - offlineSince) / 1000 : 0 // in seconds
  };
}
