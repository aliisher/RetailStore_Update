import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  hp,
  isMobileScreen,
  windowHeight,
  windowWidth,
} from '../../Constants/Responsive';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {mainContainer} from '../../Constants/StyleSheet';
import DropdownComp from '../../Components/DropdownComp';
import Btn from '../../Components/Btn';
import {fontSize} from '../../Constants/Fonts';
import {Image} from 'react-native';
import {retailLogoImg} from '../../Assets/Index';
import Header from '../../Components/Header';
import {apiHeaders, request} from '../../Api_Services/ApiServices';
import {useDispatch, useSelector} from 'react-redux';
import {STORE_DATA} from '../../Redux/Features/AuthSlice';
import Toast from 'react-native-simple-toast';

const {width, height} = Dimensions.get('window');

const ChooseStore = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [getStores, setGetStores] = useState([]);
  const [storeData, setstoreData] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    storeError: '',
  });
  const userData = useSelector(state => state.AUTH?.userData);
  useEffect(() => {
    apiHeaders(userData?.token);
  }, [userData]);

  const createStore = async () => {
    if (!storeData?.id) {
      Toast.show('Please select a store', Toast.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append('store_id', storeData?.id);

    try {
      setLoading(true);
      const response = await request.post('selectStore', formData);
      const res = response.data;
      if (res.status === 'success') {
        dispatch(
          STORE_DATA({
            store_manager_id: res?.current_store?.store_manager_id,
            store_id: res?.current_store?.store_id,
            storeName: storeData?.store_name,
            store_address: storeData?.store_address,
            store_phone_no: storeData?.store_phone_no,
          }),
        );
        navigation.navigate('FlowNavigation', {
          screen: 'Parent',
          params: {
            screen: 'BottomTabs',
            params: {
              screen: 'Home',
              params: {
                store_manager_id: res?.current_store?.store_manager_id,
                store_id: res?.current_store?.store_id,
                storeName: storeData?.store_name,
              },
            },
          },
        });
        Toast.show(res?.message, Toast?.SHORT);
      } else {
        Toast.show(res?.message, Toast?.SHORT);
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      ChooseStoreApi();
    }
  }, [isFocused]);

  const ChooseStoreApi = async () => {
    setLoading(true);
    try {
      const response = await request.get('stores');
      const res = response?.data;
      setGetStores(res?.stores);
    } catch (err) {
      console.log('Error get stories', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={mainContainer}>
      <Header
        title="Stores"
        titleStyle={styles.titleStyle}
        press={() => navigation.navigate('Login')}
      />

      <Image
        source={retailLogoImg}
        style={styles.imgStyle}
        resizeMode="contain"
      />
      <View style={styles.inputView}>
        <DropdownComp
          titleLabel={'Select a store'}
          data={getStores}
          iconName={'Safety'}
          labelField="store_name"
          valueField="store_name"
          placeholder={'Choose your store'}
          errMessage={errorMessages?.storeError}
          value={storeData?.store_name}
          dropdown={{marginTop: hp('1%')}}
          onChange={item => {
            setstoreData(item);
            setErrorMessages({
              ...errorMessages,
              storeError: null,
            });
          }}
        />
        <Btn
          text={'Continue'}
          loading={loading}
          marginTop={windowHeight / 3.5}
          onPress={createStore}
          marginBottom={windowHeight / 1}
          fontSize={fontSize.L}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChooseStore;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    marginTop: windowWidth * 0.2,
  },
  imgStyle: {
    width: width / 2.8,
    height: height / 2.8,
    bottom: isMobileScreen ? hp('3%') : null,
    marginTop: !isMobileScreen ? hp('4%') : null,
  },
  inputView: {
    bottom: isMobileScreen ? hp('6%') : null,
    marginTop: !isMobileScreen ? hp('5%') : null,
  },
});
