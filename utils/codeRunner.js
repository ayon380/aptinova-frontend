// Safely evaluate code with test cases
export const runTestCases = async (code, language, testCases) => {
  const results = [];
  
  if (language === 'javascript') {
    // For JavaScript, use a sandbox approach (Function constructor)
    try {
      for (const testCase of testCases) {
        try {
          const startTime = performance.now();
          
          // Create a function from the code
          // This is not completely secure but better than eval()
          // In production, you'd use a more secure solution like a Web Worker
          const func = new Function(`
            "use strict";
            ${code}
            return {
              result: (function() {
                try {
                  // Assuming the code defines the expected function
                  // Extract function name from the first line
                  const funcMatch = ${JSON.stringify(code)}.match(/function\\s+(\\w+)\\s*\\(/);
                  const funcName = funcMatch ? funcMatch[1] : null;
                  
                  if (!funcName || typeof window[funcName] !== 'function') {
                    throw new Error('Function not defined correctly');
                  }
                  
                  return window[funcName](${JSON.stringify(testCase.input)});
                } catch (error) {
                  return { error: error.message };
                }
              })()
            };
          `);
          
          const { result } = func();
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          
          let passed = false;
          let error = null;
          
          if (result && result.error) {
            error = result.error;
          } else {
            // Deep equality check
            passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
          }
          
          results.push({
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: error ? `Error: ${error}` : result,
            passed,
            executionTime,
            marks: passed ? testCase.marks : 0
          });
        } catch (error) {
          results.push({
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: `Error: ${error.message}`,
            passed: false,
            executionTime: 0,
            marks: 0
          });
        }
      }
    } catch (error) {
      console.error('Code execution error:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  } else if (language === 'python') {
    // For Python, we need to use a backend service or pyodide in the browser
    // For this example, we'll use a mock response
    return {
      success: false,
      error: "Python execution in browser not implemented. Would require Pyodide or backend service.",
      results: testCases.map(tc => ({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: "Not implemented",
        passed: false,
        executionTime: 0,
        marks: 0
      }))
    };
  }
  
  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const possibleMarks = testCases.reduce((sum, tc) => sum + tc.marks, 0);
  
  return {
    success: true,
    results,
    summary: {
      passed: results.filter(r => r.passed).length,
      total: results.length,
      marks: totalMarks,
      possibleMarks
    }
  };
};
