import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addChat, removeChat } from "../Store/chatslice";
import toast from "react-hot-toast";

// Custom Hooks
import { useAuth } from "../hooks/useAuth";
import { useChats } from "../hooks/useChats";
import { useDebounce } from "../hooks/useDebounce";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Clean Auth!
  const { token } = useAuth();

  // 2. Clean Data Fetching! (This completely replaces the massive useEffect!)
  const { isLoading } = useChats();

  const [searchQuery, setSearchQuery] = useState("");
  // 3. Clean Debouncing!
  const debouncedSearch = useDebounce(searchQuery, 300);

  const CreateNewChat = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chats`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Add the new chat to the very top of your list via Redux!
      dispatch(addChat(response.data.chat));
    } catch (error) {
      console.log("Error occured while Creating new chat", error);
    }
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation(); // Prevent the <li> onClick from navigating!
    
    // Optimistic UI update
    dispatch(removeChat(id));
    
    // If they are looking at the chat they deleted, redirect home
    if (window.location.pathname.includes(id)) {
      navigate("/");
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Chat deleted!", { style: { background: '#374151', color: '#fff' } });
    } catch (error) {
      console.error("Failed to delete chat", error);
      toast.error("Failed to delete chat.", { style: { background: '#374151', color: '#fff' } });
    }
  };

  return (
    <div 
      className={`bg-gray-900 text-white h-screen flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0
      ${isOpen ? "w-64 translate-x-0 p-4 border-r border-gray-700" : "w-0 -translate-x-full p-0 border-transparent overflow-hidden"}`}
    >
      <div className={`flex flex-col h-full w-[14rem] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 mt-2 mb-3">
          <input
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Search Chat"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 shrink-0 bg-gray-800 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-600"
            title="Close Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </button>
        </div>
        <button
          onClick={CreateNewChat}
          className="w-full border border-gray-600 rounded-md p-2 hover:bg-gray-800 transition-colors"
        >
          + New chat
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar mt-6">
        <p className="text-xs text-gray-400 font-semibold mb-3 uppercase">
          Recent Chat
        </p>
        <ul className="space-y-2">
          {isLoading ? (
            <>
              <li className="h-10 bg-gray-800 rounded-md animate-pulse"></li>
              <li className="h-10 bg-gray-800 rounded-md animate-pulse"></li>
              <li className="h-10 bg-gray-800 rounded-md animate-pulse"></li>
            </>
          ) : chats.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-sm">No chats found.</p>
              <p className="text-xs mt-1">Start a new conversation!</p>
            </div>
          ) : (
            chats
              .filter((chat) =>
                chat.title?.toLowerCase().includes(debouncedSearch.toLowerCase()),
              )
              .map((chat) => (
                <li
                  key={chat._id}
                  className="group flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded-md transition-colors"
                  onClick={() => navigate("/chat/" + chat._id)}
                >
                  <span className="truncate pr-2">{chat.title}</span>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-all"
                    title="Delete Chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </li>
              ))
          )}
        </ul>
      </div>

      <div className="border-t border-gray-700 pt-4 mt-2">
        <button
          onClick={() => navigate("/settings")}
          className="w-full text-left hover:bg-gray-800 p-2 rounded-md mb-2"
        >
          ⚙ Settings
        </button>

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer"
        >
          <img
            src="https://ui-avatars.com/api/?name=User&background=random"
            alt="Profile Image"
            className="w-8 h-8 rounded-full"
          />
          <button>Profile</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
