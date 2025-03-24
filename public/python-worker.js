self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');

async function initializePyodide() {
  try {
    self.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
      disableFileAccess: true,
    });
    self.postMessage({ type: 'initialized' });
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
}

self.onmessage = async (event) => {
  const { type, code } = event.data;

  if (type === 'initialize') {
    await initializePyodide();
  } else if (type === 'execute' && self.pyodide) {
    try {
      let output = '';
      let error = '';

      self.pyodide.runPython(`
        import sys
        from io import StringIO

        # Capture standard output
        sys.stdout = StringIO()
        sys.stderr = StringIO()
      `);

      self.pyodide.runPython(code);

      output = self.pyodide.runPython('sys.stdout.getvalue()');
      error = self.pyodide.runPython('sys.stderr.getvalue()');

      self.postMessage({ type: 'result', output, error });
    } catch (err) {
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};