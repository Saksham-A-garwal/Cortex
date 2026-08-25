import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatslice";
import settingsReducer from "./settingsSlice"

const store = configureStore({
  reducer: {
    chat: chatReducer,
    settings: settingsReducer,
  },
});

export default store;
