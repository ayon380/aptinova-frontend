'use client';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/common/Spinner';

export default function MonacoCodeEditor({ 
  value, 
  onChange, 
  language = 'javascript', 
  height = '400px',
  readOnly = false
}) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monaco, setMonaco] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !monaco) {
      import('monaco-editor').then(monaco => {
        setMonaco(monaco);
      });
    }
    
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (monaco && containerRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        readOnly,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10
        }
      });

      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current.getValue());
      });

      setIsEditorReady(true);
    }
  }, [monaco, containerRef.current]);

  // Update editor value if it changes externally
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);



  // Update language when it changes
  useEffect(() => {
    if (editorRef.current && monaco) {
      const model = editorRef.current.getModel();
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language, monaco]);

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
      {!isEditorReady && (
        <div 
          className="flex items-center justify-center bg-gray-100 dark:bg-gray-800" 
          style={{ height }}
        >
          <Spinner className="text-blue-500" />
        </div>
      )}
      <div 
        ref={containerRef} 
        style={{ height, width: '100%', visibility: isEditorReady ? 'visible' : 'hidden' }}
      />
    </div>
  );
}
