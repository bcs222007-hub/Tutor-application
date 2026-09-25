import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Home, CheckCircle2, Video, MapPin, Sparkles } from 'lucide-react';

export const TuitionModes: React.FC = () => {
  const { openDemoModalWithTutor } = useApp();

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Flexible Delivery
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Online Classes & Home Tuition
          </h2>
          <p className="text-sm text-slate-600">
            Choose the mode that best matches your student’s learning environment and convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Online Classes */}
          <div className="rounded-3xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0f2b5c] text-white flex items-center justify-center shadow-md">
                <Video className="w-7 h-7 text-amber-400" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
                  Worldwide Access
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Interactive Online Classes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  High-definition live interactive sessions utilizing digital stylus whiteboards, screen sharing, past paper annotation, and session recordings for revision.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  'Learn from anywhere in Pakistan, UAE, Saudi Arabia, or UK',
                  'High-resolution digital whiteboards & live formula derivations',
                  'Every session recorded for pre-exam 24/7 revision access',
                  'Topical PDF worksheets and CAIE mark schemes delivered instantly',
                  'Flexible morning and evening schedule slots',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100">
              <button
                onClick={() => openDemoModalWithTutor()}
                className="w-full py-3 px-4 bg-[#0f2b5c] hover:bg-[#0c234a] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Book Online Class Demo</span>
              </button>
            </div>
          </div>

          {/* Card 2: Home Tuition */}
          <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 via-white to-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                <Home className="w-7 h-7 text-slate-950" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
                  In-Person Attention
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Verified Home Tutors
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rigorous one-on-one personalized tutoring at the comfort and safety of your home with thoroughly background-checked Cambridge specialists.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  'Available in Islamabad, Rawalpindi, and Lahore prime sectors',
                  '100% CNIC & degree-verified senior academic instructors',
                  'Undivided personal attention and zero commute fatigue for student',
                  'Direct daily parent-tutor feedback and homework inspection',
                  'Customized pacing according to student school syllabus and test dates',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100">
              <button
                onClick={() => openDemoModalWithTutor()}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>Request Home Tutor Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
