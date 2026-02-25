import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Department from '../Screens/AppFlow/Department';
import Products from '../Screens/AppFlow/Products';
import ProductDetail from '../Screens/AppFlow/ProductDetail';
import RecommendedCartComponent from '../Components/RecommendedCartComponent';
import InvoicePrint from '../Screens/AppFlow/InvoicePrint';
import InVoice from '../Screens/AppFlow/InVoice';
import MyOrder from '../Screens/AppFlow/MyOrder';
import ReOrder from '../Screens/AppFlow/ReOrder';
import Parent from '../Utils/Parent';
import OtherWholeSalerPrice from '../Screens/AppFlow/OtherWholeSalerPrice';
import TermsAndCondition from '../Screens/AppFlow/TermsAndCondition';
import PrivacyPolicy from '../Screens/AppFlow/PrivacyPolicy';
import HomeSearchResult from '../Screens/AppFlow/HomeSearchResult';
import RecommendedWishList from '../Screens/AppFlow/RecommendedWishList';

const FlowNavigation = () => {
  const FLOW_STACK = createNativeStackNavigator();
  return (
    <FLOW_STACK.Navigator screenOptions={{headerShown: false}}>
      <FLOW_STACK.Screen name="Parent" component={Parent} />
      <FLOW_STACK.Screen name="Department" component={Department} />
      <FLOW_STACK.Screen name="Products" component={Products} />
      <FLOW_STACK.Screen name="ProductDetail" component={ProductDetail} />
      <FLOW_STACK.Screen
        name="RecommendedCartComponent"
        component={RecommendedCartComponent}
      />
      <FLOW_STACK.Screen name="InvoicePrint" component={InvoicePrint} />
      <FLOW_STACK.Screen name="InVoice" component={InVoice} />
      <FLOW_STACK.Screen name="MyOrder" component={MyOrder} />
      <FLOW_STACK.Screen name="ReOrder" component={ReOrder} />
      <FLOW_STACK.Screen
        name="OtherWholeSalerPrice"
        component={OtherWholeSalerPrice}
      />
      <FLOW_STACK.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
      />
      <FLOW_STACK.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <FLOW_STACK.Screen name="HomeSearchResult" component={HomeSearchResult} />
      <FLOW_STACK.Screen
        name="RecommendedWishList"
        component={RecommendedWishList}
      />
    </FLOW_STACK.Navigator>
  );
};

export default FlowNavigation;
