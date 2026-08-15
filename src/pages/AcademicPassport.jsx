import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldCheck, Lock, Unlock, Key, QrCode, Share2, GraduationCap, 
    School, CheckCircle2, AlertTriangle, ArrowUpRight, Copy, Check, 
    Building2, FileCheck, Layers, Sparkles, RefreshCw, Eye, BrainCircuit
} from 'lucide-react';

const INITIAL_PERMISSIONS = [
    {
        id: 'uchile',
        institution: 'University of Chile',
        faculty: 'Faculty of Physical Sciences and Mathematics (FCFM)',
        accessType: 'Application for Civil Engineering & Data Science',
        status: 'Granted',
        grantedDate: '2026-08-01',
        token: 'UCH-PASS-8849-JC'
    },
    {
        id: 'puc',
        institution: 'Pontifical Catholic University (PUC)',
        faculty: 'School of Engineering & School of Science',
        accessType: 'STEM Talent Program & Direct Admission',
        status: 'Granted',
        grantedDate: '2026-07-28',
        token: 'PUC-PASS-9120-JC'
    },
    {
        id: 'utfsm',
        institution: 'Federico Santa María Technical University',
        faculty: 'Department of Computer Science & Computational Linguistics',
        accessType: 'Excellence Scholarship Record Inspection',
        status: 'Pending',
        grantedDate: null,
        token: 'UTFSM-PASS-4412-JC'
    }
];

