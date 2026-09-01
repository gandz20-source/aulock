import React, { useState, useEffect, useMemo } from 'react';
import { 
    Clock, AlertTriangle, Send, CheckCircle2, 
    Sparkles, Shield, Trophy, Activity, MessageSquare,
    BookOpen, ChevronDown, ChevronUp, Check, ThumbsUp, ThumbsDown, Scale
} from 'lucide-react';
import { supabase } from '../../config/supabase';

export const CoexistenceStudent = ({ profile }) => {
    const studentName = profile?.nombre || profile?.full_name || 'Juan Carlos Pérez';
    const studentRole = 'Líder Lógico'; // Default student role in Squad Alfa

    // --- STRICT BINARY STATE: NULL (IDLE) OR ACTIVE GAME OBJECT ---
    const [activeGame, setActiveGame] = useState(() => {
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
    const [showRulesGuide, setShowRulesGuide] = useState(false);

    // --- INTERACTIVE RESPONSE STATES PER GAME ---
    // 1. Tabú (Palabra Prohibida)
    const [studentGuessInput, setStudentGuessInput] = useState('');
    const [guessHistory, setGuessHistory] = useState([]);
    const [guessFeedback, setGuessFeedback] = useState(null);

    // 2. Información Asimétrica (Puzzle)
    const [puzzleAnswerInput, setPuzzleAnswerInput] = useState('');
    const [puzzleSubmitted, setPuzzleSubmitted] = useState(false);
    const [puzzleFeedback, setPuzzleFeedback] = useState(null);

    // 3. Consenso Obligatorio
    const [selectedConsensusOption, setSelectedConsensusOption] = useState(null);
    const [consensusVoteSubmitted, setConsensusVoteSubmitted] = useState(false);

    // 4. Desafío Coloso (Boss Raid)
    const [colosoAnswer, setColosoAnswer] = useState('');
    const [colosoAttacked, setColosoAttacked] = useState(false);

    // 5. Red de Embajadores
    const [ambassadorStrategyInput, setAmbassadorStrategyInput] = useState('');
    const [ambassadorSubmitted, setAmbassadorSubmitted] = useState(false);

    // 6. Termómetro Ciudadano
    const [selectedStance, setSelectedStance] = useState(null);
    const [debateArgument, setDebateArgument] = useState('');
    const [stanceSubmitted, setStanceSubmitted] = useState(false);

    // --- SUPABASE REALTIME & SYNC ENGINE ---
    useEffect(() => {
        let interval = null;

        if (activeGame && activeGame.status === 'RUNNING' && activeGame.targetEndTime) {
            const syncTick = () => {
                const now = Date.now();
                const rem = Math.max(0, Math.ceil((activeGame.targetEndTime - now) / 1000));
                setRemainingSeconds(rem);
            };

            syncTick();
            interval = setInterval(syncTick, 500);
        }

        // 1. Subscribe to Supabase Realtime channel
        const channel = supabase
            .channel('coexistence_nexus_arena')
            .on('broadcast', { event: 'arena_session_update' }, ({ payload }) => {
                console.log('📡 Realtime Student: Payload received:', payload);
                if (payload) {
                    if (payload.status === 'FINISHED') {
                        setActiveGame(null);
                        resetAllForms();
                    } else {
                        setActiveGame(payload);
                        if (payload.targetEndTime) {
                            setRemainingSeconds(Math.max(0, Math.ceil((payload.targetEndTime - Date.now()) / 1000)));
                        }
                    }
                }
            })
            .subscribe();

        // 2. Storage and custom events for multi-tab resilience
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

            if (data && (data.status === 'RUNNING' || data.status === 'PAUSED')) {
                setActiveGame(data);
                if (data.targetEndTime) {
                    setRemainingSeconds(Math.max(0, Math.ceil((data.targetEndTime - Date.now()) / 1000)));
                }
            } else {
                setActiveGame(null);
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
    }, [activeGame?.status, activeGame?.targetEndTime]);

    const resetAllForms = () => {
        setStudentGuessInput('');
        setGuessHistory([]);
        setGuessFeedback(null);
        setPuzzleAnswerInput('');
        setPuzzleSubmitted(false);
        setPuzzleFeedback(null);
        setSelectedConsensusOption(null);
        setConsensusVoteSubmitted(false);
        setColosoAnswer('');
        setColosoAttacked(false);
        setAmbassadorStrategyInput('');
        setAmbassadorSubmitted(false);
        setSelectedStance(null);
        setDebateArgument('');
        setStanceSubmitted(false);
    };

    // Parse speaker role from incoming JSON payload
    const isSpeaker = useMemo(() => {
        if (!activeGame) return false;
        return activeGame.speakerName === studentName;
    }, [activeGame, studentName]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // --- RESPONSE HANDLERS ---

    // 1. Handle student submitting a guess in Taboo
    const handleSubmitGuess = (e) => {
        if (e) e.preventDefault();
        if (!studentGuessInput.trim()) return;

        const guessClean = studentGuessInput.trim().toUpperCase();
        const aiData = activeGame?.ai_context || activeGame?.gameData || {};
        const secretClean = (aiData.secretWord || '').trim().toUpperCase();

        const isCorrect = guessClean === secretClean || (secretClean.length > 3 && secretClean.includes(guessClean));

        const attemptItem = {
            guess: studentGuessInput,
            isCorrect,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setGuessHistory(prev => [attemptItem, ...prev.slice(0, 5)]);

        if (isCorrect) {
            setGuessFeedback({
                isCorrect: true,
                text: `🎉 ¡CORRECTO! "${studentGuessInput}" es la palabra secreta. ¡+100 PS sumados a tu Escuadrón!`
            });
        } else {
            setGuessFeedback({
                isCorrect: false,
                text: `❌ "${studentGuessInput}" no es la palabra secreta. ¡Escucha atentamente a ${activeGame?.speakerName}!`
            });
        }

        // Broadcast to Supabase Realtime
        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.send({
                type: 'broadcast',
                event: 'student_answer_submitted',
                payload: {
                    studentName,
                    squadName: 'Squad Alfa',
                    guess: studentGuessInput,
                    isCorrect,
                    damage: isCorrect ? 1000 : 0
                }
            });
        } catch (err) {}

        setStudentGuessInput('');
    };

    // 2. Handle Asymmetric Puzzle Solution Submission
    const handlePuzzleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!puzzleAnswerInput.trim()) return;

        const aiData = activeGame?.ai_context || activeGame?.gameData || {};
        const expected = (aiData.expectedSolution || '20').trim().toUpperCase();
        const submitted = puzzleAnswerInput.trim().toUpperCase();

        const isCorrect = submitted === expected || submitted.includes(expected);

        setPuzzleSubmitted(true);
        setPuzzleFeedback({
            isCorrect,
            text: isCorrect 
                ? `✓ ¡RESPUESTA CORRECTA! El Squad Alfa unificó las 4 pistas y resolvió el problema (+100 PS).`
                : `⚠️ Respuesta enviada (${puzzleAnswerInput}). Tu docente validará el procedimiento en el proyector.`
        });

        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.send({
                type: 'broadcast',
                event: 'student_answer_submitted',
                payload: {
                    studentName,
                    squadName: 'Squad Alfa',
                    answer: puzzleAnswerInput,
                    isCorrect
                }
            });
        } catch (err) {}
    };

    // 3. Handle Consensus Vote Submission
    const handleConsensusVote = () => {
        if (!selectedConsensusOption) return;
        setConsensusVoteSubmitted(true);

        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.send({
                type: 'broadcast',
                event: 'student_answer_submitted',
                payload: {
                    studentName,
                    squadName: 'Squad Alfa',
                    vote: selectedConsensusOption,
                    isCorrect: true
                }
            });
        } catch (err) {}
    };

    // 4. Handle Coloso Boss Attack
    const handleColosoAttack = (e) => {
        if (e) e.preventDefault();
        if (!colosoAnswer.trim()) return;
        setColosoAttacked(true);

        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.send({
                type: 'broadcast',
                event: 'student_answer_submitted',
                payload: {
                    studentName,
                    squadName: 'Squad Alfa',
                    answer: colosoAnswer,
                    isCorrect: true,
                    damage: 1000
                }
            });
        } catch (err) {}
    };

    // 5. Handle Ambassador Strategy Submission
    const handleAmbassadorSubmit = (e) => {
        if (e) e.preventDefault();
        if (!ambassadorStrategyInput.trim()) return;
        setAmbassadorSubmitted(true);

        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.send({
                type: 'broadcast',
                event: 'student_answer_submitted',
                payload: {
                    studentName,
                    squadName: 'Squad Alfa',
                    strategy: ambassadorStrategyInput,
                    isCorrect: true
                }
            });
        } catch (err) {}
    };

    // 6. Handle Citizen Thermometer Stance Submission
    const handleStanceSubmit = (e) => {
        if (e) e.preventDefault();
        if (!selectedStance) return;
        setStanceSubmitted(true);

        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.send({
                type: 'broadcast',
                event: 'student_answer_submitted',
                payload: {
                    studentName,
                    squadName: 'Squad Alfa',
                    stance: selectedStance,
                    argument: debateArgument,
                    isCorrect: true
                }
            });
        } catch (err) {}
    };

    // =========================================================================
    // STATE A: IDLE VIEW (WHEN ACTIVEGAME IS NULL)
    // ONLY the "Esperando activación..." banner and collective star progress bar.
    // =========================================================================
    if (!activeGame) {
        return (
            <div className="w-full bg-slate-950 text-white font-mono rounded-3xl border-2 border-emerald-500/60 p-6 md:p-10 shadow-[0_0_40px_rgba(16,185,129,0.25)] space-y-8 animate-in fade-in duration-300">
                
                {/* IDLE HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-emerald-900/60">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                            🎮
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    <span>TERMINAL DE ALUMNO // CONECTADO A SALA</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-sans">
                                    4° Medio A • Prof. Carlos Rivas
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                                Ágora de Convivencia & Arena de Sala
                            </h1>
                            <p className="text-xs text-slate-400 font-sans">
                                Esperando el inicio de la dinámica de aula para tu Escuadrón Alfa.
                            </p>
                        </div>
                    </div>

                    {/* Class Synergy Stars Bank */}
                    <div className="flex items-center gap-4 bg-slate-900/95 border-2 border-amber-500/80 px-5 py-2.5 rounded-2xl shadow-xl">
                        <div className="text-amber-400 text-2xl">⭐</div>
                        <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase block font-orbitron">ESTRELLAS DEL CURSO</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black font-orbitron text-amber-300">340</span>
                                <span className="text-xs text-slate-400 font-bold">/ 500 Meta</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STANDBY RADAR BANNER (CLEAN STATE A) */}
                <div className="p-8 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-2 border-emerald-500/50 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-3xl shrink-0 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            📡
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-orbitron font-black text-emerald-300 uppercase">
                                ESPERANDO ACTIVACIÓN DE DINÁMICA POR EL PROFESOR...
                            </h3>
                            <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed max-w-xl">
                                En cuanto el docente presione <strong>"Lanzar Dinámica"</strong> en el proyector, tu pantalla se conectará automáticamente a la misión de tu Squad.
                            </p>
                        </div>
                    </div>

                    <div className="px-4 py-2 bg-slate-950 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono shrink-0">
                        ● Enlace Realtime Listo
                    </div>
                </div>

                {/* COLLECTIVE PROGRESS BAR */}
                <div className="p-6 bg-slate-900/90 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center gap-3.5">
                        <div className="text-3xl">🏆</div>
                        <div>
                            <h4 className="text-xs font-orbitron font-bold text-amber-300 uppercase">
                                META COLECTIVA DEL CURSO (500 ESTRELLAS)
                            </h4>
                            <p className="text-xs text-slate-300 font-sans">
                                Al alcanzar 500 estrellas grupales, el curso desbloquea 15 minutos extra de recreo o música ambiental en sala de clases.
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-56 bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden shrink-0">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '68%' }}></div>
                    </div>
                </div>

            </div>
        );
    }

    // =========================================================================
    // STATE B: ACTIVE GAME STUDENT TERMINAL
    // RENDERS ONLY THE ACTIVE GAME COMPONENT WITH FULL INTERACTIVE RESPONSE UI
    // =========================================================================
    const gameId = activeGame.game_id || activeGame.gameId;
    const aiData = activeGame.ai_context || activeGame.gameData || {};
    const instructions = activeGame.instructions || {};

    return (
        <div className="w-full bg-slate-950 text-white font-mono rounded-3xl border-2 border-emerald-500/60 p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-6 animate-in fade-in duration-300">
            
            {/* ACTIVE TERMINAL HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-emerald-900/60">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        {activeGame.gameIcon || '🎮'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                                ● TERMINAL DE JUGADOR // EN VIVO
                            </span>
                            <span className="text-[10px] text-slate-400 font-sans">
                                Squad Alfa • Rol: <strong>{studentRole}</strong>
                            </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                            {activeGame.gameTitle}
                        </h2>
                        <p className="text-xs text-emerald-300/90 font-sans">
                            📌 Unidad: <strong>{activeGame.topic}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Instructions Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setShowRulesGuide(!showRulesGuide)}
                        className="px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-emerald-500/50 hover:bg-slate-800 text-emerald-300 text-xs font-orbitron font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>{showRulesGuide ? 'Ocultar Guía' : '📋 Ver Reglas'}</span>
                    </button>

                    {/* Personal Timer matching classroom */}
                    <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border-2 border-emerald-500/80 shadow-lg">
                        <Clock className={`w-6 h-6 ${remainingSeconds < 60 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                        <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase block">TIEMPO SALA</span>
                            <span className={`text-2xl font-black font-orbitron tracking-wider ${remainingSeconds < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                                {formatTime(remainingSeconds)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLLAPSIBLE STEP-BY-STEP RULES & INSTRUCTIONS BANNER */}
            {showRulesGuide && (
                <div className="p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 shadow-xl space-y-3 animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-emerald-900 pb-2">
                        <span className="text-xs font-orbitron font-bold text-emerald-300 uppercase">
                            📋 GUÍA PASO A PASO & REGLAS DE SALA:
                        </span>
                        <span className="text-[10px] text-amber-300 font-bold">+100 PS Sinergia</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="space-y-1.5">
                            <strong className="text-cyan-300 font-orbitron uppercase text-[11px] block">⏱️ Pasos a seguir:</strong>
                            {(instructions.steps || [
                                'Paso 1: Identifica tu rol en el escuadrón.',
                                'Paso 2: Habla en voz alta con tu squad (no mires pantallas ajenas).',
                                'Paso 3: Combina la información y envía la respuesta en tu terminal.'
                            ]).map((s, idx) => (
                                <p key={idx} className="text-slate-300 flex items-start gap-1.5">
                                    <span className="text-emerald-400 font-bold">{idx + 1}.</span> {s}
                                </p>
                            ))}
                        </div>

                        <div className="space-y-1.5">
                            <strong className="text-rose-400 font-orbitron uppercase text-[11px] block">⚠️ Prohibiciones:</strong>
                            {(instructions.rules || [
                                'Prohibido mostrar tu pantalla al resto del equipo.',
                                'Prohibido decir las palabras tabú.',
                                'El debate debe ser participativo.'
                            ]).map((r, idx) => (
                                <p key={idx} className="text-rose-200 flex items-start gap-1.5">
                                    <span className="text-rose-400">●</span> {r}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 🔤 1. SPECIFIC GAME: PALABRA PROHIBIDA (TABÚ) */}
            {gameId === 'PALABRA_PROHIBIDA' && (
                <div className="space-y-6">
                    {isSpeaker ? (
                        /* CONDITION A: THE SPEAKER */
                        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-6">
                            <div className="flex justify-between items-center border-b border-cyan-800 pb-3">
                                <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500 uppercase flex items-center gap-2 animate-pulse">
                                    🗣️ ¡ERES EL ORADOR DE TU SQUAD!
                                </span>
                                <span className="text-xs text-amber-300 font-bold font-orbitron">+100 PS / ACIERTO</span>
                            </div>

                            <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/50 text-xs md:text-sm text-cyan-200 font-sans">
                                📢 <strong>Tu Misión:</strong> Explica en voz alta este concepto a tus 3 compañeros de escuadrón. 
                                <span className="text-rose-300 font-bold block mt-1">
                                    ⚠️ PROHIBIDO pronunciar la palabra o cualquiera de las 4 palabras tabú.
                                </span>
                            </div>

                            {/* Massive Secret Word */}
                            <div className="text-center py-6 bg-slate-950 rounded-2xl border-2 border-cyan-400 shadow-inner">
                                <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1 font-orbitron">PALABRA SECRETA A EXPLICAR:</span>
                                <strong className="text-3xl md:text-5xl font-orbitron font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                                    {aiData.secretWord || 'PARÁBOLA'}
                                </strong>
                            </div>

                            {/* 4 Taboo Forbidden Words in Red Warnings */}
                            <div className="space-y-2.5">
                                <span className="text-xs text-rose-400 font-bold uppercase flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                                    <span>4 PALABRAS PROHIBIDAS (SI DICES UNA, PIERDEN LA RONDA):</span>
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {(aiData.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE']).map((word, i) => (
                                        <div key={i} className="p-3.5 bg-rose-950/70 border-2 border-rose-500/60 rounded-2xl text-center font-bold text-rose-200 text-sm tracking-wider shadow-md">
                                            🚫 {word}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-800 text-xs text-cyan-300 font-sans">
                                💡 <strong>Pista de apoyo para tu oratoria:</strong> {aiData.hint || 'Concepto clave de la unidad.'}
                            </div>
                        </div>
                    ) : (
                        /* CONDITION B: THE GUESSERS (SECRET WORD HIDDEN, INPUT ENABLED) */
                        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-6">
                            <div className="flex justify-between items-center border-b border-cyan-800 pb-3">
                                <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500 uppercase flex items-center gap-2">
                                    👂 ¡ERES ADIVINADOR DEL SQUAD!
                                </span>
                                <span className="text-xs text-amber-300 font-bold font-orbitron">+100 PS / ACIERTO</span>
                            </div>

                            <div className="p-5 bg-slate-950 rounded-2xl border border-cyan-500/50 text-center space-y-2">
                                <span className="text-4xl block animate-bounce">🗣️</span>
                                <h3 className="text-base font-bold text-white font-sans">
                                    Tu compañero <strong className="text-cyan-300">{activeGame.speakerName || 'Juan Carlos Pérez'}</strong> está explicando en voz alta.
                                </h3>
                                <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                                    Escucha con atención su explicación y escribe tu respuesta para sumar puntos de sinergia a tu Squad.
                                </p>
                            </div>

                            {/* The Guessing Input Form */}
                            <form onSubmit={handleSubmitGuess} className="space-y-3">
                                <label className="text-xs font-bold text-cyan-300 uppercase font-orbitron block">
                                    ✍️ ¿CUÁL ES EL CONCEPTO O PALABRA SECRETA?
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={studentGuessInput}
                                        onChange={(e) => setStudentGuessInput(e.target.value)}
                                        placeholder="Escribe tu respuesta aquí y presiona Enter..."
                                        className="flex-1 bg-slate-950 border-2 border-cyan-500/60 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-sans shadow-inner"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer shrink-0 flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>RESPONDER</span>
                                    </button>
                                </div>
                            </form>

                            {/* Feedback Toast */}
                            {guessFeedback && (
                                <div className={`p-4 rounded-2xl border text-xs font-bold font-sans animate-in fade-in ${
                                    guessFeedback.isCorrect 
                                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                        : 'bg-rose-950/80 border-rose-400 text-rose-200'
                                }`}>
                                    {guessFeedback.text}
                                </div>
                            )}

                            {/* Recent Guesses History */}
                            {guessHistory.length > 0 && (
                                <div className="space-y-1.5 pt-2">
                                    <span className="text-[10px] text-slate-400 uppercase font-orbitron">TUS INTENTOS RECIENTES:</span>
                                    <div className="space-y-1">
                                        {guessHistory.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-950 rounded-xl border border-slate-800">
                                                <span className="text-slate-300">"{item.guess}"</span>
                                                <span className={item.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                                                    {item.isCorrect ? '✓ Correcto (+100 PS)' : '✗ Incorrecto'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 🧩 2. SPECIFIC GAME: INFORMACIÓN ASIMÉTRICA */}
            {gameId === 'INFO_ASIMETRICA' && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/80 shadow-[0_0_30px_rgba(99,102,241,0.3)] space-y-6">
                    <div className="flex justify-between items-center border-b border-indigo-800 pb-3">
                        <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500 uppercase">
                            🧩 TU PISTA EXCLUSIVA // ROL: {studentRole}
                        </span>
                        <span className="text-xs text-amber-300 font-bold font-orbitron">INTERDEPENDENCIA TOTAL</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/50 space-y-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase font-orbitron">OBJETIVO COLECTIVO DE TU SQUAD:</span>
                        <h3 className="text-sm font-bold text-white font-sans">
                            {aiData.mainObjective || 'Calcular la altura máxima y tiempo de vuelo'}
                        </h3>
                    </div>

                    {/* Specific Role Clue Card */}
                    <div className="p-5 bg-gradient-to-r from-indigo-950/80 to-slate-950 rounded-2xl border-2 border-indigo-400 space-y-2">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase font-orbitron block">
                            🔒 DATO EXCLUSIVO ASIGNADO A TU PANTALLA:
                        </span>
                        <p className="text-base font-bold text-white font-sans leading-relaxed">
                            {aiData.clueRole1 || aiData.roleClues?.[0]?.clue || 'La velocidad inicial es v0 = 20 m/s con ángulo de 90°.'}
                        </p>
                        <span className="text-[10px] text-slate-400 font-sans block pt-1">
                            ℹ️ Tus 3 compañeros tienen las demás variables en sus dispositivos. Dialoguen en voz alta para unificar el cálculo.
                        </span>
                    </div>

                    {/* Interactive Solution Form */}
                    <form onSubmit={handlePuzzleSubmit} className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-emerald-300 uppercase font-orbitron block">
                            ✍️ INGRESA LA SOLUCIÓN / RESULTADO DEL ESCUADRÓN:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={puzzleAnswerInput}
                                onChange={(e) => setPuzzleAnswerInput(e.target.value)}
                                placeholder="Escribe el resultado final consensuado..."
                                className="flex-1 bg-slate-950 border-2 border-indigo-500/60 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-sans shadow-inner"
                            />
                            <button
                                type="submit"
                                className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-slate-950 font-orbitron font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer shrink-0 flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>ENVIAR SOLUCIÓN</span>
                            </button>
                        </div>
                    </form>

                    {puzzleFeedback && (
                        <div className={`p-4 rounded-2xl border text-xs font-bold font-sans animate-in fade-in ${
                            puzzleFeedback.isCorrect 
                                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' 
                                : 'bg-amber-950/80 border-amber-400 text-amber-200'
                        }`}>
                            {puzzleFeedback.text}
                        </div>
                    )}
                </div>
            )}

            {/* 🗳️ 3. SPECIFIC GAME: CONSENSO OBLIGATORIO */}
            {gameId === 'CONSENSO_OBLIGATORIO' && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] space-y-6">
                    <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
                        <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                            🗳️ VOTACIÓN DE ESCUADRÓN // CONSENSO
                        </span>
                        <span className="text-xs text-amber-300 font-bold font-orbitron">+150 PS UNANIMIDAD</span>
                    </div>

                    <div className="p-5 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-2">
                        <h3 className="text-base font-bold text-white font-sans">
                            {aiData.dilemmaTitle || 'Dilema Ético & Pedagógico'}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                            {aiData.scenario || 'Debatan en el escuadrón antes de emitir su voto unánime.'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <span className="text-xs text-emerald-300 font-bold uppercase font-orbitron block">
                            SELECCIONA LA POSTURA DE TU SQUAD:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { id: 'A', text: aiData.optionA || 'Opción A: Máxima automatización con retroalimentación instantánea.' },
                                { id: 'B', text: aiData.optionB || 'Opción B: Co-evaluación grupal con mediación docente obligatoria.' },
                                { id: 'C', text: aiData.optionC || 'Opción C: Protocolo híbrido con defensa presencial.' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setSelectedConsensusOption(opt.text)}
                                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                                        selectedConsensusOption === opt.text
                                            ? 'bg-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                                >
                                    <span className="text-[10px] font-orbitron font-bold text-amber-300 uppercase">
                                        POSTURA {opt.id}
                                    </span>
                                    <strong className="text-xs font-sans text-slate-200 block">{opt.text}</strong>
                                    {selectedConsensusOption === opt.text && (
                                        <span className="text-[10px] font-bold text-emerald-400">✓ Tu Selección</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                            type="button"
                            disabled={!selectedConsensusOption}
                            onClick={handleConsensusVote}
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-orbitron font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                                selectedConsensusOption 
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {consensusVoteSubmitted ? '✓ VOTO CONFIRMADO EN LA SALA' : '🗳️ CONFIRMAR VOTO DE ESCUADRÓN'}
                        </button>

                        {consensusVoteSubmitted && (
                            <span className="text-xs text-emerald-300 font-sans">
                                🤝 Voto registrado. Dialoga con tu equipo para que los 4 integrantes voten la misma opción.
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ⚔️ 4. SPECIFIC GAME: DESAFÍO COLOSO */}
            {gameId === 'DESAFIO_COLOSO' && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.3)] space-y-6">
                    <div className="flex justify-between items-center border-b border-rose-800 pb-3">
                        <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500 uppercase">
                            ⚔️ ATAQUE DE SQUAD // SQUAD ALFA
                        </span>
                        <span className="text-xs text-rose-400 font-bold font-orbitron">
                            JEFE: {aiData.bossName || 'KRÓNOS'}
                        </span>
                    </div>

                    <div className="p-5 bg-slate-950 rounded-2xl border border-rose-500/50 space-y-2">
                        <span className="text-[10px] text-rose-400 font-bold uppercase font-orbitron">
                            🎯 MICRO-DESAFÍO PARA SQUAD ALFA:
                        </span>
                        <h3 className="text-base font-bold text-white font-sans">
                            {aiData.squadProblem || 'Calcula el valor crítico para neutralizar el escudo: (4 × 5) + 12'}
                        </h3>
                    </div>

                    {!colosoAttacked ? (
                        <form onSubmit={handleColosoAttack} className="flex gap-2">
                            <input
                                type="text"
                                value={colosoAnswer}
                                onChange={(e) => setColosoAnswer(e.target.value)}
                                placeholder="Escribe el resultado de Squad Alfa (ej: 32)..."
                                className="flex-1 bg-slate-950 border-2 border-rose-500/60 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-400 font-sans"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-6 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-orbitron font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_15px_rgba(244,63,94,0.5)] cursor-pointer shrink-0"
                            >
                                💥 ATACAR (-1.000 HP)
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 bg-emerald-950/80 border border-emerald-400 rounded-2xl text-center text-xs font-bold text-emerald-300 animate-in fade-in flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            <span>✓ ¡IMPACTO EXITOSO! Squad Alfa infligió -1.000 HP al Coloso. Revisa el daño en el proyector.</span>
                        </div>
                    )}
                </div>
            )}

            {/* 🌐 5. SPECIFIC GAME: RED DE EMBAJADORES */}
            {gameId === 'RED_EMBAJADORES' && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] space-y-6">
                    <div className="flex justify-between items-center border-b border-amber-800 pb-3">
                        <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500 uppercase">
                            🌐 PROTOCOLO EMBAJADORES EN SALA
                        </span>
                        <span className="text-xs text-amber-300 font-bold font-orbitron">+100 PS TRANSFERENCIA</span>
                    </div>

                    <div className="p-5 bg-slate-950 rounded-2xl border border-amber-500/50 space-y-2">
                        <h3 className="text-base font-bold text-white font-sans">
                            {aiData.missionTitle || 'Misión Diplomática de Transferencia Cognitiva'}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                            {aiData.instructionsText || 'El embajador visita el squad siguiente para intercambiar estrategias y verificar resultados.'}
                        </p>
                    </div>

                    <form onSubmit={handleAmbassadorSubmit} className="space-y-3">
                        <label className="text-xs font-bold text-amber-300 uppercase font-orbitron block">
                            ✍️ REGISTRA LA ESTRATEGIA O MÉTODO APRENDIDO DEL OTRO EQUIPO:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={ambassadorStrategyInput}
                                onChange={(e) => setAmbassadorStrategyInput(e.target.value)}
                                placeholder="Escribe la técnica compartida..."
                                className="flex-1 bg-slate-950 border-2 border-amber-500/60 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 font-sans"
                            />
                            <button
                                type="submit"
                                className="px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-orbitron font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer shrink-0"
                            >
                                {ambassadorSubmitted ? '✓ REGISTRADO' : '🌐 REGISTRAR ESTRATEGIA'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 🌡️ 6. SPECIFIC GAME: TERMÓMETRO CIUDADANO */}
            {gameId === 'TERMOMETRO_CIUDADANO' && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-fuchsia-500/80 shadow-[0_0_30px_rgba(217,70,239,0.3)] space-y-6">
                    <div className="flex justify-between items-center border-b border-fuchsia-800 pb-3">
                        <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500 uppercase">
                            🌡️ TERMÓMETRO CIUDADANO // DEBATE ANÓNIMO
                        </span>
                        <span className="text-xs text-amber-300 font-bold font-orbitron">+100 PS PARTICIPACIÓN</span>
                    </div>

                    <div className="p-5 bg-slate-950 rounded-2xl border border-fuchsia-500/50 space-y-2">
                        <span className="text-[10px] text-fuchsia-400 font-bold uppercase font-orbitron">TESIS DE DEBATE EN SALA:</span>
                        <h3 className="text-base font-bold text-white font-sans">
                            {aiData.debateThesis || '¿Debe priorizarse el aprendizaje adaptativo en la educación secundaria?'}
                        </h3>
                    </div>

                    {/* Stance Selector */}
                    <div className="space-y-2">
                        <span className="text-xs text-fuchsia-300 font-bold uppercase font-orbitron block">
                            1. SELECCIONA TU POSTURA:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { id: 'FAVOR', label: '👍 A FAVOR', color: 'emerald' },
                                { id: 'CONTRA', label: '👎 EN CONTRA', color: 'rose' },
                                { id: 'SINTESIS', label: '⚖️ POSTURA CRÍTICA', color: 'cyan' }
                            ].map((st) => (
                                <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => setSelectedStance(st.label)}
                                    className={`p-4 rounded-2xl border-2 font-orbitron font-bold text-xs transition cursor-pointer ${
                                        selectedStance === st.label
                                            ? 'bg-fuchsia-950 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Argument Textarea */}
                    <form onSubmit={handleStanceSubmit} className="space-y-3">
                        <label className="text-xs font-bold text-slate-300 uppercase font-orbitron block">
                            2. FUNDAMENTA TU ARGUMENTO (MÁXIMO 280 CARACTERES):
                        </label>
                        <textarea
                            rows={3}
                            value={debateArgument}
                            onChange={(e) => setDebateArgument(e.target.value)}
                            placeholder="Escribe tu argumento técnico o ético para el termómetro..."
                            className="w-full bg-slate-950 border-2 border-fuchsia-500/60 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-fuchsia-400 font-sans"
                        />
                        <button
                            type="submit"
                            disabled={!selectedStance}
                            className={`w-full py-4 rounded-2xl font-orbitron font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                                selectedStance 
                                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {stanceSubmitted ? '✓ POSTURA ENVIADA AL TERMÓMETRO' : '📤 ENVIAR POSTURA ANÓNIMA AL TERMÓMETRO'}
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default CoexistenceStudent;
