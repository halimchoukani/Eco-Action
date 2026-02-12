import { useRouter } from 'expo-router';
import VisualSplashScreen from '../components/VisualSplashScreen';
import { getCurrentUser } from '../lib/api/users';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [animationFinished, setAnimationFinished] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const user = await getCurrentUser();
            setIsLoggedIn(!!user);
        };
        checkUser();
    }, []);

    useEffect(() => {
        if (animationFinished && isLoggedIn !== null) {
            if (isLoggedIn) {
                router.replace('/(tabs)/home');
            } else {
                router.replace('/onBoard');
            }
        }
    }, [animationFinished, isLoggedIn]);

    return (
        <VisualSplashScreen onFinish={() => setAnimationFinished(true)} />
    );
}

