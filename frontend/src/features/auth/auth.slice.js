import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    initialized: false,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
      state.initialized = true;
    }
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectInitialized = (state) => state.auth.initialized;