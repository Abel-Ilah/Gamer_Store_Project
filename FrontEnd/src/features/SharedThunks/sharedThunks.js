import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createDeleteUserThunk = (sliceName) =>
  createAsyncThunk(
    `${sliceName}/delete`,
    async (userId, { rejectWithValue }) => {
      try {
        const res = await axios.delete(
          `http://localhost:5268/api/customers/delete?id=${userId}`
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const updatePersonalInfoThunk = (sliceName) =>
  createAsyncThunk(
    `${sliceName}/updatePersonalInfo`,
    async (personalInfo, { rejectWithValue }) => {
      try {
        const res = await axios.put(
          `http://localhost:5268/api/customers/update-personal-info`,
          personalInfo
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const changePasswordThunk = (sliceName) =>
  createAsyncThunk(
    `${sliceName}/changePassword`,
    async (passwordInfo, { rejectWithValue }) => {
      try {
        const res = await axios.put(
          `http://localhost:5268/api/customers/change-password`,
          passwordInfo
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
// http://localhost:5268/api/customers/change-password
