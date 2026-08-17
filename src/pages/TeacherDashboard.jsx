import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { generateLessonPlan, generateNotebookPresentation, generateTeacherImprovementSuggestion, evaluateSummativeWithMineducRubric } from '../services/GeminiService';
import { MINEDUC_EVALUATION_DATASET } from '../data/AuLockMineducEvaluationDataset';
import { MINEDUC_ACTIVITIES_REGISTRY } from '../data/AuLockMineducActivitiesDataset';
import { 
  connectGoogleClassroomOAuth, 
  fetchGoogleClassroomRoster, 
  importRosterToSupabase, 
  generateAndExportSessionPDFToDrive, 
  fetchGoogleCalendarSchedule 
} from '../services/GoogleSuiteIntegrationService';
import HumanCoreRadar from '../components/HumanCoreRadar';
import WellnessAlertsPanel from '../components/WellnessAlertsPanel';
import TeacherActivityPublisher from '../components/TeacherActivityPublisher';
import ClassroomArena from '../components/arena/ClassroomArena';
import TeacherHeaderNav from '../components/hud/TeacherHeaderNav';
import TeacherActionBar from '../components/hud/TeacherActionBar';
import TeacherSquadManager from '../components/TeacherSquadManager';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
    BookOpen, Play, Clock, Plus, Trash2, CheckCircle, Users, AlertTriangle, 
    ShieldAlert, ShoppingBag, Check, X, Sparkles, Save, Trophy, Mic, Layout, 
    Timer, GraduationCap, ChevronRight, Gamepad2, BrainCircuit, UserPlus, UserMinus, 
    FileText, Upload, Share2, Star, Edit3, Award, MessageSquare, Flame, Presentation, 
    Radio, Volume2, ChevronLeft, Tv, MonitorPlay
} from 'lucide-react';

const LIVE_RESPONSE_DATA = [
    { name: 'Respuesta', val: 50 },
    { name: 'Propuesta', val: 19 },
    { name: 'Cooperativa', val: 16 },
    { name: 'Grupo 2', val: 16 },
    { name: 'Grupo 3', val: 9 },
    { name: 'Tgles', val: 5 },
    { name: 'V/F', val: 2 },
    { name: 'Desarrollo', val: 1 },
];

const INITIAL_EVALUATIONS = [
    { id: 'ev-1', title: 'Ensayo PAES Matemáticas N° 4', date: '2026-08-02', course: '4° Medio A', averageGrade: '6.3', passRate: '94%', topStudent: 'Juan Carlos Pérez (7.0)' },
    { id: 'ev-2', title: 'Quiz de Leyes de Newton', date: '2026-07-29', course: '3° Medio A', averageGrade: '5.8', passRate: '88%', topStudent: 'Mateo Rojas (6.8)' },
    { id: 'ev-3', title: 'Evaluación de Comprensión LECT', date: '2026-07-25', course: '4° Medio A', averageGrade: '6.1', passRate: '91%', topStudent: 'Sofía Martínez (6.9)' }
];

const INITIAL_SHARED_FILES = [
    { id: 'f-1', name: 'Guia_Ejercicios_Calculo_Diferencial.pdf', size: '2.4 MB', date: '2026-08-04', shared: true },
    { id: 'f-2', name: 'Presentacion_IA_y_Etica_2026.pptx', size: '5.1 MB', date: '2026-08-03', shared: true }
];

const INITIAL_SQUADS = [
    { id: 'sq-1', name: 'Squad Alfa STEM', course: '4° Medio A', members: ['Juan Carlos Pérez', 'Sofía Martínez', 'Mateo Rojas'], averageScore: 92, collaborationScore: 95 },
    { id: 'sq-2', name: 'Squad Beta Humanidades', course: '4° Medio A', members: ['Camila Silva', 'Lucas Fernández'], averageScore: 88, collaborationScore: 90 }
];

