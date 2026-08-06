import { createSlice } from "@reduxjs/toolkit";
import { createLoginThunk, CUSTOMER } from "./loginThunkFactory";
import { createDeleteUserThunk } from "../SharedThunks/sharedThunks";

export const loginAsCustomer = createLoginThunk("customerAuth", CUSTOMER);

export const deleteAccount = createDeleteUserThunk("customerAuth");

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
    updateSavedLoginInfoLocallyForCustomer: (_, action) => {
      let savedLogin = localStorage.getItem("customer-login");
      if (savedLogin) {
        savedLogin = JSON.parse(savedLogin);
        savedLogin.password = action.payload;
        localStorage.setItem("customer-login", JSON.stringify(savedLogin));
      }
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
    updateCustomerPersonalInfoLocally: (state, action) => {
      const info = action.payload;
      state.customer.firstName = info.firstName;
      state.customer.lastName = info.lastName;
      state.customer.phoneNumber = info.phoneNumber;
      state.customer.address = info.address;
    },
  },
  extraReducers: (builder) => {
    // Customer Login
    builder
      .addCase(loginAsCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.customer = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAuthReady = false;
      })
      .addCase(loginAsCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customer = action.payload;
        state.isAuthenticated = true;
        state.isAuthReady = true;
      })
      .addCase(loginAsCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.customer = null;
        state.isAuthenticated = false;
        state.isAuthReady = true;
      });
    // Delete Customer Account (self deletion)
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.customer = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAuthReady = true;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
  updateCustomerPersonalInfoLocally,
  updateSavedLoginInfoLocallyForCustomer,
} = customerAuthSlice.actions;

export const selectCustomer = (state) => state.customerAuth.customer;

export default customerAuthSlice.reducer;
