import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Components/Header';
import {mainContainer} from '../../Constants/StyleSheet';
import TextInputComp from '../../Components/TextInputComp';
import {searchImg} from '../../Assets/Index';
import {hp, isMobileScreen} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import ProductComp from '../../Components/ProductComp';
import {request} from '../../Api_Services/ApiServices';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {
  ADD_TO_CARD,
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
} from '../../Redux/Features/CardSlice';
import {
  decrementWishlistCount,
  incrementWishlistCount,
} from '../../Redux/Features/WishliSlice';

const HomeSearchResult = ({navigation}) => {
  const dispatch = useDispatch();
  const getCardData = useSelector(state => state?.CARD?.CART);
  const storeGet = useSelector(state => state?.AUTH?.storeData);
  const user = useSelector(state => state?.AUTH?.userData?.user);

  const [errorMessage, setErrorMessage] = useState({
    productError: '',
  });
  const [userData, setUserData] = useState({
    product: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSearchData = async query => {
    setLoading(true);
    try {
      const response = await request.get(`search?search=${query}`);
      if (response?.data?.status == 'success') {
        setProducts(response?.data?.results || []);
      }
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const favoriteFunction = item => {
    const formData = new FormData();
    formData.append('store_manager_id', item?.product?.store_manager_id);
    formData.append('store_id', item?.product?.store_id);
    formData.append('vendor_id', item?.vendor_id);
    formData.append('product_id', item?.product_id);
    request
      .post('addToWishlist', formData)
      .then(response => {
        if (response?.status == 200) {
          if (response?.data?.message === 'Added to wishlist successfully.') {
            dispatch(incrementWishlistCount());
            getSearchData(userData?.product);
          }
          if (response?.data?.message === 'Removed from wishlist.') {
            dispatch(decrementWishlistCount());
            getSearchData(userData?.product);
          }
        }
      })
      .catch(e => console.log('@ERROR', e));
  };
  const getQuantity = (productId, vendorId) => {
    const matchedItem = getCardData?.find(
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
      vendor_name: item?.vendor_name,
      invoice_number: null,
      date: null,
      store_name: storeGet?.storeName,
      store_manager_name: user?.first_name + ' ' + user?.last_name,
    };
    dispatch(ADD_TO_CARD(product_Detail));

    if (getCardData?.length > 0) {
      const matchedItem = getCardData?.find(
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
      const matchedItem = getCardData?.find(
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
  const handleNavigation = item => {
    navigation.navigate('ProductDetail', {
      routeIdData: {
        department_ID: item?.department_id,
        vender_Id: item?.vendor_id,
      },
      product_Id: item?.product_id,
      quantity: getQuantity(item?.product_id),
    });
  };
  return (
    <SafeAreaView style={mainContainer}>
      <Header
        title="Search Product"
        titleStyle={styles.titleStyle}
        addToCart={true}
        onCartPress={() => navigation.navigate('Cart')}
        cardLength={getCardData?.length}
      />
      <TextInputComp
        inputCotainer={styles.textInput}
        imgSource={searchImg}
        iconName={'search'}
        placeholder={'Search Product'}
        value={userData.product}
        keyboardType={''}
        errorMessage={errorMessage?.productError}
        onChangeText={text => {
          setErrorMessage(prevState => ({
            ...prevState,
            productError: null,
          }));
          setUserData(prevState => ({...prevState, product: text}));
          getSearchData(text);
        }}
      />
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading Products...</Text>
          </View>
        ) : products?.length > 0 ? (
          <FlatList
            data={products}
            numColumns={2}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <ProductComp
                productClick={() => handleNavigation(item)}
                imgSource={item?.product?.product_image}
                title={item?.product?.product_name}
                text={item?.product_price}
                vendorName={item?.vendor_name}
                favorite={() => favoriteFunction(item)}
                quantity={getQuantity(item?.product?.id, item?.vendor_id)}
                onIncrease={() => increaseQuantity(item)}
                onDecrease={() => decreaseQuantity(item)}
                isFavorite={item?.is_in_wishlist}
                hotSelling={item?.hot_selling}
              />
            )}
          />
        ) : (
          <Text style={{color: Colors?.black}}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeSearchResult;

const styles = StyleSheet.create({
  textInput: {
    height: isMobileScreen ? hp('7%') : hp('14%'),
    bottom: hp(3),
  },
  titleStyle: {
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.Normal1,
  },
  flatListView: {
    flex: 1,
  },
  flatlistStyle: {
    paddingBottom: hp(5),
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
  },
});
