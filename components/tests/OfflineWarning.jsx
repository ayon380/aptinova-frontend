import React from 'react';

export default function OfflineWarning({ offlineTime, timeExceeded }) {
  // Format the offline time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 max-w-md w-full rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {timeExceeded ? 'Internet Connection Required' : 'No Internet Connection'}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {timeExceeded 
            ? 'You have been offline for more than 2 minutes. Please reconnect to continue the test.' 
            : `You are currently offline. The test will be paused if you remain offline for more than 2 minutes. (${formatTime(offlineTime)} / 2:00)`
          }
        </p>
        <div className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${timeExceeded ? 'hidden' : 'block'}`}>
          <div 
            className="h-full bg-red-500 transition-all duration-300" 
            style={{ width: `${Math.min(100, (offlineTime / 120) * 100)}%` }}
          ></div>
        </div>
        
        {timeExceeded && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Reload Page
          </button>
        )}
      </div>
    </div>
  );
}
