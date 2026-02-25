import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Auth/Login';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import OTP from '../Screens/Auth/OTP';
import ResetPassword from '../Screens/Auth/ResetPassword';
import ChooseStore from '../Screens/AppFlow/ChooseStore';
import {useSelector} from 'react-redux';
import {apiHeaders} from '../Api_Services/ApiServices';
import Register from '../Screens/Auth/Register';

const AuthNavigation = () => {
  const userData = useSelector(state => state.AUTH?.userData);
  useEffect(() => {
    apiHeaders(userData?.token);
  }, []);

  const AUTH_STACK = createNativeStackNavigator();
  return (
    <AUTH_STACK.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={userData ? 'ChooseStore' : 'Login'}>
      <AUTH_STACK.Screen name="Login" component={Login} />
      <AUTH_STACK.Screen name="Register" component={Register} />
      <AUTH_STACK.Screen name="ForgotPassword" component={ForgotPassword} />
      <AUTH_STACK.Screen name="OTP" component={OTP} />
      <AUTH_STACK.Screen name="ResetPassword" component={ResetPassword} />
      <AUTH_STACK.Screen name="ChooseStore" component={ChooseStore} />
    </AUTH_STACK.Navigator>
  );
};

export default AuthNavigation;
