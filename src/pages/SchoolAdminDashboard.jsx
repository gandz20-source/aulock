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
        courseName: '1° Medio A',
        studentsCount: 50,
        attentionRate: 84,
        academicCommitment: 89,
        topSubject: 'Artes e idiomas (6.2)',
        alertsCount: 0,
        alertStatus: '✔ Normal',
        alertColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60'
    },
    {
        id: '2b',
        courseName: '2° Medio B',
        studentsCount: 50,
        attentionRate: 86,
        academicCommitment: 86,
        topSubject: 'Historia y Biología (6.0)',
        alertsCount: 2,
        alertStatus: '⚠️ 2 Alertas Preventivas',
        alertColor: 'text-amber-300 border-amber-500/40 bg-amber-950/60'
    },
    {
        id: '3a',
        courseName: '3° Medio A',
        studentsCount: 50,
        attentionRate: 93,
        academicCommitment: 85,
        topSubject: 'Matemática y Ciencias (6.1)',
        alertsCount: 2,
        alertStatus: '⚠️ 2 Alertas Preventivas',
        alertColor: 'text-amber-300 border-amber-500/40 bg-amber-950/60'
    },
    {
        id: '4a',
        courseName: '4° Medio A',
        studentsCount: 50,
        attentionRate: 92,
        academicCommitment: 92,
        topSubject: 'Matemática e Idiomas (6.3)',
        alertsCount: 1,
        alertStatus: '⚠️ 1 Alertas Preventivas',
        alertColor: 'text-amber-300 border-amber-500/40 bg-amber-950/60'
    }
];

