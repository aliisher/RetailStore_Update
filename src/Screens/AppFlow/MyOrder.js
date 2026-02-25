import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {mainContainer} from '../../Constants/StyleSheet';
import Header from '../../Components/Header';
import MyOrderComp from '../../Components/MyOrderComp';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {hp} from '../../Constants/Responsive';
import {useSelector} from 'react-redux';
import {request} from '../../Api_Services/ApiServices';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';

const MyOrder = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const title = route?.params?.title;
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state?.AUTH?.storeData);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isFocused) {
      title === 'My Orders' ? getMyOrders() : getSaveOrders();
    }
  }, [isFocused]);

  const getMyOrders = async () => {
    setLoading(true);

    try {
      const response = await request.get(
        `myOrders/${user?.store_manager_id}/${user?.store_id}`,
      );
      if (response?.data?.status) {
        setOrders(response?.data?.my_orders || []);
      }
    } catch (err) {
      console.log('Error@bss', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const getSaveOrders = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `saveOrders/${user?.store_manager_id}/${user?.store_id}`,
      );
      if (response?.data?.status == 'success') {
        setOrders(response?.data?.save_Orders || []);
      }
    } catch (err) {
      console.log('Error@binSave', JSON.stringify(err.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const pressItem = item => {
    navigation?.navigate('InvoicePrint', {item, title: title});
  };
  return (
    <SafeAreaView style={mainContainer}>
      <Header title={title} onPress={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading Orders...</Text>
        </View>
      ) : orders?.length > 0 ? (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(10)}}
          renderItem={({item}) => (
            <MyOrderComp
              pressItem={() => pressItem(item)}
              title={item?.vendor?.vendor_name}
              status={item?.status}
              orderId={item?.order_code}
              productQty={item?.total_quantity}
              date={item?.date}
              productPrice={item?.total_price}
              imgSource={item?.vendor?.image}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={{alignItems: 'center', marginTop: hp(5)}}>
          <Text style={{color: 'black'}}>No Data Found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
  },
});
