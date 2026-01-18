import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchUsers, createUser, updateUser, deleteUser } from '../features/users/userSlice';
import { DynamicTable } from '../components/DynamicTable';
import { DynamicForm } from '../components/DynamicForm';
import { TableColumn, FormField, User } from '../types';
import { toast } from '../utils/toast';

export const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, pagination } = useSelector((state: RootState) => state.users);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: 'createdAt', order: 'desc' as 'asc' | 'desc' });

  React.useEffect(() => {
    dispatch(fetchUsers({
      page: pagination.page,
      limit: pagination.limit,
      search: searchQuery,
      sort: sortConfig.key,
      order: sortConfig.order,
    }));
  }, [dispatch, pagination.page, searchQuery, sortConfig]);

  const handleCreateUser = async (userData: any) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      toast.show('User created successfully!', 'success');
      setShowCreateForm(false);
      dispatch(fetchUsers({}));
    } catch (error) {
      toast.show('Failed to create user', 'error');
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;

    // Ensure we have a proper string id (support _id fallback)
    const id = (editingUser as any).id || ((editingUser as any)._id ? (editingUser as any)._id.toString() : undefined);
    if (!id) {
      toast.show('Invalid user id', 'error');
      return;
    }

    try {
      await dispatch(updateUser({ id, userData })).unwrap();
      toast.show('User updated successfully!', 'success');
      setEditingUser(null);
      dispatch(fetchUsers({}));
    } catch (error: any) {
      toast.show(error?.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.show('User deleted successfully!', 'success');
      dispatch(fetchUsers({}));
    } catch (error) {
      toast.show('Failed to delete user', 'error');
    }
  };

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    setSortConfig({ key, order });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({
      page,
      limit: pagination.limit,
      search: searchQuery,
      sort: sortConfig.key,
      order: sortConfig.order,
    }));
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: value === 'admin' ? '#dbeafe' : '#f3f4f6',
            color: value === 'admin' ? '#1e40af' : '#374151',
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentUser?.role === 'admin' ? (
            <>
              <button
                onClick={() => setEditingUser({ ...(row as any), id: (row as any).id || ((row as any)._id ? (row as any)._id.toString() : undefined) })}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  const rowId = (row as any).id || ((row as any)._id ? (row as any)._id.toString() : undefined);
                  handleDeleteUser(rowId);
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Enter user name',
    },
    {
      name: 'fname',
      type: 'text',
      label: 'Father Name',
      required: true,
      placeholder: 'Enter Father name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      placeholder: 'Enter email address',
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Please enter a valid email address',
      },
    },
    {
      name: 'mobile',
      type: 'tel',
      label: 'Mobile Number',
      required: true,
      placeholder: 'Enter mobile number',
      validation: {
        pattern: '^[6-9]\\d{9}$',
        message: 'Please enter a valid 10-digit mobile number',
      },
    },
    {
      name: 'pincode',
      type: 'text',
      label: 'pin code',
      required: true,
      placeholder: 'Enter pin code',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: true,
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>User Management</h1>
        
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowCreateForm(true)}
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
          >
            Create User
          </button>
        )}
      </div>

      <DynamicTable
        columns={columns}
        data={users}
        loading={loading}
        pagination={pagination}
        onSort={handleSort}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
      />

      {/* Create User Modal */}
      {showCreateForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <h2 style={{ marginBottom: '16px' }}>Create New User</h2>
            <DynamicForm
              fields={formFields}
              onSubmit={handleCreateUser}
              submitText="Create User"
            />
            <button
              onClick={() => setShowCreateForm(false)}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <h2 style={{ marginBottom: '16px' }}>Edit User</h2>
            <DynamicForm
              fields={formFields}
              onSubmit={handleUpdateUser}
              initialData={editingUser}
              submitText="Update User"
            />
            <button
              onClick={() => setEditingUser(null)}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};