import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  Upload,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    students,
    scheduledClasses,
    attendanceRecords,
    assignments,
    testResults,
    openChatWith,
    openDemoModalWithTutor,
    tutors,
    setActivePage,
    showToast,
  } = useApp();

  // Primary demo student
  const student = students[0];

  const studentClasses = scheduledClasses.filter((c) => c.studentId === student.id);
  const studentAttendance = attendanceRecords.filter((a) => a.studentId === student.id);
  const studentTests = testResults.filter((t) => t.studentId === student.id);

  // Attendance stats
  const totalClasses = studentAttendance.length;
  const attendedClasses = studentAttendance.filter((a) => a.status === 'present').length;
  const attendancePercent = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  // Active tab inside student dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments' | 'tests' | 'attendance'>('overview');

  const handleAssignmentUpload = (asgTitle: string) => {
    showToast(`Homework solution uploaded for "${asgTitle}". Your tutor will review shortly!`, 'success');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#0a1e3f] via-[#0f2b5c] to-[#0a1e3f] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg">
              {student.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                  Student Portal · {student.currentLevel}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                  Active Enrolled
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {student.name}!
              </h1>
              <p className="text-xs text-slate-300">
                {student.schoolCollege} · Target: {student.targetExamYear}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openDemoModalWithTutor()}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Book Additional Subject Demo</span>
            </button>
            <button
              onClick={() => openChatWith('tutor_1', 'Dr. Farhan Malik')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Message Tutor</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'classes', label: `Scheduled Classes (${studentClasses.length})` },
            { id: 'assignments', label: `Assignments (${assignments.length})` },
            { id: 'tests', label: `Test Results (${studentTests.length})` },
            { id: 'attendance', label: `Attendance Record (${attendancePercent}%)` },
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Enrolled Subjects</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">
                  {student.enrolledSubjects.length}
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-1">
                  {student.enrolledSubjects.map((s, i) => (
                    <span key={i} className="text-blue-700 font-semibold">
                      {s}{i < student.enrolledSubjects.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Attendance Rate</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                  {attendancePercent}%
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {attendedClasses} of {totalClasses} classes attended
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Latest Mock Result</span>
                <div className="text-2xl font-extrabold text-amber-600 font-mono">
                  A* (69/75)
                </div>
                <span className="text-[11px] text-slate-500 block truncate">
                  Pure Math 3 Diagnostic
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Pending Tasks</span>
                <div className="text-2xl font-extrabold text-[#0f2b5c] font-mono">
                  1 Assignment
                </div>
                <span className="text-[11px] text-amber-700 font-semibold block">
                  Due in 3 days (Kinetics)
                </span>
              </div>
            </div>

            {/* Split Row: Upcoming Classes & Assigned Tutors */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Upcoming Classes */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">Upcoming Live Sessions</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('classes')}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    View All Schedule →
                  </button>
                </div>

                <div className="space-y-3">
                  {studentClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-amber-400 bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                            {cls.subject}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {cls.date} · {cls.time}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{cls.courseTitle}</h4>
                        <span className="text-xs text-slate-600 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-400" />
                          Faculty: {cls.tutorName} ({cls.mode})
                        </span>
                      </div>

                      {cls.mode === 'Online' && cls.meetingLink ? (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#0f2b5c] hover:bg-[#0c234a] text-white font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Join Online Class</span>
                        </a>
                      ) : (
                        <div className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                          Home Tuition Scheduled
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Tutors */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold text-slate-900">Your Assigned Faculty</h3>
                  </div>
                  <button
                    onClick={() => setActivePage('tutors')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Directory
                  </button>
                </div>

                <div className="space-y-4">
                  {tutors
                    .filter((t) => student.assignedTutorIds.includes(t.id))
                    .map((tutor) => (
                      <div
                        key={tutor.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={tutor.photoUrl}
                            alt={tutor.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{tutor.name}</h4>
                            <p className="text-[11px] text-amber-700 font-medium">
                              {tutor.subjects.join(', ')}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {tutor.qualification}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => openChatWith(tutor.id, tutor.name)}
                          className="p-2 text-[#0f2b5c] hover:bg-white rounded-lg border border-slate-200 transition-colors"
                          title="Send message to tutor"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong className="block font-bold">Need Help or Revision Extra Class?</strong>
                  <p>Request an additional slot or test preparation with our support desk anytime.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULED CLASSES */}
        {activeTab === 'classes' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Your Full Class Schedule</h3>
            <div className="space-y-4">
              {studentClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs font-bold rounded">
                        {cls.subject}
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        Date: {cls.date} · Time: {cls.time} ({cls.durationMinutes} mins)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{cls.courseTitle}</h4>
                    <p className="text-xs text-slate-500">
                      Instructor: <strong className="text-slate-800">{cls.tutorName}</strong> · Mode: {cls.mode}
                    </p>
                    {cls.homeAddress && (
                      <p className="text-xs text-amber-800 font-mono">Location: {cls.homeAddress}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cls.meetingLink ? (
                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#0f2b5c] hover:bg-[#0c234a] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch Online Classroom</span>
                      </a>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg">
                        Home Tutor Dispatched
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Assignments & Homework Sheets</h3>
            <div className="space-y-4">
              {assignments.map((asg) => {
                const sub = asg.submissions.find((s) => s.studentId === student.id);
                return (
                  <div
                    key={asg.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-bold">
                            {asg.subject}
                          </span>
                          <span className="text-xs font-mono text-rose-600 font-semibold">
                            Due: {asg.dueDate}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{asg.title}</h4>
                      </div>

                      <div className="text-xs font-mono">
                        <span className="text-slate-500">Total Marks: </span>
                        <strong className="text-slate-900">{asg.totalMarks}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>

                    {asg.attachmentName && (
                      <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 max-w-fit">
                        <FileText className="w-4 h-4" />
                        <span className="font-mono font-medium">{asg.attachmentName}</span>
                      </div>
                    )}

                    {sub ? (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Submitted on {sub.submittedAt} ({sub.status.toUpperCase()})
                          </span>
                          {sub.obtainedMarks !== undefined && (
                            <span className="font-mono font-bold text-emerald-900 text-sm">
                              Score: {sub.obtainedMarks} / {asg.totalMarks}
                            </span>
                          )}
                        </div>
                        {sub.feedback && (
                          <p className="text-emerald-800 pt-1 border-t border-emerald-200/60 mt-1">
                            <strong>Tutor Feedback:</strong> {sub.feedback}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleAssignmentUpload(asg.title)}
                          className="px-4 py-2 bg-[#0f2b5c] hover:bg-[#0c234a] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Solution PDF</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: TEST RESULTS */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Official Cambridge Diagnostic Tests</h3>
            <div className="divide-y divide-slate-200">
              {studentTests.map((t) => (
                <div key={t.id} className="py-5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-bold">
                          {t.subject}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{t.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{t.testTitle}</h4>
                      <p className="text-xs text-slate-500">Evaluator: {t.tutorName}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#0f2b5c] font-mono">
                          {t.obtainedMarks}
                          <span className="text-sm font-normal text-slate-400">/{t.totalMarks}</span>
                        </span>
                      </div>
                      <span className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-sm rounded-xl font-mono">
                        Grade {t.grade}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <strong className="text-slate-900">Examiner Remarks:</strong> {t.remarks}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Session Attendance Log</h3>
                <p className="text-xs text-slate-500">Verified by teaching faculty after each class</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-500">Overall: </span>
                <span className="text-lg font-bold text-emerald-600">{attendancePercent}%</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Topic Covered</th>
                    <th className="p-3">Tutor Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 font-sans">
                      <td className="p-3 font-mono text-slate-600">{rec.date}</td>
                      <td className="p-3 font-bold text-slate-900">{rec.subject}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rec.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'leave'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{rec.topicCovered}</td>
                      <td className="p-3 text-slate-500 italic">{rec.tutorRemark || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
