import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//operations:
export const ADD_ITEM = "ADD_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
export const GET_WISHLIST = "GET_WISHLIST";
export const CLEAR_WISHLIST = "CLEAR_WISHLIST";

export const getUserWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (userId, thunkAPI) => {
    const storedWishlist = JSON.parse(sessionStorage.getItem("wishlist")) || [];

    if (storedWishlist && storedWishlist.length > 0) {
      const itemsToAddToWishlist = storedWishlist.map((item) => ({
        userId,
        productId: item.product.id,
      }));

      const action = await thunkAPI.dispatch(
        addColllectionOfWishlistItems(itemsToAddToWishlist)
      );
      if (action.meta.requestStatus === "fulfilled") {
        localStorage.setItem("hasWishlist", "true");
      }
      sessionStorage.removeItem("wishlist");
    }
    const hasWishlist = localStorage.getItem("hasWishlist");

    if (hasWishlist && hasWishlist === "false") return [];

    try {
      const res = await axios.get(
        `http://localhost:5268/api/wishlist?userId=${userId}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addNewWishlistItem = createAsyncThunk(
  "wishlist/addNewItem",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5268/api/wishlist", item);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addColllectionOfWishlistItems = createAsyncThunk(
  "wishlist/addRange",
  async (items, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5268/api/wishlist/AddRange",
        items
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteWishlistItem = createAsyncThunk(
  "wishlist/deleteItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/wishlist?itemId=${itemId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  wishlist: null,
  loading: false,
  success: false,
  error: null,
  operation: null,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistState: (state) => {
      state.wishlist = null;
      state.error = null;
      state.loading = false;
      state.success = false;
      state.operation = null;
    },

    getGuestWishlist: (state) => {
      const storedWishlist = JSON.parse(sessionStorage.getItem("wishlist"));
      state.wishlist = storedWishlist || [];
      state.error = null;
      state.loading = false;
      state.success = true;
      state.ready = true;
      state.operation = GET_WISHLIST;
    },
    // update local wishlist state to be async with database :
    AddNewWishlistItemLocal: (state, action) => {
      const newItem = action.payload;
      if (
        !state.wishlist ||
        state.wishlist.length === 0 ||
        !state.wishlist.some((item) => item.product.id === newItem.product.id)
      ) {
        state.wishlist =
          state.wishlist && state.wishlist.length > 0
            ? [...state.wishlist, newItem]
            : [newItem];

        if (newItem.userId) {
          if (state.wishlist.length === 1)
            localStorage.setItem("hasWishlist", true);
        } else {
          //add wishlist to session storage as guest wishlist
          sessionStorage.setItem("wishlist", JSON.stringify(state.wishlist));
        }
      }
    },

    deleteWishlistItemLocal: (state, action) => {
      const itemId = action.payload;
      if (state.wishlist && state.wishlist.length > 0) {
        state.wishlist = state.wishlist.filter((item) => item.id !== itemId);
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (currentUser) {
          if (state.wishlist.length === 0) {
            localStorage.setItem("hasWishlist", false);
          }
        } else {
          if (!state.wishlist || state.wishlist.length === 0) {
            sessionStorage.removeItem("wishlist");
          } else {
            sessionStorage.setItem("wishlist", JSON.stringify(state.wishlist));
          }
        }
      }
    },
    // ========================================================
  },
  extraReducers: (builder) => {
    // get wishlist items :
    builder.addCase(getUserWishlist.pending, (state) => {
      state.wishlist = null;
      state.loading = true;
      state.error = null;
      state.success = false;
      state.operation = GET_WISHLIST;
    });

    builder.addCase(getUserWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
      state.operation = GET_WISHLIST;
    });

    builder.addCase(getUserWishlist.rejected, (state, action) => {
      state.wishlist = null;
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.operation = GET_WISHLIST;
    });
  },
});

export default wishlistSlice.reducer;
export const {
  clearWishlistState,
  AddNewWishlistItemLocal,
  deleteWishlistItemLocal,
  getGuestWishlist,
} = wishlistSlice.actions;
