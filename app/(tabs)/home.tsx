import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../lib/api/users';

import StatsCard from '../../components/StatsCard';

const { width } = Dimensions.get('window');

export default function Home() {
    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    const userName = user?.name?.split(' ')[0] || 'Member';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.greeting}>Good morning, </Text>
                            <Text style={styles.userName}>{userName} ! 🌿</Text>
                        </View>
                        <Text style={styles.subGreeting}>Ready to make a difference today?</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userName.substring(0, 2).toUpperCase()}</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatsCard
                        title="Impact Score"
                        value={user?.impactScore?.toLocaleString() || "0"}
                        icon="flash"
                        color="#86EFAC"
                        backgroundColor="#064E3B"
                    />
                    <StatsCard
                        title="Hours Volunteered"
                        value={`${user?.hoursVolunteered || 0} h`}
                        icon="clock-outline"
                        color="#6B7280"
                        backgroundColor="#fff"
                        iconColor="#3B82F6"
                    />
                </View>

                {/* Your Next Mission */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Next Mission</Text>
                </View>
                <TouchableOpacity activeOpacity={0.9} style={styles.mainCard}>
                    <LinearGradient
                        colors={['#60A5FA', '#34D399']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardImagePlaceholder}
                    >
                        <View style={styles.cardChips}>
                            <View style={styles.chip}>
                                <Text style={styles.chipText}>Beach Cleanup</Text>
                            </View>
                            <View style={[styles.chip, { backgroundColor: '#DCFCE7' }]}>
                                <Text style={[styles.chipText, { color: '#059669' }]}>Easy</Text>
                            </View>
                        </View>
                    </LinearGradient>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Sunset Beach Cleanup</Text>
                        <View style={styles.cardInfoRow}>
                            <View style={styles.cardInfoItem}>
                                <MaterialCommunityIcons name="map-marker-outline" size={16} color="#9CA3AF" />
                                <Text style={styles.cardInfoText}>Crystal Cove State</Text>
                            </View>
                            <View style={styles.cardInfoItem}>
                                <MaterialCommunityIcons name="calendar-outline" size={16} color="#9CA3AF" />
                                <Text style={styles.cardInfoText}>Oct 12, 2024</Text>
                            </View>
                        </View>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressHeader}>
                                <View style={styles.progressLabel}>
                                    <MaterialCommunityIcons name="account-group-outline" size={16} color="#4B5563" />
                                    <Text style={styles.progressText}>4 spots left</Text>
                                </View>
                                <Text style={styles.percentageText}>80 % full</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: '80%' }]} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Featured Opportunities */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Opportunities</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.smallCard}>
                        <LinearGradient
                            colors={['#60A5FA', '#34D399']}
                            style={styles.smallCardImage}
                        >
                            <View style={styles.smallCardChips}>
                                <View style={styles.smallChip}>
                                    <Text style={styles.smallChipText}>Beach Cleanup</Text>
                                </View>
                                <View style={[styles.smallChip, { backgroundColor: '#DCFCE7' }]}>
                                    <Text style={[styles.smallChipText, { color: '#059669' }]}>Easy</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <View style={styles.smallCardContent}>
                            <Text style={styles.smallCardTitle}>Sunset Beach Cleanup</Text>
                            <View style={styles.smallCardInfoItem}>
                                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.smallCardInfoText}>Crystal Cove State</Text>
                            </View>
                            <View style={styles.smallCardProgress}>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: '80%' }]} />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={styles.smallCard}>
                        <LinearGradient
                            colors={['#10B981', '#34D399']}
                            style={styles.smallCardImage}
                        >
                            <View style={styles.smallCardChips}>
                                <View style={styles.smallChip}>
                                    <Text style={styles.smallChipText}>Tree Planting</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <View style={styles.smallCardContent}>
                            <Text style={styles.smallCardTitle}>Urban Tree Plant</Text>
                            <View style={styles.smallCardInfoItem}>
                                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.smallCardInfoText}>Downtown City P</Text>
                            </View>
                            <View style={styles.smallCardProgress}>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: '40%', backgroundColor: '#10B981' }]} />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                {/* Did you know section */}
                <View style={styles.didYouKnowCard}>
                    <View style={styles.leafIconContainer}>
                        <MaterialCommunityIcons name="leaf" size={24} color="#059669" />
                    </View>
                    <View style={styles.didYouKnowTextContainer}>
                        <Text style={styles.didYouKnowTitle}>Did you know?</Text>
                        <Text style={styles.didYouKnowText}>
                            Planting a single tree can absorb up to 48 pounds of carbon dioxide per year. Your efforts matter!
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCE7',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#064E3B',
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#064E3B',
    },
    subGreeting: {
        fontSize: 14,
        color: '#059669',
        marginTop: 4,
        fontWeight: '500',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2D6B4F',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    seeAllText: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '600',
    },
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    cardImagePlaceholder: {
        height: 180,
        width: '100%',
        padding: 16,
    },
    cardChips: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
    },
    cardContent: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    cardInfoRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    cardInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardInfoText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    progressContainer: {
        marginTop: 5,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    progressText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '600',
    },
    percentageText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        width: '100%',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    horizontalScroll: {
        paddingRight: 20,
        marginBottom: 30,
    },
    smallCard: {
        width: 260,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    smallCardImage: {
        height: 140,
        padding: 12,
    },
    smallCardChips: {
        flexDirection: 'row',
        gap: 6,
    },
    smallChip: {
        backgroundColor: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    smallChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
    smallCardContent: {
        padding: 16,
    },
    smallCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    smallCardInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    smallCardInfoText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    smallCardProgress: {
        marginTop: 4,
    },
    didYouKnowCard: {
        backgroundColor: '#DCFCE7',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    leafIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    didYouKnowTextContainer: {
        flex: 1,
    },
    didYouKnowTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 6,
    },
    didYouKnowText: {
        fontSize: 14,
        color: '#065F46',
        lineHeight: 20,
        fontWeight: '500',
    },
});