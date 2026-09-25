import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MessageSquare,
  Menu,
  X,
  Phone,
  GraduationCap,
  Sparkles,
  LogOut,
  ChevronDown,
  Lock,
  User,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { ActivePage } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    activeRole,
    currentUser,
    logout,
    logoutAdmin,
    isAdminAuthenticated,
    openDemoModalWithTutor,
    setIsAuthModalOpen,
    setIsChatModalOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsApplyTutorModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) => !n.isRead && (n.recipientRole === 'all' || n.recipientRole === activeRole)
  );

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-[32px] sm:top-[33px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0f2b5c] text-amber-400 flex items-center justify-center font-bold text-xl shadow-sm border border-[#0f2b5c]/20 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg md:text-xl tracking-tight text-[#0f2b5c] leading-tight">
                  Cambridge Tutors
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-600 font-semibold tracking-wider uppercase leading-none">
                  Cambridge Tutoring Education
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#0f2b5c] transition-colors py-1 ${
                activePage === 'home' ? 'text-[#0f2b5c] font-bold border-b-2 border-[#0f2b5c]' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('tutors')}
              className={`hover:text-[#0f2b5c] transition-colors py-1 ${
                activePage === 'tutors' ? 'text-[#0f2b5c] font-bold border-b-2 border-[#0f2b5c]' : ''
              }`}
            >
              Find Tutors
            </button>
            <button
              onClick={() => handleNavClick('courses')}
              className={`hover:text-[#0f2b5c] transition-colors py-1 ${
                activePage === 'courses' ? 'text-[#0f2b5c] font-bold border-b-2 border-[#0f2b5c]' : ''
              }`}
            >
              Courses
            </button>

            {/* Role Dashboards / Portals */}
            <button
              onClick={() => handleNavClick(currentUser && activeRole === 'student' ? 'student-portal' : 'student-login')}
              className={`hover:text-[#0f2b5c] transition-colors py-1 ${
                activePage === 'student-portal' || activePage === 'student-login'
                  ? 'text-[#0f2b5c] font-bold border-b-2 border-[#0f2b5c]'
                  : ''
              }`}
            >
              Student Portal
            </button>

            <button
              onClick={() => handleNavClick(currentUser && activeRole === 'tutor' ? 'tutor-portal' : 'tutor-login')}
              className={`hover:text-[#0f2b5c] transition-colors py-1 ${
                activePage === 'tutor-portal' || activePage === 'tutor-login'
                  ? 'text-[#0f2b5c] font-bold border-b-2 border-[#0f2b5c]'
                  : ''
              }`}
            >
              Tutor Portal
            </button>

            {/* Admin Portal link */}
            <button
              onClick={() => handleNavClick(isAdminAuthenticated ? 'admin-portal' : 'admin-login')}
              className={`hover:text-amber-700 transition-colors py-1 flex items-center gap-1 ${
                activePage === 'admin-portal' || activePage === 'admin-login'
                  ? 'text-amber-700 font-bold border-b-2 border-amber-600'
                  : 'text-slate-600'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Contact badge for desktop */}
            <a
              href="tel:03405427365"
              className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0f2b5c] px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors font-mono tabular-nums"
              title="Call Cambridge Tutoring Education helpline"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>0340-5427365</span>
            </a>

            {/* Chat Drawer Trigger */}
            <button
              onClick={() => setIsChatModalOpen(true)}
              className="p-2 text-slate-600 hover:text-[#0f2b5c] hover:bg-slate-100 rounded-lg transition-colors"
              title="Messages & Communication"
              aria-label="Open messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-[#0f2b5c] hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {unreadNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">
                        No new notifications right now.
                      </div>
                    ) : (
                      unreadNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-0.5">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 pl-2 pr-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{activeRole} Account</div>
                    </div>
                    {activeRole === 'student' && (
                      <button
                        onClick={() => {
                          setActivePage('student-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Student Dashboard
                      </button>
                    )}
                    {activeRole === 'tutor' && (
                      <button
                        onClick={() => {
                          setActivePage('tutor-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Tutor Dashboard
                      </button>
                    )}
                    {activeRole === 'admin' && (
                      <button
                        onClick={() => {
                          setActivePage('admin-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Admin Control Tower
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => setActivePage('student-login')}
                  className="text-xs font-semibold text-[#0f2b5c] hover:text-amber-600 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Student Login
                </button>
                <button
                  onClick={() => setActivePage('tutor-login')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#0f2b5c] px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Tutor Login
                </button>
              </div>
            )}

            {/* Primary CTA: Book a Free Demo */}
            <button
              onClick={() => openDemoModalWithTutor()}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Free Demo</span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 px-3 flex flex-col gap-2 bg-white rounded-b-2xl shadow-xl animate-in slide-in-from-top-2">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-100 text-slate-800 min-h-[44px] flex items-center"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('tutors')}
              className="text-left px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-100 text-slate-800 min-h-[44px] flex items-center"
            >
              Find Tutors (Directory)
            </button>
            <button
              onClick={() => handleNavClick('courses')}
              className="text-left px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-100 text-slate-800 min-h-[44px] flex items-center"
            >
              Academic Courses
            </button>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">
                Portals & Authentication
              </span>

              <button
                onClick={() => handleNavClick(currentUser && activeRole === 'student' ? 'student-portal' : 'student-login')}
                className="text-left px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50/70 rounded-xl min-h-[44px] flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Student Portal ({currentUser && activeRole === 'student' ? 'Dashboard' : 'Sign In / Register'})</span>
              </button>

              <button
                onClick={() => handleNavClick(currentUser && activeRole === 'tutor' ? 'tutor-portal' : 'tutor-login')}
                className="text-left px-3 py-2 text-xs font-semibold text-slate-800 bg-amber-50/70 rounded-xl min-h-[44px] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Tutor Portal ({currentUser && activeRole === 'tutor' ? 'Dashboard' : 'Sign In / Register'})</span>
              </button>

              <button
                onClick={() => handleNavClick(isAdminAuthenticated ? 'admin-portal' : 'admin-login')}
                className="text-left px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-xl min-h-[44px] flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Admin Governance ({isAdminAuthenticated ? 'Control Tower' : 'Restricted Login'})</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a
                href="tel:03405427365"
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-[#0f2b5c] bg-amber-100/70 rounded-xl min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-amber-700" />
                <span>Helpline: 0340-5427365</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
