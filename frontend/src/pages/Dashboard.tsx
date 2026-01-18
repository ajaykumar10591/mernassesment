import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { apiClient } from '../utils/api';
import { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ stats: DashboardStats }>('/users/stats');
        setStats(response.stats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Here's what's happening with your admin dashboard today.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Total Users
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats?.totalUsers || 0}
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {stats?.growthPercentage ? `${stats.growthPercentage > 0 ? '+' : ''}${stats.growthPercentage}%` : '+0%'} from last month
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Active Sessions
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            {stats?.activeSessions || 0}
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Real-time count
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            New Signups
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats?.newSignups || 0}
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Today
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            System Status
          </h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
            {stats?.systemStatus === 'operational' ? 'All Systems Operational' : 'Checking...'}
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Last checked: Just now
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
          Quick Actions
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
            onClick={() => window.location.href = '/users'}
          >
            Manage Users
          </button>
          
          <button
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            View Reports
          </button>
          
          <button
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            System Settings
          </button>
        </div>
      </div>
    </div>
  );
};