import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// roles :
export const ADMIN = "admin";
export const CUSTOMER = "customer";

export const createLoginThunk = (sliceName, role) =>
  createAsyncThunk(
    `${sliceName}/login`,
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
          role,
        });
        return res.data; // { user, token, role }
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
