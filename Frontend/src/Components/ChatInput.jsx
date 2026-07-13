import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

const ChatInput = ({ appendNewMessages }) => {
  const { chatId } = useParams();
  const { token } = useContext(AuthContext);
  const [text, setText] = useState("");

  const handleSend = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/messages",
        {
          content: text,
          chatId: chatId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      appendNewMessages(response.data.userMessage, response.data.aiMessage);
      setText("");
    } catch (error) {
      console.log("Error Occured while sending the message", error);
    }
  };
  return (
    // 1. OUTER WRAPPER (Keeps the input box from stretching too wide on huge monitors)
    // p-4 = padding on all sides | w-full = stretch to fill container
    <div className="p-4 w-full border-t border-gray-700 bg-gray-800">
      {/* 2. THE "FAKE" INPUT BOX */}
      {/* We put the background color, border, and rounded corners on this div */}
      {/* flex = puts the textarea and button side-by-side */}
      <div className="max-w-4xl mx-auto flex items-end bg-gray-900 border border-gray-600 rounded-xl p-2 focus-within:border-gray-400 transition-colors">
        {/* 3. THE ACTUAL TEXT AREA */}
        {/* resize-none hides the ugly grabber in the corner */}
        {/* bg-transparent ensures it blends into the div behind it */}
        <textarea
          placeholder="Type your message here..."
          className="w-full max-h-48 min-h-[44px] bg-transparent text-white placeholder-gray-400 p-2 focus:outline-none resize-none overflow-y-auto"
          rows={1}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        {/* 4. THE SEND BUTTON */}
        <button
          className="bg-white text-gray-900 font-semibold p-2 rounded-lg hover:bg-gray-200 transition-colors mb-1 mr-1"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
