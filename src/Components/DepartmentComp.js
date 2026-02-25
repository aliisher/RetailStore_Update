import {Image, StyleSheet, Text, View} from 'react-native';
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
import {defaultImage} from '../Assets/Index';
import {Config} from '../Api_Services/Config';

const DepartmentComp = props => {
  const [error, setError] = useState('');
  return (
    <View style={styles.mainStyling}>
      <View style={styles.taxableView}>
        <Text style={styles.taxableText}>{props?.text}</Text>
      </View>
      <Image
        source={error ? defaultImage : {uri: Config.domain + props?.imgSource}}
        style={styles.imgStyle}
        resizeMode="contain"
        onError={() => setError(true)}
      />
      <View style={styles.textView}>
        <Text style={styles.textStyle} numberOfLines={2}>{props?.title}</Text>
      </View>
    </View>
  );
};

export default DepartmentComp;

const styles = StyleSheet.create({
  mainStyling: {
    backgroundColor: Colors.whiteSmoke,
    width: isMobileScreen ? wp(43) : windowWidth * 0.43,
    borderRadius: hp(1),
    height: isMobileScreen ? hp(22) : windowHeight * 0.27,
  },
  imgStyle: {
    width: isMobileScreen ? hp(11) : windowHeight * 0.13,
    height: isMobileScreen ? hp(11) : windowHeight * 0.13,
    alignSelf: 'center',
    marginTop: isMobileScreen ? hp(1) : windowHeight * 0.01,
  },
  textStyle: {
    marginTop: hp(1),
    fontFamily: Fonts.bold,
    color: Colors.primary,
    textAlign:'center',
    fontSize: isMobileScreen ? fontSize.M1 : fontSize.S,
  },
  textView: {
    marginHorizontal: isMobileScreen ? wp(1.5) : windowWidth * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxableView: {
    width: wp(19),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: isMobileScreen ? hp(3.3) : windowHeight * 0.05,
    borderTopLeftRadius: hp(1),
    borderBottomRightRadius: hp(1),
  },
  taxableText: {
    color: Colors.white,
    fontSize: fontSize.S1,
  },
});
