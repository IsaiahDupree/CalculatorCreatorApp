import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function CreateCalculator() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, session } = useAuth();

    useEffect(() => {
        if (!user) {
            Alert.alert('Authentication Required', 'You must be logged in to create a calculator.');
            router.replace('/auth/login');
        }
    }, [user]);

    const handleCreate = async () => {
        if (!prompt.trim()) return;
        if (!session) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/calculator/${data.id}`);
            } else {
                Alert.alert('Error', data.error || 'Failed to generate calculator');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Describe the calculator you want to build:</Text>
            <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="e.g. A mortgage calculator with interest rate, loan amount, and term in years..."
                value={prompt}
                onChangeText={setPrompt}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Generate with AI</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.hint}>
                Our AI will generate the inputs, outputs, and formulas automatically.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
        backgroundColor: '#f9f9f9',
        marginBottom: 20
    },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    hint: { marginTop: 20, color: '#666', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
});
