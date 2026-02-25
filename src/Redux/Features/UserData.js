import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  productId: null,
  placeOrderData: [], // Change to array
};

const userData = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
    setPlaceOrderData: (state, action) => {
      // Ensure placeOrderData is always an array
      if (!Array.isArray(state.placeOrderData)) {
        state.placeOrderData = [];
      }

      // Check if item already exists
      // console.log('@placeOrderData', state?.placeOrderData);
      // console.log('@placeOrderData', action.payload);
      // const itemExists = state.placeOrderData.some(
      //   item => item.vendor.id === action.payload.vendor.id,
      // );
      // if (!itemExists) {
      //   state.placeOrderData.push(action.payload);
      // }
    },
  },
});

export const {setProductId, setPlaceOrderData} = userData.actions;
export default userData.reducer;
