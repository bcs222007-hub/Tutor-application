import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
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
  INITIAL_USERS,
} from '../data/mockData';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore using custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Auto-seed initial collections to Firestore if first time
export const seedInitialDatabase = async () => {
  try {
    const tutorsSnapshot = await getDocs(collection(db, 'tutors'));
    if (!tutorsSnapshot.empty) {
      console.log('Firestore already seeded with Cambridge data.');
      return;
    }

    console.log('Seeding initial Cambridge Tutors dataset into Firestore...');

    // 1. Seed Tutors
    for (const tutor of INITIAL_TUTORS) {
      await setDoc(doc(db, 'tutors', tutor.id), tutor);
    }

    // 2. Seed Students
    for (const student of INITIAL_STUDENTS) {
      await setDoc(doc(db, 'students', student.id), student);
    }

    // 3. Seed Courses
    for (const course of INITIAL_COURSES) {
      await setDoc(doc(db, 'courses', course.id), course);
    }

    // 4. Seed Demo Requests
    for (const demo of INITIAL_DEMO_REQUESTS) {
      await setDoc(doc(db, 'demoRequests', demo.id), demo);
    }

    // 5. Seed Scheduled Classes
    for (const cls of INITIAL_SCHEDULED_CLASSES) {
      await setDoc(doc(db, 'scheduledClasses', cls.id), cls);
    }

    // 6. Seed Attendance Records
    for (const att of INITIAL_ATTENDANCE) {
      await setDoc(doc(db, 'attendance', att.id), att);
    }

    // 7. Seed Assignments
    for (const asg of INITIAL_ASSIGNMENTS) {
      await setDoc(doc(db, 'assignments', asg.id), asg);
    }

    // 8. Seed Test Results
    for (const test of INITIAL_TEST_RESULTS) {
      await setDoc(doc(db, 'testResults', test.id), test);
    }

    // 9. Seed Payments
    for (const pay of INITIAL_PAYMENTS) {
      await setDoc(doc(db, 'payments', pay.id), pay);
    }

    // 10. Seed Chat Messages
    for (const msg of INITIAL_CHAT_MESSAGES) {
      await setDoc(doc(db, 'messages', msg.id), msg);
    }

    // 11. Seed Notifications
    for (const notif of INITIAL_NOTIFICATIONS) {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    }

    // 12. Seed Users
    for (const user of INITIAL_USERS) {
      await setDoc(doc(db, 'users', user.id), user);
    }

    console.log('Firestore successfully populated with all Cambridge Academy data!');
  } catch (err) {
    console.error('Initial seeding notice (using client state fallback):', err);
  }
};
