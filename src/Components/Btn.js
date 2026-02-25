import {
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../Constants/Colors';
import {hp, isMobileScreen, wp} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';

const Btn = props => {
  return (
    <Pressable
      onPress={props?.onPress}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: props?.backgroundColor || Colors.primary,
          marginTop: props?.marginTop,
          width: props?.width || wp(89),
          marginRight: props?.marginRight,
          borderColor: props?.borderColor || Colors.primary,
          borderRadius: props?.borderRadius || wp(1),
          marginBottom: props?.marginBottom,
          alignSelf: props?.alignSelf,
          height: props?.height || hp('7%'),
          marginLeft: props?.marginLeft,
        },
      ]}
      disabled={props?.loading}>
      <View style={styles.contentContainer}>
        {props?.loading ? (
          <ActivityIndicator
            size="small"
            color={props?.spinnerColor || Colors.white}
            style={styles.spinner}
          />
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: props?.textColor || Colors.white,
                fontSize: props?.fontSize || fontSize.XXS,
                fontFamily: props?.fontFamily || Fonts.semiBold,
              },
            ]}>
            {props?.text}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default Btn;

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: hp(0.15),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('6%'),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingVertical: !isMobileScreen ? hp('2.5%') : hp('1.5%'),
  },
  spinner: {
    height: hp('2.5%'),
  },
});
