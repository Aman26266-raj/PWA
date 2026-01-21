# 🔄 CI/CD Workflow Diagrams

## Build & Release Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT WORKFLOW                     │
└─────────────────────────────────────────────────────────────┘

Developer                GitHub                 EAS Build          Output
    │                       │                        │              │
    │  1. Push Code         │                        │              │
    ├──────────────────────>│                        │              │
    │                       │                        │              │
    │                       │  2. Trigger CI         │              │
    │                       │  - Lint checks         │              │
    │                       │  - Expo doctor         │              │
    │                       │     ✅ Pass            │              │
    │                       │                        │              │
    │                       │  3. Trigger Build      │              │
    │                       ├───────────────────────>│              │
    │                       │                        │              │
    │                       │                        │ 4. Building  │
    │                       │                        │  - Android   │
    │                       │                        │  - iOS       │
    │                       │                        │              │
    │                       │  5. Build Complete     │              │
    │                       │<───────────────────────┤              │
    │                       │                        │              │
    │  6. Download Build    │                        │              │
    │<──────────────────────┼────────────────────────┼─────────────>│
    │                       │                        │         📦 APK/IPA
    │                       │                        │              │
    └───────────────────────┴────────────────────────┴──────────────┘
```

## GitHub Actions Workflows

### 1. CI Workflow (ci.yml)

```
Trigger: Push or PR
        │
        ▼
    Checkout Code
        │
        ▼
  Setup Node.js
        │
        ▼
Install Dependencies
        │
        ├──────> Run Linter (ESLint)
        │
        ├──────> Check Formatting (Prettier)
        │
        ├──────> Type Check (TypeScript)
        │
        └──────> Expo Doctor
                     │
                     ▼
                ✅ Success
```

### 2. Build Workflow (build.yml)

```
Trigger: Push to main/develop OR Manual
        │
        ├─────────────────┬─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
  All Platforms    Android Only       iOS Only
        │                 │                 │
        ▼                 │                 │
┌───────┴────────┐        │                 │
│                │        │                 │
▼                ▼        ▼                 ▼
Android Job    iOS Job  Android Job      iOS Job
    │              │        │                │
    ▼              ▼        ▼                ▼
Setup Expo    Setup Expo  Setup Expo    Setup Expo
    │              │        │                │
    ▼              ▼        ▼                ▼
EAS Build     EAS Build   EAS Build     EAS Build
(Android)      (iOS)      (Android)       (iOS)
    │              │        │                │
    ▼              ▼        ▼                ▼
📦 APK        📦 IPA      📦 APK          📦 IPA
```

### 3. Release Workflow (release.yml)

```
Trigger: Version Tag (v1.0.0)
        │
        ▼
    Checkout Code
        │
        ▼
  Setup Node.js & Expo
        │
        ▼
Install Dependencies
        │
        ├──────> Build Android (Production)
        │            │
        │            ▼
        │        📦 AAB for Play Store
        │
        └──────> Build iOS (Production)
                     │
                     ▼
                 📦 IPA for App Store
                     │
                     ▼
             Create GitHub Release
                     │
                     ▼
                ✅ Published
```

## Build Profiles Comparison

```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│   Profile   │  Development │   Preview    │  Production  │
├─────────────┼──────────────┼──────────────┼──────────────┤
│             │              │              │              │
│   Purpose   │ Dev Testing  │ Pre-Release  │ Store Submit │
│             │              │              │              │
├─────────────┼──────────────┼──────────────┼──────────────┤
│             │              │              │              │
│   Android   │  APK + Dev   │     APK      │     AAB      │
│             │    Tools     │              │              │
├─────────────┼──────────────┼──────────────┼──────────────┤
│             │              │              │              │
│     iOS     │  Simulator   │   Ad-hoc/    │  App Store   │
│             │    Build     │  TestFlight  │     IPA      │
│             │              │              │              │
├─────────────┼──────────────┼──────────────┼──────────────┤
│             │              │              │              │
│   Speed     │    Fast      │    Medium    │     Slow     │
│             │              │              │              │
├─────────────┼──────────────┼──────────────┼──────────────┤
│             │              │              │              │
│Optimization │     Low      │    Medium    │     High     │
│             │              │              │              │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

