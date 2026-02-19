# Architecture & Design Decisions 🏗️

This document outlines the core architectural choices, type system design, and state management strategies used in **EcoAction**.

## 1. Core Architecture

### 📱 Expo & Expo Router
We chose **Expo** for its robust managed workflow, which simplifies accessing native device features (camera, location) without touching native code.

**Expo Router** uses a file-based routing system (similar to Next.js), making navigation intuitive and structurally aligned with the codebase:
- `app/(tabs)/...`: Tab-based main navigation
- `app/mission/[id].tsx`: Dynamic routes for mission details
- `app/_layout.tsx`: Centralized layout and provider configuration

### ☁️ Appwrite (Backend-as-a-Service)
Appwrite was selected for its comprehensive feature set (Auth, Database, Storage) that integrates seamlessly with React Native. It drastically reduces backend boilerplate, allowing us to focus on the mobile experience.

---

## 2. Type Management 🛡️

The project leverages **TypeScript** extensively to ensure reliability and developer productivity. All database entities have corresponding TypeScript interfaces that mirror the Appwrite schema.

### Data Models (`lib/types/`)
Instead of using `any`, we define strict interfaces for every entity.

**Example: `Mission` Interface**
```typescript
import { Models } from "appwrite";

export interface Mission extends Models.Document {
    name: string;
    description: string;
    location: string;
    startDate: string;      // ISO Date String
    totalSpots: number;
    availableSpots: number;
    creator: string;        // User ID relations
    category: string;       // Category ID relations
    difficulty: MissionDifficulty;
}
```
*Note: Extending `Models.Document` automatically adds Appwrite's system fields like `$id`, `$createdAt`, and `$updatedAt`.*

### API Layer Safety
Our API functions in `lib/api/` return typed promises (e.g., `Promise<Models.DocumentList<Mission>>`). This ensures that when we use data in a component, TypeScript knows exactly what fields differ between a raw object and a database document.

---

## 3. State & Cache Management (TanStack Query) 🚀

We use **TanStack Query (React Query)** instead of global state managers like Redux for server state. This is a deliberate choice to handle the asynchronous nature of mobile apps (offline capabilities, loading states, background refetching).

### Why TanStack Query?
1.  **Server State vs. UI State**: User data, mission lists, and participation status are *server state*. They can become stale and need synchronization. TanStack Query handles this automatically.
2.  **Caching**: Data is cached by unique keys. If a user visits a mission detail page they've seen before, it loads instantly from cache while fetching fresh data in the background.
3.  **Deduplication**: Multiple components requesting a user's profile will only trigger a single network request.

### Implementation Patterns

#### A. Query Keys
We use array-based keys to granulize caching.
- `['currentUser']`: The logged-in user.
- `['mission', missionId]`: A specific mission's details.
- `['userParticipations', userId]`: List of missions a user has joined.

#### B. Mutations & Cache Invalidation
When a user performs an action (like creating a mission), we don't just update the local state; we tell the query client that certain data is now "stale".

**Example: Creating a Mission**
```typescript
const { mutate } = useMutation({
    mutationFn: (newMission) => createMission(newMission),
    onSuccess: () => {
        // 1. Invalidate 'missions' so the global list refreshes
        queryClient.invalidateQueries({ queryKey: ['missions'] });
        
        // 2. Invalidate 'userMissions' so the "Created by Me" tab refreshes
        queryClient.invalidateQueries({ queryKey: ['userMissions'] });
        
        // 3. User feedback
        toast.show('Mission Created!');
    }
});
```

#### C. Optimistic Updates
For interactions like "Joining a Mission," we update the UI *immediately* before the server responds to make the app feel snappy. If the server request fails, we roll back the change.

---

## 4. UI Library (Tamagui) 🎨

We use **Tamagui** for its unique approach to styling:
- **Performance**: Use of an optimizing compiler that flattens styles where possible.
- **Cross-Platform**: Consistent look across iOS, Android, and Web.
- **Themeablity**: Easy implementation of dark/light modes and design tokens (colors, spacing).

This architecture ensures **EcoAction** is scalable, type-safe, and provides a top-tier user experience with instant feedback and robust data synchronization.
