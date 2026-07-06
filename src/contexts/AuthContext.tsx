import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import AuthService from '../services/authService';

// Auth context interface
interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(user => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    return unsubscribe;
  }, []);

  // Sign in function
  const signIn = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await AuthService.signIn(credentials);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Đăng nhập thất bại',
      }));
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await AuthService.register(data);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Đăng ký thất bại',
      }));
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signOut();
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Đăng xuất thất bại',
      }));
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await AuthService.resetPassword(email);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Gửi email đặt lại mật khẩu thất bại',
      }));
      throw error;
    }
  };

  // Update password function
  const updatePassword = async (newPassword: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await AuthService.updatePassword(newPassword);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Cập nhật mật khẩu thất bại',
      }));
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!state.user) {
        throw new Error('No authenticated user');
      }

      setState(prev => ({ ...prev, error: null }));
      await AuthService.updateProfile(state.user.uid, updates);

      // Update local state
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Cập nhật thông tin thất bại',
      }));
      throw error;
    }
  };

  // Permission check function
  const hasPermission = (permission: string): boolean => {
    return AuthService.hasPermission(state.user, permission);
  };

  // Role check function
  const hasRole = (role: string): boolean => {
    return AuthService.hasRole(state.user, role as any);
  };

  // Multiple roles check function
  const hasAnyRole = (roles: string[]): boolean => {
    return AuthService.hasAnyRole(state.user, roles as any);
  };

  // Clear error function
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    signIn,
    register,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    hasPermission,
    hasRole,
    hasAnyRole,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for components that require authentication
export const withAuth = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  return (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login');
      }
    }, [loading, router, user]);

    if (loading) {
      return <div>Đang tải...</div>;
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
