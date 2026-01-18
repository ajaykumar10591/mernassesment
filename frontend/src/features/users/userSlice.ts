import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UsersState, User } from '../../types';
import { apiClient } from '../../utils/api';

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page?: number; limit?: number; search?: string; sort?: string; order?: string } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    const response = await apiClient.get<{
      users: User[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/users?${queryParams}`);
    return response;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: { name: string; email: string; role?: string }) => {
    const response = await apiClient.post<{ user: User; message: string }>('/users', userData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    const response = await apiClient.put<{ user: User; message: string }>(`/users/${id}`, userData);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    await apiClient.delete(`/users/${id}`);
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload.user);
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.user.id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;