import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FlowNavigation from './FlowNavigation';
import AuthNavigation from './AuthNavigation';

const MainNavigation = () => {
  const MAIN_STACK = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <MAIN_STACK.Navigator screenOptions={{headerShown: false}}>
        <MAIN_STACK.Screen name="AuthNavigation" component={AuthNavigation} />
        <MAIN_STACK.Screen name="FlowNavigation" component={FlowNavigation} />
      </MAIN_STACK.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
