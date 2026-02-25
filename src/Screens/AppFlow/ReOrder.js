import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {FlatList} from 'react-native';
import {mainContainer} from '../../Constants/StyleSheet';
import Header from '../../Components/Header';
import ReorderComp from '../../Components/ReorderComp';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {request} from '../../Api_Services/ApiServices';
import {ADD_TO_CARD} from '../../Redux/Features/CardSlice';

const ReOrder = ({}) => {
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state?.AUTH?.storeData);
  const [reOrders, setReOrders] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getReOrder();
    }
  }, [isFocused]);

  const getReOrder = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `reOrders/${user?.store_manager_id}/${user?.store_id}`,
      );
      if (response?.data?.status == 'success') {
        setReOrders(response?.data?.data?.products);
      }
    } catch (err) {
      console.log('Error@bss', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation = item => {
    const product_Detail = {
      product_id: item?.product_id,
      product_name: item?.product_name,
      image: item?.product_images,
      price: item?.product_price,
      quantity: 0,
      store_id: item?.store_id,
      store_manager_id: item?.store_manager_id,
      vendor_id: item?.vendor_id,
      vendor_name: item?.vendor_name,
      invoice_number: null,
      date: null,
      store_name: item?.store_name,
      store_manager_name: item?.store_manager_name,
      discount: item?.general_discount,
    };
    dispatch(ADD_TO_CARD(product_Detail));
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={mainContainer}>
      <Header title="Reorder" />
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading Vendors...</Text>
          </View>
        ) : reOrders.length > 0 ? (
          <FlatList
            data={reOrders}
            numColumns={2}
            contentContainerStyle={{paddingBottom: hp(10)}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <ReorderComp
                  reOrderItemPress={() => handleNavigation(item)}
                  imgSource={item?.product_images}
                  title={item?.product_name}
                  text={item?.product_price}
                  noOfOrders={item?.count}
                  byText={item?.vendor_name}
                />
              </View>
            )}
          />
        ) : (
          <Text style={{color: Colors.black}}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReOrder;

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: wp(2),
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
    textAlign: 'center',
  },
});
