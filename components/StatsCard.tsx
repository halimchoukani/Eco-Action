import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type StatsCardProps = {
    title: string;
    value: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    color: string;
    backgroundColor: string;
    iconColor?: string;
}
export default function StatsCard({
    title,
    value,
    icon,
    color,
    backgroundColor,
    iconColor = "#fff",
}: StatsCardProps) {
    return (
        <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
            <View style={styles.statHeader}>
                <Text style={[styles.statLabel, { color: color }]}>{title}</Text>
                <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
            </View>
            <Text style={[styles.statValue, { color: backgroundColor === '#fff' ? '#111827' : '#fff' }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        width: (width - 60) / 2,
        padding: 16,
        borderRadius: 20,
        height: 110,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        width: '70%',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
