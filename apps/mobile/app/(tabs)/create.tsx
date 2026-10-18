import { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { ApiResponse } from '@calc/shared';
import type { TCalculatorSpec } from '@calc/spec';
import { analytics } from '@/lib/analytics';
import { registerSuperwallPlacement, SUPERWALL_PLACEMENTS } from '@/lib/superwall-config';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function CreateScreen() {
  const [prompt, setPrompt] = useState(
    "Create a calculator for Ohm's Law (I = V/R). Inputs: V (V), R (ohm). Output: I (A)."
  );
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState<TCalculatorSpec | null>(null);

  useFocusEffect(() => {
    analytics.screen('Create', '/(tabs)/create');
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    // Check if user needs to upgrade (register Superwall placement)
    // TODO: Uncomment when Superwall SDK is installed
    // const presented = await registerSuperwallPlacement(
    //   SUPERWALL_PLACEMENTS.AI_GENERATION,
    //   { promptLength: prompt.length }
    // );
    // if (presented) {
    //   // Paywall was shown, user may have purchased
    //   return;
    // }

    try {
      setLoading(true);
      setSpec(null);

      // Track AI generation start
      analytics.aiGenerationStarted(prompt, false);

      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data: ApiResponse<{ spec: TCalculatorSpec; issues: string[] }> =
        await response.json();

      if (data.ok && data.data) {
        setSpec(data.data.spec);
        
        // Track successful generation
        analytics.aiGenerationCompleted(data.data.spec.id, true);
        
        if (data.data.issues && data.data.issues.length > 0) {
          Alert.alert(
            'Generated with Warnings',
            `Calculator generated but has ${data.data.issues.length} issue(s). Check the preview.`
          );
        }
      } else {
        // Track failed generation
        analytics.aiGenerationCompleted('', false);
        Alert.alert('Error', data.error || 'Failed to generate calculator');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate calculator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Calculator</Text>
        <Text style={styles.subtitle}>
          Describe your calculator in natural language
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Calculator Description</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          placeholder="e.g., Create a calculator for beam deflection with inputs: length (m), load (N), Young's modulus (Pa), moment of inertia (m⁴). Output: deflection (m)"
          value={prompt}
          onChangeText={setPrompt}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Calculator</Text>
          )}
        </TouchableOpacity>
      </View>

      {spec && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Generated Calculator</Text>
          <Text style={styles.previewText}>{JSON.stringify(spec, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    margin: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

