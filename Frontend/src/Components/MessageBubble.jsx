import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import CodeBlock from "./CodeBlock";
import toast from "react-hot-toast";

const MessageBubble = ({ msg }) => {
  return (
    <div
      className={`flex w-full gap-3 group ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {msg.role === "AI" && (
        <div className="shrink-0 mt-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col w-full overflow-hidden ${msg.role === "USER" ? "items-end" : "items-start"}`}
      >
        <span
          className={`text-sm font-semibold text-gray-400 mb-1 ${msg.role === "USER" ? "mr-1" : "ml-1"}`}
        >
          {msg.role === "USER" ? "You" : "Cortex AI"}
        </span>

        {/* 3 Dots Loading Animation */}
        {msg.role === "AI" &&
        msg._id.startsWith("ai-") &&
        msg.content === "" ? (
          <div className="w-32 p-4 rounded-2xl shadow-md bg-gray-700 text-gray-200 rounded-tl-none flex items-center justify-center gap-1 h-[56px]">
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
          </div>
        ) : (
          <>
            <div
              className={`max-w-xl w-full p-4 rounded-2xl shadow-md text-[15px] leading-relaxed overflow-x-auto ${msg.role === "USER" ? "bg-indigo-900/60 text-indigo-50 border border-indigo-700/50 rounded-tr-none backdrop-blur-sm" : "bg-gray-700 text-gray-200 rounded-tl-none"}`}
            >
              <div className="prose prose-invert max-w-none w-full">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      if (match) {
                        return (
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, "")}
                          />
                        );
                      }
                      return (
                        <code
                          className="bg-gray-900/60 text-blue-300 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-700/50"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Action Toolbar (Appears on Hover) */}
            {msg.content && (
              <div
                className={`mt-1.5 flex w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(msg.content);
                    toast.success("Message copied!", {
                      style: { background: "#374151", color: "#fff" },
                    });
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-200 transition-colors bg-gray-800/80 hover:bg-gray-700 px-2 py-1 rounded border border-gray-700 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Avatar */}
      {msg.role === "USER" && (
        <div className="shrink-0 mt-6">
          <img
            src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
            alt="User"
            className="w-10 h-10 rounded-full shadow-md"
          />
        </div>
      )}
    </div>
  );
};

// THIS IS THE PERFORMANCE MAGIC!
export default React.memo(MessageBubble);
