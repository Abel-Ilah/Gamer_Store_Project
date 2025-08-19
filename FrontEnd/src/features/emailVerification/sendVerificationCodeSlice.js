import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const SendNewConfirmationCode = createAsyncThunk(
  "emailConfirmation/sendConfirmation",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/auth/send-confirmation?userId=${userId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

const sendVerificationCodeSlice = createSlice({
  name: "sendVerificationCode",
  initialState,
  reducers: {
    clearverificationCodeState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SendNewConfirmationCode.pending, (state) => {
        state.data = null;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(SendNewConfirmationCode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000);

        sessionStorage.setItem("createdAt", createdAt);
        sessionStorage.setItem("expiresAt", expiresAt);
      })
      .addCase(SendNewConfirmationCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export default sendVerificationCodeSlice.reducer;
export const { clearverificationCodeState } = sendVerificationCodeSlice.actions;
