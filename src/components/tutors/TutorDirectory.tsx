import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectName, AcademicLevel, TuitionMode, Tutor } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  MapPin,
  GraduationCap,
  MessageSquare,
  UserPlus,
} from 'lucide-react';

export const TutorDirectory: React.FC = () => {
  const {
    tutors,
    setSelectedTutorDetail,
    openDemoModalWithTutor,
    openChatWith,
    setIsApplyTutorModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [minExp, setMinExp] = useState<number>(0);

  // Filter verified tutors only for public marketplace
  const verifiedTutors = useMemo(() => {
    return tutors.filter((t) => t.verificationStatus === 'verified');
  }, [tutors]);

  const filteredTutors = useMemo(() => {
    return verifiedTutors.filter((tutor) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tutor.name.toLowerCase().includes(q);
        const matchesSub = tutor.subjects.some((s) => s.toLowerCase().includes(q));
        const matchesLevel = tutor.levels.some((l) => l.toLowerCase().includes(q));
        const matchesCity = tutor.city.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesLevel && !matchesCity) return false;
      }

      // Subject filter
      if (selectedSubject !== 'all') {
        if (!tutor.subjects.includes(selectedSubject as SubjectName)) return false;
      }

      // Level filter
      if (selectedLevel !== 'all') {
        if (!tutor.levels.includes(selectedLevel as AcademicLevel)) return false;
      }

      // Mode filter
      if (selectedMode !== 'all') {
        if (selectedMode === 'Online' && tutor.mode === 'Home Tuition') return false;
        if (selectedMode === 'Home Tuition' && tutor.mode === 'Online') return false;
      }

      // Experience filter
      if (tutor.experienceYears < minExp) return false;

      return true;
    });
  }, [verifiedTutors, searchQuery, selectedSubject, selectedLevel, selectedMode, minExp]);

  const subjectsList = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const levelsList = [
    'Grade 9',
    'Grade 10',
    '1st Year',
    '2nd Year',
    'IGCSE',
    'O-Level',
    'AS-Level',
    'A-Level',
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">
                Verified Faculty Directory
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Find Expert Cambridge Tutors
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Connect with top-tier educators specialized in CAIE, Edexcel, and Board examinations. Every tutor is background-checked and credential-verified.
            </p>
          </div>

          <button
            onClick={() => setIsApplyTutorModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#0f2b5c] border border-slate-300 font-bold text-xs rounded-xl shadow-sm transition-colors self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4 text-amber-600" />
            <span>Apply as Tutor</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutors by name, subject, level (e.g. Farhan, A-Level, Chemistry)..."
                className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f2b5c] bg-slate-50 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Subject Selector */}
            <div className="md:col-span-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:border-[#0f2b5c]"
              >
                <option value="all">All Subjects</option>
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Selector */}
            <div className="md:col-span-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:border-[#0f2b5c]"
              >
                <option value="all">All Classes / Levels</option>
                {levelsList.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Selector */}
            <div className="md:col-span-2">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:border-[#0f2b5c]"
              >
                <option value="all">Tuition Mode (All)</option>
                <option value="Online">Online Classes</option>
                <option value="Home Tuition">Home Tuition</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
              <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Quick Subject:
              </span>
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  selectedSubject === 'all'
                    ? 'bg-[#0f2b5c] text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All
              </button>
              {subjectsList.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    selectedSubject === s
                      ? 'bg-[#0f2b5c] text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <span>Showing {filteredTutors.length} verified faculty</span>
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        {filteredTutors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No tutors found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any verified tutors matching your current filter criteria. Try clearing some filters or searching with a different keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedLevel('all');
                setSelectedMode('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header with Photo */}
                  <div className="p-6 pb-4 flex items-start gap-4">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img
                        src={tutor.photoUrl}
                        alt={tutor.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 truncate">{tutor.name}</h3>
                        {tutor.verificationStatus === 'verified' && (
                          <span title="Cambridge Verified Faculty" className="text-emerald-600">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-700 font-medium line-clamp-1">
                        {tutor.qualification}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tutor.institution}</p>

                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {tutor.rating.toFixed(2)}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-600 font-medium">
                          {tutor.experienceYears}y exp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges / Meta Strip */}
                  <div className="px-6 py-2 bg-slate-50 border-y border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{tutor.city}</span>
                    </span>
                    <span className="font-semibold text-[#0f2b5c] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {tutor.mode}
                    </span>
                  </div>

                  {/* Subjects and Bio Preview */}
                  <div className="p-6 pt-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.subjects.map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200/60 text-[11px] font-semibold"
                        >
                          {sub}
                        </span>
                      ))}
                      {tutor.levels.slice(0, 3).map((lvl, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 text-[11px] font-medium"
                        >
                          {lvl}
                        </span>
                      ))}
                      {tutor.levels.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{tutor.levels.length - 3} more
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {tutor.bio}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-xs text-slate-700">
                      <span className="text-slate-500">Hourly Rate:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        PKR {tutor.hourlyRatePKR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTutorDetail(tutor)}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors text-center"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => openDemoModalWithTutor(tutor)}
                    className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Book Demo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
