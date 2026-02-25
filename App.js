import { LogBox, Platform, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigation from './src/Navigation/MainNavigation';
import { Colors } from './src/Constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={Platform?.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.black}
        />
        <MainNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
