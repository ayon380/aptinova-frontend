import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function QuestionNavigation({ questions, currentIndex, answers, onSelect }) {
  const { theme } = useTheme();
  
  // Determine status of each question (answered, current, unanswered)
  const getQuestionStatus = (index, questionId) => {
    if (index === currentIndex) return 'current';
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
    'multiple-choice': 'Multiple Choice',
    'checkbox': 'Multiple Select',
    'text': 'Written Answer',
    'code': 'Programming'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-64 h-fit">
      <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Questions</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => onSelect(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                getQuestionStatus(index, question.id) === 'current'
                  ? 'bg-blue-500 text-white'
                  : getQuestionStatus(index, question.id) === 'answered'
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              } ${question.required ? 'ring-2 ring-red-200 dark:ring-red-900' : ''}`}
              title={`Question ${question.number}${question.required ? ' (Required)' : ''}`}
            >
              {question.number}
            </button>
          ))}
        </div>
      </div>
      
      {/* Question types summary */}
      <div className="mt-6 mb-2">
        <h3 className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-300">Question Types</h3>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          {Object.entries(questionsByType).map(([type, qs]) => (
            <div key={type} className="flex justify-between">
              <span>{typeLabels[type] || type}</span>
              <span className="font-medium">{qs.length}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-700 dark:text-gray-300">
        <div className="flex items-center mb-2">
          <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
          <span>Current Question</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 mr-2"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 mr-2"></span>
          <span>Not Answered</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 ring-2 ring-red-200 dark:ring-red-900 mr-2"></span>
          <span>Required Question</span>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>
            {Object.values(answers).filter(a => a !== null).length} / {questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${(Object.values(answers).filter(a => a !== null).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
