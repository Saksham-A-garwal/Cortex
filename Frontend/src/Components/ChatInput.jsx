import React, { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (text === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  const handleSend = () => {
    // Prevent sending empty messages or sending while the AI is already thinking
    if (!text.trim() || isLoading) return;

    // Pass the text up to ChatArea!
    onSubmit(text);
    setText("");
  };

  // Bonus Feature: Let the user press "Enter" on their keyboard to send!
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 w-full border-t border-gray-700 bg-gray-800">
      <div className="max-w-4xl mx-auto flex items-end bg-gray-900 border border-gray-600 rounded-xl p-2 focus-within:border-gray-400 transition-colors">
        <textarea
          ref={textareaRef}
          placeholder="Type your message here..."
          className="w-full max-h-48 min-h-[44px] bg-transparent text-white placeholder-gray-400 p-2 focus:outline-none resize-none overflow-y-auto no-scrollbar"
          rows={1}
          onInput={handleInput}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          value={text}
          disabled={isLoading} /* Disables the text box when loading */
        />

        <button
          className={`font-semibold p-2 rounded-lg transition-colors mb-1 mr-1 ${
            isLoading || !text.trim()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" // Gray out the button when loading
              : "bg-white text-gray-900 hover:bg-gray-200"
          }`}
          onClick={handleSend}
          disabled={
            isLoading || !text.trim()
          } /* Disables button clicks when loading */
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
