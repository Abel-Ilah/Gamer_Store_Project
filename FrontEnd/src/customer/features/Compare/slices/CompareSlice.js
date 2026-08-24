import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//operations:
export const ADD_ITEM = "ADD_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
export const GET_COMPARELIST = "GET_COMPARE_LIST";
export const CLEAR_COMPARELIST = "CLEAR_WISHLIST";

export const getUserCompareList = createAsyncThunk(
  "compare/getItems",
  async (userId, thunkAPI) => {
    const storedComparelist =
      JSON.parse(sessionStorage.getItem("comparelist")) || [];

    if (storedComparelist && storedComparelist.length > 0) {
      const itemsToAddToComparelist = storedComparelist.map((item) => ({
        userId,
        productId: item.product.id,
      }));

      const action = await thunkAPI.dispatch(
        addColllectionOfComparelistItems(itemsToAddToComparelist),
      );
      if (action.meta.requestStatus === "fulfilled") {
        localStorage.setItem("hasComparelist", "true");
      }
      sessionStorage.removeItem("comparelist");
    }
    const userHasComparelist = localStorage.getItem("hasComparelist");

    if (userHasComparelist && userHasComparelist === "false") return [];

    try {
      const res = await axios.get(
        `http://localhost:5268/api/compare?userId=${userId}`,
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addNewComparelistItem = createAsyncThunk(
  "compare/addNewItem",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5268/api/compare", item);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addColllectionOfComparelistItems = createAsyncThunk(
  "compare/addRange",
  async (items, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5268/api/compare/AddRange",
        items,
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteComparelistItem = createAsyncThunk(
  "compare/deleteItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/compare?itemId=${itemId}`,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  compare: [],
  loading: false,
  success: false,
  error: null,
};

export const CompareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    clearCompareState: (state) => {
      state.compare = [];
      state.error = null;
      state.loading = false;
    },

    getGuestCompareList: (state) => {
      const storedCompareList = JSON.parse(
        sessionStorage.getItem("comparelist"),
      );
      state.compare = storedCompareList || [];
      state.error = null;
      state.loading = false;
      state.success = true;
      state.ready = true;
      state.operation = GET_COMPARELIST;
    },
    AddNewCompareListItemLocal: (state, action) => {
      const newItem = action.payload;
      if (
        !state.compare.some((item) => item.product.id === newItem.product.id)
      ) {
        state.compare =
          state.compare.length > 0 ? [newItem, ...state.compare] : [newItem];

        if (!newItem.userId) {
          sessionStorage.setItem("comparelist", JSON.stringify(state.compare));
        }
        console.log("compare : ", state.compare);
      }
    },
    deleteComparelistItemLocal: (state, action) => {
      const itemId = action.payload;
      if (state.compare && state.compare.length > 0) {
        state.compare = state.compare.filter((item) => item.id !== itemId);
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (currentUser) {
          if (state.compare.length === 0) {
            localStorage.setItem("hasComparelist", false);
          }
        } else {
          if (!state.compare || state.compare.length === 0) {
            sessionStorage.removeItem("comparelist");
          } else {
            sessionStorage.setItem(
              "comparelist",
              JSON.stringify(state.compare),
            );
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // get wishlist items :
    builder.addCase(getUserCompareList.pending, (state) => {
      state.compare = [];
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getUserCompareList.fulfilled, (state, action) => {
      state.compare = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getUserCompareList.rejected, (state, action) => {
      state.compare = [];
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default CompareSlice.reducer;
export const {
  clearCompareState,
  AddNewCompareListItemLocal,
  deleteComparelistItemLocal,
  getGuestCompareList,
} = CompareSlice.actions;
