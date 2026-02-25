import {Image, Linking, StyleSheet, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {
  facebookIcon,
  instagramIcon,
  logoImg,
  logoutImg,
  orderHistoryImg,
  privacyPolicyImg,
  savedOrderImg,
  termsConditionImg,
  tiktokIcon,
  twitterIcon,
  whatsappIcon,
  youtubeIcon,
} from '../Assets/Index';
import {TouchableOpacity} from 'react-native';
import {Colors} from '../Constants/Colors';
import {Text} from 'react-native';
import {Divider, Icon} from '@rneui/base';
import {hp, isMobileScreen, wp} from '../Constants/Responsive';
import {Fonts, fontSize} from '../Constants/Fonts';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {DELETE_USER_DATA} from '../Redux/Features/AuthSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setWishlistCount} from '../Redux/Features/WishliSlice';
import {EMPTY_CARD} from '../Redux/Features/CardSlice';
import {apiHeaders, request} from '../Api_Services/ApiServices';
import Toast from 'react-native-simple-toast';

const DrawerNavigation = () => {
  const disPatch = useDispatch();
  const userData = useSelector(state => state.AUTH?.userData);
  const [socialLinks, setSocialLinks] = useState({});

  const navigation = useNavigation();
  const CustomDrawerItem = props => {
    return (
      <TouchableOpacity
        style={[styles.menuItemContainer, props.itemContainer]}
        disabled={props?.indicator}
        onPress={props.onPress}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={props.icon}
            style={[styles.iconStyle, props?.iconStyle]}
            resizeMode={'contain'}
          />

          <View style={styles.labelCont}>
            <Text style={[styles.lableStyle, props?.lableStyle]}>
              {props.label}
            </Text>
            {/* {props?.count ? (
              <View style={styles.count}>
                <Text
                  style={[
                    styles.countTxt,
                    {paddingHorizontal: props?.count > 9 ? 5 : 0},
                  ]}>
                  {props?.count > 9 ? '9+' : props?.count}
                </Text>
              </View>
            ) : null} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const handleNavigation = (screen, params) => {
    navigation.navigate(screen, params);
  };
  const logout = () => {
    request
      .post('logout')
      .then(response => {
        const res = response?.data;
        if (res?.status == 'success') {
          apiHeaders(userData?.token);
          disPatch(DELETE_USER_DATA());
          disPatch(setWishlistCount(0));
          Toast.show('Logout successfully', Toast.SHORT);
          navigation.navigate('AuthNavigation', {screen: 'Login'});
          disPatch(EMPTY_CARD());
        } else {
          Toast.show(res?.message, Toast.SHORT);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    handleSocialLink();
  }, []);

  const openLink = icon => {
    const link = socialLinks[icon];
    if (link) {
      Linking.openURL(link).catch(err =>
        console.error('Failed to open link', err),
      );
    } else {
      showToast(`No link available for ${icon}.`);
    }
  };

  const showToast = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const handleSocialLink = async () => {
    try {
      const response = await request.get('social');

      if (response.data?.status === 'success') {
        const linksObject = {};
        response?.data?.social_links?.forEach(link => {
          linksObject[link.icon] = link.link;
        });
        setSocialLinks(linksObject);
      }
    } catch (error) {
      console.log('Error fetching social links', error);
    }
  };
  return (
    <DrawerContentScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}>
      <View>
        <Icon
          name="cross"
          color={Colors.white}
          size={24}
          type="entypo"
          style={{alignSelf: 'flex-end', marginRight: wp(2)}}
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
        />
        <Image
          source={logoImg}
          style={styles.imageStyle}
          resizeMode="contain"
        />
        <Divider
          orientation="horizontal"
          style={{
            borderColor: Colors.spanishGrey,
            borderWidth: wp(0.3),
            bottom: hp(-2),
          }}
        />
        <CustomDrawerItem
          icon={orderHistoryImg}
          label="My Orders"
          onPress={() => handleNavigation('MyOrder', {title: 'My Orders'})}
        />
        <CustomDrawerItem
          icon={savedOrderImg}
          label="Saved Orders"
          onPress={() =>
            handleNavigation('MyOrder', {
              title: 'Saved Orders',
              status: 'Pending',
            })
          }
        />
        <CustomDrawerItem
          icon={termsConditionImg}
          label="Terms & Conditions"
          onPress={() => navigation?.navigate('TermsAndCondition')}
        />
        <CustomDrawerItem
          icon={privacyPolicyImg}
          label="Privacy Policy"
          onPress={() => navigation?.navigate('PrivacyPolicy')}
        />
        <CustomDrawerItem
          icon={logoutImg}
          label="Logout"
          onPress={() => logout()}
        />
        <Text
          style={{
            color: Colors.white,
            fontSize: fontSize.Normal,
            fontFamily: Fonts.bold,
            paddingHorizontal: wp(5),
            marginTop: hp(8),
          }}>
          Social Links:
        </Text>
        <View
          style={{
            paddingHorizontal: isMobileScreen ? wp('5%') : wp('2%'),
          }}>
          <View style={{flexDirection: 'row'}}>
            <CustomDrawerItem
              icon={youtubeIcon}
              lableStyle={{marginLeft: wp(0)}}
              itemContainer={{paddingHorizontal: wp(3)}}
              onPress={() => openLink('Youtube')}
            />
            <CustomDrawerItem
              icon={whatsappIcon}
              lableStyle={{marginLeft: wp(0)}}
              itemContainer={{paddingHorizontal: wp(3)}}
              onPress={() => openLink('Whatsapp')}
            />
            <CustomDrawerItem
              icon={facebookIcon}
              lableStyle={{marginLeft: wp(0)}}
              itemContainer={{paddingHorizontal: wp(3)}}
              onPress={() => openLink('Facebook')}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <CustomDrawerItem
              icon={instagramIcon}
              lableStyle={{marginLeft: wp(0)}}
              itemContainer={{paddingHorizontal: wp(3)}}
              onPress={() => openLink('Instagram')}
            />
            <CustomDrawerItem
              icon={tiktokIcon}
              lableStyle={{marginLeft: wp(0)}}
              itemContainer={{paddingHorizontal: wp(3)}}
              onPress={() => openLink('Tiktok')}
            />
            <CustomDrawerItem
              icon={twitterIcon}
              lableStyle={{marginLeft: wp(0)}}
              itemContainer={{paddingHorizontal: wp(3)}}
              onPress={() => openLink('Twitter')}
            />
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginTop: hp(4),
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: hp(15),
    backgroundColor: Colors.primary,
  },
  iconStyle: {
    width: wp(6),
    height: wp(6),
    marginTop: hp(0.4),
    tintColor: Colors.white,
  },
  labelCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lableStyle: {
    fontFamily: Fonts.medium,
    color: Colors.white,
    fontSize: fontSize.M,
    marginLeft: wp(4),
  },
  imageStyle: {
    marginLeft: wp(5),
    width: wp(15),
    height: wp(15),
    // tintColor: Colors.white,
  },
});
