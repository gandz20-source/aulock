import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, Zap, Award, Crown, Play, Pause, RotateCw, Plus, 
    Sparkles, Shield, Flame, Sword, Target, MessageSquare, 
    Clock, CheckCircle2, AlertTriangle, ChevronRight, Activity, 
    Share2, Compass, Radio, BarChart3, HelpCircle, Eye, RefreshCw
} from 'lucide-react';
import { generateArenaGamificationChallenge } from '../../services/GeminiService';
import { supabase } from '../../config/supabase';

// --- CURRICULUM TOPICS REGISTRY ---
export const CURRICULUM_UNITS = [
    { id: 'math-quad', label: '📐 Ecuaciones Cuadráticas & Parábolas (STEM)' },
    { id: 'bio-cells', label: '🧬 Biología Celular, Fotosíntesis & Ecosistemas' },
    { id: 'hist-ind', label: '🏛️ Revolución Industrial & Formación Ciudadana' },
    { id: 'lang-paes', label: '✍️ Argumentación, Falacias & Debate PAES' },
    { id: 'chem-reac', label: '🧪 Estequiometría & Reacciones Químicas' },
    { id: 'custom', label: '✨ Tema Personalizado / Unidad en Curso' }
];

// --- 10 SQUADS BASELINE DATASET (40 STUDENTS) ---
export const INITIAL_10_SQUADS = [
    { 
        id: 'sq-1', 
        name: 'Squad Alfa', 
        color: 'from-cyan-500 to-blue-600', 
        score: 450, 
        progress: 85, 
        status: 'Active', 
        damageDealt: 1000,
        speakerName: 'Juan Carlos Pérez',
        members: [
            { id: 'usr-1', name: 'Juan Carlos Pérez', role: 'Líder Lógico', isSpeaker: true },
            { id: 'usr-2', name: 'Mateo Rojas', role: 'Mentor de Pares', isSpeaker: false },
            { id: 'usr-3', name: 'Lucas Fernández', role: 'Colaborador Creativo', isSpeaker: false },
            { id: 'usr-4', name: 'Diego Morales', role: 'Coordinador Algorítmico', isSpeaker: false }
        ]
    },
    { 
        id: 'sq-2', 
        name: 'Squad Beta', 
        color: 'from-purple-500 to-indigo-600', 
        score: 420, 
        progress: 80, 
        status: 'Active', 
        damageDealt: 1000,
        speakerName: 'Sofía Martínez',
        members: [
            { id: 'usr-5', name: 'Sofía Martínez', role: 'Líder de Historia', isSpeaker: true },
            { id: 'usr-6', name: 'Camila Silva', role: 'Capitán de Debate', isSpeaker: false },
            { id: 'usr-7', name: 'Valentina Soto', role: 'Líder Científica', isSpeaker: false },
            { id: 'usr-8', name: 'Constanza Silva', role: 'Coordinadora Técnica', isSpeaker: false }
        ]
    },
    { id: 'sq-3', name: 'Squad Gamma', color: 'from-emerald-500 to-teal-600', score: 390, progress: 75, status: 'Active', damageDealt: 1000 },
    { id: 'sq-4', name: 'Squad Delta', color: 'from-amber-500 to-orange-600', score: 380, progress: 70, status: 'Active', damageDealt: 1000 },
    { id: 'sq-5', name: 'Squad Epsilon', color: 'from-rose-500 to-red-600', score: 410, progress: 80, status: 'Active', damageDealt: 1000 },
    { id: 'sq-6', name: 'Squad Zeta', color: 'from-fuchsia-500 to-pink-600', score: 360, progress: 65, status: 'Active', damageDealt: 1000 },
    { id: 'sq-7', name: 'Squad Eta', color: 'from-sky-500 to-cyan-600', score: 400, progress: 78, status: 'Active', damageDealt: 1000 },
    { id: 'sq-8', name: 'Squad Theta', color: 'from-violet-500 to-purple-600', score: 370, progress: 72, status: 'Active', damageDealt: 1000 },
    { id: 'sq-9', name: 'Squad Iota', color: 'from-lime-500 to-emerald-600', score: 440, progress: 82, status: 'Active', damageDealt: 1000 },
    { id: 'sq-10', name: 'Squad Kappa', color: 'from-yellow-500 to-amber-600', score: 350, progress: 60, status: 'Active', damageDealt: 1000 }
];

