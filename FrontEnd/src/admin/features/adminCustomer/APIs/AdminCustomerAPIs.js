import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5268/api/admin/customers";

export const filterCustomers = createAsyncThunk(
  "adminCustomer/filterCustomers",
  async (filter, thunkAPI) => {
    console.log("filter : ,", filter);
    try {
      const response = await axios.get(`${API_URL}/filter`, {
        params: filter,
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "adminCustomer/deleteCustomer",
  async (customerId, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/${customerId}`, {
        signal: thunkAPI.signal,
      });
      return {
        customerId,
        message: response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const restoreCustomer = createAsyncThunk(
  "adminCustomer/restoreCustomer",
  async (customerId, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${customerId}`, {
        signal: thunkAPI.signal,
      });
      return {
        customerId,
        message: response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);
