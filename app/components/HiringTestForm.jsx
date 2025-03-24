"use client";
import { useState } from "react";
import { Plus, Trash2, X, Code2 } from "lucide-react";
import dynamic from "next/dynamic";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

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
    onSubmit(formData);
  };

  const addTestCase = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", expectedOutput: "" }],
    }));
  };

  return (
    <div className="fixed inset-0 bg-white overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Create Hiring Test</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Test Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Test Name
              </label>
              <input
                type="text"
                required
                className="input mt-1"
                value={formData.testName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, testName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="input mt-1"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  required
                  min={15}
                  className="input mt-1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  className="input mt-1"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      passingScore: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Questions ({formData.questions.length})
            </h3>
            {formData.questions.map((q, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="font-medium">Question {index + 1}</p>
                {q.type === QuestionTypes.CODE ? (
                  <div className="prose max-w-none mt-2">
                    <MarkdownEditor.Markdown source={q.question} />
                  </div>
                ) : (
                  <p className="mt-1">{q.question}</p>
                )}
                {q.type === QuestionTypes.MULTIPLE_CHOICE && (
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={`text-sm ${
                          i === q.correctAnswer ? "text-green-600 font-medium" : ""
                        }`}
                      >
                        {`${String.fromCharCode(65 + i)}. ${opt}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Add Question Form */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Add New Question</h3>
            <div className="space-y-4">
              <select
                className="select-input"
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
              >
                <option value={QuestionTypes.MULTIPLE_CHOICE}>
                  Multiple Choice
                </option>
                <option value={QuestionTypes.TEXT}>Text Answer</option>
                <option value={QuestionTypes.CODE}>Code Question</option>
              </select>

              {currentQuestion.type === QuestionTypes.CODE ? (
                <div className="space-y-4">
                  <div className="h-[500px] border rounded-lg overflow-hidden">
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
                      <h4 className="font-medium">Test Cases</h4>
                      <button
                        type="button"
                        onClick={addTestCase}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Test Case
                      </button>
                    </div>

                    {currentQuestion.testCases.map((testCase, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input
                          </label>
                          <textarea
                            className="input font-mono"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Output
                          </label>
                          <textarea
                            className="input font-mono"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Solution Template (Optional)
                    </label>
                    <textarea
                      className="input font-mono"
                      rows={5}
                      value={currentQuestion.solutionTemplate}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          solutionTemplate: e.target.value,
                        }))
                      }
                      placeholder="// Provide a template for the solution..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      className="input"
                      rows={3}
                      value={currentQuestion.question}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          question: e.target.value,
                        }))
                      }
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {currentQuestion.type === QuestionTypes.MULTIPLE_CHOICE ? (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
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
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-gray-600">
                              {String.fromCharCode(65 + index)}.
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            className="input flex-1"
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
                      <p className="text-sm text-gray-500">
                        Select the radio button next to the correct answer
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Answer
                      </label>
                      <textarea
                        className="input"
                        rows={3}
                        value={currentQuestion.correctAnswer || ""}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            correctAnswer: e.target.value,
                          }))
                        }
                        placeholder="Enter the expected answer for this question..."
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  placeholder="Points"
                  className="input w-24"
                  value={currentQuestion.points}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({
                      ...prev,
                      points: parseInt(e.target.value),
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t py-4 mt-8">
            <div className="flex justify-end gap-4 max-w-4xl mx-auto">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary disabled:bg-blue-200"
                disabled={formData.questions.length === 0}
              >
                Create Test
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
