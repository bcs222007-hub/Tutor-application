import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { setActivePage, loginAsAdmin, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please provide both administrative email and password.');
      return;
    }

    setLoading(true);
    const success = await loginAsAdmin(email, password);
    setLoading(false);

    if (!success) {
      setErrorMessage('Invalid administrative credentials. Access restricted to authorized personnel.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
      <div className="max-w-md w-full space-y-8 bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Back Link */}
        <button
          onClick={() => setActivePage('home')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Academy</span>
        </button>

        {/* Security Lock Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block mb-1">
              Restricted Area · Level 1 Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Governance Login
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate with your server-configured administrative credentials.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Admin Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@cambridgetutoracademy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/10 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? (
              <span>Verifying with Backend Server...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify Admin Credentials & Open Tower</span>
              </>
            )}
          </button>
        </form>

        {/* Security Notice Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Environment Variables Protection</span>
          </div>
          <p className="leading-relaxed">
            Admin credentials are not hardcoded. They are checked against <code className="text-amber-300 font-mono">ADMIN_EMAIL</code> and <code className="text-amber-300 font-mono">ADMIN_PASSWORD</code> securely on the server with HMAC-SHA256 signature verification.
          </p>
        </div>
      </div>
    </div>
  );
};
