import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MobileVerificationScreen from '../screens/MobileVerificationScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ChooseLockerScreen from '../screens/ChooseLockerScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PINSetupScreen from '../screens/PINSetupScreen';
import SuccessScreen from '../screens/SuccessScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f5f5', flex: 1 },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Locker App' }}
        />
        <Stack.Screen
          name="MobileVerification"
          component={MobileVerificationScreen}
          options={{ title: 'Mobile Verification' }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ title: 'OTP Verification' }}
        />
        <Stack.Screen
          name="ChooseLocker"
          component={ChooseLockerScreen}
          options={{ title: 'Choose Locker' }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />
        <Stack.Screen
          name="PINSetup"
          component={PINSetupScreen}
          options={{ title: 'PIN Setup' }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ title: 'Success' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