// --- GAME DEFINITIONS (MICRO VS MACRO) ---
export const GAME_MODES = {
    MICRO: [
        {
            id: 'PALABRA_PROHIBIDA',
            title: 'Palabra Prohibida (Tabú)',
            tagline: 'Oratoria & Síntesis Conceptual',
            description: 'Un integrante actúa como Orador y explica el concepto a su equipo sin pronunciar 4 palabras prohibidas.',
            icon: '🔤',
            color: 'cyan',
            defaultDuration: 180,
            cooperativeType: 'Micro-Squad (4 alumnos)'
        },
        {
            id: 'INFO_ASIMETRICA',
            title: 'Información Asimétrica (Puzzle)',
            tagline: 'Interdependencia Positiva Total',
            description: 'Cada alumno recibe un dato exclusivo en su pantalla. Ninguno puede resolver el problema solo.',
            icon: '🧩',
            color: 'indigo',
            defaultDuration: 300,
            cooperativeType: 'Micro-Squad (4 alumnos)'
        },
        {
            id: 'CONSENSO_OBLIGATORIO',
            title: 'Consenso Obligatorio',
            tagline: 'Negociación & Dilemas Éticos',
            description: 'El escuadrón debe debatir un dilema complejo y alcanzar una votación 100% unánime antes del tiempo límite.',
            icon: '🗳️',
            color: 'emerald',
            defaultDuration: 240,
            cooperativeType: 'Micro-Squad (4 alumnos)'
        }
    ],
    MACRO: [
        {
            id: 'DESAFIO_COLOSO',
            title: 'Desafío Coloso (Boss Raid)',
            tagline: '10 Squads vs Jefe Final del Curso',
            description: 'Toda la sala (40 alumnos) une fuerzas. Cada respuesta correcta de los 10 squads resta 1.000 HP al Coloso.',
            icon: '⚔️',
            color: 'rose',
            defaultDuration: 300,
            cooperativeType: 'Macro-Curso (40 alumnos / 10 Squads)'
        },
        {
            id: 'RED_EMBAJADORES',
            title: 'Red de Embajadores',
            tagline: 'Intercambio Físico en Sala',
            description: 'Un embajador de cada squad viaja físicamente a otro equipo para intercambiar estrategias y validar soluciones.',
            icon: '🌐',
            color: 'amber',
            defaultDuration: 420,
            cooperativeType: 'Macro-Curso (40 alumnos / 10 Squads)'
        },
        {
            id: 'TERMOMETRO_CIUDADANO',
            title: 'Termómetro Ciudadano',
            tagline: 'Debate Plenario & Votación Anónima',
            description: 'Tesis de controversia en vivo. La sala argumenta y calibra en tiempo real la temperatura del consenso democrático.',
            icon: '🌡️',
            color: 'fuchsia',
            defaultDuration: 240,
            cooperativeType: 'Macro-Curso (40 alumnos / 10 Squads)'
        }
    ]
};

