import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getCurrentUser, logout } from '../../lib/api/users';
import { getUserParticipations } from '../../lib/api/participation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastController } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatsCard from '../../components/StatsCard';

export default function ProfileScreen() {
    const router = useRouter();
    const toast = useToastController();
    const queryClient = useQueryClient();

    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    const { data: participations, isLoading: participationsLoading } = useQuery({
        queryKey: ['userParticipations', user?.$id],
        queryFn: () => getUserParticipations(user!.$id),
        enabled: !!user,
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
            toast.show('Logout Successful', {
                message: 'Come back soon!',
                type: 'success',
            });
            router.replace('/auth/login');
        },
        onError: (error) => {
            console.error(error);
            toast.show('Logout Failed', {
                message: 'Please try again',
                type: 'error',
            });
        },
    });

    if (userLoading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#2D6B4F" />
            </SafeAreaView>
        );
    }

    const userName = user?.name || 'User';
    const email = user?.email || '';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <MaterialCommunityIcons name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{userName}</Text>
                    <Text style={styles.email}>{email}</Text>

                    <View style={styles.levelBadge}>
                        <MaterialCommunityIcons name="shield-check" size={16} color="#059669" />
                        <Text style={styles.levelText}>Eco Guardian Level 1</Text>
                    </View>
                </View>

                {/* Statistics Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Impact</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <MaterialCommunityIcons name="flash" size={28} color="#059669" />
                            <Text style={styles.statValue}>{user?.impactScore || 0}</Text>
                            <Text style={styles.statLabel}>Impact Points</Text>
                        </View>
                        <View style={styles.statBox}>
                            <MaterialCommunityIcons name="clock-outline" size={28} color="#3B82F6" />
                            <Text style={styles.statValue}>{user?.hoursVolunteered || 0}h</Text>
                            <Text style={styles.statLabel}>Hours</Text>
                        </View>
                        <View style={styles.statBox}>
                            <MaterialCommunityIcons name="calendar-check" size={28} color="#F59E0B" />
                            <Text style={styles.statValue}>{participations?.total || 0}</Text>
                            <Text style={styles.statLabel}>Missions</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem icon="account-edit-outline" label="Edit Profile" />
                        <SettingItem icon="bell-outline" label="Notifications" />
                        <SettingItem icon="shield-lock-outline" label="Privacy & Security" />
                        <SettingItem icon="help-circle-outline" label="Help Center" />

                        <TouchableOpacity
                            style={styles.logoutItem}
                            onPress={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
                            <Text style={styles.logoutText}>
                                {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                            </Text>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#EF4444" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>EcoAction v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function SettingItem({ icon, label }: { icon: any, label: string }) {
    return (
        <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name={icon} size={24} color="#4B5563" />
            <Text style={styles.settingLabel}>{label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D5DB" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCE7',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFCE7',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2D6B4F',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#059669',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#064E3B',
    },
    email: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 15,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
        marginLeft: 6,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    settingsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingLabel: {
        fontSize: 16,
        color: '#374151',
        marginLeft: 15,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    logoutText: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: 'bold',
        marginLeft: 15,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    versionText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
});
