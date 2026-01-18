import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Dashboard } from '../src/pages/Dashboard';
import authReducer from '../src/features/auth/authSlice';
import { apiClient } from '../utils/api';

// Mock the API client
jest.mock('../utils/api');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

const createMockStore = (user = null) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user,
        isAuthenticated: !!user,
        loading: false,
        error: null,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, user = null) => {
  const store = createMockStore(user);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Dashboard Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin' as const,
  };

  const mockStats = {
    stats: {
      totalUsers: 150,
      activeSessions: 45,
      newSignups: 12,
      systemStatus: 'Operational'
    }
  };

  beforeEach(() => {
    // Mock the API response
    mockApiClient.get.mockResolvedValue(mockStats);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with user name', async () => {
    renderWithProviders(<Dashboard />, mockUser);
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
    });
    expect(screen.getByText('Here\'s what\'s happening with your admin dashboard today.')).toBeInTheDocument();
  });

  it('displays stat cards', async () => {
    renderWithProviders(<Dashboard />, mockUser);
    
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
    expect(screen.getByText('New Signups')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });

  it('displays quick actions', async () => {
    renderWithProviders(<Dashboard />, mockUser);
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
  });
});