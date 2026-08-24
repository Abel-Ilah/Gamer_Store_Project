import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:5268/api/categories");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addCategory = createAsyncThunk(
  "category/add",
  async (category, thunkAPI) => {
    try {
      let categoryDto = new FormData();
      categoryDto.append("name", category.name);
      if (category.imageFile) {
        categoryDto.append("imageFile", category.imageFile);
      }
      categoryDto.append("isFeatured", category.isFeatured);

      const res = await axios.post(
        "http://localhost:5268/api/categories/add",
        categoryDto,
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const UpdateCategory = createAsyncThunk(
  "category/update",
  async (category, thunkAPI) => {
    try {
      let categoryDto = new FormData();
      categoryDto.append("id", category.id);
      categoryDto.append("name", category.name);
      if (category.imageFile !== null) {
        categoryDto.append("imageFile", category.imageFile);
      }
      categoryDto.append("isFeatured", category.isFeatured);
      const res = await axios.put(
        "http://localhost:5268/api/categories/update",
        categoryDto,
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (categoryId, thunkAPI) => {
    try {
      const res = await axios.delete(
        `http://localhost:5268/api/categories/delete?categoryId=${categoryId}`,
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

let initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,

  reducers: {
    deleteLocalCategory: (state, action) => {
      const { categoryId } = action.payload;
      console.log("category id is : ", categoryId);
      state.categories = state.categories.filter((c) => c.id !== categoryId);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.categories = null;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.categories = action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.categories = null;
    });
  },
});
export const { deleteLocalCategory } = categorySlice.actions;
export default categorySlice.reducer;
