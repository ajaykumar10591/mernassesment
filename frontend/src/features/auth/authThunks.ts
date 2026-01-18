import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utils/api';
import { User } from '../../types';

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ user: User; message: string; accessToken?: string }>('/auth/google', { token });
      // If backend returned an access token, set it on the api client and persist
      if ((response as any).accessToken) {
        apiClient.setAuthToken((response as any).accessToken);
        try {
          localStorage.setItem('accessToken', (response as any).accessToken);
        } catch {
          // ignore storage errors
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/profile');
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/auth/logout');
      // Clear any stored token and headers
      apiClient.setAuthToken(null);
      try { localStorage.removeItem('accessToken'); } catch {}
      return {};
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);