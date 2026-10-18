import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface Calculator {
    id: string;
    title: string;
    description: string;
    views: number;
    created_at: string;
    category?: string;
    tags?: string[];
}

export default function Home() {
    const [calculators, setCalculators] = useState<Calculator[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'trending' | 'recent' | 'mine'>('trending');
    const { user, signOut } = useAuth();
    const router = useRouter();

    const fetchCalculators = useCallback(async () => {
        try {
            let url = 'http://localhost:3000/api/calculators?limit=10';

            if (filter === 'mine') {
                if (!user) {
                    setCalculators([]);
                    return;
                }
                url += `&owner_id=${user.id}`;
            } else {
                url += `&sort=${filter}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setCalculators(data);
        } catch (error) {
            console.error('Error fetching calculators:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filter, user]);

    useEffect(() => {
        setLoading(true);
        fetchCalculators();
    }, [fetchCalculators]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCalculators();
    };

    const handleCreatePress = () => {
        if (!user) {
            router.push('/auth/login');
        } else {
            router.push('/create');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Calculator Creator</Text>
                {user ? (
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <Link href="/subscription" asChild>
                            <TouchableOpacity>
                                <Text style={styles.authLink}>Upgrade</Text>
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity onPress={signOut}>
                            <Text style={styles.authLink}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Link href="/auth/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.authLink}>Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
                <Text style={styles.createButtonText}>+ Create New Calculator</Text>
            </TouchableOpacity>

            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setFilter('trending')} style={[styles.tab, filter === 'trending' && styles.activeTab]}>
                    <Text style={[styles.tabText, filter === 'trending' && styles.activeTabText]}>Trending</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('recent')} style={[styles.tab, filter === 'recent' && styles.activeTab]}>
                    <Text style={[styles.tabText, filter === 'recent' && styles.activeTabText]}>Recent</Text>
                </TouchableOpacity>
                {user && (
                    <TouchableOpacity onPress={() => setFilter('mine')} style={[styles.tab, filter === 'mine' && styles.activeTab]}>
                        <Text style={[styles.tabText, filter === 'mine' && styles.activeTabText]}>My Calcs</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {calculators.length === 0 ? (
                        <Text style={styles.emptyText}>
                            {filter === 'mine' ? "You haven't created any calculators yet." : "No calculators found."}
                        </Text>
                    ) : (
                        calculators.map((calc) => (
                            <Link key={calc.id} href={`/calculator/${calc.id}`} asChild>
                                <TouchableOpacity style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{calc.title}</Text>
                                        {calc.category && <Text style={styles.categoryBadge}>{calc.category}</Text>}
                                    </View>
                                    <Text style={styles.cardDesc} numberOfLines={2}>{calc.description}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.stats}>{calc.views} views</Text>
                                        {calc.tags && calc.tags.length > 0 && (
                                            <Text style={styles.tags}>{calc.tags.slice(0, 2).join(', ')}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    authLink: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
    createButton: { backgroundColor: '#007AFF', marginHorizontal: 20, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    createButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
    tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e0e0e0' },
    activeTab: { backgroundColor: '#333' },
    tabText: { color: '#666', fontWeight: '600' },
    activeTabText: { color: '#fff' },
    list: { paddingHorizontal: 20, paddingBottom: 20, gap: 15 },
    emptyText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
    categoryBadge: { fontSize: 12, color: '#007AFF', backgroundColor: '#e6f2ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
    cardDesc: { fontSize: 14, color: '#666', marginBottom: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    stats: { fontSize: 12, color: '#888' },
    tags: { fontSize: 12, color: '#888', fontStyle: 'italic' },
});
