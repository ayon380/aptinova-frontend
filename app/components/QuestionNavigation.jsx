"use client"
import { useState } from 'react';

const QuestionNavigation = ({ 
  sections, 
  currentSection, 
  currentQuestionIndex, 
  answers, 
  setCurrentSection, 
  setCurrentQuestionIndex 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Function to handle navigation to a specific question
  const navigateToQuestion = (section, index) => {
    setCurrentSection(section);
    setCurrentQuestionIndex(index);
    setIsExpanded(false);
  };
  
  // Check if a question has been answered
  const isAnswered = (section, questionId) => {
    if (section === 'multipleChoice') {
      return answers[questionId] !== undefined;
    }
    return false; // For coding and voice questions, we don't track completion this way
  };
  
  return (
    <div className="mt-8 border-t border-neutral-200 dark:border-neutral-700 pt-4">
      <button 
        className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">Question Navigator</span>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-4 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          {/* Multiple Choice Section */}
          <div>
            <h3 className="font-medium text-sm text-neutral-500 dark:text-neutral-400 mb-2">Multiple Choice</h3>
            <div className="grid grid-cols-5 gap-2">
              {sections.multipleChoice.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => navigateToQuestion('multipleChoice', index)}
                  className={`w-full p-2 text-sm rounded-md ${
                    currentSection === 'multipleChoice' && currentQuestionIndex === index
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                      : isAnswered('multipleChoice', q.id)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Coding Section */}
          <div>
            <h3 className="font-medium text-sm text-neutral-500 dark:text-neutral-400 mb-2">Coding Challenges</h3>
            <div className="grid grid-cols-5 gap-2">
              {sections.coding.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => navigateToQuestion('coding', index)}
                  className={`w-full p-2 text-sm rounded-md ${
                    currentSection === 'coding' && currentQuestionIndex === index
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                      : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Voice Section */}
          <div>
            <h3 className="font-medium text-sm text-neutral-500 dark:text-neutral-400 mb-2">Voice Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {sections.voice.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => navigateToQuestion('voice', index)}
                  className={`w-full p-2 text-sm rounded-md ${
                    currentSection === 'voice' && currentQuestionIndex === index
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                      : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigation;