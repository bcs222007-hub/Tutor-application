import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, BookOpen, Eye, Lock, LogOut } from 'lucide-react';
import { ActivePage } from '../../context/AppContext';

export const RoleSwitcherBar: React.FC = () => {
  const { activePage, setActivePage, activeRole, currentUser, logoutAdmin, isAdminAuthenticated } = useApp();

  return (
    <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs py-1.5 px-3 sm:px-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Academy Portals:
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {/* Public Home */}
          <button
            onClick={() => setActivePage('home')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
              activePage === 'home'
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3 h-3 shrink-0" />
            <span>Public Academy</span>
          </button>

          {/* Student Access */}
          <button
            onClick={() => setActivePage('student-portal')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
              activePage === 'student-portal' || activePage === 'student-login'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3 h-3 shrink-0" />
            <span>Student Portal</span>
          </button>

          {/* Tutor Access */}
          <button
            onClick={() => setActivePage('tutor-portal')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
              activePage === 'tutor-portal' || activePage === 'tutor-login'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>Faculty Tutor</span>
          </button>

          {/* Admin Access - Protected with Lock */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700">
              <button
                onClick={() => setActivePage('admin-portal')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                  activePage === 'admin-portal'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={logoutAdmin}
                title="Logout Admin"
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('admin-login')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap ${
                activePage === 'admin-login'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80'
              }`}
            >
              <Lock className="w-3 h-3 shrink-0 text-amber-500" />
              <span>Admin Login (Protected)</span>
            </button>
          )}
        </div>

        {currentUser && (
          <div className="hidden xl:flex items-center gap-2 text-[10px] text-slate-400">
            <span>Signed in:</span>
            <span className="text-white font-medium truncate max-w-[120px]">{currentUser.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
