import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, openDemoModalWithTutor, setIsApplyTutorModalOpen } = useApp();

  return (
    <footer className="bg-[#091a38] text-slate-300 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 bg-[#07142c] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Cambridge Verified Faculty</h4>
                <p className="text-xs text-slate-400">CAIE top examiners, LUMS, NUST & KEMU gold medalists</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Flexible Learning Modes</h4>
                <p className="text-xs text-slate-400">Personalized 1-on-1 Home Tuition & Interactive Online Classes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Free Diagnostic Demo</h4>
                <p className="text-xs text-slate-400">Zero commitment initial concept & evaluation session</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">Cambridge Tutors</span>
                <span className="text-xs text-amber-400 font-medium tracking-wider uppercase block">
                  Cambridge Tutoring Education
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              "Your Success Is Our Mission" — Empowering students across IGCSE, O-Level, AS & A-Level, 9th, 10th, 1st & 2nd Year with deep concept clarity, exam-winning strategies, and past paper mastery.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2 font-mono">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:03405427365" className="hover:text-amber-400 transition-colors">
                  0340-5427365
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:email@cambridgetutoringeducation.com" className="hover:text-amber-400 transition-colors">
                  email@cambridgetutoringeducation.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Islamabad · Rawalpindi · Lahore · Worldwide Online</span>
              </div>
            </div>
          </div>

          {/* Core Subjects */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-amber-400/90">
              Core Subjects
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage('tutors')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Mathematics (Pure, Mechanics, Stats)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('tutors')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Physics (Theory & Paper 5 Practical)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('tutors')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Chemistry (Organic, Inorganic, Physical)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('tutors')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Biology (Cellular, Human, Genetics)
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Levels */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-amber-400/90">
              Academic Levels
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActivePage('tutors')}>
                Cambridge IGCSE & O-Level
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActivePage('tutors')}>
                Cambridge AS-Level & A-Level
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActivePage('tutors')}>
                Matriculation (Grade 9 & 10)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActivePage('tutors')}>
                Intermediate FSc (1st & 2nd Year)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActivePage('courses')}>
                Topical Past Paper Revision Camps
              </li>
            </ul>
          </div>

          {/* Quick Actions & Portals */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-amber-400/90">
              Academy Portals
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActivePage('student-portal')} className="hover:text-white transition-colors">
                  Student Portal & Homework
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('parent-portal')} className="hover:text-white transition-colors">
                  Parent Progress & Fee Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tutor-portal')} className="hover:text-white transition-colors">
                  Tutor Management Console
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin-portal')} className="hover:text-white transition-colors">
                  Academy Administration
                </button>
              </li>
              <li>
                <button onClick={() => setIsApplyTutorModalOpen(true)} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Join as Tutor (Apply Now)
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => openDemoModalWithTutor()}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-md shadow-sm transition-colors"
                >
                  Book Free Demo Class
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Cambridge Tutors (Cambridge Tutoring Education). All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Helpline: 0340-5427365</span>
            <span aria-hidden="true">·</span>
            <span>Concept Clarity</span>
            <span aria-hidden="true">·</span>
            <span>Past Paper Drilling</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
