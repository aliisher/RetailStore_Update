import {SafeAreaView, StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {mainContainer} from '../../Constants/StyleSheet';
import Header from '../../Components/Header';
import CartComponent from '../../Components/CartComponent';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {
  isMobileScreen,
  windowHeight,
  windowWidth,
  wp,
} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import Btn from '../../Components/Btn';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
  REMOVE_FROM_CARD,
} from '../../Redux/Features/CardSlice';

export default function Cart({route}) {
  const dispatch = useDispatch();
  const getCardData = useSelector(state => state?.CARD?.CART);
  const navigation = useNavigation();
  const [price, setPrice] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let totalQuantity = 0;
    let totalPrice = 0;

    getCardData?.forEach(product => {
      const {quantity = 0, price = 0} = product;
      totalQuantity += quantity;
      totalPrice += quantity * price;
    });

    setTotalQuantity(totalQuantity);
    setPrice(totalPrice?.toFixed(2));
  }, [getCardData]);

  const deleteItem = id => {
    dispatch(REMOVE_FROM_CARD(id));
  };

  const getQuantity = (productId, vendorId) => {
    const matchedItem = getCardData.find(
      item => item?.product_id === productId && item?.vendor_id === vendorId,
    );
    return matchedItem ? matchedItem.quantity : 0;
  };

  const increaseQuantity = item => {
    if (getCardData?.length > 0) {
      const matchedItem = getCardData.find(
        data =>
          data?.product_id === item?.product_id &&
          data?.vendor_id === item?.vendor_id,
      );
      if (matchedItem) {
        dispatch(INCREMENT_QUANTITY(item?.product_id));
      }
    } else {
      dispatch(INCREMENT_QUANTITY(item?.product_id));
    }
  };

  // const decreaseQuantity = item => {
  //   const matchedItem = getCardData.find(
  //     item =>
  //       item?.product_id === item?.product_id &&
  //       item?.vendor_id === item?.vendor_id,
  //   );

  //   if (matchedItem) {
  //     dispatch(DECREMENT_QUANTITY(item?.product_id));
  //   }
  // };

  const decreaseQuantity = item => {
    if (getCardData?.length > 0) {
      const matchedItem = getCardData.find(
        data =>
          data?.product_id == item?.product_id &&
          data?.vendor_id == item?.vendor_id,
      );
      if (matchedItem) {
        dispatch(DECREMENT_QUANTITY(item?.product_id));
      }
    } else {
      dispatch(DECREMENT_QUANTITY(item?.product_id));
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      navigation.navigate('InVoice', {
        product_Price: price,
        product_Quantity: totalQuantity,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={mainContainer}>
      <FlatList
        data={getCardData}
        keyExtractor={item => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: windowHeight * 0.07,
          alignItems: 'center',
          width: windowWidth * 1,
        }}
        ListHeaderComponent={
          <Header title="Cart" titleStyle={styles.titleStyle} />
        }
        ListFooterComponent={
          <View style={styles.totalAmount}>
            <View style={styles.totalItems}>
              <Text style={styles.itemText}>Total Items</Text>
              {/* <Text style={styles.itemText}>{CartData.length}</Text> */}
              <Text style={styles.itemText}>{totalQuantity}</Text>
            </View>
            <View style={styles.buttons}>
              <View style={styles.total}>
                <Text style={styles.totalText}>Total Price</Text>
                <Text style={styles.totalText}>${price}</Text>
              </View>
              <View>
                <Btn
                  text={'Checkout'}
                  fontSize={16}
                  fontFamily={Fonts.semiBold}
                  onPress={handleCheckout}
                  loading={loading}
                />
              </View>
              <View style={{paddingTop: windowHeight * 0.03}}>
                <Btn
                  text={'Add More Items'}
                  fontSize={16}
                  textColor={Colors.primary}
                  backgroundColor={Colors.white}
                  fontFamily={Fonts.semiBold}
                  // navigation.navigate('Department', {vender_Id: venderId});

                  onPress={() =>
                    navigation.navigate('Department', {
                      vender_Id: getCardData[0]?.vendor_id,
                    })
                  }
                />
              </View>
              <View style={{paddingTop: windowHeight * 0.03}}>
                <Btn
                  text={'Add From Wishlist'}
                  fontSize={16}
                  textColor={Colors.primary}
                  backgroundColor={Colors.white}
                  fontFamily={Fonts.semiBold}
                  onPress={() => navigation.navigate('Wishlist')}
                />
              </View>
            </View>
          </View>
        }
        renderItem={({item}) => (
          <>
            <CartComponent
              cartTitle={item?.product_name}
              cartPrice={item?.price}
              cartImage={item?.image}
              cartQuantity={item?.quantity}
              deleteButton={() => deleteItem(item?.product_id)}
              quantity={getQuantity(item?.product_id, item?.vendor_id)}
              onIncrease={() => increaseQuantity(item)}
              onDecrease={() => decreaseQuantity(item)}
            />
          </>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.Normal1,
  },
  totalAmount: {
    width: windowWidth * 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGray,
  },
  totalItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.9,
    marginTop: windowHeight * 0.01,
    marginVertical: windowHeight * 0.1,
  },
  itemText: {
    color: Colors.black,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.M,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.9,
    borderTopWidth: windowWidth * 0.001,
    borderTopColor: Colors.lightSilver,
    paddingBottom: windowWidth * 0.04,
  },
  totalText: {
    paddingTop: isMobileScreen ? wp(2.5) : windowWidth * 0.01,
    color: Colors.chineseBlack,
    fontSize: fontSize.L,
    fontFamily: Fonts.semiBold,
  },
});
