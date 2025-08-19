import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const controller = new AbortController();

export const SearchForProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ name, categoryId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/search?name=${name}&categoryId=${categoryId}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetRelatedProducts = createAsyncThunk(
  "products/relatedProducts",
  async ({ productId, pageSize }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/related-products?productId=${productId}&pageSize=${pageSize}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  success: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    // get related products :
    builder.addCase(GetRelatedProducts.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.products = null;
    });
    builder.addCase(GetRelatedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.products = action.payload;
    });
    builder.addCase(GetRelatedProducts.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.products = null;
    });
    // search products :
    builder.addCase(SearchForProducts.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.products = null;
    });
    builder.addCase(SearchForProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.products = action.payload;
    });
    builder.addCase(SearchForProducts.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.products = null;
    });
  },
});
export default productsSlice.reducer;
