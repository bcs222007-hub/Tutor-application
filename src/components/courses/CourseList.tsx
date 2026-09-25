import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, SubjectName, AcademicLevel } from '../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const CourseList: React.FC = () => {
  const { courses, openDemoModalWithTutor, showToast } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  const filteredCourses = courses.filter((c) => {
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    return true;
  });

  const handleEnroll = (course: Course) => {
    openDemoModalWithTutor();
    showToast(`Pre-selected course: ${course.title}. Book your trial class now!`, 'info');
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">
            Academic Curriculum & Syllabus
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Structured Cambridge & Board Programs
          </h1>
          <p className="text-sm text-slate-600">
            Intensive syllabi aligned with CAIE (Cambridge Assessment International Education) and Federal Board examination mark schemes.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-fit">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedSubject === 'all'
                ? 'bg-[#0f2b5c] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Disciplines
          </button>
          {(['Mathematics', 'Physics', 'Chemistry', 'Biology'] as SubjectName[]).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                selectedSubject === sub
                  ? 'bg-[#0f2b5c] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-7 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                        {course.level}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-blue-700 font-mono">
                        {course.subject}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h2>
                  </div>

                  {course.badgeText && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {course.badgeText}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Metadata Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Instructor</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {course.tutorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Duration & Classes</span>
                    <span className="font-bold text-slate-900 block font-mono">
                      {course.durationWeeks} Wks ({course.totalClasses} classes)
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block">Course Fee</span>
                    <span className="font-bold text-emerald-700 font-mono block">
                      PKR {course.feePKR.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Topics Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Syllabus Modules Covered:
                  </span>
                  <div className="space-y-1.5">
                    {course.syllabusTopics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Schedule: {course.scheduleDayTime}</span>
                </div>
              </div>

              {/* Bottom Enroll CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500 font-mono">
                  <span>{course.enrolledStudentsCount} students enrolled</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEnroll(course)}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Enroll / Book Demo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
