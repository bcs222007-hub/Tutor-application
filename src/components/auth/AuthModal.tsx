import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAsUser, registerUser, switchUserRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    if (mode === 'register') {
      const success = await registerUser(email, password, name || email.split('@')[0], selectedRole);
      setLoading(false);
      if (success) {
        setIsAuthModalOpen(false);
      }
    } else {
      const ok = await loginAsUser(email, password);
      setLoading(false);
      if (ok) {
        setIsAuthModalOpen(false);
      } else {
        switchUserRole(selectedRole);
        setIsAuthModalOpen(false);
      }
    }
  };

  const handleRoleQuickSelect = (role: UserRole) => {
    switchUserRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-8">
        {/* Banner */}
        <div className="bg-[#0f2b5c] p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                Cambridge Portal Access
              </span>
            </div>
            <h3 className="text-xl font-bold">
              {mode === 'login' ? 'Account Sign In' : 'Create New Account'}
            </h3>
            <p className="text-xs text-slate-300">
              Access your personalized tutoring portal.
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Instant Demo Switcher Strip */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-100 space-y-2">
          <span className="text-[11px] font-bold text-amber-900 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Quick Demo Login (Select Role Directly):
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleRoleQuickSelect('student')}
              className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-slate-800 flex items-center gap-2 transition-all shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-left">
                <span className="block leading-none font-bold">Student</span>
                <span className="text-[10px] text-slate-400">Hamza Khan</span>
              </div>
            </button>

            <button
              onClick={() => handleRoleQuickSelect('parent')}
              className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-slate-800 flex items-center gap-2 transition-all shadow-2xs"
            >
              <Users className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-left">
                <span className="block leading-none font-bold">Parent</span>
                <span className="text-[10px] text-slate-400">Tariq Khan</span>
              </div>
            </button>

            <button
              onClick={() => handleRoleQuickSelect('tutor')}
              className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-slate-800 flex items-center gap-2 transition-all shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-left">
                <span className="block leading-none font-bold">Tutor</span>
                <span className="text-[10px] text-slate-400">Dr. Farhan</span>
              </div>
            </button>

            <button
              onClick={() => handleRoleQuickSelect('admin')}
              className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-slate-800 flex items-center gap-2 transition-all shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#0f2b5c] shrink-0" />
              <div className="text-left">
                <span className="block leading-none font-bold">Admin</span>
                <span className="text-[10px] text-slate-400">Academy Lead</span>
              </div>
            </button>
          </div>
        </div>

        {/* Regular Login / Register Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Account Type / Role</label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
              {(['student', 'parent', 'tutor', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-1.5 rounded-lg text-center font-bold capitalize transition-all ${
                    selectedRole === r
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. hamza.student@cambridge.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0f2b5c] hover:bg-[#0c234a] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition-colors mt-2"
          >
            {loading
              ? 'Connecting to Firebase...'
              : mode === 'login'
              ? `Sign In as ${selectedRole.toUpperCase()}`
              : 'Create Account'}
          </button>

          <div className="text-center pt-2 text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-amber-700 hover:underline"
                >
                  Register Here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#0f2b5c] hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
