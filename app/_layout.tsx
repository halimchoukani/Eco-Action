import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { PortalProvider } from '@tamagui/portal'
import { Toast, ToastProvider, ToastViewport } from '@tamagui/toast'
import { StatusBar } from 'expo-status-bar'

import { tamaguiConfig } from '../tamagui.config'
import { CurrentToast } from '../components/CurrentToast'

export default function RootLayout() {
    const colorScheme = useColorScheme()

    return (
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
            <PortalProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <ToastProvider burntOptions={{ from: 'bottom' }}>
                        <CurrentToast />
                        <StatusBar style="auto" />
                        <Stack
                            screenOptions={{
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
                                options={{ title: 'EcoAction', headerShown: false }}
                            />
                            <Stack.Screen
                                name="onBoard"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/login"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/register"
                                options={{ headerShown: false }}
                            />
                        </Stack>
                        <ToastViewport top={50} left={20} right={20} />
                    </ToastProvider>
                </ThemeProvider>

            </PortalProvider>
        </TamaguiProvider >
    )
}
