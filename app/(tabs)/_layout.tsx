import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 70 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 10,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarActiveTintColor: '#2D6B4F',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            {focused && <View style={{ position: 'absolute', top: -14, width: 30, height: 4, backgroundColor: '#2D6B4F', borderRadius: 2 }} />}
                            <MaterialCommunityIcons name="home-variant" size={26} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            {focused && <View style={{ position: 'absolute', top: -14, width: 30, height: 4, backgroundColor: '#2D6B4F', borderRadius: 2 }} />}
                            <MaterialCommunityIcons name="compass-outline" size={26} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="missions"
                options={{
                    title: "My Missions",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            {focused && <View style={{ position: 'absolute', top: -14, width: 30, height: 4, backgroundColor: '#2D6B4F', borderRadius: 2 }} />}
                            <MaterialCommunityIcons name="calendar-check-outline" size={26} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            {focused && <View style={{ position: 'absolute', top: -14, width: 30, height: 4, backgroundColor: '#2D6B4F', borderRadius: 2 }} />}
                            <MaterialCommunityIcons name="account-outline" size={26} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
