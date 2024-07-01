"use client";
// app/store/appSlice.ts
import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { AppSlice } from "@/types/reduxSlices";

const initialState: AppSlice = {
  current_page: "home",
  current_swarm: null,
  current_chat: null,
  chats: [],
  swarms: [],
};

const resetAppState = createAction('app/resetAppState', () => {
  return { payload: initialState };
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.current_page = action.payload;
    },
    setCurrentSwarm: (state, action: PayloadAction<string | null>) => {
      state.current_swarm = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<string | null>) => {
      state.current_chat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, (state, action) => {
      return action.payload;
    });
  }
});

export const { setCurrentPage, setCurrentSwarm, setCurrentChat } = appSlice.actions;
export default appSlice.reducer;
export { resetAppState };
