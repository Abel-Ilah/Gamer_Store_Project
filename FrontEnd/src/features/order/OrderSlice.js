import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const controller = new AbortController();

export const AddNewOrder = createAsyncThunk(
  "order/addNewOrder",
  async (newOrder, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5268/api/order/NewOrder`,
        newOrder,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetOrderById = createAsyncThunk(
  "order/GetById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/order/GetOrderById?id=${id}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: (builder) => {
    // add new order :
    builder.addCase(AddNewOrder.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.data = null;
    });

    builder.addCase(AddNewOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.data = action.payload;
      state.error = null;
    });

    builder.addCase(AddNewOrder.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.data = null;
    });
    // get order by id :
    builder.addCase(GetOrderById.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.data = null;
    });

    builder.addCase(GetOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.data = action.payload;
      state.error = null;
    });

    builder.addCase(GetOrderById.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.data = null;
    });
  },
});

export default orderSlice.reducer;
