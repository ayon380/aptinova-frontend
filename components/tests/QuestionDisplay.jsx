import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useTheme } from "@/contexts/ThemeContext";

// Dynamically import Monaco editor with no SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
    <Loader2 className="animate-spin h-8 w-8 text-md-primary" />
  </div>
});

export default function QuestionDisplay({ question, answer, onAnswerChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const { theme } = useTheme();
  
  // Initialize code with solution template when question changes
  useEffect(() => {
    if (question.type === "code" && question.solutionTemplate && !answer) {
      onAnswerChange(question.index || 0, question.solutionTemplate);
    }
  }, [question, answer, onAnswerChange]);

  // Handle language change for code questions
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // No need to change template since we're using the provided solutionTemplate
  };

  // Run test cases
  const handleRunTests = async () => {
    if (!question.testCases || question.testCases.length === 0 || isRunningTests) return;

    setIsRunningTests(true);
    setTestResults(null);

    try {
      // Simulating API call (replace with actual API when available)
      const results = await simulateTestExecution(answer, question.testCases, selectedLanguage);
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message,
        results: [],
      });
    } finally {
      setIsRunningTests(false);
    }
  };
  
  // Simulate test execution (replace with actual API call in production)
  const simulateTestExecution = async (code, testCases, language) => {
    // This is a placeholder. In a real app, you'd call your API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    return {
      success: true,
      results: testCases.map(test => ({
        passed: Math.random() > 0.5, // Random pass/fail for demo
        input: test.input,
        expected: test.expectedOutput,
        actual: test.expectedOutput, // In a real app this would be the actual output
        executionTime: Math.random() * 100,
      })),
      summary: {
        passed: Math.floor(testCases.length * 0.7),
        total: testCases.length,
        percentage: 70,
      }
    };
  };

  // Handle different question types
  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isChecked = answer === option;

              return (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    isChecked
                      ? "bg-md-primary-container border-md-primary text-md-on-primary-container"
                      : "border-md-outline hover:bg-md-surface-container-high text-md-on-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.index || 0}`}
                    value={option}
                    checked={isChecked}
                    onChange={() => onAnswerChange(question.index || 0, option)}
                    className="h-4 w-4 text-md-primary focus:ring-md-primary"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "text":
        return (
          <div>
            <textarea
              value={answer || ""}
              onChange={(e) => onAnswerChange(question.index || 0, e.target.value)}
              rows={8}
              className="w-full p-3 border border-md-outline rounded-lg focus:ring-md-primary focus:border-md-primary bg-md-surface-container-highest text-md-on-surface resize-y"
              placeholder="Type your answer here..."
            />
          </div>
        );

      case "code":
        // Extract markdown content and code template from question
        const questionContent = question.question;
        
        return (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Question panel (left) */}
            <div className="lg:w-1/2 lg:max-h-[600px] overflow-y-auto bg-md-surface-container p-4 rounded-lg border border-md-outline-variant">
              <h4 className="font-medium text-md-on-surface mb-3">Problem Statement</h4>
              <ReactMarkdown >
                {questionContent}
              </ReactMarkdown>
            </div>
              
            {/* Editor panel (right) */}
            <div className="lg:w-1/2 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-md-on-surface">Your Solution:</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLanguageChange("python")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedLanguage === "python"
                        ? "bg-md-secondary-container text-md-on-secondary-container"
                        : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container"
                    }`}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => handleLanguageChange("javascript")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedLanguage === "javascript"
                        ? "bg-md-secondary-container text-md-on-secondary-container"
                        : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container"
                    }`}
                  >
                    JavaScript
                  </button>
                </div>
              </div>

              <div className="border border-md-outline-variant rounded-lg overflow-hidden flex-grow">
                <MonacoEditor
                  height="400px"
                  language={selectedLanguage}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  value={answer || question.solutionTemplate || ""}
                  onChange={(code) => onAnswerChange(question.index || 0, code)}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Question type not supported.</div>;
    }
  };
  
  // Render test cases and results (for code questions)
  const renderTestCases = () => {
    if (question.type !== "code" || !question.testCases || question.testCases.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-md-on-surface flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 11 2-2-2-2"></path>
              <path d="M11 13h4"></path>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            Test Cases
          </h4>
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="px-4 py-2 text-sm font-medium text-md-on-tertiary bg-md-tertiary rounded-full hover:bg-md-tertiary/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isRunningTests ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <span>Run Tests</span>
            )}
          </button>
        </div>

        <div className="overflow-x-auto bg-md-surface-container border border-md-outline-variant rounded-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-md-surface-container-high border-b border-md-outline-variant">
                <th className="px-4 py-2 text-left text-md-on-surface font-medium">
                  Input
                </th>
                <th className="px-4 py-2 text-left text-md-on-surface font-medium">
                  Expected Output
                </th>
              </tr>
            </thead>
            <tbody>
              {question.testCases.map((testCase, idx) => (
                <tr
                  key={idx}
                  className="border-b border-md-outline-variant last:border-0"
                >
                  <td className="px-4 py-2 font-mono text-md-on-surface-variant">
                    {testCase.input}
                  </td>
                  <td className="px-4 py-2 font-mono text-md-on-surface-variant">
                    {testCase.expectedOutput}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {testResults && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              testResults.success
                ? "bg-md-surface-container"
                : "bg-md-error-container"
            }`}
          >
            {testResults.success ? (
              <>
                <h5 className="font-medium text-md-on-surface mb-2">
                  Test Results
                </h5>
                <div className="mb-3 flex justify-between">
                  <span className="text-md-on-surface-variant">
                    Passed: {testResults.summary.passed}/
                    {testResults.summary.total} tests
                  </span>
                  <span className="text-md-primary font-medium">
                    Score: {testResults.summary.percentage}%
                  </span>
                </div>

                <div className="space-y-3">
                  {testResults.results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md ${
                        result.passed
                          ? "bg-md-tertiary-container border-l-4 border-md-tertiary"
                          : "bg-md-error-container border-l-4 border-md-error"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-md-on-surface">
                          Test {idx + 1}
                        </span>
                        <span
                          className={
                            result.passed
                              ? "text-md-tertiary font-medium"
                              : "text-md-error font-medium"
                          }
                        >
                          {result.passed ? "Passed" : "Failed"} (
                          {result.executionTime.toFixed(2)}ms)
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-md-on-surface-variant">
                            Input:
                          </div>
                          <div className="font-mono text-md-on-surface">
                            {result.input}
                          </div>
                        </div>
                        <div>
                          <div className="text-md-on-surface-variant">
                            Expected:
                          </div>
                          <div className="font-mono text-md-on-surface">
                            {result.expected}
                          </div>
                        </div>
                        <div>
                          <div className="text-md-on-surface-variant">
                            Actual:
                          </div>
                          <div className="font-mono text-md-on-surface">
                            {typeof result.actual === "string" &&
                            result.actual.startsWith("Error:") ? (
                              <span className="text-md-error">
                                {result.actual}
                              </span>
                            ) : (
                              result.actual
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-md-on-error-container">
                <h5 className="font-medium mb-1">
                  Error Running Tests
                </h5>
                <p>{testResults.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-medium mb-2 text-md-on-surface">
            Question {(question.index || 0) + 1}
          </h3>
          {question.points && (
            <span className="bg-md-secondary-container text-md-on-secondary-container text-sm font-medium px-3 py-1 rounded-full">
              {question.points} point{question.points > 1 ? "s" : ""}
            </span>
          )}
        </div>
        
        {question.type !== "code" && (
          <div className="text-md-on-surface mb-6">
            {question.question}
          </div>
        )}
      </div>

      <div className="mb-6">{renderQuestionContent()}</div>
      {renderTestCases()}
    </div>
  );
}
