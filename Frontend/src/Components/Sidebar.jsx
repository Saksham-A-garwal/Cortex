import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

const Sidebar = () => {
  const [chats, setChats] = useState([]);
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const CreateNewChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chats",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Add the new chat to the very top of your list!
      setChats([response.data.chat, ...chats]);
    } catch (error) {
      console.log("Error occured while Creating new chat", error);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data.chats);
      } catch (error) {
        console.log("Error occured while getting the chats", error);
      }
    };

    fetchChats(); // Actually call the function!
  }, [token]);
  return (
    // 1. MAIN WRAPPER
    // bg-gray-900 = dark background | text-white = white text
    // w-64 = fixed width | h-screen = full screen height
    // flex flex-col justify-between = stack vertically, push top/bottom apart
    <div className="bg-gray-900 text-white w-64 h-screen flex flex-col justify-between p-4">
      {/* 2. TOP SECTION */}
      <div>
        {/* border, padding (p-2), rounded corners, full width (w-full), hover effect */}
        <input
          className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-4 mb-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Search Chat"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={CreateNewChat}
          className="w-full border border-gray-600 rounded-md p-2 hover:bg-gray-800 transition-colors"
        >
          + New chat
        </button>
      </div>

      {/* 3. MIDDLE SECTION */}
      {/* flex-1 = take up all remaining empty space in the middle! */}
      {/* overflow-y-auto = add a scrollbar if the list gets too long */}
      <div className="flex-1 overflow-y-auto no-scrollbar mt-6">
        <p className="text-xs text-gray-400 font-semibold mb-3 uppercase">
          Recent Chat
        </p>
        <ul className="space-y-2">
          {chats
            .filter((chat) =>
              chat.title?.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((chat) => (
              <li
                key={chat._id}
                className="cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                onClick={() => navigate("/chat/" + chat._id)}
              >
                {chat.title}
              </li>
            ))}
        </ul>
      </div>

      {/* 4. BOTTOM SECTION */}
      <div className="border-t border-gray-700 pt-4 mt-2">
        <button
          onClick={() => navigate("/settings")}
          className="w-full text-left hover:bg-gray-800 p-2 rounded-md mb-2"
        >
          ⚙ Settings
        </button>

        {/* flex items-center = align image and text horizontally in a row */}
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
  );
};

export default Sidebar;
