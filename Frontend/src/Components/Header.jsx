import React from "react";

const Header = () => {
  return (
    // 1. HEADER WRAPPER
    // flex items-center = align contents horizontally in the middle
    // p-4 = padding around the edges
    // border-b = border on the bottom to separate it from the chat
    // text-gray-200 = light gray text
    <div className="flex items-center p-4 border-b border-gray-700 bg-gray-800 text-gray-200 h-16">
      {/* 2. LABEL AND DROPDOWN WRAPPER */}
      <div className="flex items-center gap-3">
        <label className="font-semibold text-sm text-gray-400">Model :</label>

        {/* 3. SELECT DROPDOWN */}
        {/* bg-gray-900 makes the dropdown match our dark theme */}
        {/* rounded-md gives it nice soft corners, p-2 adds inside spacing */}
        {/* focus:outline-none removes the ugly default blue glow when clicked */}
        <select className="bg-gray-900 border border-gray-700 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer">
          <option>GPT 4</option>
          <option>Gemini 3.1 Pro</option>
          <option>Claude 3 Opus</option>
          <option>Llama 3</option>
        </select>
      </div>
    </div>
  );
};

export default Header;
