import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { UserManagement } from '../pages/UserManagement';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { logout } from '../features/auth/authThunks';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, checking } = useAuth();

  // while we're checking auth/profile, avoid redirecting to login
  if (loading || checking) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '250px',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Admin Dashboard</h2>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link
                to="/dashboard"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  backgroundColor: window.location.pathname === '/dashboard' ? '#374151' : 'transparent',
                }}
              >
                📊 Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                to="/users"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  backgroundColor: window.location.pathname === '/users' ? '#374151' : 'transparent',
                }}
              >
                👥 Users
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile moved to header (top-right) */}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Top header with profile and logout */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '16px 24px',
            gap: '12px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: 'white',
          }}
        >
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            />
          )}
          <div style={{ textAlign: 'right', marginRight: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{user?.role}</div>
          </div>
          <button
            onClick={async () => {
              try {
                await dispatch(logout()).unwrap();
              } catch {
                // ignore errors
              }
              navigate('/login');
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};