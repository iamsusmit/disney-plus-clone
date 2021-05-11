import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist: Boolean,
};

const watchlistSlice = createSlice({
  name: "watch",
  initialState,
  reducers: {
    setWatchlist: (state) => {
      state.watchlist = true;
    },

    removeWatchlist: (state) => {
      state.watchlist = false;
    },
  },
});

export const { setWatchlist, removeWatchlist } = watchlistSlice.actions;

export const currentWatchlistStatus = (state) => state?.watch?.watchlist;

export default watchlistSlice.reducer;
