import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const controller = new AbortController();

export const getProductReviews = createAsyncThunk(
  "reviews/getProductReviews",
  async ({ productId, pageNumber = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/reviews/product/${productId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        { signal: controller.signal },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (review, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/reviews/addReview`,
        review,
        { signal: controller.signal },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/reviews/${reviewId}`,
        { signal: controller.signal },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
export const getTopReviews = createAsyncThunk(
  "reviews/topReviews",
  async (pageSize, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/reviews/top-reviews?pageSize=${pageSize}`,
        { signal: controller.signal },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
