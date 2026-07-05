import { Timestamp } from 'firebase/firestore';

// Base interface for all Firestore documents
export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Class interface for Firestore
export interface FirestoreClass extends FirestoreDocument {
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'Cơ bản' | 'Nâng cao' | 'Chuyên sâu';
  subjects: string[];
  features: string[];
  image: string;
  isActive: boolean;
  instructor?: string;
  maxStudents?: number;
  startDate?: Timestamp;
  endDate?: Timestamp;
  schedule?: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    time: string; // "19:00-21:00"
  }[];
}

// Alias for backward compatibility
export type FirestoreCourse = FirestoreClass;

// Registration interface for Firestore
export interface FirestoreRegistration extends FirestoreDocument {
  userId?: string; // Optional for guest registrations

  // Registration type - NEW FIELD
  type: 'class' | 'tutor_teacher' | 'tutor_student';

  classId?: string;
  className?: string; // ← THÊM TRƯỜNG NÀY
  classSchedule?: string; // ← THÊM TRƯỜNG NÀY
  studentName: string;
  studentPhone: string;
  studentSchool: string; // Trường học của học viên
  parentName: string;
  parentPhone: string;
  parentAddress: string; // Địa chỉ phụ huynh (đổi từ address)
  preferredSchedule: string;
  notes?: string; // Mô tả lực học từ academicDescription
  status:
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'cancelled'
    | 'completed'
    | 'matched'
    | 'trial_scheduled';
  approvedBy?: string; // Admin/Staff UID who approved
  approvedByName?: string; // Tên người xử lý
  approvedAt?: Timestamp;
  rejectionReason?: string;

  // For tutor registrations
  tutorType?: 'teacher' | 'student';
  tutorCriteria?: string;
  matchedTutorId?: string;
  matchedTutorName?: string;
  matchedAt?: Timestamp;
  trialScheduledAt?: Timestamp;
  staffNotes?: string;
}

// Inquiry interface for Firestore
export interface FirestoreInquiry extends FirestoreDocument {
  userId?: string; // Optional for guest inquiries
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // Staff UID
  assignedAt?: Timestamp;
  responseRequired: boolean;
  // Response tracking
  responses?: {
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Timestamp;
    isStaff: boolean;
  }[];
  resolvedAt?: Timestamp;
  resolvedBy?: string;
  tags?: string[];
}

// Schedule interface for Firestore
export interface FirestoreSchedule extends FirestoreDocument {
  classId: string;
  instructorId: string;
  instructorName: string;
  date: Timestamp;
  startTime: string; // "19:00"
  endTime: string; // "21:00"
  location: string;
  maxStudents: number;
  enrolledStudents: string[]; // Array of registration IDs
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  // Attendance tracking
  attendance?: {
    registrationId: string;
    studentName: string;
    status: 'present' | 'absent' | 'late';
    notes?: string;
  }[];
}

// Analytics interface for Firestore
export interface FirestoreAnalytics extends FirestoreDocument {
  type: 'page_view' | 'class_view' | 'registration' | 'inquiry' | 'user_action';
  data: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Timestamp;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    ip?: string;
    location?: {
      country?: string;
      city?: string;
    };
  };
}

// User statistics interface
export interface FirestoreUserStats extends FirestoreDocument {
  userId: string;
  totalClasses: number;
  completedClasses: number;
  activeClasses: number;
  totalPayments: number;
  lastActivity: Timestamp;
  achievements?: string[];
  preferences?: {
    subjects?: string[];
    preferredTime?: string[];
    notifications?: boolean;
  };
}

// System settings interface
export interface FirestoreSettings extends FirestoreDocument {
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  lastModifiedBy: string;
}

// Tutors collection interface
export interface FirestoreTutor extends FirestoreDocument {
  name: string;
  email?: string;
  phone?: string;
  specialty: string;
  bio: string;
  experience: string;
  education: string;
  imageUrl: string;
  subjects: string[];
  availability: string[];
  isActive: boolean;
  hourlyRate?: number;
  rating?: number;
  totalStudents?: number;
}

// TutorRequest interface for Firestore
export interface FirestoreTutorRequest extends FirestoreDocument {
  // Thông tin cơ bản
  tutorType: 'teacher' | 'student';

  // Thông tin học viên
  studentName: string;
  studentPhone: string;
  studentSchool: string;
  academicDescription?: string; // Mô tả lực học

  // Thông tin phụ huynh
  parentName: string;
  parentPhone: string;
  parentAddress: string;

  // Yêu cầu gia sư
  tutorCriteria: string; // Mô tả tiêu chí tìm gia sư
  subjects?: string[]; // Môn học cần học
  preferredSchedule?: string; // Lịch mong muốn
  budget?: number; // Ngân sách dự kiến

  // Trạng thái xử lý
  status:
    | 'pending'
    | 'consulting'
    | 'searching'
    | 'matched'
    | 'trial_scheduled'
    | 'confirmed'
    | 'cancelled';
  priority: 'high' | 'medium' | 'low';

  // Xử lý bởi staff
  assignedStaffId?: string;
  assignedStaffName?: string;
  staffNotes?: string;

  // Ghép đôi gia sư
  matchedTutorId?: string;
  matchedTutorName?: string;
  matchedAt?: Timestamp;

  // Lịch dạy thử
  trialScheduledAt?: Timestamp;
  trialCompletedAt?: Timestamp;
  trialFeedback?: string;

  // Xác nhận chính thức
  confirmedAt?: Timestamp;
  contractStartDate?: Timestamp;

  // Metadata
  source: 'website' | 'phone' | 'referral'; // Nguồn yêu cầu
  rejectionReason?: string;
}

// Collection names constants
export const COLLECTIONS = {
  USERS: 'users',
  CLASSES: 'classes',
  COURSES: 'courses', // Alias for backward compatibility
  REGISTRATIONS: 'registrations',
  INQUIRIES: 'inquiries',
  SCHEDULES: 'schedules',
  ANALYTICS: 'analytics',
  USER_STATS: 'userStats',
  SETTINGS: 'settings',
  TUTORS: 'tutors',
  TUTOR_REQUESTS: 'tutorRequests',
} as const;

// Firestore converter helper type
export type FirestoreConverter<T> = {
  toFirestore: (data: Partial<T>) => Record<string, any>;
  fromFirestore: (snapshot: any) => T;
};
