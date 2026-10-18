import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';
import type { AuthSession } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// Complete OAuth flow in browser
WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle(): Promise<AuthSession> {
  try {
    // Start OAuth flow with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${API_URL}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Open browser for OAuth
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      `${API_URL}/auth/callback`
    );

    if (result.type === 'success') {
      // Extract token from callback URL
      const url = new URL(result.url);
      const accessToken = url.searchParams.get('access_token');

      if (!accessToken) {
        throw new Error('No access token received');
      }

      // Send to backend for verification
      const response = await fetch(`${API_URL}/api/auth/social/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      const apiData = await response.json();

      if (!apiData.ok) {
        throw new Error(apiData.error || 'Social login failed');
      }

      // Store session
      await supabase.auth.setSession({
        access_token: apiData.data.session.accessToken,
        refresh_token: apiData.data.session.refreshToken,
      });

      return {
        user: apiData.data.user,
        accessToken: apiData.data.session.accessToken,
        refreshToken: apiData.data.session.refreshToken,
      };
    }

    throw new Error('OAuth flow cancelled');
  } catch (error: any) {
    throw new Error(error.message || 'Google sign in failed');
  }
}

export async function signInWithGithub(): Promise<AuthSession> {
  try {
    // Start OAuth flow with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${API_URL}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Open browser for OAuth
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      `${API_URL}/auth/callback`
    );

    if (result.type === 'success') {
      // Extract token from callback URL
      const url = new URL(result.url);
      const accessToken = url.searchParams.get('access_token');

      if (!accessToken) {
        throw new Error('No access token received');
      }

      // Send to backend for verification
      const response = await fetch(`${API_URL}/api/auth/social/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      const apiData = await response.json();

      if (!apiData.ok) {
        throw new Error(apiData.error || 'Social login failed');
      }

      // Store session
      await supabase.auth.setSession({
        access_token: apiData.data.session.accessToken,
        refresh_token: apiData.data.session.refreshToken,
      });

      return {
        user: apiData.data.user,
        accessToken: apiData.data.session.accessToken,
        refreshToken: apiData.data.session.refreshToken,
      };
    }

    throw new Error('OAuth flow cancelled');
  } catch (error: any) {
    throw new Error(error.message || 'GitHub sign in failed');
  }
}




