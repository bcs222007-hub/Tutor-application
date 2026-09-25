import React from 'react';
import { useApp } from '../../context/AppContext';
import { Tutor } from '../../types';
import {
  X,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  GraduationCap,
  Calendar,
  Sparkles,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

export const TutorProfileModal: React.FC = () => {
  const {
    selectedTutorDetail,
    setSelectedTutorDetail,
    openDemoModalWithTutor,
    openChatWith,
  } = useApp();

  if (!selectedTutorDetail) return null;

  const t = selectedTutorDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 my-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0a1e3f] via-[#0f2b5c] to-[#0a1e3f] p-6 text-white relative">
          <button
            onClick={() => setSelectedTutorDetail(null)}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            aria-label="Close tutor profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg bg-slate-800">
              <img
                src={t.photoUrl}
                alt={t.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">{t.name}</h3>
                {t.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-400/40 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Faculty
                  </span>
                )}
              </div>

              <p className="text-xs text-amber-300 font-medium">{t.qualification}</p>
              <p className="text-xs text-slate-300">{t.institution}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {t.rating > 0 ? t.rating.toFixed(2) : 'New'} ({t.reviewCount} reviews)
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-200">{t.experienceYears} Years Experience</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-200">{t.mode} Tuition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Subjects and Levels */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Subjects & Academic Levels
            </h4>
            <div className="flex flex-wrap gap-2">
              {t.subjects.map((sub, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900"
                >
                  {sub}
                </span>
              ))}
              {t.levels.map((lvl, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900"
                >
                  {lvl}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              About Instructor
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.bio}</p>
          </div>

          {/* Teaching Methodology */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-[#0f2b5c] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Teaching Methodology
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{t.teachingMethodology}</p>
          </div>

          {/* Results Highlights */}
          {t.pastResultsHighlights && (
            <div className="space-y-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Examinations Track Record
              </h4>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {t.pastResultsHighlights}
              </p>
            </div>
          )}

          {/* Availability and Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Weekly Availability
              </span>
              <ul className="text-xs text-slate-600 space-y-1">
                {t.availability.map((slot, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{slot}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1.5 bg-slate-50">
              <span className="text-xs font-bold text-slate-900">Standard Tutoring Fees</span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hourly Rate:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    PKR {t.hourlyRatePKR.toLocaleString()} / hr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Package (12 hrs):</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    PKR {t.monthlyRatePKR.toLocaleString()} / mo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              openChatWith(t.id, t.name);
              setSelectedTutorDetail(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Chat / Ask Question</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTutorDetail(null);
                openDemoModalWithTutor(t);
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Book Free Demo with {t.name.split(' ')[1] || t.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
