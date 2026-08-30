import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recordStudentActivity } from '../services/VocationalEngine';
import { submitSecretTeacherRating } from '../services/DataImportService';
import { generateLearnYourWayResponse, analyzeExerciseImageWithGemini, generateFormativeFeedback, generateDailyCulturalMessage } from '../services/GeminiService';
import { AULOCK_TUTORS, MINEDUC_OA_CATALOG } from '../data/AuLockTutorsData';
import { MINEDUC_CONVIVENCIA_RESOURCES, WEEKLY_CLASSROOM_AGREEMENTS } from '../data/AuLockMineducConvivenciaDataset';
import { useFocusMode } from '../context/FocusModeProvider';
import { SchoolCoexistenceCapsule } from '../components/SchoolCoexistenceCapsule';
import AfterIALoreCard from '../components/AfterIALoreCard';
import AfterIAWorld from '../components/afteria/AfterIAWorld';
import AfterIAPortal from '../components/afteria/AfterIAPortal';
import LiveClassroomStudentHUD from '../components/live/LiveClassroomStudentHUD';
import EliteSocraticWhiteboard from '../components/tutors/EliteSocraticWhiteboard';
import TEAsisto from '../components/tutors/TEAsisto';
import FocusModeAuditor from '../components/focus/FocusModeAuditor';
import AcademicPassport from './AcademicPassport';
import ClassroomArena from '../components/arena/ClassroomArena';
import HudNavTabs from '../components/HudNavTabs';
import HeaderNav from '../components/hud/HeaderNav';
import ProfileFrame from '../components/hud/ProfileFrame';
import DataCard from '../components/hud/DataCard';
import ActionButton from '../components/hud/ActionButton';
import { getActiveSquadForStudent } from '../services/SquadService';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { 
    Sparkles, Send, AlertTriangle, Users, BookOpen, BrainCircuit, 
    CheckCircle2, Award, Zap, HelpCircle, Check, X, Timer, FileText, 
    Download, Star, ShieldAlert, Heart, MessageSquare, Paperclip, Lock, 
    RefreshCw, ChevronRight, Calculator, FlaskConical, Languages, Code2, 
    Landmark, Palette, Play, QrCode, ShieldCheck, Sun, Moon, Sunrise, 
    GraduationCap, Compass, Navigation, Shield, CompassIcon, Info, ThumbsUp, Smile,
    Camera, Image, Upload, Atom, Leaf, Globe, Cpu
} from 'lucide-react';

const AI_TUTORS = AULOCK_TUTORS;

const SUBJECT_PERFORMANCE = [
    { 
        subject: 'Matemáticas Avanzadas', 
        grade: '7.0', 
        level: 'Sobresaliente (Percentil 98)', 
        isStrong: true,
        feedback: '🎉 ¡Felicitaciones por tu esfuerzo! Tu rendimiento de 7.0 en Matemáticas demuestra que cuando te enfocas y aplicas tu rigor deductivo, alcanzas la excelencia. ¡Sigue inspirando a tu Squad Alfa!'
    },
    { 
        subject: 'Idiomas Extranjeros', 
        grade: '6.85', 
        level: 'Sobresaliente', 
        isStrong: true,
        feedback: '🎉 ¡Excelente trabajo! Mantienes una gran fluidez verbal e interpretación de textos. Continúa practicando conversación técnica con tu Tutor de Lenguaje e Inglés.'
    },
    { 
        subject: 'Historia & Formación Ciudadana', 
        grade: '6.35', 
        level: 'Bueno', 
        isStrong: true,
        feedback: '👏 ¡Buen desempeño! Tu participación en debates cívicos muestra un análisis analítico sólido.'
    },
    { 
        subject: 'Biología Orgánica', 
        grade: '4.38', 
        level: 'Área de Mejora', 
        isWeak: true,
        feedback: '💪 ¡No te desanimes! Un tropiezo en Biología Orgánica (4.38) no define tu potencial. Es solo una oportunidad para aprender algo nuevo. Tu Tutor de Ciencias y tu compañero Mateo Rojas están listos para apoyarte paso a paso.'
    }
];

const CIVIC_CAPSULES = [
    {
        category: '🚦 Seguridad Vial & Peatonal',
        tip: 'Cruza siempre por pasos peatonales demarcados, mira a ambos lados antes de avanzar y mantén la vista atenta en el entorno sin distracciones del celular.'
    },
    {
        category: '⚖️ Educación Cívica & Democracia',
        tip: 'La convivencia democrática se ejercita escuchando con respeto las opiniones divergentes de tu Squad y argumentando tus ideas con evidencia sólida.'
    },
    {
        category: '🧘 Cuidado Personal & Salud Mental',
        tip: 'Realiza pausas activas cada 45 minutos de estudio, mantente hidratado y duerme 8 horas diarias para consolidar la memoria y el bienestar de tu cerebro.'
    },
    {
        category: '🌐 Ciudadanía Digital Responsable',
        tip: 'Protege la privacidad de tus compañeros en redes sociales, verifica las fuentes de información antes de compartir y promueve un entorno libre de ciberbullying.'
    }
];

const MOTIVATIONAL_QUOTES = {
    morning: [
        "¡Buenos días! Hoy es un nuevo día para transformar la curiosidad en conocimiento.",
        "Cada ecuación que resuelves hoy acerca más tus metas universitarias.",
        "Tu disciplina de la mañana es la victoria de tu futuro."
    ],
    afternoon: [
        "¡Persevera! El trabajo en equipo con tu Squad Alfa multiplica tu potencial.",
        "Un tropiezo es solo el primer paso para dominar una nueva habilidad.",
        "Mantén el foco y recuerda tomar una pausa activa para hidratarte."
    ],
    evening: [
        "¡Gran jornada de estudio! Descansar adecuadamente consolida lo aprendido.",
        "El balance entre el esfuerzo académico y el descanso es la clave de la salud mental.",
        "Prepara tus metas para mañana y confía en tu proceso de crecimiento."
    ]
};

