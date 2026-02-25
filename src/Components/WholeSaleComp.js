import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../Constants/Colors';
import {defaultImage} from '../Assets/Index';
import {
  hp,
  isMobileScreen,
  windowHeight,
  windowWidth,
  wp,
} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Config} from '../Api_Services/Config';

const WholeSaleComp = props => {
  const [error, setError] = useState('');
  return (
    <View style={styles.mainStyling}>
      <View
        style={[
          styles.recommended,
          {
            backgroundColor:
              props?.overChargePrice == 1 ? Colors?.primary : null,
          },
        ]}>
        <Text style={styles.recommendedText}>
          {props?.overChargePrice == 1 && 'Overcharged Prices'}
        </Text>
      </View>
      <Image
        source={error ? defaultImage : {uri: Config.domain + props?.imgSource}}
        style={styles.imgStyle}
        resizeMode="contain"
        onError={() => setError(true)}
      />
      <Text style={styles.textStyle} numberOfLines={2}>
        {props?.title}
      </Text>
    </View>
  );
};

export default WholeSaleComp;

const styles = StyleSheet.create({
  mainStyling: {
    backgroundColor: Colors.whiteSmoke,
    width: isMobileScreen ? wp(43) : windowWidth * 0.43,
    padding: hp(1),
    borderRadius: hp(1),
    height: isMobileScreen ? hp(22) : windowHeight * 0.26,
  },
  imgStyle: {
    width: isMobileScreen ? hp(10) : windowHeight * 0.15,
    height: isMobileScreen ? hp(10) : windowHeight * 0.15,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  textStyle: {
    marginTop: hp(1),
    marginBottom: hp(1.3),
    fontFamily: Fonts.p_Bold,
    textAlign:'center',
    fontSize: isMobileScreen ? fontSize.M1 : fontSize.S,
    color: Colors.primary,
    paddingHorizontal: !isMobileScreen ? wp(1) : null,
  },
  recommended: {
    width: wp('22%'),
    borderRadius: windowWidth * 0.25,
    alignSelf: 'flex-end',
  },
  recommendedText: {
    fontSize: fontSize.XXXS,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
});
