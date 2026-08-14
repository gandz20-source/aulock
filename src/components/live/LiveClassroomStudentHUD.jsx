import React, { useState, useEffect } from 'react';

export default function LiveClassroomStudentHUD() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [understandingLevel, setUnderstandingLevel] = useState(null);

  // Live question loaded from localStorage broadcast or fallback
  const [activeQuestion, setActiveQuestion] = useState(() => {
    const saved = localStorage.getItem('aulock_active_question');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          question: parsed.question || parsed.text || '¿Cuál es el resultado de resolver la ecuación de segundo grado $x^2 - 5x + 6 = 0$?',
          options: parsed.options || ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
          timeLimit: parsed.timeLimit || parsed.timer_seconds || 45
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      question: '¿Cuál es el resultado de resolver la ecuación de segundo grado $x^2 - 5x + 6 = 0$?',
      options: ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
      timeLimit: 45
    };
  });

  // Listen for real-time question broadcasts from Teacher Dashboard
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('aulock_active_question');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveQuestion({
            question: parsed.question || parsed.text || '¿Cuál es el resultado de resolver la ecuación de segundo grado $x^2 - 5x + 6 = 0$?',
            options: parsed.options || ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
            timeLimit: parsed.timeLimit || parsed.timer_seconds || 45
          });
          setTimeLeft(parsed.timeLimit || parsed.timer_seconds || 45);
          setSelectedOption(null);
          setHasSubmitted(false);
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Countdown timer simulation for active live question
  useEffect(() => {
    if (timeLeft > 0 && !hasSubmitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, hasSubmitted]);

  const handleAnswerSubmit = (optionId) => {
    setSelectedOption(optionId);
    setHasSubmitted(true);
  };

  const handleUnderstandingFeedback = (level) => {
    setUnderstandingLevel(level);
    localStorage.setItem('aulock_student_understanding', JSON.stringify({
      level,
      timestamp: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-emerald-900 rounded-3xl">
      
      {/* 🟢 CABECERA DE MÓDULO ACTIVO (Módulo 3: Aula en Vivo) */}
      <div className="p-3.5 mb-6 bg-gray-950 border-2 border-emerald-500/60 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
          <h1 className="text-sm md:text-base font-orbitron font-extrabold text-emerald-300 tracking-widest uppercase">
            AULA EN VIVO // SESIÓN ACTIVA CON PROFESORA MARÍA GONZÁLEZ
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg shrink-0">
          <span className="text-xs text-emerald-400 font-bold">⏱️ TIEMPO RESTANTE:</span>
          <span className="text-sm font-bold text-white font-orbitron">{timeLeft}s</span>
        </div>
      </div>

      {/* 🟢 ZONA PRINCIPAL DE PREGUNTA EN VIVO (Holograma Interactivo) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Pregunta y Opciones (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-950/90 border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
              TIPO: ALTERNATIVAS MÚLTIPLES
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">VALOR: 100 PS</span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-white mb-6 font-sans border-l-4 border-emerald-400 pl-4 leading-relaxed">
            {activeQuestion.question}
          </h2>

          {/* Opciones de Respuesta Estilo Terminal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {activeQuestion.options.map((optText, idx) => {
              const letterId = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'
              const isSelected = selectedOption === letterId || selectedOption === optText;

              return (
                <button
                  key={idx}
                  disabled={hasSubmitted}
                  onClick={() => handleAnswerSubmit(letterId)}
                  className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-gray-900/80 border-cyan-900/60 text-cyan-200 hover:border-emerald-500 hover:bg-gray-900'
                  }`}
                >
                  <span className="font-medium">{optText}</span>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                    isSelected ? 'border-emerald-400 bg-emerald-500 text-black font-bold' : 'border-cyan-700'
                  }`}>
                    {letterId}
                  </span>
                </button>
              );
            })}
          </div>

          {hasSubmitted && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500 rounded-xl text-center space-y-1 animate-fade-in">
              <p className="text-emerald-400 font-bold font-orbitron text-xs uppercase tracking-wider">¡RESPUESTA REGISTRADA EN EL NÚCLEO!</p>
              <p className="text-[11px] text-cyan-300">Esperando sincronización del profesor para la siguiente fase.</p>
            </div>
          )}
        </div>

        {/* Panel Lateral del Alumno (Sintonía de Aula y Estado) */}
        <div className="space-y-6">
          
          {/* Widget de Sintonía Emocional en Vivo */}
          <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl space-y-3">
            <h3 className="text-xs font-orbitron font-bold text-cyan-300">// SINTONÍA DE COMPRENSIÓN</h3>
            <p className="text-[11px] text-cyan-400/80">¿Cómo evalúas tu ritmo de aprendizaje actual en esta clase?</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleUnderstandingFeedback('CLARO')}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                  understandingLevel === 'CLARO'
                    ? 'bg-green-900 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                    : 'bg-green-950/50 border-green-700 text-green-300 hover:bg-green-900'
                }`}
              >
                🟢 CLARO
              </button>

              <button 
                onClick={() => handleUnderstandingFeedback('RÁPIDO')}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                  understandingLevel === 'RÁPIDO'
                    ? 'bg-yellow-900 border-yellow-400 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                    : 'bg-yellow-950/50 border-yellow-700 text-yellow-300 hover:bg-yellow-900'
                }`}
              >
                🟡 RÁPIDO
              </button>

              <button 
                onClick={() => handleUnderstandingFeedback('DUDA')}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                  understandingLevel === 'DUDA'
                    ? 'bg-red-900 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'bg-red-950/50 border-red-700 text-red-300 hover:bg-red-900'
                }`}
              >
                🔴 DUDA
              </button>
            </div>
            {understandingLevel && (
              <p className="text-[10px] text-emerald-400 font-bold text-center pt-1">
                ✓ Sintonía "{understandingLevel}" enviada al tablero de la Profesora.
              </p>
            )}
          </div>

          {/* Insignia Semanal */}
          <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-magenta-950 border border-magenta-500 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(217,70,239,0.3)] shrink-0">
              🎖️
            </div>
            <div>
              <span className="text-[10px] font-orbitron text-magenta-300 font-bold">// INSIGNIA ACTIVA</span>
              <h4 className="text-xs font-bold text-white">La Escucha Activa</h4>
              <p className="text-[10px] text-cyan-400">Respeto de turnos en plenaria.</p>
            </div>
          </div>

        </div>

      </div>

      {/* 🟢 SECCIÓN INFERIOR: ACUERDOS, EFEMÉRIDES Y CONVIVENCIA EN MODO CIBER-TECH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Efeméride Ciudadana */}
        <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-orbitron text-cyan-400 font-bold">// EFEMÉRIDE CIUDADANA • 2026-05-21</span>
              <span className="text-[10px] text-green-400 font-bold">MEMORIA ACTIVA</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2 font-orbitron">Día de las Glorias Navales</h3>
            <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
              Hoy recordamos un hito de nuestra historia. Más allá de la batalla, valoremos el diálogo y la paz como herramientas para resolver conflictos.
            </p>
          </div>
        </div>

        {/* Convivencia y Respeto Escolar (Rediseñado en oscuro) */}
        <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-orbitron text-magenta-300 font-bold">// CONVIVENCIA & RESPETO ESCOLAR</span>
              <span className="text-[10px] text-magenta-400 font-bold">PROTOCOLO DE EMPATÍA</span>
            </div>
            <p className="text-xs text-magenta-100 italic leading-relaxed font-sans">
              "El respeto y la empatía hacia el pensamiento de tus compañeros enriquecen el diálogo y fortalecen a toda la comunidad educativa."
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-magenta-900/40 flex justify-between items-center text-[10px] text-cyan-400 font-bold">
            <span>ESTADO DEL CLIMA: 85% ÓPTIMO</span>
            <span className="text-green-400">● CONECTADO</span>
          </div>
        </div>

      </div>

    </div>
  );
}
