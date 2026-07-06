import { createClient } from '@/lib/supabase/client';
import {
  getUserProfile,
  syncUserOnLogin,
  createUserProfile,
  updateUserProfile,
} from '@/actions/auth';
import { User, LoginCredentials, RegisterData, UserRole } from '../types/auth';

export class AuthService {
  private static getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Supabase chưa được cấu hình');
    }
    return createClient();
  }

  static async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Đăng nhập thất bại');

      const user = await syncUserOnLogin(
        data.user.id,
        data.user.email!,
        data.user.user_metadata?.name
      );

      if (!user) throw new Error('Không thể tải thông tin người dùng');
      if (!user.isActive) {
        await supabase.auth.signOut();
        throw new Error('Tài khoản đã bị vô hiệu hóa');
      }

      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      throw new Error(this.getAuthErrorMessage(message));
    }
  }

  static async register(data: RegisterData): Promise<User> {
    try {
      const supabase = this.getSupabase();
      const { email, password, name, phone, role = 'user' } = data;

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) throw error;
      if (!authData.user) throw new Error('Đăng ký thất bại');

      const user = await createUserProfile({
        id: authData.user.id,
        email,
        name,
        phone,
        role,
      });

      if (!user) throw new Error('Không thể tạo hồ sơ người dùng');
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đăng ký thất bại';
      throw new Error(this.getAuthErrorMessage(message));
    }
  }

  static async signOut(): Promise<void> {
    const supabase = this.getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('Failed to sign out');
  }

  static async resetPassword(email: string): Promise<void> {
    const supabase = this.getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw new Error(this.getAuthErrorMessage(error.message));
  }

  static async updatePassword(newPassword: string): Promise<void> {
    const supabase = this.getSupabase();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(this.getAuthErrorMessage(error.message));
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = this.getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      return getUserProfile(user.id);
    } catch {
      return null;
    }
  }

  static async updateProfile(uid: string, updates: Partial<User>): Promise<void> {
    const ok = await updateUserProfile(uid, updates);
    if (!ok) throw new Error('Failed to update profile');

    if (updates.name) {
      const supabase = this.getSupabase();
      await supabase.auth.updateUser({ data: { name: updates.name } });
    }
  }

  static hasPermission(user: User | null, permission: string): boolean {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  }

  static hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  static hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      callback(null);
      return () => {};
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const user = await getUserProfile(session.user.id);
          callback(user);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });

    return () => subscription.unsubscribe();
  }

  static async createAdminUser(email: string, password: string, name: string): Promise<User> {
    return this.register({ email, password, name, role: 'admin' });
  }

  private static getAuthErrorMessage(errorCode: string): string {
    if (errorCode.includes('Invalid login credentials')) {
      return 'Email hoặc mật khẩu không chính xác';
    }
    switch (errorCode) {
      case 'User not found':
        return 'Không tìm thấy tài khoản với email này';
      case 'User already registered':
        return 'Email này đã được sử dụng';
      case 'Password should be at least 6 characters':
        return 'Mật khẩu quá yếu (tối thiểu 6 ký tự)';
      default:
        return errorCode || 'Đã xảy ra lỗi. Vui lòng thử lại';
    }
  }
}

export default AuthService;
