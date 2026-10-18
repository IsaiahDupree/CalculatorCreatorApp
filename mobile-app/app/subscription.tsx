import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../lib/supabase';

export default function Subscription() {
    const { user, session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentTier, setCurrentTier] = useState('free');

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user?.id)
            .single();
        if (data) {
            setCurrentTier(data.subscription_tier);
        }
    };

    const handleUpgrade = async (priceId: string) => {
        if (!session) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (data.url) {
                await WebBrowser.openBrowserAsync(data.url);
                // Refresh profile after returning
                fetchProfile();
            } else {
                Alert.alert('Error', data.error || 'Failed to start checkout');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Replace with your actual Stripe Price IDs
    const PRO_PRICE_ID = 'price_1234567890';
    const BUSINESS_PRICE_ID = 'price_0987654321';

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Subscription Plans</Text>
            <Text style={styles.subtitle}>Current Plan: {currentTier.toUpperCase()}</Text>

            <View style={styles.card}>
                <Text style={styles.planName}>Free</Text>
                <Text style={styles.price}>$0/mo</Text>
                <Text style={styles.feature}>• 3 Calculators / month</Text>
                <Text style={styles.feature}>• Public access</Text>
                {currentTier === 'free' && <Text style={styles.currentBadge}>Current</Text>}
            </View>

            <View style={styles.card}>
                <Text style={styles.planName}>Pro</Text>
                <Text style={styles.price}>$12/mo</Text>
                <Text style={styles.feature}>• Unlimited Calculators</Text>
                <Text style={styles.feature}>• Priority AI Generation</Text>
                {currentTier === 'pro' ? (
                    <Text style={styles.currentBadge}>Current</Text>
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleUpgrade(PRO_PRICE_ID)}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Upgrade to Pro</Text>}
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.planName}>Business</Text>
                <Text style={styles.price}>$39/mo</Text>
                <Text style={styles.feature}>• Everything in Pro</Text>
                <Text style={styles.feature}>• API Access</Text>
                <Text style={styles.feature}>• Private Calculators</Text>
                {currentTier === 'business' ? (
                    <Text style={styles.currentBadge}>Current</Text>
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleUpgrade(BUSINESS_PRICE_ID)}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Upgrade to Business</Text>}
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#666' },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    planName: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    price: { fontSize: 20, color: '#007AFF', marginBottom: 15, fontWeight: '600' },
    feature: { fontSize: 16, marginBottom: 5, color: '#444' },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    currentBadge: { marginTop: 15, textAlign: 'center', color: '#28a745', fontWeight: 'bold', fontSize: 16 },
});
