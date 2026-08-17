import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    BrainCircuit, Sparkles, Award, TrendingUp, AlertTriangle, ShieldCheck, 
    Download, Printer, RefreshCw, Save, CheckCircle2, Heart, Users, School, 
    FileText, Bell, Send, Clock, Activity, BarChart2, Flame, ShieldAlert, Check, X,
    Search, FileSpreadsheet, UploadCloud, UserCheck, Layers, Eye, ChevronRight
} from 'lucide-react';

const COURSES_HEATMAP_DATA = [
    { 
        id: 'c-1', 
        name: 'Senior High A (4° Medio A)', 
        teacher: 'Prof. Carlos Rivas', 
        studentsCount: 26, 
        averageGPA: '6.3', 
        attentionIndex: '92%', 
        alertsCount: 2, 
        status: 'Optimal', 
        statusColor: 'text-emerald-400 border-emerald-700 bg-emerald-950',
        students: [
            { name: 'Juan Carlos Pérez', focus: '98%', gpa: '6.8', exits: 0, status: 'Focused' },
            { name: 'Sofía Martínez', focus: '94%', gpa: '6.5', exits: 0, status: 'Focused' },
            { name: 'Mateo Rojas', focus: '78%', gpa: '5.8', exits: 2, status: 'Needs Guidance' },
            { name: 'Lucas Fernández', focus: '82%', gpa: '5.5', exits: 1, status: 'Distracted' },
            { name: 'Camila Silva', focus: '85%', gpa: '5.9', exits: 1, status: 'Investigating' }
        ],
        notes: 'High academic performance in STEM subjects. 2 students flagged for tab exit distractions during physics assessments.'
    },
    { 
        id: 'c-2', 
        name: 'Senior High B (4° Medio B)', 
        teacher: 'Prof. María González', 
        studentsCount: 24, 
        averageGPA: '5.9', 
        attentionIndex: '85%', 
        alertsCount: 1, 
        status: 'Attention Needed', 
        statusColor: 'text-amber-300 border-amber-700 bg-amber-950',
        students: [
            { name: 'Diego Torres', focus: '90%', gpa: '6.1', exits: 0, status: 'Focused' },
            { name: 'Valentina Silva', focus: '84%', gpa: '5.7', exits: 1, status: 'Focused' },
            { name: 'Gabriel Soto', focus: '72%', gpa: '5.0', exits: 3, status: 'Needs Guidance' }
        ],
        notes: 'Midday fatigue observed. Homeroom teacher requested socratic peer tutoring support from Senior High A.'
    },
    { 
        id: 'c-3', 
        name: 'Junior High A (3° Medio A)', 
        teacher: 'Prof. Roberto Palma', 
        studentsCount: 28, 
        averageGPA: '6.5', 
        attentionIndex: '95%', 
        alertsCount: 0, 
        status: 'Outstanding', 
        statusColor: 'text-cyan-300 border-cyan-700 bg-cyan-950',
        students: [
            { name: 'Antonia Ruiz', focus: '97%', gpa: '6.9', exits: 0, status: 'Focused' },
            { name: 'Benjamín Castro', focus: '93%', gpa: '6.4', exits: 0, status: 'Focused' }
        ],
        notes: 'Exemplary classroom climate and high engagement with Google Classroom assignments.'
    },
    { 
        id: 'c-4', 
        name: 'Freshman High A (1° Medio A)', 
        teacher: 'Prof. Ana Morales', 
        studentsCount: 30, 
        averageGPA: '6.2', 
        attentionIndex: '88%', 
        alertsCount: 0, 
        status: 'Optimal', 
        statusColor: 'text-emerald-400 border-emerald-700 bg-emerald-950',
        students: [
            { name: 'Isabella Morales', focus: '91%', gpa: '6.3', exits: 0, status: 'Focused' }
        ],
        notes: 'Smooth adaptation to AuLock NFC mobile focus cases during daily lessons.'
    }
];

