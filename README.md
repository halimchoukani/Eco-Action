# EcoAction - React Native App with Expo Router

A sustainable action tracking app built with React Native, Expo, and Appwrite.

## 🚀 Features

- **File-based Routing** with Expo Router
- **Authentication** with Appwrite (Login/Register)
- **Beautiful UI** with eco-friendly design
- **TypeScript** for type safety
- **Cross-platform** (iOS, Android, Web)

## 📁 Project Structure

```
ecoaction/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with Stack navigation
│   ├── index.tsx          # Home screen
│   ├── dashboard.tsx      # User dashboard
│   └── auth/              # Authentication screens
│       ├── login.tsx      # Login screen
│       └── register.tsx   # Register screen
├── lib/                   # Utilities and configurations
│   └── appwrite.ts        # Appwrite configuration
├── assets/                # Images, fonts, etc.
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Appwrite account (for backend services)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Appwrite:
   - Create a project on [Appwrite Cloud](https://cloud.appwrite.io)
   - Update `.env` file with your Appwrite credentials:
     ```
     EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
     EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
     EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
     EXPO_PUBLIC_APPWRITE_PLATFORM=com.halimchoukani.ecoaction
     ```

3. Start the development server:
```bash
npm start
```

## 📱 Running the App

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## 🧭 Navigation

The app uses **Expo Router** for file-based routing:

- `/` - Home screen
- `/dashboard` - User dashboard (requires authentication)
- `/auth/login` - Login screen
- `/auth/register` - Registration screen

### Adding New Screens

Simply create a new file in the `app/` directory:

```tsx
// app/new-screen.tsx
import { View, Text } from 'react-native';

export default function NewScreen() {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
}
```

The route will automatically be available at `/new-screen`.

## 🎨 Styling

The app uses React Native's StyleSheet API with a consistent color scheme:

- Primary: `#10b981` (Green)
- Background: `#f0fdf4` (Light Green)
- Text: `#065f46` (Dark Green)
- Accent: `#d1fae5` (Pale Green)

## 🔐 Authentication

Authentication is handled by Appwrite:

- **Register**: Creates a new user account
- **Login**: Authenticates existing users
- **Session Management**: Automatic session handling
- **Protected Routes**: Dashboard requires authentication

## 📦 Dependencies

### Core
- `expo` - Expo framework
- `react` - React library
- `react-native` - React Native framework
- `expo-router` - File-based routing

### Navigation
- `react-native-screens` - Native navigation primitives
- `react-native-safe-area-context` - Safe area handling
- `expo-linking` - Deep linking support

### Backend
- `react-native-appwrite` - Appwrite SDK
- `react-native-url-polyfill` - URL polyfill for React Native

### UI
- `expo-status-bar` - Status bar component
- `expo-constants` - App constants

## 🚧 Development

### TypeScript

The project uses TypeScript with strict mode enabled. Type definitions are included for all dependencies.

### Metro Bundler

Metro configuration is set up in `metro.config.js` for optimal bundling with Expo Router.

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. Please contact the maintainer for contribution guidelines.

---

Built with ❤️ for a sustainable future 🌱
