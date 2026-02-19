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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissionById } from '../../lib/api/mission';
import { getCategoryById } from '../../lib/api/category';
import { getUserById, getCurrentUser } from '../../lib/api/users';
import { createParticipation, isParticipated } from '../../lib/api/participation';

const { width } = Dimensions.get('window');

export default function MissionDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: currentUser } = useSuspenseQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    const { data: mission } = useSuspenseQuery({
        queryKey: ['mission', id],
        queryFn: () => getMissionById(id!),
    });

    const { data: category } = useSuspenseQuery({
        queryKey: ['category', mission?.category],
        queryFn: () => getCategoryById(mission!.category),
    });

    const { data: host } = useSuspenseQuery({
        queryKey: ['user', mission?.creator],
        queryFn: () => getUserById(mission!.creator),
    });
    const { data: participationData } = useSuspenseQuery({
        queryKey: ['isParticipated', id, currentUser?.$id],
        queryFn: () => isParticipated({ missionId: id!, userId: currentUser!.$id }),
    });

    const isUserParticipated = participationData;
    const joinMutation = useMutation({
        mutationFn: () => createParticipation({
            missionId: id!,
            userId: currentUser!.$id,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mission', id] });
            queryClient.invalidateQueries({ queryKey: ['isParticipated', id, currentUser?.$id] });
        },
    });

    if (!mission) return null;

    const startDate = new Date(mission.startDate);
    const dateString = startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const timeString = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(mission.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const spotsFilled = mission.totalSpots - mission.availableSpots;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header Gradient Section */}
                <LinearGradient
                    colors={['#60A5FA', '#34D399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <SafeAreaView edges={['top']} style={styles.safeHeader}>
                        <View style={styles.navRow}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerContent}>
                            <View style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{category?.title}</Text>
                            </View>
                            <Text style={styles.title}>{mission.name}</Text>

                            <View style={styles.hostRow}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {host?.name.substring(0, 2).toUpperCase()}
                                    </Text>
                                </View>
                                <Text style={styles.hostText}>
                                    Hosted by <Text style={styles.hostName}>{host?.name}</Text>
                                </Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/* Details Section */}
                <View style={styles.content}>
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#059669" />
                        </View>
                        <Text style={styles.infoText}>{dateString}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="clock-outline" size={24} color="#3B82F6" />
                        </View>
                        <Text style={styles.infoText}>{timeString}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#EF4444" />
                        </View>
                        <Text style={styles.infoText}>{mission.location}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About the Mission</Text>
                        <Text style={styles.description}>{mission.description}</Text>
                    </View>

                    <View style={styles.participantsSection}>
                        <Text style={styles.participantsTitle}>Participants</Text>
                        <Text style={styles.participantsCount}>
                            <Text style={styles.countActive}>{spotsFilled}</Text> / {mission.totalSpots} spots filled
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer Button */}
            {mission.availableSpots > 0 && !isUserParticipated && mission.creator !== currentUser?.$id && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => joinMutation.mutate()}
                        disabled={joinMutation.isPending || mission.availableSpots === 0}
                    >
                        <Text style={styles.joinButtonText}>
                            {joinMutation.isPending ? 'Joining...' : 'Join Mission'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerGradient: {
        height: 350,
        width: '100%',
    },
    safeHeader: {
        flex: 1,
        paddingHorizontal: 20,
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        marginTop: 'auto',
        marginBottom: 30,
    },
    categoryChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    categoryText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    hostText: {
        color: '#E5E7EB',
        fontSize: 16,
    },
    hostName: {
        color: '#fff',
        fontWeight: '600',
    },
    content: {
        padding: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    },
    participantsSection: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    participantsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    participantsCount: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '600',
    },
    countActive: {
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    joinButton: {
        backgroundColor: '#2D6B4F',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2D6B4F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
