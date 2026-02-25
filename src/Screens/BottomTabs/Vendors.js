import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {mainContainer} from '../../Constants/StyleSheet';
import TextInputComp from '../../Components/TextInputComp';
import WholeSaleComp from '../../Components/WholeSaleComp';
import {searchImg} from '../../Assets/Index';
import {hp, isMobileScreen, windowWidth, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import Btn from '../../Components/Btn';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {request} from '../../Api_Services/ApiServices';
import {useDispatch, useSelector} from 'react-redux';
import {setPlaceOrderData} from '../../Redux/Features/UserData';
import {
  ADD_TO_RECOMMENDED_CARD,
  REMOVE_FROM_RECOMMENDED_CARD,
} from '../../Redux/Features/RecommendedCardSlice';
import Toast from 'react-native-simple-toast';

const Vendors = () => {
  const storeGet = useSelector(state => state.AUTH?.storeData);
  const user = useSelector(state => state?.AUTH?.userData);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [vendorsData, setVendorsdata] = useState([]);
  const [venderId, setVenderID] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    emailError: '',
  });
  const [userData, setUserData] = useState({
    email: '',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getWholeSalersData();
    }
  }, [isFocused]);
  const getWholeSalersData = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `wholesalers/${storeGet?.store_manager_id}/${storeGet?.store_id}`,
      );
      setVendorsdata(response?.data?.Vendors);
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const getRecommended = async () => {
    // Step 1: Clear the recommended cart
    dispatch(REMOVE_FROM_RECOMMENDED_CARD());

    // Step 2: Fetch recommended products only if venderId exists
    if (venderId) {
      try {
        const response = await request.get(
          `recommendedProduct/${storeGet?.store_manager_id}/${storeGet?.store_id}/${venderId}`,
        );
        if (response?.data?.status == 'success') {
          console.log(
            '@responce',
            JSON?.stringify(response?.data?.products, null, 2),
          );
          const products = response?.data?.products;
          // Step 3: Add fetched products to the recommended cart
          products?.forEach(item => {
            const product_Detail = {
              product_id: item?.product?.id,
              product_name: item?.product?.product_name,
              image: item?.product?.product_image[0].product_image,
              price: item?.product_price,
              quantity: item?.recommended_quantity,
              store_id: item?.store_id,
              store_manager_id: item?.store_manager_id,
              vendor_id: item?.vendor?.id,
              vendor_name: item?.vendor?.vendor_name,
              invoice_number: null,
              date: null,
              discount: item?.vendor?.general_discount,
              store_name: storeGet?.storeName,
              store_manager_name:
                user?.user?.first_name + ' ' + user?.user?.last_name,
            };
            dispatch(ADD_TO_RECOMMENDED_CARD(product_Detail));
          });

          // Step 4: Navigate to the recommended cart after all products are added
          setIsVisible(false);
          navigation.navigate('RecommendedCartComponent', {recommended: true});
        } else if (response?.data?.status == 'info') {
          // Step 5: Handle any errors from the API
          setIsVisible(false);
          Toast.show(response?.data?.message, Toast.SHORT);
        }
      } catch (error) {
        console.log('API request error:', error);
      }
    }
  };
  const manual = () => {
    setIsVisible(false);
    navigation.navigate('Department', {vender_Id: venderId});
  };
  const filterChat = userData?.email
    ? vendorsData.filter(item =>
        item?.vendor?.vendor_name
          ?.toLowerCase()
          .includes(userData?.email.toLowerCase()),
      )
    : vendorsData;

  return (
    <SafeAreaView style={mainContainer}>
      <Text style={styles.wholesaleText}>Wholesalers</Text>
      <TextInputComp
        inputCotainer={styles.textInput}
        imgSource={searchImg}
        iconName={'search'}
        placeholder={'Search here'}
        value={userData.email}
        keyboardType={'email-address'}
        errorMessage={errorMessage?.degreeError}
        onChangeText={text => {
          setErrorMessage(prevState => ({
            ...prevState,
            degreeError: null,
          }));
          setUserData(prevState => ({...prevState, email: text}));
        }}
      />
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading Vendors...</Text>
          </View>
        ) : filterChat?.length > 0 ? (
          <FlatList
            data={filterChat}
            numColumns={2}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  dispatch(setPlaceOrderData(item));
                  setIsVisible(true);
                  setVenderID(item?.vendor?.id);
                }}>
                <WholeSaleComp
                  imgSource={item.vendor?.image}
                  title={item?.vendor?.vendor_name}
                  overChargePrice={item?.vendor?.overcharged_prices}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{color: 'black'}}>No data found</Text>
        )}
      </View>
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.mainView}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalBody}>
                <Btn
                  text={'Recommended'}
                  // onPress={() =>
                  //   navigation.navigate('RecommendedCartComponent', {
                  //     recommended: true,
                  //   })
                  // }
                  onPress={() => {
                    // console.log('@VENDOR ID', venderId);
                    getRecommended();
                    // navigation.navigate('RecommendedCartComponent', {
                    //   vender_Id: venderId,
                    // }),
                  }}
                  fontSize={fontSize.L}
                  width={isMobileScreen ? wp(70) : windowWidth * 0.7}
                />
                <Btn
                  marginTop={hp(5)}
                  width={isMobileScreen ? wp(70) : windowWidth * 0.7}
                  text={'Manual'}
                  fontSize={fontSize.L}
                  textColor={Colors.primary}
                  backgroundColor={Colors.white}
                  onPress={manual}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Vendors;

const styles = StyleSheet.create({
  flatListView: {
    flex: 1,
  },
  itemContainer: {
    padding: wp(2),
  },
  wholesaleText: {
    marginTop: hp(3),
    color: Colors.raisinBlack,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.Normal1,
  },
  modalBody: {
    backgroundColor: Colors.white,
    height: isMobileScreen ? hp(30) : hp('45%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: isMobileScreen ? wp(5) : windowWidth * 0.05,
    borderRadius: hp(1),
    width: isMobileScreen ? wp(90) : windowWidth * 0.9,
  },
  mainView: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistStyle: {
    paddingBottom: hp(5),
    paddingTop: hp(2),
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
    textAlign: 'center',
  },
});