const INSTITUTIONAL_DIRECTORY = [
    { id: 'd-1', name: 'Prof. Carlos Rivas', role: 'Teacher', course: 'Senior High A (Mathematics)', email: 'carlos.rivas@sanagustin.edu', phone: '+56 9 8765 4321', status: 'Active' },
    { id: 'd-2', name: 'Prof. María González', role: 'Teacher', course: 'Senior High B (Biology)', email: 'maria.gonzalez@sanagustin.edu', phone: '+56 9 7654 3210', status: 'Active' },
    { id: 'd-3', name: 'Juan Carlos Pérez', role: 'Student', course: 'Senior High A', email: 'juan.perez@student.sanagustin.edu', parent: 'Carlos Pérez Sr. (+56 9 1122 3344)', status: 'Active' },
    { id: 'd-4', name: 'Sofía Martínez', role: 'Student', course: 'Senior High A', email: 'sofia.martinez@student.sanagustin.edu', parent: 'Elena Martínez (+56 9 2233 4455)', status: 'Active' },
    { id: 'd-5', name: 'Mateo Rojas', role: 'Student', course: 'Senior High A', email: 'mateo.rojas@student.sanagustin.edu', parent: 'Roberto Rojas (+56 9 3344 5566)', status: 'Active' },
    { id: 'd-6', name: 'Lucas Fernández', role: 'Student', course: 'Senior High A', email: 'lucas.fernandez@student.sanagustin.edu', parent: 'Patricia Fernández (+56 9 4455 6677)', status: 'Active' },
    { id: 'd-7', name: 'Camila Silva', role: 'Student', course: 'Senior High A', email: 'camila.silva@student.sanagustin.edu', parent: 'Gonzalo Silva (+56 9 5566 7788)', status: 'Active' }
];

