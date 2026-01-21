# 🚀 Quick Reference - Build Commands

## Essential Commands

### Setup
```bash
npm install -g eas-cli          # Install EAS CLI
eas login                        # Login to Expo
eas build:configure             # Configure project
```

### Build Commands
```bash
# Android
eas build -p android --profile preview      # Build APK for testing
eas build -p android --profile production   # Build for Play Store

# iOS
eas build -p ios --profile preview          # Build IPA for testing
eas build -p ios --profile production       # Build for App Store

# Both platforms
eas build --platform all --profile preview
```

### Check Build Status
```bash
eas build:list                   # List all builds
eas build:view [BUILD_ID]       # View specific build details
```

### Credentials Management
```bash
eas credentials                  # Manage certificates & keys
eas credentials -p android      # Android keystore
eas credentials -p ios          # iOS certificates
```

## GitHub Actions

### Manual Trigger
1. Go to **Actions** tab on GitHub
2. Select **Build APK and IPA**
3. Click **Run workflow**
4. Choose platform
5. Run

### Release via Tag
```bash
git tag v1.0.0
git push origin v1.0.0
```

## File Structure
```
.
├── eas.json                           # EAS Build config
├── app.json                           # App configuration
├── .github/workflows/
│   ├── ci.yml                        # CI checks
│   ├── build.yml                     # Build APK/IPA
│   └── release.yml                   # Production release
├── BUILD_SETUP_GUIDE.md              # Detailed guide
├── BUILD_README.md                   # Quick overview
└── setup-build.sh                    # Setup script
```

## Common Issues & Fixes

### Build fails with "Invalid credentials"
```bash
eas credentials
# Select platform and re-configure
```

### GitHub Action fails
- Check: Repository → Settings → Secrets → EXPO_TOKEN is set
- Get token: https://expo.dev/settings/access-tokens

### iOS build requires Apple Developer
- Sign up at: https://developer.apple.com ($99/year)
- EAS will guide you through certificate setup

### Package name conflicts
Update in app.json:
```json
"android": {
  "package": "com.yourcompany.uniquename"
},
"ios": {
  "bundleIdentifier": "com.yourcompany.uniquename"
}
```

## URLs

- **EAS Dashboard**: https://expo.dev/accounts/[username]/projects/PWA
- **Get Access Token**: https://expo.dev/settings/access-tokens
- **Documentation**: https://docs.expo.dev/build/introduction/

## Build Profiles

| Profile | Use Case | Android | iOS |
|---------|----------|---------|-----|
| development | Dev testing | APK | Simulator |
| preview | Pre-release testing | APK | TestFlight |
| production | Store release | AAB | App Store |

## Tips

✅ Always test with `preview` profile before `production`  
✅ Use GitHub Actions for automated builds  
✅ Monitor builds at expo.dev  
✅ Keep EXPO_TOKEN secret safe  
✅ Update version in app.json before each release
