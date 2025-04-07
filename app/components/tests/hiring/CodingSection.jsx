"use client";

import { useState, useEffect } from "react";

// import PythonExecutor from "../hiring/PythonExecutor";
import { usePythonWorker } from "../../../hooks/usePythonWorker";

// Mock coding challenges data - in a real app, this would come from an API
const mockCodingChallenges = [
  {
    id: 1,
    title: "Reverse String Function",
    description: `Write a function called 'reverseString' that takes a string as input and returns the string reversed.`,
    starterCode: {
      javascript:
        "function main_function(str) {\n  // Write your code here\n  \n}",
      python: "def main_function(s):\n  # Write your code here\n  pass",
    },
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "javascript", expected: "tpircsavaj" },
      { input: "", expected: "" },
    ],
  },
  {
    id: 2,
    title: "Find Duplicates in Array",
    description: `Write a function called 'findDuplicates' that takes an array of numbers as input and returns an array containing all the duplicate numbers.`,
    starterCode: {
      javascript:
        "function findDuplicates(arr) {\n  // Write your code here\n  \n}",
      python: "def find_duplicates(arr):\n  # Write your code here\n  pass",
    },
    testCases: [
      { input: "[1, 2, 3, 4, 2, 5, 6, 3]", expected: "[2, 3]" },
      { input: "[1, 2, 3, 4]", expected: "[]" },
      { input: "[1, 1, 1, 1]", expected: "[1]" },
    ],
  },
];

// Custom Python provider with configuration for required packages

// Create a wrapper component that uses PythonProvider
const CodingSectionWrapper = ({ updateTestData, testData }) => {
  return (
    <CodingSectionInner updateTestData={updateTestData} testData={testData} />
  );
};

