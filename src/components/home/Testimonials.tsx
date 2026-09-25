import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials, openDemoModalWithTutor } = useApp();

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Proven Results & Success Stories
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hear From Our High Achievers
          </h2>
          <p className="text-sm text-slate-600">
            Real feedback from Cambridge and Federal Board students and parents who elevated their grades with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300 shrink-0" />
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs">
                    {item.avatarText}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.studentName}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {item.level} · {item.subject}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-amber-700 font-bold font-mono">
                    {item.gradeAchieved}
                  </span>
                  {item.verified && (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Result
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner below testimonials */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#0a1e3f] via-[#0f2b5c] to-[#0a1e3f] p-8 sm:p-12 text-center text-white space-y-6 shadow-xl max-w-4xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            Start Your Journey Today
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Improve Your Exam Results?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join hundreds of Cambridge and Board students achieving A* grades with targeted coaching, weekly homework checks, and concept clarity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openDemoModalWithTutor()}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-colors"
            >
              Book a Free Demo
            </button>
            <a
              href="tel:03405427365"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
            >
              Call 0340-5427365
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
