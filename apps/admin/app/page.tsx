'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface DashboardStats {
  totalUsers: number;
  totalCalculators: number;
  totalRuns: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingCalculators: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual admin API endpoints
      // For now, using placeholder data
      const mockStats: DashboardStats = {
        totalUsers: 1250,
        totalCalculators: 342,
        totalRuns: 15420,
        totalRevenue: 12500,
        activeSubscriptions: 89,
        pendingCalculators: 12,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const userGrowthData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    users: Math.floor(Math.random() * 50) + 20,
  }));

  const calculatorData = [
    { name: 'Published', value: 280, color: '#4CAF50' },
    { name: 'Pending', value: 12, color: '#FF9800' },
    { name: 'Draft', value: 50, color: '#9E9E9E' },
  ];

  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    month: format(subDays(new Date(), (11 - i) * 30), 'MMM'),
    revenue: Math.floor(Math.random() * 5000) + 2000,
  }));

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#666' }}>Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard title="Total Users" value={stats?.totalUsers || 0} />
        <StatCard title="Calculators" value={stats?.totalCalculators || 0} />
        <StatCard title="Total Runs" value={stats?.totalRuns || 0} />
        <StatCard title="Revenue" value={`$${stats?.totalRevenue || 0}`} />
        <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions || 0} />
        <StatCard title="Pending Reviews" value={stats?.pendingCalculators || 0} />
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* User Growth */}
        <ChartCard title="User Growth (Last 30 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#007AFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Calculator Status */}
        <ChartCard title="Calculator Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculatorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {calculatorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue */}
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Recent Activity</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ActivityItem title="New User" value="John Doe" time="2 hours ago" />
          <ActivityItem title="Calculator Published" value="Beam Deflection" time="5 hours ago" />
          <ActivityItem title="Subscription" value="Pro Plan" time="1 day ago" />
          <ActivityItem title="Revenue Share" value="$125.50" time="2 days ago" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
      {children}
    </div>
  );
}

function ActivityItem({ title, value, time }: { title: string; value: string; time: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
        minWidth: '200px',
      }}
    >
      <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{title}</p>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{value}</p>
      <p style={{ color: '#999', fontSize: '0.75rem' }}>{time}</p>
    </div>
  );
}




