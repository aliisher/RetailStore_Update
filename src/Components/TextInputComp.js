import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {hp, isMobileScreen, windowWidth, wp} from '../Constants/Responsive';
import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {eyeImg, hiddenEyeImg} from '../Assets/Index';
const TextInputComp = props => {
  const [securePassword, setSecurePassword] = useState(props?.secureTextEntry);
  return (
    <View style={[props?.mainStyling]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.title, props?.titleStyle]}>{props?.title}</Text>
        {props?.optional && (
          <Text style={styles.optional}>{props?.optional}</Text>
        )}
      </View>
      <View
        style={[
          styles.inputCotainer,
          props?.inputCotainer,
          {width: props?.width || wp(89)},
        ]}>
        <Image
          source={props?.imgSource}
          // style={[props?.imgStyle, styles.imgStyle]}
          style={[styles.imgStyle, props?.imgStyle]}
          resizeMode="contain"
        />
        <TextInput
          value={props?.value}
          placeholder={props?.placeholder}
          style={[styles.inputStyle, props?.inputStyle]}
          keyboardType={props?.keyboardType}
          autoCapitalize="none"
          placeholderTextColor={Colors.black}
          secureTextEntry={securePassword}
          onChangeText={props?.onChangeText}
          multiline={props?.multiline}
          numberOfLines={props?.numberOfLines}
          onFocus={props?.onFocus}
          onBlur={props?.onBlur}
          editable={props?.editable}
        />

        {props?.secureTextEntry && (
          <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
            <Image
              source={securePassword ? hiddenEyeImg : eyeImg}
              style={styles.imgStyle1}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {props?.errorMessage && (
        <Text
          numberOfLines={1}
          style={[styles.errorMessage, props?.errorMessageStyle]}>
          {props?.errorMessage}
        </Text>
      )}
    </View>
  );
};

export default TextInputComp;

const styles = StyleSheet.create({
  inputCotainer: {
    width: wp('90%'),
    height: isMobileScreen ? hp('7%') : hp('14%'),
    borderRadius: wp(0.8),
    backgroundColor: Colors.whiteSmoke,
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    borderColor: Colors.grey,
    alignItems: 'center',
  },
  title: {
    color: Colors.chineseBlack,
    paddingRight: wp(1),
    paddingVertical: hp('1%'),
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.M1,
  },
  optional: {
    color: Colors.grey,
    fontFamily: Fonts.p_Regular,
    fontSize: fontSize.M,
  },
  errorMessage: {
    color: Colors.secondary,
    marginLeft: wp(3),
    width: wp(85),
  },
  inputStyle: {
    justifyContent: 'space-between',
    width: wp('75%'),
    fontFamily: Fonts?.p_Regular,
    color: Colors.black,
    marginLeft: wp(2),
    fontSize: fontSize.M,
    alignItems: 'center',
    textAlignVertical: 'bottom',
  },
  imgStyle: {
    width: isMobileScreen ? wp(5) : windowWidth * 0.02,
  },
  imgStyle1: {
    width: isMobileScreen ? wp('6%') : wp('3%'),
  },
});
