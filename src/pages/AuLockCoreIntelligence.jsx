import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    BrainCircuit, Sparkles, Award, TrendingUp, AlertTriangle, ShieldCheck, 
    Download, Printer, RefreshCw, Save, CheckCircle2, Heart, Users, School, 
    FileText, Bell, Send, Clock, Activity, BarChart2, Flame, ShieldAlert, Check, X
} from 'lucide-react';

const FEATURED_COURSES = [
    { name: 'Junior High A', status: 'Outstanding', trait: 'High Vocational Engagement & Peer Tutoring', progress: 92, medal: '🥇' },
    { name: 'Freshman High A', status: 'Optimal', trait: 'Exemplary Climate & Creativity', progress: 85, medal: '🥈' },
    { name: 'Senior High A', status: 'AP & SAT Monitoring', trait: 'High Logical Performance with Situational Anxiety', progress: 88, medal: '🥉' }
];

const FEATURED_STUDENTS = [
    { name: 'Juan Carlos Pérez (Senior High A)', trait: '98th Percentile in Logic & Peer Tutor', nem: 'GPA 3.9', progress: 95 },
    { name: 'Sofía Martínez (Senior High A)', trait: 'Debate Champion & Evidentiary Rigor', nem: 'GPA 4.0', progress: 92 },
    { name: 'Mateo Rojas (Senior High A)', trait: 'STEM Lab Leader & Biology', nem: 'GPA 3.8', progress: 88 }
];

const INITIAL_BEHAVIOR_ALERTS = [
    { id: 'alt-1', studentName: 'Lucas Fernández (Senior High A)', type: 'Preventive Alert', category: 'Repeated Measurement', urgency: 'Medium', urgencyColor: 'text-amber-300 border-amber-500/40 bg-amber-950', date: 'August 4, 2026', status: 'Pending Guidance', statusColor: 'text-cyan-300' },
    { id: 'alt-2', studentName: 'Camila Silva (Senior High A)', type: 'Preventive Alert', category: 'Cyberbullying / Social Media', urgency: 'Medium', urgencyColor: 'text-amber-300 border-amber-500/40 bg-amber-950', date: 'August 3, 2026', status: 'Under Admin Investigation', statusColor: 'text-emerald-400' },
    { id: 'alt-3', studentName: 'Camila Silva (Senior High A)', type: 'Confidential Report', category: 'Cyberbullying / Social Media', urgency: 'High', urgencyColor: 'text-rose-400 border-rose-500/40 bg-rose-950', date: 'August 3, 2026', status: 'Under Admin Investigation', statusColor: 'text-rose-400' }
];

const ALL_STUDENTS_LIST = [
    'Juan Carlos Pérez (Senior High A)',
    'Sofía Martínez (Senior High A)',
    'Mateo Rojas (Senior High A)',
    'Lucas Fernández (Senior High A)',
    'Camila Silva (Senior High A)'
];

