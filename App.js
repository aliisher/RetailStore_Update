import { LogBox, Platform, StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigation from './src/Navigation/MainNavigation';
import { Colors } from './src/Constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider style={styles.root}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Platform.OS === 'android' ? Colors.white : undefined}
          translucent={Platform.OS === 'android' ? false : undefined}
        />
        <View style={styles.app}>
          <MainNavigation />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  app: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default App;
