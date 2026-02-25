import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {FlatList} from 'react-native';
import {mainContainer} from '../../Constants/StyleSheet';
import WishlistComp from '../../Components/WishlistComp';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {request} from '../../Api_Services/ApiServices';
import {
  ADD_TO_CARD,
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
} from '../../Redux/Features/CardSlice';
import {
  decrementWishlistCount,
  setWishlistCount,
} from '../../Redux/Features/WishliSlice';
import {
  ADD_TO_RECOMMENDED_CARD,
  DECREMENT_RECOMMENDED_QUANTITY,
  INCREMENT_RECOMMENDED_QUANTITY,
} from '../../Redux/Features/RecommendedCardSlice';

const Wishlist = ({route}) => {
  const recommended = route?.params?.recommend;
  const getCardData = useSelector(state => state?.CARD?.CART);
  const user = useSelector(state => state?.AUTH?.storeData);
  const userData = useSelector(state => state?.AUTH?.userData);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [getWishListData, setGetWishListData] = useState('');
  const RECOMMENDED_CARD = useSelector(
    state => state?.RECOMMAND_CARD?.RECOMMENDED_CART,
  );
  useEffect(() => {
    if (isFocused) {
      getAllWishlistData();
    }
  }, [isFocused]);
  const getAllWishlistData = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `getWishlist/${user?.store_manager_id}/${user?.store_id}`,
      );
      if (response?.status === 200) {
        setGetWishListData(response?.data?.wishlist);
        dispatch(setWishlistCount(response?.data?.wishlist?.length));
      }
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const cardData = recommended ? RECOMMENDED_CARD : getCardData;

  const getQuantity = (productId, vendorId) => {
    const matchedItem = cardData?.find(
      item => item?.product_id == productId && item?.vendor_id == vendorId,
    );
    return matchedItem ? matchedItem.quantity : 0;
  };
  const increaseQuantity = item => {
    const product_Detail = {
      product_id: item?.product?.id,
      product_name: item?.product?.product_name,
      image: item?.product?.product_image[0]?.product_image,
      price: item?.product_price,
      quantity: 0,
      store_id: item?.product?.store_id,
      store_manager_id: item?.product?.store_manager_id,
      vendor_id: item?.vendor_id,
      vendor_name: item?.vendor?.vendor_name,
      invoice_number: null,
      date: null,
      store_name: user?.storeName,
      store_manager_name:
        userData?.user?.first_name + ' ' + userData?.user?.last_name,
      discount: item?.vendor?.general_discount,
    };
    if (recommended == true) {
      dispatch(ADD_TO_RECOMMENDED_CARD(product_Detail));
      dispatch(INCREMENT_RECOMMENDED_QUANTITY(item?.product?.id));
    } else {
      dispatch(ADD_TO_CARD(product_Detail));
    }
    if (getCardData?.length > 0) {
      const matchedItem = getCardData.find(
        data =>
          data?.product_id == item?.product?.id &&
          data?.vendor_id == item?.vendor_id,
      );
      if (matchedItem) {
        dispatch(INCREMENT_QUANTITY(item?.product?.id));
      } else {
        dispatch(INCREMENT_QUANTITY(item?.product?.id));
      }
    } else {
      dispatch(INCREMENT_QUANTITY(item?.product?.id));
    }
  };

  const decreaseQuantity = item => {
    if (recommended == true) {
      dispatch(DECREMENT_RECOMMENDED_QUANTITY(item?.product_id));
    } else if (getCardData?.length > 0) {
      const matchedItem = getCardData.find(
        data =>
          data?.product_id == item?.product?.id &&
          data?.vendor_id == item?.vendor_id,
      );
      if (matchedItem) {
        dispatch(DECREMENT_QUANTITY(item?.product?.id));
      }
    } else {
      dispatch(DECREMENT_QUANTITY(item?.product?.id));
    }
  };

  const favoriteFunction = item => {
    const formData = new FormData();
    formData.append('store_manager_id', item?.store_manager_id);
    formData.append('store_id', item?.store_id);
    formData.append('vendor_id', item?.vendor_id);
    formData.append('product_id', item?.product_id);
    request
      .post('addToWishlist', formData)
      .then(response => {
        if (response?.status == 200) {
          if (response?.data?.message === 'Added to wishlist successfully.') {
            getAllWishlistData();
          }
          if (response?.data?.message === 'Removed from wishlist.') {
            dispatch(decrementWishlistCount());
            getAllWishlistData();
          }
        }
      })
      .catch(e => console.log('@ERROR', e));
  };
  return (
    <SafeAreaView style={mainContainer}>
      <Text style={styles.wishlistText}>Wishlist</Text>
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text
              style={{
                marginTop: hp(2),
                fontFamily: Fonts.medium,
                fontSize: fontSize.S1,
                color: Colors.primary,
              }}>
              Loading Products...
            </Text>
          </View>
        ) : getWishListData?.length >= 0 ? (
          <FlatList
            data={getWishListData}
            numColumns={2}
            keyExtractor={item => item?.product_id?.toString()}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <WishlistComp
                  imgSource={item?.product?.product_image[0]?.product_image}
                  title={item.product?.product_name}
                  name={item?.vendor?.vendor_name}
                  text={item?.product_price}
                  isFavorite={item?.is_in_wishlist}
                  quantity={getQuantity(item?.product?.id, item?.vendor?.id)}
                  onIncrease={() => increaseQuantity(item)}
                  onDecrease={() => decreaseQuantity(item)}
                  favoriteFunction={() => favoriteFunction(item)}
                />
              </View>
            )}
          />
        ) : (
          <Text style={{color: Colors?.black}}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  wishlistText: {
    marginTop: hp(3),
    color: Colors.raisinBlack,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.Normal1,
  },
  flatListView: {
    flex: 1,
    marginTop: hp(2),
  },
  itemContainer: {
    padding: wp(2),
  },
});
