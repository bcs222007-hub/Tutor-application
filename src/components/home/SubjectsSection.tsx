import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, Zap, FlaskConical, Dna, ArrowRight, Check } from 'lucide-react';
import { SubjectName } from '../../types';

export const SubjectsSection: React.FC = () => {
  const { setActivePage } = useApp();

  const subjects: {
    name: SubjectName;
    icon: React.ReactNode;
    colorClass: string;
    bgAccent: string;
    description: string;
    topics: string[];
    tutorsAvailable: number;
  }[] = [
    {
      name: 'Mathematics',
      icon: <Calculator className="w-7 h-7 text-blue-600" />,
      colorClass: 'text-blue-600',
      bgAccent: 'bg-blue-50',
      description:
        'From foundational algebra and geometry to Pure Mathematics (P1, P3), Mechanics, Statistics, and Calculus for CAIE 9709 & Board syllabi.',
      topics: ['Pure Math 1 & 3 (Calculus & Trigonometry)', 'Mechanics (M1) & Statistics (S1)', 'Matric & Intermediate Coordinate Geometry'],
      tutorsAvailable: 8,
    },
    {
      name: 'Physics',
      icon: <Zap className="w-7 h-7 text-amber-500" />,
      colorClass: 'text-amber-500',
      bgAccent: 'bg-amber-50',
      description:
        'Master kinematics, electromagnetism, wave particle duality, circular motion, and CAIE Paper 5 experiment design and practical papers.',
      topics: ['Classical Mechanics & Thermal Physics', 'Electromagnetism & Quantum Waves', 'Paper 5 Design & Uncertainty Analysis'],
      tutorsAvailable: 6,
    },
    {
      name: 'Chemistry',
      icon: <FlaskConical className="w-7 h-7 text-emerald-600" />,
      colorClass: 'text-emerald-600',
      bgAccent: 'bg-emerald-50',
      description:
        'Stoichiometry, mole calculations, organic reaction mechanisms, electrochemistry, and Alternative to Practical (ATP) methods.',
      topics: ['Organic Synthesis & Reaction Mechanisms', 'Thermodynamics & Reaction Kinetics', 'Practical ATP Laboratory Answering Techniques'],
      tutorsAvailable: 7,
    },
    {
      name: 'Biology',
      icon: <Dna className="w-7 h-7 text-indigo-600" />,
      colorClass: 'text-indigo-600',
      bgAccent: 'bg-indigo-50',
      description:
        'Cell biology, molecular genetics, physiology, enzyme kinetics, and high-yield pre-medical MDCAT & Cambridge medical pathways.',
      topics: ['Genetics & Recombinant DNA Technology', 'Human Physiology & Homeostasis', 'Cambridge Structured Answer Keyword Technique'],
      tutorsAvailable: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Core Academic Disciplines
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Specialized Subject Coaching
            </h2>
            <p className="text-base text-slate-600">
              Targeted curriculum coverage aligned with Cambridge CAIE, Edexcel, and Federal Board requirements.
            </p>
          </div>
          <button
            onClick={() => setActivePage('tutors')}
            className="text-sm font-bold text-[#0f2b5c] hover:text-amber-600 transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Browse All Faculty</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((sub) => (
            <div
              key={sub.name}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div
                  className={`w-14 h-14 rounded-xl ${sub.bgAccent} flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  {sub.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{sub.name}</h3>
                  <span className="text-xs text-slate-400 font-medium font-mono">
                    {sub.tutorsAvailable} Active Specialists
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {sub.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {sub.topics.map((t, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => setActivePage('tutors')}
                  className="w-full py-2.5 px-4 text-xs font-bold text-[#0f2b5c] group-hover:bg-[#0f2b5c] group-hover:text-white rounded-lg border border-[#0f2b5c]/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Tutors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
