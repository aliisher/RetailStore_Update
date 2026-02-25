import {Platform, SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {mainContainer} from '../../Constants/StyleSheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../Components/Header';
import {hp, windowHeight, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {fontSize} from '../../Constants/Fonts';
import Btn from '../../Components/Btn';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {request} from '../../Api_Services/ApiServices';
import Toast from 'react-native-simple-toast';

const OTP = () => {
  const CELL_COUNT = 4;
  const route = useRoute();
  const navigation = useNavigation();
  const userEmail = route?.params?.email;
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const verifyOtp = () => {
    if (!value) {
      Toast.show('Please enter your OTP', Toast.SHORT);
    } else if (value.length !== 4) {
      Toast.show('Please enter 4 digit valid OTP', Toast.SHORT);
    } else {
      setLoading(true);
      handleOtpApi();
    }
  };

  const handleOtpApi = () => {
    const formData = new FormData();
    formData?.append('token', value);
    request
      .post('confirmToken', formData)
      .then(response => {
        const res = response?.data;
        setLoading(false);
        if (res?.status == 'Ok') {
          Toast.show(res?.message, Toast.SHORT);
          navigation.navigate('ResetPassword', {email: userEmail});
        } else {
          Toast.show(res?.message, Toast.SHORT);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('err', err);
      });
  };

  return (
    <SafeAreaView style={mainContainer}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Header title="OTP" onPress={() => navigation?.goBack()} />
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          textInputStyle={{color: 'red'}}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.select({
            android: 'sms-otp',
            default: 'one-time-code',
          })}
          testID="my-code-input"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <Btn
          text={'Verify'}
          marginTop={windowHeight / 3}
          onPress={verifyOtp}
          loading={loading}
          fontSize={fontSize.L}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default OTP;

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: hp(12), paddingHorizontal: wp(10)},
  cell: {
    width: 47,
    height: 47,
    lineHeight: hp(6),
    fontSize: fontSize.L,
    borderWidth: 2,
    borderColor: Colors.lightSilver,
    textAlign: 'center',
    color: Colors?.black,
    borderRadius: hp(0.7),
  },
  focusCell: {
    borderColor: Colors.primary,
  },
});
