import { useContext, useEffect, useState } from "react";
import Header from "./Header";
import ChatInput from "./ChatInput";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

const ChatArea = () => {
  const { chatId } = useParams();
  const { token } = useContext(AuthContext);
  const [message, setmessage] = useState([]);

  // Fetch messages when the URL (chatId) changes
  useEffect(() => {
    if (!chatId) return;
    const fetchmessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/${chatId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setmessage(response.data.messages);
      } catch (error) {
        console.log("Error Occured while fatching messages", error);
      }
    };

    fetchmessages();
  }, [chatId, token]);

  // Helper function to update the screen instantly when a new message is sent
  const appendNewMessages = (userMsg, aiMsg) => {
    // Add the two new messages to the end of our array
    setmessage((prevMessages) => [...prevMessages, userMsg, aiMsg]);
  };

  return (
    // 1. OUTER CONTAINER
    <div className="flex-1 flex flex-col h-screen bg-gray-800">
      {/* TOP: Header stays fixed at the top */}
      <Header />

      {/* MIDDLE: The Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 text-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col justify-center h-full text-left">
          {message.length === 0 ? (
            // IF NO MESSAGES: Show a Premium Welcome Screen
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 bg-linear-to-tr from-blue-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-4xl">✨</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Welcome to Cortex
              </h1>
              <p className="text-lg text-gray-400 max-w-lg">
                Your intelligent workspace is ready. Type a message below to
                start exploring ideas, writing code, or analyzing data.
              </p>
            </div>
          ) : (
            // IF MESSAGES EXIST: Premium Avatar Layout (Left-Aligned)
            <div className="flex flex-col gap-8 py-8">
              {/* IF MESSAGES EXIST: The Combined Floating Avatar Layout! */}
              <div className="max-w-4xl mx-auto flex flex-col gap-6 py-6 w-full">
                {message.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex w-full gap-3 group ${
                      msg.role === "USER" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* ----- AI AVATAR (Only shows on the left) ----- */}
                    {msg.role === "AI" && (
                      <div className="shrink-0 mt-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
                          {/* SLEEK ROBOT SVG ICON */}
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

                    {/* ----- THE MESSAGE BUBBLE & NAME ----- */}
                    <div
                      className={`flex flex-col ${
                        msg.role === "USER" ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Role Label */}
                      <span
                        className={`text-sm font-semibold text-gray-400 mb-1 ${
                          msg.role === "USER" ? "mr-1" : "ml-1"
                        }`}
                      >
                        {msg.role === "USER" ? "You" : "Cortex AI"}
                      </span>

                      {/* The Actual Bubble */}
                      <div
                        className={`max-w-xl p-4 rounded-2xl shadow-md text-[15px] leading-relaxed ${
                          msg.role === "USER"
                            ? "bg-blue-600 text-white rounded-tr-none" // User Bubble (Right)
                            : "bg-gray-700 text-gray-200 rounded-tl-none" // AI Bubble (Left)
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>

                    {/* ----- USER AVATAR (Only shows on the right) ----- */}
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: Pass our helper function down to the Input Component! */}
      <ChatInput appendNewMessages={appendNewMessages} />
    </div>
  );
};

export default ChatArea;
