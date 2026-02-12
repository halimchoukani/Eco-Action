import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { account } from '../../lib/appwrite';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            router.replace('/auth/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCE7',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