export default function AuLockCoreIntelligence() {
    const { profile } = useAuth();
    const navigate = useNavigate();

    // Alert Sender Form State
    const [selectedAlertStudent, setSelectedAlertStudent] = useState(ALL_STUDENTS_LIST[3]);
    const [alertCategory, setAlertCategory] = useState('Behavioral Guidance Citation');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertsList, setAlertsList] = useState(INITIAL_BEHAVIOR_ALERTS);
    const [isDeploying, setIsDeploying] = useState(false);

    const handleExecuteDeployment = (e) => {
        e.preventDefault();
        if (!alertMessage.trim()) return alert("Please write the official message or guidance.");

        setIsDeploying(true);
        setTimeout(() => {
            const newAlert = {
                id: 'alt-' + Date.now(),
                studentName: selectedAlertStudent,
                type: 'Preventive Alert',
                category: alertCategory,
                urgency: 'Medium',
                urgencyColor: 'text-amber-300 border-amber-500/40 bg-amber-950',
                date: 'Today',
                status: 'Pending Guidance',
                statusColor: 'text-cyan-300'
            };

            setAlertsList(prev => [newAlert, ...prev]);
            setIsDeploying(false);
            setAlertMessage('');
            alert(`🚀 Deployment executed! Preventive alert notified to ${selectedAlertStudent}.`);
        }, 800);
    };

    const handleExportTraceableReport = () => {
        const reportContent = `INSTITUTIONAL WELLNESS & INTELLIGENCE REPORT - AULOCK CORE 360°
Date: ${new Date().toLocaleString()}
Traceable Audit Code: AULOCK-CORE-TRACE-${Date.now()}
======================================================
Average Institutional Stress: 16% (Optimal Level)
Active Preventive Alerts: ${alertsList.length}

FEATURED CLASSES:
1. Junior High A (Outstanding)
2. Freshman High A (Optimal)
3. Senior High A (AP & SAT Monitoring)
`;

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `AuLock_Core_Traceable_Report_${Date.now()}.txt`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-3 md:p-6 pb-28 select-none selection:bg-cyan-900">
            
            {/* RBAC HEADER LINE */}
            <header className="max-w-7xl mx-auto bg-slate-950/95 border-2 border-cyan-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl mb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-cyan-900/60 pb-3">
                    <div className="flex items-center space-x-2 text-cyan-300 font-mono">
                        <strong className="text-white">AuLock Mobile RBAC Architecture</strong>
                        <span>|</span>
                        <span>User: <strong className="text-cyan-200">San Agustín High School Leadership</strong></span>
                        <span>|</span>
                        <span>Active Role: <strong className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">[ STUDENT / 360° CORE ]</strong></span>
                    </div>

                    {/* PROFILE SWITCHER */}
                    <div className="flex items-center space-x-2 text-[11px] font-bold">
                        <span className="text-slate-400">PROFILE SWITCHER:</span>
                        <button onClick={() => navigate('/student-dashboard')} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 cursor-pointer">
                            🎓 Student Role
                        </button>
                        <button onClick={() => navigate('/teacher-dashboard')} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 cursor-pointer">
                            👨‍🏫 Teacher Role
                        </button>
                        <button onClick={() => navigate('/school-dashboard')} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 cursor-pointer">
                            🏫 School 360° Role
                        </button>
                        <button className="px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            🌀 360° Core
                        </button>
                    </div>
                </div>

                {/* TITLE & BADGES */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                            🔮
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wider">
                                AuLock Core - Institutional Wellness & Intelligence Center
                            </h1>
                            <p className="text-xs text-slate-400">
                                Consolidated Emotional Health, Behavior Alerts, Featured Classes, and Preventive Intervention Management.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-600">
                            100% Audited Traceable Intelligence
                        </span>
                        <button
                            onClick={handleExportTraceableReport}
                            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] transition flex items-center space-x-2 cursor-pointer"
                        >
                            <span>🟢</span>
                            <span>Export Audit Report</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT (8 COLS): 3 DAILY STRESS CHECK-INS */}
                    <div className="lg:col-span-8 bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                        <div className="space-y-1 border-b border-cyan-900/60 pb-3">
                            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold block">
                                REAL-TIME MEASUREMENTS <span className="text-slate-400">(3 DAILY CHECK-INS)</span>
                            </span>
                        </div>

                        {/* 3 DAILY CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* CHECK-IN 1: 08:30 AM */}
                            <div className="bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/40 space-y-2">
                                <span className="text-xs font-bold text-slate-300 block">08:30 AM (Arrival / Morning)</span>
                                <h3 className="text-2xl font-orbitron font-black text-cyan-300">12 % Stress</h3>
                                <span className="text-[10px] text-slate-400 block">Calm / Morning Entry</span>
                                
                                <div className="pt-2 flex items-center justify-between">
                                    <div className="w-12 h-6 bg-cyan-950 border border-cyan-400 rounded-t-full p-1 flex items-end justify-center">
                                        <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
                                    </div>
                                    <svg className="w-24 h-6 stroke-cyan-400 fill-none stroke-2" viewBox="0 0 100 20">
                                        <path d="M 0 10 L 20 10 L 30 2 L 40 18 L 50 10 L 100 10" />
                                    </svg>
                                </div>
                            </div>

                            {/* CHECK-IN 2: 11:45 AM */}
                            <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 space-y-2">
                                <span className="text-xs font-bold text-slate-300 block">11:45 AM (Midday Break)</span>
                                <h3 className="text-2xl font-orbitron font-black text-amber-300">22 % Stress</h3>
                                <span className="text-[10px] text-slate-400 block">Focused / Midday Assessments</span>
                                
                                <div className="pt-2 flex items-center justify-between">
                                    <div className="w-12 h-6 bg-amber-950 border border-amber-400 rounded-t-full p-1 flex items-end justify-center">
                                        <div className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                                    </div>
                                    <svg className="w-24 h-6 stroke-amber-400 fill-none stroke-2" viewBox="0 0 100 20">
                                        <path d="M 0 10 L 15 10 L 25 -5 L 35 25 L 45 -2 L 55 18 L 65 10 L 100 10" />
                                    </svg>
                                </div>
                            </div>

                            {/* CHECK-IN 3: 03:15 PM */}
                            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
                                <span className="text-xs font-bold text-slate-300 block">03:15 PM (Dismissal)</span>
                                <h3 className="text-2xl font-orbitron font-black text-emerald-400">14 % Stress</h3>
                                <span className="text-[10px] text-slate-400 block">Relaxed / End of Day</span>
                                
                                <div className="pt-2 flex items-center justify-between">
                                    <div className="w-12 h-6 bg-emerald-950 border border-emerald-400 rounded-t-full p-1 flex items-end justify-center">
                                        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                                    </div>
                                    <svg className="w-24 h-6 stroke-emerald-400 fill-none stroke-2" viewBox="0 0 100 20">
                                        <path d="M 0 10 L 25 10 L 35 4 L 45 16 L 55 10 L 100 10" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT (4 COLS): AVERAGE STRESS GAUGE */}
                    <div className="lg:col-span-4 bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col justify-between items-center text-center relative overflow-hidden">
                        
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg className="w-full h-full stroke-cyan-400 stroke-1 fill-none">
                                <path d="M 0 50 H 100 V 200 H 300" />
                                <path d="M 200 0 V 150 H 400" />
                            </svg>
                        </div>

                        <span className="text-xs font-orbitron font-extrabold text-slate-300 uppercase tracking-widest">
                            AVERAGE STRESS LEVEL
                        </span>

                        <div className="relative w-48 h-32 flex items-end justify-center my-4">
                            <div className="w-48 h-24 border-[12px] border-cyan-950 border-t-emerald-400 border-r-cyan-400 border-l-emerald-500 rounded-t-full flex items-end justify-center shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                                <span className="text-3xl font-orbitron font-black text-white mb-2">16%</span>
                            </div>
                        </div>

                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                            ✓ Overall Status: Optimal & Controlled
                        </span>
                    </div>

                </div>

                {/* FEATURED CLASSES & MENTORS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT: FEATURED CLASSES */}
                    <div className="lg:col-span-6 bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-xl space-y-4">
                        <h3 className="text-sm font-orbitron font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                            <span>🏆</span>
                            <span>Featured Classes in Wellness & Performance</span>
                        </h3>

                        <div className="space-y-3">
                            {FEATURED_COURSES.map((c, idx) => (
                                <div key={idx} className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-white text-sm">{c.name} <strong className="text-emerald-400 text-xs font-normal">({c.status})</strong></span>
                                        <span className="text-lg">{c.medal}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">{c.trait}</p>
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                        <div style={{ width: `${c.progress}%` }} className="bg-cyan-400 h-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: FEATURED STUDENTS & MENTORS */}
                    <div className="lg:col-span-6 bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-xl space-y-4">
                        <h3 className="text-sm font-orbitron font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                            <span>👥</span>
                            <span>Featured Students & Peer Mentors</span>
                        </h3>

                        <div className="space-y-3">
                            {FEATURED_STUDENTS.map((st, idx) => (
                                <div key={idx} className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-white text-sm">{st.name}</span>
                                        <strong className="text-cyan-300 font-mono">{st.nem}</strong>
                                    </div>
                                    <p className="text-[11px] text-slate-400">{st.trait}</p>
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                        <div style={{ width: `${st.progress}%` }} className="bg-emerald-400 h-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* DIRECT INSTITUTIONAL DISPATCH */}
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                    <div className="space-y-1 border-b border-cyan-900/60 pb-3">
                        <span className="text-[10px] text-rose-400 uppercase font-bold tracking-widest block">
                            DIRECT INSTITUTIONAL COMMUNICATION
                        </span>
                        <h2 className="text-lg md:text-xl font-orbitron font-extrabold text-white">
                            Preventive Alert & Student Citation Dispatcher
                        </h2>
                    </div>

                    <form onSubmit={handleExecuteDeployment} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                    SELECT TARGET STUDENT 👤
                                </label>
                                <select
                                    value={selectedAlertStudent}
                                    onChange={e => setSelectedAlertStudent(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-cyan-200 font-mono outline-none focus:border-cyan-400"
                                >
                                    {ALL_STUDENTS_LIST.map((st, idx) => (
                                        <option key={idx} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                    NOTICE CATEGORY ∨
                                </label>
                                <select
                                    value={alertCategory}
                                    onChange={e => setAlertCategory(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-cyan-200 font-mono outline-none focus:border-cyan-400"
                                >
                                    <option value="Behavioral Guidance Citation">Behavioral Guidance Citation</option>
                                    <option value="Attendance & Punctuality Alert">Attendance & Punctuality Alert</option>
                                    <option value="School Coexistence Notification">School Coexistence Notification</option>
                                    <option value="Outstanding Performance Recognition">Outstanding Performance Recognition</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                OFFICIAL MESSAGE OR GUIDANCE
                            </label>
                            <textarea
                                value={alertMessage}
                                onChange={e => setAlertMessage(e.target.value)}
                                placeholder="Type full body of institutional notice to be dispatched directly to the student dashboard screen..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-cyan-400 min-h-[90px] resize-none font-mono"
                            />
                        </div>

                        {/* BIG NEON DISPATCH BUTTON */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isDeploying}
                                className="px-8 py-4 rounded-2xl border-2 border-cyan-400 bg-slate-900 text-cyan-300 font-orbitron font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-950 transition-all flex items-center space-x-2 cursor-pointer"
                            >
                                <span>🚀</span>
                                <span>{isDeploying ? 'EXECUTING...' : 'DISPATCH ALERT'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* TRACEABLE AUDIT TABLE */}
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                    <div className="flex justify-between items-center border-b border-cyan-900/60 pb-3">
                        <h2 className="text-lg font-orbitron font-extrabold text-white tracking-wider">
                            Traceable Behavioral Reports & Alerts Log
                        </h2>
                        <span className="text-xs text-cyan-400 font-mono">
                            Total: {alertsList.length} Records
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-900/90 text-slate-400 font-extrabold uppercase border-b border-cyan-900/60">
                                <tr>
                                    <th className="p-3">STUDENT / CLASS</th>
                                    <th className="p-3">RECORD TYPE</th>
                                    <th className="p-3">CATEGORY</th>
                                    <th className="p-3">URGENCY</th>
                                    <th className="p-3">DATE</th>
                                    <th className="p-3">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {alertsList.map(alt => (
                                    <tr key={alt.id} className="hover:bg-slate-900/50 transition">
                                        <td className="p-3 font-bold text-white">{alt.studentName}</td>
                                        <td className="p-3 text-cyan-300">{alt.type}</td>
                                        <td className="p-3 text-slate-300">{alt.category}</td>
                                        <td className="p-3">
                                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${alt.urgencyColor}`}>
                                                {alt.urgency}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-400">{alt.date}</td>
                                        <td className="p-3">
                                            <span className={`font-bold ${alt.statusColor}`}>
                                                {alt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

        </div>
    );
}
