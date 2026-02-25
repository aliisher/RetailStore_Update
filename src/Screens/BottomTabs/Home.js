import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {mainContainer} from '../../Constants/StyleSheet';
import HomeHeader from '../../Components/HomeHeader';
import TextInputComp from '../../Components/TextInputComp';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import WholeSaleComp from '../../Components/WholeSaleComp';
import {defaultImage, searchImg} from '../../Assets/Index';
import {
  hp,
  isMobileScreen,
  windowHeight,
  windowWidth,
  wp,
} from '../../Constants/Responsive';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {Colors} from '../../Constants/Colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Btn from '../../Components/Btn';
import {ScrollView} from 'react-native';
import {request} from '../../Api_Services/ApiServices';
import {useRoute} from '@react-navigation/native';
import {Config} from '../../Api_Services/Config';
import {useDispatch, useSelector} from 'react-redux';
import {
  ADD_TO_RECOMMENDED_CARD,
  EMPTY_RECOMMENDED_CARD,
} from '../../Redux/Features/RecommendedCardSlice';
import Toast from 'react-native-simple-toast';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const {params} = route;
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendorsData, setVendorsdata] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    emailError: '',
  });
  const [userData, setUserData] = useState({
    email: '',
  });
  const [isEditable, setIsEditable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const [venderId, setVenderID] = useState([]);
  const user = useSelector(state => state?.AUTH?.userData);
  const store = useSelector(state => state?.AUTH?.storeData);

  useEffect(() => {
    if (isFocused) {
      getBannerData();
      getWholeSalersData();
    }
  }, [isFocused]);
  const getRecommended = async () => {
    // Step 1: Clear the recommended cart
    dispatch(EMPTY_RECOMMENDED_CARD());

    // Step 2: Fetch recommended products only if venderId exists
    if (venderId) {
      try {
        const response = await request.get(
          `recommendedProduct/${params?.store_manager_id}/${params?.store_id}/${venderId}`,
        );
        if (response?.data?.status == 'success') {
          const products = response?.data?.products;
          // Step 3: Add fetched products to the recommended cart
          products?.forEach(item => {
            const product_Detail = {
              product_id: item?.product?.id,
              product_name: item?.product?.product_name,
              image: item?.product?.product_image[0]?.product_image || '',
              price: item?.product_price,
              quantity: item?.recommended_quantity,
              store_id: item?.store_id,
              store_manager_id: item?.store_manager_id,
              vendor_id: item?.vendor?.id,
              vendor_name: item?.vendor?.vendor_name,
              invoice_number: null,
              date: null,
              discount: item?.vendor?.general_discount,
              store_name: store?.storeName,
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

  const getBannerData = async () => {
    try {
      const response = await request.get('banner');
      setBannerData(response?.data?.banners);
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
    }
  };
  const getWholeSalersData = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `wholesalers/${params?.store_manager_id}/${params?.store_id}`,
      );
      setVendorsdata(response?.data?.Vendors);
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const filterChat = userData?.email
    ? vendorsData.filter(item =>
        item?.vendor?.vendor_name
          ?.toLowerCase()
          .includes(userData?.email.toLowerCase()),
      )
    : vendorsData;

  const renderItem = ({item}) => {
    return (
      <View style={styles.bannerRow}>
        <Text
          style={{
            color: 'white',
            fontSize: wp(4),
            fontFamily: Fonts.semiBold,
            width: wp('50%'),
          }}>
          {item?.name}
        </Text>
        <Image
          source={error ? defaultImage : {uri: Config.domain + item?.image}}
          style={{
            width: wp('20%'),
            height: wp('20%'),
            marginRight: wp('2%'),
          }}
          resizeMode="contain"
          onError={() => setError(true)}
        />
      </View>
    );
  };

  const handlePress = () => {
    setIsEditable(false);
    if (!isEditable) {
      navigation?.navigate('HomeSearchResult');
    }
  };
  return (
    <SafeAreaView style={mainContainer}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <TouchableOpacity onPress={handlePress}>
          <TextInputComp
            inputCotainer={styles.textInput}
            imgSource={searchImg}
            iconName={'search'}
            placeholder={'Search Product'}
            value={userData.email}
            keyboardType={''}
            editable={isEditable}
            errorMessage={errorMessage?.degreeError}
            onChangeText={text => {
              setErrorMessage(prevState => ({
                ...prevState,
                degreeError: null,
              }));
              setUserData(prevState => ({...prevState, email: text}));
            }}
          />
        </TouchableOpacity>

        {bannerData?.length > 0 && (
          <View style={styles.topImageContainer}>
            <View style={styles.topImageSubRightContainer}>
              <Carousel
                ref={carouselRef}
                data={bannerData}
                renderItem={renderItem}
                sliderWidth={wp('90%')}
                itemWidth={wp('90%')}
                layout={'default'}
                loop={true}
                onSnapToItem={index => setActiveIndex(index)}
              />
            </View>
            <Pagination
              dotsLength={bannerData.length}
              activeDotIndex={activeIndex}
              containerStyle={styles.paginationContainer}
              dotStyle={styles.paginationDot}
              inactiveDotOpacity={0.4}
              inactiveDotStyle={[
                styles.paginationDot,
                {backgroundColor: Colors.white},
              ]}
              inactiveDotScale={0.6}
            />
          </View>
        )}

        <View style={styles.wholeSaleView}>
          <View style={styles.wholeSaleStyle}>
            <View style={styles.viewStyle}></View>
            <Text style={styles.wholeSaleText}>Wholesalers</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListView}>
          {filterChat?.length > 0 ? (
            <FlatList
              data={filterChat}
              numColumns={2}
              contentContainerStyle={styles.flatlistStyle}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => {
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
            <View style={{marginTop: hp(15)}}>
              {loading ? (
                <ActivityIndicator size={40} color={Colors.primary} />
              ) : (
                <Text style={{color: Colors.black}}>No data found</Text>
              )}
            </View>
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
                    onPress={() => {
                      navigation.navigate('Department', {vender_Id: venderId}),
                        setIsVisible(false);
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  wholeSaleStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: isMobileScreen ? hp('7%') : hp('14%'),
    bottom: hp(5),
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp('3%'),
  },
  topImageContainer: {
    width: wp('90%'),
    backgroundColor: Colors.chineseBlack,
    borderRadius: wp(2.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp('2%'),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(4),
  },
  topImageSubRightContainer: {
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.chineseBlack,
  },
  paginationContainer: {
    width: '3%',
    paddingVertical: hp(0.5),
  },
  paginationDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(2),
    backgroundColor: Colors.primary,
  },
  wholeSaleText: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    marginLeft: hp(1),
    fontSize: fontSize.S1,
  },
  viewAllText: {
    fontFamily: Fonts.medium,
    fontSize: fontSize.XS,
    color: Colors.chineseBlack,
  },
  wholeSaleView: {
    flexDirection: 'row',
    width: windowWidth * 0.9,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewStyle: {
    backgroundColor: Colors.primary,
    paddingHorizontal: isMobileScreen ? hp(0.8) : hp(1.4),
    paddingVertical: isMobileScreen ? hp(1.8) : hp(3),
    borderRadius: hp(0.3),
  },
  flatListView: {
    flex: 1,
  },
  itemContainer: {
    padding: wp(2),
  },
  flatlistStyle: {
    paddingBottom: hp(5),
    paddingTop: hp(2),
  },
  wonderStoreText: {
    color: Colors.white,
    fontFamily: Fonts.semiBold,
    fontSize: isMobileScreen ? wp('4.5%') : wp('3%'),
  },
  modalBody: {
    backgroundColor: Colors.white,
    height: isMobileScreen ? hp(30) : windowHeight * 0.3,
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
});
