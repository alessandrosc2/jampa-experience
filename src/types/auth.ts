import { User, AccessStatus, AccessType } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isVip: boolean;
  isLoading: boolean;
  error: string | null;
}
