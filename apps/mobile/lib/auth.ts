import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  subscriptionTier: string;
  xp: number;
  level: number;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function signUp(email: string, password: string, username?: string, name?: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username, name }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    // Sign in after signup
    return await signIn(email, password);
  } catch (error: any) {
    throw new Error(error.message || 'Signup failed');
  }
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store session in Supabase client
    await supabase.auth.setSession({
      access_token: data.data.session.accessToken,
      refresh_token: data.data.session.refreshToken,
    });

    return {
      user: data.data.user,
      accessToken: data.data.session.accessToken,
      refreshToken: data.data.session.refreshToken,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Signout error:', error);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Fetch user data from our API
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const apiData = await response.json();
    return apiData.ok ? apiData.data : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}




