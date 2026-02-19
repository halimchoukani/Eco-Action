import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissionById, updateMissionSpots } from '../../lib/api/mission';
import { getCategoryById } from '../../lib/api/category';
import { getUserById, getCurrentUser } from '../../lib/api/users';
import { createParticipation, isParticipated, cancelParticipation } from '../../lib/api/participation';
import { useToastController } from 'tamagui';

const { width } = Dimensions.get('window');

export default function MissionDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToastController();

    // Queries
    const { data: currentUser, isLoading: userLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    const { data: mission, isLoading: missionLoading } = useQuery({
        queryKey: ['mission', id],
        queryFn: () => getMissionById(id!),
        enabled: !!id,
    });

    const { data: category } = useQuery({
        queryKey: ['category', mission?.category],
        queryFn: () => getCategoryById(mission!.category),
        enabled: !!mission?.category,
    });

    const { data: host } = useQuery({
        queryKey: ['user', mission?.creator],
        queryFn: () => getUserById(mission!.creator),
        enabled: !!mission?.creator,
    });

    const { data: isUserParticipated } = useQuery({
        queryKey: ['isParticipated', id, currentUser?.$id],
        queryFn: () => isParticipated({ missionId: id!, userId: currentUser!.$id }),
        enabled: !!id && !!currentUser?.$id,
    });

    // Mutations
    const joinMutation = useMutation({
        mutationFn: async () => {
            const res = await createParticipation({
                missionId: id!,
                userId: currentUser!.$id,
            });
            if (res) {
                await updateMissionSpots(id!, (mission?.availableSpots || 1) - 1);
            }
            return res;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['isParticipated', id, currentUser?.$id] });
            await queryClient.cancelQueries({ queryKey: ['mission', id] });

            const previousParticipation = queryClient.getQueryData(['isParticipated', id, currentUser?.$id]);
            const previousMission = queryClient.getQueryData(['mission', id]);

            queryClient.setQueryData(['isParticipated', id, currentUser?.$id], true);
            if (mission) {
                queryClient.setQueryData(['mission', id], {
                    ...mission,
                    availableSpots: mission.availableSpots - 1,
                });
            }

            return { previousParticipation, previousMission };
        },
        onError: (err, newParticipation, context) => {
            queryClient.setQueryData(['isParticipated', id, currentUser?.$id], context?.previousParticipation);
            queryClient.setQueryData(['mission', id], context?.previousMission);
            toast.show('Error', { message: 'Failed to join mission', type: 'error' });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['mission', id] });
            queryClient.invalidateQueries({ queryKey: ['userParticipations', currentUser?.$id] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onSuccess: () => {
            // Explicitly confirm optimistic value — don't rely on refetch
            queryClient.setQueryData(['isParticipated', id, currentUser?.$id], true);
            toast.show('Success', { message: 'You have joined the mission!', type: 'success' });
        }
    });

    const cancelMutation = useMutation({
        mutationFn: async () => {
            const res = await cancelParticipation({
                missionId: id!,
                userId: currentUser!.$id,
            });
            if (res) {
                // Also update available spots in DB
                await updateMissionSpots(id!, (mission?.availableSpots || 0) + 1);
            }
            return res;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['isParticipated', id, currentUser?.$id] });
            await queryClient.cancelQueries({ queryKey: ['mission', id] });

            const previousParticipation = queryClient.getQueryData(['isParticipated', id, currentUser?.$id]);
            const previousMission = queryClient.getQueryData(['mission', id]);

            queryClient.setQueryData(['isParticipated', id, currentUser?.$id], false);
            if (mission) {
                queryClient.setQueryData(['mission', id], {
                    ...mission,
                    availableSpots: mission.availableSpots + 1,
                });
            }

            return { previousParticipation, previousMission };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['isParticipated', id, currentUser?.$id], context?.previousParticipation);
            queryClient.setQueryData(['mission', id], context?.previousMission);
            toast.show('Error', { message: 'Failed to cancel participation', type: 'error' });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['mission', id] });
            queryClient.invalidateQueries({ queryKey: ['userParticipations', currentUser?.$id] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onSuccess: () => {
            // Explicitly confirm optimistic value — don't rely on refetch
            queryClient.setQueryData(['isParticipated', id, currentUser?.$id], false);
            toast.show('Cancelled', { message: 'Participation cancelled', type: 'success' });
        }
    });

    if (missionLoading || userLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#2D6B4F" />
            </View>
        );
    }

    if (!mission) return null;

    const startDate = new Date(mission.startDate);
    const dateString = startDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
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
                                <Text style={styles.categoryText}>{category?.title || 'Eco Action'}</Text>
                            </View>
                            <Text style={styles.title}>{mission.name}</Text>

                            <View style={styles.hostRow}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {host?.name ? host.name.substring(0, 2).toUpperCase() : 'EA'}
                                    </Text>
                                </View>
                                <Text style={styles.hostText}>
                                    Hosted by <Text style={styles.hostName}>{host?.name || 'EcoAction Team'}</Text>
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
            <View style={styles.footer}>
                {mission.creator === currentUser?.$id ? (
                    <View style={styles.ownerNotice}>
                        <MaterialCommunityIcons name="information-outline" size={20} color="#059669" />
                        <Text style={styles.ownerNoticeText}>You are the organizer of this mission</Text>
                    </View>
                ) : isUserParticipated ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => cancelMutation.mutate()}
                        disabled={cancelMutation.isPending}
                    >
                        <Text style={styles.actionButtonText}>
                            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Participation'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.joinButton,
                            mission.availableSpots === 0 && styles.disabledButton
                        ]}
                        onPress={() => joinMutation.mutate()}
                        disabled={joinMutation.isPending || mission.availableSpots === 0}
                    >
                        <Text style={styles.actionButtonText}>
                            {mission.availableSpots === 0
                                ? 'Mission Full'
                                : joinMutation.isPending ? 'Joining...' : 'Join Mission'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFCE7',
    },
    scrollContent: {
        paddingBottom: 120,
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
    actionButton: {
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    joinButton: {
        backgroundColor: '#2D6B4F',
        shadowColor: '#2D6B4F',
    },
    cancelButton: {
        backgroundColor: '#EF4444',
        shadowColor: '#EF4444',
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
        shadowColor: '#9CA3AF',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ownerNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DCFCE7',
        padding: 15,
        borderRadius: 15,
    },
    ownerNoticeText: {
        color: '#065F46',
        fontWeight: '600',
        marginLeft: 8,
    },
});
