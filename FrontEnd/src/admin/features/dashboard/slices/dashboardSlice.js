import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GetDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "http://localhost:5268/api/admin/dashboard",
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(GetDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
