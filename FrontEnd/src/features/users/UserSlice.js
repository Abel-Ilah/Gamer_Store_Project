import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//requests:
export const ADD_NEW_USER = "ADD_NEW_USER";
export const GET_CURRENT_USER = "GET_CURRENT_USER";

export const AddNewUser = createAsyncThunk(
  "user/addUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5268/api/users/AddNewUser",
        newUser
      );
      return res.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue("Email is already in use");
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const GetCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5268/api/users/GetCurrentUser?email=${email}&password=${password}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  request: null,
  ready: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    clearUserStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.request = null;
      // keep state.user intact!
    },
    clearUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.request = null;
    },
  },
  extraReducers: (builder) => {
    //add new user  :
    builder.addCase(AddNewUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.user = null;
      state.request = null;
      state.ready = false;
    });

    builder.addCase(AddNewUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload;
      state.error = null;
      state.request = ADD_NEW_USER;
      state.ready = true;
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({ id: state.user.id, email: state.user.email })
      );
    });

    builder.addCase(AddNewUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.user = null;
      state.request = ADD_NEW_USER;
      state.ready = true;
    });

    // get current user :
    builder.addCase(GetCurrentUser.pending, (state, action) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.user = null;
      state.request = null;
      state.ready = false;
    });

    builder.addCase(GetCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload;
      state.error = null;
      state.request = GET_CURRENT_USER;
      state.ready = true;
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({ id: state.user.id, email: state.user.email })
      );
    });

    builder.addCase(GetCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.user = null;
      state.request = GET_CURRENT_USER;
      state.ready = true;
    });
  },
});

export default userSlice.reducer;
export const { clearUserState, clearUserStatus } = userSlice.actions;
