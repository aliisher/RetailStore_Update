import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {heartFill, heartImg} from '../../Assets/Index';
import {
  hp,
  isMobileScreen,
  windowHeight,
  windowWidth,
  wp,
} from '../../Constants/Responsive';
import Header from '../../Components/Header';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import WishlistComp from '../../Components/WishlistComp';
import Footer from './FooterProductDetail';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {request} from '../../Api_Services/ApiServices';
import {useDispatch, useSelector} from 'react-redux';
import {Config} from '../../Api_Services/Config';
import {
  ADD_TO_CARD,
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
} from '../../Redux/Features/CardSlice';
import {
  decrementWishlistCount,
  incrementWishlistCount,
} from '../../Redux/Features/WishliSlice';

const constructUrl = ({
  vendorId,
  departmentId,
  productId,
  storeManagerId,
  storeId,
}) =>
  `getProducts/${vendorId}/${departmentId}/${productId}/${storeManagerId}/${storeId}`;

const ProductDetail = ({route}) => {
  const routeData = route?.params;
  const user = useSelector(state => state?.AUTH);
  const getCardData = useSelector(state => state?.CARD?.CART);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const storeGet = useSelector(state => state.AUTH?.storeData);
  const {width: viewportWidth} = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productNamePrice, setProductNamePrice] = useState('');
  const [productImage, setProductImages] = useState('');
  const [vendorData, setVendorData] = useState('');
  const [productDetail, setProductDetail] = useState(null);
  const carouselRef = useRef(null);
  useEffect(() => {
    if (isFocused) {
      getDepartmentData();
      getVendorsData();
    }
  }, [isFocused]);
  const getDepartmentData = async () => {
    setLoading(true);
    try {
      const url = constructUrl({
        vendorId: routeData?.routeIdData?.vender_Id,
        departmentId: routeData?.routeIdData?.department_ID,
        productId: routeData?.product_Id,
        storeManagerId: storeGet?.store_manager_id,
        storeId: storeGet?.store_id,
      });
      const response = await request.get(url);
      const productImages = response?.data?.vendorproducts?.flatMap(product => {
        setProductDetail(product);
        setProductNamePrice({
          name: product?.product?.product_name,
          price: product?.product_price,
          productId: product?.product_id,
        });
        return product?.product?.product_image || [];
      });

      setProductImages(productImages);
    } catch (err) {
      console.log('Error@', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const getVendorsData = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `getVendorsForProduct/${routeData?.product_Id}/${storeGet?.store_manager_id}/${storeGet?.store_id}/${routeData?.routeIdData?.vender_Id}`,
      );
      setVendorData(response?.data?.productsVendor || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{uri: Config?.domain + item?.product_image}}
          style={styles.imgStyle}
          resizeMode="contain"
        />
      </View>
    );
  };

  const increaseQuantity = () => {
    const product_Detail = {
      product_id: productDetail?.product_id,
      product_name: productDetail?.product?.product_name,
      image: productDetail?.product?.product_image[0]?.product_image,
      price: productDetail?.product_price,
      quantity: 0,
      store_id: productDetail?.product?.store_id,
      store_manager_id: productDetail?.product?.store_manager_id,
      vendor_id: productDetail?.vendor?.id,
      vendor_name: productDetail?.vendor?.vendor_name,
      invoice_number: null,
      date: null,
      store_name: user?.storeData?.storeName,
      store_manager_name:
        user?.userData?.user?.first_name +
        ' ' +
        user?.userData?.user?.last_name,
      discount: productDetail?.vendor?.general_discount,
    };
    dispatch(ADD_TO_CARD(product_Detail));

    if (getCardData?.length > 0) {
      const matchedItem = getCardData.find(
        data =>
          data?.product_id == productDetail?.product_id &&
          data?.vendor_id == productDetail?.vendor?.id,
      );
      if (matchedItem) {
        dispatch(INCREMENT_QUANTITY(productDetail?.product_id));
      }
    } else {
      dispatch(INCREMENT_QUANTITY(productDetail?.product_id));
    }
  };
  const decreaseQuantity = () => {
    if (getCardData?.length > 0) {
      const matchedItem = getCardData.find(
        item =>
          item?.product_id == productDetail?.product_id &&
          item?.vendor_id == productDetail?.vendor?.id,
      );

      if (matchedItem) {
        dispatch(DECREMENT_QUANTITY(productDetail?.product_id));
      }
    } else {
      dispatch(DECREMENT_QUANTITY(productDetail?.product_id));
    }
  };

  const increase = item => {
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
      discount: item?.vendor?.general_discount,
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
      }
    } else {
      dispatch(INCREMENT_QUANTITY(item?.product?.id));
    }
  };

  const decresae = item => {
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

  const getQuantity = (productId, vendorId) => {
    const matchedItem = getCardData.find(
      item => item?.product_id == productId && item?.vendor_id == vendorId,
    );
    return matchedItem ? matchedItem.quantity : 0;
  };

  const quantity = (productId, vendorId) => {
    const matchedItem = getCardData.find(
      item => item?.product_id == productId && item?.vendor_id == vendorId,
    );
    return matchedItem ? matchedItem.quantity : 0;
  };

  const addCart = () => {
    navigation.navigate('Cart', {
      routeProductData: routeData,
    });
  };

  const favoriteFunction = item => {
    const formData = new FormData();
    formData.append(
      'store_manager_id',
      productDetail?.product?.store_manager_id,
    );
    formData.append('store_id', productDetail?.product?.store_id);
    formData.append('vendor_id', productDetail?.vendor_id);
    formData.append('product_id', productDetail?.product?.id);
    request
      .post('addToWishlist', formData)
      .then(response => {
        if (response?.status == 200) {
          if (response?.data?.message === 'Added to wishlist successfully.') {
            dispatch(incrementWishlistCount());
            getDepartmentData();
          }
          if (response?.data?.message === 'Removed from wishlist.') {
            dispatch(decrementWishlistCount());
            getDepartmentData();
          }
        }
      })
      .catch(e => console.log('@ERROR', e?.response));
  };
  const wishListFunction = item => {
    const formData = new FormData();
    formData.append('store_manager_id', item?.product?.store_manager_id);
    formData.append('store_id', item?.product?.store_id);
    formData.append('vendor_id', item?.vendor_id);
    formData.append('product_id', item?.product?.id);
    request
      .post('addToWishlist', formData)
      .then(response => {
        if (response?.status == 200) {
          if (response?.data?.message === 'Added to wishlist successfully.') {
            dispatch(incrementWishlistCount());
            getVendorsData();
          }
          if (response?.data?.message === 'Removed from wishlist.') {
            dispatch(decrementWishlistCount());
            getVendorsData();
          }
        } else {
          console.log('Check else');
        }
      })
      .catch(e => console.log('@ERROR', e?.response));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        <Header
          title="Product detail"
          heartImage={
            productDetail?.is_in_wishlist == true ? heartFill : heartImg
          }
          heartImgPress={() => favoriteFunction()}
          mainContainer={{position: 'absolute', zIndex: 1}}
        />

        <View
          style={{
            height: isMobileScreen ? windowHeight * 0.3 : windowHeight * 0.38,
            backgroundColor: Colors.lightSilver,
          }}>
          <Carousel
            ref={carouselRef}
            data={productImage}
            renderItem={renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            layout={'default'}
            loop={true}
            onSnapToItem={index => setActiveIndex(index)}
          />
          <Pagination
            dotsLength={productImage?.length}
            activeDotIndex={activeIndex}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotOpacity={0.4}
            inactiveDotStyle={[
              styles.paginationDot,
              {backgroundColor: Colors.white},
            ]}
            inactiveDotScale={0.6}
          />
        </View>
        <View>
          <View style={styles.whiteContainer}>
            <View style={styles.smokePriceView}>
              <Text style={styles.productTitle}>{productNamePrice?.name}</Text>
              <Text style={styles.productPrice}>
                ${productNamePrice?.price}
              </Text>
            </View>
            <View style={styles.flatListView}>
              <View style={styles.smokePriceView2}>
                <Text style={styles.otherWhole}>Other Wholesalers Prices</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtherWholeSalerPrice', routeData)
                  }>
                  <Text style={styles.ViewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <View style={styles.loadingView}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>Loading Products...</Text>
                </View>
              ) : vendorData.length > 0 ? (
                <FlatList
                  data={vendorData}
                  numColumns={2}
                  contentContainerStyle={styles.flatlistStyle}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <View style={styles.wishListContainer}>
                      <WishlistComp
                        imgSource={item?.product?.product_images[0]}
                        title={item?.product_name}
                        text={item?.price}
                        name={item?.vendor_name}
                        isFavorite={item?.is_in_wishlist}
                        quantity={quantity(item?.product?.id, item?.vendor_id)}
                        onIncrease={() => increase(item)}
                        onDecrease={() => decresae(item)}
                        favoriteFunction={() => wishListFunction(item)}
                      />
                    </View>
                  )}
                />
              ) : (
                <Text style={{color: 'black'}}>No data found</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer
        quantity={getQuantity(
          routeData?.product_Id,
          routeData?.routeIdData?.vender_Id,
        )}
        onIncrease={() => increaseQuantity()}
        onDecrease={() => decreaseQuantity()}
        cardPress={addCart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightSilver,
    alignItems: 'center',
  },
  contentContainerStyle: {
    backgroundColor: Colors.lightSilver,
    alignItems: 'center',
  },
  itemContainer: {
    marginTop: isMobileScreen ? hp('10%') : hp('20%'),
  },
  imgStyle: {
    width: isMobileScreen ? hp(15) : hp(20),
    height: isMobileScreen ? hp(15) : hp(20),
    alignSelf: 'center',
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 11,
    height: 11,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  whiteContainer: {
    backgroundColor: Colors.white,
    padding: hp(2),
    borderTopRightRadius: hp('3%'),
    borderTopLeftRadius: hp('3%'),
    width: windowWidth,
    flex: 1,
    alignSelf: 'center',
  },
  smokePriceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('0.3%'),
    marginHorizontal: !isMobileScreen ? wp('4.6%') : wp('1%'),
  },
  productTitle: {
    fontSize: isMobileScreen ? hp(2.5) : hp(3.2),
    fontFamily: Fonts.bold,
    color: Colors.black,
    width: windowWidth * 0.5,
  },
  productPrice: {
    fontSize: isMobileScreen ? hp(2.5) : hp(3.2),
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  smokePriceView2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    marginHorizontal: !isMobileScreen ? wp('4.6%') : wp('1.2%'),
  },
  otherWhole: {
    fontSize: isMobileScreen ? hp(1.5) : hp(2.2),
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    width: windowWidth * 0.5,
  },
  ViewAll: {
    fontSize: isMobileScreen ? hp(1.5) : hp(2.2),
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
  flatListView: {
    flex: 1,
    marginTop: hp('3%'),
    marginBottom: windowHeight * 0.2,
  },
  wishListContainer: {
    padding: wp(1.5),
  },
  flatlistStyle: {
    paddingHorizontal: !isMobileScreen ? wp('3%') : null,
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default ProductDetail;
