import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    School, Users, ShieldAlert, TrendingUp, Search, Filter, 
    CheckCircle2, AlertTriangle, BrainCircuit, Sparkles, BookOpen, 
    BarChart3, Activity, Heart, ArrowUpRight, ChevronRight, Eye, 
    Printer, Download, GraduationCap, Award, FileText, Check, X, ShieldCheck, Trophy, Volume2
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
    getSecretTeacherRatings, getStudentsCSVTemplate, getTeachersCSVTemplate, parseCSV 
} from '../services/DataImportService';
import { MINEDUC_QUALITY_STANDARDS } from '../data/AuLockMineducStandards';

// Mock Course Behavior & Analytics Data
const COURSE_BEHAVIOR_DATA = [
    {
        id: '1a',
        courseName: 'Freshman A (1° Medio A)',
        studentsCount: 50,
        attentionRate: 84,
        academicCommitment: 89,
        topSubject: 'Arts & Languages (6.2)',
        alertsCount: 0,
        alertStatus: '✔ Normal',
        alertColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60'
    },
    {
        id: '2b',
        courseName: 'Sophomore B (2° Medio B)',
        studentsCount: 50,
        attentionRate: 86,
        academicCommitment: 86,
        topSubject: 'History & Biology (6.0)',
        alertsCount: 2,
        alertStatus: '⚠️ 2 Preventive Alerts',
        alertColor: 'text-amber-300 border-amber-500/40 bg-amber-950/60'
    },
    {
        id: '3a',
        courseName: 'Junior A (3° Medio A)',
        studentsCount: 50,
        attentionRate: 93,
        academicCommitment: 85,
        topSubject: 'Mathematics & STEM (6.1)',
        alertsCount: 2,
        alertStatus: '⚠️ 2 Preventive Alerts',
        alertColor: 'text-amber-300 border-amber-500/40 bg-amber-950/60'
    },
    {
        id: '4a',
        courseName: 'Senior A (4° Medio A)',
        studentsCount: 50,
        attentionRate: 92,
        academicCommitment: 92,
        topSubject: 'Math & Foreign Languages (6.3)',
        alertsCount: 1,
        alertStatus: '⚠️ 1 Preventive Alert',
        alertColor: 'text-amber-300 border-amber-500/40 bg-amber-950/60'
    }
];

// Mock Directory Students Database
const INITIAL_STUDENTS_DIRECTORY = [
    {
        id: 'st-juan-carlos',
        name: 'Juan Carlos Pérez',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        course: 'Senior A',
        rut: 'ID: 21.442.9E8-8',
        historicalGpa: '6.4 (97%) ↗',
        numericGpa: 6.4,
        aptitudeData: [
            { day: 'Mon', val: 70 },
            { day: 'Tue', val: 85 },
            { day: 'Wed', val: 95 },
            { day: 'Thu', val: 60 },
            { day: 'Fri', val: 90 }
        ],
        cuidadorStatus: '✔ OK',
        cuidadorColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950',
        guardianName: 'Patricia Pérez (Mother)',
        guardianPhone: '+56 9 8492 1029',
        passportToken: 'AULOCK-PASS-2026-JC98',
        diagnosis: "Juan Carlos stands out in the 98th percentile for logical-mathematical reasoning (7.0) and language fluency (6.85).",
        radarData: [
            { subject: 'Logic', score: 98 },
            { subject: 'Languages', score: 92 },
            { subject: 'Science', score: 55 },
            { subject: 'History', score: 85 },
            { subject: 'Arts', score: 80 },
            { subject: 'Resilience', score: 88 }
        ],
        gradesHistory: [
            { subject: 'Advanced STEM Math', m1: '6.8', m2: '6.9', m3: '7.0', m4: '7.0', avg: '6.92' },
            { subject: 'Language & Philosophy', m1: '6.2', m2: '6.4', m3: '6.5', m4: '6.6', avg: '6.42' },
            { subject: 'Applied Quantum Physics', m1: '6.5', m2: '6.7', m3: '6.8', m4: '6.9', avg: '6.72' }
        ]
    },
    {
        id: 'st-sofia',
        name: 'Sofía Martínez',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        course: 'Senior A',
        rut: 'ID: R1.902.148-8',
        historicalGpa: '6.2 (87%)',
        numericGpa: 6.2,
        aptitudeData: [
            { day: 'Mon', val: 50 },
            { day: 'Tue', val: 65 },
            { day: 'Wed', val: 80 },
            { day: 'Thu', val: 95 },
            { day: 'Fri', val: 70 }
        ],
        cuidadorStatus: '⚠️ 2',
        cuidadorColor: 'text-amber-300 border-amber-500/40 bg-amber-950',
        guardianName: 'Carlos Martínez (Father)',
        guardianPhone: '+56 9 7712 3901',
        passportToken: 'AULOCK-PASS-2026-SM12',
        diagnosis: "Sofía demonstrates high analytical capability and squad leadership in collaborative learning environments.",
        radarData: [
            { subject: 'Logic', score: 85 },
            { subject: 'Languages', score: 95 },
            { subject: 'Science', score: 80 },
            { subject: 'History', score: 90 },
            { subject: 'Arts', score: 92 },
            { subject: 'Resilience', score: 94 }
        ],
        gradesHistory: [
            { subject: 'Organic Biology', m1: '6.5', m2: '6.6', m3: '6.7', m4: '6.8', avg: '6.65' },
            { subject: 'World History', m1: '6.8', m2: '6.9', m3: '7.0', m4: '7.0', avg: '6.92' }
        ]
    }
];

