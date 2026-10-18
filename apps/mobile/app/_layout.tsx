import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { initializeAnalytics, analytics } from '@/lib/analytics';
import { configureSuperwall, identifySuperwallUser, resetSuperwallUser } from '@/lib/superwall-config';

export default function RootLayout() {
  const { loading, user } = useAuth();

  useEffect(() => {
    // Initialize analytics
    initializeAnalytics(user?.id);

    // Initialize Superwall
    const apiKey = process.env.EXPO_PUBLIC_SUPERWALL_API_KEY;
    if (apiKey) {
      configureSuperwall(apiKey).then(() => {
        if (user?.id) {
          identifySuperwallUser(user.id, {
            email: user.email,
            subscriptionTier: user.subscriptionTier,
            xp: user.xp,
            level: user.level,
          });
        }
      });
    }

    // Track app launch
    analytics.screen('Root', '/');
  }, [user]);

  // Reset Superwall on sign out
  useEffect(() => {
    if (!user) {
      resetSuperwallUser();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="calculator/[id]" options={{ title: 'Calculator' }} />
        <Stack.Screen name="calculator/[id]/tutor" options={{ title: 'AI Tutor' }} />
      </Stack>
    </>
  );
}

