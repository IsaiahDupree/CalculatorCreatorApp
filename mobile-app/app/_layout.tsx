import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Calculator Creator', headerShown: false }} />
                <Stack.Screen name="create" options={{ title: 'New Calculator' }} />
                <Stack.Screen name="calculator/[id]" options={{ title: 'Calculator' }} />
                <Stack.Screen name="auth/login" options={{ title: 'Login', presentation: 'modal' }} />
                <Stack.Screen name="auth/register" options={{ title: 'Sign Up', presentation: 'modal' }} />
                <Stack.Screen name="subscription" options={{ title: 'Subscription', presentation: 'modal' }} />
            </Stack>
        </AuthProvider>
    );
}
