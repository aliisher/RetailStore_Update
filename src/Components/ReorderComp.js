import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../Constants/Colors';
import {hp, isMobileScreen, windowHeight, wp} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Config} from '../Api_Services/Config';
import {defaultImage} from '../Assets/Index';

const ReorderComp = props => {
  const [error, setError] = useState('');

  return (
    <TouchableOpacity
      onPress={props?.reOrderItemPress}
      style={styles.mainStyling}>
      <View>
        <View style={styles.priceMainView}>
          <View style={styles.taxableView}>
            <Text style={styles.taxableText}>$ {props?.text}</Text>
          </View>
        </View>
        <Image
          source={
            error ? defaultImage : {uri: Config.domain + props?.imgSource}
          }
          style={{
            width: wp(isMobileScreen ? 18 : 25),
            height: wp(isMobileScreen ? 18 : 25) * (25 / 18),
            alignSelf: 'center',
            marginTop: hp(1),
          }}
          resizeMode="contain"
          onError={() => setError(true)}
        />

        <View style={styles.textView}>
          <Text numberOfLines={1} style={styles.textStyle}>
            {props?.title}
          </Text>
          <View style={styles.productByView}>
            <Text style={styles.byText}>By: </Text>
            <Text style={styles.smokText} numberOfLines={1}>
              {props?.byText}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.noOfOrders}>
        <Text style={styles.noOfOrdersText}>
          {props?.noOfOrders} times Reorder
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReorderComp;

const styles = StyleSheet.create({
  mainStyling: {
    backgroundColor: Colors.whiteSmoke,
    width: wp(43),
    borderRadius: hp(1),
    justifyContent: 'space-between',
  },

  imgStyle: {
    width: isMobileScreen ? hp(11) : windowHeight * 0.11,
    height: isMobileScreen ? hp(11) : windowHeight * 0.11,
    alignSelf: 'center',
    marginTop: hp(-1),
  },
  textStyle: {
    width: wp(33),
    marginTop: hp(2),
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.XS,
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
    height: isMobileScreen ? hp(3.3) : windowHeight * 0.06,
    borderTopLeftRadius: hp(1),
    borderBottomRightRadius: hp(1),
  },
  taxableText: {
    color: Colors.white,
    fontSize: fontSize.S,
  },
  heartImg: {
    width: wp(3),
    height: wp(3),
    tintColor: Colors.black,
  },
  imgView: {
    borderWidth: hp(0.7),
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.6),
    marginRight: wp(1.2),
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
    fontFamily: Fonts.medium,
    fontSize: fontSize.XXS,
  },
  smokText: {
    width: wp(33),
    color: Colors.darkSilver,
    fontFamily: Fonts.medium,
    fontSize: fontSize.XXS,
  },
  amountView: {
    backgroundColor: Colors.white,
    width: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    color: Colors.darkSilver,
    fontSize: fontSize.XXS,
  },
  amountMain: {
    marginHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(13),
    justifyContent: 'space-between',
    marginTop: hp(2),
    bottom: hp(1),
  },
  noOfOrders: {
    marginTop: hp(0.7),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    borderBottomLeftRadius: wp(2),
    borderBottomRightRadius: wp(2),
  },
  noOfOrdersText: {
    color: Colors.white,
    fonf: Fonts.semiBold,
    padding: wp(1),
  },
});
