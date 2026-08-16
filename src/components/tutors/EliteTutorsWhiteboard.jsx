import React, { useState } from 'react';
import { handleTutorQueryService } from '../../services/GeminiService';

const SYSTEM_INSTRUCTION = `
Eres un Profesor Especialista de Élite en [MATERIA: Matemáticas, Física, Química o Lógica] para estudiantes de secundaria y universitarios en Chile.
Tu objetivo es evitar la frustración y la deserción académica mediante un enfoque pedagógico riguroso pero accesible.

REGLAS ESTRICTAS DE RESPUESTA:
1. NUNCA repitas la pregunta del alumno de forma robótica (prohibido usar frases como "Excelente pregunta sobre..."). Ve directo al grano académico.
2. Si el modo es 'EXPRESS': Genera exactamente 3 bloques o "diapositivas" de contenido estructurado: Concepto Clave, Aplicación Práctica (Fórmula/Regla) y Conclusión o Patrón de Error Común.
3. Si el modo es 'GUIDED' (Aprendizaje Guiado): No des la respuesta final del ejercicio. Desglosa el problema en pasos lógicos (Paso 1, Paso 2...) optimizados para ser proyectados en una pizarra digital con notación matemática limpia.
4. Utiliza notación matemática formal (ej: LaTeX o texto estructurado claro para ecuaciones) y un tono motivador, analítico y profesional.
`;

