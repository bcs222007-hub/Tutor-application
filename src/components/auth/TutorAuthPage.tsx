import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectName, AcademicLevel, TuitionMode } from '../../types';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  Phone,
  GraduationCap,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const TutorAuthPage: React.FC = () => {
  const { setActivePage, loginAsTutor, registerTutorAccount, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [qualification, setQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [city, setCity] = useState('Islamabad');
  const [modePreference, setModePreference] = useState<TuitionMode>('Both');
  const [hourlyRate, setHourlyRate] = useState('2500');
  const [bio, setBio] = useState('');
  const [teachingMethodology, setTeachingMethodology] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectName[]>(['Mathematics']);
  const [selectedLevels, setSelectedLevels] = useState<AcademicLevel[]>(['O-Level', 'A-Level']);
  const [timingSlots, setTimingSlots] = useState('Mon-Fri 4:00 PM - 8:00 PM, Sat 10:00 AM - 4:00 PM');

  const allSubjects: SubjectName[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const allLevels: AcademicLevel[] = [
    'Grade 9',
    'Grade 10',
    '1st Year',
    '2nd Year',
    'IGCSE',
    'O-Level',
    'AS-Level',
    'A-Level',
  ];

  const handleSubjectToggle = (sub: SubjectName) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleLevelToggle = (lvl: AcademicLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const success = await loginAsTutor(loginEmail, loginPassword);
    setLoading(false);
    if (!success) {
      setErrorMessage('Tutor account not found or invalid credentials. Please check your details.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName || !regEmail || !regPassword || !qualification || !cnic) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    setLoading(true);
    const success = await registerTutorAccount({
      name: fullName,
      email: regEmail,
      password: regPassword,
      phone: phone || '0300-1234567',
      cnic,
      qualification,
      institution: institution || 'Top University Alum',
      experienceYears: parseInt(experienceYears, 10) || 3,
      subjects: selectedSubjects,
      levels: selectedLevels,
      mode: modePreference,
      hourlyRatePKR: parseInt(hourlyRate, 10) || 2000,
      monthlyRatePKR: (parseInt(hourlyRate, 10) || 2000) * 10,
      city,
      bio: bio || 'Dedicated Cambridge educator committed to concept clarity and student high achievement.',
      teachingMethodology: teachingMethodology || 'Topical past papers, interactive derivations and weekly assessments.',
      availability: timingSlots.split(',').map((s) => s.trim()),
    });
    setLoading(false);

    if (success) {
      showToast('Tutor registered! Profile submitted for admin approval.', 'success');
      setActivePage('tutor-portal');
    } else {
      setErrorMessage('Registration could not be completed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => setActivePage('home')}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Academy Home</span>
          </button>
          <span className="text-[11px] font-mono text-amber-600 font-semibold uppercase">
            Faculty Access Portal
          </span>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0f2b5c] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Faculty Instructor Login' : 'Register as Cambridge Tutor'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {mode === 'login'
              ? 'Access your teaching timetable, student assignments, attendance logs, and gradebook.'
              : 'Join our faculty roster. Submitted profiles undergo administrator verification before listing.'}
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
              New Tutor Registration
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tutor Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="farhan.malik@cambridgetutors.pk"
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
              {loading ? 'Authenticating...' : 'Sign In to Tutor Dashboard'}
            </button>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Demo Faculty Accounts: Sign in with registered faculty like <code className="font-mono font-bold">farhan.malik@cambridgetutors.pk</code> or create a new profile.
              </span>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Tutor registration puts your profile into <strong>PENDING VERIFICATION</strong> until approved by the academy administrator.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Haris Mahmood"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Account Password *</label>
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
                <label className="font-bold text-slate-700">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">CNIC / National Identity *</label>
                <input
                  type="text"
                  required
                  placeholder="37405-XXXXXXX-X"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Highest Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Phil in Mathematics / Ph.D."
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Institution / Alma Mater</label>
                <input
                  type="text"
                  placeholder="LUMS / NUST / Quaid-i-Azam University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">City / Teaching Areas</label>
                <input
                  type="text"
                  placeholder="Islamabad (F-7, F-8, F-10, DHA) / Online"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Expected Hourly Rate (PKR)</label>
                <input
                  type="number"
                  step="100"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Subjects Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Subjects You Teach *</label>
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

            {/* Classes Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Academic Classes Taught *</label>
              <div className="flex flex-wrap gap-2">
                {allLevels.map((lvl) => {
                  const isSelected = selectedLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelToggle(lvl)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Available Teaching Timings / Days</label>
              <input
                type="text"
                placeholder="Mon-Fri 4:00 PM - 8:00 PM, Sat 10:00 AM - 4:00 PM"
                value={timingSlots}
                onChange={(e) => setTimingSlots(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            {/* Bio & Methodology */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Short Professional Bio</label>
              <textarea
                rows={2}
                placeholder="Experience with Cambridge / Federal Board past papers, distinctions produced..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99]"
            >
              {loading ? 'Submitting Application to Firebase...' : 'Submit Profile for Admin Approval'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
