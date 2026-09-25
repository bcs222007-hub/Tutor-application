import React from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_BANNER_IMAGE } from '../../data/mockData';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Phone, BookOpen, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActivePage, openDemoModalWithTutor } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1e3f] via-[#0f2b5c] to-[#091a38] text-white pt-10 pb-20 lg:py-24">
      {/* Background Subtle Geometry Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Academy Kicker / Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CAMBRIDGE TUTORING EDUCATION · "YOUR SUCCESS IS OUR MISSION"</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
              Expert Tutors.{' '}
              <span className="text-amber-400 underline decoration-amber-400/40 decoration-wavy decoration-2">
                Clear Concepts.
              </span>{' '}
              Better Results.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl">
              Professional online and home tutoring for <strong className="text-white font-semibold">IGCSE, O-Level, AS & A-Level, 9th, 10th, 1st & 2nd Year</strong> students. Dedicated exam preparation, past paper drilling, and individualized concept mastery by top subject specialists.
            </p>

            {/* Key Trust Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified Faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Home & Online Tuition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>10-Year Past Paper Mastery</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => openDemoModalWithTutor()}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all transform active:scale-[0.98] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Book a Free Demo</span>
              </button>

              <button
                onClick={() => setActivePage('tutors')}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-2"
              >
                <span>Find a Tutor</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => setActivePage('courses')}
                className="px-5 py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white transition-colors"
              >
                Explore Courses
              </button>
            </div>

            {/* Contact Hotline bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Admissions Helpline</span>
                  <a href="tel:03405427365" className="font-bold text-white text-sm hover:text-amber-400 font-mono">
                    0340-5427365
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white text-sm">4.9/5 Rating</span>
                <span className="text-slate-400 text-xs">from 450+ Cambridge students</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Studio Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Card Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 group">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={HERO_BANNER_IMAGE}
                    alt="Cambridge Tutors academic tutoring session with student and master instructor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                {/* Floating Bottom Card Over Image */}
                <div className="p-5 bg-slate-950/90 backdrop-blur-md border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                      Academic Excellence
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Sessions Daily</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mathematics · Physics · Chemistry · Biology</h4>
                      <p className="text-xs text-slate-300">Grade 9, 10, FSc 1st/2nd Year, IGCSE & O/A-Levels</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <span>94% Distinction Rate</span>
                    <span className="text-amber-400 font-semibold cursor-pointer hover:underline" onClick={() => openDemoModalWithTutor()}>
                      Schedule 1-on-1 Demo →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
