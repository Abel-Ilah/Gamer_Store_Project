import { createSlice } from "@reduxjs/toolkit";
import settings from "../../../../appsettings.json";

//tag names:
export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
export const GET_PRODUCTS_BY_CATEGORY = "GET_PRODUCTS_BY_CATEGORY";
export const GET_NEW_PRODUCTS = "GET_NEW_PRODUCTS";
export const GET_DISCOUNTED_PRODUCTS = "GET_DISCOUNTED_PRODUCTS";
export const GET_BEST_SELLERS = "GET_BEST_SELLERS";
export const GET_TOP_RATED_PRODUCTS = "GET_TOP_RATED_PRODUCTS";

let savedFilter = null;
try {
  savedFilter = JSON.parse(sessionStorage.getItem("filter"));
} catch {
  savedFilter = null;
}

let initialState = savedFilter ?? {
  tag: {
    name: GET_ALL_PRODUCTS,
    value: GET_ALL_PRODUCTS,
  },
  price: {
    min: 1,
    max: 100_000,
  },
  page: {
    number: 1,
    size: settings.productsPageSize,
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterTag: (state, action) => {
      const { name, value } = action.payload || {};
      if (!name || !value) return;
      if (name === state.tag.name && value === state.tag.value) {
        return;
      }
      state.tag = { name, value };
      state.page.number = 1;
      state.price.min = 1;
      state.price.max = 100000;
      saveFilter(state);
    },
    setPriceRange: (state, action) => {
      const { min, max } = action.payload || {};

      if (!min || !max) return;
      if (min === state.price.min && max === state.price.max) return;

      state.price.min = min;
      state.price.max = max;
      state.page.number = 1;
      saveFilter(state);
    },
    setPageNumber: (state, action) => {
      state.page.number = action.payload;
      saveFilter(state);
    },
  },
});

function saveFilter(filter) {
  sessionStorage.setItem("filter", JSON.stringify(filter));
}

export const { setFilterTag, setPriceRange, setPageNumber } =
  filterSlice.actions;

export default filterSlice.reducer;
