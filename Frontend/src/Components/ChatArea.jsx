import { useContext, useEffect, useState, useRef } from "react";
import Header from "./Header";
import ChatInput from "./ChatInput";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import CodeBlock from "./CodeBlock";

const ChatArea = () => {
  const { chatId } = useParams();
  const { token } = useContext(AuthContext);

  // State Management
  const [message, setmessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference to the bottom of the chat for auto-scrolling
  const endOfMessagesRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, isLoading, error]);

  // Fetch initial messages
  useEffect(() => {
    if (!chatId) return;
    const fetchmessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setmessage(response.data.messages);
      } catch (error) {
        console.log("Error Occured while fetching messages", error);
      }
    };
    fetchmessages();
  }, [chatId, token]);

  // The Streaming Function!
  const handleSendMessage = async (text) => {
    // 1. Optimistic Update for User
    const tempUserMsg = {
      _id: Date.now().toString(),
      content: text,
      role: "USER",
    };

    // 2. Temp AI Message (Blank to start)
    const tempAiMsgId = "ai-" + Date.now().toString();
    const tempAiMsg = { _id: tempAiMsgId, content: "", role: "AI" };

    setmessage((prev) => [...prev, tempUserMsg, tempAiMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // 3. Connect to the stream using Microsoft's library
      await fetchEventSource("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text, chatId: chatId }),

        onmessage(event) {
          try {
            const parsedData = JSON.parse(event.data);

            if (parsedData.chunk) {
              setmessage((prev) =>
                prev.map((msg) =>
                  msg._id === tempAiMsgId
                    ? { ...msg, content: msg.content + parsedData.chunk }
                    : msg,
                ),
              );
            }

            if (parsedData.done) {
              setmessage((prev) =>
                prev.map((msg) =>
                  msg._id === tempAiMsgId ? parsedData.aiMessage : msg,
                ),
              );
            }
          } catch (err) {
            console.error("Failed to parse event:", event.data);
          }
        },

        onerror(err) {
          throw err;
        },
      });
    } catch (err) {
      console.error("Message send error:", err);
      setError({ text });
      setmessage((prev) =>
        prev.filter((m) => m._id !== tempUserMsg._id && m._id !== tempAiMsgId),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (error && error.text) {
      handleSendMessage(error.text);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-800">
      <Header />

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 text-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col text-left">
          {message.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-32">
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
            <div className="flex flex-col gap-8 py-8">
              <div className="max-w-4xl mx-auto flex flex-col gap-6 py-6 w-full">
                {/* 1. Map through all real messages */}
                {message.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex w-full gap-3 group ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                  >
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

                    <div
                      className={`flex flex-col ${msg.role === "USER" ? "items-end" : "items-start"}`}
                    >
                      <span
                        className={`text-sm font-semibold text-gray-400 mb-1 ${msg.role === "USER" ? "mr-1" : "ml-1"}`}
                      >
                        {msg.role === "USER" ? "You" : "Cortex AI"}
                      </span>

                      {/* FIX: Check if the AI message is empty! */}
                      {msg.role === "AI" &&
                      msg._id.startsWith("ai-") &&
                      msg.content === "" ? (
                        <div className="max-w-xl p-4 rounded-2xl shadow-md bg-gray-700 text-gray-200 rounded-tl-none flex items-center gap-1 h-[56px]">
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        </div>
                      ) : (
                        <div
                          className={`max-w-xl p-4 rounded-2xl shadow-md text-[15px] leading-relaxed ${msg.role === "USER" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-700 text-gray-200 rounded-tl-none"}`}
                        >
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                              components={{
                                code({ className, children, ...props }) {
                                  // Check if the code has a language attached (like "language-javascript")

                                  //Regex expression to find language-javascript or language-python 
                                  const match = /language-(\w+)/.exec(
                                    className || "",
                                  );

                                  if (match) {
                                    // If it DOES have a language, it's a massive Code Block! Render our custom UI!
                                    return (
                                      <CodeBlock
                                        language={match[1]}
                                        value={String(children).replace(
                                          /\n$/,
                                          "",
                                        )}
                                      />
                                    );
                                  }

                                  // If it DOES NOT have a language, it's just a tiny inline code snippet.
                                  // We will make it look like a pink text box (similar to how Discord handles it).
                                  return (
                                    <code
                                      className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded-md font-mono text-sm"
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
                      )}
                    </div>

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

                {/* 3. Show Error Box if it fails! */}
                {error && (
                  <div className="flex flex-col items-center justify-center p-4 bg-red-900/50 border border-red-500 rounded-xl mt-4 mx-auto max-w-lg">
                    <span className="text-red-200 font-semibold mb-2">
                      Failed to reach the AI server.
                    </span>
                    <button
                      onClick={handleRetry}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Retry Message
                    </button>
                  </div>
                )}

                {/* This empty div acts as our anchor for auto-scrolling! */}
                <div ref={endOfMessagesRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatArea;
