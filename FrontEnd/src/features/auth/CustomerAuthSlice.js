import { createSlice } from "@reduxjs/toolkit";
import { createLoginThunk, CUSTOMER } from "./loginThunkFactory";

export const customerLogin = createLoginThunk("customerAuth", CUSTOMER);

const customerAuthSlice = createSlice({
  name: "customerAuth",
  initialState: {
    customer: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    customerLogout: (state) => {
      state.customer = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(customerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(customerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(customerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { customerLogout: userLogout } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
