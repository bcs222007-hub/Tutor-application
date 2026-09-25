import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectName, AcademicLevel, Tutor } from '../../types';
import { X, Sparkles, CheckCircle2, Calendar, Clock, Phone, MapPin, User, Mail } from 'lucide-react';

export const DemoBookingModal: React.FC = () => {
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoPreselectedTutor,
    tutors,
    submitDemoRequest,
    currentUser,
  } = useApp();

  const [subject, setSubject] = useState<SubjectName>('Mathematics');
  const [level, setLevel] = useState<AcademicLevel>('A-Level');
  const [tuitionMode, setTuitionMode] = useState<'Online' | 'Home Tuition'>('Online');
  const [preferredTutorId, setPreferredTutorId] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-09-28');
  const [preferredTime, setPreferredTime] = useState<string>('05:00 PM');
  const [studentName, setStudentName] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cityArea, setCityArea] = useState<string>('Islamabad');
  const [additionalMessage, setAdditionalMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string>('');

  useEffect(() => {
    if (demoPreselectedTutor) {
      setPreferredTutorId(demoPreselectedTutor.id);
      if (demoPreselectedTutor.subjects.length > 0) {
        setSubject(demoPreselectedTutor.subjects[0]);
      }
      if (demoPreselectedTutor.levels.length > 0) {
        setLevel(demoPreselectedTutor.levels[0]);
      }
    } else {
      setPreferredTutorId('');
    }

    if (currentUser) {
      if (currentUser.role === 'student') {
        setStudentName(currentUser.name);
        setEmail(currentUser.email);
        setContactNumber(currentUser.phone);
      } else if (currentUser.role === 'parent') {
        setParentName(currentUser.name);
        setEmail(currentUser.email);
        setContactNumber(currentUser.phone);
      }
    }
  }, [demoPreselectedTutor, currentUser, isDemoModalOpen]);

  if (!isDemoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !contactNumber || !preferredDate) return;

    const chosenTutor = tutors.find((t) => t.id === preferredTutorId);

    const bookingRef = `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedBookingId(bookingRef);

    submitDemoRequest({
      studentName,
      parentName,
      contactNumber,
      email: email || 'student@cambridgetutors.pk',
      subject,
      level,
      tuitionMode,
      preferredTutorId: chosenTutor ? chosenTutor.id : undefined,
      preferredTutorName: chosenTutor ? chosenTutor.name : 'Any Verified Faculty',
      preferredDate,
      preferredTime,
      cityArea,
      additionalMessage,
    });

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsDemoModalOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 my-auto">
        {/* Modal Banner */}
        <div className="bg-gradient-to-r from-[#0a1e3f] via-[#0f2b5c] to-[#0a1e3f] p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Zero-Commitment Trial
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Book a Free Demo Class</h3>
            <p className="text-xs text-slate-300">
              Evaluate our teaching methodology and teacher compatibility firsthand.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close demo booking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-slate-900">
                Demo Request Submitted Successfully
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you! Your free trial session has been routed to our Academic Coordination Team.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-[#0f2b5c]">{submittedBookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subject & Class:</span>
                <span className="font-semibold text-slate-800">
                  {level} {subject}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tuition Mode:</span>
                <span className="font-semibold text-slate-800">{tuitionMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slot Scheduled:</span>
                <span className="font-semibold text-slate-800">
                  {preferredDate} at {preferredTime}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{studentName}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left">
              <strong>What happens next?</strong> An academic counselor will call you on{' '}
              <span className="font-mono font-bold">{contactNumber}</span> within 2 hours to confirm meeting details or dispatch the home tutor.
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#0f2b5c] hover:bg-[#0c234a] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Return to Platform
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Subject and Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectName)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Class / Academic Level *</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-white"
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
            </div>

            {/* Tuition Mode */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Preferred Tuition Mode *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTuitionMode('Online')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    tuitionMode === 'Online'
                      ? 'border-[#0f2b5c] bg-blue-50 text-[#0f2b5c] font-bold shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Online Classes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTuitionMode('Home Tuition')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    tuitionMode === 'Home Tuition'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Home Tuition</span>
                </button>
              </div>
            </div>

            {/* Preferred Tutor */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Preferred Faculty Instructor (Optional)
              </label>
              <select
                value={preferredTutorId}
                onChange={(e) => setPreferredTutorId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-white"
              >
                <option value="">Any Cambridge Certified Faculty Specialist</option>
                {tutors
                  .filter((t) => t.verificationStatus === 'verified')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.qualification} · {t.subjects.join(', ')})
                    </option>
                  ))}
              </select>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Preferred Time Slot *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] bg-white font-mono"
                >
                  <option value="03:00 PM">03:00 PM - 03:45 PM</option>
                  <option value="04:00 PM">04:00 PM - 04:45 PM</option>
                  <option value="05:00 PM">05:00 PM - 05:45 PM</option>
                  <option value="06:00 PM">06:00 PM - 06:45 PM</option>
                  <option value="07:00 PM">07:00 PM - 07:45 PM</option>
                  <option value="08:00 PM">08:00 PM - 08:45 PM</option>
                </select>
              </div>
            </div>

            {/* Student & Parent Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zayd Qureshi"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Parent Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Khan"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  Contact Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  City & Sector / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. F-8/3 Islamabad or DHA Lahore"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>
            </div>

            {/* Additional Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Specific Topic or Exam Concern (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Struggling with Integration in Pure Math 3 or Organic mechanisms in Chemistry..."
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Confirm & Book Free Demo Class</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
