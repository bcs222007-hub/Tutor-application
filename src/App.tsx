/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { Hero } from './components/home/Hero';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { SubjectsSection } from './components/home/SubjectsSection';
import { LevelsSection } from './components/home/LevelsSection';
import { TuitionModes } from './components/home/TuitionModes';
import { HowItWorks } from './components/home/HowItWorks';
import { Testimonials } from './components/home/Testimonials';
import { TutorDirectory } from './components/tutors/TutorDirectory';
import { CourseList } from './components/courses/CourseList';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { TutorDashboard } from './components/dashboards/TutorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { DemoBookingModal } from './components/booking/DemoBookingModal';
import { TutorProfileModal } from './components/tutors/TutorProfileModal';
import { TutorApplyModal } from './components/tutors/TutorApplyModal';
import { ChatModal } from './components/chat/ChatModal';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { activePage } = useApp();

  return (
    <main className="min-h-screen">
      {activePage === 'home' && (
        <>
          <Hero />
          <WhyChooseUs />
          <SubjectsSection />
          <LevelsSection />
          <TuitionModes />
          <HowItWorks />
          <Testimonials />
        </>
      )}

      {activePage === 'tutors' && <TutorDirectory />}
      {activePage === 'courses' && <CourseList />}
      {activePage === 'student-portal' && <StudentDashboard />}
      {activePage === 'parent-portal' && <ParentDashboard />}
      {activePage === 'tutor-portal' && <TutorDashboard />}
      {activePage === 'admin-portal' && <AdminDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
        {/* Interactive 1-Click Role Switcher for preview & testing */}
        <RoleSwitcherBar />

        {/* Top Navigation */}
        <Header />

        {/* View Router */}
        <MainContent />

        {/* Platform Footer */}
        <Footer />

        {/* Modals & Overlays */}
        <DemoBookingModal />
        <TutorProfileModal />
        <TutorApplyModal />
        <ChatModal />
        <AuthModal />

        {/* Interactive Toasts */}
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
