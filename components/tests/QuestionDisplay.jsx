import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { runTestCases } from "@/utils/codeRunner";
import { Spinner } from "@/components/common/Spinner";
import { useTheme } from "@/contexts/ThemeContext";

// Dynamically import Monaco editor with no SSR
const MonacoCodeEditor = dynamic(() => import("./MonacoCodeEditor"), {
  ssr: false,
});

export default function QuestionDisplay({ question, answer, onAnswerChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const { theme } = useTheme();

  // Handle language change for code questions
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    // Set up default code template based on language
    let codeTemplate = "";

    if (language === "javascript") {
      if (question.code && question.code.includes("function")) {
        codeTemplate = question.code;
      } else {
        // Extract function name from question text if possible
        const functionMatch = question.text.match(/function\s+(\w+)/i);
        const functionName = functionMatch ? functionMatch[1] : "solution";
        codeTemplate = `function ${functionName}(input) {\n  // Your code here\n  \n}`;
      }
    } else if (language === "python") {
      if (question.code && question.code.includes("def")) {
        codeTemplate = question.code;
      } else {
        // Extract function name from question text if possible
        const functionMatch = question.text.match(/function\s+(\w+)/i);
        const functionName = functionMatch ? functionMatch[1] : "solution";
        codeTemplate = `def ${functionName}(input):\n  # Your code here\n  \n`;
      }
    }

    onAnswerChange(question.id, codeTemplate);
  };

  // Run test cases
  const handleRunTests = async () => {
    if (!question.testCases || isRunningTests) return;

    setIsRunningTests(true);
    setTestResults(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/code/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            language: selectedLanguage,
            code: answer || "",
            testCases: question.testCases,
            constraints: question.constraints,
            questionId: question.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setTestResults({
        success: true,
        results: result.testResults.map((test) => ({
          passed: test.passed,
          input: test.input,
          expected: test.expectedOutput,
          actual: test.output || test.error,
          executionTime: test.executionTime || 0,
          marks: test.marks,
        })),
        summary: {
          passed: result.testResults.filter((t) => t.passed).length,
          total: result.testResults.length,
          marks: result.earnedMarks,
          possibleMarks: result.totalMarks,
          percentage: result.percentage,
        },
      });
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

  // Handle different question types
  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        const options = question.options.map((opt) =>
          typeof opt === "object"
            ? { label: opt.label, value: opt.value }
            : { value: opt }
        );

        return (
          <div className="space-y-3">
            {options.map((option, index) => {
              const optionLabel = option.label
                ? `${option.label}. ${option.value}`
                : option.value;
              const optionValue = option.value;
              const isChecked = answer === optionValue;

              return (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    isChecked
                      ? "bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionValue}
                    checked={isChecked}
                    onChange={() => onAnswerChange(question.id, optionValue)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400 dark:focus:ring-blue-400"
                  />
                  <span className="ml-3 text-gray-800 dark:text-gray-200">
                    {optionLabel}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isChecked =
                Array.isArray(answer) && answer.includes(option);

              const handleCheckboxChange = () => {
                let newAnswer = Array.isArray(answer) ? [...answer] : [];
                if (isChecked) {
                  newAnswer = newAnswer.filter((item) => item !== option);
                } else {
                  newAnswer.push(option);
                }
                onAnswerChange(question.id, newAnswer);
              };

              return (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    isChecked
                      ? "bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={`question-${question.id}`}
                    value={option}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400 dark:focus:ring-blue-400"
                  />
                  <span className="ml-3 text-gray-800 dark:text-gray-200">
                    {option}
                  </span>
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
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Type your answer here..."
            />
            {question.evaluationCriteria && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Evaluation Criteria:
                </h4>
                <ul className="list-disc pl-5">
                  {Object.entries(question.evaluationCriteria).map(
                    ([criterion, marks]) => (
                      <li
                        key={criterion}
                        className="text-sm text-blue-700 dark:text-blue-400"
                      >
                        {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                        : {marks} mark{marks > 1 ? "s" : ""}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        );

      case "code":
        return (
          <div className="font-mono">
            <div className="bg-gray-800 dark:bg-black text-white p-4 rounded-t-md overflow-auto my-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">{question.text}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLanguageChange("javascript")}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedLanguage === "javascript"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => handleLanguageChange("python")}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedLanguage === "python"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>
              <code className="text-sm">{question.code}</code>
            </div>

            <MonacoCodeEditor
              value={answer || question.code || ""}
              onChange={(code) => onAnswerChange(question.id, code)}
              language={selectedLanguage}
              height="300px"
            />

            {question.testCases && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Test Cases:
                  </h4>
                  <button
                    onClick={handleRunTests}
                    disabled={isRunningTests}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isRunningTests ? (
                      <>
                        <Spinner size="small" className="border-white" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <span>Run Tests</span>
                    )}
                  </button>
                </div>

                <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                          Input
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                          Expected Output
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                          Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.testCases.map((testCase, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-300">
                            {JSON.stringify(testCase.input)}
                          </td>
                          <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-300">
                            {JSON.stringify(testCase.expectedOutput)}
                          </td>
                          <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                            {testCase.marks}
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
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-red-50 dark:bg-red-900/30"
                    }`}
                  >
                    {testResults.success ? (
                      <>
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                          Test Results
                        </h5>
                        <div className="mb-3 flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Passed: {testResults.summary.passed}/
                            {testResults.summary.total} tests
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Score: {testResults.summary.marks}/
                            {testResults.summary.possibleMarks} marks
                          </span>
                        </div>

                        <div className="space-y-3">
                          {testResults.results.map((result, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-md ${
                                result.passed
                                  ? "bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500"
                                  : "bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500"
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  Test {idx + 1}
                                </span>
                                <span
                                  className={
                                    result.passed
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }
                                >
                                  {result.passed ? "Passed" : "Failed"} (
                                  {result.executionTime.toFixed(2)}ms)
                                </span>
                              </div>
                              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <div className="text-gray-600 dark:text-gray-400">
                                    Input:
                                  </div>
                                  <div className="font-mono text-gray-800 dark:text-gray-300">
                                    {JSON.stringify(result.input)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-600 dark:text-gray-400">
                                    Expected:
                                  </div>
                                  <div className="font-mono text-gray-800 dark:text-gray-300">
                                    {JSON.stringify(result.expected)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-600 dark:text-gray-400">
                                    Actual:
                                  </div>
                                  <div className="font-mono text-gray-800 dark:text-gray-300">
                                    {typeof result.actual === "string" &&
                                    result.actual.startsWith("Error:") ? (
                                      <span className="text-red-600 dark:text-red-400">
                                        {result.actual}
                                      </span>
                                    ) : (
                                      JSON.stringify(result.actual)
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-red-600 dark:text-red-400">
                        <h5 className="font-medium mb-1">
                          Error Running Tests
                        </h5>
                        <p>{testResults.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {question.constraints && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  Time limit: {question.constraints.timeoutMs}ms | Memory limit:{" "}
                  {question.constraints.memoryLimitMb}MB
                </p>
              </div>
            )}
          </div>
        );

      default:
        return <div>Question type not supported.</div>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            Question {question.number}
          </h3>
          {question.marks && (
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded">
              {question.marks} mark{question.marks > 1 ? "s" : ""}
              {question.negativeMarks > 0 &&
                ` (${question.negativeMarks} negative mark${
                  question.negativeMarks > 1 ? "s" : ""
                })`}
            </span>
          )}
        </div>
        <div className="text-gray-800 dark:text-gray-200 mb-4">
          {question.text}
        </div>

        {question.code && question.type !== "code" && (
          <pre className="bg-gray-800 dark:bg-black text-white p-4 rounded-md overflow-auto my-4">
            <code>{question.code}</code>
          </pre>
        )}

        {question.image && (
          <div className="my-4">
            <img
              src={question.image}
              alt="Question illustration"
              className="max-w-full max-h-64 object-contain dark:filter-none"
            />
          </div>
        )}
        {question.required && (
          <div className="text-red-600 dark:text-red-400 text-xs mb-2">
            * Required
          </div>
        )}
      </div>

      <div className="mb-6">{renderQuestionContent()}</div>
    </div>
  );
}
