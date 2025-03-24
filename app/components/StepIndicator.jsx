import React from 'react';

const StepIndicator = ({ activeStep, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 dark:bg-neutral-700 w-full" />
        
        {/* Active progress line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary-500 transition-all duration-500 ease-in-out"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center z-10">
            {/* Step circle */}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                index <= activeStep 
                ? 'bg-primary-500 text-white' 
                : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-2 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {index < activeStep ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {/* Step label */}
            <span className={`mt-2 text-xs font-medium ${
              index <= activeStep 
                ? 'text-neutral-900 dark:text-neutral-100' 
                : 'text-neutral-500 dark:text-neutral-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
