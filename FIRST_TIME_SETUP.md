# ✅ First-Time Setup Checklist

Follow these steps in order to set up APK/IPA builds and CI/CD for your project.

## Step 1: Install EAS CLI ⚙️

```bash
npm install -g eas-cli
```

**Verify installation:**
```bash
eas --version
```

---

## Step 2: Login to Expo 🔐

```bash
eas login
```

Enter your Expo account credentials. If you don't have an account:
- Create one at: https://expo.dev/signup

---

## Step 3: Update App Configuration 📝

Edit `app.json` and replace package names with your unique identifiers:

```json
{
  "expo": {
    "android": {
      "package": "com.keub.pwa"  // ← Changed
    },
    "ios": {
      "bundleIdentifier": "com.keub.pwa"  // ← Changed
    }
  }
}
```

**Package name rules:**
- Use reverse domain notation (com.company.appname)
- Only lowercase letters, numbers, and periods
- Must be unique (check Google Play & App Store)

---

## Step 4: Configure EAS Build 🏗️

```bash
eas build:configure
```

This will:
- Create/update `eas.json` (already done ✅)
- Link your project to Expo
- Set up build profiles

---

## Step 5: Set Up GitHub Secrets 🔑

### 5.1 Get Your Expo Access Token

1. Go to: https://expo.dev/settings/access-tokens
2. Click **"Create Token"**
3. Name it: `GitHub Actions`
4. Copy the token

### 5.2 Add Token to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `EXPO_TOKEN`
5. Value: [paste the token you copied]
6. Click **"Add secret"**

---

## Step 6: Test Local Build 🧪

### Build Android APK (Recommended for first test)

```bash
eas build --platform android --profile preview
```

**What happens:**
- EAS creates a build in the cloud
- You'll see a URL to monitor progress
- Takes ~10-15 minutes for first build
- Download APK when complete

### Build iOS (requires Apple Developer account)

```bash
eas build --platform ios --profile preview
```

**Note:** iOS builds require:
- Apple Developer account ($99/year)
- EAS will help set up certificates

---

## Step 7: Push to GitHub 📤

```bash
git add .
git commit -m "Add build configuration and CI/CD pipelines"
git push origin main
```

**What happens:**
- GitHub Actions CI workflow runs automatically
- Checks code quality
- You can see progress in the **Actions** tab

---

## Step 8: Trigger GitHub Actions Build 🤖

### Option A: Push Code (Automatic)
Already done in Step 7! Builds trigger on push to `main` or `develop`.

### Option B: Manual Trigger
1. Go to **Actions** tab on GitHub
2. Select **"Build APK and IPA"** workflow
3. Click **"Run workflow"**
4. Choose platform:
   - `all` - Build both Android and iOS
   - `android` - Android only
   - `ios` - iOS only
5. Click **"Run workflow"** button

---

## Step 9: Monitor Your Build 📊

### On EAS Dashboard
1. Go to: https://expo.dev
2. Navigate to your project
3. Click **"Builds"**
4. See real-time progress

### On GitHub
1. Go to **Actions** tab
2. Click on the running workflow
3. See detailed logs

---

## Step 10: Download & Test 📲

### For Android APK:
1. Build completes → Download APK from EAS dashboard
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Open APK to install
5. Test your app!

### For iOS IPA:
1. Use TestFlight for distribution
2. Or use ad-hoc installation via Apple Configurator

---

## 🎉 Success! What's Next?

### Regular Development Workflow:
1. Make code changes
2. Push to GitHub
3. CI checks run automatically
4. Builds trigger on push to main/develop
5. Monitor builds on EAS dashboard
6. Download and test

### Create a Release:
```bash
# Update version in app.json first!
git tag v1.0.0
git push origin v1.0.0
```

This triggers the **Release** workflow for production builds.

---

## 🆘 Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "You are not logged in"
```bash
eas login
```

### "Build failed with credentials error"
```bash
eas credentials
# Follow prompts to set up certificates
```

### GitHub Action fails with "Invalid token"
- Verify EXPO_TOKEN secret is set correctly in GitHub
- Token might be expired - create a new one

### "Package name already exists"
- Change package name in app.json to something unique
- Check Google Play: https://play.google.com/store/apps/details?id=YOUR_PACKAGE
- Check App Store Connect

---

## 📚 Resources

- 📖 [Detailed Setup Guide](BUILD_SETUP_GUIDE.md)
- 📖 [Quick Reference](BUILD_QUICK_REFERENCE.md)
- 📖 [Build README](BUILD_README.md)
- 🔗 [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- 🔗 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 💬 [Expo Discord](https://chat.expo.dev)

---

## ✅ Checklist Summary

- [ ] Installed EAS CLI
- [ ] Logged into Expo account
- [ ] Updated package names in app.json
- [ ] Ran `eas build:configure`
- [ ] Created Expo access token
- [ ] Added EXPO_TOKEN to GitHub secrets
- [ ] Tested local build (Android APK)
- [ ] Pushed code to GitHub
- [ ] Verified CI workflow runs
- [ ] Triggered build via GitHub Actions
- [ ] Downloaded and tested APK

**Once all checked, you're ready to build! 🚀**
