import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputComp from '../../Components/TextInputComp';
import Btn from '../../Components/Btn';
import {SAVE_USER_DATA} from '../../Redux/Features/AuthSlice';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {hp, isMobileScreen, windowHeight, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {mainContainer} from '../../Constants/StyleSheet';
import {lockImg, profileImg, retailLogoImg} from '../../Assets/Index';
import Regex from '../../Constants/Regex';
import {apiHeaders, request} from '../../Api_Services/ApiServices';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const navigation = useNavigation();
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    emailError: null,
    passwordError: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          setLoginData({email: savedEmail, password: savedPassword});
        }
      } catch (error) {
        console.log('Error loading saved credentials:', error);
      }
    };

    loadSavedCredentials();
  }, []);

  const signin = () => {
    if (!loginData?.email) {
      setErrorMessages({
        ...errorMessages,
        emailError: 'Please enter your email',
      });
    } else if (!Regex.email.test(loginData?.email)) {
      setErrorMessages({
        ...errorMessages,
        emailError: 'Please enter a valid email',
      });
    } else if (!loginData?.password) {
      setErrorMessages({
        ...errorMessages,
        passwordError: 'Please enter your password',
      });
    } else {
      handleLoginApi();
    }
  };

  const handleLoginApi = async () => {
    setLoading(true);
    const formData = new FormData();
    formData?.append('email', loginData?.email);
    formData?.append('password', loginData?.password);
    formData?.append('fcm_token', '1234');

    request
      .post('login', formData)
      .then(async response => {
        const res = response?.data;
        if (res?.status == 'ok') {
          const token = res?.token;
          apiHeaders(token);
          const payload = {
            ...res,
            token: token,
          };
          dispatch(SAVE_USER_DATA(payload));
          Toast.show(res?.message, Toast.SHORT);

          // Save email and password to AsyncStorage
          await AsyncStorage.setItem('email', loginData.email);
          await AsyncStorage.setItem('password', loginData.password);

          navigation.navigate('ChooseStore');
        } else {
          Toast.show(res?.message, Toast.SHORT);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={mainContainer}>
      <View>
        <KeyboardAwareScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Image
            source={retailLogoImg}
            style={styles.imgStyle}
            resizeMode="contain"
          />
          <View style={styles.textInput}>
            <TextInputComp
              title={'Email'}
              imgSource={profileImg}
              placeholder={'Email'}
              value={loginData?.email}
              onBlur={() => setFocusEmail(false)}
              errorMessage={errorMessages?.emailError}
              keyboardType={'email-address'}
              onChangeText={text => {
                setErrorMessages(prevState => ({
                  ...prevState,
                  emailError: null,
                }));
                setLoginData(prevState => ({...prevState, email: text}));
              }}
              onFocus={e => {
                setFocusEmail(true);
                scrollRef?.current?.scrollToFocusedInput(e.target);
              }}
              inputCotainer={{
                borderWidth: focusEmail ? wp(0.3) : wp(0),
                borderColor: focusEmail ? Colors.primary : 'grey',
              }}
            />
            <TextInputComp
              secureTextEntry
              title={'Password'}
              imgSource={lockImg}
              placeholder={'Password'}
              value={loginData.password}
              inputStyle={styles.inputStyle}
              onBlur={() => setFocusPassword(false)}
              errorMessage={errorMessages?.passwordError}
              onChangeText={text => {
                setErrorMessages(prevState => ({
                  ...prevState,
                  passwordError: null,
                }));
                setLoginData(prevState => ({...prevState, password: text}));
              }}
              onFocus={e => {
                setFocusPassword(true);
                scrollRef?.current?.scrollToFocusedInput(e.target);
              }}
              inputCotainer={{
                borderWidth: focusPassword ? wp(0.3) : wp(0),
                borderColor: focusPassword ? Colors.primary : 'grey',
              }}
              mainStyling={{
                marginTop: !isMobileScreen ? hp('5%') : hp('1.5%'),
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.loginBtn}>
              <Btn
                text={'Login'}
                marginTop={windowHeight / 7}
                onPress={signin}
                fontSize={fontSize.L}
                loading={loading}
              />
            </View>
            <View style={styles.dontHaveText}>
              <Text style={styles.accountText}>Don't have an account?</Text>
              <Text
                style={styles.signUpText}
                onPress={() => navigation.navigate('Register')}>
                {' '}
                Sign up
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  forgotPassword: {
    marginTop: hp(1),
    width: wp(89),
    textDecorationLine: 'underline',
    fontSize: fontSize.S1,
    color: Colors.primary,
    fontFamily: Fonts.p_Regular,
  },
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
  },
  textInput: {
    bottom: isMobileScreen ? hp('5%') : null,
    marginTop: !isMobileScreen ? hp('8%') : null,
  },
  inputStyle: {
    width: isMobileScreen ? width * 0.7 : width * 0.75,
  },
  imgStyle: {
    width: width / 2.8,
    height: height / 2.8,
    marginTop: !isMobileScreen ? hp('5%') : null,
  },
  loginBtn: {
    marginBottom: !isMobileScreen ? hp('5%') : null,
  },
  dontHaveText: {
    marginTop: hp(1),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.primary,
    fontFamily: Fonts.p_Semibold,
    fontSize: fontSize.Normal,
  },
  accountText: {
    fontFamily: Fonts.p_Regular,
    fontSize: fontSize.S1,
    color: Colors.black,
  },
});
