import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//tag names:
export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
export const GET_PRODUCTS_BY_CATEGORY = "GET_PRODUCTS_BY_CATEGORY";
export const GET_NEW_PRODUCTS = "GET_NEW_PRODUCTS";
export const GET_DISCOUNTED_PRODUCTS = "GET_DISCOUNTED_PRODUCTS";
export const GET_BEST_SELLERS = "GET_BEST_SELLERS";
export const GET_TOP_RATED_PRODUCTS = "GET_TOP_RATED_PRODUCTS";

const controller = new AbortController();

// get products with filter :

export const getFilteredProducts = createAsyncThunk(
  "products/filteredProducts",
  async (filter, { rejectWithValue }) => {
    const { price, page, tag } = filter;
    let url = "";
    switch (tag.name) {
      case GET_ALL_PRODUCTS:
        url = `http://localhost:5268/api/products?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      case GET_PRODUCTS_BY_CATEGORY:
        url = `http://localhost:5268/api/products/filtered-Category?categoryId=${tag.value}&pageNumber=${page.number}&pageSize=${page.size}&MinPrice=${price.min}&MaxPrice=${price.max}`;
        break;
      case GET_NEW_PRODUCTS:
        url = `http://localhost:5268/api/products/filtered-new-products?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      case GET_DISCOUNTED_PRODUCTS:
        url = `http://localhost:5268/api/products/filtered-discounts?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      case GET_TOP_RATED_PRODUCTS:
        url = `http://localhost:5268/api/products/filtered-top-rated?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      case GET_BEST_SELLERS:
        url = `http://localhost:5268/api/products/filtered-best-sellers?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      default:
        url = `http://localhost:5268/api/products?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
    }
    if (url) {
      sessionStorage.setItem("filter", JSON.stringify(filter));
    }
    try {
      const res = await axios.get(url, { signal: controller.signal });

      // cache the result in session storage
      var cachedProducts = JSON.parse(sessionStorage.getItem("cachedProducts"));
      if (cachedProducts && cachedProducts.length > 0) {
        if (cachedProducts.length > 100) {
          cachedProducts.shift();
        }
        cachedProducts.unshift(JSON.stringify({ filter, result: res }));
      } else {
        cachedProducts = [{ filter, result: res }];
      }
      sessionStorage.setItem("cachedProducts", JSON.stringify(cachedProducts));

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get products with no filter :

export const getMixedProducts = createAsyncThunk(
  "products/mixedProducts",
  async (productsCount, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/All?pageSize=${productsCount}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBestSellers = createAsyncThunk(
  "products/bestSellers",
  async (productsCount, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/best-sellers?pageSize=${productsCount}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getNewProducts = createAsyncThunk(
  "products/_10NewProducts",
  async (productsCount, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/new-products?pageSize=${productsCount}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDiscountedProducts = createAsyncThunk(
  "products/discountedProducts",
  async (productsCount, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/discounts?pageSize=${productsCount}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProductsByCategoryId = createAsyncThunk(
  "products/category",
  async ({ categoryId, productsCount }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/category?categoryId=${categoryId}&pageSize=${productsCount}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      console.log("errrrr : ", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchForProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ name, categoryId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/search?name=${name}&categoryId=${categoryId}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getHeroSectionProducts = createAsyncThunk(
  "products/heroSection",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/hero-section`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  success: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    // get filtered products :
    builder.addCase(getFilteredProducts.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.data = null;
    });
    builder.addCase(getFilteredProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = action.payload;
      console.log("data", state.data);
    });
    builder.addCase(getFilteredProducts.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.data = null;
    });
  },
});
export default productsSlice.reducer;
