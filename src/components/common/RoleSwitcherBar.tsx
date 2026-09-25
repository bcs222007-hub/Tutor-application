import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, GraduationCap, Users, BookOpen, ShieldCheck, Eye } from 'lucide-react';
import { UserRole } from '../../types';

export const RoleSwitcherBar: React.FC = () => {
  const { activeRole, switchUserRole, currentUser } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'guest',
      label: 'Visitor',
      icon: <Eye className="w-3.5 h-3.5" />,
      desc: 'Public Landing & Search',
    },
    {
      role: 'student',
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      desc: 'Hamza Khan (A-Level)',
    },
    {
      role: 'parent',
      label: 'Parent',
      icon: <Users className="w-3.5 h-3.5" />,
      desc: 'Tariq Khan (Progress & Fees)',
    },
    {
      role: 'tutor',
      label: 'Tutor',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      desc: 'Dr. Farhan Malik (Faculty)',
    },
    {
      role: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      desc: 'Academic Control Tower',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide uppercase text-[11px]">
            <UserCheck className="w-3.5 h-3.5" />
            Interactive Role Preview:
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Switch instant view to test all 4 dashboards & workflows
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {roles.map((item) => {
            const isActive = activeRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => switchUserRole(item.role)}
                title={item.desc}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {currentUser && (
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Signed in as:</span>
            <span className="text-white font-medium">{currentUser.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
