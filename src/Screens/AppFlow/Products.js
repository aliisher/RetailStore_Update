import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import TextInputComp from '../../Components/TextInputComp';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from '../../Components/Header';
import { hp } from '../../Constants/Responsive';
import { mainContainer } from '../../Constants/StyleSheet';
import { searchImg } from '../../Assets/Index';
import ProductComp from '../../Components/ProductComp';
import { Fonts, fontSize } from '../../Constants/Fonts';
import { request } from '../../Api_Services/ApiServices';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../Constants/Colors';
import {
  ADD_TO_CARD,
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
} from '../../Redux/Features/CardSlice';
import {
  decrementWishlistCount,
  incrementWishlistCount,
} from '../../Redux/Features/WishliSlice';
import {
  ADD_TO_RECOMMENDED_CARD,
  DECREMENT_RECOMMENDED_QUANTITY,
  INCREMENT_RECOMMENDED_QUANTITY,
} from '../../Redux/Features/RecommendedCardSlice';
import Toast from 'react-native-simple-toast';

const Products = ({ route }) => {
  const getCardData = useSelector(state => state?.CARD?.CART);
  const user = useSelector(state => state?.AUTH);
  const routeData = route?.params;
  const storeGet = useSelector(state => state?.AUTH?.storeData);
  const RECOMMENDED_CARD = useSelector(
    state => state?.RECOMMAND_CARD?.RECOMMENDED_CART,
  );
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState({
    emailError: '',
  });
  const [userData, setUserData] = useState({
    searchQuery: '',
  });
  const [searchResults, setSearchResults] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // New state to track if more data is available

  const handleNavigation = id => {
    if (routeData?.recommend == true) {
      console.log('true');
    } else {
      navigation.navigate('ProductDetail', {
        routeIdData: routeData,
        product_Id: id,
        quantity: getQuantity(id),
        recommend: routeData?.recommend,
      });
    }
  };

  const getDepartmentData = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(false);
      setHasMoreData(false);
      setProducts([]); // Clear the products list for a fresh load
    }

    try {
      const response = await request.get(
        `products/${routeData?.vender_Id}/${routeData?.department_ID}/${storeGet?.store_manager_id}/${storeGet?.store_id}?page=${page}`,
      );
      console.log('@RESSPOCNE', response?.data);
      Toast.show(response?.data?.message, Toast.SHORT);

      const sortedProducts =
        response?.data?.vendorproducts?.sort((a, b) => {
          return (b.hot_selling ? 1 : 0) - (a.hot_selling ? 1 : 0);
        }) || [];
      // Stop further loading if no new products are fetched
      if (sortedProducts.length == 0) {
        setHasMoreData(false); // No more data available
      } else {
        if (loadMore) {
          setProducts(prevProducts => [
            ...prevProducts,
            ...sortedProducts.filter(
              newItem =>
                !prevProducts.some(
                  item => item.product.id === newItem.product.id,
                ),
            ),
          ]);
        } else {
          setProducts(sortedProducts);
        }
      }
    } catch (err) {
      Toast.show(err?.response?.message, Toast.SHORT);

      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
      if (loadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!loadingMore && !loading && hasMoreData) {
      // Only load more if hasMoreData is true
      setPage(prevPage => prevPage + 1);
      getDepartmentData(true);
    }
  };

  // Call getDepartmentData() without parameters in useEffect
  useEffect(() => {
    if (isFocused) {
      setPage(1); // Reset page for fresh load
      setHasMoreData(true); // Reset hasMoreData when reloading
      getDepartmentData();
    }
  }, [isFocused]);

  // const getDepartmentData = async (loadMore = false) => {
  //   if (loadMore) setLoadingMore(true);
  //   else setLoading(true);

  //   try {
  //     const response = await request.get(
  //       `products/${routeData?.vender_Id}/${routeData?.department_ID}/${storeGet?.store_manager_id}/${storeGet?.store_id}?page=${page}`,
  //     );

  //     const sortedProducts =
  //       response?.data?.vendorproducts?.sort((a, b) => {
  //         return (b.hot_selling ? 1 : 0) - (a.hot_selling ? 1 : 0);
  //       }) || [];

  //     if (loadMore) {
  //       setProducts(prevProducts => [...prevProducts, ...sortedProducts]);
  //     } else {
  //       setProducts(sortedProducts);
  //     }
  //   } catch (err) {
  //     console.log('Error@b', JSON.stringify(err.response, null, 2));
  //   } finally {
  //     if (loadMore) setLoadingMore(false);
  //     else setLoading(false);
  //   }
  // };

  // const loadMoreData = () => {
  //   if (!loadingMore && !loading) {
  //     setPage(prevPage => prevPage + 1);
  //     getDepartmentData(true);
  //   }
  // };

  // useEffect(() => {
  //   if (isFocused) {
  //     getDepartmentData();
  //   }
  // }, [isFocused]);
  const getSearchData = async query => {
    setUserData({ searchQuery: query });

    if (!query) {
      setSearchResults([]);
      getDepartmentData();
      return;
    }

    setLoading(true);

    try {
      const url = `productSearch?search=${query}&store_manager_id=${storeGet?.store_manager_id}&store_id=${storeGet?.store_id}&department_id=${routeData?.department_ID}&vendor_id=${routeData?.vender_Id}`;

      const response = await request.get(url);
      if (response?.data?.status === 'success') {
        setSearchResults(response?.data?.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.log(
        'Error fetching search data',
        JSON.stringify(err.message, null, 2),
      );
    } finally {
      setLoading(false);
    }
  };
  const productsToShow = userData.searchQuery ? searchResults : products;

  const cardData = routeData?.recommend ? RECOMMENDED_CARD : getCardData;

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
      vendor_name: item?.vendor_name,
      invoice_number: null,
      date: null,
      store_name: user?.storeData?.storeName,
      store_manager_name:
        user?.userData?.user?.first_name +
        ' ' +
        user?.userData?.user?.last_name,
      discount: item?.discount,
    };
    if (routeData?.recommend == true) {
      dispatch(ADD_TO_RECOMMENDED_CARD(product_Detail));
      dispatch(INCREMENT_RECOMMENDED_QUANTITY(item?.product?.id));
    } else {
      dispatch(ADD_TO_CARD(product_Detail));
    }

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
    if (routeData?.recommend == true) {
      dispatch(DECREMENT_RECOMMENDED_QUANTITY(item?.product_id));
    } else if (getCardData?.length > 0) {
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

            // Update searchResults if the search is active
            if (userData.searchQuery) {
              const updatedSearchResults = searchResults.map(product =>
                product.product.id === item.product.id
                  ? { ...product, is_in_wishlist: true }
                  : product,
              );
              setSearchResults(updatedSearchResults);
            } else {
              // Update department data if no search query
              getDepartmentData();
            }
          }

          if (response?.data?.message === 'Removed from wishlist.') {
            dispatch(decrementWishlistCount());

            // Update searchResults if the search is active
            if (userData.searchQuery) {
              const updatedSearchResults = searchResults.map(product =>
                product.product.id === item.product.id
                  ? { ...product, is_in_wishlist: false }
                  : product,
              );
              setSearchResults(updatedSearchResults);
            } else {
              // Update department data if no search query
              getDepartmentData();
            }
          }
        }
      })
      .catch(e => console.log('@ERROR', e));
  };

  return (
    <SafeAreaView style={mainContainer}>
      <Header
        title="Products"
        titleStyle={styles.titleStyle}
        addToCart={true}
        onCartPress={() => navigation.navigate('Cart')}
        cardLength={getCardData?.length}
      />
      <TextInputComp
        inputCotainer={styles.textInput}
        imgSource={searchImg}
        iconName={'search'}
        placeholder={'Search here'}
        value={userData.searchQuery}
        keyboardType={''}
        errorMessage={errorMessage?.degreeError}
        onChangeText={text => {
          getSearchData(text);
          setErrorMessage(prevState => ({
            ...prevState,
            degreeError: null,
          }));
          // setUserData(prevState => ({...prevState, searchQuery: text}));
        }}
      />
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading Products...</Text>
          </View>
        ) : productsToShow?.length > 0 ? (
          <FlatList
            data={productsToShow}
            numColumns={2}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductComp
                productClick={() => handleNavigation(item?.product?.id)}
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
            onEndReached={loadMoreData} // Load more data when the end is reached
            onEndReachedThreshold={0.5} /// Trigger when 50% of the remaining content is reached
            ListFooterComponent={
              // Ensure the loading spinner shows only when loading more for department data
              loadingMore && !userData.searchQuery ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : null
            }
          />
        ) : (
          <Text style={{ color: Colors?.black }}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
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
