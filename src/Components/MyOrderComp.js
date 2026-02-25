import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../Constants/Responsive';
import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Config} from '../Api_Services/Config';
import {defaultImage} from '../Assets/Index';

const MyOrderComp = props => {
  const [error, setError] = useState('');

  const statusStyle = {
    color:
      props?.status == 'Completed'
        ? Colors.finchGreen
        : props?.status == 'pending'
        ? Colors.secondary
        : Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.XS,
  };
  return (
    <TouchableOpacity
      onPress={() => props?.pressItem()}
      style={styles.mainView}>
      <View style={styles.imgView}>
        <Image
          source={
            error ? defaultImage : {uri: Config.domain + props?.imgSource}
          }
          style={styles.imgStyle}
          resizeMode="contain"
          onError={() => setError(true)}
        />
      </View>
      <View style={styles.productDetailView}>
        <View style={styles.productNameView}>
          <Text style={styles.productNameText}>{props?.title}</Text>
          <Text style={statusStyle}>{props?.status}</Text>
        </View>
        <View style={styles.productIdView}>
          <Text style={styles.textStyle}>Order#: {props?.orderId}</Text>
          <Text style={styles.textStyle}>Products: {props?.productQty}</Text>
        </View>
        <View style={styles.priceView}>
          <Text style={styles.textStyle}>{props?.date}</Text>
          <Text style={styles.priceStyle}>Price: ${props?.productPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyOrderComp;

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    width: wp(90),
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteSmoke,
    borderRadius: wp(1),
    alignItems: 'center',
    paddingVertical: hp(2),
    marginTop: hp(2),
    paddingHorizontal: wp(2),
  },
  imgView: {
    alignItems: 'center',
  },
  productNameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgStyle: {
    width: wp(17),
    height: wp(17),
  },
  productNameText: {
    width: wp(45),
    color: Colors.chineseBlack,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S1,
  },
  productIdView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(1),
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(1),
  },
  productDetailView: {
    paddingRight: wp(7),
    width: wp(75),
    paddingHorizontal: wp(1),
  },
  textStyle: {
    fontFamily: Fonts.regular,
    color: Colors.darkSilver,
    fontSize: fontSize.XS,
  },
  priceStyle: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    fontSize: fontSize.XS,
  },
});
