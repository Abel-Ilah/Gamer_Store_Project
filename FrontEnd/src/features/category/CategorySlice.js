import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getLastDiscoutedCategory = createAsyncThunk(
  "discountedCategories/LastDiscountedCategory",
  async (_, { rejectWithValue }) => {
    try {
      var res = await axios.get(
        "http://localhost:5268/api/discounted-categories/discounted-category",
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getFeaturedCategories = createAsyncThunk(
  "categories/featured",
  async (_, { rejectWithValue }) => {
    try {
      var res = await axios.get(
        "http://localhost:5268/api/categories/featured",
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    id: 0,
    name: "",
    image_path: "",
    is_featured: false,
  },
  extraReducers: {},
});
export default categorySlice.reducer;
