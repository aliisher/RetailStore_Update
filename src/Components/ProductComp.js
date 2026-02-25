import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../Constants/Colors';
import {
  hp,
  isMobileScreen,
  windowHeight,
  windowWidth,
  wp,
} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {defaultImage, heartFill, heartImg} from '../Assets/Index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Config} from '../Api_Services/Config';

const shadowOpacity = Platform.select({
  ios: null,
  android: windowWidth * 0.05, 
});
const ProductComp = props => {
  const isValidImageFormat = url => {
    return /\.(jpg|jpeg|png)$/i.test(url);
  };

  return (
    <TouchableOpacity
      style={styles.mainStyling}
      onPress={() => props?.productClick && props.productClick()}>
      <View>
        <View style={styles.priceMainView}>
          <View style={styles.taxableView}>
            <Text style={styles.taxableText}>$ {props?.text}</Text>
          </View>
          <View style={styles.imagesView}>
            <TouchableOpacity
              onPress={() => props?.favorite()}
              style={styles.imgView}>
              <Image
                source={props?.isFavorite == true ? heartFill : heartImg}
                style={[
                  styles.heartImg,
                  {
                    tintColor:
                      props?.isFavorite == true ? Colors.red : Colors.black,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {props?.hotSelling && (
              <View style={styles.iconView}>
                <Icon
                  name="local-fire-department"
                  size={isMobileScreen ? hp(2.5) : windowHeight * 0.05}
                  style={styles.iconStyle}
                />
              </View>
            )}
          </View>
        </View>
        <Image
          source={
            isValidImageFormat(props?.imgSource[0]?.product_image)
              ? {uri: Config.domain + props?.imgSource[0]?.product_image}
              : defaultImage
          }
          style={styles.imgStyle}
          resizeMode="contain"
        />
        <View style={styles.textView}>
          <Text style={styles.textStyle}>{props?.title}</Text>
          <View style={styles.productByView}>
            <Text style={styles.byText}>By</Text>
            <Text style={styles.smokText}>: {props?.vendorName}</Text>
          </View>
        </View>
      </View>

      <View>
        <View style={styles.amountMain}>
          <TouchableOpacity
            style={styles.amountView}
            onPress={props?.onDecrease}>
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
          <Text style={styles.amountText}>{props?.quantity}</Text>
          <TouchableOpacity
            style={styles.amountViewplus}
            onPress={props?.onIncrease}>
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
      </View>
    </TouchableOpacity>
  );
};

export default ProductComp;

const styles = StyleSheet.create({
  mainStyling: {
    backgroundColor: Colors.whiteSmoke,
    width: wp(43),
    marginHorizontal: hp(1),
    borderRadius: hp(1),
    justifyContent: 'space-between',
    padding: wp(2),
    marginTop: hp(2),
  },
  imgStyle: {
    width: isMobileScreen ? hp(10) : windowWidth * 0.11,
    height: isMobileScreen ? hp(10) : windowWidth * 0.1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  textStyle: {
    marginTop: hp(2),
    fontFamily: Fonts.semiBold,
    fontSize: isMobileScreen ? fontSize.XS : null,
    color: Colors.raisinBlack,
  },
  textView: {
    marginHorizontal: wp(2),
  },
  taxableView: {
    width: wp(13),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: isMobileScreen ? hp(3.3) : windowHeight * 0.05,
    borderTopLeftRadius: hp(1),
    borderBottomRightRadius: hp(1),
  },
  taxableText: {
    color: Colors.white,
    fontSize: fontSize.S,
  },
  heartImg: {
    width: isMobileScreen ? wp(3.2) : windowWidth * 0.025,
    height: isMobileScreen ? wp(3.2) : windowWidth * 0.025,
  },
  imagesView: {
    position: 'absolute',
    right: 1,
  },
  imgView: {
    borderWidth: isMobileScreen ? hp(0.5) : windowHeight * 0.012,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: isMobileScreen ? hp(10) : windowHeight * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isMobileScreen ? hp(0.5) : windowHeight * 0.01,
    marginRight: isMobileScreen ? wp(2) : windowWidth * 0.02,
  },
  priceMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productByView: {
    flexDirection: 'row',
  },
  byText: {
    color: Colors.primary,
    fontFamily: Fonts.p_Bold,
    fontSize: isMobileScreen ? fontSize.XXS : fontSize.S,
  },
  smokText: {
    color: Colors.darkSilver,
    fontFamily: Fonts.medium,
    fontSize: isMobileScreen ? fontSize.XXS : fontSize.S,
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
    shadowOffset: {width: 0, height: windowHeight * 0.03},
    shadowOpacity,
    shadowRadius: windowWidth * 0.06,
    elevation: windowWidth * 0.01,
  },
  amountText: {
    color: Colors.black,
    marginHorizontal: wp('1%'),
    fontFamily: Fonts.p_Bold,
    fontSize: isMobileScreen ? fontSize.S1 : fontSize.S,
  },
  amountMain: {
    marginHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
    bottom: hp(1),
  },
  iconView: {
    backgroundColor: Colors.white,
    borderRadius: isMobileScreen ? hp(10) : windowWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isMobileScreen ? hp(1) : windowHeight * 0.01,
    marginRight: isMobileScreen ? wp(2) : windowWidth * 0.02,
  },
  iconStyle: {
    color: 'red',
  },
});
