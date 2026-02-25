import {createSlice} from '@reduxjs/toolkit';

const initalState = {
  userData: null,
  storeData: null,
};

const AUTH_SLICE = createSlice({
  name: 'AUTH_SLICE',
  initialState: initalState,

  reducers: {
    SAVE_USER_DATA: (state, action) => {
      state.userData = action.payload;
    },
    STORE_DATA: (state, action) => {
      state.storeData = action.payload;
    },
    DELETE_USER_DATA: state => {
      state.userData = null;
    },
  },
});

export const {SAVE_USER_DATA, DELETE_USER_DATA, STORE_DATA} =
  AUTH_SLICE.actions;

export default AUTH_SLICE.reducer;