// Inner component that uses the usePython hook
const CodingSectionInner = ({ updateTestData, testData }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [solutions, setSolutions] = useState(testData.solutions || {});
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [results, setResults] = useState({});
  const [pythonResults, setPythonResults] = useState({});
  const [pythonTestQueue, setPythonTestQueue] = useState([]);
  const [currentPythonTest, setCurrentPythonTest] = useState(null);
  const { executePythonCode } = usePythonWorker();

  useEffect(() => {
    // In a real app, fetch challenges from API
    setChallenges(mockCodingChallenges);
    setLoading(false);

    // Pre-populate solutions with starter code if not already set
    const initialSolutions = { ...testData.solutions };
    mockCodingChallenges.forEach((challenge) => {
      if (!initialSolutions[challenge.id]) {
        initialSolutions[challenge.id] = challenge.starterCode[language];
      }
    });

    setSolutions(initialSolutions);
  }, [testData.solutions, language]);

  useEffect(() => {
    // Update parent component with solutions data
    const allAnswered =
      challenges.length > 0 &&
      challenges.every(
        (c) => solutions[c.id] && solutions[c.id] !== c.starterCode
      );

    if (!testData.completed) {
      updateTestData({ ...testData, completed: true });
    }
  }, [solutions, challenges, updateTestData, testData.completed]);

  const handleTabChange = (event, newValue) => {
    // Prevent default behavior that could cause page refresh
    event.preventDefault();
    setCurrentTabIndex(newValue);
  };

  const handleSolutionChange = (challengeId, code) => {
    // Use functional update to avoid closure issues
    setSolutions((prev) => ({
      ...prev,
      [challengeId]: code,
    }));
  };

  const runTestCases = async (challenge) => {
    const solution = solutions[challenge.id];
    let evalFunction;

    if (language === "javascript") {
      try {
        // Create function once, outside the test cases loop
        // eslint-disable-next-line no-eval
        evalFunction = eval(`(${solution})`);
      } catch (e) {
        setResults((prev) => ({
          ...prev,
          [challenge.id]: challenge.testCases.map((testCase) => ({
            ...testCase,
            result: `Syntax Error: ${e.message}`,
            passed: false,
          })),
        }));
        return;
      }
    }

    const testResults = [];

    if (language === "python") {
      // Set up a queue of test cases to process sequentially
      const testQueue = challenge.testCases.map((testCase, index) => ({
        challengeId: challenge.id,
        testCase,
        index,
        solution,
        challengeTitle: challenge.title,
      }));

      // Start with clean results
      setResults((prev) => ({ ...prev, [challenge.id]: [] }));

      // Queue up all tests
      setPythonTestQueue(testQueue);

      // Process first test
      if (testQueue.length > 0) {
        setCurrentPythonTest(testQueue[0]);
      }
    } else {
      // JavaScript test case execution (unchanged)
      for (const testCase of challenge.testCases) {
        let input;
        try {
          input = JSON.parse(testCase.input);
        } catch (e) {
          input = testCase.input; // treat as raw string if not valid JSON
        }

        try {
          let result = JSON.stringify(evalFunction(input));

          // Try to compare as JSON if possible
          let passed = false;
          try {
            passed =
              JSON.stringify(JSON.parse(result)) ===
              JSON.stringify(JSON.parse(testCase.expected));
          } catch {
            passed = result === testCase.expected;
          }

          testResults.push({
            ...testCase,
            result: result.replace(/"/g, ""), // Remove quotes for display
            passed,
          });
        } catch (e) {
          testResults.push({
            ...testCase,
            result: `Runtime Error: ${e.message}`,
            passed: false,
          });
        }
      }

      setResults((prev) => ({ ...prev, [challenge.id]: testResults }));
    }
  };

  // Handle individual Python test case execution
  useEffect(() => {
    if (!currentPythonTest) return;

    const { challengeId, testCase, index, solution, challengeTitle } =
      currentPythonTest;

    // Create Python script for a single test case
    const pythonTestCode = `
import json

${solution}
try:
    input_data = "${testCase.input}"
    res=main_function(input_data)
    print(res)
except Exception as e:
    print(f"Error: {str(e)}")
`;

    // Execute this single test case
    const processPythonTestCase = async () => {
      try {
        // Get output from the executor
        console.log("Running Python test case:", pythonTestCode);

        const rawOutput = await executePythonCode(pythonTestCode);
        console.log(rawOutput);

        // Process the test result
        let passed = false;
        let result = String(rawOutput).trim();

        try {
          // Try to compare as JSON if needed
          if (result.startsWith("[") || result.startsWith("{")) {
            passed = JSON.stringify(JSON.parse(result)) === testCase.expected;
          } else {
            passed = result === testCase.expected;
          }
        } catch (e) {
          passed = result === testCase.expected;
        }

        // Add this result to the results array
        setResults((prev) => {
          const updatedResults = [...(prev[challengeId] || [])];
          updatedResults[index] = {
            ...testCase,
            result,
            passed,
          };
          return { ...prev, [challengeId]: updatedResults };
        });

        // Move to next test in queue
        setPythonTestQueue((prev) => {
          const newQueue = [...prev];
          newQueue.shift();

          // Set next test or clear current test
          if (newQueue.length > 0) {
            setCurrentPythonTest(newQueue[0]);
          } else {
            setCurrentPythonTest(null);
          }

          return newQueue;
        });
      } catch (error) {
        console.error("Python test execution error:", error);

        // Add error result
        setResults((prev) => {
          const updatedResults = [...(prev[challengeId] || [])];
          updatedResults[index] = {
            ...testCase,
            result: `Execution error: ${error.message}`,
            passed: false,
          };
          return { ...prev, [challengeId]: updatedResults };
        });

        // Move to next test
        setPythonTestQueue((prev) => {
          const newQueue = [...prev];
          newQueue.shift();

          if (newQueue.length > 0) {
            setCurrentPythonTest(newQueue[0]);
          } else {
            setCurrentPythonTest(null);
          }

          return newQueue;
        });
      }
    };

    processPythonTestCase();
  }, [currentPythonTest]);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 border border-red-300 text-red-700 mb-4">
        {error}
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="p-4 rounded-md bg-blue-50 border border-blue-300 text-blue-700 mb-4">
        No coding challenges are available for this test.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Coding Challenges</h2>

      <p className="text-sm text-gray-600 mb-4">
        Complete the following coding challenges by writing code according to
        the requirements.
      </p>

      <div className="mb-4">
        <label className="mr-2">Select Language:</label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        {/* {language === "python"  && (
          <span className="ml-2 text-sm text-gray-500">
            {isReady
              ? "Loading Python environment..."
              : "Initializing Python..."}
          </span>
        )} */}
      </div>
      {/* <PythonExecutor code={"print('Hello, World! foro ayon')"} /> */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {challenges.map((challenge, index) => (
            <button
              key={challenge.id}
              className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentTabIndex === index
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              id={`challenge-tab-${index}`}
              aria-controls={`challenge-tabpanel-${index}`}
              onClick={() => {
                setCurrentTabIndex(index);
              }}
            >
              Challenge {index + 1}
            </button>
          ))}
        </div>
      </div>

      {challenges.map((challenge, index) => (
        <div
          key={challenge.id}
          role="tabpanel"
          hidden={currentTabIndex !== index}
          id={`challenge-tabpanel-${index}`}
          aria-labelledby={`challenge-tab-${index}`}
          className="mt-6"
        >
          {currentTabIndex === index && (
            <>
              <h3 className="text-xl font-medium mb-2">{challenge.title}</h3>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h4 className="text-base font-semibold mb-2">
                  Challenge Description:
                </h4>
                <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-4 rounded-md">
                  {challenge.description}
                </pre>

                <h4 className="text-base font-semibold mt-6 mb-2">
                  Your Solution:
                </h4>

                {/* <Editor
                  height="200px"
                  language={language === "python" ? "python" : "javascript"}
                  value={solutions[challenge.id] || challenge.starterCode}
                  onChange={(value) =>
                    handleSolutionChange(challenge.id, value)
                  }
                  theme="vs-dark"
                /> */}

                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-2">Test Cases:</h4>

                  <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                    {challenge.testCases.map((testCase, i) => (
                      <div
                        key={i}
                        className={
                          i < challenge.testCases.length - 1
                            ? "mb-2 pb-2 border-b border-gray-200"
                            : ""
                        }
                      >
                        <p className="font-mono text-sm">
                          Input: {testCase.input}
                        </p>
                        <p className="font-mono text-sm">
                          Expected Output: {testCase.expected}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => runTestCases(challenge)}
                  disabled={pythonTestQueue.length > 0}
                >
                  {pythonTestQueue.length > 0
                    ? "Running Tests..."
                    : "Run Tests"}
                </button>
                {results[challenge.id] && (
                  <div className="mt-4">
                    <h4 className="text-base font-semibold mb-2">
                      Test Results:
                    </h4>
                    <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                      {results[challenge.id].map((testResult, i) => (
                        <div
                          key={i}
                          className={`${
                            i < results[challenge.id].length - 1
                              ? "mb-2 pb-2 border-b border-gray-200"
                              : ""
                          } ${
                            testResult.passed
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <p className="font-mono text-sm">
                            Input: {testResult.input}
                          </p>
                          <p className="font-mono text-sm">
                            Expected Output: {testResult.expected}
                          </p>
                          <p className="font-mono text-sm">
                            Actual Output: {testResult.result}
                          </p>
                          <p className="font-mono text-sm font-bold">
                            {testResult.passed ? "✓ Passed" : "✗ Failed"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  className={`px-4 py-2 border border-gray-300 rounded-md font-medium text-sm ${
                    index === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={index === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTabIndex(index - 1);
                  }}
                >
                  Previous Challenge
                </button>

                <button
                  className={`px-4 py-2 border border-gray-300 rounded-md font-medium text-sm ${
                    index === challenges.length - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={index === challenges.length - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTabIndex(index + 1);
                  }}
                >
                  Next Challenge
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="mt-8">
        <div className="p-4 rounded-md bg-blue-50 border border-blue-300 text-blue-700">
          Your code will be evaluated on correctness, efficiency, and
          readability.
        </div>
      </div>
    </div>
  );
};

export default CodingSectionWrapper;
