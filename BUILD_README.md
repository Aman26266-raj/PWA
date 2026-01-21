# 🏗️ Build & CI/CD Configuration

## Quick Start

Run the setup script to get started:
```bash
./setup-build.sh
```

Or follow the manual steps below.

## 📋 Prerequisites

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure Build**
   ```bash
   eas build:configure
   ```

## 🤖 GitHub Actions Workflows

### CI Workflow (`ci.yml`)
- ✅ Runs linting and code quality checks
- ✅ Runs Expo doctor diagnostics
- ✅ Triggers on every push and PR

### Build Workflow (`build.yml`)
- 🏗️ Builds Android APK
- 🏗️ Builds iOS IPA  
- 🏗️ Can be manually triggered
- 🏗️ Supports platform selection (all/android/ios)

### Release Workflow (`release.yml`)
- 🚀 Creates production builds
- 🚀 Triggers on version tags (v*)
- 🚀 Creates GitHub releases

## 📱 Building APK & IPA

### Android APK (Preview)
```bash
eas build --platform android --profile preview
```

### iOS IPA (Preview)
```bash
eas build --platform ios --profile preview
```

### Both Platforms
```bash
eas build --platform all --profile preview
```

### Production Builds
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

## 🔑 GitHub Secrets Setup

### Required Secret: EXPO_TOKEN

1. Get your token:
   - Visit: https://expo.dev/accounts/[your-username]/settings/access-tokens
   - Click "Create Token"
   - Copy the token

2. Add to GitHub:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: [paste your token]

## 🚀 Triggering Builds

### Automatic Triggers
- Push to `main` or `develop` branches
- Create pull requests to `main`
- Push version tags (e.g., `v1.0.0`)

### Manual Trigger
1. Go to **Actions** tab
2. Select **Build APK and IPA** workflow
3. Click **Run workflow**
4. Choose platform (all/android/ios)
5. Click **Run workflow** button

## 📦 Build Profiles

| Profile | Purpose | Android Output | iOS Output |
|---------|---------|----------------|------------|
| `development` | Internal dev testing | APK + dev tools | Simulator build |
| `preview` | Testing before release | APK | Ad-hoc/TestFlight |
| `production` | Store submission | AAB | IPA for App Store |

## 🔧 Configuration Files

- **eas.json** - EAS Build configuration
- **.github/workflows/ci.yml** - CI checks
- **.github/workflows/build.yml** - APK/IPA builds
- **.github/workflows/release.yml** - Production releases
- **app.json** - App configuration

## 📖 Detailed Guide

For complete setup instructions, troubleshooting, and best practices, see:
👉 [BUILD_SETUP_GUIDE.md](BUILD_SETUP_GUIDE.md)

## ⚠️ Important Notes

### Before First Build:

1. **Update Package Names** in [app.json](app.json):
   ```json
   "android": {
     "package": "com.yourcompany.pwa"
   },
   "ios": {
     "bundleIdentifier": "com.yourcompany.pwa"
   }
   ```

2. **For iOS builds**:
   - Apple Developer account required ($99/year)
   - EAS can manage certificates automatically

3. **For Android production**:
   - EAS generates keystore automatically
   - Or provide your own via `eas credentials`

## 📊 Monitoring Builds

### EAS Dashboard
https://expo.dev/accounts/[your-username]/projects/PWA/builds

### GitHub Actions
Repository → Actions tab → Select workflow run

## 🆘 Need Help?

- 📚 [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- 📚 [Detailed Guide](BUILD_SETUP_GUIDE.md)
- 🐛 Report issues in this repository
- 💬 [Expo Discord](https://chat.expo.dev)
