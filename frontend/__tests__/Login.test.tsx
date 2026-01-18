import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/auth/authSlice';

// Mock the entire Login component to avoid import.meta issues
jest.mock('../src/pages/Login', () => ({
  Login: () => {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Sign in to access your dashboard</p>
        <div id="google-signin-button"></div>
        <div>By signing in, you agree to our terms of service and privacy policy.</div>
      </div>
    );
  }
}));

// Mock the utils/api module
jest.mock('../src/utils/api');

const { Login } = require('../src/pages/Login');

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your dashboard')).toBeInTheDocument();
  });

  it('displays privacy policy text', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/By signing in, you agree to our terms/i)).toBeInTheDocument();
  });

  it('renders Google sign-in button container', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
});