import React, { useState, useEffect } from 'react';
import { useFocusMode } from '../../context/FocusModeProvider';
import { 
    Clock, Radio, HeartHandshake, BrainCircuit, Sparkles, CheckCircle2, 
    AlertTriangle, ShieldCheck, Lock, Unlock, HelpCircle, Send, Award, 
    Zap, Check, X, Activity, Info, Shield, Users, Flame, ChevronRight,
    Compass, MessageSquare, Volume2
} from 'lucide-react';

export default function LiveClassroomStudentHUD() {
  const focusContext = useFocusMode() || {};
  const { 
    isPhoneInCase, 
    currentSession, 
    teacherTimer, 
    studentFocusScore, 
    tabExitCount, 
    handleNfcEvent, 
    endClassAndSyncSupabase 
  } = focusContext;

  // 1. Single Absolute Focus Timer State
  const [sessionStartTime, setSessionStartTime] = useState(() => {
    const saved = localStorage.getItem('aulock_session_start_time') || localStorage.getItem('aulock_auditor_session_start');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const now = Date.now();
    localStorage.setItem('aulock_session_start_time', String(now));
    return now;
  });

  const [focusSeconds, setFocusSeconds] = useState(() => {
    const savedStart = parseInt(localStorage.getItem('aulock_session_start_time') || '0', 10);
    return savedStart > 0 ? Math.floor((Date.now() - savedStart) / 1000) : 0;
  });

  const [showHelperInfo, setShowHelperInfo] = useState(false);

  // Focus Timer Tick based on Absolute Timestamp
  useEffect(() => {
    let interval = null;
    if (sessionStartTime) {
      interval = setInterval(() => {
        setFocusSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    const handleFocusSync = () => {
      if (sessionStartTime) {
        setFocusSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
      }
    };
    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', handleFocusSync);

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleFocusSync);
    };
  }, [sessionStartTime]);

  // 2. Single Classwide Countdown Timer (Broadcasted by Teacher)
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
      } catch (e) {
        console.error(e);
      }
    }
    return { remainingSeconds: 600, initialSeconds: 600, isRunning: false, targetEndTime: null };
  });

  useEffect(() => {
    const handleTimerSync = (e) => {
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

    window.addEventListener('storage', handleTimerSync);
    window.addEventListener('aulock_timer_event', handleTimerSync);
    window.addEventListener('focus', handleTimerSync);
    document.addEventListener('visibilitychange', handleTimerSync);

    return () => {
      window.removeEventListener('storage', handleTimerSync);
      window.removeEventListener('aulock_timer_event', handleTimerSync);
      window.removeEventListener('focus', handleTimerSync);
      document.removeEventListener('visibilitychange', handleTimerSync);
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

  // 3. Question Lifecycle & Standby Architecture
  const [isQuestionActive, setIsQuestionActive] = useState(() => {
    const saved = localStorage.getItem('aulock_active_question');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed && parsed.active === true;
      } catch (e) {}
    }
    return false; // Default IDLE/STANDBY until teacher launches a question!
  });

  const [activeQuestion, setActiveQuestion] = useState(() => {
    const saved = localStorage.getItem('aulock_active_question');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.active === true) {
          return {
            id: parsed.id || 'q-live-1',
            question: parsed.question || parsed.text || '¿Cuál es el resultado de resolver la ecuación cuadrática x² - 5x + 6 = 0?',
            options: parsed.options || ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
            timeLimit: parsed.timeLimit || parsed.timer_seconds || 45,
            correctAnswer: parsed.correct_answer || 'A) x = 2 y x = 3'
          };
        }
      } catch (e) {}
    }
    return null;
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [understandingLevel, setUnderstandingLevel] = useState(null);

  // Listen for real-time question broadcasts from Teacher Dashboard
  useEffect(() => {
    const handleQuestionBroadcast = (e) => {
      let savedData = null;

      if (e && e.detail && e.detail.data) {
        savedData = e.detail.data;
      } else {
        const saved = localStorage.getItem('aulock_active_question');
        if (saved) {
          try {
            savedData = JSON.parse(saved);
          } catch (err) {
            console.error(err);
          }
        }
      }

      if (savedData && (savedData.active === true || savedData.active === undefined)) {
        const timeLimit = savedData.timeLimit || savedData.timer_seconds || 45;
        setIsQuestionActive(true);
        setActiveQuestion({
          id: savedData.id || 'q-live-' + Date.now(),
          question: savedData.question || savedData.text || 'Pregunta formativa de la clase en vivo',
          options: savedData.options && savedData.options.length > 0 ? savedData.options : ['A) Opción 1', 'B) Opción 2', 'C) Opción 3', 'D) Opción 4'],
          timeLimit,
          correctAnswer: savedData.correct_answer || ''
        });
        setQuestionTimeLeft(timeLimit);
        setQuestionStartTime(Date.now());
        setSelectedOption(null);
        setHasSubmitted(false);
      } else if (savedData && savedData.active === false) {
        setIsQuestionActive(false);
        setActiveQuestion(null);
      }
    };

    window.addEventListener('storage', handleQuestionBroadcast);
    window.addEventListener('aulock_question_event', handleQuestionBroadcast);
    return () => {
      window.removeEventListener('storage', handleQuestionBroadcast);
      window.removeEventListener('aulock_question_event', handleQuestionBroadcast);
    };
  }, []);

  // Question Timer Countdown (Only ticks when isQuestionActive === true)
  useEffect(() => {
    let interval = null;
    if (isQuestionActive && activeQuestion && questionStartTime && questionTimeLeft > 0 && !hasSubmitted) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
        const rem = Math.max(0, activeQuestion.timeLimit - elapsed);
        setQuestionTimeLeft(rem);
        if (rem === 0) {
          clearInterval(interval);
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuestionActive, activeQuestion, questionStartTime, questionTimeLeft, hasSubmitted]);

  const handleAnswerSubmit = (optionId, optionText = '') => {
    setSelectedOption(optionId);
    setHasSubmitted(true);

    const newResponse = {
      id: 'resp-' + Date.now(),
      studentName: 'Juan Carlos Pérez',
      course: 'Senior High A (4° Medio A)',
      optionId,
      optionText,
      timestamp: new Date().toISOString()
    };

    const saved = localStorage.getItem('aulock_student_live_responses');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(newResponse);
    localStorage.setItem('aulock_student_live_responses', JSON.stringify(list));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_student_response_event', { detail: newResponse }));
  };

  const handleUnderstandingFeedback = (level) => {
    setUnderstandingLevel(level);
    const payload = {
      studentName: 'Juan Carlos Pérez',
      level,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('aulock_student_understanding', JSON.stringify(payload));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_understanding_event', { detail: payload }));
  };

  const formatClock = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 font-mono selection:bg-cyan-900 animate-in fade-in duration-300">
      
      {/* =========================================================================
          SECTION 1: BANNER DE TELEMETRÍA Y ENFOQUE ACTIVO (CYAN NEON GLOW)
         ========================================================================= */}
      <section className="bg-slate-950/95 border-2 border-cyan-500/60 p-5 md:p-6 rounded-3xl shadow-[0_0_35px_rgba(6,182,212,0.25)] space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cyan-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              ⏱️
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-wider uppercase">
                SESIÓN EN VIVO // TELEMETRÍA DE ENFOQUE ACTIVO
              </h2>
              <p className="text-[11px] text-cyan-300 font-sans">
                {currentSession?.className || 'Matemática Avanzada & Cálculo'} • {currentSession?.teacherName || 'Prof. Carlos Rivas'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelperInfo(!showHelperInfo)}
              className="p-1.5 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs cursor-pointer flex items-center gap-1"
              title="Información del Contador de Foco"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden md:inline">Auditoría NFC</span>
            </button>

            <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500 text-[10px] font-bold rounded-full uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              {isPhoneInCase ? '🔒 ESTUCHE NFC ACTIVO' : '● ENFOQUE EN CURSO'}
            </span>
          </div>
        </div>

        {/* Info Popover if toggled */}
        {showHelperInfo && (
          <div className="p-3 bg-slate-900/90 border border-cyan-500/50 rounded-2xl text-xs text-cyan-200 font-sans leading-relaxed animate-in fade-in duration-200">
            <p>
              💡 <strong>¿Cómo funciona la telemetría?</strong> El tiempo de atención continua y el reloj global de clase se calculan con marcas de tiempo absolutas. Si cambias de pestaña, el sistema registra una salida de foco sin resetear la sesión.
            </p>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Main Continuous Focus Timer */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-cyan-500/40 text-center flex flex-col justify-center items-center shadow-lg">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
              TIEMPO DE ATENCIÓN CONTINUA
            </span>
            <strong className="text-3xl font-orbitron font-black text-white tracking-widest drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
              {formatClock(focusSeconds)}
            </strong>
            <span className="text-[10px] text-cyan-300/80 mt-1 font-sans">
              Minutos acumulados en pantalla
            </span>
          </div>

          {/* Synchronized Global Class Timer */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/40 text-center flex flex-col justify-center items-center shadow-lg">
            <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
              RELOJ GLOBAL DE CLASE (DOCENTE)
            </span>
            <strong className="text-3xl font-orbitron font-black text-amber-300 tracking-widest drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              {classTimer?.isRunning 
                ? formatClock(classTimer.remainingSeconds) 
                : '10:00'}
            </strong>
            <span className="text-[10px] text-amber-200/80 mt-1 font-sans">
              {classTimer?.isRunning ? '● Sincronizado en tiempo real' : '○ En espera del profesor'}
            </span>
          </div>

          {/* Points Balance & Exits */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">PUNTOS DE ENFOQUE (PS)</span>
              <span className="text-sm font-orbitron font-black text-emerald-400">{studentFocusScore || 100} PS</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">SALIDAS DE PESTAÑA</span>
              <span className={`text-sm font-orbitron font-bold ${tabExitCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tabExitCount || 0} salidas
              </span>
            </div>
          </div>

          {/* Actions & NFC Case Release */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-center gap-2">
            <button
              onClick={() => {
                if (window.confirm("¿Seguro que deseas finalizar tu sesión de enfoque y registrar la telemetría?")) {
                  endClassAndSyncSupabase();
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 text-white font-orbitron font-extrabold text-[11px] rounded-xl uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              🛑 Finalizar Sesión
            </button>

            {handleNfcEvent && (
              <button
                onClick={() => handleNfcEvent({ tagId: 'NFC_LOCK_2026', studentId: 'STU_JUAN' })}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 font-orbitron font-bold text-[10px] rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3 h-3" />
                <span>Simular Estuche NFC</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BANNER DE INTERACCIÓN & RESPUESTA EN VIVO (MAGENTA NEON GLOW)
         ========================================================================= */}
      <section className="bg-slate-950/95 border-2 border-fuchsia-500/60 p-5 md:p-6 rounded-3xl shadow-[0_0_35px_rgba(217,70,239,0.25)] space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-fuchsia-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-950 border border-fuchsia-400 flex items-center justify-center text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.5)]">
              📡
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-wider uppercase">
                AULA INTERACTIVA // PREGUNTAS Y SINTONÍA DE APRENDIZAJE
              </h2>
              <p className="text-[11px] text-fuchsia-300 font-sans">
                Interacción formativa en vivo sincronizada con el panel docente
              </p>
            </div>
          </div>

          {isQuestionActive && (
            <div className="flex items-center gap-2 bg-fuchsia-950/80 border border-fuchsia-500 px-3 py-1 rounded-xl shadow-[0_0_12px_rgba(217,70,239,0.4)]">
              <span className="text-[11px] text-fuchsia-300 font-bold">⏱️ TIEMPO PREGUNTA:</span>
              <span className="text-sm font-black font-orbitron text-amber-300 animate-pulse">{questionTimeLeft}s</span>
            </div>
          )}
        </div>

        {/* 70% / 30% Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (70%): Dynamic Question Box */}
          <div className="lg:col-span-8">
            {!isQuestionActive || !activeQuestion ? (
              // STANDBY STATE (Elegant Cyberpunk Placeholder)
              <div className="p-8 md:p-12 rounded-2xl bg-slate-900/70 border-2 border-dashed border-fuchsia-500/40 text-center space-y-4 flex flex-col items-center justify-center min-h-[260px]">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-950/80 border border-fuchsia-500 flex items-center justify-center text-2xl text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.4)] animate-pulse">
                  <Radio className="w-7 h-7" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-sm font-orbitron font-bold text-white">
                    Esperando pregunta o actividad interactiva de la clase...
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    El profesor lanzará los desafíos formativos y preguntas socráticas en el momento oportuno. Mantén tu atención en la pizarra.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-950 text-fuchsia-400 border border-fuchsia-800/80 text-[10px] font-mono">
                  ● Canal Supabase Realtime Conectado (#CANAL-AULA-2026)
                </span>
              </div>
            ) : (
              // ACTIVE QUESTION CARD
              <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-fuchsia-500/70 shadow-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 uppercase">
                    EVALUACIÓN FORMATIVA // OPCIÓN MÚLTIPLE
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">+100 PS RECOMPENSA</span>
                </div>

                <h3 className="text-sm md:text-base font-bold text-white font-sans border-l-4 border-fuchsia-400 pl-4 py-1 leading-relaxed">
                  {activeQuestion.question}
                </h3>

                {/* Options Grid (A, B, C, D) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeQuestion.options.map((optText, idx) => {
                    const letterId = String.fromCharCode(65 + idx);
                    const isSelected = selectedOption === letterId || selectedOption === optText;

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmitted}
                        onClick={() => handleAnswerSubmit(letterId, optText)}
                        className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-fuchsia-950 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                            : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-fuchsia-400 hover:bg-slate-900'
                        }`}
                      >
                        <span className="font-medium pr-2">{optText}</span>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-bold ${
                          isSelected 
                            ? 'border-fuchsia-400 bg-fuchsia-500 text-slate-950' 
                            : 'border-slate-700 bg-slate-900 text-fuchsia-300'
                        }`}>
                          {letterId}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {hasSubmitted && (
                  <div className="p-3.5 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl text-center space-y-1 animate-in fade-in duration-200">
                    <p className="text-emerald-300 font-bold font-orbitron text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Respuesta Registrada con Éxito!</span>
                    </p>
                    <p className="text-[11px] text-cyan-200 font-sans">
                      Tu selección fue enviada en vivo al panel del profesor Carlos Rivas.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column (30%): Sintonía de Comprensión & Badges */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Sintonía de Comprensión Pulse */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-fuchsia-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-orbitron font-bold text-fuchsia-300 uppercase">// SINTONÍA DE COMPRENSIÓN</h4>
                <Activity className="w-4 h-4 text-fuchsia-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans">¿Cómo sientes el ritmo de la explicación?</p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUnderstandingFeedback('CLARO')}
                  className={`p-2.5 rounded-xl border text-[10px] font-bold transition cursor-pointer text-center ${
                    understandingLevel === 'CLARO'
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-950 border-slate-800 text-emerald-400 hover:border-emerald-500'
                  }`}
                >
                  🟢 Claro
                </button>

                <button
                  onClick={() => handleUnderstandingFeedback('RÁPIDO')}
                  className={`p-2.5 rounded-xl border text-[10px] font-bold transition cursor-pointer text-center ${
                    understandingLevel === 'RÁPIDO'
                      ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'bg-slate-950 border-slate-800 text-amber-300 hover:border-amber-500'
                  }`}
                >
                  🟡 Rápido
                </button>

                <button
                  onClick={() => handleUnderstandingFeedback('DUDAS')}
                  className={`p-2.5 rounded-xl border text-[10px] font-bold transition cursor-pointer text-center ${
                    understandingLevel === 'DUDAS'
                      ? 'bg-rose-950 border-rose-400 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      : 'bg-slate-950 border-slate-800 text-rose-300 hover:border-rose-500'
                  }`}
                >
                  🔴 Duda
                </button>
              </div>

              {understandingLevel && (
                <p className="text-[10px] text-emerald-400 font-bold text-center pt-1 font-sans">
                  ✓ Pulso formativo enviado al docente.
                </p>
              )}
            </div>

            {/* Active Squad Badge */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-fuchsia-500/40 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-950 border border-fuchsia-500 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(217,70,239,0.3)] shrink-0">
                🎖️
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-orbitron text-fuchsia-300 font-bold block">// RECONOCIMIENTO ACTIVO</span>
                <h5 className="text-xs font-bold text-white">Escucha Activa & Cooperación</h5>
                <p className="text-[10px] text-slate-400 font-sans">Participación respetuosa en Squad Alfa.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BANNER DE CONVIVENCIA Y FORMACIÓN CIUDADANA (EMERALD NEON GLOW)
         ========================================================================= */}
      <section className="bg-slate-950/95 border-2 border-emerald-500/60 p-5 md:p-6 rounded-3xl shadow-[0_0_35px_rgba(16,185,129,0.25)] space-y-5">
        
        {/* Section Header */}
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              🤝
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-wider uppercase">
                CONVIVENCIA ESCOLAR & REFLEXIÓN ÉTICA
              </h2>
              <p className="text-[11px] text-emerald-300 font-sans">
                Estándares MINEDUC • Política 'Seamos Comunidad' y Clima Positivo de Aula
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700 uppercase">
            ● PROTOCOLO SEGURO
          </span>
        </div>

        {/* Grid: Cápsula Ciudadana + Protocolo de Empatía */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Cápsula de Reflexión Ciudadana */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/40 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-emerald-400 uppercase font-orbitron">// CÁPSULA FORMATIVA CIUDADANA</span>
                <span className="text-cyan-400">MINEDUC 2026</span>
              </div>
              <h4 className="text-xs font-bold text-white font-orbitron">Diálogo Cívico y Respeto Democrático</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                El aprendizaje se fortalece cuando argumentamos con evidencia sólida y escuchamos con genuino respeto las ideas divergentes de nuestros pares.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold pt-2 border-t border-slate-800 block">
              ✓ Clima de Aula Auditado: 92% Óptimo
            </span>
          </div>

          {/* Protocolo de Empatía & Convivencia Escolar */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/40 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-emerald-400 uppercase font-orbitron">// PROTOCOLO DE CONVIVENCIA ESCOLAR</span>
                <span className="text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">COMUNIDAD SEGURA</span>
              </div>
              <p className="text-xs text-emerald-100 italic leading-relaxed font-sans pt-1">
                "El respeto y la escucha activa hacia las preguntas de tus compañeros eliminan el temor al error y transforman el aula en un espacio de colaboración intelectual."
              </p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800">
              <span>Orientación Formativa SLEP Andalién Sur</span>
              <span className="text-emerald-400 font-bold">● VIGENTE</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

