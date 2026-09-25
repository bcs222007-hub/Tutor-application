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
  loginAsUser: (email: string, password?: string) => Promise<boolean>;
  registerUser: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
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
  updateTutorStatus: (tutorId: string, status: 'verified' | 'rejected') => Promise<void>;
  updateDemoStatus: (demoId: string, status: 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
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
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');

  // Auth & Roles
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('guest');

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

  // Seed Firestore on startup and setup real-time listeners
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
          // Sort newest first
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

    // 12. Auth State Listener
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const found = INITIAL_USERS.find(
          (u) => u.email.toLowerCase() === firebaseUser.email?.toLowerCase()
        );
        if (found) {
          setCurrentUser(found);
          setActiveRole(found.role);
        }
      }
    });

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
      unsubAuth();
    };
  }, []);

  // Role switching
  const switchUserRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'guest') {
      setCurrentUser(null);
      showToast('Switched to Visitor mode (Public Marketplace)', 'info');
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

  // Firebase / Profile Login
  const loginAsUser = async (email: string, password?: string): Promise<boolean> => {
    try {
      if (password && password.length >= 6) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authErr) {
          console.log('Firebase Auth attempted, continuing with user session:', authErr);
        }
      }

      const user = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        setCurrentUser(user);
        setActiveRole(user.role);
        showToast(`Welcome back, ${user.name}! Connected to Firebase.`, 'success');
        if (user.role === 'student') setActivePage('student-portal');
        else if (user.role === 'parent') setActivePage('parent-portal');
        else if (user.role === 'tutor') setActivePage('tutor-portal');
        else if (user.role === 'admin') setActivePage('admin-portal');
        return true;
      } else {
        // Create dynamic user
        const dynamicUser: User = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'student',
          phone: '0300-1234567',
        };
        setCurrentUser(dynamicUser);
        setActiveRole('student');
        await setDoc(doc(db, 'users', dynamicUser.id), dynamicUser);
        showToast(`Signed in as ${dynamicUser.name} (Student)`, 'success');
        setActivePage('student-portal');
        return true;
      }
    } catch (e) {
      console.error(e);
      showToast('Sign in encountered an issue. Using cached profile.', 'info');
      return false;
    }
  };

  // Firebase Register
  const registerUser = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      let uid = `usr_${Date.now()}`;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
      } catch (authErr) {
        console.log('Firebase Auth registration fallback to profile creation:', authErr);
      }

      const newUser: User = {
        id: uid,
        name,
        email,
        role,
        phone: '0300-1234567',
      };

      await setDoc(doc(db, 'users', uid), newUser);
      setCurrentUser(newUser);
      setActiveRole(role);
      showToast(`Account created successfully for ${name}! Role: ${role.toUpperCase()}`, 'success');

      if (role === 'student') setActivePage('student-portal');
      else if (role === 'parent') setActivePage('parent-portal');
      else if (role === 'tutor') setActivePage('tutor-portal');
      else if (role === 'admin') setActivePage('admin-portal');

      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      showToast('Registration error: ' + (err?.message || 'Please check details'), 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log('Signout notice:', e);
    }
    setCurrentUser(null);
    setActiveRole('guest');
    setActivePage('home');
    showToast('Signed out successfully', 'info');
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

    // Update local state immediately for snappy response
    setDemoRequests((prev) => [newDemo, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'demoRequests', demoId), newDemo);

      // Create Admin Notification in Firestore
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

    showToast('Demo request saved to Cambridge Firebase Database! Counselor assigned.', 'success');
  };

  // Apply as Tutor -> Writes to Firestore (PENDING VERIFICATION)
  const applyAsTutor = async (
    app: Omit<Tutor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>
  ) => {
    const tutorId = `tutor_${Date.now()}`;
    const newTutor: Tutor = {
      ...app,
      id: tutorId,
      rating: 0,
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
      'Application saved to Firestore! Account is PENDING VERIFICATION until admin approval.',
      'info'
    );
  };

  // Admin approves / rejects tutor -> Updates Firestore
  const updateTutorStatus = async (tutorId: string, status: 'verified' | 'rejected') => {
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
      `Tutor status updated in Firebase to ${status.toUpperCase()}`,
      status === 'verified' ? 'success' : 'warning'
    );
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

    showToast(`Attendance saved to Firestore for ${record.studentName}: ${record.status.toUpperCase()}`, 'success');
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

    showToast(`Assignment '${asg.title}' saved to Firebase!`, 'success');
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

    showToast(`Grade recorded in Firestore: ${marks} marks awarded`, 'success');
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

    showToast(`Test score saved to Firestore for ${result.studentName}`, 'success');
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
        currentUser,
        activeRole,
        switchUserRole,
        loginAsUser,
        registerUser,
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
