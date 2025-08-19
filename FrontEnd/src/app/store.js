import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filter/filterSlice";
import userReducer from "../features/users/UserSlice";
import sendEmailVerificationReducer from "../features/emailVerification/sendVerificationCodeSlice";
import verifyEmailReducer from "../features/emailVerification/verifyEmailSlice";
import cartReducer from "../features/cart/CartSlice";
import productsReducer from "../features/products/productsSlice";
import snackbarReducer from "../features/snackbar/SnackbarSlice";
import orderReducer from "../features/order/OrderSlice";
export const store = configureStore({
  reducer: {
    filter: filterReducer,
    user: userReducer,
    sendVerificationCode: sendEmailVerificationReducer,
    verifyEmail: verifyEmailReducer,
    cart: cartReducer,
    products: productsReducer,
    snackbar: snackbarReducer,
    order: orderReducer,
  },
});
