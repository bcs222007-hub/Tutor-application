import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Tutor,
  Student,
  DemoRequest,
  Course,
  ScheduledClass,
  AttendanceRecord,
  Assignment,
  TestResult,
  PaymentRecord,
  ChatMessage,
  AppNotification,
  Testimonial,
  AcademicLevel,
  SubjectName,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TUTORS,
  INITIAL_STUDENTS,
  INITIAL_COURSES,
  INITIAL_DEMO_REQUESTS,
  INITIAL_SCHEDULED_CLASSES,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_TEST_RESULTS,
  INITIAL_PAYMENTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TESTIMONIALS,
} from '../data/mockData';

export type ActivePage =
  | 'home'
  | 'tutors'
  | 'courses'
  | 'student-portal'
  | 'parent-portal'
  | 'tutor-portal'
  | 'admin-portal';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Page State
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // User & Auth State
  currentUser: User | null;
  activeRole: UserRole;
  switchUserRole: (role: UserRole) => void;
  loginAsUser: (email: string) => boolean;
  logout: () => void;

  // Data Collections
  tutors: Tutor[];
  students: Student[];
  courses: Course[];
  demoRequests: DemoRequest[];
  scheduledClasses: ScheduledClass[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  testResults: TestResult[];
  payments: PaymentRecord[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  testimonials: Testimonial[];

  // Actions
  submitDemoRequest: (request: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>) => void;
  applyAsTutor: (application: Omit<Tutor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>) => void;
  updateTutorStatus: (tutorId: string, status: 'verified' | 'rejected') => void;
  updateDemoStatus: (demoId: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  createAssignment: (asg: Omit<Assignment, 'id' | 'submissions'>) => void;
  gradeAssignment: (asgId: string, studentId: string, marks: number, feedback: string) => void;
  addTestResult: (result: Omit<TestResult, 'id'>) => void;
  payInvoice: (invoiceId: string, method: 'JazzCash' | 'Easypaisa' | 'Bank Transfer') => void;
  sendMessage: (recipientId: string, recipientName: string, content: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;

  // Modals & Overlay triggers
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  demoPreselectedTutor?: Tutor;
  openDemoModalWithTutor: (tutor?: Tutor) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  isApplyTutorModalOpen: boolean;
  setIsApplyTutorModalOpen: (open: boolean) => void;

  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  chatTargetUser: { id: string; name: string } | null;
  openChatWith: (id: string, name: string) => void;

  selectedTutorDetail: Tutor | null;
  setSelectedTutorDetail: (tutor: Tutor | null) => void;

  // Toast System
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');

  // Auth & Roles
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // default admin or student
  const [activeRole, setActiveRole] = useState<UserRole>('guest');

  // Collections with localStorage persistence
  const [tutors, setTutors] = useState<Tutor[]>(() => {
    const saved = localStorage.getItem('cambridge_tutors');
    return saved ? JSON.parse(saved) : INITIAL_TUTORS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('cambridge_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('cambridge_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>(() => {
    const saved = localStorage.getItem('cambridge_demos');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_REQUESTS;
  });

  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>(() => {
    const saved = localStorage.getItem('cambridge_classes');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_CLASSES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('cambridge_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('cambridge_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [testResults, setTestResults] = useState<TestResult[]>(() => {
    const saved = localStorage.getItem('cambridge_test_results');
    return saved ? JSON.parse(saved) : INITIAL_TEST_RESULTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('cambridge_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cambridge_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cambridge_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [testimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('cambridge_tutors', JSON.stringify(tutors));
  }, [tutors]);

  useEffect(() => {
    localStorage.setItem('cambridge_demos', JSON.stringify(demoRequests));
  }, [demoRequests]);

  useEffect(() => {
    localStorage.setItem('cambridge_classes', JSON.stringify(scheduledClasses));
  }, [scheduledClasses]);

  useEffect(() => {
    localStorage.setItem('cambridge_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('cambridge_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('cambridge_test_results', JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem('cambridge_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('cambridge_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cambridge_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoPreselectedTutor, setDemoPreselectedTutor] = useState<Tutor | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApplyTutorModalOpen, setIsApplyTutorModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<{ id: string; name: string } | null>(null);
  const [selectedTutorDetail, setSelectedTutorDetail] = useState<Tutor | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role switching
  const switchUserRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'guest') {
      setCurrentUser(null);
      showToast('Switched to Guest / Public Explorer mode', 'info');
      return;
    }

    const matchedUser = INITIAL_USERS.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      showToast(`Switched view to ${matchedUser.name} (${role.toUpperCase()})`, 'info');
    }

    // Auto navigate to role's dashboard
    if (role === 'student') setActivePage('student-portal');
    else if (role === 'parent') setActivePage('parent-portal');
    else if (role === 'tutor') setActivePage('tutor-portal');
    else if (role === 'admin') setActivePage('admin-portal');
  };

  const loginAsUser = (email: string): boolean => {
    const user = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setActiveRole(user.role);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'student') setActivePage('student-portal');
      else if (user.role === 'parent') setActivePage('parent-portal');
      else if (user.role === 'tutor') setActivePage('tutor-portal');
      else if (user.role === 'admin') setActivePage('admin-portal');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole('guest');
    setActivePage('home');
    showToast('Logged out successfully', 'info');
  };

  const openDemoModalWithTutor = (tutor?: Tutor) => {
    setDemoPreselectedTutor(tutor);
    setIsDemoModalOpen(true);
  };

  const openChatWith = (id: string, name: string) => {
    setChatTargetUser({ id, name });
    setIsChatModalOpen(true);
  };

  // Submit Demo Request
  const submitDemoRequest = (data: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>) => {
    const newDemo: DemoRequest = {
      ...data,
      id: `demo_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setDemoRequests((prev) => [newDemo, ...prev]);

    // Add admin notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      recipientRole: 'admin',
      title: 'New Free Demo Request',
      message: `${newDemo.studentName} booked a demo for ${newDemo.level} ${newDemo.subject} (${newDemo.tuitionMode}).`,
      type: 'demo',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Demo class booked successfully! Our academic coordinator will contact you shortly.', 'success');
  };

  // Tutor Apply
  const applyAsTutor = (app: Omit<Tutor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>) => {
    const newTutor: Tutor = {
      ...app,
      id: `tutor_${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      verificationStatus: 'pending',
    };
    setTutors((prev) => [newTutor, ...prev]);

    // Notify admin
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      recipientRole: 'admin',
      title: 'New Tutor Application',
      message: `${newTutor.name} applied for ${newTutor.subjects.join(', ')}. Verification required.`,
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Application submitted! Your profile is currently under review by our Academic Board.', 'info');
  };

  // Admin approves / rejects tutor
  const updateTutorStatus = (tutorId: string, status: 'verified' | 'rejected') => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, verificationStatus: status } : t))
    );
    showToast(
      `Tutor status updated to ${status === 'verified' ? 'VERIFIED' : 'REJECTED'}`,
      status === 'verified' ? 'success' : 'warning'
    );
  };

  // Admin updates demo status
  const updateDemoStatus = (demoId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setDemoRequests((prev) =>
      prev.map((d) => (d.id === demoId ? { ...d, status } : d))
    );
    showToast(`Demo request marked as ${status.toUpperCase()}`, 'success');
  };

  // Tutor marks attendance
  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}`,
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
    showToast(`Attendance marked for ${record.studentName}: ${record.status.toUpperCase()}`, 'success');
  };

  // Tutor creates assignment
  const createAssignment = (asg: Omit<Assignment, 'id' | 'submissions'>) => {
    const newAssignment: Assignment = {
      ...asg,
      id: `asg_${Date.now()}`,
      submissions: [],
    };
    setAssignments((prev) => [newAssignment, ...prev]);

    // Student notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      recipientRole: 'student',
      title: 'New Assignment Uploaded',
      message: `${asg.tutorName} uploaded '${asg.title}' for ${asg.subject}. Due: ${asg.dueDate}.`,
      type: 'assignment',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Assignment '${asg.title}' published successfully!`, 'success');
  };

  // Tutor grades assignment
  const gradeAssignment = (asgId: string, studentId: string, marks: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== asgId) return a;
        return {
          ...a,
          submissions: a.submissions.map((s) =>
            s.studentId === studentId
              ? { ...s, status: 'graded', obtainedMarks: marks, feedback }
              : s
          ),
        };
      })
    );
    showToast(`Grade saved: ${marks} marks awarded`, 'success');
  };

  // Add test result
  const addTestResult = (result: Omit<TestResult, 'id'>) => {
    const newTest: TestResult = {
      ...result,
      id: `test_${Date.now()}`,
    };
    setTestResults((prev) => [newTest, ...prev]);

    // Parent and student notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      recipientRole: 'student',
      title: 'New Test Result Published',
      message: `Score for ${newTest.testTitle}: ${newTest.obtainedMarks}/${newTest.totalMarks} (Grade ${newTest.grade}).`,
      type: 'result',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Test result published for ${result.studentName}`, 'success');
  };

  // Pay invoice
  const payInvoice = (invoiceId: string, method: 'JazzCash' | 'Easypaisa' | 'Bank Transfer') => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== invoiceId) return p;
        return {
          ...p,
          paidAmountPKR: p.amountPKR,
          status: 'paid',
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: method,
        };
      })
    );
    showToast(`Fee payment of PKR verified via ${method}! Receipt generated.`, 'success');
  };

  // Send message
  const sendMessage = (recipientId: string, recipientName: string, content: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser ? currentUser.id : 'guest_user',
      senderName: currentUser ? currentUser.name : 'Student Inquiry',
      senderRole: activeRole,
      recipientId,
      recipientName,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        currentUser,
        activeRole,
        switchUserRole,
        loginAsUser,
        logout,
        tutors,
        students,
        courses,
        demoRequests,
        scheduledClasses,
        attendanceRecords,
        assignments,
        testResults,
        payments,
        messages,
        notifications,
        testimonials,
        submitDemoRequest,
        applyAsTutor,
        updateTutorStatus,
        updateDemoStatus,
        markAttendance,
        createAssignment,
        gradeAssignment,
        addTestResult,
        payInvoice,
        sendMessage,
        markNotificationRead,
        markAllNotificationsRead,
        isDemoModalOpen,
        setIsDemoModalOpen,
        demoPreselectedTutor,
        openDemoModalWithTutor,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isApplyTutorModalOpen,
        setIsApplyTutorModalOpen,
        isChatModalOpen,
        setIsChatModalOpen,
        chatTargetUser,
        openChatWith,
        selectedTutorDetail,
        setSelectedTutorDetail,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
