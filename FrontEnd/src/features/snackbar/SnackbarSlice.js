import { createSlice } from "@reduxjs/toolkit";

export const SEVERITY_SUCCESS = "success";
export const SEVERITY_INFO = "info";
export const SEVERITY_WARNING = "warning";
export const SEVERITY_ERROR = "error";

const initialState = {
  message: "",
  severity: SEVERITY_SUCCESS,
};

export const SnackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showMessage: (state, action) => {
      const { message, severity } = action.payload;
      state.message = message;
      state.severity = severity;
    },
    clearSnackbarState: (state) => {
      state.message = "";
      state.severity = "";
    },
  },
});

export default SnackbarSlice.reducer;
export const { showMessage, clearSnackbarState } = SnackbarSlice.actions;
