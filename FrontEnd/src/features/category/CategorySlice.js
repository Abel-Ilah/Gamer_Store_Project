import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getLastDiscoutedCategory = createAsyncThunk(
  "discountedCategories/LastDiscountedCategory",
  async (_, { rejectWithValue }) => {
    try {
      var res = await axios.get(
        "http://localhost:5268/api/discounted-categories/discounted-category"
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
