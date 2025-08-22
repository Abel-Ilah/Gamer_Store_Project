import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const controller = new AbortController();

export const getProductReviews = createAsyncThunk(
  "review/getProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/reviews/product/${productId}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async (review, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/reviews/addReview`,
        review,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  reviews: null,
  loading: false,
  success: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    addReviewToLocalState: (state, action) => {
      const newReview = action.payload;
      state.reviews =
        state.reviews && state.reviews.length > 0
          ? [newReview, ...state.reviews]
          : [newReview];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductReviews.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.reviews = null;
    });
    builder.addCase(getProductReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.reviews = action.payload;
      state.error = null;
    });
    builder.addCase(getProductReviews.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.reviews = null;
    });
  },
});

export default reviewSlice.reducer;

export const { addReviewToLocalState } = reviewSlice.actions;