export const CoexistenceTeacher = () => {
    // --- 1. HARDWIRED SELECTION & SETUP STATES ---
    const [activeScaleTab, setActiveScaleTab] = useState('MICRO'); // 'MICRO' | 'MACRO'
    const [selectedGame, setSelectedGame] = useState(GAME_MODES.MICRO[0]); // Direct game object state
    const [selectedTopicId, setSelectedTopicId] = useState('math-quad');
    const [customTopicText, setCustomTopicText] = useState('');
    const [durationSeconds, setDurationSeconds] = useState(GAME_MODES.MICRO[0].defaultDuration);
    const [difficulty, setDifficulty] = useState('Normal');
    const [autoAssignSquads, setAutoAssignSquads] = useState(false);
    const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

    // --- 2. LIVE GAME SESSION STATE ---
    const [activeSession, setActiveSession] = useState(() => {
        const saved = localStorage.getItem('aulock_arena_game_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.status === 'RUNNING' || parsed.status === 'PAUSED') {
                    return parsed;
                }
            } catch (e) {}
        }
        return null;
    });

    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [squadsList, setSquadsList] = useState(INITIAL_10_SQUADS);
    const [bossCurrentHp, setBossCurrentHp] = useState(10000);

    const activeTopicLabel = useMemo(() => {
        if (selectedTopicId === 'custom' && customTopicText) return customTopicText;
        const found = CURRICULUM_UNITS.find(u => u.id === selectedTopicId);
        return found ? found.label : 'Ecuaciones Cuadráticas & Matemáticas STEM';
    }, [selectedTopicId, customTopicText]);

    // --- 3. SUPABASE REALTIME & CLOCK SYNC ENGINE ---
    useEffect(() => {
        let interval = null;

        if (activeSession && activeSession.status === 'RUNNING' && activeSession.targetEndTime) {
            const syncTick = () => {
                const now = Date.now();
                const rem = Math.max(0, Math.ceil((activeSession.targetEndTime - now) / 1000));
                setRemainingSeconds(rem);

                if (rem === 0) {
                    handleFinishSession(true);
                }
            };

            syncTick();
            interval = setInterval(syncTick, 500);
        }

        // Setup Supabase Realtime channel
        const channel = supabase
            .channel('coexistence_nexus_arena')
            .on('broadcast', { event: 'student_answer_submitted' }, ({ payload }) => {
                console.log('📡 Realtime: Student response received:', payload);
                if (payload) {
                    if (payload.isCorrect && payload.damage) {
                        handleBossAttack(payload.damage);
                    }
                }
            })
            .subscribe();

        const handleStorageSync = (e) => {
            let data = null;
            if (e && e.detail && e.detail.session) {
                data = e.detail.session;
            } else {
                const saved = localStorage.getItem('aulock_arena_game_session');
                if (saved) {
                    try { data = JSON.parse(saved); } catch (err) {}
                }
            }

            if (data) {
                setActiveSession(data);
                if (data.targetEndTime) {
                    setRemainingSeconds(Math.max(0, Math.ceil((data.targetEndTime - Date.now()) / 1000)));
                }
                if (data.ai_context?.bossTotalHp || data.gameData?.bossTotalHp) {
                    const total = data.ai_context?.bossTotalHp || data.gameData?.bossTotalHp;
                    const current = data.ai_context?.bossCurrentHp ?? data.gameData?.bossCurrentHp ?? total;
                    setBossCurrentHp(current);
                }
            } else {
                setActiveSession(null);
            }
        };

        window.addEventListener('storage', handleStorageSync);
        window.addEventListener('aulock_arena_game_event', handleStorageSync);

        return () => {
            if (interval) clearInterval(interval);
            supabase.removeChannel(channel);
            window.removeEventListener('storage', handleStorageSync);
            window.removeEventListener('aulock_arena_game_event', handleStorageSync);
        };
    }, [activeSession?.status, activeSession?.targetEndTime]);

    // --- 4. REALTIME BROADCAST HELPER ---
    const broadcastSession = (sessionData) => {
        // 1. LocalStorage & Window Custom Events (instant local sync)
        localStorage.setItem('aulock_arena_game_session', JSON.stringify(sessionData));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_arena_game_event', { detail: { session: sessionData } }));

        // 2. Supabase Realtime Broadcast (multi-device network sync)
        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'arena_session_update',
                        payload: sessionData
                    });
                }
            });
        } catch (err) {
            console.warn("Supabase Realtime broadcast fallback:", err);
        }
    };

    // --- 5. LAUNCH GAME ACTION WITH STRUCTURED JSON PAYLOAD ---
    const handleLaunchGame = async () => {
        setIsGeneratingWithAI(true);

        try {
            // Generate dynamic content with Gemini 2.5 Flash
            const dynamicAiContext = await generateArenaGamificationChallenge({
                gameId: selectedGame.id,
                gameTitle: selectedGame.title,
                topic: activeTopicLabel,
                difficulty,
                durationMinutes: Math.ceil(durationSeconds / 60)
            });

            const now = Date.now();
            const targetEndTime = now + (durationSeconds * 1000);

            // Construct strictly valid JSON payload
            const sessionPayload = {
                sessionId: 'ARENA_SESSION_' + now,
                game_id: selectedGame.id,
                gameId: selectedGame.id,
                gameTitle: selectedGame.title,
                gameIcon: selectedGame.icon,
                scale: activeScaleTab,
                topic: activeTopicLabel,
                difficulty,
                duration: durationSeconds,
                durationSeconds,
                startTime: now,
                targetEndTime,
                status: 'RUNNING',
                speakerName: 'Juan Carlos Pérez',
                speakerId: 'usr-1',
                ai_context: dynamicAiContext,
                gameData: dynamicAiContext,
                squads: INITIAL_10_SQUADS,
                launchedBy: 'Prof. Carlos Rivas'
            };

            broadcastSession(sessionPayload);
            setActiveSession(sessionPayload);
            setRemainingSeconds(durationSeconds);
            setSquadsList(INITIAL_10_SQUADS);
            if (dynamicAiContext.bossTotalHp) setBossCurrentHp(dynamicAiContext.bossTotalHp);

        } catch (err) {
            console.error("Error launching arena game:", err);
            alert("Error al conectar con la IA. Se ha iniciado la sesión con contenido de respaldo.");
        } finally {
            setIsGeneratingWithAI(false);
        }
    };

    // --- 6. MASTER GM CONTROLS ---
    const handleTogglePause = () => {
        if (!activeSession) return;

        if (activeSession.status === 'RUNNING') {
            const updated = {
                ...activeSession,
                status: 'PAUSED',
                pausedRemaining: remainingSeconds,
                targetEndTime: null
            };
            broadcastSession(updated);
            setActiveSession(updated);
        } else if (activeSession.status === 'PAUSED') {
            const remSec = activeSession.pausedRemaining || 60;
            const targetEndTime = Date.now() + (remSec * 1000);
            const updated = {
                ...activeSession,
                status: 'RUNNING',
                targetEndTime,
                pausedRemaining: null
            };
            broadcastSession(updated);
            setActiveSession(updated);
        }
    };

    const handleAdd30Seconds = () => {
        if (!activeSession || activeSession.status !== 'RUNNING') return;
        const newTargetEndTime = (activeSession.targetEndTime || Date.now()) + 30000;
        const updated = {
            ...activeSession,
            targetEndTime: newTargetEndTime
        };
        broadcastSession(updated);
        setActiveSession(updated);
    };

    const handleFinishSession = (autoEnded = false) => {
        if (!autoEnded && !window.confirm("¿Deseas finalizar la ronda actual y consolidar los puntos del curso?")) {
            return;
        }

        const completedPayload = {
            ...activeSession,
            status: 'FINISHED',
            finishedAt: new Date().toISOString()
        };

        broadcastSession(completedPayload);
        setActiveSession(null);
        alert("🎉 ¡Dinámica completada con éxito! Se han abonado los Puntos de Sinergia (PS) a todos los escuadrones.");
    };

    const handleBossAttack = (damage = 1000) => {
        setBossCurrentHp(prev => {
            const nextHp = Math.max(0, prev - damage);
            const updated = {
                ...activeSession,
                ai_context: {
                    ...activeSession.ai_context,
                    bossCurrentHp: nextHp
                },
                gameData: {
                    ...activeSession.gameData,
                    bossCurrentHp: nextHp
                }
            };
            broadcastSession(updated);
            return nextHp;
        });
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // =========================================================================
    // RENDER 1: LIVE PROJECTOR DASHBOARD (TEACHER ACTIVE VIEW)
    // =========================================================================
    if (activeSession && (activeSession.status === 'RUNNING' || activeSession.status === 'PAUSED')) {
        const gameData = activeSession.ai_context || activeSession.gameData || {};
        const isPaused = activeSession.status === 'PAUSED';

        return (
            <div className="w-full bg-slate-950 text-white font-mono rounded-3xl border-2 border-emerald-500/60 p-5 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-6 animate-in fade-in duration-300">
                
                {/* PROJECTOR HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-emerald-900/60">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                            {selectedGame?.icon || '🎮'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                                    ● EN VIVO // PROYECTOR DE AULA
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 font-sans">
                                    {activeSession.scale === 'MICRO' ? '🤝 MODO SQUAD (4 INTEGRANTES)' : '⚔️ MODO COLOSO (CURSO COMPLETO)'}
                                </span>
                            </div>
                            <h1 className="text-lg md:text-2xl font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                                {activeSession.gameTitle}
                            </h1>
                            <p className="text-xs text-emerald-300/90 font-sans">
                                📌 Unidad Curricular: <strong>{activeSession.topic}</strong> • Nivel: <strong>{activeSession.difficulty}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Massive Countdown Clock */}
                    <div className="flex items-center gap-4 bg-slate-900/95 border-2 border-emerald-500/80 px-6 py-3 rounded-2xl shadow-xl">
                        <Clock className={`w-7 h-7 ${remainingSeconds < 60 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">TIEMPO RESTANTE</span>
                            <span className={`text-3xl md:text-4xl font-black font-orbitron tracking-widest ${remainingSeconds < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                                {formatTime(remainingSeconds)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TEACHER MASTER CONTROLS */}
                <div className="p-4 bg-slate-900/90 border border-emerald-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-bold font-orbitron">// CONTROLES MASTER GM:</span>
                        <span className="text-[10px] text-slate-400 font-sans">Gestión directa de la dinámica en sala</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleTogglePause}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer flex items-center gap-1.5 ${
                                isPaused 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                    : 'bg-amber-600/90 hover:bg-amber-500 text-white'
                            }`}
                        >
                            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                            <span>{isPaused ? 'REANUDAR' : 'PAUSAR JUEGO'}</span>
                        </button>

                        <button
                            onClick={handleAdd30Seconds}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 font-orbitron"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+30 SEG</span>
                        </button>

                        <button
                            onClick={() => handleFinishSession(false)}
                            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer shadow-md font-orbitron"
                        >
                            🛑 FINALIZAR RONDA
                        </button>
                    </div>
                </div>

                {/* GAME SPECIFIC TELEMETRY DISPLAY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: ACTIVE GAME CONTENT */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* 🔤 PALABRA PROHIBIDA VIEW */}
                        {activeSession.game_id === 'PALABRA_PROHIBIDA' && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/70 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 uppercase">
                                        DESAFÍO TABÚ // ORADOR DESIGNADO: {activeSession.speakerName}
                                    </span>
                                    <span className="text-xs text-amber-300 font-bold font-orbitron">+100 PS / ACIERTO</span>
                                </div>

                                <div className="text-center py-4 bg-slate-950/80 rounded-2xl border border-cyan-500/40">
                                    <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">PALABRA SECRETA (PROYECTOR GM)</span>
                                    <strong className="text-3xl md:text-4xl font-orbitron font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                                        {gameData.secretWord || 'PARÁBOLA'}
                                    </strong>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs text-rose-400 font-bold uppercase flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        <span>4 PALABRAS PROHIBIDAS (TABÚ):</span>
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(gameData.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE']).map((word, i) => (
                                            <div key={i} className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-center font-bold text-rose-200 text-sm tracking-wide">
                                                🚫 {word}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-950/90 rounded-xl border border-cyan-800 text-xs text-cyan-300 font-sans">
                                    💡 <strong>Pista para el equipo:</strong> {gameData.hint || 'Concepto clave de la función cuadrática.'}
                                </div>
                            </div>
                        )}

                        {/* 🧩 INFORMACIÓN ASIMÉTRICA VIEW */}
                        {activeSession.game_id === 'INFO_ASIMETRICA' && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-indigo-500/70 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 uppercase">
                                        PUZZLE COOPERATIVO ASIMÉTRICO
                                    </span>
                                    <span className="text-xs text-amber-300 font-bold font-orbitron">4 PISTAS DISTRIBUIDAS</span>
                                </div>

                                <div className="p-4 bg-slate-950/90 rounded-2xl border border-indigo-500/40 space-y-1">
                                    <span className="text-[10px] text-indigo-400 font-bold uppercase">OBJETIVO CENTRAL DE LA SALA</span>
                                    <h3 className="text-sm font-bold text-white font-sans">
                                        {gameData.mainObjective || 'Calcular la altura máxima y punto de inflexión'}
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs text-indigo-300 font-bold uppercase block">// DISTRIBUCIÓN DE ROLES IA:</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {(gameData.roleClues || [
                                            { role: 'Líder Lógico', clue: 'Velocidad inicial v0 = 20 m/s' },
                                            { role: 'Mentor de Pares', clue: 'Ecuación: h(t) = v0·t - 0.5·g·t²' },
                                            { role: 'Colaborador Creativo', clue: 'Gravedad efectiva g = 10 m/s²' },
                                            { role: 'Coordinador Algorítmico', clue: 'Tiempo en la cima: t = 2 seg' }
                                        ]).map((clueObj, idx) => (
                                            <div key={idx} className="p-3 bg-slate-950 border border-indigo-800/80 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-cyan-300 uppercase block font-orbitron">
                                                    🏷️ {clueObj.role}
                                                </span>
                                                <p className="text-xs text-slate-200 font-sans">{clueObj.clue}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ⚔️ DESAFÍO COLOSO VIEW */}
                        {activeSession.game_id === 'DESAFIO_COLOSO' && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-rose-500/70 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-700 uppercase">
                                        BOSS RAID // 10 SQUADS VS JEFE FINAL
                                    </span>
                                    <span className="text-xs text-rose-400 font-bold font-orbitron">
                                        HP: {bossCurrentHp.toLocaleString()} / 10,000
                                    </span>
                                </div>

                                <div className="text-center py-4 bg-slate-950 rounded-2xl border border-rose-500/40 relative overflow-hidden">
                                    <span className="text-5xl mb-2 block">{gameData.bossAvatar || '👹'}</span>
                                    <h2 className="text-xl font-orbitron font-black text-rose-300 tracking-wider">
                                        {gameData.bossName || 'KRÓNOS // El Titán de la Entropía'}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-sans max-w-md mx-auto mt-1">
                                        {gameData.bossLore || 'El Coloso amenaza la sala. ¡Los 10 squads deben atacarlo en simultáneo!'}
                                    </p>

                                    {/* Boss Health Bar */}
                                    <div className="w-11/12 mx-auto bg-slate-900 rounded-full h-4 border border-rose-900 overflow-hidden mt-4 shadow-inner">
                                        <div 
                                            className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]" 
                                            style={{ width: `${(bossCurrentHp / 10000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2 pt-2">
                                    <button
                                        onClick={() => handleBossAttack(1000)}
                                        className="px-4 py-2 bg-rose-900/80 hover:bg-rose-800 border border-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer font-orbitron"
                                    >
                                        💥 Simular Impacto de Squad (-1.000 HP)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 🗳️ / 🌐 / 🌡️ OTHER MODES */}
                        {(activeSession.game_id === 'CONSENSO_OBLIGATORIO' || activeSession.game_id === 'TERMOMETRO_CIUDADANO' || activeSession.game_id === 'RED_EMBAJADORES') && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/70 shadow-xl space-y-4">
                                <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 uppercase">
                                    DIÁLOGO & DEBATE PLENARIO
                                </span>
                                <h3 className="text-base font-bold text-white font-sans">
                                    {gameData.dilemmaTitle || gameData.debateThesis || gameData.missionTitle || 'Debate en Vivo'}
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                    {gameData.scenario || gameData.reflectionPrompt || gameData.instructions || 'Analicen en escuadrones antes de registrar el consenso.'}
                                </p>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: 10 SQUADS LIVE LEADERBOARD */}
                    <div className="lg:col-span-5 p-5 bg-slate-900/90 rounded-2xl border border-emerald-500/40 shadow-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-2.5">
                            <span className="text-xs font-orbitron font-bold text-emerald-300 uppercase">
                                // TABLA DE 10 SQUADS EN SALA (40 ALUMNOS)
                            </span>
                            <span className="text-[10px] text-cyan-300 font-bold">100% CONECTADOS</span>
                        </div>

                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                            {squadsList.map((sq, idx) => (
                                <div key={sq.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center font-orbitron shrink-0">
                                            {idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <span className="text-xs font-bold text-white block truncate">{sq.name}</span>
                                            <span className="text-[9px] text-slate-400 font-sans">4 Alumnos Activos</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-20 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                                            <div className={`h-full bg-gradient-to-r ${sq.color}`} style={{ width: `${sq.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs font-orbitron font-black text-amber-300">{sq.score} PS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        );
    }

    // =========================================================================
    // RENDER 2: GAME MASTER LAUNCHPAD SETUP VIEW
    // =========================================================================
    return (
        <div className="w-full bg-slate-950 text-white font-mono rounded-3xl border-2 border-emerald-500/60 p-5 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.25)] space-y-6">
            
            {/* LAUNCHPAD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-emerald-900/60">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                        🚀
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                                AULOCK ARENA // GAME MASTER LAUNCHPAD
                            </span>
                            <span className="text-[10px] text-slate-400 font-sans">
                                (Capacidad: 40 Alumnos / 10 Escuadrones)
                            </span>
                        </div>
                        <h1 className="text-lg md:text-2xl font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                            Ágora de Convivencia & Dinámicas en Sala
                        </h1>
                        <p className="text-xs text-slate-400 font-sans">
                            Selecciona una dinámica en el catálogo, vincula la unidad curricular y lanza la ronda con Gemini 2.5 Flash.
                        </p>
                    </div>
                </div>

                {/* SCALE SELECTOR TABS (MICRO VS MACRO) */}
                <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-emerald-500/40">
                    <button
                        onClick={() => {
                            setActiveScaleTab('MICRO');
                            setSelectedGame(GAME_MODES.MICRO[0]);
                            setDurationSeconds(GAME_MODES.MICRO[0].defaultDuration);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer ${
                            activeScaleTab === 'MICRO' 
                                ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        🤝 MODO SQUAD (Micro - 4 Integrantes)
                    </button>
                    <button
                        onClick={() => {
                            setActiveScaleTab('MACRO');
                            setSelectedGame(GAME_MODES.MACRO[0]);
                            setDurationSeconds(GAME_MODES.MACRO[0].defaultDuration);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer ${
                            activeScaleTab === 'MACRO' 
                                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        ⚔️ MODO COLOSO (Macro - Curso Completo)
                    </button>
                </div>
            </div>

            {/* MAIN TWO-COLUMN LAYOUT: GAMES GRID (LEFT 60%) & QUICK-LAUNCH SETUP (RIGHT 40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 🎮 LEFT COLUMN (60%): HARDWIRED GAME SELECTION CARDS */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-orbitron font-bold text-emerald-300 uppercase">
                            // CATÁLOGO DE DINÁMICAS ({activeScaleTab === 'MICRO' ? 'ENFOQUE MICRO-EQUIPO' : 'ENFOQUE MACRO-COLECTIVO'})
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">Haz clic para seleccionar</span>
                    </div>

                    <div className="space-y-3">
                        {(activeScaleTab === 'MICRO' ? GAME_MODES.MICRO : GAME_MODES.MACRO).map((gameItem) => {
                            const isSelected = selectedGame.id === gameItem.id;

                            return (
                                <div
                                    key={gameItem.id}
                                    onClick={() => {
                                        setSelectedGame(gameItem);
                                        setDurationSeconds(gameItem.defaultDuration);
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                                        isSelected
                                            ? 'bg-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[1.01]'
                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                        {gameItem.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-orbitron font-bold text-sm text-white">{gameItem.title}</h3>
                                            <span className="text-[9px] font-bold bg-slate-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full uppercase">
                                                {gameItem.cooperativeType}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-cyan-300 font-medium block mt-0.5">{gameItem.tagline}</span>
                                        <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                                            {gameItem.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 🚀 RIGHT COLUMN (40%): THE QUICK-LAUNCH SETUP PANEL */}
                <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border-2 border-emerald-500/50 p-6 shadow-2xl space-y-5 flex flex-col justify-between">
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-400" />
                                <h3 className="text-xs font-orbitron font-bold text-white uppercase">
                                    CONFIGURACIÓN RÁPIDA DE LANZAMIENTO
                                </h3>
                            </div>
                            <span className="text-[10px] text-amber-300 font-bold font-mono">IA LISTA</span>
                        </div>

                        {/* Selected Game Preview Pill (DIRECTLY DRIVEN BY selectedGame STATE) */}
                        <div className="p-3.5 bg-slate-950 rounded-2xl border-2 border-emerald-500/60 flex items-center gap-3.5 shadow-inner">
                            <span className="text-3xl">{selectedGame.icon}</span>
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">JUEGO SELECCIONADO</span>
                                <strong className="text-sm font-orbitron font-bold text-emerald-300 block truncate">{selectedGame.title}</strong>
                                <span className="text-[10px] text-slate-400 font-sans truncate block">{selectedGame.tagline}</span>
                            </div>
                        </div>

                        {/* 1. Topic Selector Linked to Class Unit */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase font-orbitron flex items-center justify-between">
                                <span>📚 UNIDAD CURRICULAR / TEMA DE LA CLASE:</span>
                                <span className="text-emerald-400">Gemini 2.5</span>
                            </label>
                            <select
                                value={selectedTopicId}
                                onChange={(e) => setSelectedTopicId(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-emerald-400 font-sans"
                            >
                                {CURRICULUM_UNITS.map(u => (
                                    <option key={u.id} value={u.id}>{u.label}</option>
                                ))}
                            </select>

                            {selectedTopicId === 'custom' && (
                                <input
                                    type="text"
                                    value={customTopicText}
                                    onChange={(e) => setCustomTopicText(e.target.value)}
                                    placeholder="Escribe el tema específico para la IA..."
                                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-sans mt-2"
                                />
                            )}
                        </div>

                        {/* 2. Time Controls (Quick-select & Slider) */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase font-orbitron">
                                <span className="text-slate-300">⏱️ DURACIÓN DE LA DINÁMICA:</span>
                                <span className="text-amber-300 font-bold text-xs">{formatTime(durationSeconds)}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: '1 min', sec: 60 },
                                    { label: '3 min', sec: 180 },
                                    { label: '5 min', sec: 300 },
                                    { label: '10 min', sec: 600 }
                                ].map((t) => (
                                    <button
                                        key={t.sec}
                                        type="button"
                                        onClick={() => setDurationSeconds(t.sec)}
                                        className={`py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer ${
                                            durationSeconds === t.sec
                                                ? 'bg-emerald-600 text-slate-950 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Advanced Toggles (Difficulty & Auto-assign) */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase font-orbitron">DIFICULTAD IA:</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-emerald-400 font-mono"
                                >
                                    <option value="Fácil">Fácil (Formativo)</option>
                                    <option value="Normal">Normal (Equilibrado)</option>
                                    <option value="Desafío Alto">Desafío Alto (PAES)</option>
                                    <option value="Titán">Nivel Titán (Experto)</option>
                                </select>
                            </div>

                            <div className="space-y-1 flex flex-col justify-end">
                                <label className="text-[10px] font-bold text-slate-400 uppercase font-orbitron">MEZCLA IA:</label>
                                <button
                                    type="button"
                                    onClick={() => setAutoAssignSquads(!autoAssignSquads)}
                                    className={`w-full p-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer border ${
                                        autoAssignSquads 
                                            ? 'bg-indigo-950 border-indigo-400 text-indigo-300' 
                                            : 'bg-slate-950 border-slate-800 text-slate-400'
                                    }`}
                                >
                                    {autoAssignSquads ? '✓ Auto-Mix Squads' : '○ Squads Actuales'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 🚀 THE MASSIVE GLOWING ACTION BUTTON */}
                    <div className="pt-4 border-t border-emerald-900/60">
                        <button
                            type="button"
                            disabled={isGeneratingWithAI}
                            onClick={handleLaunchGame}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-sm md:text-base rounded-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 animate-pulse"
                        >
                            {isGeneratingWithAI ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                                    <span>GENERANDO CON GEMINI 2.5 FLASH...</span>
                                </>
                            ) : (
                                <>
                                    <span>🚀 LANZAR DINÁMICA AL CURSO</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default CoexistenceTeacher;
