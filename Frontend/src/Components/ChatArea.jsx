import { useEffect, useState, useRef } from "react";
import ChatInput from "./ChatInput";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useDispatch, useSelector } from "react-redux";
import { updateChatTitle } from "../Store/chatslice";

// Custom Hooks
import { useAuth } from "../hooks/useAuth";
import { useAutoScroll } from "../hooks/useAutoScroll";

// 🚀 NEW: Import our clean UI components!
import WelcomeScreen from "./WelcomeScreen";
import MessageBubble from "./MessageBubble";

const ChatArea = () => {
  const { chatId } = useParams();

  const { token } = useAuth();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  const [message, setmessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const endOfMessagesRef = useAutoScroll([message, isLoading, error]);

  useEffect(() => {
    if (!chatId) {
      setmessage([]); // If we navigate to home, immediately clear the screen!
      return;
    }
    const fetchmessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setmessage(response.data.messages);
      } catch (error) {
        console.log("Error Occured while fetching messages", error);
      }
    };
    fetchmessages();
  }, [chatId, token]);

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);

      setmessage((prev) =>
        prev.map((msg) =>
          msg.role === "AI" && msg._id.startsWith("ai-") && msg.content === ""
            ? { ...msg, content: "*[Generation stopped by user]*" }
            : msg,
        ),
      );
    }
  };

  const handleSendMessage = async (text) => {
    abortControllerRef.current = new AbortController();

    const tempUserMsg = {
      _id: Date.now().toString(),
      content: text,
      role: "USER",
    };

    const tempAiMsgId = "ai-" + Date.now().toString();
    const tempAiMsg = { _id: tempAiMsgId, content: "", role: "AI" };

    setmessage((prev) => [...prev, tempUserMsg, tempAiMsg]);
    setIsLoading(true);
    setError(null);

    try {
      await fetchEventSource(`${import.meta.env.VITE_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          content: text, 
          chatId: chatId,
          model: settings.model,
          systemPrompt: settings.systemPrompt
        }),

        signal: abortControllerRef.current.signal,

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

              if (parsedData.newTitle) {
                dispatch(
                  updateChatTitle({
                    chatId: chatId,
                    newTitle: parsedData.newTitle,
                  }),
                );
              }
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
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Generation successfully stopped by the user.");
      } else {
        console.error("Message send error:", err);
        setError({ text });
        setmessage((prev) =>
          prev.filter(
            (m) => m._id !== tempUserMsg._id && m._id !== tempAiMsgId,
          ),
        );
      }
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
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 text-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col text-left h-full">
          {/* 🚀 LOOK AT HOW CLEAN THIS IS NOW! */}
          {message.length === 0 && !isLoading ? (
            <WelcomeScreen />
          ) : (
            <div className="flex flex-col gap-8 py-8 h-full">
              <div className="max-w-4xl mx-auto flex flex-col gap-6 py-6 w-full">
                {/* 🚀 AND LOOK AT HOW CLEAN THIS LOOP IS NOW! */}
                {message.map((msg) => (
                  <MessageBubble key={msg._id} msg={msg} />
                ))}

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

                <div ref={endOfMessagesRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center -mb-2 z-10 relative">
          <button
            onClick={handleStopGenerating}
            className="flex items-center gap-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-semibold border border-gray-600 hover:border-red-500 transition-all shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            Stop Generating
          </button>
        </div>
      )}

      <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatArea;
