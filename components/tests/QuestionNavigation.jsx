import React from 'react';
import { motion } from 'framer-motion';

export default function QuestionNavigation({ questions, currentIndex, answers, onSelect }) {

  
  // Determine status of each question (answered, current, unanswered)
  const getQuestionStatus = (index) => {
    if (index === currentIndex) return 'current';
    // Use index as the identifier if id is not available
    const questionId = index;
    return answers[questionId] ? 'answered' : 'unanswered';
  };

  // Group questions by type
  const questionsByType = questions.reduce((acc, question) => {
    if (!acc[question.type]) {
      acc[question.type] = [];
    }
    acc[question.type].push(question);
    return acc;
  }, {});

  // Human-readable question type labels
  const typeLabels = {
    'multiple_choice': 'Multiple Choice',
    'checkbox': 'Multiple Select',
    'text': 'Written Answer',
    'code': 'Programming'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-md-surface-container-low rounded-3xl shadow-sm p-4 w-64 h-fit overflow-auto"
    >
      <h2 className="font-semibold mb-4 text-md-on-surface">Questions</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                getQuestionStatus(index) === 'current'
                  ? 'bg-md-primary text-md-on-primary'
                  : getQuestionStatus(index) === 'answered'
                  ? 'bg-md-secondary-container text-md-on-secondary-container border border-md-secondary'
                  : 'bg-md-surface-container text-md-on-surface-variant'
              }`}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Question types summary */}
      <div className="mt-6 mb-2">
        <h3 className="text-sm font-semibold mb-1 text-md-on-surface">Question Types</h3>
        <div className="space-y-1 text-xs text-md-on-surface-variant">
          {Object.entries(questionsByType).map(([type, qs]) => (
            <div key={type} className="flex justify-between">
              <span>{typeLabels[type] || type}</span>
              <span className="font-medium">{qs.length}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-xs text-md-on-surface-variant">
        <div className="flex items-center mb-2">
          <span className="w-4 h-4 rounded-full bg-md-primary mr-2"></span>
          <span>Current Question</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="w-4 h-4 rounded-full bg-md-secondary-container border border-md-secondary mr-2"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="w-4 h-4 rounded-full bg-md-surface-container mr-2"></span>
          <span>Not Answered</span>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-md-on-surface-variant mb-1">
          <span>Progress</span>
          <span>
            {Object.values(answers).filter(a => a !== null && a !== undefined).length} / {questions.length} answered
          </span>
        </div>
        <div className="w-full bg-md-surface-container-high rounded-full h-2.5">
          <div 
            className="bg-md-tertiary h-2.5 rounded-full" 
            style={{ width: `${(Object.values(answers).filter(a => a !== null && a !== undefined).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}