export default function EliteTutorsWhiteboard() {
  const specialists = [
    { name: 'Tutor Matemática', subject: 'Matemáticas & Cálculo', avatar: '📐', bio: 'Especialista en álgebra, geometría, cálculo y resolución analítica de problemas.' },
    { name: 'Tutor Física', subject: 'Física & Mecánica', avatar: '⚙️', bio: 'Especialista en dinámica, vectores, cinemática, energía y física aplicada.' },
    { name: 'Tutor Química', subject: 'Química & Estructura Molecular', avatar: '⚗️', bio: 'Especialista en estequiometría, enlaces químicos, soluciones y reacciones.' },
    { name: 'Tutor Lógica & Programación', subject: 'Lógica & Computación', avatar: '💻', bio: 'Especialista en algoritmos, estructuras de datos y pensamiento computacional.' },
  ];

  const [selectedSpecialist, setSelectedSpecialist] = useState(specialists[0]);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('EXPRESS'); // 'EXPRESS' (NotebookLM style) o 'GUIDED' (Paso a paso socrático)
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [tutorResponse, setTutorResponse] = useState('');
  const [expressSlides, setExpressSlides] = useState([]);
  const [guidedSteps, setGuidedSteps] = useState([]);

  const handleConsult = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    const topic = query.trim();

    try {
      // Llamada al servicio con Gemini 2.5 Flash + JSON mode
      const res = await handleTutorQueryService({
        specialist: selectedSpecialist.name,
        query: topic,
        mode: mode
      });

      if (res && res.tutor_response) {
        setTutorResponse(res.tutor_response);
      }

      if (res && res.whiteboard_data) {
        const wb = res.whiteboard_data;
        if (wb.slide_1 && wb.slide_2 && wb.slide_3) {
          setExpressSlides([
            { title: wb.slide_1.title || "Fundamentos Teóricos", concept: wb.slide_1.content || "", formula: "Principio Analítico" },
            { title: wb.slide_2.title || "Fórmula / Regla General", concept: wb.slide_2.content || "", formula: "Fórmula de Aplicación" },
            { title: wb.slide_3.title || "Impacto en Evaluaciones", concept: wb.slide_3.content || "", formula: "Patrón de Verificación" }
          ]);
        }
      }
    } catch (err) {
      console.warn("Falling back to local template response:", err);
    }

    const cleanTopic = topic.toLowerCase();

    // Generación directa estructurada según la especificación JSON del Backend
    if (mode === 'EXPRESS') {
      if (cleanTopic.includes('cuadratica') || cleanTopic.includes('cuadrática') || cleanTopic.includes('ecuacion') || cleanTopic.includes('ecuación')) {
        setTutorResponse("Para resolver esta ecuación cuadrática, primero debemos aislar los términos independientes aplicando el principio de equivalencia.");
        setExpressSlides([
          {
            title: "Fundamentos Teóricos",
            concept: "Una ecuación cuadrática general se expresa como ax² + bx + c = 0.",
            formula: "ax² + bx + c = 0"
          },
          {
            title: "Fórmula / Regla General",
            concept: "Representa el método universal de resolución para encontrar las raíces reales o complejas.",
            formula: "x = (-b ± √(b² - 4ac)) / (2a)"
          },
          {
            title: "Impacto en Evaluaciones",
            concept: "Cuidado con los signos negativos al cuadrado; es el error más común en pruebas.",
            formula: "Δ = b² - 4ac"
          }
        ]);
      } else if (cleanTopic.includes('fuerza') || cleanTopic.includes('newton') || cleanTopic.includes('fisica') || cleanTopic.includes('física')) {
        setTutorResponse("Para analizar la dinámica del cuerpo, relacionamos vectorialmente la masa inercial con la aceleración neta producida.");
        setExpressSlides([
          {
            title: "Segunda Ley de Newton",
            concept: "La aceleración producida es proporcional a la fuerza e inversamente proporcional a la masa del cuerpo.",
            formula: "F_neta = m · a"
          },
          {
            title: "Fórmula / Vector de Fuerza",
            concept: "En tres dimensiones, la suma de componentes en X, Y y Z debe resolverse de forma independiente.",
            formula: "∑F = m · (d²r / dt²)"
          },
          {
            title: "Impacto en Evaluaciones",
            concept: "Evita sumar magnitudes escalares directamente sin desglosar en componentes rectangulares.",
            formula: "[N] = [kg · m/s²]"
          }
        ]);
      } else {
        setTutorResponse(`Análisis riguroso de "${topic}" desglosado en tres ejes fundamentales de aprendizaje.`);
        setExpressSlides([
          {
            title: `Fundamentos de ${topic}`,
            concept: `Aislamiento directo de los principios teóricos fundamentales que rigen este fenómeno académico.`,
            formula: `f(X) ➔ Y`
          },
          {
            title: `Fórmula / Regla General`,
            concept: `Formulación formal de las ecuaciones y algoritmos necesarios para resolver ejercicios de este tipo.`,
            formula: `ΔS = f(T)`
          },
          {
            title: `Impacto en Evaluaciones`,
            concept: `Análisis de los puntos donde los estudiantes suelen cometer errores algebraicos o conceptuales en pruebas.`,
            formula: `Validación Socrática ✓`
          }
        ]);
      }
    } else {
      // MODO GUIDED (Aprendizaje Guiado Socrático Paso a Paso)
      setTutorResponse("Desglose socrático en desarrollo. Resuelve cada punto planteado sin apresurar la solución final.");
      setGuidedSteps([
        {
          step: '01',
          title: 'Aislamiento de Datos & Planteamiento Formal',
          notation: `Paso 1: Identificar constantes y variables de "${topic}"`,
          note: 'Escribe en tu cuaderno los valores dados y la incógnita que buscas despejar sin asumir resultados previos.'
        },
        {
          step: '02',
          title: 'Selección del Modelo Matemático / Físico',
          notation: `Paso 2: Aplicar la Fórmula / Teorema correspondiente`,
          note: 'Verifica las unidades de medida en el Sistema Internacional (SI) y efectúa las sustituciones.'
        },
        {
          step: '03',
          title: 'Punto de Comprobación Socrática',
          notation: `Paso 3: Simplificación de términos semejantes`,
          note: 'No entregamos la respuesta final. Realiza el cálculo en tu cuaderno e ingresa tu resultado para validar.'
        }
      ]);
    }

    setTimeout(() => {
      setLoading(false);
      setSessionActive(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-cyan-900 rounded-3xl">
      
      {/* 🟢 CABECERA DE ESPECIALISTAS */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b-2 border-cyan-500/40 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
            <h1 className="text-base md:text-lg font-orbitron font-extrabold text-white tracking-widest uppercase">
              CENTRO DE TUTORÍA ACADÉMICA // ESPECIALISTAS DE MATERIA
            </h1>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1">
            Resúmenes exprés automáticos y aprendizaje guiado interactivo en pizarra digital.
          </p>
        </div>
      </header>

      {/* 🟢 SELECTOR DE PROFESORES ESPECIALISTAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {specialists.map((spec, idx) => (
          <div
            key={idx}
            onClick={() => { setSelectedSpecialist(spec); setSessionActive(false); setQuery(''); }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
              selectedSpecialist.name === spec.name
                ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_15px_rgba(56,235,203,0.3)] text-white'
                : 'bg-gray-950/60 border-cyan-900/60 text-cyan-300 hover:border-cyan-500'
            }`}
          >
            <img src={spec.avatar} alt={spec.name} className="w-12 h-12 rounded-full object-cover border border-cyan-400 shrink-0" />
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold font-orbitron truncate">{spec.name}</h3>
              <p className="text-[10px] text-cyan-400 font-bold truncate">{spec.subject}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 ZONA DE CONSULTA Y SELECCIÓN DE MODO */}
      <div className="p-5 rounded-2xl bg-gray-950/90 border-2 border-cyan-500/50 shadow-xl mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <img src={selectedSpecialist.avatar} alt="Active" className="w-10 h-10 rounded-full object-cover border border-fuchsia-400 shrink-0" />
          <div>
            <p className="text-[10px] font-orbitron font-bold text-fuchsia-400">TUTOR ACTIVO: {selectedSpecialist.name.toUpperCase()}</p>
            <p className="text-xs text-cyan-200">{selectedSpecialist.bio}</p>
          </div>
        </div>

        <form onSubmit={handleConsult} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-cyan-400 mb-1">// ¿QUÉ TEMA O EJERCICIO NECESITAS DOMINAR HOY?</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Ecuaciones cuadráticas, Leyes de Newton, Estequiometría..."
              className="w-full bg-gray-900 border border-cyan-700 rounded-xl p-3 text-xs text-white outline-none focus:border-fuchsia-500 font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Selector de Modo: Expres vs Guiado */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setMode('EXPRESS')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-orbitron font-bold border transition cursor-pointer ${
                  mode === 'EXPRESS' 
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_10px_rgba(56,235,203,0.3)]' 
                    : 'bg-gray-900 border-cyan-900 text-cyan-400 hover:text-white'
                }`}
              >
                ⚡ 1. PRESENTACIÓN EXPRÉS
              </button>
              <button
                type="button"
                onClick={() => setMode('GUIDED')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-orbitron font-bold border transition cursor-pointer ${
                  mode === 'GUIDED' 
                    ? 'bg-fuchsia-950 border-fuchsia-400 text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]' 
                    : 'bg-gray-900 border-cyan-900 text-cyan-400 hover:text-white'
                }`}
              >
                🧠 2. APRENDIZAJE GUIADO
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-orbitron font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(56,235,203,0.4)] hover:opacity-90 transition cursor-pointer disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? 'GENERANDO EN LA PIZARRA...' : '🚀 ACTIVAR CLASE EN PIZARRA'}
            </button>
          </div>
        </form>
      </div>

      {/* 🟢 LA PIZARRA DIGITAL INTELIGENTE (RESULTADO) */}
      <div className="p-6 rounded-2xl bg-slate-950 border-2 border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)] min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

        <div>
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-900 relative z-10">
            <h3 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase">
              // PIZARRA DIGITAL DE {selectedSpecialist.name.toUpperCase()} [{mode === 'EXPRESS' ? 'MODO: PRESENTACIÓN EXPRÉS' : 'MODO: APRENDIZAJE GUIADO'}]
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
              {sessionActive ? 'ACTIVO' : 'EN ESPERA'}
            </span>
          </div>

          {!sessionActive ? (
            <div className="h-64 flex flex-col items-center justify-center text-center relative z-10 space-y-2">
              <div className="text-4xl mb-1">🎓</div>
              <p className="text-xs text-cyan-300 font-orbitron font-bold uppercase">PIZARRA LISTA PARA LA CLASE</p>
              <p className="text-[11px] text-cyan-500 max-w-md font-sans leading-relaxed">
                Escribe un tema arriba y elige "Presentación Exprés" para un resumen global instantáneo, o "Aprendizaje Guiado" para resolver paso a paso.
              </p>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {/* BANNER DE RESPUESTA DIRECTA DEL TUTOR */}
              {tutorResponse && (
                <div className="p-3.5 bg-cyan-950/80 border border-cyan-500/60 rounded-xl flex items-start gap-3 shadow-md">
                  <span className="text-lg shrink-0">💡</span>
                  <div>
                    <span className="text-[10px] font-orbitron font-bold text-fuchsia-400 block uppercase">EXPLICACIÓN DEL PROFESOR ESPECIALISTA:</span>
                    <p className="text-xs text-cyan-100 font-sans leading-relaxed mt-0.5">{tutorResponse}</p>
                  </div>
                </div>
              )}
              {mode === 'EXPRESS' ? (
                /* VISTA ESTILO NOTEBOOKLM / PRESENTACIÓN EXPRÉS (3 DIAPOSITIVAS) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {expressSlides.map((slide, idx) => (
                    <div key={idx} className="p-4 bg-gray-900/90 border border-cyan-500/40 rounded-xl space-y-2 shadow-lg">
                      <span className="text-[10px] font-orbitron font-bold text-cyan-400 block">// SLIDE 0{idx + 1} // {idx === 0 ? 'CONCEPTO CLAVE' : idx === 1 ? 'APLICACIÓN PRÁCTICA' : 'PATRÓN DE ERROR & CONCLUSIÓN'}</span>
                      <h4 className="text-sm font-bold text-white">{slide.title}</h4>
                      <p className="text-xs text-cyan-200/90 font-sans leading-relaxed">{slide.concept}</p>
                      <div className="pt-2 border-t border-cyan-900/60">
                        <span className="text-[9px] text-fuchsia-400 font-mono font-bold block">FÓRMULA / NOTACIÓN:</span>
                        <p className="text-xs font-bold font-mono text-emerald-400 mt-0.5">{slide.formula}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* VISTA APRENDIZAJE GUIADO (PASO A PASO ESTILO PLUMÓN) */
                <div className="space-y-3">
                  <p className="text-xs text-cyan-300/80 italic mb-2">// Desglose socrático guiado por {selectedSpecialist.name} (Sin respuesta final previa):</p>
                  {guidedSteps.map((stepItem, idx) => (
                    <div key={idx} className="p-4 bg-gray-900/90 border border-cyan-500/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                      <div>
                        <span className="text-[9px] text-fuchsia-400 font-mono font-bold block">// PASO {stepItem.step} DE 03: {stepItem.title.toUpperCase()}</span>
                        <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">{stepItem.notation}</p>
                        <p className="text-xs text-cyan-200 mt-1 font-sans leading-relaxed">{stepItem.note}</p>
                      </div>
                      <button 
                        onClick={() => alert(`Enviando paso ${stepItem.step} a ${selectedSpecialist.name}...`)}
                        className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 text-xs font-orbitron font-bold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        RESPONDER
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-cyan-900/60 flex justify-between items-center text-[10px] text-cyan-400 font-mono font-bold relative z-10">
          <span>MOTOR DE SÍNTESIS: ACTIVO</span>
          <button 
            onClick={() => { setSessionActive(false); setQuery(''); }}
            className="px-3.5 py-1 bg-cyan-950 border border-cyan-600 rounded text-cyan-300 hover:bg-cyan-900 transition cursor-pointer"
          >
            🔄 NUEVA CONSULTA
          </button>
        </div>

      </div>

    </div>
  );
}
