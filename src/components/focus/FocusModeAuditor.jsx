import React, { useState, useEffect } from 'react';
import { useFocusMode } from '../../context/FocusModeProvider';

export default function FocusModeAuditor({ showExplanations = true }) {
  const focusContext = useFocusMode() || {};
  const { isPhoneInCase, currentSession, handleNfcEvent } = focusContext;

  const [isFocused, setIsFocused] = useState(isPhoneInCase || false);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [attentionPoints, setAttentionPoints] = useState(100);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [currentSubject] = useState(currentSession?.className || 'Matemáticas: Ecuaciones Cuadráticas');
  const [professorName] = useState(currentSession?.teacherName || 'Prof. Carlos Rivas');
  const [activationSource, setActivationSource] = useState('STUDENT_OR_TEACHER');

  useEffect(() => {
    if (isPhoneInCase) {
      setIsFocused(true);
      setActivationSource('NFC_CASE');
    }
  }, [isPhoneInCase]);

  useEffect(() => {
    let timer = null;

    if (isFocused) {
      timer = setInterval(() => {
        setFocusSeconds(prev => prev + 1);
        if (focusSeconds > 0 && focusSeconds % 10 === 0) {
          setAttentionPoints(prev => Math.min(200, prev + 2));
        }
      }, 1000);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          setPenaltyCount(prev => prev + 1);
          setAttentionPoints(prev => Math.max(0, prev - 15));
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        clearInterval(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isFocused, focusSeconds]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleFocusMode = () => {
    if (!isFocused) {
      setIsFocused(true);
      setActivationSource('STUDENT_MANUAL');
    } else {
      if (window.confirm("¿Seguro que deseas finalizar el Modo Enfoque y registrar las métricas de tu sesión?")) {
        setIsFocused(false);
      }
    }
  };

  return (
    <div className="bg-gray-950/95 border-2 border-cyan-500/60 p-4 md:p-5 rounded-2xl shadow-[0_0_30px_rgba(56,235,203,0.25)] relative font-mono mb-6">
      
      {/* CABECERA RESUMIDA Y ESTADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-cyan-900/60">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isFocused ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
          <h2 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-widest uppercase">
            MODO ENFOQUE // AUDITORÍA MÓVIL AULOCK
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-orbitron font-bold px-2.5 py-0.5 rounded-full border ${
            isFocused 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-400 animate-pulse uppercase' 
              : 'bg-gray-900 text-cyan-400 border-cyan-800 uppercase'
          }`}>
            {isFocused ? '● MODO ENFOQUE ACTIVO' : '○ EN ESPERA'}
          </span>
          {isFocused && (
            <span className="text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 uppercase">
              {activationSource === 'NFC_CASE' ? '🔒 FUNDA NFC' : '📱 ACTIVADO'}
            </span>
          )}
        </div>
      </div>

      {/* METRICAS PRINCIPALES (CRONÓMETRO + PUNTOS + SALIDAS + BOTÓN) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center my-4">
        
        {/* ASIGNATURA EN CURSO */}
        <div className="bg-gray-900/90 p-3 rounded-xl border border-cyan-900 flex flex-col justify-center">
          <span className="text-[9px] text-cyan-400 font-orbitron font-bold uppercase mb-0.5">// ASIGNATURA SESIÓN:</span>
          <p className="text-xs font-bold text-white font-orbitron truncate">{currentSubject}</p>
          <p className="text-[10px] text-cyan-300/80 mt-0.5">Dictada por: {professorName}</p>
        </div>

        {/* CRONÓMETRO GIGANTE */}
        <div className="bg-gray-900/90 p-3 rounded-xl border border-cyan-500/40 text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-extrabold font-orbitron text-white tracking-widest drop-shadow-[0_0_10px_rgba(56,235,203,0.6)]">
            {formatTime(focusSeconds)}
          </p>
          <p className="text-[9px] text-cyan-400 font-mono font-bold uppercase mt-0.5">TIEMPO ATENCIÓN CONTINUA</p>
        </div>

        {/* PUNTOS Y SALIDAS */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-center">
            <p className="text-[9px] text-cyan-400 font-orbitron font-bold uppercase">PUNTOS (PS)</p>
            <p className="text-base font-bold font-orbitron text-emerald-400 mt-0.5">{attentionPoints} PS</p>
          </div>
          <div className="p-2.5 bg-fuchsia-950/40 border border-fuchsia-800/60 rounded-xl text-center">
            <p className="text-[9px] text-fuchsia-300 font-orbitron font-bold uppercase">SALIDAS</p>
            <p className="text-base font-bold font-orbitron text-fuchsia-400 mt-0.5">{penaltyCount} veces</p>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="flex flex-col gap-1.5 justify-center">
          <button
            onClick={toggleFocusMode}
            className={`w-full py-3 rounded-xl font-orbitron font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              isFocused
                ? 'bg-red-950 border border-red-500 text-red-200 hover:bg-red-900 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 border border-cyan-400 text-white shadow-[0_0_15px_rgba(56,235,203,0.4)] hover:opacity-90'
            }`}
          >
            <span>{isFocused ? '🛑 FINALIZAR CLASE' : '🚀 INICIAR MODO ENFOQUE'}</span>
          </button>

          {handleNfcEvent && (
            <button
              onClick={() => handleNfcEvent({ tagId: 'NFC_LOCK_2026', studentId: 'STU_JUAN' })}
              className="w-full py-1.5 bg-gray-900 border border-cyan-800 hover:border-cyan-400 text-cyan-300 font-orbitron text-[9px] rounded-lg transition cursor-pointer text-center"
            >
              <span>📶 {isPhoneInCase ? 'TAP OUT FUNDA NFC' : 'SIMULAR TAP IN NFC'}</span>
            </button>
          )}
        </div>

      </div>

      {/* EXPLICACIONES DESPLEGABLES SI SE SOLICITA */}
      {showExplanations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-cyan-900/60 text-[11px] font-sans">
          <div className="bg-gray-900/80 p-2.5 rounded-xl border border-cyan-950">
            <span className="font-bold text-cyan-300 font-orbitron text-[10px] block mb-0.5 uppercase">📱 ¿DÓNDE VE EL ALUMNO EL CONTADOR?</span>
            <p className="text-cyan-100/90 leading-tight">En la cabecera del Aula en Vivo y en la pestaña Desempeño. La Visibility API resta -15 PS si minimizas la app.</p>
          </div>
          <div className="bg-gray-900/80 p-2.5 rounded-xl border border-fuchsia-950">
            <span className="font-bold text-fuchsia-300 font-orbitron text-[10px] block mb-0.5 uppercase">👨‍🏫 ¿QUIÉN INICIA LA CLASE Y DÓNDE SE REGISTRA?</span>
            <p className="text-cyan-100/90 leading-tight">El profesor inicia la clase en el Dashboard Docente. Los datos de atención alimentan el semáforo en vivo del profesor.</p>
          </div>
        </div>
      )}

    </div>
  );
}
