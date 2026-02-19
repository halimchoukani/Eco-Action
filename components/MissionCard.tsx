import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategories, getCategoryById } from "~/lib/api/category";
import { Mission } from "~/lib/types/mission";

export default function MissionCard({ mission }: { mission: Mission }) {
    const router = useRouter();
    const { data: category, isLoading: categoryLoading } = useQuery({
        queryKey: ['category', mission.category],
        queryFn: () => getCategoryById(mission.category),
    });
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mainCard}
            onPress={() => router.push(`/mission/${mission.$id}`)}
        >
            <LinearGradient
                colors={['#60A5FA', '#34D399']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardImagePlaceholder}
            >
                <View style={styles.cardChips}>
                    <View style={styles.chip}>
                        <Text style={styles.chipText}>{category?.title}</Text>
                    </View>
                    <View style={[styles.chip, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.chipText, { color: '#059669' }]}>{mission.difficulty}</Text>
                    </View>
                </View>
            </LinearGradient>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{mission.name}</Text>
                <View style={styles.cardInfoRow}>
                    <View style={styles.cardInfoItem}>
                        <MaterialCommunityIcons name="map-marker-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.cardInfoText}>{mission.location}</Text>
                    </View>
                    <View style={styles.cardInfoItem}>
                        <MaterialCommunityIcons name="calendar-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.cardInfoText}>{new Date(mission.startDate).toLocaleDateString()}</Text>
                    </View>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <View style={styles.progressLabel}>
                            <MaterialCommunityIcons name="account-group-outline" size={16} color="#4B5563" />
                            <Text style={styles.progressText}>{mission.availableSpots} spots left</Text>
                        </View>
                        <Text style={styles.percentageText}>{Math.round(((mission.totalSpots - mission.availableSpots) / mission.totalSpots) * 100)} % full</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${((mission.totalSpots - mission.availableSpots) / mission.totalSpots) * 100}%` }]} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
});
