import { useState, useEffect, useRef } from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { analytics } from '@/lib/analytics';
import { registerSuperwallPlacement, SUPERWALL_PLACEMENTS } from '@/lib/superwall-config';
import type { ApiResponse } from '@calc/shared';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function TutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Check subscription and show paywall if needed
    if (!user || !['pro', 'business'].includes(user.subscriptionTier)) {
      // Register Superwall placement for tutoring access
      registerSuperwallPlacement(SUPERWALL_PLACEMENTS.TUTORING_ACCESS, {
        calculatorId: id,
      }).then((presented) => {
        if (!presented) {
          // Paywall not shown (user in holdout or already subscribed)
          // Show alert for free users
          Alert.alert(
            'Subscription Required',
            'Tutoring is available for Pro and Business subscribers.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
        // If paywall was presented, user may have purchased
      });
    }
  }, [user, id]);

  useFocusEffect(() => {
    analytics.screen('Tutor Chat', `/calculator/${id}/tutor`);
    if (user && ['pro', 'business'].includes(user.subscriptionTier)) {
      analytics.tutoringStarted(id);
    }
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input.trim();
    setInput('');
    setLoading(true);

    // Track tutoring message
    analytics.tutoringMessageSent(id, messageContent.length);

    try {
      const response = await fetch(`${API_URL}/api/tutoring/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add auth token
        },
        body: JSON.stringify({
          calculatorId: id,
          message: userMessage.content,
          sessionId,
        }),
      });

      const data: ApiResponse<{
        sessionId: string;
        message: string;
        role: string;
      }> = await response.json();

      if (data.ok && data.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSessionId(data.data.sessionId);

        // Scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        Alert.alert('Error', data.error || 'Failed to get response');
        setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Network error');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Tutor</Text>
        <Text style={styles.subtitle}>Get step-by-step help with this calculator</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              👋 Hi! I'm your AI tutor. Ask me anything about this calculator:
            </Text>
            <Text style={styles.welcomeExamples}>
              • How do I use this calculator?{'\n'}
              • What do these inputs mean?{'\n'}
              • Explain the formula{'\n'}
              • Give me an example
            </Text>
          </View>
        )}

        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text style={styles.messageRole}>
              {message.role === 'user' ? 'You' : 'Tutor'}
            </Text>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question..."
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  welcomeContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1976d2',
  },
  welcomeExamples: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

