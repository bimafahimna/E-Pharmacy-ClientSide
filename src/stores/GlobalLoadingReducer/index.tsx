import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { globalIsLoading: boolean; mustfetch: boolean } = {
  globalIsLoading: false,
  mustfetch: true,
};

const globalLoadingSlice = createSlice({
  name: "globalLoading",
  initialState: initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalIsLoading = action.payload;
    },

    setMustFetch: (state, action: PayloadAction<boolean>) => {
      state.mustfetch = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { setGlobalLoading, setMustFetch } = globalLoadingSlice.actions;

export default globalLoadingSlice.reducer;
