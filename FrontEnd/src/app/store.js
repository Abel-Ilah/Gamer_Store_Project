import { configureStore } from "@reduxjs/toolkit";

import customerReducer from "../customer/features/auth/CustomerAuthSlice";
import cartReducer from "../customer/features/cart/slices/CartSlice";
import productsReducer from "../customer/features/product/slices/productsSlice";
import snackbarReducer from "../customer/features/snackbar/SnackbarSlice";
import orderReducer from "../customer/features/order/slices/OrderSlice";
import wishlistReducer from "../customer/features/wishlist/slices/WishlistSlice";
import compareReducer from "../customer/features/Compare/slices/CompareSlice";
import ProudctsPageTitleReducer from "../customer/features/product/slices/ProductsPageTitleSlice";
import filterReducer from "../customer/features/product/slices/filterSlice";
import themeReducer from "../admin/features/theme/slices/ThemeSlice";
import dashboardReducer from "../admin/features/dashboard/slices/dashboardSlice";
import productsFilterReducer from "../admin/features/product/slices/productsFilterSlice";
import categoryReducer from "../common/slices/categorySlice";
export const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart: cartReducer,
    compare: compareReducer,
    customerAuth: customerReducer,
    dashboard: dashboardReducer,
    filter: filterReducer,
    productsFilter: productsFilterReducer,
    products: productsReducer,
    snackbar: snackbarReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    title: ProudctsPageTitleReducer,
    theme: themeReducer,
  },
});
