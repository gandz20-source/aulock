import React, { useState, useEffect } from 'react';
import { useFocusMode } from '../../context/FocusModeProvider';
import { supabase } from '../../config/supabase';
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

  const studentName = 'Juan Carlos Pérez';
  const studentCourse = '4° Medio A';
  const squadName = 'Squad Alfa';

  // 1. Focus Session State with Automatic Stale Timestamp Sanitization
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(() => {
    const savedActive = localStorage.getItem('aulock_session_active');
    const classTimerSaved = localStorage.getItem('aulock_class_timer');
    let timerRunning = false;
    if (classTimerSaved) {
      try {
        const parsed = JSON.parse(classTimerSaved);
        timerRunning = parsed.isRunning && parsed.targetEndTime && parsed.targetEndTime > Date.now();
      } catch(e) {}
    }
    return isPhoneInCase || savedActive === 'true' || timerRunning;
  });

  const [sessionStartTime, setSessionStartTime] = useState(() => {
    const saved = localStorage.getItem('aulock_session_start_time') || localStorage.getItem('aulock_auditor_session_start');
    if (saved) {
      const parsed = parseInt(saved, 10);
      const elapsed = Math.floor((Date.now() - parsed) / 1000);
      // SANITIZATION: If timer was started > 2 hours ago (7200s), like the 2975 minutes in screenshot,
      // it is an orphaned legacy timer from previous days! Purge it immediately.
      if (!isNaN(parsed) && parsed > 0 && elapsed >= 0 && elapsed < 7200) {
        return parsed;
      }
    }
    // Clean up stale timers
    localStorage.removeItem('aulock_session_start_time');
    localStorage.removeItem('aulock_auditor_session_start');
    return null;
  });

  const [focusSeconds, setFocusSeconds] = useState(() => {
    const saved = localStorage.getItem('aulock_session_start_time') || localStorage.getItem('aulock_auditor_session_start');
    if (saved) {
      const parsed = parseInt(saved, 10);
      const elapsed = Math.floor((Date.now() - parsed) / 1000);
      if (!isNaN(parsed) && parsed > 0 && elapsed >= 0 && elapsed < 7200) {
        return elapsed;
      }
    }
    return 0;
  });

  const [showHelperInfo, setShowHelperInfo] = useState(false);

  // Focus Timer Tick: ONLY ticks when isFocusSessionActive === true and sessionStartTime is valid!
  useEffect(() => {
    let interval = null;
    if (isFocusSessionActive && sessionStartTime && sessionStartTime > 0) {
      // Immediate initial tick
      const initialElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      if (initialElapsed < 7200) {
        setFocusSeconds(initialElapsed);
      }

      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        // Automatic safety cap at 120 minutes (7200s) to prevent infinite ticking across days
        if (elapsed > 7200) {
          setIsFocusSessionActive(false);
          setFocusSeconds(7200);
          localStorage.setItem('aulock_session_active', 'false');
          return;
        }
        setFocusSeconds(elapsed);
      }, 1000);
    }

    const handleFocusSync = () => {
      if (isFocusSessionActive && sessionStartTime && sessionStartTime > 0) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        if (elapsed < 7200) setFocusSeconds(elapsed);
      }
    };

    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', handleFocusSync);

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleFocusSync);
    };
  }, [isFocusSessionActive, sessionStartTime]);

  const handleStartFocusSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setFocusSeconds(0);
    setIsFocusSessionActive(true);
    localStorage.setItem('aulock_session_start_time', String(now));
    localStorage.setItem('aulock_session_active', 'true');
    window.dispatchEvent(new Event('storage'));
  };

  const handleEndFocusSession = () => {
    if (window.confirm("¿Seguro que deseas finalizar tu sesión de enfoque y reiniciar el contador a 00:00?")) {
      setIsFocusSessionActive(false);
      setSessionStartTime(null);
      setFocusSeconds(0);
      localStorage.removeItem('aulock_session_start_time');
      localStorage.removeItem('aulock_auditor_session_start');
      localStorage.setItem('aulock_session_active', 'false');
      localStorage.setItem('aulock_student_focus_time', '0');
      window.dispatchEvent(new Event('storage'));
      if (endClassAndSyncSupabase) {
        endClassAndSyncSupabase();
      }
    }
  };

  const handleResetFocusTimer = () => {
    setIsFocusSessionActive(false);
    setSessionStartTime(null);
    setFocusSeconds(0);
    localStorage.removeItem('aulock_session_start_time');
    localStorage.removeItem('aulock_auditor_session_start');
    localStorage.setItem('aulock_session_active', 'false');
    localStorage.setItem('aulock_student_focus_time', '0');
    window.dispatchEvent(new Event('storage'));
  };

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
            type: parsed.type || 'alternatives',
            options: parsed.options || ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
            timeLimit: parsed.timeLimit || parsed.timer_seconds || 45,
            targetEndTime: parsed.targetEndTime || (Date.now() + 45000),
            correctAnswer: parsed.correctAnswer || parsed.correct_answer || 'x = 2 y x = 3'
          };
        }
      } catch (e) {}
    }
    return null;
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [writtenAnswerText, setWrittenAnswerText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);
  const [understandingLevel, setUnderstandingLevel] = useState(null);

  // Listen for real-time question broadcasts from Teacher Dashboard (Dual: Supabase + LocalStorage)
  useEffect(() => {
    const applyQuestionData = (savedData) => {
      if (savedData && (savedData.active === true || savedData.active === undefined)) {
        const timeLimit = savedData.timeLimit || savedData.timer_seconds || 45;
        const targetEnd = savedData.targetEndTime || (Date.now() + timeLimit * 1000);
        const rem = Math.max(0, Math.ceil((targetEnd - Date.now()) / 1000));

        setIsQuestionActive(true);
        setActiveQuestion({
          id: savedData.id || 'q-live-' + Date.now(),
          question: savedData.question || savedData.text || 'Pregunta formativa de la clase en vivo',
          type: savedData.type || (savedData.options && savedData.options.length > 0 ? 'alternatives' : 'written'),
          options: savedData.options && savedData.options.length > 0 ? savedData.options : [],
          timeLimit,
          targetEndTime: targetEnd,
          correctAnswer: savedData.correctAnswer || savedData.correct_answer || ''
        });
        setQuestionTimeLeft(rem > 0 ? rem : timeLimit);
        setSelectedOption(null);
        setWrittenAnswerText('');
        setHasSubmitted(false);
        setSubmitFeedback(null);
      } else if (savedData && savedData.active === false) {
        setIsQuestionActive(false);
        setActiveQuestion(null);
        setHasSubmitted(false);
        setSubmitFeedback(null);
      }
    };

    const handleQuestionBroadcast = (e) => {
      let savedData = null;
      if (e && e.detail && e.detail.data) {
        savedData = e.detail.data;
      } else {
        const saved = localStorage.getItem('aulock_active_question');
        if (saved) {
          try { savedData = JSON.parse(saved); } catch (err) {}
        }
      }
      applyQuestionData(savedData);
    };

    // 1. Supabase Realtime Channel
    const channel = supabase
      .channel('coexistence_nexus_arena')
      .on('broadcast', { event: 'live_question_launched' }, ({ payload }) => {
        if (payload) {
          applyQuestionData(payload);
        }
      })
      .on('broadcast', { event: 'live_question_closed' }, () => {
        setIsQuestionActive(false);
        setActiveQuestion(null);
      })
      .subscribe();

    // 2. Window and storage listeners
    window.addEventListener('storage', handleQuestionBroadcast);
    window.addEventListener('aulock_question_event', handleQuestionBroadcast);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleQuestionBroadcast);
      window.removeEventListener('aulock_question_event', handleQuestionBroadcast);
    };
  }, []);

  // Question Timer Countdown based on targetEndTime
  useEffect(() => {
    let interval = null;
    if (isQuestionActive && activeQuestion && activeQuestion.targetEndTime) {
      const syncQuestionTime = () => {
        const rem = Math.max(0, Math.ceil((activeQuestion.targetEndTime - Date.now()) / 1000));
        setQuestionTimeLeft(rem);
        if (rem === 0) {
          // Question expired
        }
      };
      syncQuestionTime();
      interval = setInterval(syncQuestionTime, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuestionActive, activeQuestion]);

  // Handle student submitting answer (Supports: Multiple Choice, True/False, Open Written)
  const handleAnswerSubmit = (optionId, optionText = '') => {
    if (hasSubmitted) return;

    setSelectedOption(optionId);
    setHasSubmitted(true);

    const q = activeQuestion || {};
    const answerSubmitted = optionText || optionId || writtenAnswerText;

    // Check correctness
    let isCorrect = false;
    const expected = (q.correctAnswer || '').trim().toLowerCase();
    const actual = answerSubmitted.trim().toLowerCase();

    if (q.type === 'true_false') {
      isCorrect = expected.includes('verdadero') ? actual.includes('verdadero') : actual.includes('falso');
    } else if (q.type === 'written') {
      isCorrect = actual.length > 5; // Formative written reasoning
    } else {
      isCorrect = actual === expected || actual.includes(expected) || expected.includes(actual);
    }

    const newResponse = {
      id: 'resp-' + Date.now(),
      studentName,
      squadName,
      course: studentCourse,
      questionId: q.id,
      optionId: optionId || 'ESCRITA',
      optionText: answerSubmitted,
      answer: answerSubmitted,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    setSubmitFeedback({
      isCorrect,
      text: isCorrect 
        ? `🎉 ¡Excelente respuesta! Tu selección es correcta (+100 PS Sinergia).`
        : `✓ Respuesta enviada con éxito al profesor Carlos Rivas.`
    });

    // 1. Save to local storage & dispatch local event
    const saved = localStorage.getItem('aulock_student_live_responses');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(newResponse);
    localStorage.setItem('aulock_student_live_responses', JSON.stringify(list));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_student_response_event', { detail: newResponse }));

    // 2. Broadcast via Supabase Realtime to Teacher Dashboard
    try {
      const channel = supabase.channel('coexistence_nexus_arena');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'student_live_response',
            payload: newResponse
          });
        }
      });
    } catch (err) {
      console.warn("Supabase student response broadcast error:", err);
    }
  };

  const handleUnderstandingFeedback = (level) => {
    setUnderstandingLevel(level);
    const payload = {
      studentName,
      squadName,
      level,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('aulock_student_understanding', JSON.stringify(payload));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_understanding_event', { detail: payload }));

    // Broadcast to teacher
    try {
      const channel = supabase.channel('coexistence_nexus_arena');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'student_comprehension_pulse',
            payload
          });
        }
      });
    } catch (err) {}
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

            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase flex items-center gap-1.5 shadow-md ${
              isPhoneInCase 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500' 
                : isFocusSessionActive 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' 
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isFocusSessionActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              {isPhoneInCase ? '🔒 ESTUCHE NFC ACTIVO' : isFocusSessionActive ? '● ENFOQUE EN CURSO' : '○ EN ESPERA DE SESIÓN'}
            </span>
          </div>
        </div>

        {/* Info Popover if toggled */}
        {showHelperInfo && (
          <div className="p-3 bg-slate-900/90 border border-cyan-500/50 rounded-2xl text-xs text-cyan-200 font-sans leading-relaxed animate-in fade-in duration-200">
            <p>
              💡 <strong>¿Cómo funciona la telemetría?</strong> El tiempo de atención continua se activa al iniciar la clase o al ingresar el teléfono en el estuche NFC. Al finalizar la clase o presionar reiniciar, el temporizador vuelve a cero de forma segura.
            </p>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Main Continuous Focus Timer */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-cyan-500/40 text-center flex flex-col justify-center items-center shadow-lg">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1 font-orbitron">
              TIEMPO DE ATENCIÓN CONTINUA
            </span>
            <strong className={`text-3xl font-orbitron font-black tracking-widest drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] ${
              isFocusSessionActive ? 'text-white' : 'text-slate-400'
            }`}>
              {formatClock(focusSeconds)}
            </strong>
            <span className="text-[10px] text-cyan-300/80 mt-1 font-sans">
              {isFocusSessionActive ? '● Cronómetro en curso' : '○ Sesión en espera / Pausada'}
            </span>
          </div>

          {/* Synchronized Global Class Timer */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/40 text-center flex flex-col justify-center items-center shadow-lg">
            <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1 font-orbitron">
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
            {isFocusSessionActive ? (
              <button
                onClick={handleEndFocusSession}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 text-white font-orbitron font-extrabold text-[11px] rounded-xl uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                🛑 Finalizar Sesión
              </button>
            ) : (
              <button
                onClick={handleStartFocusSession}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-orbitron font-extrabold text-[11px] rounded-xl uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                ▶ Iniciar Enfoque
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleResetFocusTimer}
                title="Reiniciar contador a 00:00"
                className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-orbitron font-bold text-[10px] rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
              >
                🔄 Reiniciar (00:00)
              </button>

              {handleNfcEvent && (
                <button
                  onClick={() => handleNfcEvent({ tagId: 'NFC_LOCK_2026', studentId: 'STU_JUAN' })}
                  className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 font-orbitron font-bold text-[10px] rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Estuche NFC</span>
                </button>
              )}
            </div>
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
              <span className={`text-sm font-black font-orbitron ${questionTimeLeft < 10 ? 'text-rose-400 animate-bounce' : 'text-amber-300 animate-pulse'}`}>
                {questionTimeLeft}s
              </span>
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
                  ● Canal Realtime Conectado // En espera del docente
                </span>
              </div>
            ) : (
              // ACTIVE QUESTION CARD
              <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-fuchsia-500/70 shadow-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 uppercase">
                    {activeQuestion.type === 'true_false' 
                      ? 'EVALUACIÓN FORMATIVA // VERDADERO O FALSO' 
                      : activeQuestion.type === 'written' 
                      ? 'EVALUACIÓN FORMATIVA // DESARROLLO ESCRITO' 
                      : 'EVALUACIÓN FORMATIVA // OPCIÓN MÚLTIPLE'}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold font-orbitron">+100 PS RECOMPENSA</span>
                </div>

                <h3 className="text-sm md:text-base font-bold text-white font-sans border-l-4 border-fuchsia-400 pl-4 py-1 leading-relaxed">
                  {activeQuestion.question}
                </h3>

                {/* 1. Multiple Choice Options (A, B, C, D) */}
                {(!activeQuestion.type || activeQuestion.type === 'alternatives' || activeQuestion.type === 'multiple_choice') && (
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
                )}

                {/* 2. True / False Options */}
                {activeQuestion.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {['Verdadero', 'Falso'].map((tf) => {
                      const isSelected = selectedOption === tf;
                      const isTrue = tf === 'Verdadero';

                      return (
                        <button
                          key={tf}
                          disabled={hasSubmitted}
                          onClick={() => handleAnswerSubmit(tf, tf)}
                          className={`p-5 rounded-2xl border-2 font-orbitron font-black text-sm uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isSelected
                              ? isTrue 
                                ? 'bg-emerald-950 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                                : 'bg-rose-950 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-fuchsia-400'
                          }`}
                        >
                          <span>{isTrue ? '🟢' : '🔴'}</span>
                          <span>{tf}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. Open Written Response Form */}
                {activeQuestion.type === 'written' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleAnswerSubmit('ESCRITA', writtenAnswerText); }} className="space-y-3 pt-2">
                    <textarea
                      rows={3}
                      disabled={hasSubmitted}
                      value={writtenAnswerText}
                      onChange={(e) => setWrittenAnswerText(e.target.value)}
                      placeholder="Escribe tu razonamiento o respuesta detallada..."
                      className="w-full bg-slate-950 border-2 border-fuchsia-500/60 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-fuchsia-400 font-sans"
                    />
                    {!hasSubmitted && (
                      <button
                        type="submit"
                        disabled={!writtenAnswerText.trim()}
                        className={`w-full py-3.5 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                          writtenAnswerText.trim()
                            ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>ENVIAR RESPUESTA ESCRITA</span>
                      </button>
                    )}
                  </form>
                )}

                {/* Response Feedback Toast */}
                {hasSubmitted && (
                  <div className={`p-4 rounded-xl border text-center space-y-1 animate-in fade-in duration-200 ${
                    submitFeedback?.isCorrect 
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                  }`}>
                    <p className="font-bold font-orbitron text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Respuesta Registrada con Éxito!</span>
                    </p>
                    <p className="text-[11px] font-sans">
                      {submitFeedback?.text || 'Tu respuesta fue enviada en vivo al panel del profesor Carlos Rivas.'}
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
