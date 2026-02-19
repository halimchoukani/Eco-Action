import React from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../../lib/api/users';
import { getUserParticipations } from '../../lib/api/participation';
import { getMissionsByIds, getMissionsByCreator } from '../../lib/api/mission';
import MissionCard from '../../components/MissionCard';
import { Mission } from '../../lib/types/mission';

export default function MissionsScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = React.useState(false);

    // 1. Get Current User
    const { data: user, isLoading: userLoading, refetch: refetchUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    // 2. Get Created Missions
    const { data: createdMissionsData, isLoading: createdLoading, refetch: refetchCreated } = useQuery({
        queryKey: ['createdMissions', user?.$id],
        queryFn: () => getMissionsByCreator(user!.$id),
        enabled: !!user,
    });

    // 3. Get Participations
    const { data: participations, isLoading: participationsLoading, refetch: refetchParticipations } = useQuery({
        queryKey: ['userParticipations', user?.$id],
        queryFn: () => getUserParticipations(user!.$id),
        enabled: !!user,
    });

    // 4. Extract Mission IDs from Participations
    const participationMissionIds = React.useMemo(() => {
        return participations?.documents.map(p => {
            const m = Array.isArray(p.mission) ? p.mission[0] : p.mission;
            if (!m) return null;
            if (typeof m === 'string') return m;
            return (m as any)?.$id || m;
        }).filter(id => !!id) as string[] || [];
    }, [participations]);

    // 5. Get Participating Missions Details
    const { data: participatingMissionsData, isLoading: participatingLoading, refetch: refetchParticipatingMissions } = useQuery({
        queryKey: ['participatingMissions', participationMissionIds],
        queryFn: () => getMissionsByIds(participationMissionIds),
        enabled: participationMissionIds.length > 0,
    });

    // Refresh Handler
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            refetchUser(),
            refetchCreated(),
            refetchParticipations(),
            refetchParticipatingMissions(),
        ]);
        setRefreshing(false);
    }, [refetchUser, refetchCreated, refetchParticipations, refetchParticipatingMissions]);

    const isLoading = userLoading || createdLoading || participationsLoading || (participationMissionIds.length > 0 && participatingLoading);

    // Prepare Sections
    const sections = React.useMemo(() => {
        if (!user) return [];

        const created = createdMissionsData?.documents || [];
        const participating = participatingMissionsData?.documents || [];

        // Filter out missions I created from the 'Participating' list to avoid duplicates
        // (Assuming creators are automatically added as participants)
        const participatingFiltered = participating.filter(m => m.creator !== user.$id);

        const result = [];

        if (created.length > 0) {
            result.push({
                title: 'Created by Me',
                data: created,
                icon: 'crown-outline' as const,
                color: '#D97706',
            });
        }

        if (participatingFiltered.length > 0) {
            result.push({
                title: 'Participating',
                data: participatingFiltered,
                icon: 'hand-heart-outline' as const,
                color: '#059669',
            });
        }

        return result;
    }, [user, createdMissionsData, participatingMissionsData]);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons name="calendar-blank" size={64} color="#2D6B4F" />
            </View>
            <Text style={styles.emptyText}>No missions yet</Text>
            <Text style={styles.emptySubtext}>Start your journey by creating or joining a mission!</Text>
            <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/explore')}
            >
                <Text style={styles.exploreButtonText}>Explore Missions</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>My Missions</Text>
                        <Text style={styles.subtitle}>Track your ongoing and completed eco-actions.</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/mission/add')}
                        activeOpacity={0.85}
                    >
                        <MaterialCommunityIcons name="plus" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#2D6B4F" />
                </View>
            ) : sections.length === 0 ? (
                renderEmptyState()
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <MissionCard mission={item as any} />
                        </View>
                    )}
                    renderSectionHeader={({ section: { title, icon, color } }) => (
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name={icon} size={20} color={color} style={{ marginRight: 8 }} />
                            <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                    stickySectionHeadersEnabled={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2D6B4F']} />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCE7',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2D6B4F',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#064E3B',
    },
    subtitle: {
        fontSize: 16,
        color: '#059669',
        marginTop: 5,
        fontWeight: '500',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 12,
        backgroundColor: '#FDFCE7', // Match background to avoid weird overlap if sticky
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardWrapper: {
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -50,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 30,
    },
    exploreButton: {
        backgroundColor: '#2D6B4F',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
