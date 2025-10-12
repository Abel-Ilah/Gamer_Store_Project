import { createSlice } from "@reduxjs/toolkit";

const HeaderPositionSlice = createSlice({
  name: "headerPosition",
  initialState: { cssPosition: "relative" },
  reducers: {
    setPosition: (state, action) => {
      state.cssPosition = action.payload;
    },
  },
});

export const { setPosition } = HeaderPositionSlice.actions;
export default HeaderPositionSlice.reducer;
