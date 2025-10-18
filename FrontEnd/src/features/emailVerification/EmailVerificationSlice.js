import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// confirm email :
export const SendNewConfirmationCode = createAsyncThunk(
  "emailVerification/sendVerification",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/auth/send-verification?email=${email}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "emailVerification/verify",
  async (verification, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/auth/verify-email`,
        verification
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// =============

// reset password :

export const sendResetPasswordToken = createAsyncThunk(
  "password/sendResetToken",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/auth/send-reset-token?email=${email}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createNewPassword = createAsyncThunk(
  "password/new-password",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/auth/new-password?newPassword=${password}&token=${token}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// =============

const initialState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

const EamilVerificationSlice = createSlice({
  name: "emailVerification",
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
      })
      .addCase(SendNewConfirmationCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export default EamilVerificationSlice.reducer;
export const { clearverificationCodeState } = EamilVerificationSlice.actions;
