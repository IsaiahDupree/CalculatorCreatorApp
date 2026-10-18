import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, KeyboardAvoidingView, Platform } from 'react-native';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface TutorChatProps {
    visible: boolean;
    onClose: () => void;
    context: any;
}

export default function TutorChat({ visible, onClose, context }: TutorChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    context: context
                }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message.content }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>AI Tutor</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.length === 0 && (
                        <Text style={styles.emptyText}>Ask me anything about this calculator! I can explain the formulas, units, or concepts.</Text>
                    )}
                    {messages.map((msg, index) => (
                        <View key={index} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                            <Text style={[styles.messageText, msg.role === 'user' ? styles.userText : styles.assistantText]}>{msg.content}</Text>
                        </View>
                    ))}
                    {loading && (
                        <View style={styles.loadingBubble}>
                            <ActivityIndicator size="small" color="#666" />
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask a question..."
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
    title: { fontSize: 18, fontWeight: 'bold' },
    close: { color: '#007AFF', fontSize: 16 },
    chatContainer: { flex: 1 },
    chatContent: { padding: 20, gap: 15 },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontStyle: 'italic' },
    messageBubble: { padding: 12, borderRadius: 16, maxWidth: '80%' },
    userBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    assistantBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 16 },
    userText: { color: '#fff' },
    assistantText: { color: '#333' },
    loadingBubble: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#fff', borderRadius: 16 },
    inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center', gap: 10 },
    input: { flex: 1, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 20, fontSize: 16 },
    sendButton: { padding: 10 },
    sendText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
});
