import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Upload,
  Plus,
  MessageSquare,
  Users,
  ShieldCheck,
  Award,
  AlertCircle,
  AlertTriangle,
  LogOut,
  Save,
  Send,
  MapPin,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import { SubjectName, AcademicLevel, TuitionMode } from '../../types';

export const TutorDashboard: React.FC = () => {
  const {
    tutors,
    students,
    scheduledClasses,
    demoRequests,
    updateDemoStatus,
    attendanceRecords,
    markAttendance,
    assignments,
    createAssignment,
    gradeAssignment,
    testResults,
    addTestResult,
    openChatWith,
    showToast,
    currentUser,
    updateTutorProfile,
    logout,
  } = useApp();

  // Active tutor: find matching registered/logged-in tutor or fallback to first
  const tutor =
    (currentUser &&
      tutors.find(
        (t) =>
          t.email.toLowerCase() === currentUser.email?.toLowerCase() ||
          t.id === currentUser.id ||
          t.id === currentUser.tutorId
      )) ||
    tutors[0];

  const [activeTab, setActiveTab] = useState<
    'classes' | 'requests' | 'attendance' | 'assignments' | 'tests' | 'profile'
  >('classes');

  // Profile Edit State
  const [qual, setQual] = useState(tutor.qualification);
  const [inst, setInst] = useState(tutor.institution);
  const [exp, setExp] = useState(String(tutor.experienceYears));
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectName[]>(tutor.subjects);
  const [selectedLevels, setSelectedLevels] = useState<AcademicLevel[]>(tutor.levels);
  const [mode, setMode] = useState<TuitionMode>(tutor.mode);
  const [rate, setRate] = useState(String(tutor.hourlyRatePKR));
  const [city, setCity] = useState(tutor.city);
  const [areas, setAreas] = useState(tutor.areasCovered?.join(', ') || 'Blue Area, F-7, DHA');
  const [timings, setTimings] = useState(
    tutor.availability?.join(', ') || 'Mon-Fri 4:00 PM - 8:00 PM'
  );
  const [bio, setBio] = useState(tutor.bio);
  const [methodology, setMethodology] = useState(tutor.teachingMethodology);
  const [photoUrl, setPhotoUrl] = useState(tutor.photoUrl);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync state if tutor changes
  useEffect(() => {
    setQual(tutor.qualification);
    setInst(tutor.institution);
    setExp(String(tutor.experienceYears));
    setSelectedSubjects(tutor.subjects);
    setSelectedLevels(tutor.levels);
    setMode(tutor.mode);
    setRate(String(tutor.hourlyRatePKR));
    setCity(tutor.city);
    setAreas(tutor.areasCovered?.join(', ') || 'Blue Area, F-7, DHA');
    setTimings(tutor.availability?.join(', ') || 'Mon-Fri 4:00 PM - 8:00 PM');
    setBio(tutor.bio);
    setMethodology(tutor.teachingMethodology);
    setPhotoUrl(tutor.photoUrl);
  }, [tutor.id]);

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

  const handleSaveProfile = async (resubmitForApproval: boolean) => {
    setSavingProfile(true);
    await updateTutorProfile(
      tutor.id,
      {
        qualification: qual,
        institution: inst,
        experienceYears: parseInt(exp, 10) || 3,
        subjects: selectedSubjects,
        levels: selectedLevels,
        mode,
        hourlyRatePKR: parseInt(rate, 10) || 2000,
        monthlyRatePKR: (parseInt(rate, 10) || 2000) * 10,
        city,
        areasCovered: areas.split(',').map((a) => a.trim()),
        availability: timings.split(',').map((t) => t.trim()),
        bio,
        teachingMethodology: methodology,
        photoUrl,
      },
      resubmitForApproval
    );
    setSavingProfile(false);
  };

  // Attendance form modal/state
  const [attStudentId, setAttStudentId] = useState('std_1');
  const [attSubject, setAttSubject] = useState<SubjectName>('Mathematics');
  const [attStatus, setAttStatus] = useState<'present' | 'absent' | 'leave'>('present');
  const [attTopic, setAttTopic] = useState('');
  const [attRemark, setAttRemark] = useState('');

  // New assignment modal/state
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState<SubjectName>('Mathematics');
  const [newAsgLevel, setNewAsgLevel] = useState<AcademicLevel>('A-Level');
  const [newAsgDueDate, setNewAsgDueDate] = useState('2026-10-02');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgMarks, setNewAsgMarks] = useState('50');

  // New test score modal/state
  const [testStudentId, setTestStudentId] = useState('std_1');
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState<SubjectName>('Mathematics');
  const [testLevel, setTestLevel] = useState<AcademicLevel>('A-Level');
  const [testTotalMarks, setTestTotalMarks] = useState('100');
  const [testObtainedMarks, setTestObtainedMarks] = useState('85');
  const [testGrade, setTestGrade] = useState<'A*' | 'A' | 'B' | 'C' | 'D' | 'U'>('A*');
  const [testRemarks, setTestRemarks] = useState('');

  // Handle Mark Attendance
  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attTopic) return;
    const std = students.find((s) => s.id === attStudentId);
    markAttendance({
      studentId: attStudentId,
      studentName: std ? std.name : 'Candidate',
      subject: attSubject,
      date: new Date().toISOString().split('T')[0],
      status: attStatus,
      topicCovered: attTopic,
      tutorRemark: attRemark || 'Punctual and grasped core concept.',
    });
    setAttTopic('');
    setAttRemark('');
  };

  // Handle Create Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle) return;
    createAssignment({
      title: newAsgTitle,
      subject: newAsgSubject,
      level: newAsgLevel,
      tutorId: tutor.id,
      tutorName: tutor.name,
      dueDate: newAsgDueDate,
      description: newAsgDesc,
      totalMarks: parseInt(newAsgMarks, 10) || 50,
      attachmentName: `${newAsgTitle.replace(/\s+/g, '_')}_Worksheet.pdf`,
    });
    setNewAsgTitle('');
    setNewAsgDesc('');
  };

  // Handle Add Test
  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle) return;
    const std = students.find((s) => s.id === testStudentId);
    addTestResult({
      testTitle,
      subject: testSubject,
      level: testLevel,
      date: new Date().toISOString().split('T')[0],
      totalMarks: parseInt(testTotalMarks, 10) || 100,
      obtainedMarks: parseInt(testObtainedMarks, 10) || 85,
      grade: testGrade,
      studentId: testStudentId,
      studentName: std ? std.name : 'Student',
      tutorName: tutor.name,
      remarks: testRemarks || 'Exam standards thoroughly satisfied.',
    });
    setTestTitle('');
    setTestRemarks('');
  };

  const tutorClasses = scheduledClasses.filter((c) => c.tutorId === tutor.id);
  const tutorDemos = demoRequests.filter((d) => d.preferredTutorId === tutor.id || !d.preferredTutorId);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tutor Banner */}
        <div className="bg-gradient-to-r from-[#0a1e3f] via-[#0f2b5c] to-[#0a1e3f] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-800 shadow-md">
              <img
                src={tutor.photoUrl}
                alt={tutor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                  Faculty Instructor Console
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${
                    tutor.verificationStatus === 'verified'
                      ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300'
                      : tutor.verificationStatus === 'pending'
                      ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                      : tutor.verificationStatus === 'blocked'
                      ? 'bg-rose-950 border border-rose-500/40 text-rose-300'
                      : 'bg-rose-950/80 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  Status: {tutor.verificationStatus.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{tutor.name}</h1>
              <p className="text-xs text-slate-300">
                {tutor.qualification} · {tutor.institution}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openChatWith('user_admin_1', 'Academic Administration')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Contact Admin</span>
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Verification Status Alert Banner */}
        {tutor.verificationStatus === 'pending' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">Profile Pending Administrator Approval</strong>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your faculty account has been registered and is undergoing background & CNIC verification by the Cambridge Administrative Team. You can view or update your qualifications, preferred subjects, and teaching slots under the <strong>"My Profile & Qualifications"</strong> tab.
              </p>
            </div>
          </div>
        )}

        {tutor.verificationStatus === 'rejected' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">Application Revision Requested</strong>
              <p className="text-xs text-rose-800 leading-relaxed">
                Administration has requested adjustments to your submitted profile. Please review your academic degrees, CNIC documentation, and teaching methodology in the profile tab, then click <strong>"Submit for Approval"</strong>.
              </p>
            </div>
          </div>
        )}

        {tutor.verificationStatus === 'blocked' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-red-950 text-red-100 border border-red-800 flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">Account Disabled by Administration</strong>
              <p className="text-xs text-red-300 leading-relaxed">
                This faculty teaching account is currently blocked. To appeal or resolve this issue, please contact the academy helpline directly at <strong>0340-5427365</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'classes', label: `My Classes (${tutorClasses.length})` },
            { id: 'requests', label: `Student Demo Requests (${tutorDemos.length})` },
            { id: 'attendance', label: 'Mark Attendance' },
            { id: 'assignments', label: 'Assignments & Notes' },
            { id: 'tests', label: 'Gradebook & Tests' },
            { id: 'profile', label: 'My Profile & Qualifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#0f2b5c] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CLASSES */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Today & Upcoming Sessions</h3>
                <p className="text-xs text-slate-500">Live video rooms & home tuition itineraries</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                        {cls.subject} ({cls.level})
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {cls.date} · {cls.time}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{cls.courseTitle}</h4>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Enrolled Student:</span>
                        <strong className="text-slate-900">{cls.studentName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Delivery Mode:</span>
                        <span className="font-semibold text-[#0f2b5c]">{cls.mode}</span>
                      </div>
                      {cls.homeAddress && (
                        <div className="flex justify-between pt-1 border-t border-slate-200/60 text-amber-800">
                          <span>Address:</span>
                          <span className="font-mono">{cls.homeAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => openChatWith(cls.studentId, cls.studentName)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Chat Student</span>
                    </button>

                    {cls.meetingLink && (
                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#0f2b5c] hover:bg-[#0c234a] text-white text-xs font-bold rounded-xl shadow-sm"
                      >
                        Start Classroom
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DEMO REQUESTS */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Free Demo Inquiries for You</h3>
              <p className="text-xs text-slate-500">
                Incoming student trial bookings. Accept or mark completed.
              </p>
            </div>

            <div className="space-y-4">
              {tutorDemos.map((demo) => (
                <div
                  key={demo.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded">
                        {demo.level} {demo.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Slot: {demo.preferredDate} at {demo.preferredTime}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {demo.studentName}{' '}
                      {demo.parentName ? `(Parent: ${demo.parentName})` : ''}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Mode: <strong className="text-slate-800">{demo.tuitionMode}</strong> · Area: {demo.cityArea} · Phone: <span className="font-mono">{demo.contactNumber}</span>
                    </p>
                    {demo.additionalMessage && (
                      <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                        "{demo.additionalMessage}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {demo.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateDemoStatus(demo.id, 'confirmed')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Demo</span>
                        </button>
                        <button
                          onClick={() => updateDemoStatus(demo.id, 'cancelled')}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                        {demo.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE MARKER */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Record Session Attendance</h3>
              <form onSubmit={handleMarkAttendance} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Select Student</label>
                  <select
                    value={attStudentId}
                    onChange={(e) => setAttStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.currentLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subject</label>
                  <select
                    value={attSubject}
                    onChange={(e) => setAttSubject(e.target.value as SubjectName)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Attendance Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['present', 'absent', 'leave'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setAttStatus(st)}
                        className={`p-2 rounded-lg border text-center font-bold capitalize transition-all ${
                          attStatus === st
                            ? 'bg-[#0f2b5c] text-white border-[#0f2b5c]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Topic Covered Today *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implicit Differentiation & Normal Lines"
                    value={attTopic}
                    onChange={(e) => setAttTopic(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tutor Remark / Homework Note</label>
                  <textarea
                    rows={2}
                    placeholder="Comment for parent and student dashboard..."
                    value={attRemark}
                    onChange={(e) => setAttRemark(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f2b5c] hover:bg-[#0c234a] text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Save Attendance Record
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recent Attendance Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Topic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {attendanceRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2.5 font-mono text-slate-500">{r.date}</td>
                        <td className="p-2.5 font-bold text-slate-800">{r.studentName}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              r.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-700 truncate max-w-[180px]">
                          {r.topicCovered}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Upload New Assignment / Sheet</h3>
              <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assignment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Math 3 Integration by Parts Sheet"
                    value={newAsgTitle}
                    onChange={(e) => setNewAsgTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subject</label>
                    <select
                      value={newAsgSubject}
                      onChange={(e) => setNewAsgSubject(e.target.value as SubjectName)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Level</label>
                    <select
                      value={newAsgLevel}
                      onChange={(e) => setNewAsgLevel(e.target.value as AcademicLevel)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="A-Level">A-Level</option>
                      <option value="O-Level">O-Level</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="1st Year">1st Year</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Due Date</label>
                    <input
                      type="date"
                      value={newAsgDueDate}
                      onChange={(e) => setNewAsgDueDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Total Marks</label>
                    <input
                      type="number"
                      value={newAsgMarks}
                      onChange={(e) => setNewAsgMarks(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Task Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Specific questions to complete from topical past paper workbook..."
                    value={newAsgDesc}
                    onChange={(e) => setNewAsgDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-sm transition-colors"
                >
                  Publish Assignment for Students
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Student Homework Submissions</h3>
              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div key={asg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {asg.level} · Due: {asg.dueDate} · {asg.totalMarks} marks
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-blue-700">
                        {asg.submissions.length} Submissions
                      </span>
                    </div>

                    {asg.submissions.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <strong className="text-slate-900">{sub.studentName}</strong>
                          <span className="text-slate-500 block text-[11px]">
                            Submitted on {sub.submittedAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub.obtainedMarks !== undefined ? (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg font-mono">
                              Graded: {sub.obtainedMarks}/{asg.totalMarks}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                const marks = prompt('Enter obtained marks (out of ' + asg.totalMarks + '):', '45');
                                if (marks) {
                                  gradeAssignment(asg.id, sub.studentId, parseInt(marks, 10), 'Strong methodology. Checked by faculty.');
                                }
                              }}
                              className="px-3 py-1.5 bg-[#0f2b5c] text-white font-bold text-xs rounded-lg hover:bg-[#0c234a]"
                            >
                              Grade Homework
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TESTS */}
        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Record Test / Mock Exam Score</h3>
              <form onSubmit={handleAddTest} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Select Student *</label>
                  <select
                    value={testStudentId}
                    onChange={(e) => setTestStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.currentLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Test Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Math 3 Calculus Mid-Term Mock"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subject</label>
                    <select
                      value={testSubject}
                      onChange={(e) => setTestSubject(e.target.value as SubjectName)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Grade Awarded</label>
                    <select
                      value={testGrade}
                      onChange={(e) => setTestGrade(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-amber-700"
                    >
                      <option value="A*">Grade A*</option>
                      <option value="A">Grade A</option>
                      <option value="B">Grade B</option>
                      <option value="C">Grade C</option>
                      <option value="D">Grade D</option>
                      <option value="U">Grade U</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Obtained Marks</label>
                    <input
                      type="number"
                      value={testObtainedMarks}
                      onChange={(e) => setTestObtainedMarks(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Total Marks</label>
                    <input
                      type="number"
                      value={testTotalMarks}
                      onChange={(e) => setTestTotalMarks(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Examiner Remarks & Advice</label>
                  <textarea
                    rows={2}
                    placeholder="Specific strength, weak chapters, and next milestone..."
                    value={testRemarks}
                    onChange={(e) => setTestRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-sm transition-colors"
                >
                  Publish Result to Student & Parent Portal
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Published Diagnostic Results</h3>
              <div className="divide-y divide-slate-100">
                {testResults.map((t) => (
                  <div key={t.id} className="py-4 space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-slate-400 text-[10px]">{t.date}</span>
                        <h4 className="text-xs font-bold text-slate-900">{t.testTitle}</h4>
                        <span className="text-slate-500">
                          Student: <strong className="text-slate-800">{t.studentName}</strong> ({t.subject})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-[#0f2b5c] block">
                          {t.obtainedMarks} / {t.totalMarks}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[10px]">
                          Grade {t.grade}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 bg-slate-50 p-2 rounded-lg text-[11px]">
                      {t.remarks}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MY PROFILE & QUALIFICATIONS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Faculty Profile & Credentials</h3>
                <p className="text-xs text-slate-500">
                  Update your qualifications, subjects taught, teaching areas, and available timetable slots.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">
                  Tutor ID: <strong className="text-slate-800">{tutor.id}</strong>
                </span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile(false);
              }}
              className="space-y-6 text-xs"
            >
              {/* Row 1: Basic Identity (read-only/editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Instructor Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={tutor.name}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={tutor.email}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Phone / WhatsApp</label>
                  <input
                    type="text"
                    disabled
                    value={tutor.phone}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">CNIC / Identity Document</label>
                  <input
                    type="text"
                    disabled
                    value={tutor.cnic || 'CNIC Submitted'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2: Qualifications & Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700 block">
                    Highest Academic Degree / Qualification <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc. Applied Mathematics, M.Phil Chemistry"
                    value={qual}
                    onChange={(e) => setQual(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Years of Teaching Experience <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Alma Mater / University / College <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NUST Islamabad / University of Cambridge"
                    value={inst}
                    onChange={(e) => setInst(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Teaching Delivery Mode <span className="text-amber-600">*</span>
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as TuitionMode)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Both">Both (Online Classes & In-Person Home Tuition)</option>
                    <option value="Online">Online Classes Only</option>
                    <option value="Home Tuition">In-Person Home Tuition Only</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Subjects Taught */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Subjects You Teach (Select all applicable) <span className="text-amber-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {allSubjects.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => handleSubjectToggle(sub)}
                        className={`p-3 rounded-xl border text-left font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{sub}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Academic Levels */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Academic Levels You Instruct <span className="text-amber-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {allLevels.map((lvl) => {
                    const isSelected = selectedLevels.includes(lvl);
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => handleLevelToggle(lvl)}
                        className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Rates & Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Hourly Tuition Rate (PKR) <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">PKR</span>
                    <input
                      type="number"
                      step="100"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">City Base</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Preferred Home Tuition Sectors / Areas</label>
                  <input
                    type="text"
                    placeholder="e.g. F-6, F-7, G-11, Bahria, DHA"
                    value={areas}
                    onChange={(e) => setAreas(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Row 6: Timings */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Available Timetable Slots (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mon-Fri 4:00 PM - 8:00 PM, Sat 10:00 AM - 4:00 PM"
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Row 7: Bio & Methodology */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Instructor Biography</label>
                  <textarea
                    rows={3}
                    placeholder="Brief introduction for students and parents..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Teaching Methodology & Exam Focus</label>
                  <textarea
                    rows={3}
                    placeholder="Past papers, mark scheme drills, derivation clarity..."
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={savingProfile}
                  onClick={() => handleSaveProfile(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft Profile</span>
                </button>

                <button
                  type="button"
                  disabled={savingProfile}
                  onClick={() => handleSaveProfile(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>{savingProfile ? 'Submitting...' : 'Submit Profile for Admin Approval'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
