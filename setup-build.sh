#!/bin/bash

# Quick Start Script for Building APK/IPA

echo "🚀 PWA Build Setup Script"
echo "=========================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI is already installed"
fi

echo ""
echo "🔐 Please login to Expo:"
eas login

echo ""
echo "⚙️  Configuring EAS Build..."
eas build:configure

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update app.json with your package name:"
echo "   - Android: com.yourcompany.pwa"
echo "   - iOS: com.yourcompany.pwa"
echo ""
echo "2. Set up GitHub Secrets:"
echo "   - Get your Expo token: https://expo.dev/accounts/[username]/settings/access-tokens"
echo "   - Add it to GitHub: Settings → Secrets → EXPO_TOKEN"
echo ""
echo "3. Build your first APK:"
echo "   eas build --platform android --profile preview"
echo ""
echo "📖 For detailed instructions, see BUILD_SETUP_GUIDE.md"
