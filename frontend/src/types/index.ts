export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  newSignups: number;
  activeSessions: number;
  growthPercentage: number;
  systemStatus: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
}