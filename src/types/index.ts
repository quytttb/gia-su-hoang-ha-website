// Center information types
export interface CenterInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  history: string;
  mission: string;
  vision: string;
  slogan: string;
  workingHours: WorkingHours;
}

export interface WorkingHours {
  weekdays: string;
  weekend: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Team types
export interface Tutor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
}

// Class types
export interface Class {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  schedule: string;
  price: number;
  discount?: number;
  discountEndDate?: string;
  imageUrl: string;
  featured: boolean;
  category: string;
  isActive?: boolean;
}

// Schedule types
export interface Schedule {
  id: string;
  classId: string;
  className: string;
  startDate: string; // Ngày khai giảng lớp học (ISO string)
  startTime: string; // Giờ bắt đầu (VD: "08:00")
  endTime: string; // Giờ kết thúc (VD: "10:00")
  tutorId: string; // ID tham chiếu đến collection tutors
  tutorName: string; // Tên giáo viên (denormalized)
  maxStudents: number; // Cố định 12
  studentPhones: string[]; // Danh sách SĐT học viên
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'; // Trạng thái lớp học
  studentIds?: string[];
}

// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  registrations?: Registration[];
  inquiries?: Inquiry[];
}

export interface Registration {
  id: string;
  userId?: string; // Optional for guest registrations

  // Registration type - NEW FIELD
  type: 'class' | 'tutor_teacher' | 'tutor_student';

  // For class registrations
  classId?: string;
  className?: string;

  // For tutor registrations - NEW FIELDS
  tutorType?: 'teacher' | 'student';
  tutorCriteria?: string; // Mô tả tiêu chí tìm gia sư

  // Common fields
  studentName: string;
  studentPhone: string;
  studentSchool: string; // Trường học của học viên
  parentName: string;
  parentPhone: string;
  parentAddress: string; // Địa chỉ phụ huynh (đổi từ address)
  preferredSchedule: string;
  notes?: string; // Mô tả lực học từ academicDescription
  registrationDate: string;

  // Enhanced status for tutor requests
  status:
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'cancelled'
    | 'completed'
    | 'matched'
    | 'trial_scheduled';

  approvedBy?: string;
  approvedByName?: string; // Tên người xử lý
  approvedAt?: string;
  rejectionReason?: string;

  // Tutor matching fields - NEW FIELDS
  matchedTutorId?: string;
  matchedTutorName?: string;
  matchedAt?: string;
  trialScheduledAt?: string;
  staffNotes?: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  message: string;
  date: string;
  status: 'new' | 'in-progress' | 'resolved';
  response?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl: string;
  category: BlogCategory;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: number; // in minutes
  viewCount?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  parentId?: string; // for replies
}