const EMOJI_OPTIONS = [
    { emoji: '😡', label: 'Enojado / Frustrado' },
    { emoji: '😔', label: 'Triste / Abrumado' },
    { emoji: '😐', label: 'Neutral / Regular' },
    { emoji: '😊', label: 'Alegre / Tranquilo' },
    { emoji: '🚀', label: 'Entusiasmado' }
];

const DEFAULT_LIVE_QUESTION = {
    id: 'q-default',
    text: '¿Cuál es el resultado de resolver la ecuación de segundo grado x² - 5x + 6 = 0?',
    question_type: 'alternatives',
    options: ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
    correct_answer: 'A) x = 2 y x = 3',
    timer_seconds: 45
};

const INITIAL_SQUAD_MESSAGES = [
    { id: '1', sender: 'Sofía Martínez', text: '¡Hola equipo! ¿Listos para repasar Cálculo y Biología?', time: '10:14' },
    { id: '2', sender: 'Mateo Rojas', text: 'Sí, ya tengo listos los ejercicios del capítulo 4.', time: '10:15' }
];

const StudentWorkspace = () => {
    const { profile } = useAuth();
    const { isPhoneInCase, currentSession, handleNfcEvent } = useFocusMode();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (window.history.state?.usr?.activeTab) {
            setActiveTab(window.history.state.usr.activeTab);
        }
    }, []);
    const [selectedTutor, setSelectedTutor] = useState(AI_TUTORS[0]);
    const [selectedGradeLevel, setSelectedGradeLevel] = useState('Senior High A');
    const [selectedOaId, setSelectedOaId] = useState('OA 06');

    // Dispatched Institutional Notice State
    const [dispatchedAlert, setDispatchedAlert] = useState(null);

    useEffect(() => {
        const checkDispatchedAlerts = () => {
            const saved = localStorage.getItem('aulock_teacher_dispatched_alert');
            if (saved) {
                try {
                    setDispatchedAlert(JSON.parse(saved));
                } catch (e) {
                    console.error(e);
                }
            } else {
                setDispatchedAlert(null);
            }
        };

        checkDispatchedAlerts();
        window.addEventListener('storage', checkDispatchedAlerts);
        window.addEventListener('aulock_dispatch_event', checkDispatchedAlerts);
        return () => {
            window.removeEventListener('storage', checkDispatchedAlerts);
            window.removeEventListener('aulock_dispatch_event', checkDispatchedAlerts);
        };
    }, []);

    // Synchronized Class Timer State in Student Workspace (Absolute Timestamp Clock)
    const [classTimer, setClassTimer] = useState(() => {
        const saved = localStorage.getItem('aulock_class_timer');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const isRunning = parsed.isRunning && parsed.targetEndTime && parsed.targetEndTime > Date.now();
                const remaining = parsed.targetEndTime 
                    ? Math.max(0, Math.ceil((parsed.targetEndTime - Date.now()) / 1000))
                    : (parsed.remainingSeconds !== undefined ? parsed.remainingSeconds : 600);
                return { ...parsed, isRunning, remainingSeconds: remaining };
            } catch (e) { console.error(e); }
        }
        return { remainingSeconds: 600, initialSeconds: 600, isRunning: false, targetEndTime: null };
    });

    useEffect(() => {
        const syncFromStorage = (e) => {
            let data = null;
            if (e && e.detail) {
                data = e.detail;
            } else {
                const saved = localStorage.getItem('aulock_class_timer');
                if (saved) {
                    try { data = JSON.parse(saved); } catch (err) {}
                }
            }
            if (data) {
                const isRunning = data.isRunning && data.targetEndTime && data.targetEndTime > Date.now();
                const remaining = data.targetEndTime 
                    ? Math.max(0, Math.ceil((data.targetEndTime - Date.now()) / 1000))
                    : (data.remainingSeconds !== undefined ? data.remainingSeconds : 600);
                setClassTimer({ ...data, isRunning, remainingSeconds: remaining });
            }
        };

        window.addEventListener('storage', syncFromStorage);
        window.addEventListener('aulock_timer_event', syncFromStorage);
        window.addEventListener('focus', syncFromStorage);
        document.addEventListener('visibilitychange', syncFromStorage);

        return () => {
            window.removeEventListener('storage', syncFromStorage);
            window.removeEventListener('aulock_timer_event', syncFromStorage);
            window.removeEventListener('focus', syncFromStorage);
            document.removeEventListener('visibilitychange', syncFromStorage);
        };
    }, []);

    useEffect(() => {
        let interval = null;
        if (classTimer.isRunning && classTimer.targetEndTime) {
            interval = setInterval(() => {
                const rem = Math.max(0, Math.ceil((classTimer.targetEndTime - Date.now()) / 1000));
                setClassTimer(prev => ({
                    ...prev,
                    remainingSeconds: rem,
                    isRunning: rem > 0
                }));
            }, 500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [classTimer.isRunning, classTimer.targetEndTime]);

    // Time-based Motivational Banner
    const [timeGreeting, setTimeGreeting] = useState({ period: 'morning', text: '', icon: Sunrise });
    const [civicIndex, setCivicIndex] = useState(0);

    // Live Question State
    const [liveQuestion, setLiveQuestion] = useState(() => {
        const saved = localStorage.getItem('aulock_active_question');
        return saved ? JSON.parse(saved) : DEFAULT_LIVE_QUESTION;
    });
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [writtenAnswer, setWrittenAnswer] = useState('');
    const [answerFeedback, setAnswerFeedback] = useState(null);

    // Squad Chat State
    const [squadMessages, setSquadMessages] = useState(INITIAL_SQUAD_MESSAGES);
    const [squadInput, setSquadInput] = useState('');
    const [sosAlertSent, setSosAlertSent] = useState(false);

    // Competence Passport State (Recharts RadarChart)
    const [competenceData, setCompetenceData] = useState([
        { axis: 'Cs. de la Vida', score: 6.1, fullMark: 7.0, classAverage: 5.4, color: '#10b981' },
        { axis: 'Cs. Físicas y Químicas', score: 5.3, fullMark: 7.0, classAverage: 5.1, color: '#f59e0b' },
        { axis: 'Tierra y Universo', score: 5.8, fullMark: 7.0, classAverage: 5.2, color: '#10b981' },
        { axis: 'Habilidades Científicas', score: 4.9, fullMark: 7.0, classAverage: 4.8, color: '#f59e0b' },
    ]);

    // Institutional Alert
    const [studentAlert, setStudentAlert] = useState(() => {
        const saved = localStorage.getItem('aulock_student_alert');
        return saved ? JSON.parse(saved) : null;
    });

    // Shared Files
    const [sharedFiles] = useState(() => {
        const saved = localStorage.getItem('aulock_shared_files');
        return saved ? JSON.parse(saved) : [
            { id: 'f-1', name: 'Guia_Ejercicios_Calculo_Diferencial.pdf', size: '2.4 MB', date: '2026-08-04', shared: true }
        ];
    });

    // Chat per Tutor
    const [chatMessages, setChatMessages] = useState([
        { sender: 'tutor', text: AI_TUTORS[0].greeting }
    ]);
    const [inputPrompt, setInputPrompt] = useState('');
    const chatEndRef = useRef(null);

    // Modals & Secret Teacher Rating State
    const [showEmojiCheckin, setShowEmojiCheckin] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [emojiReason, setEmojiReason] = useState('');
    const [checkinSaved, setCheckinSaved] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportCategory, setReportCategory] = useState('Acoso / Convivencia escolar');
    const [reportDetails, setReportDetails] = useState('');
    const [reportFile, setReportFile] = useState(null);

    const [showTeacherRatingModal, setShowTeacherRatingModal] = useState(false);
    const [teacherRatingEmoji, setTeacherRatingEmoji] = useState('😍');
    const [teacherRatingReview, setTeacherRatingReview] = useState('');
    const [teacherRatingSaved, setTeacherRatingSaved] = useState(false);

    // Passport State
    const [universityConsent, setUniversityConsent] = useState(true);

    // Motivational Cultural Banner State (MINEDUC 'Seamos Comunidad')
    const [bannerContent, setBannerContent] = useState(null);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const [showDeepReflection, setShowDeepReflection] = useState(false);

    useEffect(() => {
        const fetchBannerData = async () => {
            setIsBannerLoading(true);
            try {
                const message = await generateDailyCulturalMessage(profile?.id || 'STUDENT_JC98', selectedGradeLevel || '5º Básico');
                setBannerContent(message);
            } catch (error) {
                console.error("Error cargando mensaje cultural:", error);
                setBannerContent({
                    titulo_banner: "El Valor del Mes: La Empatía",
                    cuerpo_mensaje: "Trata a los demás como te gustaría ser tratado. Invita a alguien nuevo a tu grupo en el recreo.",
                    icono_sugerido: "🌱",
                    reflexion_profunda: "El diálogo cotidiano y el buen trato entre compañeros construyen comunidades escolares resilientes e inclusivas."
                });
            } finally {
                setIsBannerLoading(false);
            }
        };

        fetchBannerData();
    }, [selectedGradeLevel]);

    const handleSaveTeacherRating = (e) => {
        e.preventDefault();
        submitSecretTeacherRating({
            teacherName: 'Prof. María González',
            subject: 'Matemática Avanzada & Cálculo',
            emojiRating: teacherRatingEmoji,
            reviewText: teacherRatingReview,
            studentId: profile?.id || 'demo-st-1'
        });
        setTeacherRatingSaved(true);
        setTimeout(() => {
            setShowTeacherRatingModal(false);
            setTeacherRatingSaved(false);
            setTeacherRatingReview('');
            alert("🔒 Evaluación anónima enviada con éxito. Recuerda: este resultado es 100% privado y solo visible por la Dirección del Colegio.");
        }, 1200);
    };

    // Dynamic Time Greeting Initialization
    useEffect(() => {
        const hour = new Date().getHours();
        let period = 'morning';
        let icon = Sunrise;
        if (hour >= 12 && hour < 18) {
            period = 'afternoon';
            icon = Sun;
        } else if (hour >= 18 || hour < 6) {
            period = 'evening';
            icon = Moon;
        }
        const quotes = MOTIVATIONAL_QUOTES[period];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setTimeGreeting({ period, text: randomQuote, icon });
    }, []);

    // Projected Slide from Teacher NotebookLLM
    const [projectedSlide, setProjectedSlide] = useState(() => {
        const saved = localStorage.getItem('aulock_projected_slide');
        return saved ? JSON.parse(saved) : null;
    });

    // Sync live questions, alerts & projected slides
    useEffect(() => {
        const handleStorageChange = () => {
            const savedEvent = localStorage.getItem('aulock_active_question_event');
            if (savedEvent) {
                try {
                    const eventData = JSON.parse(savedEvent);
                    if (eventData.type === 'NEW_QUESTION') {
                        setLiveQuestion({
                            id: 'q-' + Date.now(),
                            text: eventData.data.question,
                            question_type: eventData.data.type,
                            options: eventData.data.options,
                            correct_answer: eventData.data.correct_answer || 'let x = 10',
                            timer_seconds: eventData.data.timeLimit
                        });
                        setSelectedAnswer(null);
                        setAnswerFeedback(null);
                        setWrittenAnswer('');
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing question event:", e);
                }
            }

            const savedQ = localStorage.getItem('aulock_active_question');
            if (savedQ) {
                setLiveQuestion(JSON.parse(savedQ));
                setSelectedAnswer(null);
                setAnswerFeedback(null);
                setWrittenAnswer('');
            }
            const savedA = localStorage.getItem('aulock_student_alert');
            setStudentAlert(savedA ? JSON.parse(savedA) : null);

            const savedS = localStorage.getItem('aulock_projected_slide');
            setProjectedSlide(savedS ? JSON.parse(savedS) : null);
        };

        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Google AI Learn Your Way Student Interest & Vision Camera Selection
    const [studentInterest, setStudentInterest] = useState('Fútbol ⚽');
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraInputRef = useRef(null);

    const handleSelectTutor = (tutor) => {
        setSelectedTutor(tutor);
        setChatMessages([{ sender: 'tutor', text: tutor.greeting }]);
        setCapturedImage(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendAiPrompt = async (e) => {
        e.preventDefault();
        if ((!inputPrompt.trim() && !capturedImage) || isGeneratingAi) return;

        const imageCopy = capturedImage;
        const promptCopy = inputPrompt || 'Analiza el ejercicio o problema de la imagen y guíame paso a paso.';

        const userMsg = { 
            sender: 'user', 
            text: promptCopy,
            image: imageCopy
        };
        
        setChatMessages(prev => [...prev, userMsg]);
        setInputPrompt('');
        setCapturedImage(null);
        setIsGeneratingAi(true);

        try {
            let responseText = '';
            if (imageCopy) {
                responseText = await analyzeExerciseImageWithGemini({
                    tutorId: selectedTutor.id,
                    tutorName: selectedTutor.name,
                    imageBase64: imageCopy,
                    mimeType: 'image/jpeg',
                    interest: studentInterest,
                    promptText: promptCopy
                });
            } else {
                responseText = await generateLearnYourWayResponse({
                    studentId: profile?.id || 'STUDENT_123',
                    tutorId: selectedTutor.id,
                    tutorName: selectedTutor.name,
                    tutorRole: selectedTutor.specialty,
                    topicOrQuestion: promptCopy,
                    userQuestion: promptCopy,
                    interest: studentInterest,
                    currentStudentLevelId: selectedGradeLevel,
                    currentOAId: selectedOaId,
                    chatHistory: chatMessages
                });
            }

            setChatMessages(prev => [...prev, {
                sender: 'tutor',
                text: responseText
            }]);
        } catch (err) {
            setChatMessages(prev => [...prev, {
                sender: 'tutor',
                text: `¡Hola! Como la GEM de ${selectedTutor.name}, he analizado tu consulta sobre "${promptCopy}" aplicando la guía Socrática con tu interés en ${studentInterest}.`
            }]);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleAnswerLiveQuestion = (option) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        const isCorrect = option === liveQuestion.correct_answer || option.startsWith(liveQuestion.correct_answer?.[0] || 'A');

        setAnswerFeedback({
            isCorrect,
            msg: isCorrect ? '¡Excelente! Respuesta Correcta (+10 AuCoins ganados)' : 'Respuesta entregada y registrada en tu perfil.'
        });

        recordStudentActivity({
            type: 'Pregunta en Vivo (Quiz)',
            title: liveQuestion.text.slice(0, 30),
            score: isCorrect ? 100 : 75,
            dimension: 'logic',
            details: option
        });
    };

    const [formativeFeedbackText, setFormativeFeedbackText] = useState(null);

    const handleSendWrittenAnswer = async (e) => {
        e.preventDefault();
        if (!writtenAnswer.trim() || selectedAnswer) return;

        setSelectedAnswer(writtenAnswer);
        setAnswerFeedback({
            isCorrect: true,
            msg: '¡Respuesta escrita enviada al docente y evaluada por la IA Formativa MINEDUC (+10 AuCoins)!'
        });

        // Generar Feedback Formativo Socrático UCE
        const feedback = await generateFormativeFeedback({
            studentAnswer: writtenAnswer,
            oaContext: {
                nivel: selectedGradeLevel,
                oa_descripcion: liveQuestion?.text || 'Objetivo de Aprendizaje evaluado en clase',
                indicadores_mineduc: [
                    { indicador_id: "IND_VIVO", descripcion: "Explican con sus palabras el razonamiento del ejercicio.", nivel_esperado: "Intermedio" }
                ]
            }
        });
        setFormativeFeedbackText(feedback);

        recordStudentActivity({
            type: 'Respuesta Escrita en Vivo',
            title: liveQuestion.text.slice(0, 30),
            score: 95,
            dimension: 'logic',
            details: writtenAnswer
        });
    };

    const handleSendSquadMessage = (e) => {
        e.preventDefault();
        if (!squadInput.trim()) return;

        setSquadMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: profile?.full_name || 'Juan Carlos Pérez',
            text: squadInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setSquadInput('');
    };

    const handleTriggerSos = () => {
        setSosAlertSent(true);
        alert("🆘 ¡Alerta SOS enviada a tus 2 compañeros de Squad y al Módulo Cuidador IA del Colegio!");
        setTimeout(() => setSosAlertSent(false), 5000);
    };

    const handleSaveCheckin = () => {
        if (!selectedEmoji) return alert("Por favor selecciona un emoji.");
        setCheckinSaved(true);
        recordStudentActivity({
            type: 'Check-in Emocional',
            title: `Ánimo: ${selectedEmoji.emoji} ${selectedEmoji.label}`,
            score: 85,
            dimension: 'resilience',
            details: emojiReason || 'Sin motivo adicional'
        });
        setTimeout(() => {
            setShowEmojiCheckin(false);
            setCheckinSaved(false);
            setSelectedEmoji(null);
            setEmojiReason('');
        }, 1500);
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        if (!reportDetails.trim()) return alert("Por favor describe la situación.");
        setTimeout(() => {
            setShowReportModal(false);
            setReportDetails('');
            setReportFile(null);
            alert("🛡️ Denuncia confidencial enviada de forma encriptada a la Dirección Escolar.");
        }, 1200);
    };

    const currentCivic = CIVIC_CAPSULES[civicIndex];
    const TimeIcon = timeGreeting.icon;

    return (
        <div className={`min-h-screen transition-all duration-700 ${isPhoneInCase ? 'bg-slate-950' : 'bg-slate-950'} text-slate-100 font-sans p-4 md:p-8 pt-6 md:pt-8 pb-32`}>
            {/* --- CONFIRMACIÓN VISUAL DE MODO ENFOQUE (Overlay Superior Pulsante) --- */}
            {isPhoneInCase && (
                <div className="mb-6 p-4 bg-sky-600 text-white rounded-3xl shadow-lg border border-sky-400 flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-3">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                        </span>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-wide">MODO ENFOQUE ACTIVADO (Funda AuLock NFC)</h4>
                            <p className="text-xs text-sky-100">Sesión en Vivo: {currentSession?.className || '4° Medio A - Ciencias MINEDUC'} • Asistencia Registrada</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleNfcEvent({ tagId: 'NFC_CASE_TOKEN_01', studentId: profile?.id || 'STUDENT_123' })}
                        className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl border border-white/40 transition-all"
                    >
                        Retirar Estuche (TAP OUT)
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- SYNCHRONIZED CLASSROOM TIMER BANNER FOR STUDENTS (ONLY ON OTHER TABS) --- */}
                {classTimer && classTimer.isRunning && activeTab !== 'live_classroom' && (
                    <div className="p-5 bg-slate-950/95 border-2 border-cyan-400 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono animate-fade-in">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl animate-bounce">⏱️</span>
                            <div>
                                <span className="text-[10px] text-cyan-300 font-bold font-orbitron uppercase block">LIVE TEACHER CLASSROOM TIMER IN PROGRESS</span>
                                <h3 className="text-sm font-bold text-white font-sans">Prof. Carlos Rivas / María González - Sesión Activa</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-cyan-500 shrink-0">
                            <span className="text-2xl font-black font-orbitron text-amber-300">
                                {String(Math.floor(classTimer.remainingSeconds / 60)).padStart(2, '0')}:{String(classTimer.remainingSeconds % 60).padStart(2, '0')}
                            </span>
                            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-600 animate-pulse">● LIVE SYNCED</span>
                        </div>
                    </div>
                )}

                {/* --- OFFICIAL DISPATCHED INSTITUTIONAL NOTICE BANNER --- */}
                {dispatchedAlert && (
                    <div className="p-5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg uppercase tracking-wider">
                                    🚨 OFFICIAL INSTITUTIONAL NOTICE
                                </span>
                                <span className="text-xs text-amber-300 font-bold">{dispatchedAlert.category}</span>
                            </div>
                            <p className="text-sm font-bold text-white font-sans">{dispatchedAlert.message}</p>
                            <span className="text-[10px] text-slate-400 block">Dispatched by: {dispatchedAlert.dispatchedBy} • {dispatchedAlert.date}</span>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('aulock_teacher_dispatched_alert');
                                setDispatchedAlert(null);
                                alert("✓ Official notice acknowledged and confirmed by student.");
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0"
                        >
                            Confirm Reading & Acknowledge
                        </button>
                    </div>
                )}

                {/* ==================== BARRA NAVEGACIÓN FIJA CYBERPUNK HUD (7 MÓDULOS) ==================== */}
                <HeaderNav activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* ==================== PÁGINA 1: MI PERFIL & BIENVENIDA (ESTILO EXACTO REFERENCIA) ==================== */}
                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* LAYOUT 3 COLUMNAS: SEAMOS COMUNIDAD | MARCO CIBERNÉTICO CENTRAL | ANALÍTICA ACADÉMICA */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                            
                            {/* COLUMNA IZQUIERDA: TARJETA SEAMOS COMUNIDAD MINEDUC */}
                            {/* LEFT COLUMN: WE ARE COMMUNITY CARD */}
                            <div className="col-span-1">
                                <DataCard title="We Are Community" colorBorder="cyan" icon="🌱">
                                    <p className="text-xs md:text-sm text-cyan-200 leading-relaxed italic">
                                        "{bannerContent?.cuerpo_mensaje || 'How do you show empathy today with a classmate who was alone? We invite you to: Invite someone new to join your group during recess.'}"
                                    </p>
                                    <button
                                        onClick={() => setShowDeepReflection(!showDeepReflection)}
                                        className="mt-4 text-xs text-cyan-300 hover:text-white underline underline-offset-4 decoration-dotted font-mono flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {showDeepReflection ? 'Hide reflection capsule' : '✨ View daily reflection capsule ▼'}
                                    </button>
                                    {showDeepReflection && (
                                        <div className="mt-3 p-4 bg-slate-900/90 rounded-2xl border border-cyan-500/40 text-xs text-cyan-100 font-sans shadow-inner">
                                            <p className="font-bold text-cyan-300 uppercase mb-1">Civic Reflection:</p>
                                            <p>{bannerContent?.reflexion_profunda || "Daily dialogue and respectful interaction among peers build resilient and inclusive school communities."}</p>
                                        </div>
                                    )}
                                </DataCard>
                            </div>

                            {/* CENTER COLUMN: CYBERPUNK PORTRAIT FRAME WITH PCB LINES */}
                            <div className="col-span-1 flex flex-col items-center">
                                <ProfileFrame
                                    imgSrc="/images/latino_student_portrait.jpg"
                                    name={profile?.full_name || 'Juan Carlos Pérez'}
                                    carrera="SENIOR HIGH // SAN AGUSTÍN HIGH SCHOOL, STEM SPECIALIZATION / ALFA STEM"
                                    badges={[
                                        { text: '★ 7.0 Logic & STEM', color: 'purple' },
                                        { text: '🌟 Alfa Peer Tutor Squad', color: 'yellow' },
                                        { text: '🛡️ Civic Education', color: 'blue' }
                                    ]}
                                />
                            </div>

                            {/* RIGHT COLUMN: ACADEMIC ANALYTICS & SOCRATIC PROGRESS */}
                            <div className="col-span-1">
                                <DataCard title="Academic Analytics" colorBorder="emerald" icon="📊">
                                    <div className="space-y-3 font-mono text-xs">
                                        <div className="flex justify-between items-center bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                                            <span className="text-slate-300">GPA / Overall Average:</span>
                                            <strong className="text-amber-300 text-xl font-orbitron">6.14</strong>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                                            <span className="text-slate-300">NFC Attendance:</span>
                                            <strong className="text-emerald-400 text-xs font-orbitron">100% RECORDED</strong>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                                            <span className="text-slate-300">Socratic Missions:</span>
                                            <strong className="text-cyan-300 text-xs font-orbitron">5/5 COMPLETED</strong>
                                        </div>
                                    </div>
                                </DataCard>
                            </div>

                        </div>

                        {/* BOTTOM ANGLED ACTION BUTTON BAR */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-cyan-900/50">
                            <ActionButton
                                icon="❓"
                                text="How do you feel today?"
                                color="yellow"
                                onClick={() => setShowEmojiCheckin(true)}
                            />
                            <ActionButton
                                icon="🔒"
                                text="Safe & Secure Report"
                                color="green"
                                onClick={() => setShowReportModal(true)}
                            />
                            <ActionButton
                                icon="⚙️"
                                text="Evaluate Class"
                                color="purple"
                                onClick={() => setShowTeacherRatingModal(true)}
                            />
                            <ActionButton
                                icon="🆘"
                                text="SOS Help Button"
                                color="red"
                                onClick={() => alert("🆘 Pedagogical help request sent to school staff.")}
                            />
                        </div>

                        {/* EMBEDDED TEASISTO EMOTIONAL SUPPORT & CALMING MODULE ON HOME DASHBOARD */}
                        <div className="pt-6 border-t border-cyan-900/50">
                            <TEAsisto />
                        </div>

                    </div>
                )}

                {/* ==================== PESTAÑA: UNIVERSO AFTER IA (5 MISIONES DE CAMPO & PORTAL) ==================== */}
                {activeTab === 'afteria' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <section className="relative my-2">
                            <div className="absolute -inset-2 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />
                            <AfterIAPortal activeTab={activeTab} setActiveTab={setActiveTab} />
                        </section>
                    </div>
                )}

                {/* ==================== PÁGINA 2: AULA EN VIVO & AUDITORÍA DE MODO ENFOQUE MÓVIL ==================== */}
                {activeTab === 'live_classroom' && (
                    <div className="animate-in fade-in duration-300">
                        {/* UNIFIED 3-TIER LIVE CLASSROOM & FOCUS HUD */}
                        <LiveClassroomStudentHUD />
                    </div>
                )}

                {/* ==================== PÁGINA 3: AGENTES TUTORES IA (PIZARRA SOCRÁTICA & CHAT DOCENTE) ==================== */}
                {activeTab === 'tutors' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* PIZARRA SOCRÁTICA DE ALTO RENDIMIENTO */}
                        <EliteSocraticWhiteboard />
                    </div>
                )}

                {/* ==================== PÁGINA 4: MI ESCUADRÓN ALFA ==================== */}
                {activeTab === 'squad' && (() => {
                    const currentSquad = getActiveSquadForStudent(profile?.name || 'Juan Carlos Pérez');
                    return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
                            <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-blue-900/20 p-6 flex flex-col h-[560px] shadow-xl justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-base">{currentSquad.name}</h3>
                                                <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300">
                                                    {currentSquad.course}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-0.5">
                                                {currentSquad.members?.length || 4} Integrantes Activos • {currentSquad.specialty || 'STEM & Aprendizaje Colaborativo'}
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleTriggerSos}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                                                sosAlertSent ? 'bg-rose-600 text-white animate-bounce' : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                                            }`}
                                        >
                                            <AlertTriangle className="w-4 h-4 text-rose-700" />
                                            <span>{sosAlertSent ? '¡SOS Enviado!' : '🆘 Botón SOS Squad'}</span>
                                        </button>
                                    </div>

                                    {currentSquad.pedagogical_rationale && (
                                        <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 font-sans leading-relaxed">
                                            💡 <strong>Sinergia de Equipo:</strong> {currentSquad.pedagogical_rationale}
                                        </div>
                                    )}

                                    <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                        {squadMessages.map(msg => (
                                            <div key={msg.id} className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-blue-900">{msg.sender}</span>
                                                    <span className="text-slate-500 font-mono">{msg.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-800">{msg.text}</p>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                </div>

                                <form onSubmit={handleSendSquadMessage} className="mt-4 flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={squadInput}
                                        onChange={e => setSquadInput(e.target.value)}
                                        placeholder="Escribe un mensaje para tus compañeros de Squad..."
                                        className="flex-1 bg-slate-100 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-900 outline-none focus:border-blue-900"
                                    />
                                    <button type="submit" className="p-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl transition-all shadow-md">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>

                            <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-blue-900/20 p-6 shadow-xl space-y-4">
                                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-purple-700" />
                                    <span>Compañeros de Equipo & Roles IA</span>
                                </h3>

                                <div className="space-y-3 text-xs">
                                    {currentSquad.members?.map((member, idx) => {
                                        const isCurrentUser = (member.name || '').toLowerCase().includes('juan carlos') || (member.name === profile?.name);
                                        return (
                                            <div key={idx} className="bg-slate-100 p-3 rounded-2xl border border-slate-200 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                        <span>{member.name}</span>
                                                        {isCurrentUser && <span className="text-[10px] text-blue-700 font-bold">(Tú)</span>}
                                                    </div>
                                                    <span className="text-[10px] font-mono font-bold text-amber-700">GPA {member.gpa || '6.5'}</span>
                                                </div>
                                                <div className="text-[11px] text-purple-800 font-semibold">
                                                    🏷️ {member.role || 'Mentor de Pares'}
                                                </div>
                                                <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                                                    <span>🌟 {member.best_subject || 'Matemáticas'}</span>
                                                    <span>Enfoque: {member.focus_metric || '95%'}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {currentSquad.synergies && currentSquad.synergies.length > 0 && (
                                    <div className="space-y-2 pt-2 border-t border-slate-200">
                                        <span className="text-[10px] text-purple-900 font-bold uppercase block">
                                            🤝 Mentoría Cruzada Activa:
                                        </span>
                                        {currentSquad.synergies.map((syn, i) => (
                                            <div key={i} className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-[10px] text-purple-900">
                                                <strong>{syn.mentor}</strong> ➔ <strong>{syn.apprentice}</strong>: {syn.reason || `Apoyo en ${syn.area}`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 🎮 NEXUS: ÁGORA DE CONVIVENCIA ESCOLAR & JUEGOS DE ARENA */}
                            <section className="col-span-1 lg:col-span-12 my-8 w-full">
                                <ClassroomArena isTeacher={false} />
                            </section>
                        </div>
                    );
                })()}

                {/* ==================== PÁGINA 5: MODO ENFOQUE MÓVIL AUDITORÍA & DESEMPEÑO POR RAMO ==================== */}
                {activeTab === 'academic' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* AUDITORÍA MODO ENFOQUE MÓVIL (AULOCK FOCUS) */}
                        <FocusModeAuditor />

                        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-blue-900/20 shadow-xl space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                                        <Award className="w-5 h-5 text-amber-600" />
                                        <span>Desempeño por Ramo & Guías Publicadas por Profesores</span>
                                    </h2>
                                    <p className="text-xs text-slate-600">Retroalimentación motivacional adaptativa e historial de guías descargables</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {SUBJECT_PERFORMANCE.map((item, idx) => (
                                    <div key={idx} className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                                        item.isWeak ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base">{item.subject}</h3>
                                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded mt-1 inline-block ${
                                                    item.isWeak ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                                                }`}>
                                                    {item.level}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-black text-slate-900 font-mono">{item.grade}</div>
                                        </div>

                                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                                            item.isWeak 
                                                ? 'bg-rose-100 border-rose-300 text-rose-950' 
                                                : 'bg-emerald-100 border-emerald-300 text-emerald-950'
                                        }`}>
                                            {item.feedback}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shared Study Guides Section */}
                            <div className="border-t border-slate-200 pt-6 space-y-4">
                                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-blue-900" />
                                    <span>Guías de Estudio & Materiales Publicados por Docentes ({sharedFiles.filter(f => f.shared).length})</span>
                                </h3>

                                <div className="space-y-3">
                                    {sharedFiles.filter(f => f.shared).map(file => (
                                        <div key={file.id} className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900">{file.name}</h4>
                                                <span className="text-[10px] text-slate-500">{file.size} • Publicado el {file.date}</span>
                                            </div>

                                            <button
                                                onClick={() => alert(`📥 Descargando archivo: ${file.name}`)}
                                                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Descargar PDF</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== PÁGINA 7: PASAPORTE AULOCK 2.0 & CREDENCIAL SOBERANA ==================== */}
                {activeTab === 'passport' && (
                    <div className="animate-in fade-in duration-300">
                        <AcademicPassport />
                    </div>
                )}

            </div>

            {/* PSYCHOLOGICAL WELLNESS EMOJI CHECK-IN MODAL */}
            {showEmojiCheckin && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                                    <Heart className="w-5 h-5 text-rose-400" />
                                    <span>Check-in de Bienestar Psicológico</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">¿Cómo te sientes en este momento?</p>
                            </div>
                            <button onClick={() => setShowEmojiCheckin(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                        </div>

                        {checkinSaved ? (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-emerald-300 text-xs font-bold animate-in fade-in">
                                ✓ ¡Gracias por compartir tu estado de ánimo! El Módulo Cuidador IA lo ha registrado.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-5 gap-2">
                                    {EMOJI_OPTIONS.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedEmoji(opt)}
                                            className={`p-3 rounded-2xl border text-2xl flex flex-col items-center justify-center transition-all ${
                                                selectedEmoji?.emoji === opt.emoji 
                                                    ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-lg' 
                                                    : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                                            }`}
                                            title={opt.label}
                                        >
                                            <span>{opt.emoji}</span>
                                        </button>
                                    ))}
                                </div>

                                {selectedEmoji && (
                                    <div className="text-center text-xs font-bold text-amber-300">
                                        Estado seleccionado: {selectedEmoji.label}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Motivo Opcional (¿Quieres contarnos más?):</label>
                                    <textarea
                                        value={emojiReason}
                                        onChange={e => setEmojiReason(e.target.value)}
                                        placeholder="Ej: Me siento algo frustrado con el laboratorio de Biología..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none h-20 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSaveCheckin}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                                >
                                    Guardar Estado de Ánimo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SECURE CONFIDENTIAL REPORT MODAL */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                                <h3 className="text-base font-bold text-white">Canal de Denuncia Segura & Confidencial</h3>
                            </div>
                            <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
                            <div>
                                <label className="block text-slate-400 uppercase font-bold mb-1">Categoría de la Denuncia</label>
                                <select 
                                    value={reportCategory}
                                    onChange={e => setReportCategory(e.target.value)}
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                                >
                                    <option value="Acoso / Convivencia escolar">Acoso / Convivencia Escolar</option>
                                    <option value="Ciberbullying">Ciberbullying</option>
                                    <option value="Irregularidad Académica">Irregularidad Académica</option>
                                    <option value="Otro">Otro Motivo Confidencial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 uppercase font-bold mb-1">Descripción de la Situación</label>
                                <textarea
                                    value={reportDetails}
                                    onChange={e => setReportDetails(e.target.value)}
                                    placeholder="Describe lo sucedido con el mayor detalle posible..."
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none h-24 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 uppercase font-bold mb-1">Adjuntar Archivo de Evidencia (PDF, Imagen, Audio)</label>
                                <input
                                    type="file"
                                    onChange={e => setReportFile(e.target.files[0])}
                                    className="w-full text-xs text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                            >
                                Enviar Denuncia Confidencial
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* SECRET TEACHER CLASS EVALUATION MODAL (SCHOOL DIRECTION ONLY) */}
            {showTeacherRatingModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                <h3 className="text-base font-bold text-white">Evaluación Secreta de Clase del Profesor</h3>
                            </div>
                            <button onClick={() => setShowTeacherRatingModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                        </div>

                        <div className="p-3 bg-indigo-950/80 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                            🔒 <strong>Garantía de Confidencialidad:</strong> Los resultados de esta evaluación son 100% secretos. No son visibles por el profesor ni por otros alumnos. Únicamente la Dirección del Colegio revisa este informe.
                        </div>

                        <form onSubmit={handleSaveTeacherRating} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-400 uppercase font-bold mb-1">Docente & Asignatura a Evaluar</label>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-white">
                                    Prof. María González (Matemática Avanzada & Cálculo)
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 uppercase font-bold mb-2">Calificación de la Clase (Selecciona Emoji)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { emoji: '😍', label: 'Excelente' },
                                        { emoji: '🙂', label: 'Buena' },
                                        { emoji: '😐', label: 'Regular' },
                                        { emoji: '🙁', label: 'Deficiente' }
                                    ].map((opt, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setTeacherRatingEmoji(opt.emoji)}
                                            className={`p-3 rounded-2xl border text-2xl flex flex-col items-center justify-center transition-all ${
                                                teacherRatingEmoji === opt.emoji 
                                                    ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-lg' 
                                                    : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                                            }`}
                                        >
                                            <span>{opt.emoji}</span>
                                            <span className="text-[9px] font-bold text-slate-300 mt-1">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 uppercase font-bold mb-1">Reseña u Opinión Privada para el Colegio (Opcional)</label>
                                <textarea
                                    value={teacherRatingReview}
                                    onChange={e => setTeacherRatingReview(e.target.value)}
                                    placeholder="Escribe lo que te pareció la clase, el ritmo o sugerencias privadas..."
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none h-24 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                            >
                                Enviar Evaluación Confidencial
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ÁREA DE SIMULACIÓN NFC (SOLO PARA DESARROLLO PC) --- */}
            <div className="fixed bottom-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-sky-200 z-50 text-xs text-slate-900 w-64 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between font-black text-sky-900 border-b border-slate-100 pb-1.5">
                    <span className="flex items-center space-x-1.5">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>Simulador NFC AuLock</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isPhoneInCase ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {isPhoneInCase ? 'ESTUCHE LOCK' : 'LIBRE'}
                    </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                    Simula tocar el chip NFC de la funda AuLock del alumno.
                </p>
                <button
                    onClick={() => handleNfcEvent({ tagId: 'NFC_CASE_TOKEN_01', studentId: profile?.id || 'STUDENT_123' })}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center space-x-2 ${
                        isPhoneInCase
                            ? 'bg-rose-600 hover:bg-rose-500 text-white'
                            : 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white'
                    }`}
                >
                    <QrCode className="w-4 h-4" />
                    <span>{isPhoneInCase ? 'TAP OUT (Retirar Celular)' : 'TAP IN (Insertar en Estuche)'}</span>
                </button>
            </div>

        </div>
    );
};

export default StudentWorkspace;
