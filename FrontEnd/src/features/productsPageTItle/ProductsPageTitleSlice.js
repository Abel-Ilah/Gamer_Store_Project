import { createSlice } from "@reduxjs/toolkit";

const ProductsPageTitle = createSlice({
  name: "title",
  initialState: {
    title: "Products",
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    clearTitle: (state) => {
      state.title = "Products";
    },
  },
});

export const { setTitle, clearTitle } = ProductsPageTitle.actions;
export default ProductsPageTitle.reducer;
