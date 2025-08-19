import { createSlice } from "@reduxjs/toolkit";
// import { GET_NEW_PRODUCTS } from "../../reducers/ProductsReducer";
import appsettings from "../../appsettings.json";

const storedFilter = JSON.parse(sessionStorage.getItem("filter"));
const initialState = storedFilter
  ? storedFilter
  : {
      action: {
        actionType: "GET_NEW_PRODUCTS",
        actionValue: "GET_NEW_PRODUCTS",
      },
      page: {
        pageSize: appsettings.productsPageSize,
        pageNumber: 1,
      },
      priceRange: {
        min: 1,
        max: 50000,
      },
    };

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      return {
        ...state,
        ...action.payload,
        page: { ...state.page, pageNumber: 1 },
        priceRange: { min: 1, max: 50000 },
      };
    },
    updatePriceRange: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updatePageNumber: (state, action) => {
      state.page.pageNumber = action.payload;
    },
  },
});
export const { updateFilter, updatePriceRange, updatePageNumber } =
  filterSlice.actions;

export default filterSlice.reducer;

export const getFilter = (state) => state.filter;
