'use client';
import dynamic from 'next/dynamic';
import React from "react";

// Client-side only wrapper for MDEditor
const MDEditorComponent = dynamic(
  () => import('@uiw/react-md-editor').then(mod => {
    const MDEditor = mod.default;
    return ({ ...props }) => (
      <div data-color-mode={props.theme}>
        <MDEditor {...props} />
      </div>
    );
  }),
  { ssr: false }
);

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CustomMDEditor({ value, onChange, placeholder }) {

  return (
    <div className="md-editor-wrapper">
      <MDEditorComponent
        value={value}
        onChange={onChange}
        preview="edit"
        height={400}
        visibleDragbar={false}
        placeholder={placeholder}

      />
      
      <style jsx>{`
        .md-editor-wrapper {
          margin-bottom: 1rem;
        }
        :global(.w-md-editor) {
          border-radius: 8px !important;
          overflow: hidden;
        }
        :global([data-color-mode="dark"] .w-md-editor) {
          color: #ffffff !important;
        }
        :global([data-color-mode="dark"] .w-md-editor-toolbar) {
          background-color: #333333 !important;
          border-color: #404040 !important;
        }
        :global([data-color-mode="dark"] .w-md-editor-toolbar button) {
          color: #ffffff !important;
        }
        :global([data-color-mode="dark"] .w-md-editor-toolbar button:hover) {
          background-color: #404040 !important;
        }
      `}</style>
    </div>
  );
}
