import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../lib/api/users';
import { getUserParticipations } from '../../lib/api/participation';
import { getMissionsByIds } from '../../lib/api/mission';
import MissionCard from '../../components/MissionCard';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

export default function MissionsScreen() {
    const router = useRouter();

    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = React.useState(false);

    const { data: user, isLoading: userLoading, refetch: refetchUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    const { data: participations, isLoading: participationsLoading, refetch: refetchParticipations } = useQuery({
        queryKey: ['userParticipations', user?.$id],
        queryFn: () => getUserParticipations(user!.$id),
        enabled: !!user,
    });

    const missionIds = React.useMemo(() => {
        const ids = participations?.documents.map(p => {
            const m = Array.isArray(p.mission) ? p.mission[0] : p.mission;
            if (!m) return null;
            if (typeof m === 'string') return m;
            return (m as any)?.$id || m;
        }).filter(id => !!id) as string[] || [];
        console.log("Extracted Mission IDs:", ids);
        return ids;
    }, [participations]);

    const { data: missions, isLoading: missionsLoading, refetch: refetchMissions } = useQuery({
        queryKey: ['userMissions', missionIds],
        queryFn: () => getMissionsByIds(missionIds),
        enabled: missionIds.length > 0,
    });

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            refetchUser(),
            refetchParticipations(),
            refetchMissions()
        ]);
        setRefreshing(false);
    }, [refetchUser, refetchParticipations, refetchMissions]);

    const isLoading = userLoading || participationsLoading || (missionIds.length > 0 && missionsLoading);

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
            ) : participations?.total === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <MaterialCommunityIcons name="calendar-blank" size={64} color="#2D6B4F" />
                    </View>
                    <Text style={styles.emptyText}>No missions yet</Text>
                    <Text style={styles.emptySubtext}>Start your journey by joining your first mission!</Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/(tabs)/explore')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Missions</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={missions?.documents || []}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <MissionCard mission={item as any} />
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
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
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2D6B4F',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        color: '#064E3B',
    },
    subtitle: {
        fontSize: 16,
        color: '#059669',
        marginTop: 5,
        fontWeight: '500' as const,
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
