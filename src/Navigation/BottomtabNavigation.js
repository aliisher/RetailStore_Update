import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/BottomTabs/Home';
import BottomBarComp from '../Components/BottomBarComp';
import {Colors} from '../Constants/Colors';
import Cart from '../Screens/BottomTabs/Cart';
import {
  cartFilImg,
  cartImg,
  contactFillImg,
  contactImg,
  homeFillImg,
  homeImg,
  wholesalerFilImg,
  wholesalerImg,
  wishlistFillImg,
  wishlistImg,
} from '../Assets/Index';
import {bottomStyle} from '../Components/BottomStylingComp';
import Vendors from '../Screens/BottomTabs/Vendors';
import Wishlist from '../Screens/BottomTabs/Wishlist';
import Contacts from '../Screens/BottomTabs/Contacts';
import {wp, windowWidth, isMobileScreen} from '../Constants/Responsive';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Text} from 'react-native';
import {request} from '../Api_Services/ApiServices';
import {setWishlistCount} from '../Redux/Features/WishliSlice';
import {useIsFocused} from '@react-navigation/native';

const BOTTOM_TABS = createBottomTabNavigator();

const BottomTabs = () => {
  const user = useSelector(state => state?.AUTH?.storeData);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state?.CARD?.CART || []);
  const cartLength = cartItems.length;
  const wishlistLength = useSelector(state => state?.WishliSlice?.count);

  useEffect(() => {
    if (isFocused) {
      getAllWishlistData();
    }
  }, [isFocused]);
  const getAllWishlistData = async () => {
    try {
      const response = await request.get(
        `getWishlist/${user?.store_manager_id}/${user?.store_id}`,
      );
      if (response?.status === 200) {
        dispatch(setWishlistCount(response?.data?.wishlist?.length));
      }
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
    }
  };
  return (
    <BOTTOM_TABS.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: Colors.whiteSmoke,
          height: isMobileScreen ? wp(15) : windowWidth * 0.08,
        },
      }}>
      <BOTTOM_TABS.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            const style = bottomStyle(focused);
            return (
              <BottomBarComp
                label="Home"
                textStyle={style.textStyle}
                viewStyle={style.viewStyle}
                image={focused ? homeFillImg : homeImg}
              />
            );
          },
        }}
      />
      <BOTTOM_TABS.Screen
        name="Vendors"
        component={Vendors}
        options={{
          tabBarIcon: ({focused}) => {
            const style = bottomStyle(focused);
            return (
              <BottomBarComp
                label="Wholesalers"
                textStyle={style.textStyle}
                viewStyle={style.viewStyle}
                image={focused ? wholesalerFilImg : wholesalerImg}
              />
            );
          },
        }}
      />
      <BOTTOM_TABS.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({focused}) => {
            const style = bottomStyle(focused);
            return (
              <View>
                <BottomBarComp
                  label="Cart"
                  textStyle={style.textStyle}
                  viewStyle={style.viewStyle}
                  image={focused ? cartFilImg : cartImg}
                />
                {cartLength > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.badgeText}>{cartLength}</Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <BOTTOM_TABS.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          tabBarIcon: ({focused}) => {
            const style = bottomStyle(focused);
            return (
              <View>
                <BottomBarComp
                  label="Wishlist"
                  textStyle={style.textStyle}
                  viewStyle={style.viewStyle}
                  image={focused ? wishlistFillImg : wishlistImg}
                />
                {wishlistLength > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.badgeText}>{wishlistLength}</Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <BOTTOM_TABS.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({focused}) => {
            const style = bottomStyle(focused);
            return (
              <BottomBarComp
                label="Contact"
                textStyle={style.textStyle}
                viewStyle={style.viewStyle}
                image={focused ? contactFillImg : contactImg}
              />
            );
          },
        }}
      />
    </BOTTOM_TABS.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    top: -15,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
});
