import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {hp, wp} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Colors} from '../Constants/Colors';

const InVoiceOrderDetailComp = ({data, date, invoice, storeData}) => {
  return (
    <View style={styles.invoiceDetailMain}>
      <View style={styles.dateVoiceMain}>
        <View>
          <Text style={styles.titleStyle}>Date:</Text>
          <Text style={styles.valueStyle}>{date}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.titleStyle}>Invoice#</Text>
          <Text style={styles.valueStyle}>{invoice}</Text>
        </View>
      </View>
      <View style={styles.dateVoiceMain1}>
        <View>
          <Text style={styles.titleStyle1}>Store Manager:</Text>
          <Text style={styles.valueStyle}>{data?.store_manager_name}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.titleStyle1}>Store Name</Text>
          <Text style={styles.valueStyle}>{data?.store_name}</Text>
        </View>
      </View>
      <View style={styles.dateVoiceMain1}>
        <View>
          <Text style={styles.titleStyle1}>Invoice for:</Text>
          <Text style={styles.vendorName} numberOfLines={2}>
            {data?.vendor_name}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.titleStyle1}>Store Address</Text>
          <Text style={styles.storeAddress} numberOfLines={2}>
            {storeData?.store_address}
          </Text>
        </View>
      </View>
      <View style={styles.dateVoiceMain1}>
        <View>
          <Text style={styles.titleStyle1}>Store Phone Number</Text>
          <Text style={styles.valueStyle}>{storeData?.store_phone_no}</Text>
        </View>
      </View>
    </View>
  );
};

export default InVoiceOrderDetailComp;

const styles = StyleSheet.create({
  dateVoiceMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  dateVoiceMain1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.5),
  },
  invoiceDetailMain: {
    width: wp(90),
  },
  titleStyle: {
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.M,
    color: Colors.chineseBlack,
  },
  titleStyle1: {
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
    color: Colors.chineseBlack,
  },
  vendorName: {
    width: hp('20%'),
    marginTop: wp(1),
    color: Colors.darkSilver,
    fontFamily: Fonts.medium,
    fontSize: fontSize.S,
  },
  valueStyle: {
    marginTop: wp(1),
    color: Colors.darkSilver,
    fontFamily: Fonts.medium,
    fontSize: fontSize.S,
  },
  storeAddress: {
    textAlign: 'right',
    marginTop: wp(1),
    width: hp('20%'),
    color: Colors.darkSilver,
    fontFamily: Fonts.medium,
    fontSize: fontSize.S,
  },
  invoiceNumber: {
    marginTop: wp(1),
  },
});
