# Build Setup Guide - APK, IPA & CI/CD

This guide will help you set up building APK (Android), IPA (iOS), and configure GitHub Actions CI/CD pipelines.

## Prerequisites

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Your Project
```bash
eas build:configure
```

## GitHub Actions Setup

### Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

1. **EXPO_TOKEN**: Your Expo access token
   - Go to https://expo.dev/accounts/[your-username]/settings/access-tokens
   - Create a new token
   - Add it to GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Name: `EXPO_TOKEN`

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions (no setup needed)

### Setting up GitHub Secrets
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add `EXPO_TOKEN` with your Expo access token

## Building Locally

### Android APK

**Development Build:**
```bash
eas build --platform android --profile development
```

**Preview Build (APK for testing):**
```bash
eas build --platform android --profile preview
```

**Production Build:**
```bash
eas build --platform android --profile production
```

### iOS IPA

**Development Build:**
```bash
eas build --platform ios --profile development
```

**Preview Build:**
```bash
eas build --platform ios --profile preview
```

**Production Build:**
```bash
eas build --platform ios --profile production
```

### Build Both Platforms
```bash
eas build --platform all --profile preview
```

## iOS Specific Requirements

### For iOS builds, you need:

1. **Apple Developer Account** ($99/year)
2. **App Store Connect API Key** (for automated builds)
3. **Provisioning Profile and Certificates**

EAS Build can automatically manage certificates and profiles:
```bash
eas credentials
```

## Android Specific Setup

### For production Android builds, you need:

1. **Android Keystore** (for signing APK/AAB)
   - EAS can generate this for you automatically
   - Or upload your own: `eas credentials`

2. **Google Play Console Account** ($25 one-time fee)
   - Required only if submitting to Play Store

## CI/CD Workflows

### 1. **ci.yml** - Continuous Integration
- Runs on every push and PR
- Checks code quality
- Runs Expo doctor diagnostics

### 2. **build.yml** - Build APK and IPA
- Triggers on push to main/develop branches
- Can be manually triggered with platform selection
- Builds APK and IPA using EAS Build
- Posts build status to PRs

### 3. **release.yml** - Release Build
- Triggers on version tags (e.g., v1.0.0)
- Creates production builds
- Creates GitHub release

## Triggering Builds

### Automatic Builds
Builds trigger automatically when you:
- Push to `main` or `develop` branch
- Create a pull request to `main`

### Manual Builds
1. Go to your repository on GitHub
2. Click **Actions**
3. Select **Build APK and IPA** workflow
4. Click **Run workflow**
5. Choose platform (all/android/ios)

## Creating a Release

### Option 1: Using Git Tags
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Option 2: Manual Workflow
1. Go to **Actions** → **Release Build**
2. Click **Run workflow**
3. Enter version number

## Updating app.json for Builds

Make sure your [app.json](app.json) has proper configuration:

```json
{
  "expo": {
    "name": "PWA",
    "slug": "PWA",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.pwa",
      "versionCode": 1
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.pwa",
      "buildNumber": "1.0.0"
    }
  }
}
```

## Build Profiles Explained

### Development
- For internal testing
- Includes dev tools
- Android: APK
- iOS: Simulator build

### Preview
- For testing before production
- No dev tools
- Android: APK (easy to share)
- iOS: Ad-hoc or TestFlight

### Production
- For store submission
- Optimized and minified
- Android: AAB (required for Play Store)
- iOS: IPA for App Store

## Monitoring Builds

### Via EAS Dashboard
Visit: https://expo.dev/accounts/[your-username]/projects/PWA/builds

### Via GitHub Actions
- Go to **Actions** tab in your repository
- Click on any workflow run to see logs

## Downloading Builds

### From EAS Dashboard
1. Go to https://expo.dev
2. Navigate to your project
3. Click **Builds**
4. Download APK/IPA

### Install APK on Android
1. Download APK to device
2. Enable "Install from Unknown Sources"
3. Open APK file to install

### Install IPA on iOS
1. Use TestFlight for testing
2. Or use Apple Configurator for ad-hoc builds

## Troubleshooting

### Build Fails
- Check EAS build logs for detailed errors
- Ensure all dependencies are compatible
- Verify app.json configuration

### GitHub Actions Fails
- Verify `EXPO_TOKEN` secret is set
- Check workflow logs for specific errors
- Ensure repository has proper permissions

### iOS Build Issues
- Verify Apple Developer account is active
- Check certificates and provisioning profiles
- Run `eas credentials` to manage credentials

### Android Build Issues
- Verify keystore configuration
- Check package name is unique
- Ensure all required permissions are declared

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [App Store Submission](https://docs.expo.dev/submit/ios/)
- [Play Store Submission](https://docs.expo.dev/submit/android/)

## Next Steps

1. ✅ Install EAS CLI: `npm install -g eas-cli`
2. ✅ Login: `eas login`
3. ✅ Configure project: `eas build:configure`
4. ✅ Set up GitHub secrets
5. ✅ Update app.json with package names
6. ✅ Run your first build: `eas build --platform android --profile preview`
7. ✅ Push to GitHub to trigger CI/CD

## Support

For issues or questions:
- EAS Build: https://docs.expo.dev/build/introduction/
- GitHub Issues: Create an issue in this repository
- Expo Discord: https://chat.expo.dev
