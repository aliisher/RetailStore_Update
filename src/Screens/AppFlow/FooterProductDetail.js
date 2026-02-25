import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {
  windowWidth,
  hp,
  wp,
  isMobileScreen,
  windowHeight,
} from '../../Constants/Responsive';
import {cartImg} from '../../Assets/Index';
const shadowOpacity = Platform.select({
  ios: null,
  android: windowWidth * 0.05,
});
const Footer = ({quantity, onIncrease, onDecrease, cardPress}) => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
          <Text
            style={{
              paddingTop: 5,
              color: Colors.primary,
              fontSize: fontSize.L,
              fontFamily: Fonts.p_Regular,
            }}>
            -
          </Text>
        </TouchableOpacity>
        <Text style={styles.quantityNumber}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButtonPlus}
          onPress={onIncrease}>
          <Text
            style={{
              paddingTop: 5,
              color: Colors.white,
              fontSize: fontSize.L,
              fontFamily: Fonts.p_Regular,
            }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={cardPress}>
        <Image
          source={cartImg}
          resizeMode="contain"
          style={styles.cartImg}
          tintColor={'white'}
        />
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp(2),
    backgroundColor: Colors.white,
    width: windowWidth,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.lightSilver,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
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
  quantityButtonPlus: {
    backgroundColor: Colors.primary,
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
  quantityText: {
    fontSize: isMobileScreen ? hp(2.5) : hp(3.2),
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  quantityNumber: {
    fontSize: isMobileScreen ? hp(2.5) : hp(3.2),
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginHorizontal: wp(3),
  },
  addToCartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: isMobileScreen ? hp('2%') : hp('5%'),
    borderRadius: wp(1.5),
    width: !isMobileScreen ? wp('23%') : null,
  },
  cartImg: {
    width: isMobileScreen ? wp('10%') : wp('4%'),
    height: isMobileScreen ? hp('3%') : wp('5%'),
    marginRight: hp('1%'),
  },
  addToCartText: {
    fontSize: isMobileScreen ? hp('2.5%') : hp('4%'),
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
});

export default Footer;
