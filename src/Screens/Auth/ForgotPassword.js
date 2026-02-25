import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Components/Header';
import {hp, windowHeight, windowWidth, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {useNavigation} from '@react-navigation/native';
import TextInputComp from '../../Components/TextInputComp';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {fontSize} from '../../Constants/Fonts';
import Btn from '../../Components/Btn';
import {mainContainer} from '../../Constants/StyleSheet';
import {profileImg} from '../../Assets/Index';
import Regex from '../../Constants/Regex';
import {request} from '../../Api_Services/ApiServices';
import Toast from 'react-native-simple-toast';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [focusEmail, setFocusEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotData, setForgotData] = useState({
    email: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    emailError: null,
  });

  const sendOtp = () => {
    if (!forgotData?.email) {
      setErrorMessages({
        ...errorMessages,
        emailError: 'Please enter your email',
      });
    } else if (!Regex.email.test(forgotData?.email)) {
      setErrorMessages({
        ...errorMessages,
        emailError: 'Please enter a valid email',
      });
    } else {
      setLoading(true);
      ForgotPasswordApi();
    }
  };

  const ForgotPasswordApi = () => {
    const formData = new FormData();
    formData?.append('email', forgotData?.email);
    request
      .post('forgotPassword', formData)
      .then(response => {
        setLoading(false);
        const res = response?.data;
        if (res?.status == 'Ok') {
          Toast.show(res?.message, Toast.SHORT);
          navigation?.navigate('OTP', {email: forgotData?.email});
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
      <Header title="Forgot Password" onPress={() => navigation?.goBack()} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.textInput}>
          <TextInputComp
            title={'Email'}
            imgSource={profileImg}
            placeholder={'Email'}
            value={forgotData.email}
            onBlur={() => setFocusEmail(false)}
            keyboardType={'email-address'}
            errorMessage={errorMessages?.emailError}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                emailError: null,
              }));
              setForgotData(prevState => ({...prevState, email: text}));
            }}
            onFocus={e => {
              setFocusEmail(true);
            }}
            inputCotainer={{
              borderWidth: focusEmail ? wp(0.3) : wp(0),
              borderColor: focusEmail ? Colors.primary : 'grey',
            }}
          />
        </View>

        <Btn
          text={'Send OTP'}
          marginTop={windowHeight / 3}
          onPress={sendOtp}
          marginBottom={windowHeight / 1}
          fontSize={fontSize.L}
          loading={loading}
          customStyle={loading && {backgroundColor: Colors.lightGrey}}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  textInput: {
    marginTop: windowWidth * 0.1,
  },
});
