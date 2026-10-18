import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { TCalculatorSpec } from '@calc/spec';
import type { ApiResponse } from '@calc/shared';
import { analytics } from '@/lib/analytics';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function CalculatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [calculator, setCalculator] = useState<TCalculatorSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    loadCalculator();
  }, [id]);

  useFocusEffect(() => {
    if (calculator) {
      analytics.screen('Calculator Detail', `/calculator/${id}`);
      analytics.calculatorViewed(id, calculator.title, 'direct', calculator.category);
    }
  });

  const loadCalculator = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/calculators/${id}`);
      const data: ApiResponse<any> = await response.json();

      if (data.ok && data.data) {
        setCalculator(data.data.spec);
        // Set default values
        const defaults: Record<string, any> = {};
        data.data.spec.inputs.forEach((input: any) => {
          if (input.default !== undefined) {
            defaults[input.id] = input.default;
          }
        });
        setInputs(defaults);
      } else {
        Alert.alert('Error', data.error || 'Failed to load calculator');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Network error');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!calculator) return;

    // Validate required inputs
    for (const input of calculator.inputs) {
      if (input.required && (inputs[input.id] === undefined || inputs[input.id] === '')) {
        Alert.alert('Error', `Please fill in ${input.label}`);
        return;
      }
    }

    try {
      setEvaluating(true);
      const startTime = Date.now();
      const response = await fetch(`${API_URL}/api/calculators/${id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });

      const data: ApiResponse<any> = await response.json();
      const duration = Date.now() - startTime;

      if (data.ok && data.data) {
        setResults(data.data);
        // Track successful evaluation
        analytics.calculatorEvaluated(id, true, duration);
      } else {
        // Track failed evaluation
        analytics.calculatorEvaluated(id, false, duration, data.error);
        Alert.alert('Error', data.error || 'Failed to evaluate');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Network error');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading calculator...</Text>
      </View>
    );
  }

  if (!calculator) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Calculator not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{calculator.title}</Text>
        {calculator.summary && (
          <Text style={styles.summary}>{calculator.summary}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inputs</Text>
        {calculator.inputs.map((input) => (
          <View key={input.id} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {input.label}
              {input.unit && ` (${input.unit})`}
              {input.required && ' *'}
            </Text>
            {input.description && (
              <Text style={styles.inputDescription}>{input.description}</Text>
            )}
            <TextInput
              style={styles.input}
              value={inputs[input.id]?.toString() || ''}
              onChangeText={(text) => {
                const num = parseFloat(text);
                setInputs({
                  ...inputs,
                  [input.id]: isNaN(num) ? text : num,
                });
              }}
              keyboardType="numeric"
              placeholder={input.default?.toString() || 'Enter value'}
            />
            {input.min !== undefined && input.max !== undefined && (
              <Text style={styles.inputHint}>
                Range: {input.min} - {input.max}
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, styles.evaluateButton]}
          onPress={handleEvaluate}
          disabled={evaluating}
        >
          {evaluating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Calculate</Text>
          )}
        </TouchableOpacity>
      </View>

      {results && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>
          {results.errors && results.errors.length > 0 && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Errors:</Text>
              {results.errors.map((error: string, i: number) => (
                <Text key={i} style={styles.errorText}>{error}</Text>
              ))}
            </View>
          )}
          {results.warnings && results.warnings.length > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>Warnings:</Text>
              {results.warnings.map((warning: string, i: number) => (
                <Text key={i} style={styles.warningText}>{warning}</Text>
              ))}
            </View>
          )}
          {results.outputs && (
            <View style={styles.results}>
              {calculator.outputs.map((output) => {
                const value = results.outputs[output.id];
                if (value === undefined) return null;
                return (
                  <View key={output.id} style={styles.resultItem}>
                    <Text style={styles.resultLabel}>
                      {output.label}
                      {output.unit && ` (${output.unit})`}
                    </Text>
                    <Text style={styles.resultValue}>
                      {typeof value === 'number'
                        ? value.toPrecision(output.precision || 6)
                        : value}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {calculator.examples && calculator.examples.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Examples</Text>
          {calculator.examples.map((example, i) => (
            <TouchableOpacity
              key={i}
              style={styles.exampleCard}
              onPress={() => {
                setInputs(example.inputs);
                setResults(null);
              }}
            >
              <Text style={styles.exampleTitle}>Example {i + 1}</Text>
              {example.description && (
                <Text style={styles.exampleDescription}>{example.description}</Text>
              )}
              <Text style={styles.exampleText}>
                {JSON.stringify(example.inputs, null, 2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tutoring Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.tutorButton}
          onPress={() => {
            analytics.buttonClicked('Get Tutoring', 'calculator_detail');
            analytics.tutoringStarted(id);
            router.push(`/calculator/${id}/tutor`);
          }}
        >
          <Text style={styles.tutorButtonText}>💡 Get AI Tutoring Help</Text>
          <Text style={styles.tutorButtonSubtext}>
            Step-by-step guidance (Pro/Business)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  evaluateButton: {
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    marginTop: 16,
  },
  resultItem: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#f57c00',
  },
  exampleCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exampleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  tutorButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  tutorButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tutorButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
});

