import {createSlice} from '@reduxjs/toolkit';
import Toast from 'react-native-simple-toast';

const initialState = {
  RECOMMENDED_CART: [],
  FAVORITE: [],
};

const RECOMMENDED_CARD_SLICE = createSlice({
  name: 'RECOMMENDED_CARD_SLICE',
  initialState: initialState,

  reducers: {
    ADD_TO_RECOMMENDED_CARD: (state, action) => {
      const newItem = action.payload;
      const recommendedCart = state.RECOMMENDED_CART;

      if (recommendedCart?.length > 0) {
        const sameVendor = recommendedCart.some(
          item => item.vendor_id == newItem.vendor_id,
        );

        if (sameVendor) {
          const productExists = recommendedCart.some(
            item => item.product_id == newItem.product_id,
          );
          if (productExists) {
            console.log('Product already exists in Recommended Cart');
          } else {
            recommendedCart.push(newItem);
          }
        } else {
          Toast.show(
            'Only same vendor products can be added at a time',
            Toast.SHORT,
          );
        }
      } else {
        recommendedCart.push(newItem);
      }
    },

    REMOVE_FROM_RECOMMENDED_CARD: (state, action) => {
      const index = state?.RECOMMENDED_CART?.findIndex(
        item => item.product_id == action.payload,
      );
      if (index != -1) {
        state?.RECOMMENDED_CART?.splice(index, 1);
      }
    },

    EMPTY_RECOMMENDED_CARD: state => {
      state.RECOMMENDED_CART = [];
    },

    INCREMENT_RECOMMENDED_QUANTITY: (state, action) => {
      state.RECOMMENDED_CART.forEach(item => {
        if (item.product_id == action.payload) {
          item.quantity += 1;
        }
      });
    },

    DECREMENT_RECOMMENDED_QUANTITY: (state, action) => {
      state.RECOMMENDED_CART.forEach(item => {
        if (item.product_id == action.payload) {
          if (item?.quantity < 2) {
            const index = state?.RECOMMENDED_CART?.findIndex(
              item => item.product_id == action.payload,
            );
            if (index != -1) {
              state?.RECOMMENDED_CART?.splice(index, 1);
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
  ADD_TO_RECOMMENDED_CARD,
  REMOVE_FROM_RECOMMENDED_CARD,
  INCREMENT_RECOMMENDED_QUANTITY,
  DECREMENT_RECOMMENDED_QUANTITY,
  EMPTY_RECOMMENDED_CARD,
} = RECOMMENDED_CARD_SLICE.actions;

export default RECOMMENDED_CARD_SLICE.reducer;