export default function SchoolAdminDashboard() {
    const { profile } = useAuth();
    const navigate = useNavigate();

    // Active View / Tab State
    const [activeAdminTab, setActiveAdminTab] = useState('core'); // 'core' | 'directories' | 'import_export' | 'standards'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [directoryType, setDirectoryType] = useState('students'); // 'students' | 'teachers'

    // CSV Bulk Import State
    const [importType, setImportType] = useState('students');
    const [csvInput, setCsvInput] = useState('');
    const [showCsvModal, setShowCsvModal] = useState(false);

    // Students Directory State
    const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS_DIRECTORY);

    // Filtered Students
    const filteredStudents = studentsList.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rut.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourseFilter === 'ALL' || student.course === selectedCourseFilter;
        return matchesSearch && matchesCourse;
    });

    const handleProcessCsvImport = (e) => {
        e.preventDefault();
        if (!csvInput.trim()) return alert("Please enter or paste CSV data.");
        const rows = parseCSV(csvInput);
        alert(`✅ Bulk import processed successfully! ${rows.length} ${importType} records imported into system.`);
        setCsvInput('');
        setShowCsvModal(false);
    };

    const handleDownloadCSV = () => {
        const content = getStudentsCSVTemplate();
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Students_Colegio360_2026.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-3 md:p-6 pb-28 select-none selection:bg-cyan-900">
            
            {/* TOP RBAC HEADER */}
            <header className="max-w-7xl mx-auto bg-slate-950/95 border-2 border-cyan-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl mb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-cyan-900/60 pb-3">
                    <div className="flex items-center space-x-2 text-cyan-300 font-mono">
                        <strong className="text-white">AuLock Mobile RBAC Architecture</strong>
                        <span>|</span>
                        <span>User: <strong className="text-cyan-200">San Agustín Administration</strong></span>
                        <span>|</span>
                        <span>Active Role: <strong className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">[ 360° SCHOOL DIRECTION ]</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigate('/teacher-dashboard')}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition text-[11px]"
                        >
                            👨‍🏫 Teacher Role
                        </button>
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition text-[11px]"
                        >
                            🎓 Student Role
                        </button>
                    </div>
                </div>

                {/* TOP NAVIGATION TABS */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                            🏫
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-orbitron font-extrabold text-white tracking-wider">
                                School Admin 360° Dashboard
                            </h1>
                            <p className="text-[10px] text-cyan-400">
                                200 Students • 4 Sections • Continuous AI Guardian Monitoring
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveAdminTab('core')}
                            className={`px-4 py-2 rounded-2xl border-2 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all ${
                                activeAdminTab === 'core'
                                    ? 'border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/80 scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                            🌀 360° Core
                        </button>

                        <button
                            onClick={() => setActiveAdminTab('directories')}
                            className={`px-4 py-2 rounded-2xl border-2 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all ${
                                activeAdminTab === 'directories'
                                    ? 'border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/80 scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                            📁 Directories
                        </button>

                        <button
                            onClick={() => setShowCsvModal(true)}
                            className="px-4 py-2 rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-300 font-orbitron font-bold text-xs uppercase hover:border-cyan-400 hover:text-cyan-300 transition"
                        >
                            📥 Import/Export (CSV)
                        </button>

                        <button
                            onClick={() => setActiveAdminTab('standards')}
                            className={`px-4 py-2 rounded-2xl border-2 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all ${
                                activeAdminTab === 'standards'
                                    ? 'border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-amber-950/80 scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                            📄 MINEDUC Standards
                        </button>
                    </div>
                </div>
            </header>

            {/* KPI METRIC CARDS */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">
                        School Enrollment
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-white">200</h3>
                        <span className="text-[10px] text-slate-400 font-mono">(4 Sections)</span>
                    </div>
                </div>

                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        General GPA Average
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-cyan-300">5.92 / 7.0</h3>
                    </div>
                </div>

                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Emotional & Mental Health
                    </span>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-rose-400 flex items-center space-x-1">
                            <span>❤️</span>
                            <span>84.5%</span>
                        </h3>
                    </div>
                </div>

                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Retention & Attendance
                    </span>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-emerald-400 flex items-center space-x-1">
                            <span>🛡️</span>
                            <span>96.8%</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto space-y-6">
                {activeAdminTab === 'core' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                            <h2 className="text-lg md:text-xl font-orbitron font-extrabold text-white tracking-wider">
                                Behavior, Attention & Emotional Climate Map by Course
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-900/90 text-slate-400 font-extrabold uppercase border-b border-cyan-900/60">
                                        <tr>
                                            <th className="p-3">COURSE</th>
                                            <th className="p-3">STUDENTS</th>
                                            <th className="p-3">ATTENTION %</th>
                                            <th className="p-3">TOP SUBJECT</th>
                                            <th className="p-3">AI GUARDIAN ALERTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {COURSE_BEHAVIOR_DATA.map((row) => (
                                            <tr key={row.id} className="hover:bg-slate-900/50 transition">
                                                <td className="p-3 font-bold text-white text-sm">{row.courseName}</td>
                                                <td className="p-3 text-slate-300">{row.studentsCount}</td>
                                                <td className="p-3 text-cyan-300 font-bold">{row.attentionRate}%</td>
                                                <td className="p-3 text-slate-300">{row.topSubject}</td>
                                                <td className="p-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.alertColor}`}>
                                                        {row.alertStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
