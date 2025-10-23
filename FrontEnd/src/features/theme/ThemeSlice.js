// src/redux/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("themeMode");

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: savedTheme ? savedTheme === "dark" : false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("themeMode", state.darkMode ? "dark" : "light");
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
