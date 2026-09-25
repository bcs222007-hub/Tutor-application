import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck2,
  DollarSign,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    tutors,
    students,
    courses,
    demoRequests,
    scheduledClasses,
    payments,
    updateTutorStatus,
    updateDemoStatus,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'demos' | 'tutors' | 'students' | 'payments'>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  // Computations
  const totalStudents = students.length;
  const totalTutors = tutors.length;
  const verifiedTutorsCount = tutors.filter((t) => t.verificationStatus === 'verified').length;
  const pendingTutorApps = tutors.filter((t) => t.verificationStatus === 'pending');
  const pendingDemos = demoRequests.filter((d) => d.status === 'pending');
  const totalRevenuePKR = payments.reduce((acc, p) => acc + (p.status === 'paid' ? p.paidAmountPKR : 0), 0);
  const pendingRevenuePKR = payments.reduce((acc, p) => acc + (p.status === 'pending' ? p.amountPKR : 0), 0);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#091a38] via-[#0f2b5c] to-[#091a38] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                Cambridge Tutoring Academy · Administration Command Tower
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Governance & Operations
            </h1>
            <p className="text-xs text-slate-300">
              Manage student admissions, tutor verification approvals, demo schedules, and fee ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-mono">
              Helpline: 0340-5427365
            </span>
          </div>
        </div>

        {/* Global Admin KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Students</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalStudents}</div>
            <span className="text-[10px] text-slate-500">Active enrollments</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Active Faculty</span>
            <div className="text-2xl font-black text-[#0f2b5c] font-mono">{verifiedTutorsCount}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Verified CAIE teachers</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-amber-700 font-semibold uppercase">Pending Tutors</span>
            <div className="text-2xl font-black text-amber-600 font-mono">
              {pendingTutorApps.length}
            </div>
            <span className="text-[10px] text-amber-600">CNIC review needed</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Demo Inquiries</span>
            <div className="text-2xl font-black text-blue-600 font-mono">
              {pendingDemos.length}
            </div>
            <span className="text-[10px] text-slate-500">Awaiting scheduling</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Active Courses</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{courses.length}</div>
            <span className="text-[10px] text-slate-500">Math, Phys, Chem, Bio</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-emerald-700 font-semibold uppercase">Collected Fees</span>
            <div className="text-lg font-black text-emerald-700 font-mono truncate">
              PKR {totalRevenuePKR.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              PKR {pendingRevenuePKR.toLocaleString()} pending
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Command Overview' },
            { id: 'demos', label: `Demo Requests (${demoRequests.length})` },
            { id: 'tutors', label: `Faculty & Applications (${tutors.length})` },
            { id: 'students', label: `Students & Parents (${students.length})` },
            { id: 'payments', label: `Fee Ledger & Accounts (${payments.length})` },
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
            {/* Split: Urgent Demo Requests & Pending Tutor Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Urgent Demos */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-bold text-slate-900">Recent Trial Demo Requests</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('demos')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    View All ({demoRequests.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {demoRequests.slice(0, 3).map((demo) => (
                    <div
                      key={demo.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                            {demo.level} {demo.subject}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {demo.preferredDate} ({demo.preferredTime})
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900">{demo.studentName}</h4>
                        <p className="text-slate-600">
                          {demo.tuitionMode} · {demo.cityArea} · Phone: <strong className="font-mono">{demo.contactNumber}</strong>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            demo.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {demo.status}
                        </span>
                        {demo.status === 'pending' && (
                          <button
                            onClick={() => updateDemoStatus(demo.id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Tutor Applications */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Tutor Credentials & Verification Queue
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('tutors')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Manage Faculty →
                  </button>
                </div>

                {pendingTutorApps.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    All faculty applications have been processed and verified!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingTutorApps.map((tutor) => (
                      <div
                        key={tutor.id}
                        className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/50 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded uppercase">
                              PENDING VERIFICATION
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">{tutor.name}</h4>
                            <p className="text-xs text-slate-600">
                              {tutor.qualification} · {tutor.institution}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              CNIC: {tutor.cnic || 'Under submission'} · Phone: {tutor.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60">
                          <button
                            onClick={() => updateTutorStatus(tutor.id, 'rejected')}
                            className="px-3 py-1.5 bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                          >
                            Reject Application
                          </button>
                          <button
                            onClick={() => updateTutorStatus(tutor.id, 'verified')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEMO REQUESTS */}
        {activeTab === 'demos' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">All Demo Trial Inquiries</h3>
                <p className="text-xs text-slate-500">
                  Review student requests and allocate preferred instructors
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {demoRequests.map((demo) => (
                <div
                  key={demo.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{demo.id}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">
                        {demo.level} {demo.subject}
                      </span>
                      <span className="text-slate-500 font-mono">
                        Slot: {demo.preferredDate} ({demo.preferredTime})
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Student: {demo.studentName}{' '}
                      {demo.parentName && <span className="font-normal text-slate-500">(Parent: {demo.parentName})</span>}
                    </h4>
                    <p className="text-slate-600">
                      Mode: <strong className="text-slate-800">{demo.tuitionMode}</strong> · Area: {demo.cityArea} · Helpline Contact:{' '}
                      <span className="font-mono font-bold text-[#0f2b5c]">{demo.contactNumber}</span>
                    </p>
                    {demo.additionalMessage && (
                      <p className="text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                        Note: {demo.additionalMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                        demo.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : demo.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : demo.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {demo.status}
                    </span>

                    {demo.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateDemoStatus(demo.id, 'confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                        >
                          Confirm Demo
                        </button>
                        <button
                          onClick={() => updateDemoStatus(demo.id, 'cancelled')}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TUTORS MANAGEMENT */}
        {activeTab === 'tutors' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Faculty Registry & Approvals</h3>
                <p className="text-xs text-slate-500">
                  Approved faculty appear publicly on the Tutor Marketplace.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tutor.photoUrl}
                      alt={tutor.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{tutor.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tutor.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tutor.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tutor.verificationStatus}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {tutor.qualification} · {tutor.institution}
                      </p>
                      <p className="text-slate-500 font-mono">
                        {tutor.subjects.join(', ')} · Rate: PKR {tutor.hourlyRatePKR}/hr · Contact: {tutor.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {tutor.verificationStatus === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateTutorStatus(tutor.id, 'verified')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                        >
                          Approve Faculty
                        </button>
                        <button
                          onClick={() => updateTutorStatus(tutor.id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    ) : tutor.verificationStatus === 'verified' ? (
                      <button
                        onClick={() => updateTutorStatus(tutor.id, 'rejected')}
                        className="px-3 py-1 text-slate-500 hover:text-rose-600 text-xs font-semibold"
                      >
                        Revoke Verification
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTutorStatus(tutor.id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                      >
                        Re-Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDENTS */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Enrolled Students & Parent Linkages</h3>
            <div className="divide-y divide-slate-200 text-xs">
              {students.map((std) => (
                <div key={std.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{std.name}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">
                        {std.currentLevel}
                      </span>
                    </div>
                    <p className="text-slate-600">{std.schoolCollege} · Target: {std.targetExamYear}</p>
                    <p className="text-slate-500">
                      Parent: <strong className="text-slate-800">{std.parentName}</strong> ({std.parentPhone}) · Student Phone: {std.phone}
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {std.enrolledSubjects.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right text-slate-500 font-mono">
                    ID: {std.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Academy Tuition Fee Accounts</h3>
                <p className="text-xs text-slate-500">
                  Track student invoice settlements, monthly collection, and pending dues
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Total Collected:</span>
                <span className="text-lg font-bold text-emerald-700">
                  PKR {totalRevenuePKR.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Invoice</th>
                    <th className="p-3">Student & Parent</th>
                    <th className="p-3">Month</th>
                    <th className="p-3">Amount (PKR)</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 font-sans">
                      <td className="p-3 font-mono font-bold text-[#0f2b5c]">{p.invoiceNumber}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 block">{p.studentName}</strong>
                        <span className="text-slate-500 text-[11px]">{p.parentName}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{p.month}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        PKR {p.amountPKR.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{p.dueDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {p.paymentMethod || 'Pending'}
                      </td>
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
