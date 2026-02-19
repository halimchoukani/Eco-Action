import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastController } from 'tamagui';
import { createMission } from '../../lib/api/mission';
import { getCategories } from '../../lib/api/category';
import { getCurrentUser } from '../../lib/api/users';
import { MissionDifficulty } from '../../lib/types/mission';

const DIFFICULTIES = [
    { label: 'Easy', value: MissionDifficulty.EASY, color: '#059669', icon: 'leaf' as const },
    { label: 'Medium', value: MissionDifficulty.MEDIUM, color: '#D97706', icon: 'fire' as const },
    { label: 'Hard', value: MissionDifficulty.HARD, color: '#DC2626', icon: 'lightning-bolt' as const },
];

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <Text style={styles.fieldLabel}>
            {label}{required && <Text style={styles.required}> *</Text>}
        </Text>
    );
}

export default function AddMissionScreen() {
    const router = useRouter();
    const toast = useToastController();
    const queryClient = useQueryClient();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [durationHours, setDurationHours] = useState('');
    const [totalSpots, setTotalSpots] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<MissionDifficulty>(MissionDifficulty.EASY);
    const [isFeatured, setIsFeatured] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const categories = categoriesData?.documents ?? [];

    const { mutate: submitMission, isPending } = useMutation({
        mutationFn: () => {
            if (!currentUser) throw new Error('Not authenticated');
            const spots = parseInt(totalSpots, 10) || 0;
            return createMission({
                name: name.trim(),
                description: description.trim(),
                location: location.trim(),
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                durationHours: parseFloat(durationHours) || 0,
                totalSpots: spots,
                availableSpots: spots,
                category: selectedCategory,
                difficulty: selectedDifficulty,
                isFeatured,
                avgRate: 0,
                image: "",
                creator: currentUser.$id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['missions'] });
            queryClient.invalidateQueries({ queryKey: ['userMissions'] });
            toast.show('Mission Created!', { message: 'Your mission is now live.', type: 'success' });
            router.back();
        },
        onError: (err: any) => {
            toast.show('Error', { message: err?.message ?? 'Failed to create mission.', type: 'error' });
        },
    });

    const validate = (): boolean => {
        if (!name.trim()) { toast.show('Validation', { message: 'Mission name is required.', type: 'error' }); return false; }
        if (!description.trim()) { toast.show('Validation', { message: 'Description is required.', type: 'error' }); return false; }
        if (!location.trim()) { toast.show('Validation', { message: 'Location is required.', type: 'error' }); return false; }
        if (!startDate.trim()) { toast.show('Validation', { message: 'Start date is required.', type: 'error' }); return false; }
        if (!endDate.trim()) { toast.show('Validation', { message: 'End date is required.', type: 'error' }); return false; }
        if (!totalSpots || parseInt(totalSpots, 10) <= 0) { toast.show('Validation', { message: 'Total spots must be at least 1.', type: 'error' }); return false; }
        if (!selectedCategory) { toast.show('Validation', { message: 'Please select a category.', type: 'error' }); return false; }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        submitMission();
    };

    const selectedCategoryLabel = categories.find(c => c.$id === selectedCategory)?.title ?? 'Select a category';

    return (
        <View style={styles.root}>
            {/* Header Gradient */}
            <LinearGradient
                colors={['#34D399', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeHeader}>
                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Create Mission</Text>
                        <View style={{ width: 44 }} />
                    </View>
                    <View style={styles.headerContent}>
                        <MaterialCommunityIcons name="plus-circle-outline" size={36} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.headerSubtitle}>Fill in the details to launch a new eco-action mission</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Basic Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="information-outline" size={20} color="#059669" />
                        <Text style={styles.cardTitle}>Basic Info</Text>
                    </View>

                    <FieldLabel label="Mission Name" required />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Beach Cleanup Drive"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                        maxLength={100}
                    />

                    <FieldLabel label="Description" required />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe your mission goals, activities, and what volunteers will do..."
                        placeholderTextColor="#9CA3AF"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={1000}
                    />
                </View>

                {/* Location & Schedule Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="calendar-clock" size={20} color="#3B82F6" />
                        <Text style={styles.cardTitle}>Location & Schedule</Text>
                    </View>

                    <FieldLabel label="Location" required />
                    <View style={styles.inputWithIcon}>
                        <MaterialCommunityIcons name="map-marker-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, styles.inputIconPadding]}
                            placeholder="City, Address or Landmark"
                            placeholderTextColor="#9CA3AF"
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfField}>
                            <FieldLabel label="Start Date" required />
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD HH:MM"
                                placeholderTextColor="#9CA3AF"
                                value={startDate}
                                onChangeText={setStartDate}
                            />
                        </View>
                        <View style={styles.halfFieldSpacer} />
                        <View style={styles.halfField}>
                            <FieldLabel label="End Date" required />
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD HH:MM"
                                placeholderTextColor="#9CA3AF"
                                value={endDate}
                                onChangeText={setEndDate}
                            />
                        </View>
                    </View>

                    <FieldLabel label="Duration (hours)" />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 2.5"
                        placeholderTextColor="#9CA3AF"
                        value={durationHours}
                        onChangeText={setDurationHours}
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Category & Capacity Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="tag-outline" size={20} color="#8B5CF6" />
                        <Text style={styles.cardTitle}>Category & Capacity</Text>
                    </View>

                    <FieldLabel label="Category" required />
                    {categoriesLoading ? (
                        <View style={styles.categoryLoader}>
                            <ActivityIndicator size="small" color="#059669" />
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.dropdown}
                                onPress={() => setCategoryDropdownOpen(o => !o)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dropdownText, !selectedCategory && styles.dropdownPlaceholder]}>
                                    {selectedCategoryLabel}
                                </Text>
                                <MaterialCommunityIcons
                                    name={categoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                            {categoryDropdownOpen && (
                                <View style={styles.dropdownList}>
                                    {categories.map(cat => (
                                        <TouchableOpacity
                                            key={cat.$id}
                                            style={[
                                                styles.dropdownItem,
                                                selectedCategory === cat.$id && styles.dropdownItemSelected,
                                            ]}
                                            onPress={() => {
                                                setSelectedCategory(cat.$id);
                                                setCategoryDropdownOpen(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    selectedCategory === cat.$id && styles.dropdownItemTextSelected,
                                                ]}
                                            >
                                                {cat.title}
                                            </Text>
                                            {selectedCategory === cat.$id && (
                                                <MaterialCommunityIcons name="check" size={16} color="#059669" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                    {categories.length === 0 && (
                                        <Text style={styles.dropdownEmpty}>No categories found</Text>
                                    )}
                                </View>
                            )}
                        </>
                    )}

                    <FieldLabel label="Total Spots" required />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 30"
                        placeholderTextColor="#9CA3AF"
                        value={totalSpots}
                        onChangeText={setTotalSpots}
                        keyboardType="number-pad"
                    />
                </View>

                {/* Difficulty Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="speedometer" size={20} color="#D97706" />
                        <Text style={styles.cardTitle}>Difficulty</Text>
                    </View>

                    <View style={styles.difficultyRow}>
                        {DIFFICULTIES.map(d => (
                            <TouchableOpacity
                                key={d.value}
                                style={[
                                    styles.difficultyChip,
                                    selectedDifficulty === d.value && { backgroundColor: d.color, borderColor: d.color },
                                ]}
                                onPress={() => setSelectedDifficulty(d.value)}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons
                                    name={d.icon}
                                    size={18}
                                    color={selectedDifficulty === d.value ? '#fff' : d.color}
                                />
                                <Text
                                    style={[
                                        styles.difficultyText,
                                        { color: selectedDifficulty === d.value ? '#fff' : d.color },
                                    ]}
                                >
                                    {d.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Options Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="star-outline" size={20} color="#F59E0B" />
                        <Text style={styles.cardTitle}>Options</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.toggleRow}
                        onPress={() => setIsFeatured(f => !f)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.toggleInfo}>
                            <MaterialCommunityIcons name="star-circle-outline" size={22} color="#F59E0B" />
                            <View style={styles.toggleLabels}>
                                <Text style={styles.toggleLabel}>Featured Mission</Text>
                                <Text style={styles.toggleSublabel}>Showcase this mission on the home screen</Text>
                            </View>
                        </View>
                        <View style={[styles.toggle, isFeatured && styles.toggleActive]}>
                            <View style={[styles.toggleKnob, isFeatured && styles.toggleKnobActive]} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isPending}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={isPending ? ['#9CA3AF', '#9CA3AF'] : ['#059669', '#2D6B4F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.submitGradient}
                    >
                        {isPending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <MaterialCommunityIcons name="rocket-launch-outline" size={22} color="#fff" />
                        )}
                        <Text style={styles.submitText}>
                            {isPending ? 'Creating Mission...' : 'Create Mission'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    headerGradient: {
        paddingBottom: 20,
    },
    safeHeader: {
        paddingHorizontal: 20,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    headerSubtitle: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 20,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 18,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginTop: 4,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        fontSize: 15,
        color: '#111827',
        marginBottom: 14,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    inputWithIcon: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 14,
        top: Platform.OS === 'ios' ? 14 : 10,
        zIndex: 1,
    },
    inputIconPadding: {
        paddingLeft: 42,
    },
    row: {
        flexDirection: 'row',
    },
    halfField: {
        flex: 1,
    },
    halfFieldSpacer: {
        width: 12,
    },
    dropdown: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    dropdownText: {
        fontSize: 15,
        color: '#111827',
        flex: 1,
    },
    dropdownPlaceholder: {
        color: '#9CA3AF',
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 14,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemSelected: {
        backgroundColor: '#ECFDF5',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#374151',
    },
    dropdownItemTextSelected: {
        color: '#059669',
        fontWeight: '600',
    },
    dropdownEmpty: {
        textAlign: 'center',
        padding: 16,
        color: '#9CA3AF',
        fontSize: 14,
    },
    categoryLoader: {
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 14,
    },
    difficultyRow: {
        flexDirection: 'row',
        gap: 10,
    },
    difficultyChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    difficultyText: {
        fontWeight: '700',
        fontSize: 13,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    toggleLabels: {
        flex: 1,
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    toggleSublabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    toggleActive: {
        backgroundColor: '#059669',
    },
    toggleKnob: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleKnobActive: {
        transform: [{ translateX: 22 }],
    },
    submitButton: {
        borderRadius: 18,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    submitButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    submitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 18,
    },
    submitText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
