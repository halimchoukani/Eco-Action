# EcoAction 🌱

**EcoAction** is a sustainable action tracking mobile application built with **React Native**, **Expo**, and **Appwrite**. It empowers users to discover, create, and participate in eco-friendly missions like beach cleanups, tree planting, and recycling drives.

## 🚀 Features

### 🌍 Missions
- **Discover**: Browse a list of active eco-missions.
- **Create**: Users can host their own missions with details like location, difficulty, and capacity.
- **Participate**: Join missions to contribute to the cause.
- **Track**: View your "Created" and "Participating" missions in a dedicated tab.

### 👤 User Profile
- **Authentication**: Secure Login and Registration powered by Appwrite.
- **Profile Management**: View and edit user details.

### 🎨 UI & UX
- **Modern Design**: Built with **Tamagui** and custom styles for a sleek, eco-friendly aesthetic.
- **Smooth Navigation**: File-based routing with **Expo Router**.
- **Responsive**: Optimized for both iOS and Android.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Backend as a Service**: [Appwrite](https://appwrite.io/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **UI Library**: [Tamagui](https://tamagui.dev/)
- **Icons**: [Expo Vector Icons](https://icons.expo.fyi/) (MaterialCommunityIcons)

## 📁 Project Structure

```
ecoaction/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Main tab navigation (Home, Explore, Missions, Profile)
│   ├── auth/              # Authentication screens (Login, Register)
│   ├── mission/           # Mission-specific screens (Details, Add Mission)
│   ├── index.tsx          # Entry point
│   ├── _layout.tsx        # Root layout and providers
│   └── ...
├── components/             # Reusable UI components
│   ├── MissionCard.tsx    # Card component for displaying mission info
│   ├── CurrentToast.tsx   # Toast notification component
│   └── ...
├── lib/                    # Logic and Configuration
│   ├── api/               # API calls to Appwrite (users, missions, participation)
│   ├── types/             # TypeScript definitions
│   └── appwrite.ts        # Appwrite client configuration
├── assets/                 # Static assets (images, fonts)
├── tamagui.config.ts       # Tamagui design system config
└── ...
```

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/client) app on your phone (or a simulator)

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecoaction
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with your Appwrite credentials:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_MISSIONS_COLLECTION_ID=your_missions_id
EXPO_PUBLIC_APPWRITE_PARTICIPATIONS_COLLECTION_ID=your_participations_id
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=your_categories_id
```

### 4. Run the App
```bash
npx expo start
```
- Scan the QR code with **Expo Go** (Android/iOS).
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.

## 🧩 Key Components

### Mission Management (`lib/api/mission.ts`)
Handles creating, fetching, and filtering missions.
- `createMission`: Creates a new document in Appwrite and automatically registers the creator as a participant.
- `getMissionsByCreator`: Fetches missions hosted by the current user.
- `getMissionsByIds`: Retrieves details for a list of mission IDs (used for "Participating" list).

### State Management
We use **TanStack Query** to handle server state, caching, and automatic refetching.
- Queries are invalidated on mutation (e.g., refreshing the mission list after adding a new one) to ensure the UI is always in sync.

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Built with logic and passion.*
