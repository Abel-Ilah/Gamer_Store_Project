import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/UserSlice";
import sendEmailVerificationReducer from "../features/emailVerification/sendVerificationCodeSlice";
import verifyEmailReducer from "../features/emailVerification/verifyEmailSlice";
import cartReducer from "../features/cart/CartSlice";
import productsReducer from "../features/products/productsSlice";
import snackbarReducer from "../features/snackbar/SnackbarSlice";
import orderReducer from "../features/order/OrderSlice";
import reviewReducer from "../features/review/reviewSlice";
import wishlistReducer from "../features/wishlist/WishlistSlice";
import compareReducer from "../features/Compare/CompareSlice";
import ProudctsPageTitleReducer from "../features/productsPageTItle/ProductsPageTitleSlice";
import headerCssPositionReducer from "../features/header/HeaderPositionSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    sendVerificationCode: sendEmailVerificationReducer,
    verifyEmail: verifyEmailReducer,
    cart: cartReducer,
    products: productsReducer,
    snackbar: snackbarReducer,
    order: orderReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    title: ProudctsPageTitleReducer,
    headerCssPosition: headerCssPositionReducer,
  },
});
