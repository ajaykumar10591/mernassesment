import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { googleLogin } from '../features/auth/authThunks';
import { toast } from '../utils/toast';
import { setUser } from '../features/auth/authSlice';

declare global {
  interface Window {
    google: any;
  }
}

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.show(error, 'error');
    }
  }, [error]);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: 300,
        }
      );
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      const result = await dispatch(googleLogin(response.credential));
      if (googleLogin.fulfilled.match(result)) {
        // Ensure local auth state is set immediately from the response payload
        if (result.payload && (result.payload as any).user) {
          dispatch(setUser((result.payload as any).user));
        }
        toast.show('Login successful!', 'success');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.show('Login failed', 'error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1f2937',
          }}
        >
          Admin Dashboard
        </h1>
        
        <p
          style={{
            color: '#6b7280',
            marginBottom: '32px',
            fontSize: '16px',
          }}
        >
          Sign in to access your dashboard
        </p>

        <div
          id="google-signin-button"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        />

        {loading && (
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            Signing you in...
          </div>
        )}

        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          <p>
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};