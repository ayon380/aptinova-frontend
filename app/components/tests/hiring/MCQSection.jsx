import { useState, useEffect, useRef } from 'react';

// Mock MCQ data - in a real app, this would come from an API
const mockMCQs = [
  {
    id: 1,
    question: "Which of the following is NOT a React hook?",
    options: [
      { id: 'a', text: "useState" },
      { id: 'b', text: "useContext" },
      { id: 'c', text: "useHistory" },
      { id: 'd', text: "useServices" }
    ],
    correctAnswer: 'd' // This would only be used for auto-grading
  },
  {
    id: 2,
    question: "What does JSX stand for?",
    options: [
      { id: 'a', text: "JavaScript XML" },
      { id: 'b', text: "JavaScript Syntax Extension" },
      { id: 'c', text: "JavaScript Experience" },
      { id: 'd', text: "Java Standard XML" }
    ],
    correctAnswer: 'a'
  },
  {
    id: 3,
    question: "Which lifecycle method is called after a component is rendered for the first time?",
    options: [
      { id: 'a', text: "componentWillMount" },
      { id: 'b', text: "componentDidMount" },
      { id: 'c', text: "componentWillUpdate" },
      { id: 'd', text: "componentDidUpdate" }
    ],
    correctAnswer: 'b'
  }
];

const MCQSection = ({ updateTestData, testData }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(testData?.answers || {});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  
  // Use ref to track if we've already sent initial data
  const initialDataSent = useRef(false);
  // Use ref to track previous answers for comparison
  const prevAnswersRef = useRef({});
  
  const questionsPerPage = 5;
  
  useEffect(() => {
    // In real app, fetch questions from API
    setQuestions(mockMCQs);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    // Skip the first render if no answers have been provided yet
    if (!initialDataSent.current) {
      initialDataSent.current = true;
      return;
    }
    
    // Check if answers have actually changed by comparing with previous values
    const prevAnswers = prevAnswersRef.current;
    const answersChanged = Object.keys(answers).some(key => 
      answers[key] !== prevAnswers[key]) || 
      Object.keys(prevAnswers).length !== Object.keys(answers).length;
    
    // Only update if answers have changed
    if (answersChanged && questions.length > 0) {
      const allAnswered = questions.every(q => answers[q.id] !== undefined);
      
      updateTestData({
        answers,
        completed: allAnswered
      });
      
      // Update the ref with current answers
      prevAnswersRef.current = {...answers};
    }
  }, [answers, questions, updateTestData]);
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      return newAnswers;
    });
  };
  
  const handleNextPage = (e) => {
    e.preventDefault();
    if ((currentPage + 1) * questionsPerPage < questions.length) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No questions are available for this test.</span>
      </div>
    );
  }
  
  // Calculate which questions to show on current page
  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min((currentPage + 1) * questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">
        Multiple Choice Questions
      </h2>
      
      <p className="text-gray-600 mb-4">
        Select the best answer for each question. You can navigate between pages using the buttons at the bottom.
      </p>
      
      <div className="mb-4 text-sm">
        <span>
          Page {currentPage + 1} of {totalPages} • 
          Questions {startIndex + 1}-{endIndex} of {questions.length} • 
          {Object.keys(answers).length} of {questions.length} answered
        </span>
      </div>
      
      {currentQuestions.map((question, index) => (
        <div 
          key={question.id} 
          className={`p-6 mb-6 bg-white rounded shadow ${
            answers[question.id] ? 'border-l-4 border-green-500' : ''
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">
            Question {startIndex + index + 1}
          </h3>
          
          <p className="mb-4">
            {question.question}
          </p>
          
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {question.options.map(option => (
                <label 
                  key={option.id} 
                  className={`flex items-center p-3 rounded cursor-pointer ${
                    answers[question.id] === option.id 
                      ? 'bg-blue-100 border border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswerChange(question.id, option.id)}
                    className="mr-2"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between mt-8">
        <button 
          className={`px-4 py-2 rounded border ${
            currentPage === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        
        <div className="flex items-center">
          <span className="mx-4">
            {currentPage + 1} of {totalPages}
          </span>
        </div>
        
        <button 
          className={`px-4 py-2 rounded border ${
            currentPage >= totalPages - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'
          }`}
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MCQSection;
