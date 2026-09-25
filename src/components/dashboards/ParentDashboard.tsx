import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Award,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Phone,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Student } from '../../types';

export const ParentDashboard: React.FC = () => {
  const {
    students,
    tutors,
    scheduledClasses,
    attendanceRecords,
    testResults,
    payments,
    payInvoice,
    openChatWith,
    showToast,
  } = useApp();

  // The parent has 2 children in our mock data: Hamza (A-Level) and Amina (O-Level)
  const [selectedChildId, setSelectedChildId] = useState<string>('std_1');
  const [isPayingInvoiceId, setIsPayingInvoiceId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Easypaisa' | 'Bank Transfer'>('JazzCash');

  const selectedChild = students.find((s) => s.id === selectedChildId) || students[0];

  // Child data
  const childClasses = scheduledClasses.filter((c) => c.studentId === selectedChild.id);
  const childAttendance = attendanceRecords.filter((a) => a.studentId === selectedChild.id);
  const childTests = testResults.filter((t) => t.studentId === selectedChild.id);
  const childPayments = payments.filter((p) => p.studentId === selectedChild.id);

  // Child metrics
  const totalAttended = childAttendance.filter((a) => a.status === 'present').length;
  const childAttendanceRate =
    childAttendance.length > 0 ? Math.round((totalAttended / childAttendance.length) * 100) : 95;

  const handleConfirmPay = (invoiceId: string) => {
    payInvoice(invoiceId, paymentMethod);
    setIsPayingInvoiceId(null);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Parent Welcome Bar with Child Switcher */}
        <div className="bg-gradient-to-r from-[#0a1e3f] via-[#0f2b5c] to-[#0a1e3f] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                Parent Oversight Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tariq Mehmood Khan
            </h1>
            <p className="text-xs text-slate-300">
              Monitoring academic growth, weekly attendance, and tuition accounts.
            </p>
          </div>

          {/* Child Switcher Pill/Button Group */}
          <div className="bg-white/10 p-1.5 rounded-2xl border border-white/20 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-300 px-3 hidden sm:inline">
              Select Child:
            </span>
            {students.slice(0, 2).map((child) => {
              const isSelected = selectedChildId === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{child.name} ({child.currentLevel})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Child Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Child Profile</span>
            <div className="text-lg font-bold text-slate-900">{selectedChild.name}</div>
            <p className="text-xs text-slate-500">{selectedChild.schoolCollege}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Attendance Reliability</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {childAttendanceRate}%
            </div>
            <p className="text-xs text-slate-500">
              {totalAttended} sessions attended
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Academic Level & Target</span>
            <div className="text-lg font-bold text-[#0f2b5c]">{selectedChild.currentLevel}</div>
            <p className="text-xs text-amber-700 font-semibold">{selectedChild.targetExamYear}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Tuition Account Status</span>
            <div className="text-lg font-bold text-slate-900 font-mono">
              PKR {childPayments.reduce((acc, p) => acc + (p.status === 'pending' ? p.amountPKR : 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Due for upcoming month</p>
          </div>
        </div>

        {/* Two-Column Grid: Child Academic Progress & Tutor Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Academic Performance & Tests */}
          <div className="lg:col-span-8 space-y-8">
            {/* Visual Progress Trajectory */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Diagnostic Test Results & Growth
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">Verified CAIE Standard</span>
              </div>

              {childTests.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No recent test records for this candidate.</p>
              ) : (
                <div className="space-y-4">
                  {childTests.map((test) => {
                    const percentage = Math.round((test.obtainedMarks / test.totalMarks) * 100);
                    return (
                      <div
                        key={test.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                              {test.subject}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">
                              {test.testTitle}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Date: {test.date} · Evaluator: {test.tutorName}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-[#0f2b5c] font-mono">
                              {test.obtainedMarks}/{test.totalMarks}
                            </span>
                            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-lg font-mono">
                              Grade {test.grade} ({percentage}%)
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              percentage >= 80
                                ? 'bg-emerald-500'
                                : percentage >= 65
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                          <strong className="text-slate-800">Tutor Feedback for Parent:</strong>{' '}
                          {test.remarks}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Attendance Log for Child */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Recent Attendance & Lesson Topics
                </h3>
                <span className="text-xs text-emerald-600 font-bold font-mono">
                  {childAttendanceRate}% Regularity
                </span>
              </div>

              <div className="space-y-2.5">
                {childAttendance.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900">
                        {rec.subject}: {rec.topicCovered}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {rec.date} · {rec.tutorRemark || 'Completed lesson successfully'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                        rec.status === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Fees / Payment Ledger & Assigned Tutors */}
          <div className="lg:col-span-4 space-y-8">
            {/* Assigned Tutors with direct contact */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Assigned Faculty Specialists
              </h3>

              <div className="space-y-3">
                {tutors
                  .filter((t) => selectedChild.assignedTutorIds.includes(t.id))
                  .map((tutor) => (
                    <div
                      key={tutor.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={tutor.photoUrl}
                          alt={tutor.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-slate-300"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{tutor.name}</h4>
                          <p className="text-[11px] text-amber-700 font-medium">
                            {tutor.subjects.join(', ')}
                          </p>
                          <span className="text-[10px] text-slate-500 block">{tutor.city}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                        <button
                          onClick={() => openChatWith(tutor.id, tutor.name)}
                          className="flex-1 py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>Message</span>
                        </button>
                        <a
                          href={`tel:${tutor.phone}`}
                          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white border border-slate-200 transition-colors"
                          title="Call tutor directly"
                        >
                          <Phone className="w-4 h-4 text-emerald-600" />
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Fees and Invoices */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Monthly Tuition Invoices</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">PKR Currency</span>
              </div>

              <div className="space-y-3">
                {childPayments.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {inv.invoiceNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{inv.month} Fee</h4>
                        <span className="text-[11px] text-slate-500">Due: {inv.dueDate}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-900 font-mono text-sm block">
                          PKR {inv.amountPKR.toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {inv.status === 'paid' ? (
                      <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 flex items-center justify-between font-medium">
                        <span>Paid via {inv.paymentMethod} on {inv.paidDate}</span>
                        <span className="underline cursor-pointer">Receipt</span>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-200">
                        {isPayingInvoiceId === inv.id ? (
                          <div className="space-y-2 pt-1 animate-in fade-in">
                            <span className="text-[11px] font-bold text-slate-700 block">
                              Select Payment Method:
                            </span>
                            <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                              {(['JazzCash', 'Easypaisa', 'Bank Transfer'] as const).map((method) => (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() => setPaymentMethod(method)}
                                  className={`p-1.5 rounded-lg border text-center transition-all ${
                                    paymentMethod === method
                                      ? 'bg-[#0f2b5c] text-white border-[#0f2b5c]'
                                      : 'bg-white text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {method}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleConfirmPay(inv.id)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                              >
                                Confirm PKR {inv.amountPKR.toLocaleString()}
                              </button>
                              <button
                                onClick={() => setIsPayingInvoiceId(null)}
                                className="px-2 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsPayingInvoiceId(inv.id)}
                            className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
                          >
                            Pay Fee (JazzCash / Easypaisa / Bank)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
