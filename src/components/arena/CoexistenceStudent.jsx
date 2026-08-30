import React, { useState, useEffect, useMemo } from 'react';
import { 
    Clock, AlertTriangle, Send, CheckCircle2, 
    Sparkles, Shield, Trophy, Activity, MessageSquare
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
    const [studentGuessInput, setStudentGuessInput] = useState('');
    const [guessFeedback, setGuessFeedback] = useState(null);
    const [selectedConsensusOption, setSelectedConsensusOption] = useState(null);
    const [colosoAnswer, setColosoAnswer] = useState('');
    const [colosoAttacked, setColosoAttacked] = useState(false);

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
                        setGuessFeedback(null);
                        setColosoAttacked(false);
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

    // Handle student submitting a guess in Taboo
    const handleSubmitGuess = (e) => {
        if (e) e.preventDefault();
        if (!studentGuessInput.trim()) return;

        const guessClean = studentGuessInput.trim().toUpperCase();
        const aiData = activeGame?.ai_context || activeGame?.gameData || {};
        const secretClean = (aiData.secretWord || '').trim().toUpperCase();

        const isCorrect = guessClean === secretClean || (secretClean.length > 3 && secretClean.includes(guessClean));

        if (isCorrect) {
            setGuessFeedback({
                isCorrect: true,
                text: `🎉 ¡EXCELENTE! ¡${studentGuessInput} es correcto! +100 PS para tu Squad.`
            });
        } else {
            setGuessFeedback({
                isCorrect: false,
                text: `❌ "${studentGuessInput}" no es la palabra secreta. ¡Sigue escuchando a ${activeGame?.speakerName}!`
            });
        }

        // Broadcast to Supabase Realtime for teacher and squad
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

    // Handle Coloso Boss Raid attack
    const handleColosoAttack = () => {
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
    // RENDERS ONLY THE ACTIVE GAME COMPONENT ACCORDING TO SQUAD ROLE
    // =========================================================================
    const gameId = activeGame.game_id || activeGame.gameId;
    const aiData = activeGame.ai_context || activeGame.gameData || {};

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
                                📢 <strong>Instrucción en Sala:</strong> Explica en voz alta este concepto a tus 3 compañeros de escuadrón. 
                                <span className="text-rose-300 font-bold block mt-1">
                                    ⚠️ ESTÁ ESTRICTAMENTE PROHIBIDO pronunciar la palabra o cualquiera de las 4 palabras tabú.
                                </span>
                            </div>

                            {/* Massive Secret Word (ONLY VISIBLE TO SPEAKER) */}
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
                                💡 <strong>Pista de apoyo para tu oratoria:</strong> {aiData.hint || 'Concepto clave de la función cuadrática.'}
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
                                        placeholder="Escribe tu respuesta aquí..."
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
                                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' 
                                        : 'bg-rose-950/80 border-rose-400 text-rose-200'
                                }`}>
                                    {guessFeedback.text}
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
                        <span className="text-xs text-amber-300 font-bold font-orbitron">INTERDEPENDENCIA POSITIVA</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/50 space-y-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase font-orbitron">OBJETIVO COLECTIVO DE TU SQUAD:</span>
                        <h3 className="text-sm font-bold text-white font-sans">
                            {aiData.mainObjective || 'Calcular la altura máxima y punto de inflexión'}
                        </h3>
                    </div>

                    <div className="p-5 bg-gradient-to-r from-indigo-950/80 to-slate-950 rounded-2xl border-2 border-indigo-400 space-y-2">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase font-orbitron block">
                            🔒 DATO EXCLUSIVO ASIGNADO A TU PANTALLA:
                        </span>
                        <p className="text-base font-bold text-white font-sans leading-relaxed">
                            {aiData.roleClues?.[0]?.clue || 'La velocidad inicial es v0 = 20 m/s con ángulo de lanzamiento vertical.'}
                        </p>
                        <span className="text-[10px] text-slate-400 font-sans block pt-1">
                            ℹ️ Tus otros 3 compañeros tienen las demás variables en sus dispositivos. Combínenlas en voz alta.
                        </span>
                    </div>
                </div>
            )}

            {/* ⚔️ 3. SPECIFIC GAME: DESAFÍO COLOSO */}
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
                            {aiData.squadChallenges?.[0]?.problem || 'Calcula el valor crítico para desestabilizar el escudo: (2 × 4) + 6'}
                        </h3>
                    </div>

                    {!colosoAttacked ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={colosoAnswer}
                                onChange={(e) => setColosoAnswer(e.target.value)}
                                placeholder="Respuesta de Squad Alfa..."
                                className="flex-1 bg-slate-950 border-2 border-rose-500/60 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-400 font-sans"
                            />
                            <button
                                type="button"
                                onClick={handleColosoAttack}
                                className="px-6 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-orbitron font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_15px_rgba(244,63,94,0.5)] cursor-pointer shrink-0"
                            >
                                💥 ATACAR (-1.000 HP)
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-950/80 border border-emerald-400 rounded-2xl text-center text-xs font-bold text-emerald-300 animate-in fade-in">
                            ✓ ¡IMPACTO EXITOSO! Squad Alfa infligió -1.000 HP al Coloso. Revisa el proyector de la sala.
                        </div>
                    )}
                </div>
            )}

            {/* 🗳️ 4. SPECIFIC GAME: CONSENSO OBLIGATORIO & TERMÓMETRO */}
            {(gameId === 'CONSENSO_OBLIGATORIO' || gameId === 'TERMOMETRO_CIUDADANO') && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] space-y-6">
                    <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
                        <span className="text-xs md:text-sm font-orbitron font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                            🗳️ VOTACIÓN DE ESCUADRÓN // CONSENSO
                        </span>
                        <span className="text-xs text-amber-300 font-bold font-orbitron">+150 PS UNANIMIDAD</span>
                    </div>

                    <div className="p-5 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-2">
                        <h3 className="text-base font-bold text-white font-sans">
                            {aiData.dilemmaTitle || aiData.debateThesis || 'Dilema Ético & Pedagógico'}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                            {aiData.scenario || aiData.reflectionPrompt || 'Debatan en el escuadrón antes de emitir su voto.'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <span className="text-xs text-emerald-300 font-bold uppercase font-orbitron block">
                            SELECCIONA LA POSTURA DE TU SQUAD:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {['Opción A: Máxima Precisión', 'Opción B: Solución Rápida', 'Opción C: Protocolo Híbrido'].map((opt, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedConsensusOption(opt)}
                                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                                        selectedConsensusOption === opt
                                            ? 'bg-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                                >
                                    <strong className="text-xs font-bold block">{opt}</strong>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CoexistenceStudent;
