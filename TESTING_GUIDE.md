# Locker Application - Testing Guide

## Application Overview
This is a cross-platform Locker Booking Application built with React Native Expo that supports Web (PWA), Android, and iOS.

## Features
1. **Home Screen**: Shows locker location, hourly rate, and available lockers
2. **Mobile Verification**: Phone number validation with proper formatting
3. **OTP Verification**: 6-digit OTP with countdown timer and resend functionality
4. **Choose Locker**: Locker selection screen (placeholder for now)

## Responsive Design
The app automatically adjusts UI for different screen sizes:
- **Small Screens** (< 768px): Mobile phones - Compact layout
- **Medium Screens** (768px - 1024px): Tablets - Larger cards, more spacing
- **Large Screens** (> 1024px): Desktops/Web - Maximum width containers, centered content

## Testing Instructions

### Testing on Web (PWA)
The app is already running at: http://localhost:8081

1. Open in browser and test at different screen sizes:
   - Mobile: Press F12 → Toggle device toolbar → Select mobile device
   - Tablet: Select iPad or other tablet device
   - Desktop: Use regular browser window

2. Test PWA capabilities:
   - Install as PWA (look for install icon in address bar)
   - Test offline mode
   - Check responsive layouts

### Testing on Android
1. Make sure you have:
   - Android Studio installed with Android SDK
   - Android emulator running OR physical Android device
   - USB debugging enabled (for physical device)

2. In terminal, press `a` or run:
   ```bash
   npm run android
   ```

3. The app will:
   - Build the development client
   - Install on your device/emulator
   - Open automatically

### Testing on iOS (Mac only)
1. Make sure you have:
   - Xcode installed
   - iOS Simulator OR physical iOS device
   - Apple Developer account (for physical device)

2. In terminal, press `i` or run:
   ```bash
   npm run ios
   ```

3. The app will:
   - Build the development client
   - Install on your simulator/device
   - Open automatically

### Using Expo Go (Quick Testing)
For quick testing without building native apps:

1. Install Expo Go app:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Scan the QR code shown in terminal with:
   - Android: Expo Go app
   - iOS: Camera app (will open in Expo Go)

## Fixed Issues

### 1. Missing react-native-gesture-handler
**Issue**: Navigation wasn't working on mobile devices
**Fix**: Added `import 'react-native-gesture-handler';` at the top of App.js

### 2. Non-responsive UI
**Issue**: UI was designed only for one screen size
**Fix**: 
- Added `useWindowDimensions` hook to all screens
- Implemented responsive styles based on screen width
- Dynamic font sizes, icon sizes, and layout adjustments

### 3. react-native-screens version mismatch
**Issue**: Version incompatibility with Expo SDK 54
**Fix**: Updated to compatible version using `npx expo install react-native-screens --fix`

## Test Checklist

### Home Screen
- [ ] Location displays correctly
- [ ] Hourly rate card shows "$2.50"
- [ ] Available lockers shows "42"
- [ ] Tapping "Available Lockers" navigates to Mobile Verification
- [ ] Download buttons are visible
- [ ] Layout adjusts for different screen sizes

### Mobile Verification Screen
- [ ] Phone icon displays
- [ ] Phone number formats as you type: (XXX) XXX-XXXX
- [ ] Validation shows error for invalid numbers
- [ ] "Send Verification Code" button navigates to OTP screen
- [ ] Terms and conditions text visible
- [ ] Responsive on all screen sizes

### OTP Verification Screen
- [ ] Mail icon displays
- [ ] 6 OTP input boxes are visible
- [ ] Auto-focus moves to next box when typing
- [ ] Backspace moves to previous box
- [ ] Countdown timer counts down from 60 seconds
- [ ] "Resend Code" button activates when timer reaches 0
- [ ] Verify button works when all 6 digits entered
- [ ] Successful verification navigates to Choose Locker
- [ ] Responsive on all screen sizes

### Cross-Platform Testing
- [ ] Works on Web (PWA)
- [ ] Works on Android device/emulator
- [ ] Works on iOS device/simulator
- [ ] Navigation works on all platforms
- [ ] Keyboard handling works on all platforms
- [ ] Touch interactions work properly

## Known Limitations
1. Choose Locker screen is a placeholder (awaiting design)
2. OTP verification is simulated (no backend integration yet)
3. Download app buttons link to store homepages (need actual app links)

## Next Steps
1. Upload screenshot of Choose Locker page design
2. Implement locker selection functionality
3. Integrate with backend API
4. Add real OTP verification
5. Deploy as PWA and publish to app stores
