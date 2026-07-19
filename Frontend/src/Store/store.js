import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatslice";
import settingsReducer from "./settingsSlice"

const store = configureStore({
  reducer: {
    // This tells Redux: "Manage the 'chat' state using the logic from chatSlice.js"
    chat: chatReducer,
    settings: settingsReducer,
  },
});

export default store;
