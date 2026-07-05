import { User as FirebaseUser } from 'firebase/auth';

// User roles in the system
export type UserRole = 'user' | 'staff' | 'admin';

// Extended user interface with role and profile information
export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  permissions?: string[];
}

// Authentication context state
export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
}

// Role permissions
export interface RolePermissions {
  [key: string]: string[];
}

// Permission constants
export const PERMISSIONS = {
  // Course management
  VIEW_COURSES: 'view_courses',
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',

  // Registration management
  VIEW_REGISTRATIONS: 'view_registrations',
  APPROVE_REGISTRATION: 'approve_registration',
  CANCEL_REGISTRATION: 'cancel_registration',

  // Inquiry management
  VIEW_INQUIRIES: 'view_inquiries',
  RESPOND_INQUIRY: 'respond_inquiry',
  RESOLVE_INQUIRY: 'resolve_inquiry',

  // Schedule management
  VIEW_SCHEDULES: 'view_schedules',
  CREATE_SCHEDULE: 'create_schedule',
  EDIT_SCHEDULE: 'edit_schedule',
  DELETE_SCHEDULE: 'delete_schedule',

  // User management
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',

  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',

  // System administration
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_LOGS: 'view_logs',
} as const;

// Default role permissions
export const ROLE_PERMISSIONS: RolePermissions = {
  user: [PERMISSIONS.VIEW_COURSES],
  staff: [
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_REGISTRATIONS,
    PERMISSIONS.APPROVE_REGISTRATION,
    PERMISSIONS.CANCEL_REGISTRATION,
    PERMISSIONS.VIEW_INQUIRIES,
    PERMISSIONS.RESPOND_INQUIRY,
    PERMISSIONS.RESOLVE_INQUIRY,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULE,
    PERMISSIONS.EDIT_SCHEDULE,
  ],
  admin: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],
};

// Auth error types
export interface AuthError {
  code: string;
  message: string;
}

// Login response
export interface LoginResponse {
  user: User;
  token?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}
