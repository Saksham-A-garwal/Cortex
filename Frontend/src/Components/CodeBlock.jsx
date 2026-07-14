import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// This gives us the exact same dark theme used by VS Code!
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  // HOW IT WORKS: navigator.clipboard is a built-in browser API that lets us write to the user's clipboard!
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);

    // Switch the text back to "Copy Code" after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700 shadow-xl">
      {/* The Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-400 font-mono border-b border-gray-700">
        <span>{language || "text"}</span>

        <button
          onClick={handleCopy}
          className="hover:text-white transition-colors flex items-center gap-2"
        >
          {isCopied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* The Code Engine Window */}
      <div className="text-sm overflow-x-auto no-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
          }}
          wrapLines={true}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
