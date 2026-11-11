<div align="center">
  <img src="./assets/icons/logo.png" alt="Recurrly Logo" width="84" height="84" />
  <h1>Recurrly</h1>
  <p><strong>Smart, streamlined subscription & recurring expense tracker for iOS, Android, and Web.</strong></p>

  <p>
    <a href="https://docs.expo.dev/versions/v54.0.0/"><img src="https://img.shields.io/badge/Expo-v54.0-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK" /></a>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-v0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-v5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://www.nativewind.dev/"><img src="https://img.shields.io/badge/NativeWind-v5-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" /></a>
    <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" /></a>
    <a href="https://posthog.com/"><img src="https://img.shields.io/badge/PostHog-Analytics-1D1F20?style=for-the-badge&logo=posthog&logoColor=white" alt="PostHog" /></a>
  </p>
</div>

---

## 📌 Overview

**Recurrly** is a modern mobile application designed to help users track, organize, and optimize recurring expenses and subscriptions. Built on the **Expo SDK 54** platform with **React Native 0.81 (New Architecture)**, Recurrly provides an intuitive, high-performance interface for viewing ongoing commitments, monitoring renewal deadlines, and managing recurring budgets across devices.

---

## ✨ Features

- 💳 **Centralized Subscription Dashboard**: Monitor active recurring services with clear cost indicators, billing frequencies (Weekly, Monthly, Yearly), and payment categories.
- ⏱️ **Upcoming Renewals Tracker**: Stay informed about approaching payment dates to avoid unexpected subscription renewals.
- ➕ **Custom Subscription Creation**: Easily add and organize new subscriptions with custom naming, pricing tiers, payment dates, and color-coded tags.
- 🔍 **Instant Search & Category Filtering**: Quickly discover subscriptions by keyword or filter by custom categories (Entertainment, AI Tools, Developer Tools, Design, Productivity, Cloud, etc.).
- 🔐 **Secure Authentication**: Frictionless user sign-up and sign-in powered by **Clerk Expo**, with session persistence backed by **Expo SecureStore**.
- 📊 **Product Analytics & Telemetry**: Privacy-conscious event capturing and crash-resilient session tracking powered by **PostHog**.
- 🎨 **Sleek Mobile UI**: Crafted with **NativeWind** (Tailwind CSS v4) and custom **Plus Jakarta Sans** typography for an elegant, fluid experience.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) | Modern React Native toolchain with New Architecture enabled |
| **Core Runtime** | [React Native 0.81](https://reactnative.dev/) & [React 19](https://react.dev/) | Cross-platform runtime and UI primitives |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) | Type-safe, file-based routing and nested layout system |
| **Styling** | [NativeWind](https://www.nativewind.dev/) & [Tailwind CSS v4](https://tailwindcss.com/) | Mobile-optimized utility classes and responsive layouts |
| **Authentication** | [Clerk Expo](https://clerk.com/docs) & [Expo SecureStore](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/) | Authentication state and encrypted token cache storage |
| **Analytics** | [PostHog React Native](https://posthog.com/docs/libraries/react-native) | Event tracking, user attribution, and error boundaries |
| **Typography** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Clean, geometric sans-serif typeface configured via `expo-font` |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict static typing and enhanced developer experience |

---

## 📂 Project Structure

```
react_native-recurrly/
├── app/                        # Expo Router pages & layouts
│   ├── (auth)/                 # Authentication screens (SignIn, SignUp)
│   ├── (tabs)/                 # Bottom tab screens (Home, Subscriptions, Insights, Settings)
│   ├── subscriptions/          # Dynamic subscription routes ([id].tsx)
│   ├── onboarding.tsx          # First-time onboarding screen
│   └── _layout.tsx             # Root layout with Clerk & PostHog providers
├── assets/                     # Application assets
│   ├── fonts/                  # Custom Plus Jakarta Sans font weights
│   ├── icons/                  # High-density service and navigation icons
│   └── images/                 # App icon, splash screen, and branding assets
├── components/                 # Shared UI components
│   ├── CreateSubscriptionModal.tsx
│   ├── SubscriptionCard.tsx
│   ├── UpcomingSubscriptionCard.tsx
│   └── ListHeading.tsx
├── constants/                  # Color schemes, theme config, and mock datasets
├── context/                    # State management (SubscriptionsContext)
├── lib/                        # Service wrappers & utility helpers
│   ├── posthog.ts              # PostHog client initialization
│   └── utils.ts                # Currency & date formatters
└── package.json                # Project dependencies and script definitions
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your environment:

- **Node.js**: `>= 18.x` (LTS recommended)
- **Package Manager**: `npm`, `yarn`, or `pnpm`
- **Expo Go** app on your physical mobile device, or a configured **Android Emulator** / **iOS Simulator**

### 1. Clone the Repository

```bash
git clone https://github.com/CodeZen24/react-native-recurrly.git
cd react-native-recurrly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Populate the required environment variables:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# PostHog Analytics
EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_your_posthog_token_here
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 4. Start the Application

Launch the Expo development server:

```bash
npx expo start
```

In your terminal, use the interactive shortcuts:
- Press <kbd>a</kbd> to open in an **Android Emulator**
- Press <kbd>i</kbd> to open in an **iOS Simulator**
- Press <kbd>w</kbd> to open in a **Web Browser**
- Scan the printed QR code using the **Expo Go** app on your phone

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run start` | Boots the Expo Metro bundler and interactive CLI |
| `npm run android` | Launches the app in the Android Emulator |
| `npm run ios` | Launches the app in the iOS Simulator (macOS only) |
| `npm run web` | Serves the project via Webpack/Metro for browser preview |
| `npm run lint` | Runs ESLint to check for linting errors |
| `npm run reset-project` | Resets the project boilerplate (Expo template helper) |

---

## 🛡️ Security & Privacy

- **Encrypted Token Cache**: User session tokens are secured in the device's hardware-backed keystore/keychain through `expo-secure-store`.
- **Environment Isolation**: Secret API keys are segregated using environment configurations and ignored by version control.
- **Fail-Safe Crash Handling**: Unhandled runtime crashes are intercepted by a root-level PostHog Error Boundary with graceful user fallbacks.

---

## 📄 License

This repository is maintained for personal and educational use. All rights reserved.
