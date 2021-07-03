import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist: Boolean,
  toggle: 0,
  backButtonValue: 0,
  watchlistValue: 0,
  toggleMode: Boolean,
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

    setBackButtonValue: (state, action) => {
      state.toggle = action.payload.backButtonValue;
    },

    setWatchlistValue: (state, action) => {
      state.watchlistValue = action.payload.watchlistValue;
    },

    settoggleMode: (state, action) => {
      state.toggleMode = action.payload.toggleMode;
    },
  },
});

export const {
  setWatchlist,
  removeWatchlist,
  setToggleValue,
  setBackButtonValue,
  setWatchlistValue,
  settoggleMode,
} = watchlistSlice.actions;

export const currentWatchlistStatus = (state) => state?.watch?.watchlist;
export const tValue = (state) => state?.watch?.toggle;
export const currentBackButtonValue = (state) => state?.watch?.backButtonValue;
export const currentWatchlistValue = (state) => state?.watch?.watchlistValue;
export const currentModeValue = (state) => state?.watch?.toggleMode;

export default watchlistSlice.reducer;
