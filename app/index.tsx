import { useRouter } from 'expo-router';
import VisualSplashScreen from '../components/VisualSplashScreen';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <VisualSplashScreen onFinish={() => router.replace('/onBoard')} />
    );
}

