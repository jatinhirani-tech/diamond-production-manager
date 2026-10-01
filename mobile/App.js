import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DiamondProvider } from './context/DiamondContext';
import AppNavigator from './navigation/AppNavigator';
import Toast from './components/common/Toast';

export default function App() {
  return (
    <SafeAreaProvider>
      <DiamondProvider>
        <StatusBar style="dark" />
        <AppNavigator />
        <Toast />
      </DiamondProvider>
    </SafeAreaProvider>
  );
}
