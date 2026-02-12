import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Animated,
    ViewToken
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getCurrentUser } from '../lib/api/users';
import { useQuery } from '@tanstack/react-query';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconColor: string;
    circleColor: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Find Your Mission',
        description: 'Discover local volunteer opportunities that match your passion for nature.',
        icon: 'leaf',
        iconColor: '#4ADE80',
        circleColor: '#DCFCE7',
    },
    {
        id: '2',
        title: 'Make an Impact',
        description: 'Track your contributions, from trees planted to beaches cleaned.',
        icon: 'waves',
        iconColor: '#3B82F6',
        circleColor: '#DBEAFE',
    },
    {
        id: '3',
        title: 'Earn Rewards',
        description: 'Level up, unlock badges, and join a community of eco-guardians.',
        icon: 'trophy',
        iconColor: '#F59E0B',
        circleColor: '#FEF3C7',
    },
];

const Paginator = ({ data, scrollX }: { data: OnboardingSlide[], scrollX: Animated.Value }) => {
    return (
        <View style={styles.paginatorContainer}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 24, 10],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        style={[styles.dot, { width: dotWidth, opacity, backgroundColor: '#2D6B4F' }]}
                        key={i.toString()}
                    />
                );
            })}
        </View>
    );
};

export default function OnBoardScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);
    const router = useRouter();

    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });
    useEffect(() => {
        if (user) {
            router.replace('/(tabs)/home');
        }
    }, [user]);

    const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/auth/login');
        }
    };

    const handleSkip = () => {
        router.replace('/auth/login');
    };

    const renderItem = ({ item }: { item: OnboardingSlide }) => (
        <View style={styles.slide}>
            <View style={[styles.circle, { backgroundColor: item.circleColor }]}>
                <MaterialCommunityIcons name={item.icon} size={100} color={item.iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <FlatList
                data={slides}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={32}
                ref={slidesRef}
            />

            <Paginator data={slides} scrollX={scrollX} />

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={scrollToNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextButtonText}>
                        {currentIndex === slides.length - 1 ? 'Get Started ' : 'Next '}
                    </Text>
                    <MaterialCommunityIcons
                        name={currentIndex === slides.length - 1 ? 'check' : 'arrow-right'}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCE7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    circle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        // Elevation for premium look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#064E3B',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 18,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 26,
    },
    paginatorContainer: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    skipText: {
        fontSize: 18,
        color: '#2D6B4F',
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#2D6B4F',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
