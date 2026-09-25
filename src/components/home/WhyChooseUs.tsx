import React from 'react';
import {
  Award,
  Lightbulb,
  FileCheck2,
  UserCheck,
  ClipboardList,
  LineChart,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhyChooseUs: React.FC = () => {
  const { openDemoModalWithTutor } = useApp();

  const features = [
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: 'Experienced Tutors',
      description:
        'Cambridge certified teachers, PhDs, LUMS & GIKI graduates with proven records of producing world & national distinctions in CAIE and Board examinations.',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />,
      title: 'Concept Clarity',
      description:
        'We break down intimidating mathematical proofs, physics formulas, and chemical reaction pathways into foundational, unforgettable intuitive models.',
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-amber-500" />,
      title: 'Exam-Focused Preparation',
      description:
        'Deep-dive 10-year topical past paper drilling, CAIE examiner mark schemes, keyword precision, and structured time management mastery.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-blue-500" />,
      title: 'Personalized Learning',
      description:
        'Tailored 1-on-1 pacing designed around each student’s unique strengths, target grade ambitions, and school/college syllabus milestones.',
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-amber-500" />,
      title: 'Regular Assessments',
      description:
        'Weekly diagnostic quizzes, monthly full-length mock examinations under strict timed conditions, and detailed question-by-question analysis.',
    },
    {
      icon: <LineChart className="w-6 h-6 text-blue-500" />,
      title: 'Progress Tracking',
      description:
        'Transparent parent & student dashboards displaying real-time attendance, test score trajectories, homework reviews, and tutor remarks.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Academic Pedagogy
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Cambridge Tutors?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our systematic 6-pillar framework bridges the gap between rote memorization and true conceptual mastery, ensuring every student reaches their highest exam potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0f2b5c] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0f2b5c] group-hover:text-amber-600 transition-colors">
                <span>Learn our methodology</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Diagnostic Callout */}
        <div className="mt-14 p-6 sm:p-8 bg-[#0f2b5c] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold">Unsure which subject areas need the most attention?</h4>
            <p className="text-sm text-slate-300">
              Book a complimentary 45-minute diagnostic evaluation with our faculty specialists.
            </p>
          </div>
          <button
            onClick={() => openDemoModalWithTutor()}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl whitespace-nowrap shadow-md transition-colors"
          >
            Claim Free Evaluation Session
          </button>
        </div>
      </div>
    </section>
  );
};
