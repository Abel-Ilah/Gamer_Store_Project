import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const controller = new AbortController();

export const getProductById = createAsyncThunk(
  "product/GetById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/${productId}`,
        {
          signal: controller.signal,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  product: null,
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    // get product by id :
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.product = null;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload;
      state.error = null;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.product = null;
    });
  },
});

export default productSlice.reducer;