// Mock Directory Students Database
const INITIAL_STUDENTS_DIRECTORY = [
    {
        id: 'st-juan-carlos',
        name: 'Juan Carlos Pérez',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        course: '4° Medio A',
        rut: 'RUT: 21.442.9E8-8',
        historicalGpa: '6,4 (97%) ↗',
        numericGpa: 6.4,
        aptitudeData: [
            { day: 'L', val: 70 },
            { day: 'M', val: 85 },
            { day: 'X', val: 95 },
            { day: 'J', val: 60 },
            { day: 'V', val: 90 }
        ],
        cuidadorStatus: '✔ OK',
        cuidadorColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950',
        guardianName: 'Patricia Pérez (Madre)',
        guardianPhone: '+56 9 8492 1029',
        passportToken: 'AULOCK-PASS-2026-JC98',
        diagnosis: "Juan Carlos destaca en el percentil 98 del establecimiento en razonamiento lógico-matemático (7.0) y fluidez idiomática (6.85).",
        radarData: [
            { subject: 'Lógica', score: 98 },
            { subject: 'Idiomas', score: 92 },
            { subject: 'Ciencias', score: 55 },
            { subject: 'Historia', score: 85 },
            { subject: 'Artes', score: 80 },
            { subject: 'Resiliencia', score: 88 }
        ],
        gradesHistory: [
            { subject: 'Matemáticas Avanzadas', m1: '6.8', m2: '6.9', m3: '7.0', m4: '7.0', avg: '6.92' },
            { subject: 'Lenguaje & Filosofía', m1: '6.2', m2: '6.4', m3: '6.5', m4: '6.6', avg: '6.42' },
            { subject: 'Física Cuántica Aplicada', m1: '6.5', m2: '6.7', m3: '6.8', m4: '6.9', avg: '6.72' }
        ]
    },
    {
        id: 'st-sofia',
        name: 'Sofía Martínez',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        course: '4° Medio A',
        rut: 'RUT: R1.902.148-8',
        historicalGpa: '6,2 (87%)',
        numericGpa: 6.2,
        aptitudeData: [
            { day: 'L', val: 50 },
            { day: 'M', val: 65 },
            { day: 'X', val: 80 },
            { day: 'J', val: 95 },
            { day: 'V', val: 70 }
        ],
        cuidadorStatus: '⚠️ 2',
        cuidadorColor: 'text-amber-300 border-amber-500/40 bg-amber-950',
        guardianName: 'Carlos Martínez (Padre)',
        guardianPhone: '+56 9 7712 3901',
        passportToken: 'AULOCK-PASS-2026-SM12',
        diagnosis: "Sofía demuestra altas capacidades analíticas y liderazgo en escuadrones de trabajo colaborativo.",
        radarData: [
            { subject: 'Lógica', score: 85 },
            { subject: 'Idiomas', score: 95 },
            { subject: 'Ciencias', score: 80 },
            { subject: 'Historia', score: 90 },
            { subject: 'Artes', score: 92 },
            { subject: 'Resiliencia', score: 94 }
        ],
        gradesHistory: [
            { subject: 'Biología Orgánica', m1: '6.5', m2: '6.6', m3: '6.7', m4: '6.8', avg: '6.65' },
            { subject: 'Historia de Chile', m1: '6.8', m2: '6.9', m3: '7.0', m4: '7.0', avg: '6.92' }
        ]
    },
    {
        id: 'st-mateo',
        name: 'Mateo Rojas',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        course: '4° Medio A',
        rut: 'RUT: 21.5S1.992-1',
        historicalGpa: '6,1 (97%)',
        numericGpa: 6.1,
        aptitudeData: [
            { day: 'L', val: 40 },
            { day: 'M', val: 90 },
            { day: 'X', val: 85 },
            { day: 'J', val: 50 },
            { day: 'V', val: 65 }
        ],
        cuidadorStatus: '⚠️ 0',
        cuidadorColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950',
        guardianName: 'Elena Rojas (Madre)',
        guardianPhone: '+56 9 9120 4411',
        passportToken: 'AULOCK-PASS-2026-MR44',
        diagnosis: "Mateo destaca en experimentos prácticos de laboratorio y ciencias naturales (6.8). Muestra interés por la Bioingeniería.",
        radarData: [
            { subject: 'Lógica', score: 75 },
            { subject: 'Idiomas', score: 80 },
            { subject: 'Ciencias', score: 96 },
            { subject: 'Historia', score: 70 },
            { subject: 'Artes', score: 72 },
            { subject: 'Resiliencia', score: 85 }
        ],
        gradesHistory: [
            { subject: 'Biología Orgánica', m1: '6.7', m2: '6.8', m3: '6.9', m4: '7.0', avg: '6.85' },
            { subject: 'Química Aplicada', m1: '6.5', m2: '6.6', m3: '6.7', m4: '6.8', avg: '6.65' }
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
        if (!csvInput.trim()) return alert("Por favor ingresa o carga datos CSV.");
        const rows = parseCSV(csvInput);
        alert(`✅ ¡Carga masiva procesada exitosamente! ${rows.length} registros de ${importType} importados al sistema.`);
        setCsvInput('');
        setShowCsvModal(false);
    };

    const handleDownloadCSV = () => {
        const content = getStudentsCSVTemplate();
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Estudiantes_Colegio360_2026.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-3 md:p-6 pb-28 select-none selection:bg-cyan-900">
            
            {/* 🔴 LÍNEA DE ENCABEZADO SUPERIOR RBAC (Exacto a la imagen de referencia) */}
            <header className="max-w-7xl mx-auto bg-slate-950/95 border-2 border-cyan-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl mb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-cyan-900/60 pb-3">
                    <div className="flex items-center space-x-2 text-cyan-300 font-mono">
                        <strong className="text-white">Arquitectura móvil AuLock RBAC</strong>
                        <span>|</span>
                        <span>Usuario: <strong className="text-cyan-200">Dirección San Agustín</strong></span>
                        <span>|</span>
                        <span>Rol Activo: <strong className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">[ DIRECCIÓN 360° ]</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigate('/teacher-dashboard')}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition text-[11px]"
                        >
                            👨‍🏫 Rol Profesor
                        </button>
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition text-[11px]"
                        >
                            🎓 Rol Alumno
                        </button>
                    </div>
                </div>

                {/* BOTONES DE NAVEGACIÓN SUPERIOR EN PASTILLAS NEÓN */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                            🏫
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-orbitron font-extrabold text-white tracking-wider">
                                Panel Administrador Colegio 360°
                            </h1>
                            <p className="text-[10px] text-cyan-400">
                                200 Alumnos • 4 Secciones • Monitoreo Continuo Cuidador IA
                            </p>
                        </div>
                    </div>

                    {/* PASTILLAS DE ACCIÓN SUPERIOR DERECHA */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveAdminTab('core')}
                            className={`px-4 py-2 rounded-2xl border-2 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all ${
                                activeAdminTab === 'core'
                                    ? 'border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/80 scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                            🌀 Núcleo 360°
                        </button>

                        <button
                            onClick={() => setActiveAdminTab('directories')}
                            className={`px-4 py-2 rounded-2xl border-2 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all ${
                                activeAdminTab === 'directories'
                                    ? 'border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/80 scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                            📁 Directorios
                        </button>

                        <button
                            onClick={() => setShowCsvModal(true)}
                            className="px-4 py-2 rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-300 font-orbitron font-bold text-xs uppercase hover:border-cyan-400 hover:text-cyan-300 transition"
                        >
                            📥 Importar/Exportar (CSV)
                        </button>

                        <button
                            onClick={() => setActiveAdminTab('standards')}
                            className={`px-4 py-2 rounded-2xl border-2 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all ${
                                activeAdminTab === 'standards'
                                    ? 'border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-amber-950/80 scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                            📄 Estándares MINEDUC
                        </button>
                    </div>
                </div>
            </header>

            {/* 🔴 FILA DE 4 TARJETAS KPI MÉTRICAS PRINCIPALES (Exacto a la imagen) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* TARJETA 1: PANEL ADMINISTRADOR COLEGIO 360° */}
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">
                        Panel Administrador Colegio 360°
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-white">200</h3>
                        <span className="text-[10px] text-slate-400 font-mono">(4 Secciones)</span>
                    </div>
                    {/* Sparkline Bar Chart */}
                    <div className="h-8 flex items-end gap-1 pt-1">
                        <div className="w-1.5 h-3 bg-cyan-600 rounded-t" />
                        <div className="w-1.5 h-4 bg-cyan-500 rounded-t" />
                        <div className="w-1.5 h-6 bg-cyan-400 rounded-t" />
                        <div className="w-1.5 h-5 bg-cyan-500 rounded-t" />
                        <div className="w-1.5 h-8 bg-cyan-300 rounded-t shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    </div>
                </div>

                {/* TARJETA 2: PROMEDIO GENERAL */}
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Promedio General
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-cyan-300">5,92 / 7,0</h3>
                    </div>
                    {/* Sparkline Line Graph */}
                    <svg className="w-full h-8 stroke-cyan-400 fill-none stroke-2" viewBox="0 0 100 30">
                        <path d="M 0 25 Q 25 10 50 15 T 100 5" />
                    </svg>
                </div>

                {/* TARJETA 3: SALUD EMOCIONAL CON GAUGE */}
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Salud Emocional
                    </span>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-rose-400 flex items-center space-x-1">
                            <span>❤️</span>
                            <span>84,5%</span>
                        </h3>
                        {/* Half-circle Colored Gauge Indicator */}
                        <div className="w-12 h-6 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-t-full p-1 flex items-end justify-center">
                            <div className="w-2 h-2 bg-slate-950 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* TARJETA 4: RETENCIÓN Y ASISTENCIA */}
                <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-4 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Retención y Asistencia
                    </span>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-orbitron font-black text-emerald-400 flex items-center space-x-1">
                            <span>🛡️</span>
                            <span>96,8%</span>
                        </h3>
                        <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 flex items-center justify-center text-xs">
                            ✓
                        </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-emerald-500/40">
                        <div className="bg-emerald-400 h-full w-[96.8%]" />
                    </div>
                </div>

            </div>

            {/* 🔴 VISTA PRINCIPAL SEGÚN NAVEGACIÓN SELECCIONADA */}
            <main className="max-w-7xl mx-auto space-y-6">

                {activeAdminTab === 'core' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        
                        {/* 🔴 PANEL 1: MAPA DE COMPORTAMIENTO, ATENCIÓN Y CLIMA EMOCIONAL POR CURSO (Exacto a la imagen) */}
                        <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-cyan-900/60 pb-3">
                                <div>
                                    <h2 className="text-lg md:text-xl font-orbitron font-extrabold text-white tracking-wider">
                                        Mapa de Comportamiento, Atención y Clima Emocional por Curso
                                    </h2>
                                    <span className="text-xs text-slate-400">
                                        Cuadro Comparativo 4 secciones (en desarrollo)
                                    </span>
                                </div>

                                {/* Heatmap grid & Radar preview icons */}
                                <div className="flex items-center space-x-4 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                                    <div className="grid grid-cols-4 gap-1">
                                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-emerald-300 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-rose-400 rounded-sm" />
                                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
                                    </div>
                                    <span className="text-[10px] text-cyan-300 font-bold">1°A, 2°B, 3°A, 4°A</span>
                                </div>
                            </div>

                            {/* TABLA COMPARATIVA DE CURSOS */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-900/90 text-slate-400 font-extrabold uppercase border-b border-cyan-900/60">
                                        <tr>
                                            <th className="p-3">CURSO</th>
                                            <th className="p-3">ALUMNOS</th>
                                            <th className="p-3">ALUMNOS %</th>
                                            <th className="p-3">% ATENCIÓN</th>
                                            <th className="p-3">% COMPROMISO</th>
                                            <th className="p-3">ASIGNATURA FUERTE</th>
                                            <th className="p-3">ALERTAS CUIDADOR IA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {COURSE_BEHAVIOR_DATA.map((row) => (
                                            <tr key={row.id} className="hover:bg-slate-900/50 transition">
                                                <td className="p-3 font-bold text-white text-sm">{row.courseName}</td>
                                                <td className="p-3 text-slate-300">{row.studentsCount}</td>
                                                <td className="p-3 text-cyan-300 font-bold flex items-center space-x-1">
                                                    <span>👁️</span>
                                                    <span>{row.attentionRate}%</span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="w-32 bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700 p-0.5 flex">
                                                        <div className="bg-emerald-400 h-full w-[60%]" />
                                                        <div className="bg-amber-400 h-full w-[25%]" />
                                                        <div className="bg-rose-500 h-full w-[15%]" />
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="w-32 bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700 p-0.5 flex">
                                                        <div className="bg-purple-500 h-full w-[50%]" />
                                                        <div className="bg-sky-400 h-full w-[35%]" />
                                                        <div className="bg-fuchsia-500 h-full w-[15%]" />
                                                    </div>
                                                </td>
                                                <td className="p-3 text-cyan-200 font-bold">{row.topSubject}</td>
                                                <td className="p-3">
                                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${row.alertColor}`}>
                                                        {row.alertStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 🔴 PANEL 2: DIRECTORIO GENERAL DE ALUMNOS DEL COLEGIO (Exacto a la imagen) */}
                        <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-cyan-900/60 pb-3">
                                <div>
                                    <h2 className="text-lg md:text-xl font-orbitron font-extrabold text-white tracking-wider">
                                        Directorio General de Alumnos del Colegio
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Inspecciona el expediente individual amplio, promedio histórico y focos de cualquier estudiante
                                    </p>
                                </div>

                                {/* CONTROLES DE BÚSQUEDA Y FILTRO */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por nombre o curso..."
                                        className="bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3.5 py-2 rounded-xl outline-none focus:border-cyan-400 w-48 sm:w-64"
                                    />
                                    <select
                                        value={selectedCourseFilter}
                                        onChange={e => setSelectedCourseFilter(e.target.value)}
                                        className="bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl outline-none focus:border-cyan-400"
                                    >
                                        <option value="ALL">Todos los Cursos ∨</option>
                                        <option value="4° Medio A">4° Medio A</option>
                                        <option value="3° Medio A">3° Medio A</option>
                                        <option value="2° Medio B">2° Medio B</option>
                                        <option value="1° Medio A">1° Medio A</option>
                                    </select>
                                </div>
                            </div>

                            {/* TABLA DE DIRECTORIO DE ESTUDIANTES */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-900/90 text-slate-400 font-extrabold uppercase border-b border-cyan-900/60">
                                        <tr>
                                            <th className="p-3">FOTO/ESTUDIANTE</th>
                                            <th className="p-3">CURSO</th>
                                            <th className="p-3">PROMEDIO HISTÓRICO</th>
                                            <th className="p-3">APTITUD DESTACADA</th>
                                            <th className="p-3">ESTADO CUIDADOR IA</th>
                                            <th className="p-3">ACCIÓN</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredStudents.map(student => (
                                            <tr key={student.id} className="hover:bg-slate-900/60 transition">
                                                <td className="p-3">
                                                    <div className="flex items-center space-x-3">
                                                        <img 
                                                            src={student.photoUrl} 
                                                            alt={student.name} 
                                                            className="w-10 h-10 rounded-xl object-cover border border-cyan-500/60"
                                                        />
                                                        <div>
                                                            <strong className="text-white text-sm block font-bold">{student.name}</strong>
                                                            <span className="text-[10px] text-slate-400">{student.rut}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-3 font-bold text-cyan-300">{student.course}</td>

                                                <td className="p-3 font-bold text-emerald-400">{student.historicalGpa}</td>

                                                {/* Sparkline Aptitud Destacada */}
                                                <td className="p-3">
                                                    <div className="h-6 flex items-end gap-1">
                                                        {student.aptitudeData.map((d, i) => (
                                                            <div 
                                                                key={i} 
                                                                style={{ height: `${d.val}%` }}
                                                                className="w-2 bg-cyan-400 rounded-t"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>

                                                <td className="p-3">
                                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${student.cuidadorColor}`}>
                                                        {student.cuidadorStatus}
                                                    </span>
                                                </td>

                                                <td className="p-3">
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(147,51,234,0.5)] transition flex items-center space-x-1"
                                                    >
                                                        <span>👁️ Ver</span>
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

                {/* VISTA 2: DIRECTORIOS AMPLIADOS */}
                {activeAdminTab === 'directories' && (
                    <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-xl space-y-4 font-mono animate-in fade-in">
                        <div className="flex justify-between items-center border-b border-cyan-900/60 pb-3">
                            <h2 className="text-xl font-orbitron font-bold text-white uppercase">
                                Directorios Institucionales
                            </h2>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setDirectoryType('students')}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs ${directoryType === 'students' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                                >
                                    Estudiantes
                                </button>
                                <button 
                                    onClick={() => setDirectoryType('teachers')}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs ${directoryType === 'teachers' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                                >
                                    Docentes
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300">
                            Inspecciona la nómina completa de {directoryType === 'students' ? 'Estudiantes' : 'Docentes'} con sus respectivos promedios, horas en AuLock NFC y evaluaciones.
                        </p>
                    </div>
                )}

                {/* VISTA 3: ESTÁNDARES MINEDUC */}
                {activeAdminTab === 'standards' && (
                    <div className="bg-slate-950/90 border-2 border-amber-500/80 p-6 rounded-3xl shadow-xl space-y-6 font-mono animate-in fade-in">
                        <div className="flex justify-between items-center border-b border-amber-900/60 pb-4">
                            <div>
                                <span className="text-[10px] text-amber-400 uppercase font-bold">AGENCIA DE CALIDAD DE LA EDUCACIÓN</span>
                                <h2 className="text-xl font-orbitron font-extrabold text-white">Estándares Indicativos de Desempeño Escolar (MINEDUC)</h2>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                                Cumplimiento Promedio: 92,2% (Categoría Alto)
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MINEDUC_QUALITY_STANDARDS.map(ambito => (
                                <div key={ambito.ambito_id} className="bg-slate-900 p-5 rounded-2xl border border-amber-500/30 space-y-2">
                                    <span className="text-xs font-bold text-amber-300 uppercase">{ambito.nombre_ambito}</span>
                                    <p className="text-xs text-slate-300 font-sans">{ambito.sub_dimensiones?.join(' • ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* 🔴 DRAWER / MODAL DEL EXPEDIENTE INDIVIDUAL COMPLETO DEL ESTUDIANTE */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-950 border-2 border-cyan-400/90 rounded-3xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto font-mono shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                        <div className="flex justify-between items-start border-b border-cyan-900/80 pb-4">
                            <div className="flex items-center space-x-4">
                                <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400" />
                                <div>
                                    <span className="text-[10px] text-cyan-400 uppercase font-bold">EXPEDIENTE INDIVIDUAL AULOCK</span>
                                    <h3 className="text-xl font-orbitron font-extrabold text-white">{selectedStudent.name}</h3>
                                    <p className="text-xs text-slate-400">{selectedStudent.rut} • <strong>{selectedStudent.course}</strong></p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-bold hover:bg-rose-950 hover:text-rose-400 flex items-center justify-center">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">DATOS DE APODERADO</span>
                                <p className="text-slate-200"><strong>Nombre:</strong> {selectedStudent.guardianName}</p>
                                <p className="text-slate-200"><strong>Contacto:</strong> {selectedStudent.guardianPhone}</p>
                                <p className="text-cyan-300 font-mono text-[10px] pt-1">Token NFC: {selectedStudent.passportToken}</p>
                            </div>

                            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">PROMEDIO ACUMULADO & PERCENTIL</span>
                                <p className="text-xl font-bold text-emerald-400">{selectedStudent.historicalGpa}</p>
                                <p className="text-slate-300 text-[11px] italic">"{selectedStudent.diagnosis}"</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                            <h4 className="text-xs font-orbitron font-bold text-cyan-300 uppercase">NOTAS POR ASIGNATURA MINEDUC:</h4>
                            <div className="divide-y divide-slate-800 text-xs">
                                {selectedStudent.gradesHistory.map((g, idx) => (
                                    <div key={idx} className="py-2 flex justify-between items-center text-slate-200">
                                        <span>{g.subject}</span>
                                        <strong className="text-emerald-400 font-mono">Prom: {g.avg}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button onClick={() => window.print()} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow">🖨️ Imprimir Expediente</button>
                            <button onClick={() => setSelectedStudent(null)} className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔴 MODAL CARGA CSV */}
            {showCsvModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-950 border-2 border-cyan-400 rounded-3xl max-w-xl w-full p-6 space-y-4 font-mono">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="text-sm font-orbitron font-extrabold text-cyan-300 uppercase">Importar / Exportar Datos CSV</h3>
                            <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                        </div>

                        <button onClick={handleDownloadCSV} className="w-full py-2.5 bg-slate-900 border border-cyan-500/60 text-cyan-300 font-bold text-xs rounded-xl hover:bg-cyan-950">
                            📥 Descargar Plantilla CSV Estudiantes
                        </button>

                        <textarea
                            value={csvInput}
                            onChange={e => setCsvInput(e.target.value)}
                            rows={5}
                            placeholder="Pega aquí los registros CSV separados por comas..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-cyan-400"
                        />

                        <div className="flex justify-end space-x-2">
                            <button onClick={handleProcessCsvImport} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">Procesar CSV</button>
                            <button onClick={() => setShowCsvModal(false)} className="px-4 py-2 bg-slate-900 text-slate-400 text-xs rounded-xl">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔴 BARRA DE ACCIÓN FIJA INFERIOR (Exacto a la referencia) */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t-2 border-cyan-900/80 p-3 px-6 flex items-center justify-between font-mono shadow-2xl">
                <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400">Llegando</span>
                    <span className="px-3 py-1 bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-bold rounded-xl">
                        (4 Secciones)
                    </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                    <button onClick={() => navigate('/core-intelligence')} className="px-4 py-2 rounded-2xl bg-cyan-950 border-2 border-cyan-400 text-cyan-300 font-bold uppercase hover:bg-cyan-900 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition">
                        🌀 Núcleo 360°
                    </button>
                    <button onClick={() => setActiveAdminTab('directories')} className="px-4 py-2 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold uppercase hover:bg-cyan-950 transition">
                        📁 Directorios
                    </button>
                    <button onClick={() => setShowCsvModal(true)} className="px-4 py-2 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold uppercase hover:bg-cyan-950 transition">
                        📥 Importar/Exportar
                    </button>
                </div>
            </footer>

        </div>
    );
}
