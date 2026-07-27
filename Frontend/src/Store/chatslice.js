import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [], // This will hold all the Sidebar chats!
  },
  reducers: {
    // 1. Completely overwrite the chats array (used when fetching from the database)
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    // 2. Add a brand new chat to the very top of the list
    // If the chat already exists, move it to the top instead of duplicating.
    addChat: (state, action) => {
      const newChat = action.payload;
      const existingIndex = state.chats.findIndex((c) => c._id === newChat._id);
      if (existingIndex >= 0) {
        state.chats.splice(existingIndex, 1);
      }
      state.chats.unshift(newChat);
    },

    // 3. Find a specific chat and update its title!
    updateChatTitle: (state, action) => {
      const { chatId, newTitle } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) {
        chat.title = newTitle; // Redux Toolkit lets us mutate state directly thanks to Immer.js!
      }
    },

    // 4. Remove a specific chat from the list
    removeChat: (state, action) => {
      state.chats = state.chats.filter((c) => c._id !== action.payload);
    },
  },
});

export const { setChats, addChat, updateChatTitle, removeChat } =
  chatSlice.actions;
export default chatSlice.reducer;
