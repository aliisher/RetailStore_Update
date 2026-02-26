import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Fonts, fontSize } from '../Constants/Fonts';
import { hp, isMobileScreen, wp } from '../Constants/Responsive';
import { Colors } from '../Constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { cartImg } from '../Assets/Index';

const Header = props => {
  const navigation = useNavigation();

  return (
    <View style={[styles.mainContainer, props?.mainContainer]}>
      <TouchableOpacity
        onPress={
          props?.press
            ? () => props?.press && props?.press()
            : () => navigation.goBack()
        }
      >
        <Icon
          name={props?.leftIcon || 'arrow-back-sharp'}
          size={fontSize.XL1}
          color={props?.iconColor || Colors.chineseBlack}
          type={'antdesign' || props?.leftIconType}
          style={{ marginTop: hp(0.6) }}
        />
      </TouchableOpacity>
      <Text style={[styles.title, props?.titleStyle]}>{props?.title}</Text>
      {props?.addToCart ? (
        <TouchableOpacity
          onPress={props?.onCartPress}
          style={styles.cartContainer}
        >
          {/* <AntDesign
            name="shoppingcart"
            size={fontSize.XL1}
            color={Colors.chineseBlack}
            style={{marginTop: hp(0.6)}}
          /> */}
          <Image
            source={cartImg}
            resizeMode="contain"
            style={styles.cartImg}
            tintColor={'black'}
          />
          {props?.cardLength > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>{props.cardLength}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : props?.imgSource ? (
        <TouchableOpacity onPress={() => props?.imgPress()}>
          <Image
            source={props?.imgSource}
            style={styles.imgStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : props?.heartImage ? (
        <TouchableOpacity
          onPress={() => props?.heartImgPress()}
          style={styles.imgView}
        >
          <Image
            source={props?.heartImage}
            style={styles.heartImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <Text style={{ color: '#00000000' }}>ssss</Text>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: wp(90),
    marginTop: hp(2),
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.Normal1,
    color: Colors.black,
  },
  imgStyle: {
    width: isMobileScreen ? wp('5%') : wp('3%'),
    height: isMobileScreen ? wp('5%') : wp('3%'),
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
    borderRadius: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.6),
    marginRight: wp(1.2),
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  cartImg: {
    width: isMobileScreen ? wp('5%') : wp('2%'),
    height: isMobileScreen ? hp('3%') : wp('5%'),
    marginTop: hp('1%'),
  },
});
