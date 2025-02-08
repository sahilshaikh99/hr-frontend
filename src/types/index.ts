export type Role = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
} 