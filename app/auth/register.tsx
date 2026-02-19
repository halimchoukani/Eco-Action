import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { register, getCurrentUser } from '../../lib/api/users';
import { useToastController } from 'tamagui';

export default function RegisterScreen() {
    const router = useRouter();
    const toast = useToastController()

    useEffect(() => {
        const checkUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                router.replace('/(tabs)/home');
            }
        };
        checkUser();
    }, []);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleRegister = async () => {
        const res = await register(name, email, password);
        if (res) {
            toast.show('Registration Successful', {

                message: 'You can now login',
                type: 'success',
            })
            router.replace('/auth/login');
        } else {
            toast.show('Registration Failed', {
                message: 'Email already exists',
                type: 'error',
            })
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Logo Section */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="leaf" size={40} color="#fff" />
                        </View>
                        <Text style={styles.title}>Join the Movement</Text>
                        <Text style={styles.subtitle}>Start making a difference today.</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="account-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Alex Johnson"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="email-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="alex@example.com"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="********"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={handleRegister}
                        >
                            <Text style={styles.registerButtonText}>Create Account </Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/auth/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Log In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCE7',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: '#2D6B4F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#2D6B4F',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    registerButton: {
        backgroundColor: '#2D6B4F',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 16,
        color: '#4B5563',
    },
    linkText: {
        fontSize: 16,
        color: '#2D6B4F',
        fontWeight: 'bold',
    },
});
