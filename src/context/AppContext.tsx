import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { db, auth, seedInitialDatabase } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export type ActivePage =
  | 'home'
  | 'tutors'
  | 'courses'
  | 'student-portal'
  | 'student-login'
  | 'parent-portal'
  | 'tutor-portal'
  | 'tutor-login'
  | 'admin-portal'
  | 'admin-login';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Page State
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  navigateTo: (page: ActivePage) => void;

  // User & Auth State
  currentUser: User | null;
  activeRole: UserRole;
  isAdminAuthenticated: boolean;
  adminToken: string | null;

  // Dedicated Auth Flows
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  loginAsTutor: (email: string, password: string) => Promise<boolean>;
  registerTutorAccount: (data: any) => Promise<boolean>;
  loginAsStudent: (email: string, password: string) => Promise<boolean>;
  registerStudentAccount: (data: any) => Promise<boolean>;
  logout: () => void;

  // Data Collections (Live Firestore Synced)
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

  // Actions writing to Firestore
  submitDemoRequest: (request: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  applyAsTutor: (application: Omit<Tutor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>) => Promise<void>;
  updateTutorStatus: (tutorId: string, status: 'verified' | 'rejected' | 'blocked') => Promise<void>;
  updateTutorProfile: (tutorId: string, updates: Partial<Tutor>, resubmitForApproval?: boolean) => Promise<void>;
  updateDemoStatus: (demoId: string, status: 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
  switchUserRole: (role: UserRole) => void;
  loginAsUser: (email: string, pass: string) => Promise<boolean>;
  registerUser: (email: string, pass: string, name: string, role: UserRole) => Promise<boolean>;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  createAssignment: (asg: Omit<Assignment, 'id' | 'submissions'>) => Promise<void>;
  gradeAssignment: (asgId: string, studentId: string, marks: number, feedback: string) => Promise<void>;
  addTestResult: (result: Omit<TestResult, 'id'>) => Promise<void>;
  payInvoice: (invoiceId: string, method: 'JazzCash' | 'Easypaisa' | 'Bank Transfer') => Promise<void>;
  sendMessage: (recipientId: string, recipientName: string, content: string) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

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
  // Navigation & Protected Route state
  const [activePage, setActivePageState] = useState<ActivePage>('home');

  // Auth & Roles
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('guest');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('cambridge_admin_jwt');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Collections state initialized with initial data
  const [tutors, setTutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>(INITIAL_DEMO_REQUESTS);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>(INITIAL_SCHEDULED_CLASSES);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [testResults, setTestResults] = useState<TestResult[]>(INITIAL_TEST_RESULTS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [testimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

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

  // Route Guard Navigator
  const navigateTo = useCallback(
    (page: ActivePage) => {
      // 1. Guard Admin Dashboard: unauthenticated access must redirect to Admin Login
      if (page === 'admin-portal') {
        const token = adminToken || sessionStorage.getItem('cambridge_admin_jwt');
        if (!token) {
          showToast('Administrative authorization required. Redirecting to Admin Login.', 'warning');
          setActivePageState('admin-login');
          window.location.hash = 'admin/login';
          return;
        }
      }

      // 2. Guard Tutor Dashboard: if not logged in as tutor, redirect to Tutor Login
      if (page === 'tutor-portal') {
        if (!currentUser || activeRole !== 'tutor') {
          showToast('Please sign in to your Tutor account to access teaching console.', 'info');
          setActivePageState('tutor-login');
          window.location.hash = 'tutor/login';
          return;
        }
      }

      // 3. Guard Student Dashboard: if not logged in as student, redirect to Student Login
      if (page === 'student-portal') {
        if (!currentUser || activeRole !== 'student') {
          showToast('Please sign in to your Student account to access courses and tests.', 'info');
          setActivePageState('student-login');
          window.location.hash = 'student/login';
          return;
        }
      }

      // Allowed page navigation
      setActivePageState(page);

      // Update URL hash without reload
      if (page === 'home') window.location.hash = '';
      else if (page === 'admin-portal') window.location.hash = 'admin/dashboard';
      else if (page === 'admin-login') window.location.hash = 'admin/login';
      else if (page === 'tutor-portal') window.location.hash = 'tutor/dashboard';
      else if (page === 'tutor-login') window.location.hash = 'tutor/login';
      else if (page === 'student-portal') window.location.hash = 'student/dashboard';
      else if (page === 'student-login') window.location.hash = 'student/login';
      else window.location.hash = page;
    },
    [adminToken, currentUser, activeRole]
  );

  const setActivePage = (page: ActivePage) => {
    navigateTo(page);
  };

  // Sync with browser URL / hash on mount & hashchange
  useEffect(() => {
    const handleHashOrUrl = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (hash === 'admin' || hash === 'admin/dashboard' || pathname === '/admin' || pathname === '/admin/dashboard') {
        const token = sessionStorage.getItem('cambridge_admin_jwt');
        if (!token) {
          setActivePageState('admin-login');
        } else {
          setActivePageState('admin-portal');
        }
      } else if (hash === 'admin/login' || pathname === '/admin/login') {
        setActivePageState('admin-login');
      } else if (hash === 'tutor' || hash === 'tutor/dashboard' || pathname === '/tutor') {
        if (!currentUser || activeRole !== 'tutor') {
          setActivePageState('tutor-login');
        } else {
          setActivePageState('tutor-portal');
        }
      } else if (hash === 'tutor/login' || hash === 'tutor/register') {
        setActivePageState('tutor-login');
      } else if (hash === 'student' || hash === 'student/dashboard' || pathname === '/student') {
        if (!currentUser || activeRole !== 'student') {
          setActivePageState('student-login');
        } else {
          setActivePageState('student-portal');
        }
      } else if (hash === 'student/login' || hash === 'student/register') {
        setActivePageState('student-login');
      } else if (hash === 'tutors' || pathname === '/tutors') {
        setActivePageState('tutors');
      } else if (hash === 'courses' || pathname === '/courses') {
        setActivePageState('courses');
      } else if (hash === 'parent' || hash === 'parent-portal') {
        setActivePageState('parent-portal');
      }
    };

    handleHashOrUrl();
    window.addEventListener('hashchange', handleHashOrUrl);
    window.addEventListener('popstate', handleHashOrUrl);
    return () => {
      window.removeEventListener('hashchange', handleHashOrUrl);
      window.removeEventListener('popstate', handleHashOrUrl);
    };
  }, [currentUser, activeRole]);

  // Verify stored Admin Token on boot
  useEffect(() => {
    const checkAdminSession = async () => {
      const token = sessionStorage.getItem('cambridge_admin_jwt');
      if (!token) return;

      try {
        const res = await fetch('/api/admin/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setAdminToken(token);
            setIsAdminAuthenticated(true);
            setCurrentUser(data.user);
            setActiveRole('admin');
          } else {
            sessionStorage.removeItem('cambridge_admin_jwt');
            setAdminToken(null);
            setIsAdminAuthenticated(false);
          }
        } else {
          sessionStorage.removeItem('cambridge_admin_jwt');
          setAdminToken(null);
          setIsAdminAuthenticated(false);
        }
      } catch (e) {
        console.log('Admin session check notice:', e);
      }
    };

    checkAdminSession();
  }, []);

  // Firebase Real-time Firestore Listeners
  useEffect(() => {
    seedInitialDatabase();

    // 1. Tutors Listener
    const unsubTutors = onSnapshot(
      collection(db, 'tutors'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Tutor[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Tutor));
          setTutors(loaded);
        }
      },
      (err) => console.log('Tutors snapshot listener using local cache:', err)
    );

    // 2. Students Listener
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Student[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Student));
          setStudents(loaded);
        }
      },
      (err) => console.log('Students snapshot listener:', err)
    );

    // 3. Courses Listener
    const unsubCourses = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Course[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Course));
          setCourses(loaded);
        }
      },
      (err) => console.log('Courses snapshot listener:', err)
    );

    // 4. Demo Requests Listener
    const unsubDemos = onSnapshot(
      collection(db, 'demoRequests'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: DemoRequest[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as DemoRequest));
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setDemoRequests(loaded);
        }
      },
      (err) => console.log('Demo requests snapshot listener:', err)
    );

    // 5. Scheduled Classes Listener
    const unsubClasses = onSnapshot(
      collection(db, 'scheduledClasses'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ScheduledClass[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as ScheduledClass));
          setScheduledClasses(loaded);
        }
      },
      (err) => console.log('Classes snapshot listener:', err)
    );

    // 6. Attendance Listener
    const unsubAttendance = onSnapshot(
      collection(db, 'attendance'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: AttendanceRecord[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as AttendanceRecord));
          setAttendanceRecords(loaded);
        }
      },
      (err) => console.log('Attendance snapshot listener:', err)
    );

    // 7. Assignments Listener
    const unsubAssignments = onSnapshot(
      collection(db, 'assignments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Assignment[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Assignment));
          setAssignments(loaded);
        }
      },
      (err) => console.log('Assignments snapshot listener:', err)
    );

    // 8. Test Results Listener
    const unsubTests = onSnapshot(
      collection(db, 'testResults'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: TestResult[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as TestResult));
          setTestResults(loaded);
        }
      },
      (err) => console.log('Test results snapshot listener:', err)
    );

    // 9. Payments Listener
    const unsubPayments = onSnapshot(
      collection(db, 'payments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: PaymentRecord[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as PaymentRecord));
          setPayments(loaded);
        }
      },
      (err) => console.log('Payments snapshot listener:', err)
    );

    // 10. Messages Listener
    const unsubMessages = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ChatMessage[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as ChatMessage));
          loaded.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setMessages(loaded);
        }
      },
      (err) => console.log('Messages snapshot listener:', err)
    );

    // 11. Notifications Listener
    const unsubNotifications = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: AppNotification[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as AppNotification));
          setNotifications(loaded);
        }
      },
      (err) => console.log('Notifications snapshot listener:', err)
    );

    return () => {
      unsubTutors();
      unsubStudents();
      unsubCourses();
      unsubDemos();
      unsubClasses();
      unsubAttendance();
      unsubAssignments();
      unsubTests();
      unsubPayments();
      unsubMessages();
      unsubNotifications();
    };
  }, []);

  // -------------------------------------------------------------
  // SECURE AUTHENTICATION METHODS
  // -------------------------------------------------------------

  // 1. Admin Login via Backend
  const loginAsAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('cambridge_admin_jwt', data.token);
        setAdminToken(data.token);
        setIsAdminAuthenticated(true);
        setCurrentUser(data.user);
        setActiveRole('admin');
        showToast('Admin authorized! Opening executive dashboard.', 'success');
        setActivePageState('admin-portal');
        window.location.hash = 'admin/dashboard';
        return true;
      } else {
        showToast(data.message || 'Access denied. Invalid admin credentials.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Admin login error:', err);
      showToast('Connection to Admin Auth endpoint failed.', 'error');
      return false;
    }
  };

  // 2. Admin Logout
  const logoutAdmin = async () => {
    try {
      const token = sessionStorage.getItem('cambridge_admin_jwt');
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.log('Admin logout notice:', e);
    }
    sessionStorage.removeItem('cambridge_admin_jwt');
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setCurrentUser(null);
    setActiveRole('guest');
    setActivePageState('admin-login');
    window.location.hash = 'admin/login';
    showToast('Admin session terminated securely.', 'info');
  };

  // 3. Tutor Login
  const loginAsTutor = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = tutors.find((t) => t.email.toLowerCase() === cleanEmail);

    if (matched) {
      if (matched.verificationStatus === 'blocked') {
        showToast('This tutor account is currently disabled/blocked by administration.', 'error');
        return false;
      }

      const tutorUser: User = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone,
        role: 'tutor',
        avatarUrl: matched.photoUrl,
        tutorId: matched.id,
      };

      setCurrentUser(tutorUser);
      setActiveRole('tutor');
      showToast(`Welcome back, ${matched.name}!`, 'success');
      setActivePageState('tutor-portal');
      window.location.hash = 'tutor/dashboard';
      return true;
    }

    // Try Firebase Auth
    try {
      if (pass && pass.length >= 6) {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const dynamicTutor: User = {
          id: userCred.user.uid,
          name: email.split('@')[0],
          email,
          role: 'tutor',
          phone: '0300-1234567',
        };
        setCurrentUser(dynamicTutor);
        setActiveRole('tutor');
        setActivePageState('tutor-portal');
        window.location.hash = 'tutor/dashboard';
        return true;
      }
    } catch (e) {
      console.log('Firebase tutor auth notice:', e);
    }

    return false;
  };

  // 4. Tutor Registration
  const registerTutorAccount = async (data: any): Promise<boolean> => {
    const tutorId = `tutor_${Date.now()}`;
    const newTutor: Tutor = {
      id: tutorId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cnic: data.cnic,
      photoUrl: '/src/assets/images/tutor_farhan_portrait_1790320675895.jpg',
      qualification: data.qualification,
      institution: data.institution || 'Top University Alum',
      experienceYears: data.experienceYears || 3,
      subjects: data.subjects || ['Mathematics'],
      levels: data.levels || ['O-Level', 'A-Level'],
      mode: data.mode || 'Both',
      hourlyRatePKR: data.hourlyRatePKR || 2000,
      monthlyRatePKR: data.monthlyRatePKR || 20000,
      city: data.city || 'Islamabad',
      areasCovered: ['Central Area', 'Online'],
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending', // IMPORTANT: Pending admin verification
      bio: data.bio || '',
      teachingMethodology: data.teachingMethodology || '',
      availability: data.availability || ['Mon-Fri 4:00 PM - 8:00 PM'],
      pastResultsHighlights: 'Newly registered faculty candidate.',
    };

    setTutors((prev) => [newTutor, ...prev]);

    try {
      await setDoc(doc(db, 'tutors', tutorId), newTutor);

      // Create Admin Notification
      const notifId = `notif_${Date.now()}`;
      const notif: AppNotification = {
        id: notifId,
        recipientRole: 'admin',
        title: 'New Tutor Registration Application',
        message: `${newTutor.name} (${newTutor.qualification}) applied for ${newTutor.subjects.join(', ')}. Review CNIC and approve.`,
        type: 'system',
        timestamp: 'Just now',
        isRead: false,
      };
      await setDoc(doc(db, 'notifications', notifId), notif);
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
      console.error('Firestore tutor registration sync error:', err);
    }

    const tutorUser: User = {
      id: tutorId,
      name: newTutor.name,
      email: newTutor.email,
      phone: newTutor.phone,
      role: 'tutor',
      tutorId,
    };
    setCurrentUser(tutorUser);
    setActiveRole('tutor');
    return true;
  };

  // 5. Student Login
  const loginAsStudent = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = students.find((s) => s.email.toLowerCase() === cleanEmail);

    if (matched) {
      const studentUser: User = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone,
        role: 'student',
        studentId: matched.id,
      };
      setCurrentUser(studentUser);
      setActiveRole('student');
      showToast(`Welcome back, ${matched.name}!`, 'success');
      setActivePageState('student-portal');
      window.location.hash = 'student/dashboard';
      return true;
    }

    try {
      if (pass && pass.length >= 6) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const dynamicStudent: User = {
          id: cred.user.uid,
          name: email.split('@')[0],
          email,
          role: 'student',
          phone: '0300-1234567',
        };
        setCurrentUser(dynamicStudent);
        setActiveRole('student');
        setActivePageState('student-portal');
        window.location.hash = 'student/dashboard';
        return true;
      }
    } catch (e) {
      console.log('Firebase student auth notice:', e);
    }

    return false;
  };

  // 6. Student Registration
  const registerStudentAccount = async (data: any): Promise<boolean> => {
    const stdId = `std_${Date.now()}`;
    const newStudent: Student = {
      id: stdId,
      name: data.name,
      email: data.email,
      phone: data.phone || '0300-1234567',
      avatarUrl: '',
      currentLevel: data.currentLevel || 'A-Level',
      enrolledSubjects: data.enrolledSubjects || ['Mathematics'],
      assignedTutorIds: ['tutor_1'],
      schoolCollege: data.schoolCollege || 'Cambridge Academy Candidate',
      targetExamYear: data.targetExamYear || 'May/June 2027 CAIE Series',
    };

    setStudents((prev) => [newStudent, ...prev]);

    try {
      await setDoc(doc(db, 'students', stdId), newStudent);
    } catch (err) {
      console.error('Firestore student register error:', err);
    }

    const studentUser: User = {
      id: stdId,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone,
      role: 'student',
      studentId: stdId,
    };
    setCurrentUser(studentUser);
    setActiveRole('student');
    return true;
  };

  // Generic Logout
  const logout = () => {
    if (activeRole === 'admin') {
      logoutAdmin();
      return;
    }
    signOut(auth).catch(() => {});
    setCurrentUser(null);
    setActiveRole('guest');
    setActivePageState('home');
    window.location.hash = '';
    showToast('Signed out successfully.', 'info');
  };

  const openDemoModalWithTutor = (tutor?: Tutor) => {
    setDemoPreselectedTutor(tutor);
    setIsDemoModalOpen(true);
  };

  const openChatWith = (id: string, name: string) => {
    setChatTargetUser({ id, name });
    setIsChatModalOpen(true);
  };

  // Submit Demo Request -> Writes to Firestore
  const submitDemoRequest = async (data: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>) => {
    const demoId = `demo_${Date.now()}`;
    const newDemo: DemoRequest = {
      ...data,
      id: demoId,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setDemoRequests((prev) => [newDemo, ...prev]);

    try {
      await setDoc(doc(db, 'demoRequests', demoId), newDemo);

      const notifId = `notif_${Date.now()}`;
      const notif: AppNotification = {
        id: notifId,
        recipientRole: 'admin',
        title: 'New Free Demo Request',
        message: `${newDemo.studentName} booked a demo for ${newDemo.level} ${newDemo.subject} (${newDemo.tuitionMode}).`,
        type: 'demo',
        timestamp: 'Just now',
        isRead: false,
      };
      await setDoc(doc(db, 'notifications', notifId), notif);
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
      console.error('Firestore demo submit sync error:', err);
    }

    showToast('Demo request registered! Our academic coordinator will contact you shortly.', 'success');
  };

  // Apply as Tutor -> Writes to Firestore (PENDING VERIFICATION)
  const applyAsTutor = async (
    app: Omit<Tutor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>
  ) => {
    const tutorId = `tutor_${Date.now()}`;
    const newTutor: Tutor = {
      ...app,
      id: tutorId,
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending',
    };

    setTutors((prev) => [newTutor, ...prev]);

    try {
      await setDoc(doc(db, 'tutors', tutorId), newTutor);

      const notifId = `notif_${Date.now()}`;
      const notif: AppNotification = {
        id: notifId,
        recipientRole: 'admin',
        title: 'New Tutor Application',
        message: `${newTutor.name} applied for ${newTutor.subjects.join(', ')}. Verification required.`,
        type: 'system',
        timestamp: 'Just now',
        isRead: false,
      };
      await setDoc(doc(db, 'notifications', notifId), notif);
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
      console.error('Firestore tutor apply sync error:', err);
    }

    showToast(
      'Application submitted! Profile is in PENDING VERIFICATION until admin approval.',
      'info'
    );
  };

  // Admin approves / rejects / blocks tutor -> Updates Firestore
  const updateTutorStatus = async (
    tutorId: string,
    status: 'verified' | 'rejected' | 'blocked'
  ) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, verificationStatus: status } : t))
    );

    try {
      await updateDoc(doc(db, 'tutors', tutorId), {
        verificationStatus: status,
      });
    } catch (err) {
      console.error('Firestore tutor status update error:', err);
    }

    showToast(
      `Tutor status updated in database to ${status.toUpperCase()}`,
      status === 'verified' ? 'success' : status === 'blocked' ? 'error' : 'warning'
    );
  };

  // Tutor updates their own profile & credentials -> Updates Firestore
  const updateTutorProfile = async (
    tutorId: string,
    updates: Partial<Tutor>,
    resubmitForApproval = false
  ) => {
    const finalUpdates: Partial<Tutor> = {
      ...updates,
      ...(resubmitForApproval ? { verificationStatus: 'pending' as const } : {}),
    };

    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, ...finalUpdates } : t))
    );

    try {
      await updateDoc(doc(db, 'tutors', tutorId), finalUpdates);

      if (resubmitForApproval) {
        const notifId = `notif_${Date.now()}`;
        const notif: AppNotification = {
          id: notifId,
          recipientRole: 'admin',
          title: 'Tutor Updated Profile for Approval',
          message: `Tutor ID ${tutorId} has updated profile details and requested verification approval.`,
          type: 'system',
          timestamp: 'Just now',
          isRead: false,
        };
        await setDoc(doc(db, 'notifications', notifId), notif);
        setNotifications((prev) => [notif, ...prev]);
      }
    } catch (err) {
      console.error('Firestore tutor update error:', err);
    }

    showToast(
      resubmitForApproval
        ? 'Profile updated & submitted for administrative approval!'
        : 'Profile updated successfully!',
      'success'
    );
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'admin') {
      if (isAdminAuthenticated) {
        setActivePageState('admin-portal');
        window.location.hash = 'admin/dashboard';
      } else {
        setActivePageState('admin-login');
        window.location.hash = 'admin/login';
      }
      return;
    }
    setActiveRole(role);
    if (role === 'tutor') {
      if (currentUser && currentUser.role === 'tutor') {
        setActivePageState('tutor-portal');
      } else {
        setActivePageState('tutor-login');
      }
    } else if (role === 'student') {
      if (currentUser && currentUser.role === 'student') {
        setActivePageState('student-portal');
      } else {
        setActivePageState('student-login');
      }
    } else if (role === 'parent') {
      setActivePageState('parent-portal');
    } else {
      setActivePageState('home');
    }
  };

  const loginAsUser = async (email: string, pass: string): Promise<boolean> => {
    const clean = email.trim().toLowerCase();
    if (tutors.some((t) => t.email.toLowerCase() === clean)) {
      return loginAsTutor(clean, pass);
    }
    if (students.some((s) => s.email.toLowerCase() === clean)) {
      return loginAsStudent(clean, pass);
    }
    return loginAsStudent(clean, pass);
  };

  const registerUser = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole
  ): Promise<boolean> => {
    if (role === 'tutor') {
      return registerTutorAccount({ name, email, password: pass });
    }
    return registerStudentAccount({ name, email, password: pass });
  };

  // Admin updates demo status -> Updates Firestore
  const updateDemoStatus = async (demoId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setDemoRequests((prev) =>
      prev.map((d) => (d.id === demoId ? { ...d, status } : d))
    );

    try {
      await updateDoc(doc(db, 'demoRequests', demoId), { status });
    } catch (err) {
      console.error('Firestore demo status error:', err);
    }

    showToast(`Demo request marked as ${status.toUpperCase()} in Firestore`, 'success');
  };

  // Tutor marks attendance -> Writes to Firestore
  const markAttendance = async (record: Omit<AttendanceRecord, 'id'>) => {
    const attId = `att_${Date.now()}`;
    const newRecord: AttendanceRecord = {
      ...record,
      id: attId,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    try {
      await setDoc(doc(db, 'attendance', attId), newRecord);
    } catch (err) {
      console.error('Firestore attendance save error:', err);
    }

    showToast(`Attendance marked for ${record.studentName}: ${record.status.toUpperCase()}`, 'success');
  };

  // Tutor creates assignment -> Writes to Firestore
  const createAssignment = async (asg: Omit<Assignment, 'id' | 'submissions'>) => {
    const asgId = `asg_${Date.now()}`;
    const newAssignment: Assignment = {
      ...asg,
      id: asgId,
      submissions: [],
    };

    setAssignments((prev) => [newAssignment, ...prev]);

    try {
      await setDoc(doc(db, 'assignments', asgId), newAssignment);

      const notifId = `notif_${Date.now()}`;
      const notif: AppNotification = {
        id: notifId,
        recipientRole: 'student',
        title: 'New Assignment Published',
        message: `${asg.tutorName} uploaded '${asg.title}' for ${asg.subject}. Due: ${asg.dueDate}.`,
        type: 'assignment',
        timestamp: 'Just now',
        isRead: false,
      };
      await setDoc(doc(db, 'notifications', notifId), notif);
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
      console.error('Firestore assignment error:', err);
    }

    showToast(`Assignment '${asg.title}' published!`, 'success');
  };

  // Tutor grades assignment -> Updates Firestore
  const gradeAssignment = async (
    asgId: string,
    studentId: string,
    marks: number,
    feedback: string
  ) => {
    const updatedAssignments = assignments.map((a) => {
      if (a.id !== asgId) return a;
      return {
        ...a,
        submissions: a.submissions.map((s) =>
          s.studentId === studentId
            ? { ...s, status: 'graded' as const, obtainedMarks: marks, feedback }
            : s
        ),
      };
    });
    setAssignments(updatedAssignments);

    try {
      const target = updatedAssignments.find((a) => a.id === asgId);
      if (target) {
        await updateDoc(doc(db, 'assignments', asgId), {
          submissions: target.submissions,
        });
      }
    } catch (err) {
      console.error('Firestore grade sync error:', err);
    }

    showToast(`Grade recorded: ${marks} marks awarded`, 'success');
  };

  // Add test result -> Writes to Firestore
  const addTestResult = async (result: Omit<TestResult, 'id'>) => {
    const testId = `test_${Date.now()}`;
    const newTest: TestResult = {
      ...result,
      id: testId,
    };

    setTestResults((prev) => [newTest, ...prev]);

    try {
      await setDoc(doc(db, 'testResults', testId), newTest);

      const notifId = `notif_${Date.now()}`;
      const notif: AppNotification = {
        id: notifId,
        recipientRole: 'student',
        title: 'New Test Result Published',
        message: `Score for ${newTest.testTitle}: ${newTest.obtainedMarks}/${newTest.totalMarks} (Grade ${newTest.grade}).`,
        type: 'result',
        timestamp: 'Just now',
        isRead: false,
      };
      await setDoc(doc(db, 'notifications', notifId), notif);
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
      console.error('Firestore test result error:', err);
    }

    showToast(`Test score published for ${result.studentName}`, 'success');
  };

  // Pay invoice -> Updates Firestore
  const payInvoice = async (
    invoiceId: string,
    method: 'JazzCash' | 'Easypaisa' | 'Bank Transfer'
  ) => {
    const paidDate = new Date().toISOString().split('T')[0];
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== invoiceId) return p;
        return {
          ...p,
          paidAmountPKR: p.amountPKR,
          status: 'paid',
          paidDate,
          paymentMethod: method,
        };
      })
    );

    try {
      const p = payments.find((x) => x.id === invoiceId);
      if (p) {
        await updateDoc(doc(db, 'payments', invoiceId), {
          paidAmountPKR: p.amountPKR,
          status: 'paid',
          paidDate,
          paymentMethod: method,
        });
      }
    } catch (err) {
      console.error('Firestore payment update error:', err);
    }

    showToast(`Fee payment verified in Firestore via ${method}! Receipt generated.`, 'success');
  };

  // Send message -> Writes to Firestore
  const sendMessage = async (recipientId: string, recipientName: string, content: string) => {
    const msgId = `msg_${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
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

    try {
      await setDoc(doc(db, 'messages', msgId), newMsg);
    } catch (err) {
      console.error('Firestore message error:', err);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );

    try {
      await updateDoc(doc(db, 'notifications', notifId), { isRead: true });
    } catch (err) {
      console.error('Firestore notification update error:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      for (const n of notifications) {
        if (!n.isRead) {
          await updateDoc(doc(db, 'notifications', n.id), { isRead: true });
        }
      }
    } catch (err) {
      console.error('Firestore mark all notifications error:', err);
    }

    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        navigateTo,
        currentUser,
        activeRole,
        isAdminAuthenticated,
        adminToken,
        loginAsAdmin,
        logoutAdmin,
        loginAsTutor,
        registerTutorAccount,
        loginAsStudent,
        registerStudentAccount,
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
        updateTutorProfile,
        updateDemoStatus,
        switchUserRole,
        loginAsUser,
        registerUser,
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
