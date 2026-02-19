import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { getMissions, searchMissions, getMissionsByCategory } from '../../lib/api/mission';
import { getCategories } from '../../lib/api/category';
import MissionCard from '../../components/MissionCard';

export default function ExploreScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const { data: missionsData, isLoading: missionsLoading, error } = useQuery({
        queryKey: ['missions', selectedCategory, debouncedQuery],
        queryFn: () => {
            if (selectedCategory) {
                return getMissionsByCategory(selectedCategory);
            }
            return getMissions();
        },
    });

    const missions = missionsData?.documents || [];
    const filteredMissions = missions.filter((mission) => mission.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Explore</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search eco-missions..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialCommunityIcons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    <TouchableOpacity
                        style={[
                            styles.categoryChip,
                            selectedCategory === null && styles.categoryChipActive
                        ]}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === null && styles.categoryTextActive
                        ]}>All</Text>
                    </TouchableOpacity>

                    {categories?.documents.map((category) => (
                        <TouchableOpacity
                            key={category.$id}
                            style={[
                                styles.categoryChip,
                                selectedCategory === category.$id && styles.categoryChipActive
                            ]}
                            onPress={() => setSelectedCategory(category.$id)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category.$id && styles.categoryTextActive
                            ]}>{category.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Missions List */}
            {missionsLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#2D6B4F" />
                </View>
            ) : (
                <FlatList
                    data={filteredMissions}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <MissionCard mission={item as any} />
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="leaf-off" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No missions found</Text>
                            <Text style={styles.emptySubtext}>Try a different search or category</Text>
                        </View>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#111827',
    },
    categoriesWrapper: {
        marginBottom: 10,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryChipActive: {
        backgroundColor: '#2D6B4F',
        borderColor: '#2D6B4F',
    },
    categoryText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#fff',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cardWrapper: {
        marginBottom: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4B5563',
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 5,
    },
});
