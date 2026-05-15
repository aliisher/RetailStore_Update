import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FlowNavigation from './FlowNavigation';
import AuthNavigation from './AuthNavigation';
import {Colors} from '../Constants/Colors';
import {defaultScreenOptions} from '../Constants/navigationScreenOptions';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.white,
  },
};

const MainNavigation = () => {
  const MAIN_STACK = createNativeStackNavigator();

  return (
    <NavigationContainer theme={navTheme}>
      <MAIN_STACK.Navigator screenOptions={defaultScreenOptions}>
        <MAIN_STACK.Screen name="AuthNavigation" component={AuthNavigation} />
        <MAIN_STACK.Screen name="FlowNavigation" component={FlowNavigation} />
      </MAIN_STACK.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
