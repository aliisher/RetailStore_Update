import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedItems: [],
};

const FAVOURITE_SLICE = createSlice({
  name: 'FAVOURITE',
  initialState: initialState,

  reducers: {
    // Action to add a product to the favorite list
    SELECT_ITEM: (state, action) => {
      // Check if the item is not already in the list before adding it
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    // Action to remove a product from the favorite list
    UNSELECT_ITEM: (state, action) => {
      state.selectedItems = state.selectedItems.filter(
        id => id !== action.payload,
      );
    },
  },
});

export const {SELECT_ITEM, UNSELECT_ITEM} = FAVOURITE_SLICE.actions;

export default FAVOURITE_SLICE.reducer;
