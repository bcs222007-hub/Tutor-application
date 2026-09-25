import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicLevel } from '../../types';
import { GraduationCap, BookMarked, CheckCircle, ArrowRight } from 'lucide-react';

export const LevelsSection: React.FC = () => {
  const { setActivePage, openDemoModalWithTutor } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>('A-Level');

  const levels: {
    level: AcademicLevel;
    group: 'Cambridge International' | 'Matric & Intermediate Board';
    description: string;
    curriculumDetails: string;
    examSeries: string;
    subjectsOffered: string[];
  }[] = [
    {
      level: 'A-Level',
      group: 'Cambridge International',
      description: 'Advanced Level CAIE / Edexcel specialization focusing on Pure Math, Mechanics, Physics, Chemistry, and Biology.',
      curriculumDetails: 'Structured syllabus for Cambridge 9709, 9702, 9701, and 9700 papers with 10-year topical preparation.',
      examSeries: 'May/June & Oct/Nov Series',
      subjectsOffered: ['Mathematics (P1, P3, M1, S1)', 'Physics (P1, P2, P4, P5)', 'Chemistry', 'Biology'],
    },
    {
      level: 'AS-Level',
      group: 'Cambridge International',
      description: 'The critical transition year. Build strong mathematical foundations and scientific reasoning before final A2 examinations.',
      curriculumDetails: 'Emphasis on AS core theory, Multiple Choice Speed (Paper 1), and structured theory (Paper 2).',
      examSeries: 'CAIE AS Examination',
      subjectsOffered: ['Pure Mathematics 1', 'Physics AS Theory & Practical', 'Chemistry AS', 'Biology AS'],
    },
    {
      level: 'O-Level',
      group: 'Cambridge International',
      description: 'Cambridge General Certificate of Education Ordinary Level for students preparing for international university foundations.',
      curriculumDetails: 'Comprehensive coverage of 4024 Mathematics, 5054 Physics, 5070 Chemistry, and 5090 Biology.',
      examSeries: 'Cambridge O-Level May/June & Oct/Nov',
      subjectsOffered: ['Math (Syllabus D)', 'Physics', 'Chemistry (Theory & ATP)', 'Biology'],
    },
    {
      level: 'IGCSE',
      group: 'Cambridge International',
      description: 'International General Certificate of Secondary Education with Extended and Core curriculum streams.',
      curriculumDetails: 'Covers Extended 0580 Mathematics, 0625 Physics, 0620 Chemistry, and 0610 Biology.',
      examSeries: 'Cambridge IGCSE Series',
      subjectsOffered: ['Extended Mathematics', 'Physics Extended', 'Chemistry', 'Biology'],
    },
    {
      level: '2nd Year',
      group: 'Matric & Intermediate Board',
      description: 'FSc Pre-Engineering & Pre-Medical final intermediate board preparation for FBISE, BISE Rawalpindi, Lahore, and others.',
      curriculumDetails: '100% textbook problem mastery, theorem proofs, board marking guidelines, and MDCAT / ECAT foundation.',
      examSeries: 'Annual & Supplementary Board Exams',
      subjectsOffered: ['Calculus & Analytic Geometry', 'Modern Physics', 'Organic & Inorganic Chemistry', 'Pre-Med Biology'],
    },
    {
      level: '1st Year',
      group: 'Matric & Intermediate Board',
      description: 'FSc Part 1 foundation. Bridge the gap between matriculation and intermediate level depth.',
      curriculumDetails: 'Matrices, Trigonometric Identities, Vectors, Chemical Equilibrium, and Cell Structure.',
      examSeries: 'FBISE & BISE Annual Exams',
      subjectsOffered: ['Algebra & Trigonometry', 'Mechanics & Heat', 'Physical Chemistry', 'Pre-Med Botany & Zoology'],
    },
    {
      level: 'Grade 10',
      group: 'Matric & Intermediate Board',
      description: 'Matriculation Part 2 board exam readiness targeting 95%+ marks for top college admissions.',
      curriculumDetails: 'Complete exercise solutions, 5-year board past papers, and conceptual question answering.',
      examSeries: 'Matric Annual Board Examinations',
      subjectsOffered: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    },
    {
      level: 'Grade 9',
      group: 'Matric & Intermediate Board',
      description: 'Matriculation Part 1 launchpad for building disciplined study habits and rock-solid science fundamentals.',
      curriculumDetails: 'Foundational algebra, basic physics laws, atomic structure, and biological kingdoms.',
      examSeries: 'FBISE & Punjab Board 9th Class Exam',
      subjectsOffered: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    },
  ];

  const currentLevelData = levels.find((l) => l.level === selectedLevel) || levels[0];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Structured Pathways
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Academic Levels
          </h2>
          <p className="text-sm text-slate-600">
            From 9th grade foundation to competitive Cambridge A-Level and FSc intermediate certifications.
          </p>
        </div>

        {/* Level Switcher Tab Bar */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 bg-slate-200/80 rounded-2xl max-w-4xl mx-auto mb-10">
          {levels.map((item) => (
            <button
              key={item.level}
              onClick={() => setSelectedLevel(item.level)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedLevel === item.level
                  ? 'bg-[#0f2b5c] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {item.level}
            </button>
          ))}
        </div>

        {/* Active Level Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-600 font-mono tracking-wider uppercase">
                  {currentLevelData.group}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">{currentLevelData.examSeries}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentLevelData.level} Specialized Coaching
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {currentLevelData.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-semibold block mb-1">Curriculum & Exam Strategy:</strong>
                {currentLevelData.curriculumDetails}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Subjects Taught:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentLevelData.subjectsOffered.map((sub, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-[#0f2b5c] text-white p-6 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white leading-snug">
                  Get a Dedicated {currentLevelData.level} Tutor
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Both 1-on-1 home tuition and digital interactive batches available.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openDemoModalWithTutor()}
                  className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
                >
                  Book Free {currentLevelData.level} Demo
                </button>
                <button
                  onClick={() => setActivePage('tutors')}
                  className="w-full py-2 px-3 text-xs text-slate-200 hover:text-white text-center font-medium transition-colors"
                >
                  View {currentLevelData.level} Tutors →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
