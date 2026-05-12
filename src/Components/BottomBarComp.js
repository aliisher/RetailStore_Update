import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { isMobileScreen, wp } from '../Constants/Responsive';
import { bottomContainer } from '../Constants/StyleSheet';
import { fontSize } from '../Constants/Fonts';
import { Colors } from '../Constants/Colors';

const BottomBarComp = props => {
  return (
    <View style={bottomContainer}>
      <View style={props?.viewStyle}>
        <Image
          source={props?.image}
          style={[props?.imgStyle, styles.imgStyle]}
          resizeMode="contain"
        />
      </View>
      <Text
        style={[props?.textStyle, styles.label]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        ellipsizeMode="clip"
      >
        {props?.label}
      </Text>
    </View>
  );
};

export default BottomBarComp;

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: fontSize.S,
    color: Colors.spanishGrey,
  },
  imgStyle: {
    width: isMobileScreen ? wp('5.5%') : wp('3%'),
    height: isMobileScreen ? wp('5.5%') : wp('3%'),
  },
});
