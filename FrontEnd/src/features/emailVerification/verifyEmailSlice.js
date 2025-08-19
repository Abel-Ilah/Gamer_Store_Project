import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const verifyEmail = createAsyncThunk(
  "emailConfirmation/verifyEmail",
  async ({ userId, verificationCode }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/auth/verify-email?userId=${userId}&verificationCode=${verificationCode}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

const verifyEmailSlice = createSlice({
  name: "verifyEmail",
  initialState,
  reducers: {
    clearVerifyEmailState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.data = null;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export default verifyEmailSlice.reducer;
export const { clearVerifyEmailState } = verifyEmailSlice.actions;
