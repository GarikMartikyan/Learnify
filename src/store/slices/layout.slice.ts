import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store.ts";

interface LayoutState {
  isSidebarCollapsed: boolean;
}

const initialState: LayoutState = {
  isSidebarCollapsed: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebarCollapsed: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
  },
});

export const { toggleSidebarCollapsed } = layoutSlice.actions;
export const layoutReducer = layoutSlice.reducer;

export const selectIsSidebarCollapsed = (state: RootState) =>
  state.layout.isSidebarCollapsed;
