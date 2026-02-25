import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import {
  wp,
  hp,
  windowHeight,
  windowWidth,
  isMobileScreen,
} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {fonts, Icon} from '@rneui/base';
import {Colors} from '../Constants/Colors';
import Header from './Header';
import Btn from './Btn';
import {mainContainer} from '../Constants/StyleSheet';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Config} from '../Api_Services/Config';
import {
  DECREMENT_RECOMMENDED_QUANTITY,
  INCREMENT_RECOMMENDED_QUANTITY,
  REMOVE_FROM_RECOMMENDED_CARD,
} from '../Redux/Features/RecommendedCardSlice';
import {useEffect, useState} from 'react';
import {defaultImage} from '../Assets/Index';

const shadowOpacity = Platform.select({
  ios: null,
  android: windowWidth * 0.05,
});
export default function RecommendedCartComponent({route}) {
  const navigation = useNavigation();
  const recommend = route?.params?.recommended;
  const dispatch = useDispatch();
  const RECOMMENDED_CARD = useSelector(
    state => state?.RECOMMAND_CARD?.RECOMMENDED_CART,
  );
  const [price, setPrice] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let totalQuantity = 0;
    let totalPrice = 0;

    RECOMMENDED_CARD?.forEach(product => {
      const {quantity = 0, price = 0} = product;
      totalQuantity += quantity;
      totalPrice += quantity * price;
    });
    setTotalQuantity(totalQuantity);
    setPrice(totalPrice?.toFixed(2));
  }, [RECOMMENDED_CARD]);

  const increaseQuantity = item => {
    dispatch(INCREMENT_RECOMMENDED_QUANTITY(item?.product_id));
  };

  const decreaseQuantity = item => {
    dispatch(DECREMENT_RECOMMENDED_QUANTITY(item?.product_id));
  };
  const handleCheckout = async () => {
    setLoading(true);
    try {
      navigation.navigate('InVoice', {
        product_Price: price,
        product_Quantity: totalQuantity,
        recommended: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const deleteItem = id => {
    dispatch(REMOVE_FROM_RECOMMENDED_CARD(id));
  };
  return (
    <SafeAreaView style={mainContainer}>
      <FlatList
        data={RECOMMENDED_CARD}
        keyExtractor={item => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: windowHeight * 0.02,
          alignItems: 'center',
          width: windowWidth * 1,
        }}
        ListHeaderComponent={
          <>
            <Header title="Cart" titleStyle={styles.titleStyle} />
            <View style={styles.recommended}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.totalAmount}>
            {/* <View style={styles.totalItems}>
              <Text style={styles.itemText}>Total Items</Text>
              <Text style={styles.itemText}>{CartData.length}</Text>
            </View> */}
            <View style={styles.buttons}>
              <View style={styles.total}>
                <Text style={styles.totalText}>Total Price</Text>
                <Text style={styles.totalText}>${price}</Text>
              </View>
              <View>
                <Btn
                  text="Checkout"
                  fontSize={16}
                  fontFamily={Fonts.semiBold}
                  onPress={handleCheckout}
                />
              </View>
              <View style={{paddingTop: windowHeight * 0.03}}>
                <Btn
                  text="Add More Items"
                  fontSize={16}
                  textColor={Colors.primary}
                  backgroundColor={Colors.white}
                  fontFamily={Fonts.semiBold}
                  // navigation.navigate('Department', {vender_Id: venderId});

                  onPress={() =>
                    navigation.navigate('Department', {
                      vender_Id: RECOMMENDED_CARD[0]?.vendor_id,
                      recommend: true,
                    })
                  }
                />
              </View>
              <View
                style={{
                  paddingTop: windowHeight * 0.03,
                  paddingBottom: windowHeight * 0.07,
                }}>
                <Btn
                  text="Add From Wishlist"
                  fontSize={16}
                  textColor={Colors.primary}
                  backgroundColor={Colors.white}
                  fontFamily={Fonts.semiBold}
                  onPress={() =>
                    navigation.navigate('RecommendedWishList', {
                      recommend: true,
                    })
                  }
                />
              </View>
            </View>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.cartContainer}>
            <View style={styles.cartImgContainer}>
              <Image
                source={
                  error ? defaultImage : {uri: Config?.domain + item?.image}
                }
                resizeMode="contain"
                style={styles.cartImg}
                onError={() => setError(true)}
              />
            </View>
            <View style={styles.cartDetailContainer}>
              <View style={styles.closeIconContainer}>
                <TouchableOpacity onPress={() => deleteItem(item?.product_id)}>
                  <Icon name="close" size={15} color="red" />
                </TouchableOpacity>
              </View>
              {/* Item And Item Name */}
              <View style={styles.itemDetailsContainer}>
                <Text style={styles.headingText}>{item?.product_name}</Text>
                <Text style={styles.items}>{item?.quantity} Items</Text>
              </View>
              {/* Price & Quantity  */}
              <View style={styles.priceQuantityContainer}>
                <Text style={styles.price}>${item?.price}</Text>
                <View style={styles.amountMain}>
                  <TouchableOpacity
                    style={styles.amountView}
                    onPress={() => decreaseQuantity(item)}>
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.amountText}>{item?.quantity}</Text>
                  <TouchableOpacity
                    style={styles.amountViewplus}
                    onPress={() => increaseQuantity(item)}>
                    <Text style={styles.quantityTextplus}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  recommended: {
    width: isMobileScreen ? windowWidth / 2.8 : windowWidth * 0.2,
    height: isMobileScreen ? windowHeight * 0.04 : windowHeight * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: windowWidth * 0.25,
    marginTop: windowHeight * 0.03,
    marginRight: windowWidth * 0.5,
  },
  recommendedText: {
    fontSize: fontSize.M,
    color: Colors.white,
  },
  cartContainer: {
    marginTop: windowHeight * 0.03,
    width: windowWidth * 0.9,
    flexDirection: 'row',
    borderRadius: windowWidth * 0.005,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: windowHeight * 0.03},
    shadowOpacity: windowWidth * 0.3,
    shadowRadius: windowWidth * 0.6,
    elevation: windowWidth * 0.02,
    marginBottom: windowHeight * 0.01,
  },
  cartImgContainer: {
    margin: isMobileScreen ? hp(2) : windowHeight * 0.02,
    width: isMobileScreen ? wp(20) : windowWidth * 0.2,
    justifyContent: 'center',
    backgroundColor: Colors.whiteSmoke,
    borderRadius: windowWidth * 0.01,
  },
  cartImg: {
    width: isMobileScreen ? wp(20) : windowWidth * 0.2,
    height: isMobileScreen ? wp(15) : windowHeight * 0.1,
  },
  cartDetailContainer: {
    flex: 1,
  },
  closeIconContainer: {
    marginLeft: isMobileScreen ? wp(55) : windowWidth * 0.64,
    marginTop: windowHeight * 0.006,
  },
  itemDetailsContainer: {
    marginBottom: windowHeight * 0.01,
  },
  headingText: {
    maxWidth: wp(45),
    fontFamily: Fonts.bold,
    color: Colors.raisinBlack,
    width: wp(40),
  },
  items: {
    marginTop: windowHeight * 0.01,
    fontFamily: Fonts.medium,
    color: Colors.darkSilver,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: windowWidth * 0.02,
  },
  price: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  amountMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: windowWidth * 0.03,
  },
  amountView: {
    backgroundColor: Colors.white,
    width: wp(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: windowWidth * 0.01,
    borderColor: Colors?.primary,
    borderWidth: wp(0.1),
    shadowOffset: {width: 0, height: windowHeight * 0.03},
    shadowOpacity,
    shadowRadius: windowWidth * 0.06,
    elevation: windowWidth * 0.01,
  },
  amountViewplus: {
    backgroundColor: Colors.primary,
    width: wp(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: windowWidth * 0.01,
    borderColor: Colors?.primary,
    borderWidth: wp(0.1),
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: windowHeight * 0.03},
    shadowOpacity,
    shadowRadius: windowWidth * 0.06,
    elevation: windowWidth * 0.01,
  },
  amountText: {
    marginHorizontal: wp(2),
    color: Colors.black,
    fontWeight: 'bold',
  },
  quantityText: {
    paddingTop: 5,
    color: Colors.primary,
    fontSize: fontSize.L,
    fontFamily: Fonts.p_Regular,
  },

  quantityTextplus: {
    paddingTop: 5,
    color: Colors.white,
    fontSize: fontSize.L,
    fontFamily: Fonts.p_Regular,
  },
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
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.9,
    borderTopWidth: windowWidth * 0.001,
    borderTopColor: Colors.lightSilver,
    paddingBottom: windowWidth * 0.04,
    marginTop: hp(3),
  },
  totalText: {
    paddingTop: isMobileScreen ? wp(2.5) : windowWidth * 0.01,
    color: Colors.chineseBlack,
    fontSize: fontSize.L,
    fontFamily: Fonts.semiBold,
  },
});
