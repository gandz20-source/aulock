import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { generateLessonPlan, generateNotebookPresentation, generateTeacherImprovementSuggestion, evaluateSummativeWithMineducRubric } from '../services/GeminiService';
import { MINEDUC_EVALUATION_DATASET } from '../data/AuLockMineducEvaluationDataset';
import { MINEDUC_ACTIVITIES_REGISTRY } from '../data/AuLockMineducActivitiesDataset';
import HumanCoreRadar from '../components/HumanCoreRadar';
import WellnessAlertsPanel from '../components/WellnessAlertsPanel';
import TeacherActivityPublisher from '../components/TeacherActivityPublisher';
import ClassroomArena from '../components/arena/ClassroomArena';
import TeacherHeaderNav from '../components/hud/TeacherHeaderNav';
import TeacherActionBar from '../components/hud/TeacherActionBar';
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

    // Live Question Launcher
    const [questionType, setQuestionType] = useState('multiple_choice');
    const [questionText, setQuestionText] = useState('¿Cuál es la sintaxis correcta para definir una variable en Ryo-Script?');
    const [timer, setTimer] = useState(45);
    const [options, setOptions] = useState(['var x = 10', 'let x = 10', 'const x: 10']);
    const [correctAnswer, setCorrectAnswer] = useState('let x = 10');

    const handleLaunchLiveQuestion = () => {
        const payload = {
            type: "NEW_QUESTION",
            data: {
                question: questionText || "¿Cuál es la sintaxis correcta para definir una variable en Ryo-Script?",
                options: questionType === 'multiple_choice' || questionType === 'alternatives' ? options : [],
                type: questionType,
                timeLimit: timer,
                correct_answer: correctAnswer
            }
        };

        const legacyQuestion = {
            id: 'q-' + Date.now(),
            text: payload.data.question,
            question_type: questionType,
            options: payload.data.options,
            correct_answer: correctAnswer,
            timer_seconds: timer,
            launched_at: new Date().toISOString()
        };

        localStorage.setItem('aulock_active_question_event', JSON.stringify(payload));
        localStorage.setItem('aulock_active_question', JSON.stringify(legacyQuestion));
        window.dispatchEvent(new Event('storage'));
        alert(`🚀 Pregunta de Ryo-Script (Tiempo límite: ${timer}s) enviada en vivo a la pantalla de todos los alumnos.`);
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

    const currentSlide = presentationDeck?.slides?.[currentSlideIndex];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 md:p-6 pb-28 selection:bg-cyan-900">
            
            {/* 🔴 CABECERA Y NAVEGACIÓN DOCENTE HUD (Exacto a la referencia visual) */}
            <div className="max-w-7xl mx-auto">
                <TeacherHeaderNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* 🔴 CONTENIDO PRINCIPAL SEGÚN PESTAÑA HUD SELECCIONADA */}
            <main className="max-w-7xl mx-auto space-y-8">
                
                {/* ==================== PESTAÑA 1: 1. AULA EN VIVO (DISEÑO EXACTO REFERENCIA) ==================== */}
                {activeTab === 'live' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">

                        {/* COLUMNA IZQUIERDA (7/12) - ACTIVIDAD EN VIVO & GRÁFICOS */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* PANEL ACTIVIDAD ACTUAL */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-cyan-900/60 pb-3">
                                    <div>
                                        <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block">
                                            ACTIVIDAD ACTUAL:
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wide">
                                            Aula en Vivo Dinámica con Múltiples Tipos de Respuesta
                                        </h2>
                                    </div>

                                    {/* Selector de Tipo de Respuesta */}
                                    <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-cyan-500/40 text-[10px] font-bold gap-1">
                                        <button 
                                            onClick={() => setQuestionType('alternatives')}
                                            className={`px-2 py-1 rounded-xl transition ${questionType === 'alternatives' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                                        >
                                            Alternativas
                                        </button>
                                        <button 
                                            onClick={() => setQuestionType('true_false')}
                                            className={`px-2 py-1 rounded-xl transition ${questionType === 'true_false' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                                        >
                                            V/F
                                        </button>
                                        <button 
                                            onClick={() => setQuestionType('written')}
                                            className={`px-2 py-1 rounded-xl transition ${questionType === 'written' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                                        >
                                            Desarrollo
                                        </button>
                                    </div>
                                </div>

                                {/* TARJETA DE PREGUNTA EN VIVO 5/15 */}
                                <div className="bg-slate-900/90 p-5 rounded-2xl border border-cyan-500/40 space-y-3 font-mono">
                                    <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                                        <span>PREGUNTA 5/15</span>
                                        <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500 text-cyan-200 uppercase">
                                            {questionType}
                                        </span>
                                    </div>

                                    <textarea
                                        value={questionText}
                                        onChange={e => setQuestionText(e.target.value)}
                                        placeholder="Observar y describir el comportamiento humano de forma segura..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-cyan-400 min-h-[90px] resize-none"
                                    />

                                    {questionType === 'alternatives' && (
                                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-cyan-200 pt-1">
                                            {options.map((opt, idx) => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => {
                                                        const updated = [...options];
                                                        updated[idx] = e.target.value;
                                                        setOptions(updated);
                                                    }}
                                                    className="p-2 bg-slate-950 rounded-xl border border-slate-800 outline-none focus:border-cyan-400"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                                        <span>Time límites: 
                                            <input
                                                type="number"
                                                value={timer}
                                                onChange={e => setTimer(Number(e.target.value))}
                                                className="w-14 bg-slate-950 text-cyan-300 font-mono font-bold text-center border border-slate-800 rounded mx-1.5 p-0.5"
                                            />
                                            segundos
                                        </span>
                                    </div>
                                </div>

                                {/* BOTÓN NEÓN LANZAR PREGUNTA */}
                                <button
                                    onClick={handleLaunchLiveQuestion}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-extrabold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all hover:scale-[1.01]"
                                >
                                    LANZAR PREGUNTA A TODOS LOS ALUMNOS
                                </button>
                            </div>

                            {/* PANEL RESPUESTAS EN TIEMPO REAL CON GRÁFICO RECHARTS */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                                <h3 className="text-base font-orbitron font-extrabold text-white tracking-wider uppercase">
                                    RESPUESTAS EN TIEMPO REAL
                                </h3>

                                <div className="h-60 w-full pt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={LIVE_RESPONSE_DATA}>
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#06b6d4', borderRadius: '12px', color: '#cffaff', fontSize: '11px' }}
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

                        {/* COLUMNA DERECHA (5/12) - CONFIGURACIÓN, ESTADO Y NEXO */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* SECCIÓN 1: CONFIGURACIÓN DE SESIÓN */}
                            <div className="bg-slate-950/90 border-2 border-cyan-500/60 p-5 rounded-3xl shadow-xl space-y-3 font-mono">
                                <h3 className="text-xs font-orbitron font-extrabold text-cyan-300 tracking-wider uppercase border-b border-cyan-900/60 pb-2">
                                    SECCIÓN 1: CONFIGURACIÓN DE SESIÓN
                                </h3>

                                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                                    <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
                                        <span className="text-slate-400 block mb-0.5">MODO ACTIVO</span>
                                        <strong className="text-cyan-300 font-mono text-xs">(Proyector/Escritorio)</strong>
                                    </div>
                                    <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
                                        <span className="text-slate-400 block mb-0.5">TAMAÑO DE GRUPO</span>
                                        <strong className="text-cyan-300 font-mono text-xs">(3 grupos de 4 alumnos)</strong>
                                    </div>
                                    <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
                                        <span className="text-slate-400 block mb-0.5">TEMPORIZADOR</span>
                                        <strong className="text-cyan-300 font-mono text-xs">(5 min)</strong>
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 2: ESTADO DEL AULA, GRUPOS & SEMÁFORO MODO ENFOQUE */}
                            <div className="bg-slate-950/90 border-2 border-cyan-500/60 p-5 rounded-3xl shadow-xl space-y-4 font-mono">
                                <div className="flex justify-between items-center border-b border-cyan-900/60 pb-2">
                                    <h3 className="text-xs font-orbitron font-extrabold text-cyan-300 tracking-wider uppercase">
                                        SECCIÓN 2: ESTADO DEL AULA & MODO ENFOQUE
                                    </h3>
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 animate-pulse">
                                        ● AUDITORÍA DE PANTALLA EN VIVO
                                    </span>
                                </div>

                                {/* CONTROL MAESTRO DE MODO ENFOQUE DEL PROFESOR */}
                                <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/50 rounded-2xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-cyan-300 font-orbitron uppercase">📱 MODO ENFOQUE MÓVIL (AULOCK FOCUS)</span>
                                        <span className="text-[10px] text-emerald-400 font-bold">24/26 ALUMNOS ENFOCADOS</span>
                                    </div>
                                    <button
                                        onClick={() => alert("🚀 Señal enviada a los 26 celulares del curso: ¡Modo Enfoque Forzado Activado!")}
                                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-orbitron font-black text-xs rounded-xl shadow-[0_0_15px_rgba(56,235,203,0.4)] hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                                    >
                                        <span>🚀 FORZAR MODO ENFOQUE EN TODO EL CURSO</span>
                                    </button>
                                </div>

                                {/* SEMÁFORO DE ATENCIÓN Y SALIDAS DETECTADAS (VISIBILITY API) */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                        <span className="text-slate-300">Conexión Celulares:</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-emerald-500/40">
                                                <div className="bg-emerald-400 h-full w-[100%]" />
                                            </div>
                                            <strong className="text-emerald-400 font-mono">100%</strong>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                        <span className="text-slate-300">Índice de Atención en Clase:</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/40">
                                                <div className="bg-cyan-400 h-full w-[92%]" />
                                            </div>
                                            <strong className="text-cyan-300 font-mono">92%</strong>
                                        </div>
                                    </div>

                                    {/* ALUMNOS DISTRAÍDOS / SALIDAS REGISTRADAS */}
                                    <div className="bg-rose-950/30 border border-rose-900/70 p-3 rounded-xl space-y-1">
                                        <p className="text-[10px] text-rose-400 font-orbitron font-bold uppercase">🚨 ALERTAS DE DISTRACCIÓN DETECTADAS (VISIBILITY API):</p>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-white font-bold">• Juan Carlos Pérez</span>
                                            <span className="text-rose-400 font-mono font-bold">2 salidas (-30 PS)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-white font-bold">• Mateo Rojas</span>
                                            <span className="text-rose-400 font-mono font-bold">1 salida (-15 PS)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                                    <div className="grid grid-cols-2 bg-slate-950 p-2.5 font-bold text-slate-400 border-b border-slate-800">
                                        <span>Grupo STEM</span>
                                        <span className="text-right">Distracciones</span>
                                    </div>
                                    <div className="divide-y divide-slate-800/60">
                                        <div className="grid grid-cols-2 p-2.5 text-slate-300">
                                            <span>Grupo 1 (Alfa)</span>
                                            <span className="text-right text-emerald-400 font-mono font-bold">0 Salidas</span>
                                        </div>
                                        <div className="grid grid-cols-2 p-2.5 text-slate-300">
                                            <span>Grupo 2 (Beta)</span>
                                            <span className="text-right text-rose-400 font-mono font-bold">2 Salidas</span>
                                        </div>
                                        <div className="grid grid-cols-2 p-2.5 text-slate-300">
                                            <span>Grupo 3 (Gamma)</span>
                                            <span className="text-right text-emerald-400 font-mono font-bold">0 Salidas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 3: NEXO: ÁGORA DE CONVIVENCIA ESCOLAR */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-5 rounded-3xl shadow-[0_0_25px_rgba(6,182,212,0.3)] space-y-4 font-mono">
                                <h3 className="text-xs font-orbitron font-extrabold text-white tracking-wider uppercase border-b border-cyan-900/60 pb-2">
                                    SECCIÓN 3: NEXO: ÁGORA DE CONVIVENCIA ESCOLAR
                                </h3>

                                <div className="bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/40 space-y-3 text-center">
                                    <h4 className="text-xs font-orbitron font-bold text-cyan-300 uppercase">
                                        Panel de Control (GM Docente)
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                        <button 
                                            onClick={() => alert("🛡️ Código Resistencia activado para el grupo.")}
                                            className="py-2.5 px-3 rounded-2xl border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition"
                                        >
                                            CÓDIGO RESISTENCIA
                                        </button>
                                        <button 
                                            onClick={() => alert("⚠️ Incidente de convivencia reportado a Dirección.")}
                                            className="py-2.5 px-3 rounded-2xl border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition"
                                        >
                                            REPORTAR INCIDENTE
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => alert("🧠 Consultando Maestro Asociados MINEDUC...")}
                                        className="w-full py-2.5 px-3 rounded-2xl border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition mt-2"
                                    >
                                        CONSULTAR MAESTRO ASOCIADOS
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

                {/* ==================== PESTAÑA 3: 3. REPORTES (RADAR & BIENESTAR) ==================== */}
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
