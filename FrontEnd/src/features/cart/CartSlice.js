import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//operations:
export const GET_CART = "GET_CART";
export const ADD_ITEM = "ADD_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
export const DELETE_CART = "DELETE_CART";

export const GetUserCart = createAsyncThunk(
  "cart/getCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/cart?userId=${userId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const AddNewItem = createAsyncThunk(
  "cart/addNewItem",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5268/api/cart/addCartItem",
        item
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const UpdateItemQuantity = createAsyncThunk(
  "cart/updateItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5268/api/cart/updateCartItem?itemId=${itemId}&quantity=${quantity}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteItem = createAsyncThunk(
  "cart/deleteItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/cart/deleteCartItem?itemId=${itemId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/cart/clearCart?userId=${userId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  cart: null,
  loading: false,
  success: false,
  error: null,
  operation: null,
  ready: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    markCartAsReady: (state) => {
      state.ready = true;
    },
    clearCartStatus: (state) => {
      state.error = null;
      state.loading = false;
      state.success = false;
      state.operation = null;
      state.ready = false;
    },
    clearCartState: (state) => {
      state.cart = null;
      state.error = null;
      state.loading = false;
      state.success = false;
      state.operation = null;
      state.ready = false;
    },

    getGuestCart: (state) => {
      const storedCart = JSON.parse(sessionStorage.getItem("cart"));
      state.cart = storedCart && storedCart.length > 0 ? storedCart : null;
      state.error = null;
      state.loading = false;
      state.success = true;
      state.ready = true;
      state.operation = GET_CART;
    },
    // update local cart state to be async with database cart :
    AddNewItemLocal: (state, action) => {
      const newItem = action.payload;
      if (
        !state.cart ||
        state.cart.length === 0 ||
        !state.cart.some((item) => item.product.id === newItem.product.id)
      ) {
        state.cart =
          state.cart && state.cart.length > 0
            ? [...state.cart, newItem]
            : [newItem];

        if (newItem.userId) {
          if (state.cart.length === 1) localStorage.setItem("hasCart", true);
        } else {
          //add cart to session storage as guest cart
          sessionStorage.setItem("cart", JSON.stringify(state.cart));
        }
      }
    },
    updateItemQuantityLocal: (state, action) => {
      const { itemId, quantity } = action.payload;
      if (state.cart) {
        const index = state.cart.findIndex((item) => item.id === itemId);
        if (index !== -1) {
          state.cart[index].quantity = quantity;
          // update guest cart :
          const userId = state.cart[index].userId;
          if (!userId) {
            sessionStorage.setItem("cart", JSON.stringify(state.cart));
          }
        }
      }
    },
    deleteItemLocal: (state, action) => {
      const itemId = action.payload;
      if (state.cart && state.cart.length > 0) {
        state.cart = state.cart.filter((item) => item.id !== itemId);
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (currentUser) {
          if (state.cart.length === 0) {
            localStorage.setItem("hasCart", false);
          }
        } else {
          if (!state.cart || state.cart.length === 0) {
            sessionStorage.removeItem("cart");
          } else {
            sessionStorage.setItem("cart", JSON.stringify(state.cart));
          }
        }
      }
    },
    // ========================================================
  },
  extraReducers: (builder) => {
    // get cart items :
    builder.addCase(GetUserCart.pending, (state) => {
      state.cart = null;
      state.loading = true;
      state.error = null;
      state.success = false;
      state.operation = GET_CART;
      state.ready = false;
    });

    builder.addCase(GetUserCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
      state.operation = GET_CART;
      state.ready = true;
    });

    builder.addCase(GetUserCart.rejected, (state, action) => {
      state.cart = null;
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.operation = GET_CART;
      state.ready = true;
    });

    // add item :
    builder.addCase(AddNewItem.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.operation = ADD_ITEM;
      state.ready = false;
    });

    builder.addCase(AddNewItem.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.operation = ADD_ITEM;
      state.ready = true;
    });

    builder.addCase(AddNewItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.operation = ADD_ITEM;
      state.ready = true;
    });

    // update item :
    builder.addCase(UpdateItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.operation = UPDATE_ITEM;
    });

    builder.addCase(UpdateItemQuantity.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.operation = UPDATE_ITEM;
    });

    builder.addCase(UpdateItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.operation = UPDATE_ITEM;
    });

    // delete item :
    builder.addCase(DeleteItem.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.operation = DELETE_ITEM;
      state.ready = false;
    });

    builder.addCase(DeleteItem.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.operation = DELETE_ITEM;
      state.ready = true;
    });

    builder.addCase(DeleteItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.operation = DELETE_ITEM;
      state.ready = true;
    });

    // delete Cart :
    builder.addCase(DeleteCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.operation = DELETE_CART;
      state.ready = false;
    });

    builder.addCase(DeleteCart.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.cart = null;
      state.operation = DELETE_CART;
      state.ready = true;
    });

    builder.addCase(DeleteCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.operation = DELETE_CART;
      state.ready = true;
    });
  },
});

export default cartSlice.reducer;
export const {
  markCartAsReady,
  clearCartStatus,
  clearCartState,
  AddNewItemLocal,
  updateItemQuantityLocal,
  deleteItemLocal,
  getGuestCart,
} = cartSlice.actions;
