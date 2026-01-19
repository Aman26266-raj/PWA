# How to Restore Navigation

Currently, the app is showing the ChooseLockerScreen directly for testing purposes.

## To Restore Full Navigation Flow:

Open [`App.js`](App.js) and replace the content with:

```javascript
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}
```

This will restore the full navigation flow:
1. Home Screen → Mobile Verification → OTP → Choose Locker

## Current Direct View Setup:

The current setup in [`App.js`](App.js) is:
```javascript
import ChooseLockerScreen from './src/screens/ChooseLockerScreen';

export default function App() {
  return (
    <>
      <ChooseLockerScreen navigation={{ goBack: () => console.log('Go back') }} />
      <StatusBar style="light" />
    </>
  );
}
```

This allows direct testing of the ChooseLockerScreen without going through the previous screens.
