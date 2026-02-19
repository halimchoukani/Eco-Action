import '@tamagui/native/setup-zeego'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { PortalProvider } from '@tamagui/portal'
import { Toast, ToastProvider, ToastViewport } from '@tamagui/toast'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import { config } from '../tamagui.config'
import { CurrentToast } from '../components/CurrentToast'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

export default function RootLayout() {
    const colorScheme = useColorScheme()

    return (
        <QueryClientProvider client={queryClient}>
            <TamaguiProvider config={config} defaultTheme={colorScheme!}>
                <PortalProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <ToastProvider burntOptions={{ from: 'bottom' }}>
                            <CurrentToast />
                            <StatusBar style="auto" />
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    headerStyle: {
                                        backgroundColor: '#10b981',
                                    },
                                    headerTintColor: '#fff',
                                    headerTitleStyle: {
                                        fontWeight: 'bold',
                                    },
                                }}
                            >
                                <Stack.Screen
                                    name="index"
                                    options={{ title: 'EcoAction' }}
                                />
                                <Stack.Screen
                                    name="onBoard"
                                />
                                <Stack.Screen
                                    name="auth/login"
                                />
                                <Stack.Screen
                                    name="auth/register"
                                />
                                <Stack.Screen
                                    name="mission/add"
                                    options={{ title: 'Create Mission' }}
                                />
                            </Stack>
                            <ToastViewport top={50} left={20} right={20} />
                        </ToastProvider>
                    </ThemeProvider>
                </PortalProvider>
            </TamaguiProvider >
        </QueryClientProvider>
    )
}