## Manual Build Trigger Process

```
GitHub Repository
        │
        ▼
Actions Tab
        │
        ▼
Select "Build APK and IPA" Workflow
        │
        ▼
Click "Run workflow" Button
        │
        ▼
Choose Options:
  ├─ Branch: main/develop
  └─ Platform: all/android/ios
        │
        ▼
Click "Run workflow"
        │
        ▼
Workflow Starts
        │
        ├──> Setup Environment
        │
        ├──> Install Dependencies
        │
        ├──> Trigger EAS Build
        │
        └──> Monitor Progress
                │
                ▼
        Build Complete ✅
                │
                ▼
        Download from EAS Dashboard
```

## Release Tag Process

```
Local Development
        │
        │ 1. Update version in app.json
        ▼
    git add app.json
        │
        ▼
    git commit -m "Bump version to 1.0.0"
        │
        ▼
    git tag v1.0.0
        │
        ▼
    git push origin main
        │
        ▼
    git push origin v1.0.0
        │
        ▼
GitHub Detects Tag
        │
        ▼
Trigger Release Workflow
        │
        ├──> Build Android (AAB)
        │
        ├──> Build iOS (IPA)
        │
        └──> Create GitHub Release
                │
                ▼
        Production Builds Ready 🚀
```

## Local vs Cloud Build

```
┌──────────────────────────────────────────────────────────┐
│                    LOCAL BUILD                            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Developer Machine                                        │
│       │                                                   │
│       ├─> eas build --platform android                   │
│       │                                                   │
│       └─> Triggers cloud build on EAS servers            │
│               │                                           │
│               ├─> Build on EAS infrastructure            │
│               │                                           │
│               └─> Download build artifact                 │
│                       │                                   │
│                       └─> 📦 APK/IPA                      │
│                                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   AUTOMATED CI/CD                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  GitHub Actions                                           │
│       │                                                   │
│       ├─> Triggered by push/tag                          │
│       │                                                   │
│       ├─> Runs in GitHub runner                          │
│       │                                                   │
│       └─> Triggers EAS build via API                     │
│               │                                           │
│               ├─> Build on EAS infrastructure            │
│               │                                           │
│               └─> Build artifact available on EAS        │
│                       │                                   │
│                       └─> 📦 APK/IPA (download from web) │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Credential Management Flow

```
First Build
    │
    ▼
EAS Detects Missing Credentials
    │
    ├─> Android
    │   └─> Generate Keystore Automatically
    │       └─> Store in EAS Servers ✅
    │
    └─> iOS
        └─> Prompt for Apple Developer Login
            └─> Generate Certificates & Profiles
                └─> Store in EAS Servers ✅

Subsequent Builds
    │
    ▼
Use Stored Credentials ✅
    │
    └─> Build Successfully
```

## Distribution Flow

```
Build Complete
        │
        ├──────────────────────┬──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
    Internal               TestFlight           Store Release
    Testing                (iOS Beta)           (Production)
        │                      │                      │
        ▼                      ▼                      ▼
   Download APK          Upload to             Submit to
   Share via link        TestFlight            Play Store/
        │                 Invite testers        App Store
        ▼                      │                      │
   Install on             Testers download          Review
   device directly        via TestFlight            Process
        │                      │                      │
        ▼                      ▼                      ▼
    ✅ Test               ✅ Test                 ✅ Live
```

---

## Quick Command Reference

```bash
# Setup
eas login
eas build:configure

# Build
eas build -p android --profile preview    # Android APK
eas build -p ios --profile preview        # iOS IPA
eas build --platform all --profile preview # Both

# Monitor
eas build:list                            # List all builds
eas build:view <BUILD_ID>                # View build details

# Credentials
eas credentials                          # Manage credentials
```

---

## Environment Setup

```
Prerequisites
    ├─> Node.js (v20+)
    ├─> npm or yarn
    ├─> Expo account
    ├─> GitHub account
    │
    └─> For iOS (optional):
        ├─> Apple Developer account ($99/year)
        └─> macOS (for local iOS development)
```
