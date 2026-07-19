import { createSlice } from "@reduxjs/toolkit";

// 1. Check if the user has saved settings in their browser, otherwise use defaults!
const getInitialSettings = () => {
  const savedSettings = localStorage.getItem("cortex_settings");

  if (savedSettings) {
    return JSON.parse(savedSettings);
  }

  return {
    model: "gemini-pro", // Your default model
    systemPrompt: "You are Cortex, an intelligent and helpful AI assistant.",
    theme: "dark", // Placeholder for future theme support
  };
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialSettings(),
  reducers: {
    updateSettings: (state, action) => {
      // Update whatever fields the user changed
      if (action.payload.model !== undefined)
        state.model = action.payload.model;
      if (action.payload.systemPrompt !== undefined)
        state.systemPrompt = action.payload.systemPrompt;
      if (action.payload.theme !== undefined)
        state.theme = action.payload.theme;

      // 2. Instantly save the new state to localStorage so it survives page reloads!
      localStorage.setItem("cortex_settings", JSON.stringify(state));
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
