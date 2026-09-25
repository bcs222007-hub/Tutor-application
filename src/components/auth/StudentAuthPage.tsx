import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicLevel, SubjectName } from '../../types';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  School,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const StudentAuthPage: React.FC = () => {
  const { setActivePage, loginAsStudent, registerStudentAccount, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [currentLevel, setCurrentLevel] = useState<AcademicLevel>('A-Level');
  const [schoolCollege, setSchoolCollege] = useState('');
  const [targetExamYear, setTargetExamYear] = useState('May/June 2027 CAIE Series');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectName[]>(['Mathematics', 'Physics']);

  const allSubjects: SubjectName[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const handleSubjectToggle = (sub: SubjectName) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const success = await loginAsStudent(loginEmail, loginPassword);
    setLoading(false);
    if (!success) {
      setErrorMessage('Student account not found or invalid password. Please check your credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name || !regEmail || !regPassword) {
      setErrorMessage('Please fill in your name, email and a secure password.');
      return;
    }

    setLoading(true);
    const success = await registerStudentAccount({
      name,
      email: regEmail,
      password: regPassword,
      phone: phone || '0300-1234567',
      currentLevel,
      schoolCollege: schoolCollege || 'Cambridge Academy Candidate',
      targetExamYear,
      enrolledSubjects: selectedSubjects,
    });
    setLoading(false);

    if (success) {
      showToast('Student account created! Welcome to Cambridge Tutors.', 'success');
      setActivePage('student-portal');
    } else {
      setErrorMessage('Could not register account. Please check your details.');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => setActivePage('home')}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Academy Home</span>
          </button>
          <span className="text-[11px] font-mono text-blue-600 font-semibold uppercase">
            Student / Learner Access
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Student Sign In' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {mode === 'login'
              ? 'Access your enrolled classes, tutor chat, worksheets, test marks, and revision notes.'
              : 'Register to connect with verified Cambridge tutors, book demos, and track exam preparation.'}
          </p>

          <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-xl max-w-xs mx-auto mt-4">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-[#0f2b5c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Student
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Student Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="hamza.student@cambridge.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0f2b5c] hover:bg-[#0c234a] disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In to Student Dashboard'}
            </button>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Demo Student Account: Sign in with <code className="font-mono font-bold">hamza.student@cambridge.edu</code> to view live test scores, attendance, and homework.
              </span>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zayd Qureshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="zayd.student@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone (WhatsApp)</label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Academic Level / Class *</label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value as AcademicLevel)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="A-Level">A-Level</option>
                  <option value="AS-Level">AS-Level</option>
                  <option value="O-Level">O-Level</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="2nd Year">2nd Year (Intermediate)</option>
                  <option value="1st Year">1st Year (Intermediate)</option>
                  <option value="Grade 10">Grade 10 (Matric)</option>
                  <option value="Grade 9">Grade 9 (Matric)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">School / College</label>
                <input
                  type="text"
                  placeholder="e.g. Roots Millennium / Froebel's"
                  value={schoolCollege}
                  onChange={(e) => setSchoolCollege(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Target Exam Series */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Target Examination Series</label>
              <input
                type="text"
                placeholder="e.g. May/June 2027 CAIE Series"
                value={targetExamYear}
                onChange={(e) => setTargetExamYear(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            {/* Subjects Needed */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Subjects Needed *</label>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubjectToggle(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected ? 'bg-[#0f2b5c] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99]"
            >
              {loading ? 'Creating Student Profile in Firebase...' : 'Create Account & Open Dashboard'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