export default function TeacherDashboard() {
    const { profile } = useAuth();
    const { state } = useUI();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('live');

    // AI NotebookLLM Presentation State
    const [nextClassTopic, setNextClassTopic] = useState('Derivadas y Optimización de Funciones');
    const [generatingPresentation, setGeneratingPresentation] = useState(false);
    const [presentationDeck, setPresentationDeck] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isProjecting, setIsProjecting] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const handleGenerateNotebookPresentation = async () => {
        setGeneratingPresentation(true);
        const deck = await generateNotebookPresentation(nextClassTopic, { nivel: '4° Medio A', asignatura: 'Matemática Avanzada & Cálculo' });
        setPresentationDeck(deck);
        setCurrentSlideIndex(0);
        setGeneratingPresentation(false);
    };

    const handleToggleAudioOverview = () => {
        setIsPlayingAudio(!isPlayingAudio);
    };

    const handleProjectSlideToStudents = () => {
        setIsProjecting(!isProjecting);
        alert(isProjecting ? "📡 Proyección finalizada." : "📡 Diapositiva proyectada en vivo en las pantallas de todos los alumnos.");
    };

    // Teacher Notes State
    const [teacherNotes, setTeacherNotes] = useState(() => {
        return localStorage.getItem('aulock_teacher_notes') || "• Recordar revisar el laboratorio de Biología el jueves.\n• Preparar guía de cálculo para el Squad Alfa.";
    });

    const handleSaveTeacherNotes = (text) => {
        setTeacherNotes(text);
        localStorage.setItem('aulock_teacher_notes', text);
    };

    // MBE MINEDUC AI Advisory State
    const [teacherChallenge, setTeacherChallenge] = useState('¿Cómo diversificar las estrategias didácticas para mejorar la participación activa durante la resolución de ejercicios?');
    const [isGeneratingMbePlan, setIsGeneratingMbePlan] = useState(false);
    const [mbePlanResult, setMbePlanResult] = useState(null);

    const handleGenerateMbePlan = async () => {
        setIsGeneratingMbePlan(true);
        const plan = await generateTeacherImprovementSuggestion({
            teacherId: profile?.name || 'Prof. María González',
            context: { nivel: '4° Medio A' },
            teacherProblem: teacherChallenge,
            ambitoId: 'gestion_pedagogica'
        });
        setMbePlanResult(plan);
        setIsGeneratingMbePlan(false);
    };

    // Summative Evaluation State
    const [summativeStudentWork, setSummativeStudentWork] = useState('El agua es un recurso vital en las cuencas hidrográficas de la zona central de Chile. Para conservarla, las empresas agrícolas deben instalar riego por goteo y los ciudadanos reducir el consumo diario.');
    const [isEvaluatingSummative, setIsEvaluatingSummative] = useState(false);
    const [summativeEvalResult, setSummativeEvalResult] = useState(null);

    const handleEvaluateSummative = async () => {
        setIsEvaluatingSummative(true);
        const result = await evaluateSummativeWithMineducRubric(
            summativeStudentWork,
            { nivel: '5º Básico', oa_descripcion: 'OA 10 - Analizar el rol de los actores en la conservación de la biodiversidad y el agua.' },
            {
                dimensiones: ["Conocimiento conceptual", "Análisis crítico", "Comunicación de ideas"],
                niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
            }
        );
        setSummativeEvalResult(result);
        setIsEvaluatingSummative(false);
    };

    // Shared Files Repository State
    const [sharedFiles, setSharedFiles] = useState(() => {
        const saved = localStorage.getItem('aulock_shared_files');
        return saved ? JSON.parse(saved) : INITIAL_SHARED_FILES;
    });

    // Session Configuration State
    const [activeMode, setActiveMode] = useState('Projector / Desktop');
    const [groupSize, setGroupSize] = useState('3 Groups of 4 Students');

    // Live Student Responses State & Real-Time Sync Listeners
    const [liveResponsesList, setLiveResponsesList] = useState([]);
    const [latestStudentResponse, setLatestStudentResponse] = useState(null);
    const [comprehensionPulse, setComprehensionPulse] = useState(null);

    useEffect(() => {
        const handleSyncStudentResponses = (e) => {
            const saved = localStorage.getItem('aulock_student_live_responses');
            if (saved) {
                try {
                    const list = JSON.parse(saved);
                    setLiveResponsesList(list);
                    if (list.length > 0) {
                        setLatestStudentResponse(list[0]);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            const understandingSaved = localStorage.getItem('aulock_student_understanding');
            if (understandingSaved) {
                try {
                    setComprehensionPulse(JSON.parse(understandingSaved));
                } catch (err) {
                    console.error(err);
                }
            }
        };

        handleSyncStudentResponses();
        window.addEventListener('storage', handleSyncStudentResponses);
        window.addEventListener('aulock_student_response_event', handleSyncStudentResponses);
        window.addEventListener('aulock_understanding_event', handleSyncStudentResponses);
        return () => {
            window.removeEventListener('storage', handleSyncStudentResponses);
            window.removeEventListener('aulock_student_response_event', handleSyncStudentResponses);
            window.removeEventListener('aulock_understanding_event', handleSyncStudentResponses);
        };
    }, []);

    // Forced Focus Mode State & Synchronized Handler
    const [isForceFocusActive, setIsForceFocusActive] = useState(() => {
        return localStorage.getItem('aulock_force_focus_mode') === 'true';
    });

    const handleToggleForceFocusMode = () => {
        const nextState = !isForceFocusActive;
        setIsForceFocusActive(nextState);
        localStorage.setItem('aulock_force_focus_mode', nextState ? 'true' : 'false');
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_focus_event', { detail: { active: nextState } }));
        if (nextState) {
            alert("🚀 Classwide Focus Mode FORCED! All 26 student mobile devices are now locked in Focus Mode.");
        } else {
            alert("⛔ Classwide Focus Mode RELEASED. Mobile devices returned to normal mode.");
        }
    };

    // Live Question Launcher & Synchronized Event Broadcast
    const [questionType, setQuestionType] = useState('alternatives');
    const [questionText, setQuestionText] = useState('What is the correct syntax for declaring a variable in Ryo-Script?');
    const [timer, setTimer] = useState(45);
    const [options, setOptions] = useState(['let x = 10', 'var x = 10', 'const x: 10', 'define x = 10']);
    const [correctAnswer, setCorrectAnswer] = useState('let x = 10');

    const handleLaunchLiveQuestion = () => {
        if (!questionText.trim()) return alert("Please enter a question prompt first.");

        const validOptions = (questionType === 'multiple_choice' || questionType === 'alternatives') 
            ? options.filter(o => o.trim()) 
            : (questionType === 'true_false' ? ['True', 'False'] : []);

        const payload = {
            type: "NEW_QUESTION",
            data: {
                question: questionText.trim(),
                options: validOptions,
                type: questionType,
                timeLimit: Number(timer) || 45,
                correct_answer: correctAnswer
            }
        };

        const legacyQuestion = {
            id: 'q-' + Date.now(),
            text: payload.data.question,
            question_type: questionType,
            options: payload.data.options,
            correct_answer: correctAnswer,
            timer_seconds: Number(timer) || 45,
            launched_at: new Date().toISOString()
        };

        localStorage.setItem('aulock_active_question_event', JSON.stringify(payload));
        localStorage.setItem('aulock_active_question', JSON.stringify(legacyQuestion));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_question_event', { detail: payload }));
        alert(`🚀 Live Question Broadcasted to Class! Time Limit: ${timer}s. Student HUD updated instantly.`);
    };

    // MINEDUC Activities State
    const [activitiesList, setActivitiesList] = useState(MINEDUC_ACTIVITIES_REGISTRY);

    const handleToggleActivityState = (actId) => {
        setActivitiesList(prev => prev.map(a => {
            if (a.actividad_id === actId) {
                const nextState = a.estado === 'borrador' ? 'lanzada' : a.estado === 'lanzada' ? 'cerrada' : 'borrador';
                return { ...a, estado: nextState };
            }
            return a;
        }));
    };

    // Google Suite API Integration State & Handlers
    const [googleConnected, setGoogleConnected] = useState(false);
    const [googleStatusMsg, setGoogleStatusMsg] = useState('');
    const [calendarEvents, setCalendarEvents] = useState([]);

    const handleGoogleClassroomConnect = async () => {
        setGoogleStatusMsg('Connecting Google Workspace OAuth...');
        const oauthRes = await connectGoogleClassroomOAuth();
        const roster = await fetchGoogleClassroomRoster();
        await importRosterToSupabase('COURSE_MINEDUC_4A', roster);
        setGoogleConnected(true);
        setGoogleStatusMsg(`✓ Connected to Google Classroom: Imported ${roster.length} students to Supabase database.`);
    };

    const handleExportPDFToGoogleDrive = async () => {
        setGoogleStatusMsg('Generating PDF Evidence Report...');
        const driveRes = await generateAndExportSessionPDFToDrive({
            className: '4° Medio A - Mathematics & STEM',
            teacherName: 'Prof. Carlos Rivas',
            teacherTimer: 300
        });
        setGoogleStatusMsg(`📄 Exported: ${driveRes.fileName} uploaded to Google Drive folder '${driveRes.folderName}'.`);
    };

    const handleSyncGoogleCalendar = async () => {
        const events = await fetchGoogleCalendarSchedule();
        setCalendarEvents(events);
        setGoogleStatusMsg(`📅 Calendar Synced: Detected ongoing 09:00 AM class slot.`);
    };

    const currentSlide = presentationDeck?.slides?.[currentSlideIndex];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 md:p-6 pb-28 selection:bg-cyan-900">
            
            {/* 🔴 CABECERA Y NAVEGACIÓN DOCENTE HUD (Exacto a la referencia visual) */}
            <div className="max-w-7xl mx-auto">
                <TeacherHeaderNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* 🔴 CONTENIDO PRINCIPAL SEGÚN PESTAÑA HUD SELECCIONADA */}
            <main className="max-w-7xl mx-auto space-y-8">
                
                {/* ==================== TAB 1: 1. LIVE CLASSROOM ==================== */}
                {activeTab === 'live' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">

                        {/* LEFT COLUMN (7/12) - LIVE QUESTION CREATOR & REAL-TIME RESPONSES */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* CURRENT LIVE QUESTION CREATOR & BROADCASTER */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 md:p-7 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.35)] space-y-5">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-cyan-900/60 pb-4">
                                    <div>
                                        <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase font-bold block mb-1">
                                            CURRENT CLASS ACTIVITY:
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wide">
                                            Dynamic Live Question Broadcaster
                                        </h2>
                                    </div>

                                    {/* Question Response Type Selector */}
                                    <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-cyan-500/40 text-xs font-bold gap-1">
                                        <button 
                                            onClick={() => setQuestionType('alternatives')}
                                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${questionType === 'alternatives' ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Multiple Choice
                                        </button>
                                        <button 
                                            onClick={() => setQuestionType('true_false')}
                                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${questionType === 'true_false' ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            True / False
                                        </button>
                                        <button 
                                            onClick={() => setQuestionType('written')}
                                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${questionType === 'written' ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Open Response
                                        </button>
                                    </div>
                                </div>

                                {/* LIVE QUESTION PROMPT CARD */}
                                <div className="bg-slate-900/90 p-5 md:p-6 rounded-2xl border-2 border-cyan-500/50 space-y-4 font-mono">
                                    <div className="flex items-center justify-between text-sm text-cyan-300 font-bold">
                                        <span className="font-orbitron font-extrabold text-white">LIVE QUESTION BROADCAST PROMPT</span>
                                        <span className="text-xs bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-500 text-cyan-300 font-black uppercase tracking-wider">
                                            {questionType === 'alternatives' ? 'MULTIPLE CHOICE' : questionType === 'true_false' ? 'TRUE / FALSE' : 'OPEN RESPONSE'}
                                        </span>
                                    </div>

                                    {/* Question Text Input */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase block">Question Prompt Text *</label>
                                        <textarea
                                            value={questionText}
                                            onChange={e => setQuestionText(e.target.value)}
                                            placeholder="Type your question prompt for the class (e.g. What is the correct syntax for declaring a variable in Ryo-Script?)..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 outline-none focus:border-cyan-400 min-h-[90px] resize-none font-mono"
                                        />
                                    </div>

                                    {/* Multiple Choice Options Input */}
                                    {questionType === 'alternatives' && (
                                        <div className="space-y-2 pt-1">
                                            <label className="text-xs text-cyan-300 font-bold uppercase block">Multiple Choice Options (A, B, C, D):</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-cyan-200">
                                                {options.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                                                        <span className="font-bold text-cyan-400 w-5">{String.fromCharCode(65 + idx)})</span>
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={e => {
                                                                const updated = [...options];
                                                                updated[idx] = e.target.value;
                                                                setOptions(updated);
                                                            }}
                                                            className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
                                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Limit & Timer Control */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm text-slate-300 pt-3 border-t border-slate-800 font-mono">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">⏱️ Question Timer Limit:</span>
                                            <select
                                                value={timer}
                                                onChange={e => setTimer(Number(e.target.value))}
                                                className="bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-1.5 text-cyan-300 font-bold font-orbitron outline-none cursor-pointer"
                                            >
                                                <option value={15}>15 Seconds</option>
                                                <option value={30}>30 Seconds</option>
                                                <option value={45}>45 Seconds</option>
                                                <option value={60}>60 Seconds</option>
                                                <option value={90}>90 Seconds</option>
                                                <option value={120}>120 Seconds (2 min)</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setTimer(prev => Math.max(15, prev - 15))}
                                                className="px-2.5 py-1 bg-slate-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold rounded-lg cursor-pointer"
                                            >
                                                -15s
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTimer(prev => prev + 15)}
                                                className="px-2.5 py-1 bg-slate-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold rounded-lg cursor-pointer"
                                            >
                                                +15s
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* GLOWING NEON BROADCAST BUTTON */}
                                <button
                                    onClick={handleLaunchLiveQuestion}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-extrabold text-sm md:text-base tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>🚀</span>
                                    <span>LAUNCH LIVE QUESTION TO ALL STUDENTS</span>
                                </button>
                            </div>

                            {/* REAL-TIME RESPONSES CHART */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-orbitron font-extrabold text-white tracking-wider uppercase">
                                        REAL-TIME STUDENT RESPONSES
                                    </h3>
                                    <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700">
                                        {liveResponsesList.length} Responses Received
                                    </span>
                                </div>

                                {latestStudentResponse && (
                                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs font-mono text-emerald-200 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                                        <span className="font-bold">✓ Latest Student Answer Received:</span>
                                        <span className="text-white font-black">{latestStudentResponse.studentName} ({latestStudentResponse.course}) selected Option {latestStudentResponse.optionId}</span>
                                    </div>
                                )}

                                {comprehensionPulse && (
                                    <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-xs font-mono text-cyan-200 flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-bold">✓ Student Comprehension Pulse:</span>
                                        <span className="text-cyan-300 font-black">{comprehensionPulse.studentName}: {comprehensionPulse.level}</span>
                                    </div>
                                )}

                                <div className="h-60 w-full pt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={LIVE_RESPONSE_DATA}>
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#06b6d4', borderRadius: '12px', color: '#cffaff', fontSize: '12px' }}
                                            />
                                            <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                                                {LIVE_RESPONSE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : index === 1 ? '#38bdf8' : '#34d399'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN (5/12) - ENLARGED, HIGH-CONTRAST SESSION CONFIGURATION & FOCUS CONTROL */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* SECTION 1: SESSION CONFIGURATION */}
                            <div className="bg-slate-950/95 border-2 border-cyan-400 p-6 rounded-3xl shadow-2xl space-y-4 font-mono">
                                <h3 className="text-sm font-orbitron font-extrabold text-cyan-300 tracking-wider uppercase border-b border-cyan-900/60 pb-3 flex items-center justify-between">
                                    <span>SECTION 1: SESSION CONFIGURATION</span>
                                    <span className="text-xs text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-700">ACTIVE</span>
                                </h3>

                                <div className="grid grid-cols-1 gap-3 text-xs md:text-sm">
                                    {/* 1. ACTIVE DISPLAY MODE */}
                                    <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                                        <span className="text-slate-400 font-bold block uppercase text-[11px]">ACTIVE DISPLAY MODE:</span>
                                        <select
                                            value={activeMode}
                                            onChange={e => setActiveMode(e.target.value)}
                                            className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-2.5 text-cyan-300 font-bold text-xs md:text-sm outline-none cursor-pointer"
                                        >
                                            <option value="Projector / Desktop">🖥️ Projector / Desktop Arena</option>
                                            <option value="Smart TV Arena">📺 Smart TV Classroom Arena</option>
                                            <option value="Mobile Peer Groups">📱 Mobile Peer Groups</option>
                                        </select>
                                    </div>

                                    {/* 2. GROUP SIZE */}
                                    <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                                        <span className="text-slate-400 font-bold block uppercase text-[11px]">GROUP FORMATION SIZE:</span>
                                        <select
                                            value={groupSize}
                                            onChange={e => setGroupSize(e.target.value)}
                                            className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-2.5 text-cyan-300 font-bold text-xs md:text-sm outline-none cursor-pointer"
                                        >
                                            <option value="3 Groups of 4 Students">👥 3 Groups of 4 Students (Squad Alfa)</option>
                                            <option value="4 Groups of 6 Students">👥 4 Groups of 6 Students (Extended)</option>
                                            <option value="Individual PAES / SAT Mode">👤 Individual PAES / SAT Mode</option>
                                        </select>
                                    </div>

                                    {/* 3. SESSION TIMER */}
                                    <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                                        <span className="text-slate-400 font-bold block uppercase text-[11px]">GLOBAL SESSION TIMER:</span>
                                        <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-cyan-500/50">
                                            <span className="text-cyan-300 font-bold font-orbitron text-sm">{timer} Seconds</span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => setTimer(prev => Math.max(15, prev - 15))}
                                                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold rounded-lg text-xs cursor-pointer"
                                                >
                                                    -15s
                                                </button>
                                                <button
                                                    onClick={() => setTimer(prev => prev + 15)}
                                                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold rounded-lg text-xs cursor-pointer"
                                                >
                                                    +15s
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* GOOGLE WORKSPACE API INTEGRATION */}
                            <div className="bg-slate-950/95 border-2 border-emerald-500/80 p-6 rounded-3xl shadow-xl space-y-4 font-mono">
                                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                                    <h3 className="text-sm font-orbitron font-extrabold text-emerald-300 tracking-wider uppercase flex items-center gap-2">
                                        <span>🌐 Google Workspace Integrations</span>
                                    </h3>
                                    <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-700 px-3 py-1 rounded-full font-bold">
                                        {googleConnected ? '● CONNECTED' : '○ DISCONNECTED'}
                                    </span>
                                </div>

                                {googleStatusMsg && (
                                    <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 font-bold leading-relaxed">
                                        {googleStatusMsg}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                                    {/* 1. Google Classroom Connect */}
                                    <button
                                        onClick={handleGoogleClassroomConnect}
                                        className="p-3.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 rounded-2xl text-left transition space-y-1 cursor-pointer"
                                    >
                                        <span className="block text-[11px] font-bold text-emerald-400 uppercase font-orbitron">1. CLASSROOM API</span>
                                        <strong className="block text-xs text-white">Connect Classroom</strong>
                                        <span className="block text-[10px] text-slate-400">Import Roster to Supabase</span>
                                    </button>

                                    {/* 2. Google Drive PDF Export */}
                                    <button
                                        onClick={handleExportPDFToGoogleDrive}
                                        className="p-3.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded-2xl text-left transition space-y-1 cursor-pointer"
                                    >
                                        <span className="block text-[11px] font-bold text-cyan-400 uppercase font-orbitron">2. DRIVE EXPORT</span>
                                        <strong className="block text-xs text-white">Export PDF Reports</strong>
                                        <span className="block text-[10px] text-slate-400">Upload to Shared Drive</span>
                                    </button>

                                    {/* 3. Google Calendar Sync */}
                                    <button
                                        onClick={handleSyncGoogleCalendar}
                                        className="p-3.5 bg-fuchsia-950/80 hover:bg-fuchsia-900 border border-fuchsia-500/50 rounded-2xl text-left transition space-y-1 cursor-pointer"
                                    >
                                        <span className="block text-[11px] font-bold text-fuchsia-400 uppercase font-orbitron">3. CALENDAR TIMER</span>
                                        <strong className="block text-xs text-white">Sync Class Schedule</strong>
                                        <span className="block text-[10px] text-slate-400">Prep Focus Session</span>
                                    </button>
                                </div>
                            </div>

                            {/* SECTION 2: CLASSROOM STATUS & FORCE FOCUS MODE */}
                            <div className="bg-slate-950/95 border-2 border-cyan-400 p-6 rounded-3xl shadow-xl space-y-4 font-mono">
                                <div className="flex justify-between items-center border-b border-cyan-900/60 pb-3">
                                    <h3 className="text-sm font-orbitron font-extrabold text-cyan-300 tracking-wider uppercase">
                                        SECTION 2: CLASSROOM STATUS & FOCUS MODE
                                    </h3>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800 animate-pulse">
                                        ● LIVE AUDIT
                                    </span>
                                </div>

                                {/* SYNCHRONIZED FOCUS MODE MASTER TOGGLE */}
                                <div className="p-4 bg-cyan-950/50 border-2 border-cyan-500/60 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-extrabold text-cyan-300 font-orbitron uppercase">📱 MOBILE FOCUS MODE (AULOCK NFC CASE)</span>
                                        <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700">
                                            24/26 FOCUSED
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleToggleForceFocusMode}
                                        className={`w-full py-3.5 rounded-xl font-orbitron font-black text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider ${
                                            isForceFocusActive
                                                ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-2 border-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                                                : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 border-2 border-emerald-300 shadow-[0_0_25px_rgba(56,235,203,0.8)] hover:scale-[1.01]'
                                        }`}
                                    >
                                        <span>{isForceFocusActive ? '⛔ RELEASE CLASSWIDE FOCUS MODE' : '🚀 FORCE CLASSWIDE FOCUS MODE'}</span>
                                    </button>
                                </div>

                                {/* ATTENTION METRICS & VISIBILITY DISTRACTIONS */}
                                <div className="space-y-2.5 text-xs md:text-sm">
                                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                                        <span className="text-slate-300 font-bold">Mobile Device Connection:</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 bg-slate-950 h-3 rounded-full overflow-hidden border border-emerald-500/40">
                                                <div className="bg-emerald-400 h-full w-[100%]" />
                                            </div>
                                            <strong className="text-emerald-400 font-mono font-black">100%</strong>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                                        <span className="text-slate-300 font-bold">Class Attention Index:</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 bg-slate-950 h-3 rounded-full overflow-hidden border border-cyan-500/40">
                                                <div className="bg-cyan-400 h-full w-[92%]" />
                                            </div>
                                            <strong className="text-cyan-300 font-mono font-black">92%</strong>
                                        </div>
                                    </div>

                                    {/* DISTRACTION ALERTS (VISIBILITY API) */}
                                    <div className="bg-rose-950/40 border border-rose-900/80 p-3.5 rounded-xl space-y-2">
                                        <p className="text-xs text-rose-400 font-orbitron font-extrabold uppercase">🚨 DISTRACTION ALERTS DETECTED (VISIBILITY API):</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-white font-bold">• Juan Carlos Pérez</span>
                                            <span className="text-rose-400 font-mono font-bold">2 tab exits (-30 PS)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-white font-bold">• Mateo Rojas</span>
                                            <span className="text-rose-400 font-mono font-bold">1 tab exit (-15 PS)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: COEXISTENCE NEXUS & TEACHER CONTROL PANEL */}
                            <div className="bg-slate-950/95 border-2 border-cyan-400 p-6 rounded-3xl shadow-xl space-y-4 font-mono">
                                <h3 className="text-sm font-orbitron font-extrabold text-white tracking-wider uppercase border-b border-cyan-900/60 pb-3">
                                    SECTION 3: COEXISTENCE NEXUS & AGORA
                                </h3>

                                <div className="bg-slate-900 p-4 rounded-2xl border border-cyan-500/40 space-y-3 text-center">
                                    <h4 className="text-xs font-orbitron font-extrabold text-cyan-300 uppercase tracking-wider">
                                        TEACHER CONTROL PANEL (GM ROLE)
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                        <button 
                                            onClick={() => alert("🛡️ Resistance Protocol Code activated for peer group.")}
                                            className="py-3 px-3 rounded-2xl border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition cursor-pointer"
                                        >
                                            RESISTANCE PROTOCOL CODE
                                        </button>
                                        <button 
                                            onClick={() => alert("⚠️ Coexistence incident reported to School Leadership.")}
                                            className="py-3 px-3 rounded-2xl border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition cursor-pointer"
                                        >
                                            REPORT INCIDENT
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => alert("🧠 Consulting MINEDUC Associated Master Teacher AI System...")}
                                        className="w-full py-3 px-3 rounded-2xl border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition mt-2 cursor-pointer"
                                    >
                                        CONSULT ASSOCIATED TEACHER
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                )}

                {/* ==================== PESTAÑA 2: 2. EVALUACIONES (NOTEBOOKLLM & RÚBRICAS IA) ==================== */}
                {activeTab === 'evaluations' && (
                    <div className="space-y-8 animate-in fade-in duration-300 font-mono">
                        
                        {/* NOTEBOOKLLM STUDIO & SLIDE BROADCASTER */}
                        <div className="bg-slate-950/90 border-2 border-fuchsia-500/80 p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(217,70,239,0.3)] space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-fuchsia-900/60 pb-4">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-fuchsia-400 bg-fuchsia-950 px-3 py-1 rounded-full border border-fuchsia-600">
                                        NOTEBOOKLLM PRESENTATION STUDIO
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-orbitron font-extrabold text-white mt-2">
                                        Estructurador Didáctico de Diapositivas IA
                                    </h2>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <input
                                        type="text"
                                        value={nextClassTopic}
                                        onChange={e => setNextClassTopic(e.target.value)}
                                        className="bg-slate-900 border border-fuchsia-500/40 text-xs text-slate-100 px-3.5 py-2.5 rounded-xl outline-none w-full sm:w-64"
                                        placeholder="Tema a presentar..."
                                    />
                                    <button
                                        onClick={handleGenerateNotebookPresentation}
                                        disabled={generatingPresentation}
                                        className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 disabled:opacity-50"
                                    >
                                        <Sparkles className={`w-4 h-4 text-amber-300 ${generatingPresentation ? 'animate-spin' : ''}`} />
                                        <span>{generatingPresentation ? 'Generando...' : '🎬 Generar Deck NotebookLLM'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* CANVA SLIDE STUDIO */}
                            {presentationDeck && currentSlide ? (
                                <div className="bg-slate-900 p-6 rounded-2xl border border-fuchsia-500/40 space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-fuchsia-300 font-bold bg-fuchsia-950 px-3 py-1 rounded-full border border-fuchsia-800 uppercase">
                                            {currentSlide.tag}
                                        </span>
                                        <span className="text-slate-400">
                                            Diapositiva {currentSlideIndex + 1} de {presentationDeck.slides.length}
                                        </span>
                                    </div>

                                    <h4 className="text-lg md:text-xl font-orbitron font-bold text-white">
                                        {currentSlide.headline}
                                    </h4>

                                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                        {currentSlide.body}
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-3">
                                        <button
                                            onClick={handleToggleAudioOverview}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                                                isPlayingAudio ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-950 text-amber-300 border border-slate-800'
                                            }`}
                                        >
                                            <Volume2 className="w-4 h-4" />
                                            <span>{isPlayingAudio ? '▶️ Audio en vivo...' : '🎧 Resumen Audio NotebookLLM'}</span>
                                        </button>

                                        <button
                                            onClick={handleProjectSlideToStudents}
                                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow"
                                        >
                                            <Radio className="w-4 h-4 animate-pulse" />
                                            <span>{isProjecting ? '✓ Proyectado en Alumnos' : '📡 Proyectar a Alumnos'}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center italic py-4">
                                    Presiona "Generar Deck NotebookLLM" para crear automáticamente una presentación didáctica de 4 láminas.
                                </p>
                            )}
                        </div>

                        {/* EVALUADOR SUMATIVO DE RÚBRICAS IA MINEDUC */}
                        <div className="bg-slate-950/90 border-2 border-fuchsia-500/80 p-6 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-base font-orbitron font-extrabold text-white uppercase">
                                EVALUADOR FORMATIVO & SUMATIVO DE RÚBRICAS MINEDUC
                            </h3>

                            <textarea
                                value={summativeStudentWork}
                                onChange={e => setSummativeStudentWork(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:border-fuchsia-400 font-mono"
                                placeholder="Pega aquí la respuesta o ensayo entregado por el estudiante..."
                            />

                            <button
                                onClick={handleEvaluateSummative}
                                disabled={isEvaluatingSummative}
                                className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                            >
                                {isEvaluatingSummative ? 'Evaluando...' : '🤖 Evaluar Trabajo con Rúbrica MINEDUC'}
                            </button>

                            {summativeEvalResult && (
                                <div className="bg-slate-900 p-5 rounded-2xl border border-fuchsia-500/40 text-xs text-slate-200 space-y-2">
                                    <h4 className="font-bold text-fuchsia-300 uppercase">Resultado de Evaluación Rúbrica:</h4>
                                    <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-cyan-200">
                                        {JSON.stringify(summativeEvalResult, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* TABLA HISTORIAL DE EVALUACIONES */}
                        <div className="bg-slate-950/90 border-2 border-fuchsia-500/80 p-6 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-base font-orbitron font-extrabold text-white uppercase">
                                HISTORIAL DE ÚLTIMAS EVALUACIONES
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase border-b border-slate-800">
                                        <tr>
                                            <th className="p-3">EVALUACIÓN</th>
                                            <th className="p-3">FECHA</th>
                                            <th className="p-3">CURSO</th>
                                            <th className="p-3">PROMEDIO GRUPO</th>
                                            <th className="p-3">TASA LOGRO %</th>
                                            <th className="p-3">MEJOR DESEMPEÑO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {INITIAL_EVALUATIONS.map(ev => (
                                            <tr key={ev.id} className="hover:bg-slate-900/60">
                                                <td className="p-3 font-bold text-white">{ev.title}</td>
                                                <td className="p-3 text-slate-400">{ev.date}</td>
                                                <td className="p-3 text-fuchsia-300">{ev.course}</td>
                                                <td className="p-3 font-black text-amber-300">{ev.averageGrade}</td>
                                                <td className="p-3 font-bold text-emerald-400">{ev.passRate}</td>
                                                <td className="p-3 text-slate-300">{ev.topStudent}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

                {/* ==================== PESTAÑA 3: 3. SQUADS & TEAMS ==================== */}
                {activeTab === 'squads' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <TeacherSquadManager />
                    </div>
                )}

                {/* ==================== PESTAÑA 4: 4. REPORTES (RADAR & BIENESTAR) ==================== */}
                {activeTab === 'reports' && (
                    <div className="space-y-8 animate-in fade-in duration-300 font-mono">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <HumanCoreRadar data={{ logic: 92, communication: 88, naturalSciences: 55, humanities: 78, creativity: 85, resilience: 80 }} />
                            </div>
                            <div className="h-[380px]">
                                <WellnessAlertsPanel />
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== PESTAÑA 4: 4. NEXO CONVIVENCIA (ÁGORA, MBE & SQUADS) ==================== */}
                {activeTab === 'nexo' && (
                    <div className="space-y-8 animate-in fade-in duration-300 font-mono">
                        {/* ÁGORA DE CONVIVENCIA ESCOLAR */}
                        <section className="bg-slate-950/90 border-2 border-sky-400/80 p-6 rounded-3xl shadow-xl">
                            <ClassroomArena isTeacher={true} />
                        </section>

                        {/* MBE MINEDUC ADVISORY */}
                        <div className="bg-slate-950/90 border-2 border-sky-400/80 p-6 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-base font-orbitron font-extrabold text-white uppercase">
                                ASESORÍA PEDAGÓGICA IA (MARCO BUENA ENSEÑANZA MINEDUC)
                            </h3>

                            <textarea
                                value={teacherChallenge}
                                onChange={e => setTeacherChallenge(e.target.value)}
                                rows={2}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 outline-none focus:border-sky-400 font-mono"
                            />

                            <button
                                onClick={handleGenerateMbePlan}
                                disabled={isGeneratingMbePlan}
                                className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                            >
                                {isGeneratingMbePlan ? 'Generando Asesoría...' : '🧠 Obtener Sugerencia Pedagógica MBE MINEDUC'}
                            </button>

                            {mbePlanResult && (
                                <div className="bg-slate-900 p-5 rounded-2xl border border-sky-500/40 text-xs text-sky-200 space-y-2">
                                    <h4 className="font-bold text-sky-300 uppercase">Plan Sugerido MBE:</h4>
                                    <p className="whitespace-pre-line leading-relaxed font-sans">{mbePlanResult}</p>
                                </div>
                            )}
                        </div>

                        {/* GESTIÓN DE SQUADS */}
                        <TeacherSquadManager />
                    </div>
                )}

                {/* ==================== PESTAÑA 5: 5. AJUSTES (NOTAS & ARCHIVOS) ==================== */}
                {activeTab === 'settings' && (
                    <div className="space-y-8 animate-in fade-in duration-300 font-mono">
                        {/* BLOC DE NOTAS PROFESOR */}
                        <div className="bg-slate-950/90 border-2 border-amber-500/80 p-6 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-base font-orbitron font-extrabold text-white uppercase">
                                APUNTES & BLOC DE NOTAS PERSISTENTE DEL DOCENTE
                            </h3>

                            <textarea
                                value={teacherNotes}
                                onChange={e => handleSaveTeacherNotes(e.target.value)}
                                rows={6}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-amber-200 outline-none focus:border-amber-400 font-mono"
                            />
                        </div>

                        {/* REPOSITORIO ARCHIVOS COMPARTIDOS */}
                        <div className="bg-slate-950/90 border-2 border-amber-500/80 p-6 rounded-3xl shadow-xl space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-orbitron font-extrabold text-white uppercase">
                                    REPOSITORIO DE ARCHIVOS COMPARTIDOS
                                </h3>

                                <button
                                    onClick={() => alert("📁 Selecciona un archivo PDF / PPTX para compartir con el grupo.")}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition"
                                >
                                    + Subir Archivo
                                </button>
                            </div>

                            <div className="space-y-2">
                                {sharedFiles.map(file => (
                                    <div key={file.id} className="flex justify-between items-center bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs">
                                        <div>
                                            <strong className="text-white block">{file.name}</strong>
                                            <span className="text-slate-400 text-[10px]">{file.size} • {file.date}</span>
                                        </div>
                                        <button
                                            onClick={() => alert(`Descargando ${file.name}...`)}
                                            className="px-3 py-1.5 bg-slate-950 border border-amber-500/60 text-amber-300 font-bold rounded-xl hover:bg-amber-950 transition"
                                        >
                                            Descargar ⬇️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* 🔴 BARRA DE ACCIÓN FIJA INFERIOR DOCENTE */}
            <TeacherActionBar />
        </div>
    );
}
