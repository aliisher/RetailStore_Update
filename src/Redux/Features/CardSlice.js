import {createSlice} from '@reduxjs/toolkit';
import Toast from 'react-native-simple-toast';

const initialState = {
  CART: [],
  FAVORITE: [],
};

const CARD_SLICE = createSlice({
  name: 'CARD_SLICE',
  initialState: initialState,

  reducers: {
    ADD_TO_CARD: (state, action) => {
      const newItem = action.payload;
      const cart = state.CART;

      if (cart?.length > 0) {
        const sameVendor = cart.some(
          item => item.vendor_id == newItem.vendor_id,
        );

        if (sameVendor) {
          const productExists = cart.some(
            item => item.product_id == newItem.product_id,
          );
          if (productExists) {
            console.log('Product already exists');
          } else {
            cart.push(newItem);
          }
        } else {
          Toast.show(
            'Only same vendor products can be added at a time',
            Toast.SHORT,
          );
        }
      } else {
        cart.push(newItem);
      }
    },

    REMOVE_FROM_CARD: (state, action) => {
      const index = state?.CART?.findIndex(
        item => item.product_id == action.payload,
      );
      if (index != -1) {
        state?.CART?.splice(index, 1);
      }
    },
    EMPTY_CARD: state => {
      state.CART = [];
    },

    INCREMENT_QUANTITY: (state, action) => {
      state.CART.forEach(item => {
        if (item.product_id == action.payload) {
          item.quantity += 1;
        }
      });
    },

    DECREMENT_QUANTITY: (state, action) => {
      state.CART.forEach(item => {
        if (item.product_id == action.payload) {
          if (item?.quantity < 2) {
            const index = state?.CART?.findIndex(
              item => item.product_id == action.payload,
            );
            if (index != -1) {
              state?.CART?.splice(index, 1);
            }
          }
          if (item.quantity > 0) {
            item.quantity -= 1;
          }
        }
      });
    },
  },
});

export const {
  ADD_TO_CARD,
  REMOVE_FROM_CARD,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
  EMPTY_CARD,
} = CARD_SLICE.actions;

export default CARD_SLICE.reducer;
