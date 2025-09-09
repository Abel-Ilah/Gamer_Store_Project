import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const controller = new AbortController();

export const getProductReviews = createAsyncThunk(
  "reviews/getProductReviews",
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
export const getTopReviews = createAsyncThunk(
  "reviews/topReviews",
  async (pageSize, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/reviews/top-reviews?pageSize=${pageSize}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const addReview = createAsyncThunk(
  "reviews/addReview",
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
export const editReview = createAsyncThunk(
  "reviews/editReview",
  async (review, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/reviews/updateReview`,
        review,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/reviews/${reviewId}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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
    removeReviewFromLocalState: (state, action) => {
      if (state.reviews && state.reviews.length > 0) {
        const deletedReviewId = action.payload;
        state.reviews = state.reviews.filter((r) => r.id !== deletedReviewId);
      }
    },
    updateReviewInLocalState: (state, action) => {
      if (state.reviews && state.reviews.length > 0) {
        const updatedReview = action.payload;
        state.reviews = state.reviews.map((r) =>
          r.id === updatedReview.id
            ? {
                ...r,
                comment: updatedReview.comment,
                rating:
                  updatedReview.rating > 0 && updatedReview.rating <= 5
                    ? updatedReview.rating
                    : 5,
              }
            : r
        );
      }
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

export const {
  addReviewToLocalState,
  updateReviewInLocalState,
  removeReviewFromLocalState,
} = reviewSlice.actions;
