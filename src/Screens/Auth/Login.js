import React, { useEffect, useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInputComp from '../../Components/TextInputComp';
import Btn from '../../Components/Btn';
import { SAVE_USER_DATA } from '../../Redux/Features/AuthSlice';
import { Fonts, fontSize } from '../../Constants/Fonts';
import {
  hp,
  isMobileScreen,
  windowHeight,
  wp,
} from '../../Constants/Responsive';
import { Colors } from '../../Constants/Colors';
import { mainContainer } from '../../Constants/StyleSheet';
import { lockImg, profileImg, retailLogoImg } from '../../Assets/Index';
import Regex from '../../Constants/Regex';
import { apiHeaders, request } from '../../Api_Services/ApiServices';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const STORAGE_KEY = 'LOGIN_CREDENTIALS';
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const navigation = useNavigation();
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    emailError: null,
    passwordError: null,
  });

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const loadSavedCredentials = async () => {
  //     try {
  //       const savedEmail = await AsyncStorage.getItem('email');
  //       const savedPassword = await AsyncStorage.getItem('password');
  //       if (savedEmail && savedPassword) {
  //         setLoginData({email: savedEmail, password: savedPassword});
  //       }
  //     } catch (error) {
  //       console.log('Error loading saved credentials:', error);
  //     }
  //   };

  //   loadSavedCredentials();
  // }, []);
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedData) {
          const parsedData = JSON.parse(savedData);

          setLoginData({
            email: parsedData.email,
            password: parsedData.password,
          });

          setRememberMe(true);
        }
      } catch (error) {
        console.log('Error loading credentials:', error);
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
          if (rememberMe) {
            const dataToSave = JSON.stringify({
              email: loginData.email,
              password: loginData.password,
            });

            await AsyncStorage.setItem(STORAGE_KEY, dataToSave);
          } else {
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
          // Save email and password to AsyncStorage
          // await AsyncStorage.setItem('email', loginData.email);
          // await AsyncStorage.setItem('password', loginData.password);

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
          contentContainerStyle={styles.contentContainerStyle}
        >
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
                setLoginData(prevState => ({ ...prevState, email: text }));
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
                setLoginData(prevState => ({ ...prevState, password: text }));
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
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={styles.rememberContainer}>
                <TouchableOpacity
                  style={styles.checkboxWrapper}
                  activeOpacity={0.8}
                  onPress={() => setRememberMe(prev => !prev)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Icon name="check" size={wp(3.5)} color={Colors.white} />
                    )}
                  </View>

                  <Text style={styles.rememberText}>Remember Me</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

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
                onPress={() => navigation.navigate('Register')}
              >
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
    marginTop: hp(1.5),
    alignSelf: 'center', // center vertically with checkbox
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
  rememberContainer: {
    // width: wp(89),
    marginTop: hp(1.5),
  },

  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: wp(4.5),
    height: wp(4.5),
    borderWidth: wp(0.4),
    borderColor: Colors.primary,
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: Colors.primary,
  },

  tick: {
    color: Colors.white,
    fontSize: wp(3),
    fontFamily: Fonts.p_Semibold,
  },

  rememberText: {
    marginLeft: wp(1.5),
    fontSize: fontSize.Normal,
    fontFamily: Fonts.p_Regular,
    color: Colors.black,
  },
});
