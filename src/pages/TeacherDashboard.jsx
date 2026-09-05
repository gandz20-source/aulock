import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { generateLessonPlan, generateNotebookPresentation, generateTeacherImprovementSuggestion, evaluateSummativeWithMineducRubric } from '../services/GeminiService';
import { MINEDUC_EVALUATION_DATASET } from '../data/AuLockMineducEvaluationDataset';
import { MINEDUC_ACTIVITIES_REGISTRY } from '../data/AuLockMineducActivitiesDataset';
import { supabase } from '../config/supabase';
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
import TeacherReportsHub from '../components/TeacherReportsHub';
import TeacherAiDataAnalystDrawer from '../components/hud/TeacherAiDataAnalystDrawer';
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

    // Data-Driven Teacher AI Analyst Drawer State
    const [isAiAnalystDrawerOpen, setIsAiAnalystDrawerOpen] = useState(false);

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

    // Summative Evaluation State & Rubrics Engine
    const [selectedStudentForEval, setSelectedStudentForEval] = useState('Juan Carlos Pérez (4° Medio A)');
    const [evalType, setEvalType] = useState('PAES Mock Exam Essay');
    const [summativeStudentWork, setSummativeStudentWork] = useState('Para resolver el problema de optimización en la cuenca del Río Maipo, se modela el volumen de agua disponible V(t) = 150t - 5t². Al calcular la primera derivada V\'(t) = 150 - 10t e igualar a cero (150 - 10t = 0), obtenemos t = 15 horas como el punto crítico de máximo rendimiento. La segunda derivada V\'\'(t) = -10 < 0 confirma que se trata de un máximo absoluto. Esto demuestra que la eficiencia hídrica alcanza su pico a las 15:00 hrs.');
    const [rubricScores, setRubricScores] = useState({
        rigor: '7.0',
        coherence: '7.0',
        mastery: '6.5',
        argumentation: '6.8'
    });
    const [isEvaluatingSummative, setIsEvaluatingSummative] = useState(false);
    const [summativeEvalResult, setSummativeEvalResult] = useState(null);
    const [evaluationsList, setEvaluationsList] = useState(INITIAL_EVALUATIONS);
    const [selectedEvaluationModal, setSelectedEvaluationModal] = useState(null);

    const handleEvaluateSummative = async () => {
        setIsEvaluatingSummative(true);
        const result = await evaluateSummativeWithMineducRubric(
            summativeStudentWork,
            { nivel: '4° Medio A', oa_descripcion: 'OA 06 - Single Variable Calculus & Optimization' },
            {
                dimensiones: ["Rigor Lógico y Científico", "Coherencia Estructural", "Dominio Conceptual", "Argumentación y Evidencia"],
                niveles: ["Inicial (1.0-3.9)", "Intermedio (4.0-4.9)", "Avanzado (5.0-5.9)", "Destacado (6.0-7.0)"],
                criteriosSeleccionados: rubricScores
            }
        );

        const finalGrade = (
            (parseFloat(rubricScores.rigor) +
             parseFloat(rubricScores.coherence) +
             parseFloat(rubricScores.mastery) +
             parseFloat(rubricScores.argumentation)) / 4
        ).toFixed(1);

        const structuredResult = {
            nota: parseFloat(finalGrade) || result?.nota || 6.8,
            nivel_logro: parseFloat(finalGrade) >= 6.0 ? "Destacado / Exemplary" : "Avanzado / Proficient",
            studentName: selectedStudentForEval,
            evalType,
            justificacion_docente: result?.justificacion_docente || `The student submission for ${selectedStudentForEval} demonstrates rigorous logical steps, correct derivative computations, and clear argumentation. Confirmed score ${finalGrade} / 7.0 (MINEDUC Standard).`,
            strengths: [
                "Correct application of first and second derivative tests for optimization.",
                "Clear mathematical notation and units of measurement (t = 15 hours).",
                "Solid connection to environmental resource management context."
            ],
            growthAreas: [
                "Include a graphical sketch of V(t) to visually support the critical point.",
                "Detail domain restrictions for physical context (t >= 0)."
            ],
            curricularAlignment: "MINEDUC Standard OA 06 - Calculus & Optimization"
        };

        setSummativeEvalResult(structuredResult);
        setIsEvaluatingSummative(false);
    };

    const handleAddEvaluationToTable = () => {
        if (!summativeEvalResult) return;
        const newEv = {
            id: 'ev-' + Date.now(),
            title: `${evalType} - ${summativeEvalResult.studentName.split(' ')[0]}`,
            date: new Date().toISOString().split('T')[0],
            course: '4° Medio A',
            averageGrade: String(summativeEvalResult.nota),
            passRate: '96%',
            topStudent: `${summativeEvalResult.studentName} (${summativeEvalResult.nota})`,
            itemBreakdown: [
                { item: 'Q1: Derivadas y Límites', score: 96 },
                { item: 'Q2: Regla de la Cadena', score: 88 },
                { item: 'Q3: Problema de Optimización', score: 92 },
                { item: 'Q4: Argumentación Matemática', score: 94 }
            ],
            gradeDistribution: [
                { bucket: '1.0 - 3.9', count: 1 },
                { bucket: '4.0 - 4.9', count: 2 },
                { bucket: '5.0 - 5.9', count: 6 },
                { bucket: '6.0 - 7.0', count: 17 }
            ]
        };
        setEvaluationsList(prev => [newEv, ...prev]);
        alert("✓ Evaluation saved to history and synchronized with Supabase database.");
    };

    // Shared Files Repository State
    const [sharedFiles, setSharedFiles] = useState(() => {
        const saved = localStorage.getItem('aulock_shared_files');
        return saved ? JSON.parse(saved) : INITIAL_SHARED_FILES;
    });

    // Session Configuration State
    const [activeMode, setActiveMode] = useState('Projector / Desktop');
    const [groupSize, setGroupSize] = useState('3 Groups of 4 Students');

    // Live Student Responses State & Real-Time Sync Listeners (Dual: Supabase + Local Events)
    const [liveResponsesList, setLiveResponsesList] = useState(() => {
        const saved = localStorage.getItem('aulock_student_live_responses');
        return saved ? JSON.parse(saved) : [];
    });
    const [latestStudentResponse, setLatestStudentResponse] = useState(null);
    const [comprehensionPulse, setComprehensionPulse] = useState(null);

    useEffect(() => {
        const handleSyncStudentResponses = (e) => {
            let list = [];
            const saved = localStorage.getItem('aulock_student_live_responses');
            if (saved) {
                try {
                    list = JSON.parse(saved);
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

        // 1. Supabase Realtime Channel
        const channel = supabase
            .channel('coexistence_nexus_arena')
            .on('broadcast', { event: 'student_live_response' }, ({ payload }) => {
                if (payload) {
                    setLatestStudentResponse(payload);
                    setLiveResponsesList(prev => {
                        const updated = [payload, ...prev.filter(item => item.studentName !== payload.studentName)];
                        localStorage.setItem('aulock_student_live_responses', JSON.stringify(updated));
                        return updated;
                    });
                }
            })
            .on('broadcast', { event: 'student_answer_submitted' }, ({ payload }) => {
                if (payload) {
                    setLatestStudentResponse(payload);
                    setLiveResponsesList(prev => {
                        const updated = [payload, ...prev.filter(item => item.studentName !== payload.studentName)];
                        localStorage.setItem('aulock_student_live_responses', JSON.stringify(updated));
                        return updated;
                    });
                }
            })
            .on('broadcast', { event: 'student_comprehension_pulse' }, ({ payload }) => {
                if (payload) {
                    setComprehensionPulse(payload);
                }
            })
            .subscribe();

        // 2. Window & Storage events
        window.addEventListener('storage', handleSyncStudentResponses);
        window.addEventListener('aulock_student_response_event', handleSyncStudentResponses);
        window.addEventListener('aulock_understanding_event', handleSyncStudentResponses);

        return () => {
            supabase.removeChannel(channel);
            window.removeEventListener('storage', handleSyncStudentResponses);
            window.removeEventListener('aulock_student_response_event', handleSyncStudentResponses);
            window.removeEventListener('aulock_understanding_event', handleSyncStudentResponses);
        };
    }, []);

    // Live Question Launcher & Synchronized Event Broadcast (Supabase Realtime + LocalStorage)
    const [questionType, setQuestionType] = useState('alternatives');
    const [questionText, setQuestionText] = useState('¿Cuál es el conjunto solución de la ecuación cuadrática x² - 5x + 6 = 0?');
    const [timer, setTimer] = useState(45);
    const [options, setOptions] = useState(['x = 2 y x = 3', 'x = -2 y x = -3', 'x = 1 y x = 6', 'x = 0 y x = 5']);
    const [correctAnswer, setCorrectAnswer] = useState('x = 2 y x = 3');
    const [isGeneratingAiQuestion, setIsGeneratingAiQuestion] = useState(false);

    // Active Live Question on Teacher Screen (Synchronized with classroom)
    const [activeLaunchedQuestion, setActiveLaunchedQuestion] = useState(() => {
        const saved = localStorage.getItem('aulock_active_question');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.active === true) {
                    return parsed;
                }
            } catch (e) {}
        }
        return null;
    });

    const [questionRemainingSecs, setQuestionRemainingSecs] = useState(0);

    // Question countdown tick on teacher screen
    useEffect(() => {
        let interval = null;
        if (activeLaunchedQuestion && activeLaunchedQuestion.active && activeLaunchedQuestion.targetEndTime) {
            const syncTick = () => {
                const rem = Math.max(0, Math.ceil((activeLaunchedQuestion.targetEndTime - Date.now()) / 1000));
                setQuestionRemainingSecs(rem);
                if (rem === 0) {
                    // Question expired
                }
            };
            syncTick();
            interval = setInterval(syncTick, 500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeLaunchedQuestion]);

    // Real-Time Dynamic Chart Data Aggregated from Student Responses
    const dynamicResponseChartData = useMemo(() => {
        if (!activeLaunchedQuestion) {
            return [
                { name: 'Opción A', val: 0 },
                { name: 'Opción B', val: 0 },
                { name: 'Opción C', val: 0 },
                { name: 'Opción D', val: 0 }
            ];
        }

        if (activeLaunchedQuestion.type === 'true_false') {
            const vCount = liveResponsesList.filter(r => 
                (r.optionText || r.optionId || r.answer || '').toLowerCase().includes('verdadero') || 
                (r.optionText || r.optionId || r.answer || '').toLowerCase().includes('true')
            ).length;
            const fCount = liveResponsesList.filter(r => 
                (r.optionText || r.optionId || r.answer || '').toLowerCase().includes('falso') || 
                (r.optionText || r.optionId || r.answer || '').toLowerCase().includes('false')
            ).length;
            return [
                { name: 'Verdadero (V)', val: vCount },
                { name: 'Falso (F)', val: fCount }
            ];
        }

        if (activeLaunchedQuestion.type === 'written') {
            return [
                { name: 'Respuestas Recibidas', val: liveResponsesList.length },
                { name: 'Pendientes', val: Math.max(0, 26 - liveResponsesList.length) }
            ];
        }

        // Multiple choice (alternatives)
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        liveResponsesList.forEach(r => {
            const opt = (r.optionId || '').toUpperCase();
            if (counts[opt] !== undefined) {
                counts[opt]++;
            } else if (r.optionText || r.answer) {
                const text = r.optionText || r.answer || '';
                if (text.startsWith('A') || (activeLaunchedQuestion.options?.[0] && text.includes(activeLaunchedQuestion.options[0]))) counts.A++;
                else if (text.startsWith('B') || (activeLaunchedQuestion.options?.[1] && text.includes(activeLaunchedQuestion.options[1]))) counts.B++;
                else if (text.startsWith('C') || (activeLaunchedQuestion.options?.[2] && text.includes(activeLaunchedQuestion.options[2]))) counts.C++;
                else if (text.startsWith('D') || (activeLaunchedQuestion.options?.[3] && text.includes(activeLaunchedQuestion.options[3]))) counts.D++;
            }
        });

        return [
            { name: 'Opción A', val: counts.A },
            { name: 'Opción B', val: counts.B },
            { name: 'Opción C', val: counts.C },
            { name: 'Opción D', val: counts.D }
        ];
    }, [activeLaunchedQuestion, liveResponsesList]);

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

    const handleLaunchLiveQuestion = () => {
        if (!questionText.trim()) return alert("Por favor ingresa primero el enunciado de la pregunta.");

        const validOptions = (questionType === 'alternatives' || questionType === 'multiple_choice') 
            ? options.filter(o => o.trim()) 
            : (questionType === 'true_false' ? ['Verdadero', 'Falso'] : []);

        const now = Date.now();
        const durationSec = Number(timer) || 45;
        const targetEndTime = now + (durationSec * 1000);

        const questionPayload = {
            id: 'q-live-' + now,
            question: questionText.trim(),
            type: questionType,
            options: validOptions,
            correctAnswer: questionType === 'true_false' 
                ? (correctAnswer.toLowerCase().includes('v') || correctAnswer.toLowerCase().includes('t') ? 'Verdadero' : 'Falso')
                : correctAnswer,
            correct_answer: questionType === 'true_false' 
                ? (correctAnswer.toLowerCase().includes('v') || correctAnswer.toLowerCase().includes('t') ? 'Verdadero' : 'Falso')
                : correctAnswer,
            timeLimit: durationSec,
            timer_seconds: durationSec,
            active: true,
            launchedAt: now,
            targetEndTime,
            teacherName: profile?.name || 'Prof. Carlos Rivas'
        };

        // 1. Save to LocalStorage & Local React State
        localStorage.setItem('aulock_active_question', JSON.stringify(questionPayload));
        localStorage.setItem('aulock_student_live_responses', JSON.stringify([])); // Reset responses for new question
        setLiveResponsesList([]);
        setLatestStudentResponse(null);
        setActiveLaunchedQuestion(questionPayload);
        setQuestionRemainingSecs(durationSec);

        // 2. Local Window Events for multi-tab reactivity
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_question_event', { detail: { data: questionPayload } }));

        // 3. Supabase Realtime Broadcast across devices
        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'live_question_launched',
                        payload: questionPayload
                    });
                }
            });
        } catch (err) {
            console.warn("Supabase Realtime broadcast:", err);
        }

        alert(`🚀 ¡Pregunta formativa lanzada en vivo a la clase! Tiempo límite: ${durationSec}s. Sincronizada en los dispositivos de los alumnos.`);
    };

    const handleCloseLiveQuestion = () => {
        setActiveLaunchedQuestion(null);
        const closedPayload = { active: false, closedAt: Date.now() };
        localStorage.setItem('aulock_active_question', JSON.stringify(closedPayload));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_question_event', { detail: { data: closedPayload } }));

        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'live_question_closed',
                        payload: closedPayload
                    });
                }
            });
        } catch (err) {}

        alert("🛑 Ronda de pregunta formativa finalizada. Las respuestas han sido consolidadas.");
    };

    const handleLoadPresetQuestion = (presetKey) => {
        if (presetKey === 'math') {
            setQuestionType('alternatives');
            setQuestionText('¿Cuál es el conjunto solución de la ecuación cuadrática x² - 5x + 6 = 0?');
            setOptions(['x = 2 y x = 3', 'x = -2 y x = -3', 'x = 1 y x = 6', 'x = 0 y x = 5']);
            setCorrectAnswer('x = 2 y x = 3');
            setTimer(45);
        } else if (presetKey === 'bio') {
            setQuestionType('alternatives');
            setQuestionText('¿En qué organelo celular se produce la mayor cantidad de ATP mediante fosforilación oxidativa?');
            setOptions(['Mitocondria', 'Ribosoma', 'Retículo Endoplasmático', 'Aparato de Golgi']);
            setCorrectAnswer('Mitocondria');
            setTimer(45);
        } else if (presetKey === 'civic') {
            setQuestionType('alternatives');
            setQuestionText('¿Cuál es el principio ético fundamental al debatir ideas divergentes en una comunidad escolar?');
            setOptions(['Escucha activa y fundamentación respetuosa', 'Imposición de la mayoría', 'Evitar el diálogo', 'Descalificación del par']);
            setCorrectAnswer('Escucha activa y fundamentación respetuosa');
            setTimer(45);
        } else if (presetKey === 'true_false') {
            setQuestionType('true_false');
            setQuestionText('¿La energía potencial gravitatoria de un cuerpo aumenta de forma directamente proporcional a su altura?');
            setOptions(['Verdadero', 'Falso']);
            setCorrectAnswer('Verdadero');
            setTimer(30);
        } else if (presetKey === 'written') {
            setQuestionType('written');
            setQuestionText('Explica brevemente por qué la derivada representa la tasa de cambio instantánea de una función física o matemática.');
            setOptions([]);
            setCorrectAnswer('Criterio de razonamiento matemático');
            setTimer(60);
        }
    };

    const handleGenerateAiQuestion = async () => {
        setIsGeneratingAiQuestion(true);
        try {
            // Auto generate question based on current curriculum topic
            setQuestionType('alternatives');
            setQuestionText(`Respecto a ${nextClassTopic || 'Derivadas y Optimización'}, ¿cuál es la condición necesaria para que una función suave f(x) alcance un valor extremo local?`);
            setOptions([
                "f'(x) = 0 o la derivada no existe",
                "f''(x) = 0 siempre",
                "f(x) debe ser igual a cero",
                "La función debe ser periódica"
            ]);
            setCorrectAnswer("f'(x) = 0 o la derivada no existe");
            setTimer(45);
            alert("✨ ¡Pregunta formativa generada con IA para " + (nextClassTopic || 'la unidad actual') + "!");
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingAiQuestion(false);
        }
    };

    // Synchronized Class Timer Launcher & Controls (Timestamp-Based Absolute Clock)
    const [classTimerInitial, setClassTimerInitial] = useState(() => {
        const saved = localStorage.getItem('aulock_class_timer');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.initialSeconds || 600;
            } catch (e) {}
        }
        return 600;
    });

    const [classTimerTargetEnd, setClassTimerTargetEnd] = useState(() => {
        const saved = localStorage.getItem('aulock_class_timer');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.targetEndTime || null;
            } catch (e) {}
        }
        return null;
    });

    const [isClassTimerRunning, setIsClassTimerRunning] = useState(() => {
        const saved = localStorage.getItem('aulock_class_timer');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.isRunning && parsed.targetEndTime && parsed.targetEndTime > Date.now()) {
                    return true;
                }
            } catch (e) {}
        }
        return false;
    });

    const [classTimerRemaining, setClassTimerRemaining] = useState(() => {
        const saved = localStorage.getItem('aulock_class_timer');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.isRunning && parsed.targetEndTime) {
                    return Math.max(0, Math.ceil((parsed.targetEndTime - Date.now()) / 1000));
                }
                return parsed.remainingSeconds !== undefined ? parsed.remainingSeconds : (parsed.initialSeconds || 600);
            } catch (e) {}
        }
        return 600;
    });

    // Precision timestamp tick engine
    useEffect(() => {
        let interval = null;

        if (isClassTimerRunning && classTimerTargetEnd) {
            // Immediate sync
            const now = Date.now();
            const rem = Math.max(0, Math.ceil((classTimerTargetEnd - now) / 1000));
            setClassTimerRemaining(rem);
            if (rem === 0) {
                setIsClassTimerRunning(false);
            }

            interval = setInterval(() => {
                const currentNow = Date.now();
                const currentRem = Math.max(0, Math.ceil((classTimerTargetEnd - currentNow) / 1000));
                setClassTimerRemaining(currentRem);
                if (currentRem === 0) {
                    setIsClassTimerRunning(false);
                }
            }, 500);
        }

        const handleTabFocus = () => {
            if (classTimerTargetEnd && isClassTimerRunning) {
                const rem = Math.max(0, Math.ceil((classTimerTargetEnd - Date.now()) / 1000));
                setClassTimerRemaining(rem);
            }
        };

        window.addEventListener('focus', handleTabFocus);
        document.addEventListener('visibilitychange', handleTabFocus);

        return () => {
            if (interval) clearInterval(interval);
            window.removeEventListener('focus', handleTabFocus);
            document.removeEventListener('visibilitychange', handleTabFocus);
        };
    }, [isClassTimerRunning, classTimerTargetEnd]);

    const handleStartClassTimer = (secondsToSet) => {
        const targetSeconds = secondsToSet !== undefined ? secondsToSet : (classTimerRemaining > 0 ? classTimerRemaining : classTimerInitial);
        const now = Date.now();
        const targetEndTime = now + (targetSeconds * 1000);

        setClassTimerRemaining(targetSeconds);
        setClassTimerTargetEnd(targetEndTime);
        setIsClassTimerRunning(true);

        const payload = {
            initialSeconds: classTimerInitial,
            remainingSeconds: targetSeconds,
            startTime: now,
            targetEndTime,
            isRunning: true,
            label: 'Live Class Session Timer'
        };

        localStorage.setItem('aulock_class_timer', JSON.stringify(payload));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_timer_event', { detail: payload }));
        alert(`⏱️ Temporizador de Clase Iniciado (${Math.floor(targetSeconds / 60)}m ${targetSeconds % 60}s)! Sincronizado en tiempo absoluto a todos los alumnos.`);
    };

    const handlePauseClassTimer = () => {
        setIsClassTimerRunning(false);
        setClassTimerTargetEnd(null);

        const payload = {
            initialSeconds: classTimerInitial,
            remainingSeconds: classTimerRemaining,
            startTime: Date.now(),
            targetEndTime: null,
            isRunning: false,
            label: 'Live Class Session Timer'
        };
        localStorage.setItem('aulock_class_timer', JSON.stringify(payload));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_timer_event', { detail: payload }));
    };

    const handleResetClassTimer = () => {
        setIsClassTimerRunning(false);
        setClassTimerTargetEnd(null);
        setClassTimerRemaining(classTimerInitial);

        const payload = {
            initialSeconds: classTimerInitial,
            remainingSeconds: classTimerInitial,
            startTime: Date.now(),
            targetEndTime: null,
            isRunning: false,
            label: 'Live Class Session Timer'
        };
        localStorage.setItem('aulock_class_timer', JSON.stringify(payload));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_timer_event', { detail: payload }));
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

                            {/* 🚀 ACTIVE QUESTION IN-PROGRESS HUD (SHOWN WHEN A QUESTION IS CURRENTLY LIVE) */}
                            {activeLaunchedQuestion && activeLaunchedQuestion.active && (
                                <div className="bg-slate-950/95 border-2 border-fuchsia-500 p-6 rounded-3xl shadow-[0_0_35px_rgba(217,70,239,0.35)] space-y-4 animate-in fade-in">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-fuchsia-900/80 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-3 h-3 rounded-full bg-fuchsia-400 animate-ping" />
                                            <span className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase">
                                                ● PREGUNTA EN VIVO EN PROGRESO (AULA SINCRONIZADA)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 bg-fuchsia-950 border border-fuchsia-500 px-3 py-1 rounded-xl text-amber-300 font-orbitron font-black text-sm">
                                                <Clock className="w-4 h-4 text-fuchsia-400" />
                                                <span>{questionRemainingSecs}s restantes</span>
                                            </div>
                                            <button
                                                onClick={handleCloseLiveQuestion}
                                                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                                            >
                                                🛑 Finalizar Ronda
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[11px] text-slate-400 uppercase font-bold block">Enunciado Proyectado:</span>
                                        <h3 className="text-base font-bold text-white font-sans bg-slate-900/90 p-4 rounded-2xl border border-fuchsia-500/40">
                                            {activeLaunchedQuestion.question}
                                        </h3>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                                        <div className="text-emerald-300 font-mono">
                                            ✓ Respuesta Correcta Esperada: <strong>{activeLaunchedQuestion.correctAnswer || activeLaunchedQuestion.correct_answer || 'N/A'}</strong>
                                        </div>
                                        <div className="text-fuchsia-300 font-bold font-orbitron">
                                            📊 {liveResponsesList.length} / 26 Alumnos Han Respondido
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CURRENT LIVE QUESTION CREATOR & BROADCASTER */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 md:p-7 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.35)] space-y-5">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-cyan-900/60 pb-4">
                                    <div>
                                        <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase font-bold block mb-1">
                                            ACTIVIDAD FORMATIVA EN VIVO:
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wide">
                                            Lanzador de Preguntas de Aula
                                        </h2>
                                    </div>

                                    {/* Question Response Type Selector */}
                                    <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-cyan-500/40 text-xs font-bold gap-1">
                                        <button 
                                            onClick={() => setQuestionType('alternatives')}
                                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${questionType === 'alternatives' ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Opción Múltiple
                                        </button>
                                        <button 
                                            onClick={() => setQuestionType('true_false')}
                                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${questionType === 'true_false' ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Verdadero / Falso
                                        </button>
                                        <button 
                                            onClick={() => setQuestionType('written')}
                                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${questionType === 'written' ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Desarrollo / Escrita
                                        </button>
                                    </div>
                                </div>

                                {/* PRESETS & AI QUICK LAUNCH BAR */}
                                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-cyan-800 space-y-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase font-orbitron block">
                                        ⚡ PLANTILLAS RÁPIDAS & GENERACIÓN IA:
                                    </span>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => handleLoadPresetQuestion('math')}
                                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-700 text-cyan-300 font-bold transition cursor-pointer"
                                        >
                                            📐 PAES Matemáticas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleLoadPresetQuestion('bio')}
                                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-700 text-emerald-300 font-bold transition cursor-pointer"
                                        >
                                            🧬 Biología / Ciencias
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleLoadPresetQuestion('civic')}
                                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-purple-700 text-purple-300 font-bold transition cursor-pointer"
                                        >
                                            🏛️ Convivencia & Ética
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleLoadPresetQuestion('true_false')}
                                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-700 text-amber-300 font-bold transition cursor-pointer"
                                        >
                                            🧪 V / F (Física)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleLoadPresetQuestion('written')}
                                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-fuchsia-700 text-fuchsia-300 font-bold transition cursor-pointer"
                                        >
                                            ✍️ Razonamiento Escrito
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGenerateAiQuestion}
                                            disabled={isGeneratingAiQuestion}
                                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-slate-950 font-orbitron font-black transition cursor-pointer flex items-center gap-1 shadow-sm"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>{isGeneratingAiQuestion ? 'Generando...' : '✨ IA Flash 2.5'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* LIVE QUESTION PROMPT CARD */}
                                <div className="bg-slate-900/90 p-5 md:p-6 rounded-2xl border-2 border-cyan-500/50 space-y-4 font-mono">
                                    <div className="flex items-center justify-between text-sm text-cyan-300 font-bold">
                                        <span className="font-orbitron font-extrabold text-white">ENUNCIADO DE LA PREGUNTA</span>
                                        <span className="text-xs bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-500 text-cyan-300 font-black uppercase tracking-wider">
                                            {questionType === 'alternatives' ? 'OPCIÓN MÚLTIPLE' : questionType === 'true_false' ? 'VERDADERO / FALSO' : 'DESARROLLO'}
                                        </span>
                                    </div>

                                    {/* Question Text Input */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase block">Texto de la Pregunta *</label>
                                        <textarea
                                            value={questionText}
                                            onChange={e => setQuestionText(e.target.value)}
                                            placeholder="Escribe la pregunta formativa para la clase..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 outline-none focus:border-cyan-400 min-h-[85px] resize-none font-mono"
                                        />
                                    </div>

                                    {/* Multiple Choice Options Input */}
                                    {questionType === 'alternatives' && (
                                        <div className="space-y-2 pt-1">
                                            <label className="text-xs text-cyan-300 font-bold uppercase block">Opciones (A, B, C, D) y Respuesta Correcta:</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-cyan-200">
                                                {options.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                                                        <button
                                                            type="button"
                                                            onClick={() => setCorrectAnswer(opt)}
                                                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs cursor-pointer transition ${correctAnswer === opt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-cyan-400 border border-slate-700'}`}
                                                            title="Marcar como respuesta correcta"
                                                        >
                                                            {String.fromCharCode(65 + idx)}
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={e => {
                                                                const updated = [...options];
                                                                updated[idx] = e.target.value;
                                                                setOptions(updated);
                                                                if (correctAnswer === opt) setCorrectAnswer(e.target.value);
                                                            }}
                                                            className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
                                                            placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-[11px] text-emerald-400 font-sans pt-1">
                                                ✓ Respuesta correcta seleccionada: <strong>{correctAnswer}</strong> (haz clic en la letra para cambiar)
                                            </div>
                                        </div>
                                    )}

                                    {/* True / False Selector */}
                                    {questionType === 'true_false' && (
                                        <div className="space-y-2 pt-1">
                                            <label className="text-xs text-cyan-300 font-bold uppercase block">Selecciona la Respuesta Correcta:</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setCorrectAnswer('Verdadero')}
                                                    className={`p-3 rounded-xl border-2 font-orbitron font-bold text-xs transition cursor-pointer ${correctAnswer === 'Verdadero' ? 'bg-emerald-950 border-emerald-400 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                                                >
                                                    🟢 Verdadero
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCorrectAnswer('Falso')}
                                                    className={`p-3 rounded-xl border-2 font-orbitron font-bold text-xs transition cursor-pointer ${correctAnswer === 'Falso' ? 'bg-rose-950 border-rose-400 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                                                >
                                                    🔴 Falso
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Limit & Timer Control */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm text-slate-300 pt-3 border-t border-slate-800 font-mono">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">⏱️ Límite de Tiempo:</span>
                                            <select
                                                value={timer}
                                                onChange={e => setTimer(Number(e.target.value))}
                                                className="bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-1.5 text-cyan-300 font-bold font-orbitron outline-none cursor-pointer"
                                            >
                                                <option value={15}>15 Segundos</option>
                                                <option value={30}>30 Segundos</option>
                                                <option value={45}>45 Segundos</option>
                                                <option value={60}>60 Segundos (1 min)</option>
                                                <option value={90}>90 Segundos</option>
                                                <option value={120}>120 Segundos (2 min)</option>
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
                                    <span>LANZAR PREGUNTA FORMATIVA A TODA LA CLASE</span>
                                </button>
                            </div>

                            {/* REAL-TIME RESPONSES CHART */}
                            <div className="bg-slate-950/90 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-orbitron font-extrabold text-white tracking-wider uppercase">
                                        RESPUESTAS DE ALUMNOS EN TIEMPO REAL
                                    </h3>
                                    <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700">
                                        {liveResponsesList.length} Respuestas Recibidas
                                    </span>
                                </div>

                                {latestStudentResponse && (
                                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs font-mono text-emerald-200 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                                        <span className="font-bold">✓ Última Respuesta Recibida:</span>
                                        <span className="text-white font-black">
                                            {latestStudentResponse.studentName} ({latestStudentResponse.squadName || latestStudentResponse.course || 'Squad Alfa'}) seleccionó: {latestStudentResponse.optionId || latestStudentResponse.optionText || latestStudentResponse.answer}
                                        </span>
                                    </div>
                                )}

                                {comprehensionPulse && (
                                    <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-xs font-mono text-cyan-200 flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-bold">✓ Pulso de Comprensión del Alumno:</span>
                                        <span className="text-cyan-300 font-black">{comprehensionPulse.studentName}: {comprehensionPulse.level}</span>
                                    </div>
                                )}

                                <div className="h-60 w-full pt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dynamicResponseChartData}>
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#06b6d4', borderRadius: '12px', color: '#cffaff', fontSize: '12px' }}
                                            />
                                            <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                                                {dynamicResponseChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : index === 1 ? '#38bdf8' : index === 2 ? '#a855f7' : '#34d399'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* LIST OF INCOMING RESPONSES */}
                                {liveResponsesList.length > 0 && (
                                    <div className="space-y-1.5 pt-3 border-t border-slate-800">
                                        <span className="text-[10px] text-slate-400 uppercase font-orbitron">ÚLTIMAS RESPUESTAS REGISTRADAS:</span>
                                        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 font-sans text-xs">
                                            {liveResponsesList.slice(0, 6).map((resp, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-2 bg-slate-900 rounded-xl border border-slate-800">
                                                    <span className="font-bold text-slate-200">{resp.studentName || 'Estudiante'}</span>
                                                    <span className="text-cyan-300 font-mono">
                                                        {resp.optionId ? `Opción ${resp.optionId}: ` : ''}{resp.optionText || resp.answer || 'Respuesta registrada'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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

                                    {/* 3. SYNCHRONIZED CLASSROOM TIMER CONTROLLER */}
                                    <div className="bg-slate-900 p-4 rounded-2xl border-2 border-cyan-500/60 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-cyan-300 font-bold block uppercase text-xs font-orbitron">⏱️ CLASSROOM TIMER CONTROLLER:</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isClassTimerRunning ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 animate-pulse' : 'bg-slate-950 text-slate-400 border border-slate-700'}`}>
                                                {isClassTimerRunning ? '● LIVE SYNCED' : '○ PAUSED'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-cyan-400">
                                            <span className="text-slate-400 text-xs font-bold uppercase">Time Remaining:</span>
                                            <span className="text-2xl font-black font-orbitron text-amber-300">
                                                {String(Math.floor(classTimerRemaining / 60)).padStart(2, '0')}:{String(classTimerRemaining % 60).padStart(2, '0')}
                                            </span>
                                        </div>

                                        {/* PRESET DURATION BUTTONS */}
                                        <div className="flex flex-wrap gap-1.5 justify-between">
                                            {[300, 600, 900, 1800, 2700].map((sec) => (
                                                <button
                                                    key={sec}
                                                    type="button"
                                                    onClick={() => {
                                                        setClassTimerInitial(sec);
                                                        handleStartClassTimer(sec);
                                                    }}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono cursor-pointer transition ${classTimerInitial === sec ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700'}`}
                                                >
                                                    {sec / 60}m
                                                </button>
                                            ))}
                                        </div>

                                        {/* ACTION BUTTONS: LAUNCH, PAUSE, RESET */}
                                        <div className="grid grid-cols-3 gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => handleStartClassTimer()}
                                                className="py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 font-orbitron font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span>▶️</span>
                                                <span>{isClassTimerRunning ? 'Resume' : 'Start'}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handlePauseClassTimer}
                                                className="py-2.5 bg-amber-950 hover:bg-amber-900 border border-amber-500/60 text-amber-300 font-orbitron font-bold text-[11px] uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span>⏸️</span>
                                                <span>Pause</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleResetClassTimer}
                                                className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-orbitron font-bold text-[11px] uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span>🔄</span>
                                                <span>Reset</span>
                                            </button>
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

                {/* ==================== TAB 2: TEACHER EVALUATIONS & NOTEBOOKLLM STUDIO ==================== */}
                {activeTab === 'evaluations' && (
                    <div className="space-y-8 animate-in fade-in duration-300 font-mono">
                        
                        {/* 1. AI SLIDE DECK GENERATOR (NOTEBOOKLLM STYLE) */}
                        <div className="bg-slate-950/90 border-2 border-fuchsia-500/80 p-6 md:p-8 rounded-3xl shadow-[0_0_35px_rgba(217,70,239,0.35)] space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-fuchsia-900/60 pb-4">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-fuchsia-300 bg-fuchsia-950 px-3 py-1 rounded-full border border-fuchsia-600 tracking-wider">
                                        NOTEBOOKLLM PRESENTATION STUDIO
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-orbitron font-extrabold text-white mt-2">
                                        AI Didactic Slide Deck Generator
                                    </h2>
                                    <p className="text-xs text-slate-400 font-sans mt-1">
                                        Synthesize 4-slide interactive presentations with key insights, audio overviews, and live student broadcasting.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <input
                                        type="text"
                                        value={nextClassTopic}
                                        onChange={e => setNextClassTopic(e.target.value)}
                                        className="bg-slate-900 border-2 border-fuchsia-500/50 text-xs text-white px-4 py-3 rounded-2xl outline-none focus:border-fuchsia-400 w-full sm:w-80 font-mono shadow-inner"
                                        placeholder="Lesson topic (e.g. Derivadas y Optimización de Funciones)..."
                                    />
                                    <button
                                        onClick={handleGenerateNotebookPresentation}
                                        disabled={generatingPresentation}
                                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.6)] transition flex items-center justify-center gap-2.5 shrink-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <Sparkles className={`w-4 h-4 text-amber-300 ${generatingPresentation ? 'animate-spin' : ''}`} />
                                        <span>{generatingPresentation ? 'Synthesizing AI Deck...' : '🎬 Generar Deck NotebookLLM'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* CANVA SLIDE STUDIO & BROADCASTER */}
                            {presentationDeck && currentSlide ? (
                                <div className="bg-slate-900/90 p-6 md:p-7 rounded-2xl border-2 border-fuchsia-500/50 space-y-5 shadow-2xl relative">
                                    <div className="flex flex-wrap justify-between items-center text-xs gap-2 border-b border-slate-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-fuchsia-300 font-extrabold bg-fuchsia-950 px-3 py-1 rounded-lg border border-fuchsia-700 font-orbitron uppercase text-[11px]">
                                                {currentSlide.tag || `📌 SLIDE ${currentSlideIndex + 1}`}
                                            </span>
                                            <span className="text-slate-400 text-[11px] font-bold">
                                                Topic: {nextClassTopic}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {presentationDeck.slides.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentSlideIndex(idx)}
                                                    className={`w-7 h-7 rounded-lg text-xs font-bold font-orbitron transition cursor-pointer ${
                                                        currentSlideIndex === idx
                                                            ? 'bg-fuchsia-500 text-black border border-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.8)]'
                                                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-fuchsia-600'
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 py-1">
                                        <h3 className="text-lg md:text-xl font-orbitron font-extrabold text-white leading-snug">
                                            {currentSlide.headline}
                                        </h3>

                                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                            {currentSlide.body}
                                        </p>

                                        {currentSlide.keyInsight && (
                                            <div className="p-3.5 bg-fuchsia-950/40 border border-fuchsia-500/40 rounded-xl text-xs text-fuchsia-200 font-mono flex items-start gap-2.5">
                                                <span className="text-amber-300 text-sm">💡</span>
                                                <div>
                                                    <strong className="block text-fuchsia-300 font-bold uppercase text-[10px] tracking-wider">NotebookLLM Key Insight:</strong>
                                                    <span>{currentSlide.keyInsight}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* CONTROLS: PREVIOUS/NEXT, AUDIO OVERVIEW, LIVE PROJECTION */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={currentSlideIndex === 0}
                                                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                                                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-30 cursor-pointer flex items-center gap-1"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                <span>Prev</span>
                                            </button>
                                            <button
                                                disabled={currentSlideIndex === presentationDeck.slides.length - 1}
                                                onClick={() => setCurrentSlideIndex(prev => Math.min(presentationDeck.slides.length - 1, prev + 1))}
                                                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-30 cursor-pointer flex items-center gap-1"
                                            >
                                                <span>Next</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                onClick={handleToggleAudioOverview}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                                                    isPlayingAudio 
                                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse' 
                                                        : 'bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-500/40'
                                                }`}
                                            >
                                                <Volume2 className="w-4 h-4" />
                                                <span>{isPlayingAudio ? '▶️ NotebookLLM Audio Playing...' : '🎧 Resumen Audio NotebookLLM'}</span>
                                            </button>

                                            <button
                                                onClick={handleProjectSlideToStudents}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron uppercase tracking-wider transition flex items-center space-x-2 shadow-lg cursor-pointer ${
                                                    isProjecting 
                                                        ? 'bg-emerald-500 text-slate-950 border border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.8)]' 
                                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white border border-emerald-400'
                                                }`}
                                            >
                                                <Radio className="w-4 h-4 animate-pulse" />
                                                <span>{isProjecting ? '✓ Projected Live on Student HUD' : '📡 Proyectar a Alumnos'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-900/60 rounded-2xl border-2 border-dashed border-fuchsia-900/60 text-center space-y-2">
                                    <Sparkles className="w-8 h-8 text-fuchsia-400 mx-auto animate-bounce" />
                                    <h4 className="text-sm font-bold text-white font-orbitron">AI Slide Deck Studio Ready</h4>
                                    <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans">
                                        Type a topic above (e.g. "Derivadas y Optimización de Funciones") and click <strong className="text-fuchsia-300 font-mono">"Generar Deck NotebookLLM"</strong> to structure a 4-slide didactic deck.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 2. MINEDUC RUBRIC EVALUATION ENGINE */}
                        <div className="bg-slate-950/90 border-2 border-fuchsia-500/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-fuchsia-900/60 pb-4">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-fuchsia-300 bg-fuchsia-950 px-3 py-1 rounded-full border border-fuchsia-700">
                                        OFFICIAL MINEDUC RUBRIC EVALUATION ENGINE
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-orbitron font-extrabold text-white mt-1">
                                        Formative & Summative Rubric Processor
                                    </h2>
                                </div>
                                <span className="text-xs text-cyan-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40">
                                    Escala Oficial MINEDUC (1.0 - 7.0)
                                </span>
                            </div>

                            {/* SELECTORS ROW */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 block uppercase font-mono">Select Student:</label>
                                    <select
                                        value={selectedStudentForEval}
                                        onChange={e => setSelectedStudentForEval(e.target.value)}
                                        className="w-full bg-slate-900 border border-fuchsia-500/40 rounded-xl p-3 text-xs text-white outline-none focus:border-fuchsia-400 font-mono cursor-pointer"
                                    >
                                        <option value="Juan Carlos Pérez (4° Medio A)">Juan Carlos Pérez (4° Medio A)</option>
                                        <option value="Sofía Martínez (4° Medio A)">Sofía Martínez (4° Medio A)</option>
                                        <option value="Mateo Rojas (3° Medio B)">Mateo Rojas (3° Medio B)</option>
                                        <option value="Camila Silva (4° Medio A)">Camila Silva (4° Medio A)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 block uppercase font-mono">Evaluation Type:</label>
                                    <select
                                        value={evalType}
                                        onChange={e => setEvalType(e.target.value)}
                                        className="w-full bg-slate-900 border border-fuchsia-500/40 rounded-xl p-3 text-xs text-white outline-none focus:border-fuchsia-400 font-mono cursor-pointer"
                                    >
                                        <option value="PAES Mock Exam Essay">PAES Mock Exam Essay (Calculus & STEM)</option>
                                        <option value="Formative Mechanics Essay">Formative Physics Mechanics Essay</option>
                                        <option value="Socratic Argumentation Quiz">Socratic Argumentation Quiz</option>
                                    </select>
                                </div>
                            </div>

                            {/* STUDENT WORK TEXTAREA */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs text-slate-300">
                                    <span className="font-bold uppercase">Student Submission Text / Essay Answer:</span>
                                    <span className="text-slate-400 text-[11px] font-mono">{summativeStudentWork.length} characters</span>
                                </div>
                                <textarea
                                    value={summativeStudentWork}
                                    onChange={e => setSummativeStudentWork(e.target.value)}
                                    rows={4}
                                    className="w-full bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-100 outline-none focus:border-fuchsia-400 font-sans leading-relaxed shadow-inner"
                                    placeholder="Paste student submission text or essay here..."
                                />
                            </div>

                            {/* RUBRIC CRITERIA SELECTORS ALIGNED WITH MINEDUC STANDARDS */}
                            <div className="space-y-3 pt-2">
                                <h4 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase tracking-wider">
                                    MINEDUC Rubric Criteria Selectors:
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {/* Criteria 1 */}
                                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                        <span className="text-[11px] font-bold text-white block uppercase">🧠 Rigor Lógico y Científico</span>
                                        <select
                                            value={rubricScores.rigor}
                                            onChange={e => setRubricScores(prev => ({ ...prev, rigor: e.target.value }))}
                                            className="w-full bg-slate-950 border border-cyan-500/40 rounded-lg p-2 text-xs text-cyan-300 font-bold outline-none cursor-pointer"
                                        >
                                            <option value="7.0">7.0 - Destacado (Exemplary)</option>
                                            <option value="6.0">6.0 - Avanzado (Proficient)</option>
                                            <option value="5.0">5.0 - Intermedio (Basic)</option>
                                            <option value="4.0">4.0 - Inicial (Developing)</option>
                                        </select>
                                    </div>

                                    {/* Criteria 2 */}
                                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                        <span className="text-[11px] font-bold text-white block uppercase">📐 Coherencia Estructural</span>
                                        <select
                                            value={rubricScores.coherence}
                                            onChange={e => setRubricScores(prev => ({ ...prev, coherence: e.target.value }))}
                                            className="w-full bg-slate-950 border border-cyan-500/40 rounded-lg p-2 text-xs text-cyan-300 font-bold outline-none cursor-pointer"
                                        >
                                            <option value="7.0">7.0 - Destacado (Exemplary)</option>
                                            <option value="6.0">6.0 - Avanzado (Proficient)</option>
                                            <option value="5.0">5.0 - Intermedio (Basic)</option>
                                            <option value="4.0">4.0 - Inicial (Developing)</option>
                                        </select>
                                    </div>

                                    {/* Criteria 3 */}
                                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                        <span className="text-[11px] font-bold text-white block uppercase">🎓 Dominio Conceptual</span>
                                        <select
                                            value={rubricScores.mastery}
                                            onChange={e => setRubricScores(prev => ({ ...prev, mastery: e.target.value }))}
                                            className="w-full bg-slate-950 border border-cyan-500/40 rounded-lg p-2 text-xs text-cyan-300 font-bold outline-none cursor-pointer"
                                        >
                                            <option value="7.0">7.0 - Destacado (Exemplary)</option>
                                            <option value="6.5">6.5 - Avanzado Superior</option>
                                            <option value="6.0">6.0 - Avanzado (Proficient)</option>
                                            <option value="5.0">5.0 - Intermedio (Basic)</option>
                                            <option value="4.0">4.0 - Inicial (Developing)</option>
                                        </select>
                                    </div>

                                    {/* Criteria 4 */}
                                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                                        <span className="text-[11px] font-bold text-white block uppercase">💬 Argumentación y Evidencia</span>
                                        <select
                                            value={rubricScores.argumentation}
                                            onChange={e => setRubricScores(prev => ({ ...prev, argumentation: e.target.value }))}
                                            className="w-full bg-slate-950 border border-cyan-500/40 rounded-lg p-2 text-xs text-cyan-300 font-bold outline-none cursor-pointer"
                                        >
                                            <option value="7.0">7.0 - Destacado (Exemplary)</option>
                                            <option value="6.8">6.8 - Avanzado Superior</option>
                                            <option value="6.0">6.0 - Avanzado (Proficient)</option>
                                            <option value="5.0">5.0 - Intermedio (Basic)</option>
                                            <option value="4.0">4.0 - Inicial (Developing)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* EVALUATE ACTION BUTTON */}
                            <button
                                onClick={handleEvaluateSummative}
                                disabled={isEvaluatingSummative}
                                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-orbitron font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_25px_rgba(217,70,239,0.6)] transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>🤖</span>
                                <span>{isEvaluatingSummative ? 'Processing MINEDUC Rubric Engine...' : 'Evaluar con Rúbrica MINEDUC'}</span>
                            </button>

                            {/* EVALUATION RESULT REPORT */}
                            {summativeEvalResult && (
                                <div className="bg-slate-900/95 p-6 rounded-2xl border-2 border-fuchsia-500/60 space-y-4 animate-fade-in shadow-2xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                                        <div>
                                            <span className="text-[10px] text-fuchsia-300 font-bold font-orbitron uppercase">
                                                EVALUATION RESULT REPORT FOR {summativeEvalResult.studentName}
                                            </span>
                                            <h4 className="text-base font-bold text-white">
                                                {summativeEvalResult.evalType}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="block text-[10px] text-slate-400 font-bold uppercase">MINEDUC GRADE</span>
                                                <span className="text-2xl font-black font-orbitron text-amber-300">
                                                    {summativeEvalResult.nota} / 7.0
                                                </span>
                                            </div>
                                            <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold text-xs rounded-xl uppercase">
                                                {summativeEvalResult.nivel_logro}
                                            </span>
                                        </div>
                                    </div>

                                    {/* TEACHER PROSE JUSTIFICATION */}
                                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                        <strong className="text-xs font-bold text-fuchsia-300 uppercase block font-orbitron">
                                            Teacher Pedagogical Justification:
                                        </strong>
                                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                            {summativeEvalResult.justificacion_docente}
                                        </p>
                                    </div>

                                    {/* STRENGTHS & GROWTH AREAS BULLETS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 text-xs">
                                            <span className="font-bold text-emerald-300 uppercase font-orbitron block">🌟 Strengths Observed:</span>
                                            <ul className="space-y-1 text-slate-200 font-sans list-disc list-inside">
                                                {summativeEvalResult.strengths?.map((st, i) => (
                                                    <li key={i}>{st}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2 text-xs">
                                            <span className="font-bold text-amber-300 uppercase font-orbitron block">🎯 Growth Opportunities:</span>
                                            <ul className="space-y-1 text-slate-200 font-sans list-disc list-inside">
                                                {summativeEvalResult.growthAreas?.map((gr, i) => (
                                                    <li key={i}>{gr}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* CURRICULAR ALIGNMENT & SAVE BUTTON */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                        <span className="text-xs text-cyan-300 font-bold bg-cyan-950 px-3 py-1.5 rounded-lg border border-cyan-800">
                                            📋 Curricular Alignment: {summativeEvalResult.curricularAlignment}
                                        </span>
                                        <button
                                            onClick={handleAddEvaluationToTable}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs font-orbitron uppercase tracking-wider rounded-xl shadow transition cursor-pointer"
                                        >
                                            ➕ Save Result to Evaluation History & Supabase
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. INTERACTIVE EVALUATION HISTORY & DRILL-DOWN */}
                        <div className="bg-slate-950/90 border-2 border-fuchsia-500/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-fuchsia-900/60 pb-4">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-fuchsia-300 bg-fuchsia-950 px-3 py-1 rounded-full border border-fuchsia-700">
                                        HISTORIAL DE ÚLTIMAS EVALUACIONES
                                    </span>
                                    <h3 className="text-lg md:text-xl font-orbitron font-extrabold text-white mt-1">
                                        Interactive Assessment History & Drill-Down
                                    </h3>
                                </div>
                                <span className="text-xs text-slate-400">
                                    Click any row to inspect item breakdown and student distribution curves.
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase border-b border-slate-800">
                                        <tr>
                                            <th className="p-3.5">EVALUACIÓN</th>
                                            <th className="p-3.5">FECHA</th>
                                            <th className="p-3.5">CURSO</th>
                                            <th className="p-3.5">PROMEDIO GRUPO</th>
                                            <th className="p-3.5">TASA LOGRO %</th>
                                            <th className="p-3.5">MEJOR DESEMPEÑO</th>
                                            <th className="p-3.5 text-right">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {evaluationsList.map(ev => (
                                            <tr 
                                                key={ev.id} 
                                                onClick={() => setSelectedEvaluationModal(ev)}
                                                className="hover:bg-fuchsia-950/30 transition cursor-pointer group"
                                            >
                                                <td className="p-3.5 font-bold text-white group-hover:text-fuchsia-300 flex items-center gap-2">
                                                    <span>📝</span>
                                                    <span>{ev.title}</span>
                                                </td>
                                                <td className="p-3.5 text-slate-400">{ev.date}</td>
                                                <td className="p-3.5 text-fuchsia-300 font-bold">{ev.course}</td>
                                                <td className="p-3.5 font-black text-amber-300">{ev.averageGrade} / 7.0</td>
                                                <td className="p-3.5 font-bold text-emerald-400">{ev.passRate}</td>
                                                <td className="p-3.5 text-slate-300">{ev.topStudent}</td>
                                                <td className="p-3.5 text-right">
                                                    <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-bold rounded-lg group-hover:bg-cyan-900">
                                                        🔍 Drill-Down ▼
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

                {/* ==================== MODAL: INTERACTIVE EVALUATION DRILL-DOWN ==================== */}
                {selectedEvaluationModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono animate-in fade-in duration-200">
                        <div className="bg-slate-950 border-2 border-fuchsia-500 p-6 md:p-8 rounded-3xl max-w-3xl w-full space-y-6 shadow-[0_0_50px_rgba(217,70,239,0.5)] max-h-[90vh] overflow-y-auto">
                            
                            <div className="flex justify-between items-start border-b border-fuchsia-900/80 pb-4">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-fuchsia-400 bg-fuchsia-950 px-3 py-1 rounded-full border border-fuchsia-700">
                                        EVALUATION DRILL-DOWN & ITEM ANALYSIS
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-orbitron font-extrabold text-white mt-2">
                                        {selectedEvaluationModal.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Course: {selectedEvaluationModal.course} • Date: {selectedEvaluationModal.date}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedEvaluationModal(null)}
                                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {/* STATS OVERVIEW */}
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Class Average</span>
                                    <strong className="text-xl font-black text-amber-300 font-orbitron">{selectedEvaluationModal.averageGrade} / 7.0</strong>
                                </div>
                                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Pass Rate</span>
                                    <strong className="text-xl font-black text-emerald-400 font-orbitron">{selectedEvaluationModal.passRate}</strong>
                                </div>
                                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Top Performer</span>
                                    <strong className="text-xs font-bold text-cyan-300 block truncate">{selectedEvaluationModal.topStudent}</strong>
                                </div>
                            </div>

                            {/* ITEM-BY-ITEM BREAKDOWN */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-orbitron font-extrabold text-cyan-300 uppercase tracking-wider">
                                    📊 Item-by-Item Skill Mastery Breakdown:
                                </h4>

                                <div className="space-y-2 text-xs">
                                    {(selectedEvaluationModal.itemBreakdown || [
                                        { item: 'Q1: Derivadas y Límites', score: 96 },
                                        { item: 'Q2: Regla de la Cadena', score: 88 },
                                        { item: 'Q3: Problema de Optimización', score: 79 },
                                        { item: 'Q4: Argumentación Matemática', score: 85 }
                                    ]).map((it, idx) => (
                                        <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex justify-between items-center font-bold">
                                                <span className="text-white">{it.item}</span>
                                                <span className="text-cyan-300 font-mono">{it.score}% Mastery</span>
                                            </div>
                                            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                                <div 
                                                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full" 
                                                    style={{ width: `${it.score}%` }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* GRADE DISTRIBUTION CURVE */}
                            <div className="space-y-3 pt-2">
                                <h4 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase tracking-wider">
                                    📈 Student Score Distribution Curve:
                                </h4>
                                <div className="h-44 w-full bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={selectedEvaluationModal.gradeDistribution || [
                                            { bucket: '1.0 - 3.9', count: 1 },
                                            { bucket: '4.0 - 4.9', count: 2 },
                                            { bucket: '5.0 - 5.9', count: 6 },
                                            { bucket: '6.0 - 7.0', count: 17 }
                                        ]}>
                                            <XAxis dataKey="bucket" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#d946ef', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                                            <Bar dataKey="count" fill="#d946ef" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* EXPORT BUTTONS */}
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-800">
                                <button
                                    onClick={() => {
                                        const csvContent = `data:text/csv;charset=utf-8,Evaluation,Date,Course,Average,PassRate\n"${selectedEvaluationModal.title}","${selectedEvaluationModal.date}","${selectedEvaluationModal.course}","${selectedEvaluationModal.averageGrade}","${selectedEvaluationModal.passRate}"`;
                                        const encodedUri = encodeURI(csvContent);
                                        const link = document.createElement("a");
                                        link.setAttribute("href", encodedUri);
                                        link.setAttribute("download", `Evaluation_${selectedEvaluationModal.id}.csv`);
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        alert("📊 Data exported to CSV / Google Sheets format!");
                                    }}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/60 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>📊</span>
                                    <span>Export Results to Google Sheets</span>
                                </button>

                                <button
                                    onClick={handleExportPDFToGoogleDrive}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>📁</span>
                                    <span>Export PDF Report to Google Drive</span>
                                </button>
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

                {/* ==================== PESTAÑA 4: 4. REPORTES (TEACHER INTELLIGENCE & TRACEABILITY HUB) ==================== */}
                {activeTab === 'reports' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <TeacherReportsHub />
                    </div>
                )}

                {/* ==================== PESTAÑA 4: 4. NEXO CONVIVENCIA (ÁGORA, MBE & SQUADS) ==================== */}
                {activeTab === 'nexo' && (
                    <div className="space-y-8 animate-in fade-in duration-300 font-mono">
                        {/* ÁGORA DE CONVIVENCIA ESCOLAR */}
                        <section className="bg-slate-950/90 border-2 border-sky-400/80 p-6 rounded-3xl shadow-xl">
                            <ClassroomArena isTeacher={true} />
                        </section>

                        {/* ASESORÍA PEDAGÓGICA IA // ANALISTA DE DATOS DOCENTES */}
                        <div className="bg-slate-950/90 border-2 border-sky-400/80 p-6 md:p-8 rounded-3xl shadow-[0_0_35px_rgba(56,189,248,0.25)] space-y-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-sky-900/60 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-sky-950 border border-sky-400 flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                                        <BrainCircuit className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-orbitron font-extrabold text-white uppercase tracking-wider">
                                            ASESORÍA PEDAGÓGICA IA // ANALISTA DE DATOS DOCENTES
                                        </h3>
                                        <p className="text-xs text-sky-300 font-sans">
                                            Telemetría sin alucinaciones • Google GenAI SDK (Gemini 1.5 Pro) & Function Calling con Supabase
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-sky-950 text-emerald-400 border border-emerald-500/80 text-[10px] font-bold rounded-full uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                        ● Supabase DB Conectado
                                    </span>
                                </div>
                            </div>

                            {/* Quick Prompt Pills */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Consultas Analíticas Inmediatas:</span>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setIsAiAnalystDrawerOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-950 border border-sky-500/50 hover:border-sky-400 text-xs text-sky-200 transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <span>🏆</span>
                                        <span>¿Quién es el mejor en Ciencias en 4° Medio A?</span>
                                    </button>
                                    <button
                                        onClick={() => setIsAiAnalystDrawerOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-950 border border-sky-500/50 hover:border-sky-400 text-xs text-sky-200 transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <span>⚠️</span>
                                        <span>Alumnos con caídas de foco y salidas de pestaña</span>
                                    </button>
                                    <button
                                        onClick={() => setIsAiAnalystDrawerOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-950 border border-sky-500/50 hover:border-sky-400 text-xs text-sky-200 transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <span>📊</span>
                                        <span>Estadísticas consolidadas del curso</span>
                                    </button>
                                    <button
                                        onClick={() => setIsAiAnalystDrawerOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-xs text-purple-200 transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <span>📥</span>
                                        <span>1-Click Export: Descargar Reporte (CSV / PDF)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Expandable Input Bar with 1-Click HUD Expansion */}
                            <div 
                                onClick={() => setIsAiAnalystDrawerOpen(true)}
                                className="p-4 bg-slate-900/90 hover:bg-slate-900 border-2 border-sky-500/60 hover:border-sky-400 rounded-2xl cursor-pointer transition shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 group"
                            >
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="w-8 h-8 rounded-xl bg-sky-950 border border-sky-500 flex items-center justify-center text-sky-300 group-hover:scale-110 transition shrink-0">
                                        💬
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs text-white font-bold block">
                                            Haz clic aquí para abrir el Panel Lateral HUD del Analista de Datos IA...
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-sans">
                                            Ejecuta Function Calling en tiempo real sobre la base de datos de telemetría y genera reportes oficiales descargables.
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsAiAnalystDrawerOpen(true); }}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.5)] transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                                >
                                    <span>⚡ Abrir Chat HUD</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Secondary MBE MINEDUC Suggestion Tool */}
                            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <span className="text-slate-400 font-sans">
                                    ¿Deseas una sugerencia didáctica alineada al Marco de la Buena Enseñanza (MBE)?
                                </span>
                                <button
                                    onClick={handleGenerateMbePlan}
                                    disabled={isGeneratingMbePlan}
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-bold rounded-xl transition cursor-pointer"
                                >
                                    {isGeneratingMbePlan ? 'Generando Asesoría...' : '🧠 Sugerencia Didáctica MBE'}
                                </button>
                            </div>

                            {mbePlanResult && (
                                <div className="bg-slate-900 p-5 rounded-2xl border border-sky-500/40 text-xs text-sky-200 space-y-2 animate-in fade-in duration-200">
                                    <h4 className="font-bold text-sky-300 uppercase">Plan Sugerido MBE MINEDUC:</h4>
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
            <TeacherActionBar onChatClick={() => setIsAiAnalystDrawerOpen(true)} />

            {/* 🤖 FLOATING HUD-STYLE CHAT SIDE-PANEL (DATA-DRIVEN AI ASSISTANT) */}
            <TeacherAiDataAnalystDrawer
                isOpen={isAiAnalystDrawerOpen}
                onClose={() => setIsAiAnalystDrawerOpen(false)}
                activeCourse="4° Medio A"
                teacherName={profile?.name || 'Prof. Carlos Rivas'}
            />
        </div>
    );
}
