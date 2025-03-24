import { useEffect, useRef, useState } from "react";

export function usePythonWorker() {
  const workerRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    workerRef.current = new window.Worker("/python-worker.js");
    workerRef.current.onmessage = (e) => {
      if (e.data.type === "initialized") {
        setInitialized(true);
      }
    };
    workerRef.current.postMessage({ type: "initialize" });

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const executePythonCode = (code) =>
    new Promise((resolve, reject) => {
      if (!initialized) {
        return reject(new Error("Python worker not ready"));
      }
      const handleMessage = (e) => {
        if (e.data.type === "result") {
          workerRef.current.removeEventListener("message", handleMessage);
          resolve(e.data.output);
        } else if (e.data.type === "error") {
          workerRef.current.removeEventListener("message", handleMessage);
          reject(new Error(e.data.error));
        }
      };
      workerRef.current.addEventListener("message", handleMessage);
      workerRef.current.postMessage({ type: "execute", code });
    });

  return { executePythonCode, initialized };
}
