import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {hp, wp} from '../Constants/Responsive';

const ProductOrderInvoiceDetailComp = ({productData}) => {
  const renderItem = ({item}) => (
    <>
      <View style={styles.productDetailView}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productQty}>{item.quantity}</Text>
        <Text style={styles.productPrice} numberOfLines={1}>
          ${item.price}
        </Text>
      </View>
    </>
  );
  return (
    <View>
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle1}>Product</Text>
        <Text style={styles.titleStyle}>QTY</Text>
        <Text style={styles.titleStyle}>Price</Text>
      </View>

      <FlatList
        data={productData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ProductOrderInvoiceDetailComp;

const styles = StyleSheet.create({
  titleStyle: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.bold,
    fontSize: fontSize.S1,
  },
  titleStyle1: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.bold,
    fontSize: fontSize.S,
    width: wp(35),
  },
  mainContainer: {
    width: wp(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    color: Colors.darkSilver,
    fontSize: fontSize.XS,
    fontFamily: Fonts.semiBold,
    width: wp(40),
  },
  productDetailView: {
    marginTop: hp(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  productQty: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
  },
  productPrice: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
    width: wp(13),
    textAlign: 'right',
  },
});
