import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  wp,
  hp,
  windowHeight,
  windowWidth,
  isMobileScreen,
} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Icon} from '@rneui/base';
import {Colors} from '../Constants/Colors';
import {Config} from '../Api_Services/Config';
import {defaultImage} from '../Assets/Index';
const shadowOpacity = Platform.select({
  ios: null,
  android: windowWidth * 0.05, 
});
const CartComponent = ({
  cartTitle,
  cartPrice,
  cartImage,
  cartQuantity,
  deleteButton,
  onIncrease,
  onDecrease,
  quantity,
}) => {
  const [error, setError] = useState('');

  return (
    <View style={styles.cartContainer}>
      {/* Image Container */}
      <View style={styles.cartImgContainer}>
        <Image
          source={error ? defaultImage : {uri: Config?.domain + cartImage}}
          resizeMode="contain"
          style={styles.cartImg}
          onError={() => setError(true)}
        />
      </View>
      <View style={styles.cartDetailContainer}>
        <View style={styles.closeIconContainer}>
          <TouchableOpacity onPress={deleteButton}>
            <Icon name="close" size={15} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.headingText}>{cartTitle}</Text>
          <Text style={styles.items}>{cartQuantity} Items</Text>
        </View>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.price}>${cartPrice}</Text>
          <View style={styles.amountMain}>
            <TouchableOpacity style={styles.amountView} onPress={onDecrease}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.amountText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.amountViewplus}
              onPress={onIncrease}>
              <Text style={styles.quantityTextplus}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: wp(2),
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
});

export default CartComponent;
