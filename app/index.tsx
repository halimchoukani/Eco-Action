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
        if (animationFinished && user !== null) {
            if (user) {
                router.replace('/(tabs)/home');
            } else {
                router.replace('/onBoard');
            }
        }
    }, [animationFinished, user]);

    return (
        <VisualSplashScreen onFinish={() => setAnimationFinished(true)} />
    );
}

