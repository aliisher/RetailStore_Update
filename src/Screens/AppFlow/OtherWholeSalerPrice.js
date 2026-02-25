import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {mainContainer} from '../../Constants/StyleSheet';
import WishlistComp from '../../Components/WishlistComp';
import Header from '../../Components/Header';
import {useIsFocused} from '@react-navigation/native';
import {request} from '../../Api_Services/ApiServices';
import {useSelector, useDispatch} from 'react-redux';
import TextInputComp from '../../Components/TextInputComp';
import {searchImg} from '../../Assets/Index';
import {
  ADD_TO_CARD,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
} from '../../Redux/Features/CardSlice';
import {
  decrementWishlistCount,
  incrementWishlistCount,
} from '../../Redux/Features/WishliSlice';

const OtherWholeSalerPrice = ({route, navigation}) => {
  const storeGet = useSelector(state => state.AUTH?.storeData);
  const user = useSelector(state => state?.AUTH);
  const getCardData = useSelector(state => state?.CARD?.CART);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();
  const routeData = route?.params;
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    textError: '',
  });
  const [userData, setUserData] = useState({
    text: '',
  });

  useEffect(() => {
    if (isFocused) {
      getVendorsData();
    }
  }, [isFocused]);

  const getVendorsData = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `getVendorsForProduct/${routeData?.product_Id}/${storeGet?.store_manager_id}/${storeGet?.store_id}/${routeData?.routeIdData?.vender_Id}`,
      );
      setVendorData(response?.data?.productsVendor);
    } catch (err) {
      console.log('Error@', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const getQuantity = (productId, vendorId) => {
    const matchedItem = getCardData.find(
      item => item?.product_id == productId && item?.vendor_id == vendorId,
    );
    return matchedItem ? matchedItem.quantity : 0;
  };

  const increaseQuantity = item => {
    const product_Detail = {
      product_id: item?.product?.id,
      product_name: item?.product?.product_name,
      image: item?.product?.product_images[0],
      price: item?.price,
      quantity: 0,
      store_id: item?.product?.store_id,
      store_manager_id: item?.product?.store_manager_id,
      vendor_id: item?.vendor_id,
      vendor_name: item?.vendor_name,
      invoice_number: null,
      date: null,
      store_name: user?.storeData?.storeName,
      store_manager_name:
        user?.userData?.user?.first_name +
        ' ' +
        user?.userData?.user?.last_name,
      discount: item?.general_discount,
    };
    dispatch(ADD_TO_CARD(product_Detail));

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
    if (getCardData?.length > 0) {
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

  const filterChat = userData?.text
    ? vendorData.filter(item =>
        item?.vendor_name?.toLowerCase().includes(userData?.text.toLowerCase()),
      )
    : vendorData;

  const favoriteFunction = item => {
    const formData = new FormData();
    formData.append('store_manager_id', item?.product?.store_manager_id);
    formData.append('store_id', item?.product?.store_id);
    formData.append('vendor_id', item?.vendor_id);
    formData.append('product_id', item?.product?.id);
    request
      .post('addToWishlist', formData)
      .then(response => {
        if (response?.status === 200) {
          if (response?.data?.message === 'Added to wishlist successfully.') {
            dispatch(incrementWishlistCount());
            getVendorsData();
          }
          if (response?.data?.message === 'Removed from wishlist.') {
            dispatch(decrementWishlistCount());
            getVendorsData();
          }
        }
      })
      .catch(e => console.log('@ERROR', e));
  };
  return (
    <SafeAreaView style={mainContainer}>
      <Header
        title="Other WholeSalers Prices"
        addToCart={true}
        onCartPress={() => navigation.navigate('Cart')}
        cardLength={getCardData?.length}
      />
      <TextInputComp
        inputCotainer={styles.textInput}
        imgSource={searchImg}
        iconName={'search'}
        placeholder={'Search here'}
        value={userData.text}
        keyboardType={'text'}
        errorMessage={errorMessage?.textError}
        onChangeText={text => {
          setErrorMessage(prevState => ({
            ...prevState,
            textError: null,
          }));
          setUserData(prevState => ({...prevState, text: text}));
        }}
      />
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading Products...</Text>
          </View>
        ) : filterChat?.length > 0 ? (
          <FlatList
            data={filterChat}
            numColumns={2}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <WishlistComp
                  imgSource={item?.product?.product_images[0]}
                  title={item?.product?.product_name}
                  text={item?.price}
                  name={item?.vendor_name}
                  isFavorite={item?.is_in_wishlist}
                  quantity={getQuantity(item?.product?.id, item?.vendor_id)}
                  onIncrease={() => increaseQuantity(item)}
                  onDecrease={() => decreaseQuantity(item)}
                  favoriteFunction={() => favoriteFunction(item)}
                />
              </View>
            )}
          />
        ) : (
          <Text style={{color: 'black'}}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OtherWholeSalerPrice;

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
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
  },
});
