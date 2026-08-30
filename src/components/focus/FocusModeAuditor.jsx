import React, { useState, useEffect } from 'react';
import { useFocusMode } from '../../context/FocusModeProvider';

export default function FocusModeAuditor({ showExplanations = true }) {
  const focusContext = useFocusMode() || {};
  const { isPhoneInCase, currentSession, handleNfcEvent } = focusContext;

  const [isFocused, setIsFocused] = useState(() => {
    return isPhoneInCase || localStorage.getItem('aulock_auditor_focused') === 'true';
  });

  const [sessionStartTime, setSessionStartTime] = useState(() => {
    const saved = localStorage.getItem('aulock_auditor_session_start');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return null;
  });

  const [focusSeconds, setFocusSeconds] = useState(() => {
    const savedStart = parseInt(localStorage.getItem('aulock_auditor_session_start') || '0', 10);
    const isAct = localStorage.getItem('aulock_auditor_focused') === 'true';
    return (isAct && savedStart > 0) ? Math.floor((Date.now() - savedStart) / 1000) : 0;
  });

  const [attentionPoints, setAttentionPoints] = useState(() => {
    const saved = localStorage.getItem('aulock_auditor_points');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [penaltyCount, setPenaltyCount] = useState(() => {
    const saved = localStorage.getItem('aulock_auditor_penalties');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [currentSubject] = useState(currentSession?.className || 'Mathematics: Quadratic Equations');
  const [professorName] = useState(currentSession?.teacherName || 'Prof. Carlos Rivas');
  const [activationSource, setActivationSource] = useState('STUDENT_OR_TEACHER');

  useEffect(() => {
    if (isPhoneInCase && !isFocused) {
      const now = Date.now();
      setIsFocused(true);
      setSessionStartTime(now);
      localStorage.setItem('aulock_auditor_focused', 'true');
      localStorage.setItem('aulock_auditor_session_start', String(now));
      setActivationSource('NFC_CASE');
    }
  }, [isPhoneInCase]);

  // Real-time synchronization listener for Teacher Forced Focus Signal
  useEffect(() => {
    const checkForceFocus = () => {
      const forced = localStorage.getItem('aulock_force_focus_mode') === 'true';
      if (forced && !isFocused) {
        const now = Date.now();
        setIsFocused(true);
        setSessionStartTime(now);
        localStorage.setItem('aulock_auditor_focused', 'true');
        localStorage.setItem('aulock_auditor_session_start', String(now));
        setActivationSource('TEACHER_FORCED');
      } else if (localStorage.getItem('aulock_force_focus_mode') === 'false' && isFocused) {
        setIsFocused(false);
        localStorage.setItem('aulock_auditor_focused', 'false');
      }
    };

    checkForceFocus();
    window.addEventListener('storage', checkForceFocus);
    window.addEventListener('aulock_focus_event', checkForceFocus);
    return () => {
      window.removeEventListener('storage', checkForceFocus);
      window.removeEventListener('aulock_focus_event', checkForceFocus);
    };
  }, [isFocused]);

  // Absolute Timestamp Timer Calculation & Decoupled Visibility Change
  useEffect(() => {
    let timer = null;

    if (isFocused && sessionStartTime) {
      // Immediate tick to prevent any delay
      const initialElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      setFocusSeconds(initialElapsed);

      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setFocusSeconds(elapsed);

        if (elapsed > 0 && elapsed % 10 === 0) {
          setAttentionPoints(prev => {
            const updated = Math.min(200, prev + 2);
            localStorage.setItem('aulock_auditor_points', String(updated));
            return updated;
          });
        }
      }, 1000);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // ONLY log distraction penalty, NEVER reset the timer!
        setPenaltyCount(prev => {
          const updated = prev + 1;
          localStorage.setItem('aulock_auditor_penalties', String(updated));
          return updated;
        });
        setAttentionPoints(prev => {
          const updated = Math.max(0, prev - 15);
          localStorage.setItem('aulock_auditor_points', String(updated));
          return updated;
        });
      } else {
        // Tab restored: Recompute exact elapsed time from absolute timestamp
        if (sessionStartTime) {
          setFocusSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => {
      if (sessionStartTime) {
        setFocusSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
      }
    });

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFocused, sessionStartTime]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleFocusMode = () => {
    if (!isFocused) {
      const now = Date.now();
      setIsFocused(true);
      setSessionStartTime(now);
      setFocusSeconds(0);
      localStorage.setItem('aulock_auditor_focused', 'true');
      localStorage.setItem('aulock_auditor_session_start', String(now));
      setActivationSource('STUDENT_MANUAL');
    } else {
      if (window.confirm("¿Seguro que deseas finalizar el Modo Enfoque y registrar las métricas de la sesión?")) {
        setIsFocused(false);
        localStorage.setItem('aulock_auditor_focused', 'false');
      }
    }
  };

  return (
    <div className="bg-gray-950/95 border-2 border-cyan-500/60 p-4 md:p-5 rounded-2xl shadow-[0_0_30px_rgba(56,235,203,0.25)] relative font-mono mb-6">
      
      {/* HEADER AND STATUS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-cyan-900/60">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isFocused ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
          <h2 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-widest uppercase">
            FOCUS MODE // AULOCK MOBILE AUDIT
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-orbitron font-bold px-2.5 py-0.5 rounded-full border ${
            isFocused 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-400 animate-pulse uppercase' 
              : 'bg-gray-900 text-cyan-400 border-cyan-800 uppercase'
          }`}>
            {isFocused ? '● FOCUS MODE ACTIVE' : '○ STANDBY'}
          </span>
          {isFocused && (
            <span className="text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 uppercase">
              {activationSource === 'NFC_CASE' ? '🔒 NFC POUCH' : '📱 ACTIVATED'}
            </span>
          )}
        </div>
      </div>

      {/* MAIN METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center my-4">
        
        {/* CURRENT SUBJECT */}
        <div className="bg-gray-900/90 p-3 rounded-xl border border-cyan-900 flex flex-col justify-center">
          <span className="text-[9px] text-cyan-400 font-orbitron font-bold uppercase mb-0.5">// SESSION SUBJECT:</span>
          <p className="text-xs font-bold text-white font-orbitron truncate">{currentSubject}</p>
          <p className="text-[10px] text-cyan-300/80 mt-0.5">Taught by: {professorName}</p>
        </div>

        {/* FOCUS TIMER */}
        <div className="bg-gray-900/90 p-3 rounded-xl border border-cyan-500/40 text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-extrabold font-orbitron text-white tracking-widest drop-shadow-[0_0_10px_rgba(56,235,203,0.6)]">
            {formatTime(focusSeconds)}
          </p>
          <p className="text-[9px] text-cyan-400 font-mono font-bold uppercase mt-0.5">CONTINUOUS ATTENTION TIME</p>
        </div>

        {/* POINTS AND EXITS */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-center">
            <p className="text-[9px] text-cyan-400 font-orbitron font-bold uppercase">POINTS (PS)</p>
            <p className="text-base font-bold font-orbitron text-emerald-400 mt-0.5">{attentionPoints} PS</p>
          </div>
          <div className="p-2.5 bg-fuchsia-950/40 border border-fuchsia-800/60 rounded-xl text-center">
            <p className="text-[9px] text-fuchsia-300 font-orbitron font-bold uppercase">APP EXITS</p>
            <p className="text-base font-bold font-orbitron text-fuchsia-400 mt-0.5">{penaltyCount} times</p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex flex-col gap-1.5 justify-center">
          <button
            onClick={toggleFocusMode}
            className={`w-full py-3 rounded-xl font-orbitron font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              isFocused
                ? 'bg-red-950 border border-red-500 text-red-200 hover:bg-red-900 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 border border-cyan-400 text-white shadow-[0_0_15px_rgba(56,235,203,0.4)] hover:opacity-90'
            }`}
          >
            <span>{isFocused ? '🛑 FINISH SESSION' : '🚀 START FOCUS MODE'}</span>
          </button>

          {handleNfcEvent && (
            <button
              onClick={() => handleNfcEvent({ tagId: 'NFC_LOCK_2026', studentId: 'STU_JUAN' })}
              className="w-full py-1.5 bg-gray-900 border border-cyan-800 hover:border-cyan-400 text-cyan-300 font-orbitron text-[9px] rounded-lg transition cursor-pointer text-center"
            >
              <span>📶 {isPhoneInCase ? 'TAP OUT NFC POUCH' : 'SIMULATE NFC TAP IN'}</span>
            </button>
          )}
        </div>

      </div>

      {/* DESCRIPTIVE EXPLANATIONS */}
      {showExplanations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-cyan-900/60 text-[11px] font-sans">
          <div className="bg-gray-900/80 p-2.5 rounded-xl border border-cyan-950">
            <span className="font-bold text-cyan-300 font-orbitron text-[10px] block mb-0.5 uppercase">📱 WHERE DOES THE STUDENT SEE THE COUNTER?</span>
            <p className="text-cyan-100/90 leading-tight">In the Live Classroom header and Performance tab. The Visibility API deducts -15 PS if the app is minimized.</p>
          </div>
          <div className="bg-gray-900/80 p-2.5 rounded-xl border border-fuchsia-950">
            <span className="font-bold text-fuchsia-300 font-orbitron text-[10px] block mb-0.5 uppercase">👨‍🏫 WHO STARTS THE CLASS SESSION?</span>
            <p className="text-cyan-100/90 leading-tight">The teacher starts the session on the Teacher Dashboard. Attention metrics feed the live teacher traffic light.</p>
          </div>
        </div>
      )}

    </div>
  );
}
