import {StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputComp from '../../Components/TextInputComp';
import {hp, isMobileScreen, windowHeight, wp} from '../../Constants/Responsive';
import {fontSize} from '../../Constants/Fonts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {mainContainer} from '../../Constants/StyleSheet';
import Header from '../../Components/Header';
import {Colors} from '../../Constants/Colors';
import Btn from '../../Components/Btn';
import {lockImg} from '../../Assets/Index';
import {request} from '../../Api_Services/ApiServices';
import Toast from 'react-native-simple-toast';

const ResetPassword = () => {
  const route = useRoute();
  const scrollRef = useRef();
  const navigation = useNavigation();
  const userEmail = route?.params?.email;

  const [focusConfirm, setFocusConfirm] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    passwordError: '',
    cPasswordError: '',
  });
  const [userData, setUserData] = useState({
    password: '',
    cPassword: '',
  });

  const resetPassword = () => {
    if (!userData?.password) {
      setErrorMessage({
        ...errorMessage,
        passwordError: 'Please enter your password',
      });
    } else if (userData?.password.length < 8) {
      setErrorMessage({
        ...errorMessage,
        passwordError: 'Password must be at least 8 characters',
      });
    } else if (!userData?.cPassword) {
      setErrorMessage({
        ...errorMessage,
        cPasswordError: 'Please enter your confirm password',
      });
    } else if (userData?.cPassword.length < 8) {
      setErrorMessage({
        ...errorMessage,
        cPasswordError: 'Confirm password must be at least 8 characters',
      });
    } else if (userData?.password !== userData?.cPassword) {
      Toast.show("Your Password doesn't match", Toast.SHORT);
    } else {
      setLoading(true);
      resetPasswordApi();
    }
  };

  const resetPasswordApi = () => {
    const formData = new FormData();
    formData?.append('email', userEmail);
    formData?.append('password', userData?.password);
    formData?.append('confirm_password', userData?.cPassword);

    request
      .post('resetPassword', formData)
      .then(response => {
        setLoading(false);
        const res = response?.data;
        if (res?.status === 'success') {
          Toast.show(res?.message, Toast.SHORT);
          navigation.navigate('Login');
        } else {
          Toast.show(res?.error || 'Something went wrong', Toast.SHORT);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('err', err);
        Toast.show('An error occurred. Please try again later.', Toast.SHORT);
      });
  };

  return (
    <SafeAreaView style={mainContainer}>
      <View>
        <KeyboardAwareScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Header title="Reset Password" onPress={() => navigation?.goBack()} />
          <View style={styles.textInput}>
            <TextInputComp
              secureTextEntry
              title={'Password'}
              imgSource={lockImg}
              placeholder={'Password'}
              value={userData?.password}
              inputStyle={styles.inputStyle}
              onBlur={() => setFocusPassword(false)}
              errorMessage={errorMessage?.passwordError}
              onChangeText={text => {
                setErrorMessage(prevState => ({
                  ...prevState,
                  passwordError: null,
                }));
                setUserData(prevState => ({...prevState, password: text}));
              }}
              onFocus={e => {
                setFocusPassword(true);
                scrollRef?.current?.scrollToFocusedInput(e.target);
              }}
              inputCotainer={{
                borderWidth: focusPassword ? wp(0.3) : wp(0),
                borderColor: focusPassword ? Colors.primary : 'grey',
              }}
            />
            <TextInputComp
              secureTextEntry
              title={'Confirm Password'}
              imgSource={lockImg}
              placeholder={'Confirm Password'}
              value={userData?.cPassword}
              inputStyle={styles.inputStyle}
              onBlur={() => setFocusConfirm(false)}
              errorMessage={errorMessage?.cPasswordError}
              onChangeText={text => {
                setErrorMessage(prevState => ({
                  ...prevState,
                  cPasswordError: null,
                }));
                setUserData(prevState => ({...prevState, cPassword: text}));
              }}
              onFocus={e => {
                setFocusConfirm(true);
                scrollRef?.current?.scrollToFocusedInput(e.target);
              }}
              inputCotainer={{
                borderWidth: focusConfirm ? wp(0.3) : wp(0),
                borderColor: focusConfirm ? Colors.primary : 'grey',
              }}
              mainStyling={{
                marginTop: isMobileScreen ? hp('1.5%') : hp('3%'),
              }}
            />
          </View>
          <Btn
            text={'Submit'}
            marginTop={windowHeight / 7}
            onPress={resetPassword}
            fontSize={fontSize.L}
            loading={loading}
          />
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  inputStyle: {
    width: isMobileScreen ? wp('70%') : wp('75%'),
  },
  textInput: {
    marginTop: isMobileScreen ? hp('8%') : hp('8%'),
  },
});
