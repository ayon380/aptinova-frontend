'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';

// Create a client component that uses the search params
function TestCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testid');
  const [isExitingFullscreen, setIsExitingFullscreen] = useState(true);
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Exit fullscreen mode when test completes
  useEffect(() => {
    const exitFullscreen = async () => {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
      } finally {
        setIsExitingFullscreen(false);
      }
    };
    
    exitFullscreen();
    
    // Mock test submission data for demonstration
    setTimeout(() => {
      setTestInfo({
        testName: "Comprehensive Knowledge and Programming Test",
        answeredCount: 12,
        totalQuestions: 14,
        submissionTime: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
    
  }, [testId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Test Submitted Successfully!</h1>
        
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300 mb-8">Loading submission details...</p>
        ) : testInfo ? (
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thank you for completing {testInfo.testName || 'the assessment'}.
            </p>
            
            {testInfo && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left mb-4">
                <h2 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Submission Summary:</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li className="text-gray-700 dark:text-gray-300">Questions answered: {testInfo.answeredCount || 'N/A'}</li>
                  <li className="text-gray-700 dark:text-gray-300">Total questions: {testInfo.totalQuestions || 'N/A'}</li>
                  {testInfo.submissionTime && (
                    <li className="text-gray-700 dark:text-gray-300">Submitted at: {new Date(testInfo.submissionTime).toLocaleString()}</li>
                  )}
                </ul>
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-300">
              Your responses have been recorded and will be reviewed by the hiring team.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Thank you for completing the assessment. Your responses have been recorded and will be reviewed by the hiring team.
          </p>
        )}
        
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function TestCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    }>
      <TestCompleteContent />
    </Suspense>
  );
}