const AcademicPassport = () => {
    const { profile } = useAuth();
    const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
    const [copiedToken, setCopiedToken] = useState(false);
    const [passportToken] = useState('AULOCK-PASS-2026-JC98');
    const [activeAccessTab, setActiveAccessTab] = useState('passport'); // 'passport' | 'permissions' | 'universityTrack'

    const togglePermission = (id) => {
        setPermissions(prev => prev.map(p => {
            if (p.id === id) {
                const newStatus = p.status === 'Granted' ? 'Revoked' : 'Granted';
                return { ...p, status: newStatus, grantedDate: newStatus === 'Granted' ? new Date().toISOString().split('T')[0] : p.grantedDate };
            }
            return p;
        }));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(passportToken);
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
            
            {/* TOP HEADER */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 p-0.5 shadow-xl shadow-emerald-500/20">
                            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-black text-white">Digital Academic Passport & Data Custody</h1>
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    Student-School Sovereignty
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Exclusive authorization control for universities, higher education, and continuous tracking
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span>Protected by Institutional Grade Encryption</span>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 md:px-8 py-2">
                <div className="max-w-7xl mx-auto flex items-center space-x-2">
                    <button
                        onClick={() => setActiveAccessTab('passport')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                            activeAccessTab === 'passport' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <FileCheck className="w-4 h-4" />
                        <span>1. Certified Academic Passport</span>
                    </button>

                    <button
                        onClick={() => setActiveAccessTab('permissions')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                            activeAccessTab === 'permissions' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Key className="w-4 h-4" />
                        <span>2. University Authorization Control ({permissions.filter(p => p.status === 'Granted').length})</span>
                    </button>

                    <button
                        onClick={() => setActiveAccessTab('universityTrack')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                            activeAccessTab === 'universityTrack' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span>3. Parallel University Track</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* ==================== TAB 1: CERTIFIED PASSPORT ==================== */}
                {activeAccessTab === 'passport' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                        
                        {/* Left: Passport Credential (5 Cols) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                            AULOCK DIGITAL PASSPORT
                                        </span>
                                        <h2 className="text-xl font-black text-white mt-2">Transfer Credential</h2>
                                    </div>
                                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                                </div>

                                {/* Student Card Info */}
                                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 mb-6">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Passport Holder</span>
                                        <h3 className="text-lg font-black text-white">{profile?.full_name || 'Juan Carlos Pérez'}</h3>
                                        <p className="text-xs text-slate-400 font-semibold">Senior High School A • San Agustín School</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold block">K-12 GPA Average</span>
                                            <span className="text-base font-black text-emerald-400">6.14 / 7.0</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold block">Dominant Profile</span>
                                            <span className="text-xs font-bold text-indigo-300">Specialized_STEM</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Token Code & QR */}
                                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Unique ID Token Access</span>
                                        <code className="text-sm font-mono font-black text-emerald-400 tracking-wider">{passportToken}</code>
                                    </div>
                                    <button 
                                        onClick={copyToClipboard}
                                        className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-xl border border-emerald-500/30 transition-colors"
                                        title="Copy Token"
                                    >
                                        {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                                <span>Shared Custody: Student & School</span>
                                <QrCode className="w-6 h-6 text-slate-400" />
                            </div>
                        </div>

                        {/* Right: Certified Records Summary (7 Cols) */}
                        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                                    <FileCheck className="w-5 h-5 text-emerald-400" />
                                    <span>Certified Academic Records</span>
                                </h3>
                                <p className="text-xs text-slate-400">Data shared exclusively with authorized higher education institutions</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Certified High School Grade History</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Mathematics: 6.92 | Languages: 6.85 | History: 6.35 | Arts: 6.05 | Science: 6.42</p>
                                    </div>
                                </div>

                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
                                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Gemini AI Qualitative Cognitive Assessment</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">98th Percentile in algorithmic reasoning and fluent foreign language generation.</p>
                                    </div>
                                </div>

                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
                                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Recommended University Tracks</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Computer Science & AI (98%), Computational Linguistics (95%), Mathematical Engineering (92%).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* ==================== TAB 2: PERMISSIONS MANAGER ==================== */}
                {activeAccessTab === 'permissions' && (
                    <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                                    <Key className="w-5 h-5 text-emerald-400" />
                                    <span>Consent Control & Authorized Institutions</span>
                                </h2>
                                <p className="text-xs text-slate-400">You and your school have absolute control. You can grant or revoke university access anytime.</p>
                            </div>

                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
                                {permissions.filter(p => p.status === 'Granted').length} Authorized Institutions
                            </span>
                        </div>

                        {/* Permissions List Table */}
                        <div className="space-y-4">
                            {permissions.map(perm => (
                                <div 
                                    key={perm.id}
                                    className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                                        perm.status === 'Granted' 
                                            ? 'bg-slate-950 border-emerald-500/30' 
                                            : 'bg-slate-950/50 border-slate-800 opacity-60'
                                    }`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-2xl ${perm.status === 'Granted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                            <Building2 className="w-6 h-6" />
                                        </div>

                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-base font-bold text-white">{perm.institution}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    perm.status === 'Granted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                                }`}>
                                                    {perm.status === 'Granted' ? '✓ Authorization Active' : '✕ Access Revoked'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">{perm.faculty}</p>
                                            <p className="text-[11px] text-slate-500 mt-1">Reason: {perm.accessType}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                        <button
                                            onClick={() => togglePermission(perm.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                                perm.status === 'Granted'
                                                    ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                                            }`}
                                        >
                                            {perm.status === 'Granted' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                            <span>{perm.status === 'Granted' ? 'Revoke Access' : 'Grant Access'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ==================== TAB 3: PARALLEL UNIVERSITY TRACK ==================== */}
                {activeAccessTab === 'universityTrack' && (
                    <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-white">Parallel University Continuity Track</h2>
                                <p className="text-xs text-slate-400">Seamlessly maintain your AuLock learning history into higher education</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h3 className="font-bold text-white text-base mb-2">1. Direct Linking</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Upon university admission, your digital passport transfers your cognitive profile so professors understand your strengths from day one.
                                </p>
                            </div>

                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h3 className="font-bold text-white text-base mb-2">2. Advanced AI Tutoring</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    AuLock seamlessly adapts AI Socratic tutors (Newton, Curie, Ada) to advanced university subjects like Multivariable Calculus and Algorithms.
                                </p>
                            </div>

                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h3 className="font-bold text-white text-base mb-2">3. Unified Record</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Your entire academic journey from high school to professional graduation is consolidated in your AuLock Digital Passport.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AcademicPassport;
