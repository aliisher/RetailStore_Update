import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {hp, wp} from '../Constants/Responsive';
import {useSelector} from 'react-redux';

const ProductInvoiceDetailComp = ({recommed}) => {
  const getCardData = useSelector(state => state?.CARD?.CART);
  const RECOMMENDED_CARD = useSelector(
    state => state?.RECOMMAND_CARD?.RECOMMENDED_CART,
  );
  const renderItem = ({item}) => (
    <>
      <View style={styles.productDetailView}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productQty}>{item.quantity}</Text>
        <Text style={styles.productPrice}>
          ${parseFloat(item?.price).toFixed(2)}
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
        data={recommed ? RECOMMENDED_CARD : getCardData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ProductInvoiceDetailComp;

const styles = StyleSheet.create({
  titleStyle: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.bold,
    fontSize: fontSize.S,
  },
  titleStyle1: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.bold,
    fontSize: fontSize.S,
    width: wp(35),
  },

  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('90%'),
  },
  productName: {
    color: Colors.darkSilver,
    fontSize: fontSize.XS,
    fontFamily: Fonts.semiBold,
    width: wp(35),
  },
  productDetailView: {
    marginTop: hp(1),
    justifyContent: 'space-between',
    alignItems: 'center',
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
    textAlign: 'right',
    width: wp('11%'),
  },
});
