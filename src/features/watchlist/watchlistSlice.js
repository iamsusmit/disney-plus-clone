import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist: 0,
};

const watchlistSlice = createSlice({
  name: "watch",
  initialState,
  reducers: {
    setWatchlist: (state) => {
      state.watchlist = state.watchlist + 1;
    },

    removeWatchlist: (state) => {
      state.watchlist = state.watchlist - 1;
    },
  },
});

export const { setWatchlist, removeWatchlist } = watchlistSlice.actions;

export const currentWatchlist = (state) => state?.watch?.watchlist;

export default watchlistSlice.reducer;
