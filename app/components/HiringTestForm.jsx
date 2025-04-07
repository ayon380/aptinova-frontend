"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Code2, Check, Loader2, FileText, PackageCheck } from "lucide-react";
import dynamic from "next/dynamic";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { motion } from "framer-motion";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

const QuestionTypes = {
  MULTIPLE_CHOICE: "multiple_choice",
  TEXT: "text",
  CODE: "code",
};

const CodeQuestionTemplate = `# Problem Title

## Description
Describe the problem here...

## Input Format
Describe the input format...

## Output Format
Describe the output format...

## Constraints
- List constraints here...

## Example
\`\`\`
Input:
[input example]

Output:
[output example]
\`\`\`

## Notes
Any additional notes...
`;

export default function HiringTestForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    duration: 60,
    passingScore: 70,
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: QuestionTypes.MULTIPLE_CHOICE,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 10,
    testCases: [], // Added for code questions
    solutionTemplate: "", // Added for code questions
  });

  // Add states for ready-made tests
  const [readyMadeTests, setReadyMadeTests] = useState([]);
  const [selectedReadyMadeTest, setSelectedReadyMadeTest] = useState(null);
  const [loadingTests, setLoadingTests] = useState(false);
  const [showReadyMade, setShowReadyMade] = useState(true);
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // Fetch ready-made tests when component mounts
  useEffect(() => {
    const fetchReadyMadeTests = async () => {
      try {
        setLoadingTests(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hiring-tests/ready-made`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setReadyMadeTests(data);
        } else {
          console.error("Failed to fetch ready-made tests");
        }
      } catch (error) {
        console.error("Error fetching ready-made tests:", error);
      } finally {
        setLoadingTests(false);
      }
    };
    
    fetchReadyMadeTests();
  }, []);

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, currentQuestion],
    }));
    setCurrentQuestion({
      type: QuestionTypes.MULTIPLE_CHOICE,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10,
      testCases: [], // Added for code questions
      solutionTemplate: "", // Added for code questions
    });
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If a ready-made test is selected, just send its ID
    if (selectedReadyMadeTest) {
      onSubmit({ readyMadeTestId: selectedReadyMadeTest.id });
    } else {
      // Otherwise, send the custom test data
      onSubmit(formData);
    }
  };

  const selectReadyMadeTest = (test) => {
    setSelectedReadyMadeTest(test);
  };

  const toggleCustomForm = () => {
    setShowCustomForm(true);
    setShowReadyMade(false);
    setSelectedReadyMadeTest(null);
  };

  const toggleReadyMade = () => {
    setShowReadyMade(true);
    setShowCustomForm(false);
  };

  const addTestCase = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", expectedOutput: "" }],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-md-surface rounded-3xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-md-outline">
          <h2 className="text-2xl font-semibold text-md-on-surface">Create Hiring Test</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-high"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Mode selector */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={toggleReadyMade}
              className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 ${
                showReadyMade 
                  ? "bg-md-secondary-container text-md-on-secondary-container" 
                  : "bg-md-surface-container-high text-md-on-surface-variant"
              }`}
            >
              <PackageCheck className="w-5 h-5" />
              <span>Ready-Made Templates</span>
            </button>
            <button 
              onClick={toggleCustomForm}
              className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 ${
                showCustomForm 
                  ? "bg-md-secondary-container text-md-on-secondary-container" 
                  : "bg-md-surface-container-high text-md-on-surface-variant"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Create Custom Test</span>
            </button>
          </div>

          {/* Ready-made test selection */}
          {showReadyMade && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-md-on-surface">Select a Ready-Made Test</h3>
              
              {loadingTests ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 text-md-primary animate-spin" />
                </div>
              ) : readyMadeTests.length === 0 ? (
                <div className="p-8 text-center text-md-on-surface-variant">
                  <p>No ready-made tests available.</p>
                  <button 
                    onClick={toggleCustomForm}
                    className="mt-4 px-6 py-2 bg-md-primary text-md-on-primary rounded-full"
                  >
                    Create Custom Test
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {readyMadeTests.map((test) => (
                    <motion.div
                      key={test.id}
                      className={`p-5 rounded-2xl border cursor-pointer transition-colors ${
                        selectedReadyMadeTest?.id === test.id
                          ? "border-md-primary bg-md-primary-container/20"
                          : "border-md-outline-variant bg-md-surface-container-high hover:bg-md-surface-container"
                      }`}
                      onClick={() => selectReadyMadeTest(test)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-md-on-surface text-lg">{test.testName}</h4>
                        {selectedReadyMadeTest?.id === test.id && (
                          <Check className="w-5 h-5 text-md-primary" />
                        )}
                      </div>
                      <p className="text-md-on-surface-variant text-sm mt-2">{test.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-md-primary-container text-md-on-primary-container rounded-full text-xs">
                          {test.numberOfQuestions} Questions
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom test form */}
          {showCustomForm && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Test Information */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    id="testName"
                    required
                    value={formData.testName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, testName: e.target.value }))
                    }
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    placeholder=" "
                  />
                  <label
                    htmlFor="testName"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Test Name
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor="description"
                    className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                  >
                    Description
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="number"
                      id="duration"
                      required
                      min={15}
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value),
                        }))
                      }
                      className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="duration"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Duration (minutes)
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      id="passingScore"
                      required
                      min={0}
                      max={100}
                      value={formData.passingScore}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          passingScore: parseInt(e.target.value),
                        }))
                      }
                      className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                      placeholder=" "
                    />
                    <label
                      htmlFor="passingScore"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                    >
                      Passing Score (%)
                    </label>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-md-on-surface">
                  Questions ({formData.questions.length})
                </h3>
                {formData.questions.map((q, index) => (
                  <motion.div 
                    key={index} 
                    className="p-5 bg-md-surface-container-high rounded-3xl border border-md-outline-variant relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="absolute right-3 top-3 p-2 text-md-error hover:bg-md-error-container hover:text-md-on-error-container rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="font-medium text-md-on-surface">Question {index + 1}</p>
                    {q.type === QuestionTypes.CODE ? (
                      <div className="prose max-w-none mt-2 bg-md-surface-container p-4 rounded-3xl">
                        <MarkdownEditor.Markdown source={q.question} />
                      </div>
                    ) : (
                      <p className="mt-1 text-md-on-surface">{q.question}</p>
                    )}
                    {q.type === QuestionTypes.MULTIPLE_CHOICE && (
                      <ul className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={`text-sm p-2 rounded-2xl ${
                              i === q.correctAnswer 
                                ? "bg-md-primary-container text-md-on-primary-container font-medium" 
                                : "text-md-on-surface"
                            }`}
                          >
                            {`${String.fromCharCode(65 + i)}. ${opt}`}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-2 text-sm text-md-on-surface-variant">
                      {q.points} points • {q.type.replace('_', ' ')}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Question Form */}
              <div className="border-t border-md-outline-variant pt-6">
                <h3 className="text-xl font-semibold text-md-on-surface mb-4">Add New Question</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      id="questionType"
                      value={currentQuestion.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          type,
                          question:
                            type === QuestionTypes.CODE ? CodeQuestionTemplate : "",
                          testCases:
                            type === QuestionTypes.CODE
                              ? [{ input: "", expectedOutput: "" }]
                              : [],
                        }));
                      }}
                      className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                    >
                      <option value={QuestionTypes.MULTIPLE_CHOICE}>
                        Multiple Choice
                      </option>
                      <option value={QuestionTypes.TEXT}>Text Answer</option>
                      <option value={QuestionTypes.CODE}>Code Question</option>
                    </select>
                    <label
                      htmlFor="questionType"
                      className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 text-md-on-surface-variant"
                    >
                      Question Type
                    </label>
                  </div>

                  {currentQuestion.type === QuestionTypes.CODE ? (
                    <div className="space-y-4">
                      <div className="h-[500px] border border-md-outline rounded-3xl overflow-hidden">
                        <MarkdownEditor
                          value={currentQuestion.question}
                          onChange={(value) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              question: value,
                            }))
                          }
                          className="h-full"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-md-on-surface">Test Cases</h4>
                          <motion.button
                            type="button"
                            onClick={addTestCase}
                            className="px-4 py-2 rounded-full bg-md-secondary-container text-md-on-secondary-container flex items-center gap-2 hover:bg-md-secondary hover:text-md-on-secondary transition-colors"
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus className="w-4 h-4" />
                            Add Test Case
                          </motion.button>
                        </div>

                        {currentQuestion.testCases.map((testCase, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-2 gap-4 p-4 bg-md-surface-container-low rounded-3xl border border-md-outline-variant"
                          >
                            <div>
                              <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                                Input
                              </label>
                              <textarea
                                className="block w-full px-4 py-2 rounded-2xl text-lg appearance-none focus:outline-none border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface font-mono"
                                rows={3}
                                value={testCase.input}
                                onChange={(e) => {
                                  const newTestCases = [
                                    ...currentQuestion.testCases,
                                  ];
                                  newTestCases[index].input = e.target.value;
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    testCases: newTestCases,
                                  }));
                                }}
                                placeholder="Enter test case input..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
                                Expected Output
                              </label>
                              <textarea
                                className="block w-full px-4 py-2 rounded-2xl text-lg appearance-none focus:outline-none border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface font-mono"
                                rows={3}
                                value={testCase.expectedOutput}
                                onChange={(e) => {
                                  const newTestCases = [
                                    ...currentQuestion.testCases,
                                  ];
                                  newTestCases[index].expectedOutput =
                                    e.target.value;
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    testCases: newTestCases,
                                  }));
                                }}
                                placeholder="Enter expected output..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="relative">
                        <textarea
                          id="solutionTemplate"
                          rows={5}
                          value={currentQuestion.solutionTemplate}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              solutionTemplate: e.target.value,
                            }))
                          }
                          className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface font-mono resize-none"
                          placeholder=" "
                        />
                        <label
                          htmlFor="solutionTemplate"
                          className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                        >
                          Solution Template (Optional)
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          id="questionText"
                          rows={3}
                          value={currentQuestion.question}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                          placeholder=" "
                        />
                        <label
                          htmlFor="questionText"
                          className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                        >
                          Question Text
                        </label>
                      </div>

                      {currentQuestion.type === QuestionTypes.MULTIPLE_CHOICE ? (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-md-on-surface-variant">
                            Answer Options
                          </label>
                          {currentQuestion.options.map((opt, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  checked={currentQuestion.correctAnswer === index}
                                  onChange={() =>
                                    setCurrentQuestion((prev) => ({
                                      ...prev,
                                      correctAnswer: index,
                                    }))
                                  }
                                  className="w-4 h-4 text-md-primary accent-md-primary"
                                />
                                <span className="text-md-on-surface-variant">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                className="block w-full px-4 py-2 rounded-2xl text-lg appearance-none focus:outline-none border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                                value={opt}
                                onChange={(e) => {
                                  const newOptions = [...currentQuestion.options];
                                  newOptions[index] = e.target.value;
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    options: newOptions,
                                  }));
                                }}
                              />
                            </div>
                          ))}
                          <p className="text-sm text-md-on-surface-variant">
                            Select the radio button next to the correct answer
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <textarea
                            id="expectedAnswer"
                            rows={3}
                            value={currentQuestion.correctAnswer || ""}
                            onChange={(e) =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                correctAnswer: e.target.value,
                              }))
                            }
                            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none"
                            placeholder=" "
                          />
                          <label
                            htmlFor="expectedAnswer"
                            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                          >
                            Expected Answer
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 items-center">
                    <div className="relative w-24">
                      <input
                        type="number"
                        id="points"
                        className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                        value={currentQuestion.points}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            points: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder=" "
                      />
                      <label
                        htmlFor="points"
                        className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
                      >
                        Points
                      </label>
                    </div>
                    <motion.button
                      type="button"
                      onClick={addQuestion}
                      className="px-6 py-3 rounded-full bg-md-primary text-md-on-primary flex items-center gap-2 hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-4 border-t border-md-outline bg-md-surface">
          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-3xl border border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors disabled:opacity-50 disabled:pointer-events-none"
              disabled={!selectedReadyMadeTest && formData.questions.length === 0}
              whileTap={{ scale: 0.95 }}
            >
              Create Test
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
