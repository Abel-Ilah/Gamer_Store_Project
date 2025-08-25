import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//tag names:
export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
export const GET_PRODUCTS_BY_CATEGORY = "GET_PRODUCTS_BY_CATEGORY";
export const GET_NEW_PRODUCTS = "GET_NEW_PRODUCTS";
export const GET_DISCOUNTED_PRODUCTS = "GET_DISCOUNTED_PRODUCTS";
export const GET_BEST_SELLERS = "GET_BEST_SELLERS";
// export const GET_PRODUCT_BY_ID = "GET_PRODUCT_BY_ID";
// export const GET_POPULAR_PRODUCTS = "GET_POPULAR_PRODUCTS";

const controller = new AbortController();

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

export const getRelatedProducts = createAsyncThunk(
  "products/relatedProducts",
  async ({ productId, pageSize }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/related-products?productId=${productId}&pageSize=${pageSize}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
        url = `http://localhost:5268/api/products/${tag.value}?pageNumber=${page.number}&pageSize=${page.size}&MinPrice=${price.min}&MaxPrice=${price.max}`;
        break;
      case GET_NEW_PRODUCTS:
        url = `http://localhost:5268/api/products/new-products?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      case GET_DISCOUNTED_PRODUCTS:
        url = `http://localhost:5268/api/products/discounts?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      // case GET_POPULAR_PRODUCTS:
      //   url = `http://localhost:5268/api/products/popular-products`;
      //   sessionStorage.setItem("filter", JSON.stringify(filter));
      //   break;
      case GET_BEST_SELLERS:
        url = `http://localhost:5268/api/products/best-sellers?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
        break;
      default:
        url = `http://localhost:5268/api/products?pageNumber=${page.number}&pageSize=${page.size}&minPrice=${price.min}&maxPrice=${price.max}`;
    }
    if (url) {
      sessionStorage.setItem("filter", JSON.stringify(filter));
    }
    try {
      const res = await axios.get(url, { signal: controller.signal });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get 10 products:

export const get10MixedProducts = createAsyncThunk(
  "products/_10Products",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products?pageNumber=${1}&pageSize=${10}&minPrice=${1}&maxPrice=${10000000}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const get10BestSellers = createAsyncThunk(
  "products/_10BestSellers",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/best-sellers?pageNumber=${1}&pageSize=${10}&minPrice=${1}&maxPrice=${10000000}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const get10NewProducts = createAsyncThunk(
  "products/_10NewProducts",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/new-products?pageNumber=${1}&pageSize=${10}&minPrice=${1}&maxPrice=${10000000}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const get10DiscountedProducts = createAsyncThunk(
  "products/_10DiscountedProducts",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/products/discounts?pageNumber=${1}&pageSize=${10}&minPrice=${1}&maxPrice=${10000000}`,
        { signal: controller.signal }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  products: null,
  loading: false,
  success: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    // get related products :
    builder.addCase(getRelatedProducts.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.products = null;
    });
    builder.addCase(getRelatedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.products = action.payload;
    });
    builder.addCase(getRelatedProducts.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.products = null;
    });

    // search products :
    builder.addCase(searchForProducts.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.products = null;
    });
    builder.addCase(searchForProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.products = action.payload;
    });
    builder.addCase(searchForProducts.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.products = null;
    });

    // get filtered products :
    builder.addCase(getFilteredProducts.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.products = null;
    });
    builder.addCase(getFilteredProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.products = action.payload;
    });
    builder.addCase(getFilteredProducts.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.products = null;
    });
  },
});
export default productsSlice.reducer;
