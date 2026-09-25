import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserCheck, CalendarCheck, BookOpen, LineChart, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { openDemoModalWithTutor } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Choose Class & Subject',
      desc: 'Select from Grade 9–12, IGCSE, O-Level, or A-Level Mathematics, Physics, Chemistry, or Biology.',
      icon: <Search className="w-5 h-5 text-amber-500" />,
    },
    {
      step: '02',
      title: 'Find a Suitable Tutor',
      desc: 'Browse verified faculty profiles, review credentials, qualifications, teaching style, and hourly rates.',
      icon: <UserCheck className="w-5 h-5 text-blue-500" />,
    },
    {
      step: '03',
      title: 'Book a Free Demo',
      desc: 'Schedule a free 45-minute trial session either online or at your home to evaluate tutor compatibility.',
      icon: <CalendarCheck className="w-5 h-5 text-amber-500" />,
    },
    {
      step: '04',
      title: 'Start Learning',
      desc: 'Begin customized weekly classes with structured topical notes, derivations, and intensive past papers.',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    },
    {
      step: '05',
      title: 'Track Your Progress',
      desc: 'Parents and students monitor test scores, homework submissions, and attendance on our real-time portal.',
      icon: <LineChart className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Simple 5-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Cambridge Tutors Works
          </h2>
          <p className="text-sm text-slate-600">
            From initial assessment to distinction grades — streamlined, transparent, and student-focused.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    Step {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0f2b5c] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={() => openDemoModalWithTutor()}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Start Step 1: Book Your Free Demo Today</span>
          </button>
        </div>
      </div>
    </section>
  );
};
