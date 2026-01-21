#!/bin/bash

echo "================================================"
echo "EAS Login & Project Initialization Script"
echo "================================================"
echo ""
echo "This script will help you complete the EAS setup."
echo ""
echo "You have two options:"
echo ""
echo "1. Login with username/password:"
echo "   npx eas-cli login"
echo ""
echo "2. Use your EXPO_TOKEN (recommended for CI/CD):"
echo "   export EXPO_TOKEN='your-token-here'"
echo "   npx eas-cli whoami"
echo ""
echo "After logging in, run:"
echo "   npx eas-cli init --id"
echo ""
echo "================================================"
echo ""

# Prompt user for choice
read -p "Do you want to login now? (y/n): " choice

if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
    echo ""
    echo "Choose login method:"
    echo "1. Username/Password"
    echo "2. Use EXPO_TOKEN"
    read -p "Enter choice (1 or 2): " method
    
    if [ "$method" = "1" ]; then
        npx eas-cli login
    elif [ "$method" = "2" ]; then
        read -sp "Paste your EXPO_TOKEN: " token
        echo ""
        export EXPO_TOKEN="$token"
        npx eas-cli whoami
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Login successful!"
        echo ""
        read -p "Do you want to initialize EAS project now? (y/n): " init_choice
        if [ "$init_choice" = "y" ] || [ "$init_choice" = "Y" ]; then
            npx eas-cli init --id
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ EAS project initialized successfully!"
                echo ""
                echo "Next steps:"
                echo "1. Commit and push the changes:"
                echo "   git add ."
                echo "   git commit -m 'chore: Initialize EAS project'"
                echo "   git push"
                echo ""
                echo "2. Your GitHub Actions will automatically trigger!"
                echo "3. View build progress at: https://expo.dev"
            fi
        fi
    fi
else
    echo "Please run 'npx eas-cli login' manually when ready."
fi
