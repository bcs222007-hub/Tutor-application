import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectName, AcademicLevel, TuitionMode } from '../../types';
import { X, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TutorApplyModal: React.FC = () => {
  const { isApplyTutorModalOpen, setIsApplyTutorModalOpen, applyAsTutor } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [qualification, setQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [city, setCity] = useState('Islamabad');
  const [mode, setMode] = useState<TuitionMode>('Both');
  const [hourlyRate, setHourlyRate] = useState('2000');
  const [bio, setBio] = useState('');
  const [teachingMethodology, setTeachingMethodology] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectName[]>(['Mathematics']);
  const [selectedLevels, setSelectedLevels] = useState<AcademicLevel[]>(['O-Level', 'A-Level']);
  const [submitted, setSubmitted] = useState(false);

  if (!isApplyTutorModalOpen) return null;

  const allSubjects: SubjectName[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const allLevels: AcademicLevel[] = [
    'Grade 9',
    'Grade 10',
    '1st Year',
    '2nd Year',
    'IGCSE',
    'O-Level',
    'AS-Level',
    'A-Level',
  ];

  const handleSubjectToggle = (sub: SubjectName) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleLevelToggle = (lvl: AcademicLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !cnic || !qualification) return;

    applyAsTutor({
      name: fullName,
      email,
      phone,
      cnic,
      photoUrl: '/src/assets/images/tutor_farhan_portrait_1790320675895.jpg',
      qualification,
      institution: institution || 'Top University Alum',
      experienceYears: parseInt(experienceYears, 10) || 3,
      subjects: selectedSubjects,
      levels: selectedLevels,
      mode,
      hourlyRatePKR: parseInt(hourlyRate, 10) || 2000,
      monthlyRatePKR: (parseInt(hourlyRate, 10) || 2000) * 10,
      city,
      bio: bio || 'Dedicated educator passionate about student concept clarity and exam success.',
      teachingMethodology:
        teachingMethodology || 'Interactive problem dissection and past-paper drilling.',
      availability: ['Mon-Fri 4:00 PM - 8:00 PM', 'Sat 11:00 AM - 4:00 PM'],
      pastResultsHighlights: 'Strong portfolio of high grades in previous tutoring engagements.',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsApplyTutorModalOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Modal Header */}
        <div className="bg-[#0f2b5c] p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Faculty Recruitment
              </span>
            </div>
            <h3 className="text-xl font-bold">Apply as a Cambridge Tutor</h3>
            <p className="text-xs text-slate-300">
              Join our network of elite Cambridge and Board educators.
            </p>
          </div>

          <button
            onClick={() => setIsApplyTutorModalOpen(false)}
            className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Application Submitted!</h4>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed max-w-md mx-auto">
              <strong className="block mb-1 font-bold">Account Status: PENDING VERIFICATION</strong>
              Your credentials and CNIC are being verified by the Academic Board. Once approved, your profile will be listed in the public tutor directory.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Notice banner */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                To uphold Cambridge academic rigor, all tutor accounts undergo mandatory admin CNIC and credential verification before appearing publicly.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Haris Mahmood"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">CNIC / National ID *</label>
                <input
                  type="text"
                  required
                  placeholder="37405-XXXXXXX-X"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Highest Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Phil in Mathematics / B.Sc. Engineering"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alma Mater / Institution</label>
                <input
                  type="text"
                  placeholder="e.g. LUMS / NUST / Cambridge"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Years of Tutoring Experience</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City / Coverage</label>
                <input
                  type="text"
                  placeholder="Islamabad / Rawalpindi / Lahore / Online"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
                />
              </div>
            </div>

            {/* Teaching Mode */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Teaching Mode</label>
              <div className="flex gap-4 text-xs">
                {(['Both', 'Online', 'Home Tuition'] as TuitionMode[]).map((m) => (
                  <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === m}
                      onChange={() => setMode(m)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subjects Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Subjects You Teach *</label>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubjectToggle(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#0f2b5c] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Levels Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Classes / Academic Levels *</label>
              <div className="flex flex-wrap gap-2">
                {allLevels.map((lvl) => {
                  const isSelected = selectedLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelToggle(lvl)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Expected Hourly Rate (PKR)</label>
              <input
                type="number"
                step="100"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c] font-mono"
              />
            </div>

            {/* Short Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Short Professional Bio</label>
              <textarea
                rows={3}
                placeholder="Mention past student results, distinctions, and teaching experience..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
              />
            </div>

            {/* Teaching Methodology */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Teaching Methodology</label>
              <textarea
                rows={2}
                placeholder="How do you handle past paper drills, concept doubts, and homework?"
                value={teachingMethodology}
                onChange={(e) => setTeachingMethodology(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f2b5c]"
              />
            </div>

            {/* Document Upload Mock */}
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-1.5 bg-slate-50">
              <Upload className="w-5 h-5 text-slate-400 mx-auto" />
              <span className="text-xs font-semibold text-slate-700 block">
                Attach Degree / CNIC Scans (PDF or JPG)
              </span>
              <span className="text-[11px] text-slate-400 block">
                (Verification documents will be reviewed securely by Cambridge administration)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99]"
            >
              Submit Tutor Application for Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
