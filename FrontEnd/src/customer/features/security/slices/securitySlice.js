import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// email verification :
export const SendEmailVerificationCode = createAsyncThunk(
  "emailVerification/send",
  async ({ userId, email }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/security/email-verification-request?userId=${userId}&email=${email}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "emailVerification/verify",
  async ({ userId, code }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/security/verify-email?userId=${userId}&code=${code}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// =============

// reset password :
// role can be "customer" or "admin"
export const sendResetPasswordToken = createAsyncThunk(
  "password/sendResetToken",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/security/reset-password-request?email=${email}&role=${role}`
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
        `http://localhost:5268/api/security/set-new-password?newPassword=${password}&token=${token}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// =============

const initialState = {
  loading: false,
  error: null,
};

const securitySlice = createSlice({
  name: "emailVerification",
  initialState,
  reducers: {},
});

export default securitySlice.reducer;
