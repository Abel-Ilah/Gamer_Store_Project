import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../features/auth/CustomerAuthSlice";
import cartReducer from "../features/cart/CartSlice";
import productsReducer from "../features/products/productsSlice";
import snackbarReducer from "../features/snackbar/SnackbarSlice";
import orderReducer from "../features/order/OrderSlice";
import reviewReducer from "../features/review/reviewSlice";
import wishlistReducer from "../features/wishlist/WishlistSlice";
import compareReducer from "../features/Compare/CompareSlice";
import ProudctsPageTitleReducer from "../features/productsPageTItle/ProductsPageTitleSlice";
import filterReducer from "../features/productsFilter/filterSlice";
import themeReducer from "../features/theme/ThemeSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    customerAuth: customerReducer,
    filter: filterReducer,
    products: productsReducer,
    snackbar: snackbarReducer,
    order: orderReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    title: ProudctsPageTitleReducer,
    theme: themeReducer,
  },
});
