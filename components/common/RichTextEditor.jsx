'use client';

import { useState, useEffect, useRef } from 'react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  // Use local state to handle the editor value
  const [editorValue, setEditorValue] = useState(value || '');
  const editorRef = useRef(null);

  // Update parent component when content changes
  const handleChange = (e) => {
    const content = e.target.value;
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  // Sync with parent component's value when it changes externally
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value || '');
    }
  }, [value, editorValue]);

  return (
    <div>
      <div className="editor-container">
        <textarea
          ref={editorRef}
          value={editorValue}
          onChange={handleChange}
          placeholder={placeholder || "Write something..."}
          className="simple-text-editor"
        />
      </div>
      <style jsx>{`
        .editor-container {
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .simple-text-editor {
          width: 100%;
          min-height: 200px;
          padding: 12px;
          font-family: inherit;
          font-size: 16px;
          border: none;
          resize: vertical;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
