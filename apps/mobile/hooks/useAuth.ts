import { useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getCurrentUser, signOut, type User } from '@/lib/auth';
import { identifySuperwallUser, resetSuperwallUser } from '@/lib/superwall-config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    // Auth guard: redirect based on auth state
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (loading) return; // Don't redirect while loading

    if (!user && !inAuthGroup) {
      // Not signed in, redirect to sign in
      router.replace('/(auth)/signin');
    } else if (user && inAuthGroup) {
      // Signed in, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Identify user with Superwall
      if (currentUser) {
        identifySuperwallUser(currentUser.id, {
          email: currentUser.email,
          subscriptionTier: currentUser.subscriptionTier,
          xp: currentUser.xp,
          level: currentUser.level,
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      resetSuperwallUser();
      setUser(null);
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return {
    user,
    loading,
    signOut: handleSignOut,
    refresh: loadUser,
  };
}

