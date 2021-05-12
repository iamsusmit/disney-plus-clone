import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist: Boolean,
  toggle: 0,
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

    setToggleValue: (state, action) => {
      state.toggle = action.payload.toggle;
    },
  },
});

export const { setWatchlist, removeWatchlist, setToggleValue, toggleValue } =
  watchlistSlice.actions;

export const currentWatchlistStatus = (state) => state?.watch?.watchlist;
export const tValue = (state) => state?.watch?.toggle;

export default watchlistSlice.reducer;
