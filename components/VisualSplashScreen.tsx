import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const VisualSplashScreen = ({ onFinish }: { onFinish: () => void }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start(() => onFinish());
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
            >
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="leaf" size={60} color="#fff" />
                </View>

                <Text style={styles.title}>EcoAction</Text>
                <Text style={styles.subtitle}>Small acts, big impact.</Text>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#2D6B4F', // Deep green circle
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        // Premium Shadow
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
    },
    title: {
        fontSize: 52,
        fontWeight: '800',
        color: '#064E3B', // Darker green for title
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: '#2D6B4F',
        marginTop: 4,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});

export default VisualSplashScreen;
