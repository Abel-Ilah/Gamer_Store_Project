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
  deleted: false,
};

const productsFilterSlice = createSlice({
  name: "adminProductsFilter",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.pageNumber = 1;
      state.productType = ProductType.All;
      state.categoryId = null;
    },

    setCategory(state, action) {
      state.categoryId = action.payload;
      state.pageNumber = 1;
      state.productType = ProductType.All;
      state.search = "";
      state.deleted = false;
    },

    setProductType(state, action) {
      state.productType = action.payload;
      state.pageNumber = 1;
      state.categoryId = null;
      state.search = "";
      state.deleted = false;
    },

    setPageNumber(state, action) {
      state.pageNumber = action.payload;
    },
    setDeleteStatus(state, action) {
      const isDeleted = action.payload;
      console.log("isdeleted ? ,", isDeleted);
      state.deleted = isDeleted;
      state.search = "";
      state.pageNumber = 1;
      state.productType = ProductType.All;
      state.categoryId = null;
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
  resetFilter,
  setFilter,
  setDeleteStatus,
} = productsFilterSlice.actions;

export default productsFilterSlice.reducer;
