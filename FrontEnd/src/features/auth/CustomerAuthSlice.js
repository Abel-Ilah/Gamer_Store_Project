import { createSlice } from "@reduxjs/toolkit";
import { createLoginThunk, CUSTOMER } from "./loginThunkFactory";

export const loginAsCustomer = createLoginThunk("customerAuth", CUSTOMER);

const initialState = {
  customer: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isAuthReady: false,
};
const customerAuthSlice = createSlice({
  name: "customerAuth",
  initialState,
  reducers: {
    autoLoginAsCustomer: (state, action) => {
      state.customer = action.payload.customer;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAuthReady = true;
    },
    customerLogout: (state) => {
      state.customer = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAuthReady = true;

      let savedLogin = localStorage.getItem("customer-login");
      if (savedLogin) {
        savedLogin = JSON.parse(savedLogin);
        if (savedLogin.autoLogin) {
          localStorage.setItem(
            "customer-login",
            JSON.stringify({ ...savedLogin, autoLogin: false })
          );
        }
      }
    },
    markCustomerEmailAsVerified: (state) => {
      if (state.customer) {
        state.customer.isEmailConfirmed = true;
      }
    },
    markCustomerAuthAsReady: (state) => {
      state.isAuthReady = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.customer = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAuthReady = false;
        console.log("customer login pending...");
      })
      .addCase(loginAsCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customer = action.payload;
        state.isAuthenticated = true;
        state.isAuthReady = true;
        console.log("customer logged in: ", action.payload);
      })
      .addCase(loginAsCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.customer = null;
        state.isAuthenticated = false;
        state.isAuthReady = true;
      });
  },
});

export const getSavedCustomerLoginInfo = () => {
  try {
    const savedLogin = localStorage.getItem("customer-login");
    return savedLogin ? JSON.parse(savedLogin) : null;
  } catch {
    return null;
  }
};
export const saveCustomerLoginInfo = (email, password) => {
  console.log("saving customer login info to localStorage");
  console.log("email:", email, "password:", password);
  localStorage.setItem(
    "customer-login",
    JSON.stringify({
      email,
      password,
      autoLogin: true,
    })
  );
};
export const {
  customerLogout,
  autoLoginAsCustomer,
  markCustomerEmailAsVerified,
  markCustomerAuthAsReady,
} = customerAuthSlice.actions;

export const selectCustomer = (state) => state.customerAuth.customer;

export default customerAuthSlice.reducer;
