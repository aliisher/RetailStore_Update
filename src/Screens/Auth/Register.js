import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import TextInputComp from '../../Components/TextInputComp';
import { mainContainer } from '../../Constants/StyleSheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import {
  email,
  gps,
  home_Bar,
  phone_Number,
  ptcl_phone,
  recommended_icon,
  shop,
  user,
} from '../../Assets/Index';
import { Colors } from '../../Constants/Colors';
import {
  hp,
  isMobileScreen,
  windowHeight,
  wp,
} from '../../Constants/Responsive';
import { Fonts, fontSize } from '../../Constants/Fonts';
import Btn from '../../Components/Btn';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../../Components/Header';
import CheckBox from 'react-native-check-box';
import { RequestGalleryPermission } from '../../Permissions/GalleryRequest';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { apiHeaders, request } from '../../Api_Services/ApiServices';
import { useDispatch } from 'react-redux';
import { SAVE_USER_DATA } from '../../Redux/Features/AuthSlice';

const { width, height } = Dimensions.get('window');
const Register = () => {
  const phonePattern = /^\+1[0-9]{10}$/; // Matches +1 followed by exactly 10 digits

  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [focusFirstName, setFocusFirstName] = useState(false);
  const [focusLastName, setFocusLastName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPhoneNumber, setFocusPhoneNumber] = useState(false);
  const [focusAddress, setFocusAddress] = useState(false);
  const [focusStoreName, setFocusStoreName] = useState(false);
  const [focusStoreAddress, setFocusStoreAddress] = useState(false);
  const [focusStorePhoneNumber, setFocusStorePhoneNumber] = useState(false);
  const [focusRecommendedBy, setFocusRecommendedBy] = useState(false);

  const [register, setRegister] = useState({
    image: '',
    f_Name: '',
    l_Name: '',
    email: '',
    phone_Number: '',
    address: '',
    store_Name: '',
    store_Address: '',
    store_Phone_Number: '',
    recommended_By: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    f_NameError: null,
    l_NameError: null,
    emailError: null,
    phone_Number_Error: null,
    address_Error: null,
    store_Name_Error: null,
    store_Address_Error: null,
    store_Phone_Number_Error: null,
    recommended_By_Error: null,
  });
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState('');

  const selectDocument = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1, // single image
      },
      response => {
        if (response?.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setShowImage({
            name: asset.fileName || `temp_image_${Date.now()}.jpg`,
            type: asset.type,
            uri: asset.uri,
          });
        }
      },
    );
  };
  const validateForm = () => {
    const errors = {};

    if (!register.f_Name) {
      errors.f_NameError = 'First name is required.';
    }

    if (!register.l_Name) {
      errors.l_NameError = 'Last name is required.';
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!register.email) {
      errors.emailError = 'Email is required.';
    } else if (!emailPattern.test(register.email)) {
      errors.emailError = 'Please enter a valid email address.';
    }

    if (!register.phone_Number) {
      errors.phone_Number_Error = 'Phone number is required.';
    } else if (!phonePattern.test(register.phone_Number)) {
      errors.phone_Number_Error =
        'Please enter a valid phone number with country code.';
    }

    if (!register.address) {
      errors.address_Error = 'Address is required.';
    }

    if (!register.store_Name) {
      errors.store_Name_Error = 'Store name is required.';
    }

    if (!register.store_Address) {
      errors.store_Address_Error = 'Store address is required.';
    }

    if (!register.store_Phone_Number) {
      errors.store_Phone_Number_Error = 'Store phone number is required.';
    } else if (!phonePattern.test(register.store_Phone_Number)) {
      errors.store_Phone_Number_Error =
        'Please enter a valid store phone number.';
    }

    if (!register.recommended_By) {
      errors.recommended_By_Error = 'Recommended by field is required.';
    }

    setErrorMessages(errors);

    const isFormValid = Object.values(errors).every(
      error => error === null || error === undefined,
    );

    return isFormValid;
  };
  const handleSubmit = () => {
    const isValid = validateForm();
    if (!isChecked) {
      Toast.show(
        'Please agree privacy policy and Terms and conditions',
        Toast.SHORT,
      );
    }
    if (isValid && isChecked) {
      handleRegister();
      console.log('Form is valid. Proceed with registration.');
    } else {
      console.log('Form contains errors. Please fix them.');
    }
  };
  const handleRegister = () => {
    setLoading(true);
    const formData = new FormData();
    formData?.append('first_name', register?.f_Name);
    formData?.append('image', showImage);
    formData?.append('last_name', register?.l_Name);
    formData?.append('email', register?.email);
    formData?.append('phone', register?.phone_Number);
    formData?.append('address', register?.address);
    formData?.append('store_name', register?.store_Name);
    formData?.append('store_address', register?.store_Address);
    formData?.append('store_phone_no', register?.store_Phone_Number);
    formData?.append('recommendendBy', register?.recommended_By);
    request
      .post('managerSignup', formData)
      .then(response => {
        if (response?.status == 200) {
          setLoading(false);
          const res = response?.data;
          Toast.show(res?.message, Toast.SHORT);
          navigation.navigate('Login');
        }
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };
  const handlePhoneNumberChange = text => {
    if (!text.startsWith('+1')) text = '+1';
    setRegister(prev => ({ ...prev, phone_Number: text }));
    setErrorMessages(prev => ({ ...prev, phone_Number_Error: null })); // Clear errors
  };
  const handleStorePhoneNumberChange = text => {
    if (!text.startsWith('+1')) text = '+1';
    setRegister(prev => ({ ...prev, store_Phone_Number: text }));
    setErrorMessages(prev => ({ ...prev, store_Phone_Number_Error: null })); // Clear errors
  };

  return (
    <SafeAreaView style={mainContainer}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Header title={'Create Account'} onPress={() => navigation.goBack()} />

        <View style={styles.box2B}>
          <View style={styles.box2Bchild}>
            <Image
              source={
                showImage?.uri
                  ? { uri: showImage.uri }
                  : require('../../Assets/Images/person.png')
              }
              style={styles.box2Image}
            />

            <TouchableOpacity
              style={styles.box2Icon}
              onPress={() => selectDocument()}
            >
              <Icon name="camera" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.box2BText}>
            Insert Profile Image{' '}
            <Text style={{ fontSize: fontSize.XXS }}>(Optional)</Text>
          </Text>
        </View>

        <View style={styles.textInput}>
          <TextInputComp
            title={'First Name'}
            imgSource={user}
            imgStyle={{
              tintColor: Colors?.spanishGrey,
              width: wp(6),
            }}
            placeholder={'First Name'}
            value={register?.f_Name}
            onBlur={() => setFocusFirstName(false)}
            errorMessage={errorMessages?.f_NameError}
            keyboardType={'default'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                f_NameError: null,
              }));
              setRegister(prevState => ({ ...prevState, f_Name: text }));
            }}
            onFocus={e => {
              setFocusFirstName(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            inputCotainer={{
              borderWidth: focusFirstName ? wp(0.3) : wp(0),
              borderColor: focusFirstName ? Colors.primary : 'grey',
            }}
          />
          <TextInputComp
            title={'Last Name'}
            imgSource={user}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(6) }}
            placeholder={'Last Name'}
            value={register?.l_Name}
            onBlur={() => setFocusLastName(false)}
            errorMessage={errorMessages?.l_NameError}
            keyboardType={'default'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                l_NameError: null,
              }));
              setRegister(prevState => ({ ...prevState, l_Name: text }));
            }}
            onFocus={e => {
              setFocusLastName(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            inputCotainer={{
              borderWidth: focusLastName ? wp(0.3) : wp(0),
              borderColor: focusLastName ? Colors.primary : 'grey',
            }}
          />
          <TextInputComp
            title={'Email'}
            imgSource={email}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(5) }}
            placeholder={'Email'}
            value={register?.email}
            onBlur={() => setFocusEmail(false)}
            errorMessage={errorMessages?.emailError}
            keyboardType={'email-address'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                emailError: null,
              }));
              setRegister(prevState => ({ ...prevState, email: text }));
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
            title="Phone Number"
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(3) }}
            imgSource={phone_Number}
            placeholder="Phone Number"
            value={register?.phone_Number || '+1'}
            keyboardType="numeric"
            onBlur={() => {
              const isValid = phonePattern.test(register?.phone_Number);
              setErrorMessages(prev => ({
                ...prev,
                phone_Number_Error: isValid
                  ? null
                  : 'Please enter a valid phone number with country code.',
              }));
            }}
            onFocus={e => {
              setFocusPhoneNumber(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            onChangeText={handlePhoneNumberChange}
            errorMessage={errorMessages?.phone_Number_Error}
            inputCotainer={{
              borderWidth: focusPhoneNumber ? wp(0.3) : wp(0),
              borderColor: focusPhoneNumber ? Colors.primary : 'grey',
            }}
          />

          <TextInputComp
            title={'Address'}
            imgSource={home_Bar}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(5) }}
            placeholder={'Address'}
            value={register?.address}
            onBlur={() => setFocusAddress(false)}
            errorMessage={errorMessages?.address_Error}
            keyboardType={'default'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                address_Error: null,
              }));
              setRegister(prevState => ({ ...prevState, address: text }));
            }}
            onFocus={e => {
              setFocusAddress(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            inputCotainer={{
              borderWidth: focusAddress ? wp(0.3) : wp(0),
              borderColor: focusAddress ? Colors.primary : 'grey',
            }}
          />
          <TextInputComp
            title={'Store Name'}
            imgSource={shop}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(6) }}
            placeholder={'Store Name'}
            value={register?.store_Name}
            onBlur={() => setFocusStoreName(false)}
            errorMessage={errorMessages?.store_Name_Error}
            keyboardType={'default'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                store_Name_Error: null,
              }));
              setRegister(prevState => ({ ...prevState, store_Name: text }));
            }}
            onFocus={e => {
              setFocusStoreName(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            inputCotainer={{
              borderWidth: focusStoreName ? wp(0.3) : wp(0),
              borderColor: focusStoreName ? Colors.primary : 'grey',
            }}
          />
          <TextInputComp
            title={'Store Address'}
            imgSource={gps}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(6) }}
            placeholder={'Store Address'}
            value={register?.store_Address}
            onBlur={() => setFocusStoreAddress(false)}
            errorMessage={errorMessages?.store_Address_Error}
            keyboardType={'default'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                store_Address_Error: null,
              }));
              setRegister(prevState => ({ ...prevState, store_Address: text }));
            }}
            onFocus={e => {
              setFocusStoreAddress(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            inputCotainer={{
              borderWidth: focusStoreAddress ? wp(0.3) : wp(0),
              borderColor: focusStoreAddress ? Colors.primary : 'grey',
            }}
          />
          <TextInputComp
            title={'Store Phone Number'}
            imgSource={ptcl_phone}
            placeholder={'Store Phone Number'}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(6) }}
            value={register?.store_Phone_Number || '+1'}
            onBlur={() => {
              const isValid = phonePattern.test(register?.store_Phone_Number);
              setErrorMessages(prev => ({
                ...prev,
                store_Phone_Number_Error: isValid
                  ? null
                  : 'Please enter a valid phone number with country code.',
              }));
            }}
            errorMessage={errorMessages?.store_Phone_Number_Error}
            keyboardType={'numeric'}
            onChangeText={handleStorePhoneNumberChange}
            inputContainer={{
              borderWidth: focusStorePhoneNumber ? wp(0.3) : wp(0),
              borderColor: focusStorePhoneNumber ? Colors.primary : 'grey',
            }}
          />

          <TextInputComp
            title={'Recommended By'}
            imgSource={recommended_icon}
            imgStyle={{ tintColor: Colors?.spanishGrey, width: wp(6) }}
            placeholder={'Recommended By'}
            value={register?.recommended_By}
            onBlur={() => setFocusRecommendedBy(false)}
            errorMessage={errorMessages?.recommended_By_Error}
            keyboardType={'default'}
            onChangeText={text => {
              setErrorMessages(prevState => ({
                ...prevState,
                recommended_By_Error: null,
              }));
              setRegister(prevState => ({
                ...prevState,
                recommended_By: text,
              }));
            }}
            onFocus={e => {
              setFocusRecommendedBy(true);
              scrollRef?.current?.scrollToFocusedInput(e.target);
            }}
            inputCotainer={{
              borderWidth: focusRecommendedBy ? wp(0.3) : wp(0),
              borderColor: focusRecommendedBy ? Colors.primary : 'grey',
            }}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              isChecked={isChecked}
              onClick={() => setIsChecked(!isChecked)}
              checkedCheckBoxColor={Colors.primary}
              uncheckedCheckBoxColor={Colors.spanishGrey}
            />
            <Text style={styles.checkboxText}>
              I Agree to{' '}
              <Text
                onPress={() =>
                  navigation.navigate('FlowNavigation', {
                    screen: 'PrivacyPolicy',
                  })
                }
                style={{
                  color: Colors.primary,
                  textDecorationLine: 'underline',
                }}
              >
                {' Privacy Policy '}
              </Text>
              &{' '}
              <Text
                onPress={() =>
                  navigation.navigate('FlowNavigation', {
                    screen: 'TermsAndCondition',
                  })
                }
                style={{
                  color: Colors.primary,
                  textDecorationLine: 'underline',
                }}
              >
                {' Terms and Conditions'}
              </Text>
              .
            </Text>
          </View>
          <View style={styles.loginBtn}>
            <Btn
              text={'Sign Up'}
              marginTop={windowHeight / 10}
              onPress={() => handleSubmit()}
              fontSize={fontSize.L}
              loading={loading}
            />
          </View>
          <View style={styles.accountView}>
            <Text style={styles.haveAccountText}>
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                // disabled={loginIndicatior}
                style={styles.login}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  accountView: {
    marginTop: hp(1),
    alignItems: 'center',
  },
  registerView: {
    alignItems: 'center',
    marginTop: hp(8),
  },
  haveAccountText: {
    fontSize: fontSize.S,
    color: Colors.black,
    fontFamily: Fonts.p_Regular,
  },
  login: {
    color: Colors.primary,
    fontFamily: Fonts.p_Medium,
    fontSize: fontSize.M,
  },
  box2B: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(6),
    marginTop: hp(4),
  },
  box2Bchild: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  box2Image: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    borderWidth: wp(0.5),
    borderColor: Colors.primary,
  },
  box2Icon: {
    position: 'absolute',
    right: wp(-2),
    top: hp(8),
  },
  box2BText: {
    fontFamily: Fonts.medium,
    fontSize: fontSize.M,
    color: Colors.black,
    top: hp(1),
  },
  box2Line: {
    width: wp(25),
    height: hp(0.5),
    backgroundColor: Colors.darkBlack,
    marginVertical: wp(3),
    marginBottom: wp(10),
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
    marginTop: !isMobileScreen ? hp('8%') : hp('3%'),
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
  checkboxContainer: {
    marginTop: hp(2),
    width: wp(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontFamily: Fonts.p_Semibold,
    color: Colors.black,
    fontSize: fontSize.XS,
    paddingLeft: wp(1.5),
    letterSpacing: 0.5,
  },
});
