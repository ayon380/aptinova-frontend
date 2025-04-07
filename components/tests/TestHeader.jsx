import React from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function TestHeader({ testName, timeLeft, questionsCount, currentQuestion, onSubmit, isSubmitting }) {
  // Calculate time warning status
  const isTimeRunningOut = timeLeft.includes('00:') || 
                          (timeLeft.includes('00:0') && !timeLeft.includes('00:00:'));
  const isVeryLow = timeLeft.includes('00:00:');
  
  return (
    <div className="bg-md-surface-container-highest shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-md-outline-variant">
      <div>
        <h1 className="text-xl font-bold text-md-on-surface">{testName}</h1>
        <p className="text-sm text-md-on-surface-variant">
          Question {currentQuestion} of {questionsCount}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium 
            ${isSubmitting 
              ? 'bg-md-tertiary/70 cursor-not-allowed'
              : 'bg-md-tertiary hover:bg-md-tertiary/90 active:scale-95 transition-transform'
            } text-md-on-tertiary`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Submit Test
            </>
          )}
        </button>
        
        <div className="flex items-center">
          <div className="mr-2">
            <span className="text-sm text-md-on-surface-variant">Time Remaining:</span>
          </div>
          <div className={`font-mono text-xl font-bold rounded-md px-3 py-1 ${
            isVeryLow 
              ? 'bg-md-error-container text-md-on-error-container animate-pulse' 
              : isTimeRunningOut 
                ? 'bg-md-tertiary-container text-md-on-tertiary-container' 
                : 'bg-md-secondary-container text-md-on-secondary-container'
          }`}>
            {timeLeft}
          </div>
        </div>
      </div>
    </div>
  );
}
