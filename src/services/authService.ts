import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  updatePassword,
  Auth,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, LoginCredentials, RegisterData, UserRole, ROLE_PERMISSIONS } from '../types/auth';

// Collection names
const USERS_COLLECTION = 'users';

// Authentication service class
export class AuthService {
  // Sign in with email and password
  static async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');
      if (!db) throw new Error('Firebase firestore not initialized');

      const { email, password } = credentials;
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db as Firestore, USERS_COLLECTION, firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        avatar: userData.avatar,
        createdAt: userData.createdAt?.toDate(),
        lastLogin: new Date(),
        isActive: userData.isActive ?? true,
        permissions: ROLE_PERMISSIONS[userData.role] || [],
      };

      // Update last login
      await updateDoc(doc(db as Firestore, USERS_COLLECTION, firebaseUser.uid), {
        lastLogin: serverTimestamp(),
      });

      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Register new user
  static async register(data: RegisterData): Promise<User> {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');
      if (!db) throw new Error('Firebase firestore not initialized');

      const { email, password, name, phone, role = 'user' } = data;

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: name,
      });

      // Create user document in Firestore
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        role,
        phone,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        permissions: ROLE_PERMISSIONS[role] || [],
      };

      await setDoc(doc(db as Firestore, USERS_COLLECTION, firebaseUser.uid), {
        ...user,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');

      await signOut(auth as Auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');

      await sendPasswordResetEmail(auth as Auth, email);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Update user password
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');

      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Get current user profile
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!auth) return null;

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        return null;
      }

      const userDoc = await getDoc(doc(db as Firestore, USERS_COLLECTION, firebaseUser.uid));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        avatar: userData.avatar,
        createdAt: userData.createdAt?.toDate(),
        lastLogin: userData.lastLogin?.toDate(),
        isActive: userData.isActive ?? true,
        permissions: ROLE_PERMISSIONS[userData.role] || [],
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  static async updateProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      if (!db) throw new Error('Firebase firestore not initialized');

      const userRef = doc(db as Firestore, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase profile if name changed
      if (updates.name && auth && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name,
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Check if user has permission
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  }

  // Check if user has role
  static hasRole(user: User | null, role: UserRole): boolean {
    if (!user) {
      return false;
    }
    return user.role === role;
  }

  // Check if user has any of the specified roles
  static hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    if (!user) {
      return false;
    }
    return roles.includes(user.role);
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!auth || !db) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth as Auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const user = await this.getCurrentUser();
          callback(user);
        } catch (error) {
          console.error('Error in auth state change:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Create admin user (for initial setup)
  static async createAdminUser(email: string, password: string, name: string): Promise<User> {
    const adminData: RegisterData = {
      email,
      password,
      name,
      role: 'admin',
    };
    return this.register(adminData);
  }

  // Get user-friendly error messages
  private static getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Không tìm thấy tài khoản với email này';
      case 'auth/wrong-password':
        return 'Mật khẩu không chính xác';
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu (tối thiểu 6 ký tự)';
      case 'auth/invalid-email':
        return 'Email không hợp lệ';
      case 'auth/user-disabled':
        return 'Tài khoản đã bị vô hiệu hóa';
      case 'auth/too-many-requests':
        return 'Quá nhiều lần thử. Vui lòng thử lại sau';
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng';
      default:
        return 'Đã xảy ra lỗi. Vui lòng thử lại';
    }
  }
}

export default AuthService;
