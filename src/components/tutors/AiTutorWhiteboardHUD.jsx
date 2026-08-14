import React, { useState } from 'react';

export default function AiTutorWhiteboardHUD() {
  const tutorsList = [
    { name: 'Tecnología Ada', role: 'Naturaleza de la Ciencia (STEM)', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', welcome: '¡Hola! Soy Ada Tech. ¿Qué experimento o hipótesis investigamos hoy?' },
    { name: 'Profesor Átomo', role: 'Física y Química', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', welcome: 'Analicemos fórmulas y reacciones paso a paso en la pizarra.' },
    { name: 'Dra. Flora', role: 'Ciencias de la Vida', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', welcome: 'Exploremos los ecosistemas y la biología celular juntos.' },
    { name: 'GeoMente', role: 'Tierra y Universo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', welcome: 'Descubramos los misterios de nuestro planeta y el cosmos.' },
  ];

  const [selectedTutor, setSelectedTutor] = useState({
    name: 'Profesor Átomo',
    role: 'Ciencias Físicas y Químicas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // Referencia visual de joven latino
    welcome: '¡Hola! Analicemos las leyes físicas de Newton. Adjunta o escanea tu ejercicio de vectores.'
  });

  const [activePersona, setActivePersona] = useState('Videojuegos');
  const [inputExercise, setInputExercise] = useState('');
  const [sessionState, setSessionState] = useState('IDLE'); // IDLE, ANALYZING, SUCCESS, FAILED
  const [aiSteps, setAiSteps] = useState([]);

  const personas = ['Fútbol', 'Videojuegos', 'Música y Trap', 'Cocina', 'Anime', 'Fórmula 1'];

  // Simulación de revisión de IA (Ej: Validar 2 + 2 = 4 o un ejercicio complejo)
  const handleValidateExercise = (e) => {
    e.preventDefault();
    if (!inputExercise.trim()) return;

    setSessionState('ANALYZING');

    setTimeout(() => {
      // Si el usuario escribe '4' o '2+2=4' o '2x+5=27' con x=11, simulamos éxito, de lo contrario activamos la pizarra de error
      if (inputExercise.includes('4') || inputExercise.includes('11') || inputExercise.toLowerCase().includes('correcto')) {
        setSessionState('SUCCESS');
      } else {
        setSessionState('FAILED');
        setAiSteps([
          { step: 1, title: 'Identificar la operación', desc: `Tomamos tu expresión y analizamos los términos base (${inputExercise}).` },
          { step: 2, title: 'Aplicación de la regla matemática / socrática', desc: `Desglosamos las constantes y aplicamos el principio de equivalencia paso a paso según ${selectedTutor.name}.` },
          { step: 3, title: 'Resultado Correcto & Retroalimentación', desc: 'El valor final esperado es 4 (o x = 11). ¡Inténtalo de nuevo aplicando esta regla!' }
        ]);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-cyan-900 rounded-3xl">
      
      {/* 🟢 CABECERA DE MÓDULO (Módulo 4: Tutores IA) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b-2 border-cyan-500/40 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
            <h1 className="text-base md:text-lg font-orbitron font-extrabold text-white tracking-widest uppercase">
              TUTORES SOCRÁTICOS IA // NÚCLEO DE APRENDIZAJE PERSONALIZADO
            </h1>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1">
            Asistencia inteligente con validación por cámara y explicación paso a paso en pizarra digital.
          </p>
        </div>
      </header>

      {/* 🟢 SELECTOR DE TUTORES (Con Fotos de Jóvenes / Estudiantes Latinos) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {tutorsList.map((tutor, idx) => (
          <div
            key={idx}
            onClick={() => { setSelectedTutor(tutor); setSessionState('IDLE'); setInputExercise(''); }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
              selectedTutor.name === tutor.name
                ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(56,235,203,0.3)] text-white'
                : 'bg-gray-950/60 border-cyan-900/60 text-cyan-300 hover:border-cyan-500'
            }`}
          >
            <img src={tutor.avatar} alt={tutor.name} className="w-10 h-10 rounded-full object-cover border border-cyan-400 shrink-0" />
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold font-orbitron truncate">{tutor.name}</h3>
              <p className="text-[9px] text-cyan-400/80 truncate">{tutor.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 BARRA DE PERSONALIZACIÓN ("Aprende a tu manera") */}
      <div className="p-3 mb-6 rounded-xl bg-gray-950 border border-cyan-900/80 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-orbitron font-bold text-cyan-400 uppercase">⚡ MOTOR GOOGLE "APRENDE A TU MANERA":</span>
        <div className="flex flex-wrap gap-2">
          {personas.map((pers, i) => (
            <button
              key={i}
              onClick={() => setActivePersona(pers)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer font-bold ${
                activePersona === pers
                  ? 'bg-fuchsia-900 border border-fuchsia-400 text-white shadow-[0_0_10px_rgba(217,70,239,0.4)]'
                  : 'bg-gray-900 text-cyan-300 border border-cyan-900 hover:border-cyan-500'
              }`}
            >
              {pers}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 ZONA CENTRAL: INTERACCIÓN Y LA NUEVA PIZARRA SOCRÁTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Consola del Tutor y Entrada del Alumno (1 Columna) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gray-950/90 border-2 border-cyan-500/50 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <img src={selectedTutor.avatar} alt="Tutor" className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_10px_#38EBCB] shrink-0" />
              <div>
                <h3 className="text-xs font-orbitron font-bold text-white">{selectedTutor.name}</h3>
                <span className="text-[9px] font-bold text-green-400 bg-green-950 px-2 py-0.5 rounded border border-green-800">Tutor Activo</span>
              </div>
            </div>
            
            <p className="text-xs text-cyan-200 bg-cyan-950/40 p-3 rounded-xl border border-cyan-900 font-sans leading-relaxed">
              "{selectedTutor.welcome} (Analogía aplicada: usando conceptos de <span className="text-fuchsia-400 font-bold">{activePersona}</span>)"
            </p>

            <form onSubmit={handleValidateExercise} className="space-y-3">
              <label className="block text-[10px] font-bold text-cyan-400">// INGRESA TU RESPUESTA O ECUACIÓN (Ej: 2 + 2):</label>
              <input
                type="text"
                value={inputExercise}
                onChange={(e) => setInputExercise(e.target.value)}
                placeholder="Escribe tu resultado (ej. 4)..."
                className="w-full bg-gray-900 border border-cyan-700 rounded-xl p-3 text-xs text-white outline-none focus:border-fuchsia-500 font-mono"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={sessionState === 'ANALYZING'}
                  className="flex-1 py-2.5 bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 font-orbitron font-bold text-xs rounded-xl transition shadow-[0_0_10px_rgba(56,235,203,0.3)] disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                >
                  {sessionState === 'ANALYZING' ? 'REVISANDO...' : '🔍 VALIDAR CON IA'}
                </button>
                <button
                  type="button"
                  onClick={() => alert('📷 Activando cámara del dispositivo para escaneo óptico de cuaderno...')}
                  className="px-4 py-2.5 bg-fuchsia-950 border border-fuchsia-500 text-fuchsia-300 hover:bg-fuchsia-900 font-orbitron font-bold text-xs rounded-xl transition uppercase cursor-pointer"
                >
                  📷 ESCANEAR
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Columna Derecha: LA PIZARRA SOCRÁTICA DIGITAL (2 Columnas) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-950/95 border-2 border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.2)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-900">
              <h3 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase">// PIZARRA SOCRÁTICA INTELIGENTE (EXPLICACIÓN PASO A PASO)</h3>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">ESTADO: {sessionState}</span>
            </div>

            {/* Estados de la Pizarra */}
            {sessionState === 'IDLE' && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-cyan-900 rounded-xl bg-gray-900/40 space-y-2">
                <div className="text-3xl mb-1">💡</div>
                <p className="text-xs text-cyan-300 font-orbitron font-bold uppercase">PIZARRA EN ESPERA DE DATOS</p>
                <p className="text-[11px] text-cyan-500 max-w-sm font-sans">
                  Envía tu respuesta o escanea un ejercicio para que el tutor desglose la solución en esta pizarra digital.
                </p>
              </div>
            )}

            {sessionState === 'ANALYZING' && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-10 h-10 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-fuchsia-300 font-orbitron font-bold animate-pulse uppercase tracking-wider">ANALIZANDO PROCEDIMIENTO EN EL NÚCLEO...</p>
              </div>
            )}

            {sessionState === 'SUCCESS' && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-emerald-950/30 border border-emerald-500/50 rounded-xl space-y-2">
                <div className="text-4xl mb-1">🎉</div>
                <p className="text-sm font-bold font-orbitron text-emerald-400 uppercase">¡RESULTADO APROBADO CON ÉXITO!</p>
                <p className="text-xs text-emerald-200 max-w-md font-sans">La IA validó que tu razonamiento y el resultado son correctos.</p>
                <button 
                  onClick={() => setSessionState('IDLE')}
                  className="mt-2 px-6 py-2 bg-emerald-900 border border-emerald-400 text-white text-xs font-orbitron font-bold rounded-lg hover:bg-emerald-800 transition cursor-pointer"
                >
                  SIGUIENTE EJERCICIO ➔
                </button>
              </div>
            )}

            {sessionState === 'FAILED' && (
              <div className="space-y-4">
                <div className="p-3 bg-red-950/40 border border-red-500/60 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-red-400 font-orbitron">⚠️ ERROR DETECTADO EN EL PROCEDIMIENTO</p>
                    <p className="text-[11px] text-cyan-200 mt-0.5 font-sans">La IA ha generado el desglose en la pizarra para corregir tu enfoque:</p>
                  </div>
                  <span className="text-xs font-bold text-red-400 font-orbitron">PASO A PASO</span>
                </div>

                {/* Pasos explicados legibles en la pizarra */}
                <div className="space-y-3">
                  {aiSteps.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-gray-900 border border-cyan-800/80 rounded-xl flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-fuchsia-950 border border-fuchsia-400 flex items-center justify-center text-xs font-bold text-fuchsia-300 shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white font-orbitron">{item.title}</h4>
                        <p className="text-xs text-cyan-300 mt-1 font-sans leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { setSessionState('IDLE'); setInputExercise(''); }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-orbitron font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(56,235,203,0.4)] hover:opacity-90 transition cursor-pointer uppercase tracking-wider"
                >
                  🔄 CORREGIR Y VOLVER A INTENTAR
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-900/40 flex justify-between text-[10px] text-cyan-500 font-mono font-bold">
            <span>SOCRATIC ENGINE V2.5</span>
            <span>VALIDACIÓN DE CÁMARA: LISTA</span>
          </div>
        </div>

      </div>

    </div>
  );
}