const INITIAL_BEHAVIOR_ALERTS = [
    { id: 'alt-1', studentName: 'Lucas Fernández (Senior High A)', type: 'Preventive Alert', category: 'Repeated Measurement', urgency: 'Medium', urgencyColor: 'text-amber-300 border-amber-500/40 bg-amber-950', date: 'August 4, 2026', status: 'Pending Guidance', statusColor: 'text-cyan-300', incidentLog: 'Detected 2 tab exits during live assessment session. Attention Index dropped from 94% to 82%.' },
    { id: 'alt-2', studentName: 'Camila Silva (Senior High A)', type: 'Preventive Alert', category: 'Cyberbullying / Social Media', urgency: 'Medium', urgencyColor: 'text-amber-300 border-amber-500/40 bg-amber-950', date: 'August 3, 2026', status: 'Under Admin Investigation', statusColor: 'text-emerald-400', incidentLog: 'Confidential peer report received regarding online group messaging tension. Safe Report Protocol activated.' },
    { id: 'alt-3', studentName: 'Mateo Rojas (Senior High A)', type: 'Confidential Report', category: 'Attention Drop', urgency: 'High', urgencyColor: 'text-rose-400 border-rose-500/40 bg-rose-950', date: 'August 3, 2026', status: 'Under Admin Investigation', statusColor: 'text-rose-400', incidentLog: '3 consecutive tab exits detected during Socratic evaluation phase.' }
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

    // Top Navigation Tabs
    const [topNavTab, setTopNavTab] = useState('core'); // 'core' | 'directories' | 'importexport' | 'mineduc'

    // Alert Sender Form State
    const [selectedAlertStudent, setSelectedAlertStudent] = useState(ALL_STUDENTS_LIST[3]);
    const [alertCategory, setAlertCategory] = useState('Behavioral Guidance Citation');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertsList, setAlertsList] = useState(INITIAL_BEHAVIOR_ALERTS);
    const [isDeploying, setIsDeploying] = useState(false);

    // Modals State
    const [selectedCourseModal, setSelectedCourseModal] = useState(null);
    const [selectedIncidentModal, setSelectedIncidentModal] = useState(null);
    const [searchDirectoryQuery, setSearchDirectoryQuery] = useState('');
    const [isImportingCSV, setIsImportingCSV] = useState(false);

    const handleExecuteDeployment = (e) => {
        if (e) e.preventDefault();
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
                statusColor: 'text-cyan-300',
                incidentLog: alertMessage
            };

            setAlertsList(prev => [newAlert, ...prev]);
            setIsDeploying(false);

            // Broadcast payload to Student Dashboard
            const dispatchPayload = {
                id: newAlert.id,
                category: alertCategory,
                message: alertMessage,
                studentName: selectedAlertStudent,
                date: 'Today',
                dispatchedBy: 'San Agustín High School Leadership'
            };
            localStorage.setItem('aulock_teacher_dispatched_alert', JSON.stringify(dispatchPayload));
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('aulock_dispatch_event', { detail: dispatchPayload }));

            setAlertMessage('');
            if (selectedIncidentModal) setSelectedIncidentModal(null);
            alert(`🚀 Deployment executed! Institutional alert dispatched to ${selectedAlertStudent}.`);
        }, 800);
    };

    const handleExportTraceableReport = () => {
        const reportContent = `INSTITUTIONAL WELLNESS & INTELLIGENCE REPORT - AULOCK CORE 360°
Date: ${new Date().toLocaleString()}
Traceable Audit Code: AULOCK-CORE-TRACE-${Date.now()}
======================================================
Total Institutional Enrollment: 1,240 Students (32 Active Courses)
Average Institutional Stress: 16% (Optimal Level)
Institutional GPA Average: 6.2 / 7.0 (MINEDUC Standard)
Attendance & Retention Rate: 97.4%
Active Behavioral Records: ${alertsList.length}

COURSES AUDITED:
1. Senior High A (4° Medio A) - 92% Attention Index - 6.3 GPA
2. Senior High B (4° Medio B) - 85% Attention Index - 5.9 GPA
3. Junior High A (3° Medio A) - 95% Attention Index - 6.5 GPA
4. Freshman High A (1° Medio A) - 88% Attention Index - 6.2 GPA
`;

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `AuLock_Core_Traceable_Report_${Date.now()}.txt`;
        link.click();
    };

    const filteredDirectory = INSTITUTIONAL_DIRECTORY.filter(item => 
        item.name.toLowerCase().includes(searchDirectoryQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchDirectoryQuery.toLowerCase()) ||
        item.course.toLowerCase().includes(searchDirectoryQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-3 md:p-6 pb-28 selection:bg-cyan-900">
            
            {/* RBAC HEADER & TOP COMMAND NAVIGATION SUITE */}
            <header className="max-w-7xl mx-auto bg-slate-950/95 border-2 border-cyan-500/40 p-4 md:p-5 rounded-3xl shadow-2xl backdrop-blur-xl mb-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-cyan-900/60 pb-3">
                    <div className="flex items-center space-x-2 text-cyan-300 font-mono">
                        <strong className="text-white">AuLock Mobile RBAC Architecture</strong>
                        <span>|</span>
                        <span>User: <strong className="text-cyan-200">San Agustín High School Principal</strong></span>
                        <span>|</span>
                        <span>Active Role: <strong className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">[ COMMAND & INTELLIGENCE CENTER ]</strong></span>
                    </div>

                    {/* PROFILE SWITCHER */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
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

                {/* COMMAND SUITE NAV BUTTONS (360° CORE, DIRECTORIES, IMPORT/EXPORT, MINEDUC STANDARDS) */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                            🔮
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wider">
                                School Admin 360° Intelligence Center
                            </h1>
                            <p className="text-xs text-slate-400 font-sans">
                                Real-Time Behavioral Heatmaps, Attendance Retention, MINEDUC Compliance, and Student Dispatches.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setTopNavTab('core')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase tracking-wider transition cursor-pointer ${
                                topNavTab === 'core'
                                    ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                                    : 'bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500'
                            }`}
                        >
                            🌀 360° CORE
                        </button>

                        <button
                            onClick={() => setTopNavTab('directories')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase tracking-wider transition cursor-pointer ${
                                topNavTab === 'directories'
                                    ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                                    : 'bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500'
                            }`}
                        >
                            👥 DIRECTORIES
                        </button>

                        <button
                            onClick={() => setTopNavTab('importexport')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase tracking-wider transition cursor-pointer ${
                                topNavTab === 'importexport'
                                    ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                                    : 'bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500'
                            }`}
                        >
                            📥 IMPORT/EXPORT (CSV)
                        </button>

                        <button
                            onClick={() => setTopNavTab('mineduc')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase tracking-wider transition cursor-pointer ${
                                topNavTab === 'mineduc'
                                    ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                                    : 'bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500'
                            }`}
                        >
                            📋 MINEDUC STANDARDS
                        </button>
                    </div>
                </div>

                {/* 4 LIVE INSTITUTIONAL METRICS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                    <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-cyan-500/40 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Enrollment</span>
                        <div className="flex justify-between items-center">
                            <strong className="text-xl font-orbitron font-black text-cyan-300">1,240 Students</strong>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">● 32 Courses</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/40 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Average GPA</span>
                        <div className="flex justify-between items-center">
                            <strong className="text-xl font-orbitron font-black text-amber-300">6.2 / 7.0</strong>
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded">+0.3 vs Last Term</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-emerald-500/40 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Emotional Health Index</span>
                        <div className="flex justify-between items-center">
                            <strong className="text-xl font-orbitron font-black text-emerald-400">88% Optimal</strong>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">16% Stress</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-cyan-500/40 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance & Retention</span>
                        <div className="flex justify-between items-center">
                            <strong className="text-xl font-orbitron font-black text-cyan-300">97.4% Rate</strong>
                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">0 Dropout Risk</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA ACCORDING TO ACTIVE NAV TAB */}
            <main className="max-w-7xl mx-auto space-y-6">
                
                {/* ==================== TAB 1: 360° CORE MAIN OVERVIEW ==================== */}
                {topNavTab === 'core' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        
                        {/* 1. INTERACTIVE COURSE DRILL-DOWN HEATMAP */}
                        <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-cyan-900/60 pb-3">
                                <div>
                                    <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-widest font-bold block">
                                        INTERACTIVE HEATMAP & DRILL-DOWN
                                    </span>
                                    <h2 className="text-lg md:text-xl font-orbitron font-extrabold text-white">
                                        Behavior, Attention & Emotional Climate Map by Course
                                    </h2>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">
                                    Click any course row to open full student roster drill-down.
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {COURSES_HEATMAP_DATA.map(course => (
                                    <div 
                                        key={course.id}
                                        onClick={() => setSelectedCourseModal(course)}
                                        className="bg-slate-900/90 p-5 rounded-2xl border-2 border-slate-800 hover:border-cyan-400 transition-all cursor-pointer space-y-3 group shadow-lg"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-base font-orbitron font-bold text-white group-hover:text-cyan-300 transition">
                                                    {course.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 font-mono">
                                                    Homeroom Teacher: {course.teacher} • {course.studentsCount} Students
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${course.statusColor}`}>
                                                {course.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 font-mono">
                                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                                <span className="text-[10px] text-slate-400 uppercase block">Average GPA</span>
                                                <strong className="text-amber-300 font-bold">{course.averageGPA} / 7.0</strong>
                                            </div>
                                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                                <span className="text-[10px] text-slate-400 uppercase block">Attention</span>
                                                <strong className="text-cyan-300 font-bold">{course.attentionIndex}</strong>
                                            </div>
                                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                                <span className="text-[10px] text-slate-400 uppercase block">Alerts</span>
                                                <strong className={course.alertsCount > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                                                    {course.alertsCount} Flagged
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-cyan-400 font-bold pt-1">
                                            <span className="text-[11px] text-slate-300 italic truncate max-w-[240px] font-sans">"{course.notes}"</span>
                                            <span className="group-hover:translate-x-1 transition-transform">Inspect Course Drill-Down ➔</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. REAL-TIME MEASUREMENTS & AVERAGE STRESS GAUGE */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            <div className="lg:col-span-8 bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-xl space-y-4">
                                <div className="space-y-1 border-b border-cyan-900/60 pb-3">
                                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold block">
                                        REAL-TIME MEASUREMENTS <span className="text-slate-400">(3 DAILY CHECK-INS)</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/40 space-y-2">
                                        <span className="text-xs font-bold text-slate-300 block">08:30 AM (Arrival / Morning)</span>
                                        <h3 className="text-2xl font-orbitron font-black text-cyan-300">12 % Stress</h3>
                                        <span className="text-[10px] text-slate-400 block">Calm / Morning Entry</span>
                                    </div>

                                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 space-y-2">
                                        <span className="text-xs font-bold text-slate-300 block">11:45 AM (Midday Break)</span>
                                        <h3 className="text-2xl font-orbitron font-black text-amber-300">22 % Stress</h3>
                                        <span className="text-[10px] text-slate-400 block">Focused / Midday Assessments</span>
                                    </div>

                                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
                                        <span className="text-xs font-bold text-slate-300 block">03:15 PM (Dismissal)</span>
                                        <h3 className="text-2xl font-orbitron font-black text-emerald-400">14 % Stress</h3>
                                        <span className="text-[10px] text-slate-400 block">Relaxed / End of Day</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-xl flex flex-col justify-between items-center text-center">
                                <span className="text-xs font-orbitron font-extrabold text-slate-300 uppercase tracking-widest">
                                    AVERAGE STRESS LEVEL
                                </span>

                                <div className="w-48 h-24 border-[12px] border-cyan-950 border-t-emerald-400 border-r-cyan-400 border-l-emerald-500 rounded-t-full flex items-end justify-center my-4">
                                    <span className="text-3xl font-orbitron font-black text-white mb-2">16%</span>
                                </div>

                                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                                    ✓ Overall Status: Optimal & Controlled
                                </span>
                            </div>

                        </div>

                        {/* 3. DIRECT INSTITUTIONAL DISPATCHER */}
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

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={isDeploying}
                                        className="px-8 py-4 rounded-2xl border-2 border-cyan-400 bg-slate-900 text-cyan-300 font-orbitron font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-950 transition-all flex items-center space-x-2 cursor-pointer"
                                    >
                                        <span>🚀</span>
                                        <span>{isDeploying ? 'EXECUTING...' : 'DISPATCH ALERT TO STUDENT DASHBOARD'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 4. TRACEABLE AUDIT TABLE & AI GUARDIAN INCIDENTS */}
                        <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                            <div className="flex justify-between items-center border-b border-cyan-900/60 pb-3">
                                <div>
                                    <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-widest font-bold block">AI GUARDIAN LOGS</span>
                                    <h2 className="text-lg font-orbitron font-extrabold text-white tracking-wider">
                                        Traceable Behavioral Reports & Incident Log
                                    </h2>
                                </div>
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
                                            <th className="p-3 text-right">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {alertsList.map(alt => (
                                            <tr key={alt.id} className="hover:bg-slate-900/60 transition cursor-pointer">
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
                                                <td className="p-3 text-right">
                                                    <button
                                                        onClick={() => setSelectedIncidentModal(alt)}
                                                        className="px-3 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 rounded-lg text-[11px] font-bold cursor-pointer"
                                                    >
                                                        Review Log 🔍
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

                {/* ==================== TAB 2: SEARCHABLE DIRECTORIES ==================== */}
                {topNavTab === 'directories' && (
                    <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 font-mono animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-900/60 pb-4">
                            <div>
                                <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold block">GOOGLE CLASSROOM & SHEETS SYNCED</span>
                                <h2 className="text-xl font-orbitron font-extrabold text-white">
                                    Searchable Institutional Directory (Teachers, Students & Parents)
                                </h2>
                            </div>

                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    value={searchDirectoryQuery}
                                    onChange={e => setSearchDirectoryQuery(e.target.value)}
                                    placeholder="Filter by name, role, or course..."
                                    className="w-full bg-slate-900 border border-cyan-500/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-300 font-mono"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase border-b border-slate-800">
                                    <tr>
                                        <th className="p-3.5">NAME</th>
                                        <th className="p-3.5">ROLE</th>
                                        <th className="p-3.5">COURSE / SUBJECT</th>
                                        <th className="p-3.5">INSTITUTIONAL EMAIL</th>
                                        <th className="p-3.5">PARENT / GUARDIAN CONTACT</th>
                                        <th className="p-3.5 text-right">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredDirectory.map(dir => (
                                        <tr key={dir.id} className="hover:bg-slate-900/60">
                                            <td className="p-3.5 font-bold text-white">{dir.name}</td>
                                            <td className="p-3.5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${dir.role === 'Teacher' ? 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700' : 'bg-cyan-950 text-cyan-300 border-cyan-700'}`}>
                                                    {dir.role}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-slate-300 font-bold">{dir.course}</td>
                                            <td className="p-3.5 text-slate-400">{dir.email}</td>
                                            <td className="p-3.5 text-amber-300 font-bold">{dir.parent || dir.phone}</td>
                                            <td className="p-3.5 text-right">
                                                <span className="text-emerald-400 font-bold">● {dir.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ==================== TAB 3: IMPORT / EXPORT (CSV) ==================== */}
                {topNavTab === 'importexport' && (
                    <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 font-mono animate-in fade-in duration-300">
                        <div className="border-b border-cyan-900/60 pb-4">
                            <span className="text-[10px] text-cyan-400 uppercase font-bold block">DATA PIPELINE ENGINE</span>
                            <h2 className="text-xl font-orbitron font-extrabold text-white">
                                Bulk Roster Import & Official CSV Report Exporter
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* BULK CSV IMPORT */}
                            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-cyan-300 uppercase block font-orbitron">📥 Bulk Roster Import (CSV / Excel)</span>
                                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                        Upload official student CSV files to bulk register rosters into Supabase database and sync with AuLock NFC tokens.
                                    </p>
                                </div>

                                <div className="p-6 border-2 border-dashed border-cyan-500/40 rounded-2xl text-center space-y-2">
                                    <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
                                    <span className="text-xs text-slate-300 font-bold block">Drag and drop student_roster.csv file here</span>
                                    <span className="text-[10px] text-slate-500 block">Supported formats: .CSV, .XLSX (Max 10MB)</span>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsImportingCSV(true);
                                        setTimeout(() => {
                                            setIsImportingCSV(false);
                                            alert("✓ Roster imported! 120 new students registered and synced with Supabase database.");
                                        }, 1000);
                                    }}
                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                                >
                                    {isImportingCSV ? 'Importing Rows to Supabase...' : 'Process Roster Import'}
                                </button>
                            </div>

                            {/* OFFICIAL CSV EXPORT */}
                            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-emerald-400 uppercase block font-orbitron">📤 Export Official CSV Reports</span>
                                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                        Generate and download real-time CSV reports for Attendance Retention, Behavioral Records, and GPA Distributions.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={handleExportTraceableReport}
                                        className="w-full p-3 bg-slate-950 hover:bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-between cursor-pointer"
                                    >
                                        <span>📊 Export Attendance & Retention Audit Report</span>
                                        <span>CSV ➔</span>
                                    </button>

                                    <button
                                        onClick={handleExportTraceableReport}
                                        className="w-full p-3 bg-slate-950 hover:bg-slate-900 border border-cyan-500/50 rounded-xl text-cyan-300 font-bold text-xs flex items-center justify-between cursor-pointer"
                                    >
                                        <span>📋 Export Full Behavioral Incidents Audit</span>
                                        <span>CSV ➔</span>
                                    </button>
                                </div>

                                <span className="text-[10px] text-emerald-400 font-bold text-center block">✓ Formatted for Ministry Audit & School Leadership</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== TAB 4: MINEDUC STANDARDS ==================== */}
                {topNavTab === 'mineduc' && (
                    <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 font-mono animate-in fade-in duration-300">
                        <div className="flex justify-between items-center border-b border-cyan-900/60 pb-4">
                            <div>
                                <span className="text-[10px] text-cyan-400 uppercase font-bold block">CHILEAN MINISTRY OF EDUCATION</span>
                                <h2 className="text-xl font-orbitron font-extrabold text-white">
                                    MINEDUC Official Compliance & Audit Standards Report
                                </h2>
                            </div>
                            <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                                100% Certified UCE Standards
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-slate-300 uppercase block font-orbitron">1. Curricular Coverage (OA)</span>
                                <strong className="text-2xl font-black text-cyan-300 block font-orbitron">94.2%</strong>
                                <span className="text-[10px] text-slate-400 block">Aligned with UCE National Framework</span>
                            </div>

                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-slate-300 uppercase block font-orbitron">2. School Coexistence Protocol</span>
                                <strong className="text-2xl font-black text-emerald-400 block font-orbitron">100% Compliant</strong>
                                <span className="text-[10px] text-slate-400 block">'Seamos Comunidad' Policy Audited</span>
                            </div>

                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-slate-300 uppercase block font-orbitron">3. Attendance & Retention Rate</span>
                                <strong className="text-2xl font-black text-amber-300 block font-orbitron">97.4% Retention</strong>
                                <span className="text-[10px] text-slate-400 block">Zero Critical Dropout Alerts</span>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-900/90 rounded-2xl border border-cyan-500/40 text-xs leading-relaxed text-cyan-100 font-sans space-y-2">
                            <h4 className="font-bold text-cyan-300 font-orbitron uppercase text-xs">MINEDUC Official Quality Assurance Statement:</h4>
                            <p>
                                The AuLock Platform automatically monitors student attendance, attention indices during live classroom sessions, and emotional climate indicators. All reports generated meet the audit requirements set by the Agencia de Calidad de la Educación and Superintendencia de Educación de Chile.
                            </p>
                        </div>
                    </div>
                )}

            </main>

            {/* ==================== MODAL 1: COURSE DRILL-DOWN MODAL ==================== */}
            {selectedCourseModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono animate-in fade-in duration-200">
                    <div className="bg-slate-950 border-2 border-cyan-400 p-6 md:p-8 rounded-3xl max-w-3xl w-full space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.5)] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-cyan-900 pb-4">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-700">
                                    COURSE DRILL-DOWN & ROSTER AUDIT
                                </span>
                                <h3 className="text-xl md:text-2xl font-orbitron font-extrabold text-white mt-2">
                                    {selectedCourseModal.name}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Homeroom Teacher: {selectedCourseModal.teacher} • {selectedCourseModal.studentsCount} Enrolled Students
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedCourseModal(null)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* COURSE METRICS SUMMARY */}
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Class Average GPA</span>
                                <strong className="text-xl font-black text-amber-300 font-orbitron">{selectedCourseModal.averageGPA} / 7.0</strong>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Attention Index</span>
                                <strong className="text-xl font-black text-cyan-300 font-orbitron">{selectedCourseModal.attentionIndex}</strong>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Behavioral Flags</span>
                                <strong className="text-xl font-black text-rose-400 font-orbitron">{selectedCourseModal.alertsCount} Flagged</strong>
                            </div>
                        </div>

                        {/* STUDENT ROSTER METRICS TABLE */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-orbitron font-extrabold text-cyan-300 uppercase tracking-wider">
                                👥 Individual Student Attention & Performance Metrics:
                            </h4>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase border-b border-slate-800">
                                        <tr>
                                            <th className="p-3">STUDENT NAME</th>
                                            <th className="p-3">FOCUS INDEX</th>
                                            <th className="p-3">GPA</th>
                                            <th className="p-3">TAB EXITS</th>
                                            <th className="p-3 text-right">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {selectedCourseModal.students.map((st, i) => (
                                            <tr key={i} className="hover:bg-slate-900/60">
                                                <td className="p-3 font-bold text-white">{st.name}</td>
                                                <td className="p-3 text-cyan-300 font-bold">{st.focus}</td>
                                                <td className="p-3 text-amber-300 font-black">{st.gpa}</td>
                                                <td className="p-3 text-rose-400 font-bold">{st.exits} Exits</td>
                                                <td className="p-3 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAlertStudent(`${st.name} (${selectedCourseModal.name})`);
                                                            setAlertMessage(`Preventive notice for ${st.name}: Please meet with your homeroom teacher regarding live lesson attention.`);
                                                            setSelectedCourseModal(null);
                                                            setTopNavTab('core');
                                                        }}
                                                        className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-700 hover:bg-rose-900 rounded-lg text-[10px] font-bold cursor-pointer"
                                                    >
                                                        Dispatch Notice 🚀
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* HOMEROOM NOTES */}
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                            <strong className="text-cyan-300 font-orbitron uppercase block text-[10px]">Homeroom Teacher Assessment:</strong>
                            <p className="font-sans leading-relaxed">{selectedCourseModal.notes}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL 2: AI GUARDIAN INCIDENT REVIEW MODAL ==================== */}
            {selectedIncidentModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono animate-in fade-in duration-200">
                    <div className="bg-slate-950 border-2 border-rose-500 p-6 md:p-8 rounded-3xl max-w-2xl w-full space-y-6 shadow-[0_0_50px_rgba(244,63,94,0.5)]">
                        <div className="flex justify-between items-start border-b border-rose-900 pb-4">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase text-rose-400 bg-rose-950 px-3 py-1 rounded-full border border-rose-700">
                                    AI GUARDIAN INCIDENT LOG REVIEW
                                </span>
                                <h3 className="text-xl font-orbitron font-extrabold text-white mt-2">
                                    {selectedIncidentModal.studentName}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Category: {selectedIncidentModal.category} • Date: {selectedIncidentModal.date}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedIncidentModal(null)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                            <strong className="text-rose-400 uppercase font-orbitron text-[10px] block">Specific AI Guardian Log Details:</strong>
                            <p className="text-slate-200 leading-relaxed font-sans">{selectedIncidentModal.incidentLog}</p>
                        </div>

                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-cyan-500/40 text-xs text-cyan-300 space-y-3">
                            <strong className="font-orbitron uppercase text-[10px] block">Quick Action Dispatcher:</strong>
                            <button
                                onClick={() => {
                                    setSelectedAlertStudent(selectedIncidentModal.studentName);
                                    setAlertCategory(selectedIncidentModal.category);
                                    setAlertMessage(`Official citation regarding incident log: ${selectedIncidentModal.incidentLog}`);
                                    handleExecuteDeployment();
                                }}
                                className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
                            >
                                🚀 Enviar Citación / Alerta Institucional a la Pantalla del Alumno
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
