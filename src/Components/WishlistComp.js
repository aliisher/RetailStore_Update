import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../Constants/Colors';
import {
  hp,
  isMobileScreen,
  windowHeight,
  windowWidth,
  wp,
} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Config} from '../Api_Services/Config';
import {heartFill, heartImg} from '../Assets/Index';
import {defaultImage} from '../Assets/Index';
const shadowOpacity = Platform.select({
  ios: null,
  android: windowWidth * 0.05, 
});
const WishlistComp = props => {
  const [error, setError] = useState('');

  return (
    <View style={styles.mainStyling}>
      <View>
        <View style={styles.priceMainView}>
          <View style={styles.taxableView}>
            <Text style={styles.taxableText}>$ {props?.text}</Text>
          </View>
          <TouchableOpacity
            style={styles.imgView}
            onPress={() => props?.favoriteFunction()}>
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
        </View>
        <Image
          source={
            error ? defaultImage : {uri: Config.domain + props?.imgSource}
          }
          style={styles.imgStyle}
          resizeMode="contain"
          onError={() => setError(true)}
        />
        <View style={styles.textView}>
          <Text style={styles.textStyle} numberOfLines={1}>
            {props?.title}
          </Text>
          <View style={styles.productByView}>
            <Text style={styles.byText}>By</Text>
            <Text style={styles.smokText} numberOfLines={2}>
              : {props?.name}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.amountMain}>
        <TouchableOpacity style={styles.amountView} onPress={props?.onDecrease}>
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
  );
};

export default WishlistComp;

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
    marginTop: hp(1),
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

  imgView: {
    borderWidth: hp(0.7),
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: isMobileScreen ? wp(3) : wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.6),
    marginRight: wp(1.2),
    width: isMobileScreen ? wp(6) : wp(4),
    height: isMobileScreen ? wp(6) : wp(4),
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
    color: Colors.darkSilver,
    fontFamily: Fonts.medium,
    fontSize: fontSize.XXS,
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
    marginHorizontal: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
    bottom: hp(1),
  },
  heartImg: {
    width: isMobileScreen ? wp(3.2) : windowWidth * 0.025,
    height: isMobileScreen ? wp(3.2) : windowWidth * 0.025,
  },
});
