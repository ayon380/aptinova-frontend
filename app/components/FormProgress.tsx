import React from "react";

interface FormProgressProps {
  steps: string[];
  currentStep: number;
}

export const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      {/* Desktop progress bar - hidden on mobile */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-md-primary text-md-on-primary"
                      : "bg-md-surface-variant text-md-on-surface-variant"
                  }`}
                >
                  {index < currentStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-sm text-md-on-primary opacity-75`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line (except after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-grow h-0.5 mx-2 ${
                    index < currentStep
                      ? "bg-md-primary"
                      : "bg-md-surface-variant"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden">
        <div className="w-full bg-md-surface-variant rounded-full h-2 mb-2">
          <div
            className="bg-md-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-md-on-surface-variant">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-6 text-center ${
                index <= currentStep ? "text-md-primary font-medium" : ""
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
