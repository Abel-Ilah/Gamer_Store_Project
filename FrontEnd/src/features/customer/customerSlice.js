import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addNewCustomer = createAsyncThunk(
  "customer/add",
  async (newCustomer, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5268/api/customers/add",
        newCustomer
      );
      return res.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue("Email is already in use");
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
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
