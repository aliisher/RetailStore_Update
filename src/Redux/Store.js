import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AuthSlice from './Features/AuthSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import CardSlice from './Features/CardSlice';
import userData, {setProductId} from './Features/UserData';
import FavouriteSlice from './Features/FavouriteSlice';
import WishliSlice from './Features/WishliSlice';
import REMOVE_FROM_RECOMMENDED_CARD from './Features/RecommendedCardSlice';

const reducer = combineReducers({
  AUTH: AuthSlice,
  CARD: CardSlice,
  USER_DATA: userData,
  FAVOURITE: FavouriteSlice,
  WishliSlice: WishliSlice,
  RECOMMAND_CARD: REMOVE_FROM_RECOMMENDED_CARD,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: ['AUTH', 'CARD', 'USER_DATA', 'FAVOURITE', 'WishliSlice'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: middleware => middleware({serializableCheck: false}),
});

const persistor = persistStore(store);

export {store, persistor};
