import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addNewCustomer = createAsyncThunk(
  "customer/add",
  async (newCustomer, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5268/api/customers/add/me",
        newCustomer,
      );
      return res.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue("Email is already in use");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateMyInfo = createAsyncThunk(
  `customer/update`,
  async (personalInfo, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/customers/update-my-info`,
        personalInfo,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const changeMyPassword = createAsyncThunk(
  `customer/changePassword`,
  async (passwordInfo, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/customers/change-my-password`,
        passwordInfo,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteMyAccount = createAsyncThunk(
  `customer/delete`,
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/customers/delete/me?id=${userId}`,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  ready: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
});

export default customerSlice.reducer;
