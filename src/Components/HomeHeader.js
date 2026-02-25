import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {layer1Img, menuImg} from '../Assets/Index';
import {isMobileScreen, windowWidth, wp} from '../Constants/Responsive';
import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Image source={menuImg} style={styles.imgStyle} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('ReOrder')}>
        <View style={{alignItems: 'flex-end', marginRight: wp(1.5)}}>
          <Text style={styles.textStyle}>Reorder</Text>
          <Text style={styles.textStyle1}>My Items</Text>
        </View>
        <View>
          <Image
            source={layer1Img}
            style={styles.imgStyle1}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgStyle: {
    width: isMobileScreen ? windowWidth * 0.06 : windowWidth * 0.04,
  },
  imgStyle1: {
    width: isMobileScreen ? windowWidth * 0.05 : windowWidth * 0.04,
  },
  textStyle: {
    fontFamily: Fonts.regular,
    color: Colors.primary,
    fontSize: fontSize.S,
  },
  textStyle1: {
    color: Colors.primary,
    fontSize: fontSize.S1,
    fontFamily: Fonts.medium,
  },
});
