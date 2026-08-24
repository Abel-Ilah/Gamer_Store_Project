import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "product/GetProducts",
  async (filter, thunkAPI) => {
    console.log("filter in thunk : ,", filter);
    try {
      const res = await axios.get("http://localhost:5268/api/products/filter", {
        params: filter,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getProductDetails = createAsyncThunk(
  "product/GetProductDetails",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/product/${productId}`,
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const findProduct = createAsyncThunk(
  "product/find",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/find/${productId}`,
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/products/delete/${productId}`,
        { signal: thunkAPI.signal },
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const restoreProduct = createAsyncThunk(
  "product/restore",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/products/restore/${productId}`,
        { signal: thunkAPI.signal },
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);
