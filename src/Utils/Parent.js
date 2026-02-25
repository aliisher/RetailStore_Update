import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabs from '../Navigation/BottomtabNavigation';
import DrawerNavigation from '../Navigation/DrawerNavigation';

const Drawer = createDrawerNavigator();

const Parent = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <DrawerNavigation {...props} />}>
      <Drawer.Screen name="BottomTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
};
export default Parent;
