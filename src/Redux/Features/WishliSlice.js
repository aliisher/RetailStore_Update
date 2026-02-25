import {createSlice} from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    count: 0,
  },
  reducers: {
    setWishlistCount: (state, action) => {
      state.count = action.payload;
    },
    incrementWishlistCount: state => {
      state.count += 1;
    },
    decrementWishlistCount: state => {
      state.count -= 1;
    },
  },
});

export const {
  setWishlistCount,
  incrementWishlistCount,
  decrementWishlistCount,
} = wishlistSlice.actions;

export const selectWishlistCount = state => state.wishlist.count;

export default wishlistSlice.reducer;
