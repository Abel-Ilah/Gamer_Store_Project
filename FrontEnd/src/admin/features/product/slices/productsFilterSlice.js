import { createSlice } from "@reduxjs/toolkit";

export const ProductType = Object.freeze({
  All: "All",
  BestSeller: "BestSeller",
  TopRated: "TopRated",
  InStock: "InStock",
  LowStock: "LowStock",
  NoStock: "NoStock",
  Discounted: "Discounted",
});

const initialState = {
  search: "",
  categoryId: null,
  productType: ProductType.All,
  pageNumber: 1,
  pageSize: 20,
};

const productsFilterSlice = createSlice({
  name: "adminProductsFilter",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.pageNumber = 1;
    },

    setCategory(state, action) {
      state.categoryId = action.payload;
      state.pageNumber = 1;
    },

    setProductType(state, action) {
      state.productType = action.payload;
      state.pageNumber = 1;
    },

    setPageNumber(state, action) {
      state.pageNumber = action.payload;
    },

    setPageSize(state, action) {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },

    resetFilter() {
      return initialState;
    },

    setFilter(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  setSearch,
  setCategory,
  setProductType,
  setPageNumber,
  setPageSize,
  resetFilter,
  setFilter,
} = productsFilterSlice.actions;

export default productsFilterSlice.reducer;
