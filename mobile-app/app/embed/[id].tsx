import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

export default function EmbedCalculator() {
    const { id } = useLocalSearchParams();
    const [spec, setSpec] = useState<any>(null);
    const [inputs, setInputs] = useState<Record<string, number>>({});
    const [outputs, setOutputs] = useState<Record<string, number | string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCalculator();
    }, [id]);

    const fetchCalculator = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/calculators/${id}`);
            if (!response.ok) throw new Error('Calculator not found');
            const data = await response.json();
            setSpec(data.spec);

            const defaults: Record<string, number> = {};
            data.spec.inputs.forEach((input: any) => {
                if (input.defaultValue !== undefined) {
                    defaults[input.name] = input.defaultValue;
                }
            });
            setInputs(defaults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load calculator');
        } finally {
            setLoading(false);
        }
    };

    const handleCalculate = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spec: spec,
                    inputs: inputs
                }),
            });
            const results = await response.json();
            setOutputs(results);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    if (error || !spec) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{spec.title}</Text>

                <View style={styles.section}>
                    {spec.inputs.map((input: any) => (
                        <View key={input.name} style={styles.inputGroup}>
                            <Text style={styles.label}>{input.label} {input.unit && `(${input.unit})`}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={inputs[input.name]?.toString() || ''}
                                onChangeText={(text) => setInputs(prev => ({ ...prev, [input.name]: parseFloat(text) || 0 }))}
                                placeholder={input.defaultValue?.toString()}
                            />
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>

                {Object.keys(outputs).length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Results</Text>
                        {spec.outputs.map((output: any) => (
                            <View key={output.name} style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{output.label}:</Text>
                                <Text style={styles.resultValue}>
                                    {typeof outputs[output.name] === 'number'
                                        ? (outputs[output.name] as number).toLocaleString(undefined, { maximumFractionDigits: 4 })
                                        : outputs[output.name]}
                                    {output.unit && ` ${output.unit}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333', textAlign: 'center' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    inputGroup: { marginBottom: 10 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#444' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, fontSize: 14, backgroundColor: '#f9f9f9' },
    button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
    resultLabel: { fontSize: 14, color: '#666' },
    resultValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    errorText: { color: 'red', fontSize: 14 },
});
