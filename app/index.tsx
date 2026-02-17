import { useRouter } from 'expo-router';
import VisualSplashScreen from '../components/VisualSplashScreen';
import { getCurrentUser } from '../lib/api/users';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function HomeScreen() {
    const router = useRouter();
    const [animationFinished, setAnimationFinished] = useState(false);
    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    useEffect(() => {
        if (animationFinished && !isLoading) {
            if (user) {
                router.replace('/(tabs)/home');
            } else {
                console.log("User not found in appwrite");
                router.replace('/onBoard');
            }
        }
    }, [animationFinished, user, isLoading]);

    return (
        <VisualSplashScreen onFinish={() => setAnimationFinished(true)} />
    );
}

