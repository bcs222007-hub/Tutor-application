export type UserRole = 'student' | 'parent' | 'tutor' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  studentId?: string; // If student
  parentId?: string; // If parent
  tutorId?: string; // If tutor
}

export type AcademicLevel =
  | 'Grade 9'
  | 'Grade 10'
  | '1st Year'
  | '2nd Year'
  | 'IGCSE'
  | 'O-Level'
  | 'AS-Level'
  | 'A-Level';

export type SubjectName = 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology';

export type TuitionMode = 'Online' | 'Home Tuition' | 'Both';

export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnic?: string;
  photoUrl: string;
  qualification: string;
  institution: string;
  experienceYears: number;
  subjects: SubjectName[];
  levels: AcademicLevel[];
  mode: TuitionMode;
  hourlyRatePKR: number;
  monthlyRatePKR: number;
  city: string;
  areasCovered?: string[];
  rating: number;
  reviewCount: number;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'blocked';
  bio: string;
  teachingMethodology: string;
  availability: string[];
  pastResultsHighlights: string;
  badge?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  currentLevel: AcademicLevel;
  enrolledSubjects: SubjectName[];
  assignedTutorIds: string[];
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  schoolCollege: string;
  targetExamYear: string;
}

export interface DemoRequest {
  id: string;
  studentName: string;
  parentName?: string;
  contactNumber: string;
  email: string;
  subject: SubjectName;
  level: AcademicLevel;
  tuitionMode: 'Online' | 'Home Tuition';
  preferredTutorId?: string;
  preferredTutorName?: string;
  preferredDate: string;
  preferredTime: string;
  cityArea: string;
  additionalMessage?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  subject: SubjectName;
  level: AcademicLevel;
  description: string;
  tutorId: string;
  tutorName: string;
  durationWeeks: number;
  totalClasses: number;
  mode: TuitionMode;
  feePKR: number;
  syllabusTopics: string[];
  learningOutcomes: string[];
  scheduleDayTime: string;
  enrolledStudentsCount: number;
  badgeText?: string;
}

export interface ScheduledClass {
  id: string;
  courseTitle: string;
  subject: SubjectName;
  level: AcademicLevel;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  durationMinutes: number;
  mode: 'Online' | 'Home Tuition';
  meetingLink?: string;
  homeAddress?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: SubjectName;
  date: string;
  status: 'present' | 'absent' | 'leave';
  topicCovered: string;
  tutorRemark?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: SubjectName;
  level: AcademicLevel;
  tutorId: string;
  tutorName: string;
  dueDate: string;
  description: string;
  totalMarks: number;
  attachmentName?: string;
  submissions: {
    studentId: string;
    studentName: string;
    submittedAt: string;
    status: 'submitted' | 'graded' | 'late';
    obtainedMarks?: number;
    feedback?: string;
  }[];
}

export interface TestResult {
  id: string;
  testTitle: string;
  subject: SubjectName;
  level: AcademicLevel;
  date: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: 'A*' | 'A' | 'B' | 'C' | 'D' | 'U';
  studentId: string;
  studentName: string;
  tutorName: string;
  remarks: string;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  parentName: string;
  month: string;
  amountPKR: number;
  paidAmountPKR: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'JazzCash' | 'Easypaisa' | 'Bank Transfer' | 'Cash';
  receiptUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface AppNotification {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type: 'demo' | 'class' | 'assignment' | 'result' | 'payment' | 'system';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  level: AcademicLevel;
  subject: string;
  quote: string;
  gradeAchieved: string;
  tutorName: string;
  verified: boolean;
  avatarText: string;
}
