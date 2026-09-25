import React, { useState } from 'react';
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
} from 'lucide-react';
import { SubjectName, AcademicLevel } from '../../types';

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
  } = useApp();

  // Active tutor: Dr. Farhan Malik
  const tutor = tutors[0];

  const [activeTab, setActiveTab] = useState<'classes' | 'requests' | 'attendance' | 'assignments' | 'tests'>('classes');

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
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                  Faculty Instructor Console
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Status: {tutor.verificationStatus.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{tutor.name}</h1>
              <p className="text-xs text-slate-300">
                {tutor.qualification} · {tutor.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openChatWith('user_admin_1', 'Academic Administration')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Contact Admin Office</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'classes', label: `My Classes (${tutorClasses.length})` },
            { id: 'requests', label: `Student Demo Requests (${tutorDemos.length})` },
            { id: 'attendance', label: 'Mark Attendance' },
            { id: 'assignments', label: 'Assignments & Notes' },
            { id: 'tests', label: 'Gradebook & Tests' },
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
      </div>
    </div>
  );
};
