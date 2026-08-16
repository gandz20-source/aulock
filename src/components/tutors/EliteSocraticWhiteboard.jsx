import React, { useState } from 'react';

export default function EliteSocraticWhiteboardFixed() {
  const specialists = [
    { 
      name: 'Tutor Física', 
      subject: 'Física y Mecánica', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%238B5CF6' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23312E81' stroke='%23A78BFA' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='18' fill='%23C4B5FD' text-anchor='middle'>E = mc%C2%B2</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='22' fill='%23F472B6' text-anchor='middle'>%E2%9A%9B%EF%B8%8F F=ma</text></svg>", 
      bio: 'Especialista en dinámica, cinemática y leyes de Newton.' 
    },
    { 
      name: 'Tutor Matemática', 
      subject: 'Matemáticas & Cálculo', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%233B82F6' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%231E293B' stroke='%2360A5FA' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='20' fill='%2360A5FA' text-anchor='middle'>%E2%88%91 %E2%88%9A%CF%80</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='24' fill='%23F59E0B' text-anchor='middle'>1 2 3</text></svg>", 
      bio: 'Álgebra, Números, Geometría y Cálculo Superior.' 
    },
    { 
      name: 'Tutor Química', 
      subject: 'Química & Estructura', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2310B981' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23064E3B' stroke='%2334D399' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='18' fill='%2334D399' text-anchor='middle'>H%E2%82%82O %E2%80%A2 CO%E2%82%82</text><text x='60' y='78' font-family='sans-serif' font-weight='900' font-size='22' fill='%23A7F3D0' text-anchor='middle'>%E2%9A%97%EF%B8%8F NaCl</text></svg>", 
      bio: 'Estequiometría, Soluciones y Reacciones Químicas.' 
    },
    { 
      name: 'Tutor Lógica & Programación', 
      subject: 'Lógica & Computación', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2306B6D4' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23164E63' stroke='%2322D3EE' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='24' fill='%2322D3EE' text-anchor='middle'>%3C/%3E</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='18' fill='%23A5F3FC' text-anchor='middle'>1 0 1 0 1</text></svg>", 
      bio: 'Algoritmos, Estructuras de Datos y Pensamiento Lógico.' 
    },
  ];

  const [selectedSpecialist, setSelectedSpecialist] = useState(specialists[0]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hola. He sincronizado la pizarra digital. Escribe tu duda o concepto de física/matemática para iniciar el desglose analítico.' }
  ]);
  
  // Estado real de la pizarra sincronizado con la consulta
  const [boardContent, setBoardContent] = useState({
    topic: 'Esperando Consulta Académica',
    coreFormula: '---',
    steps: [
      { num: '01', title: 'Planteamiento del Sistema', desc: 'Ingresa un concepto arriba (ej: "movimiento rectilineo", "leyes de newton") para proyectar el análisis.' }
    ]
  });

  // Motor analítico que genera contenido académico real sin textos flojos
  const handleConsult = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    const cleanQ = userText.toLowerCase();
    
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setQuery('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      let responseText = "";
      let generatedBoard = {};

      if (cleanQ.includes('rectilineo') || cleanQ.includes('rectilíneo') || cleanQ.includes('mru') || cleanQ.includes('movimiento')) {
        responseText = `Analicemos el Movimiento Rectilíneo Uniforme (MRU). La clave aquí es entender que la velocidad es constante, lo que significa que la aceleración es estrictamente cero. Observa el modelo físico en la pizarra.`;
        generatedBoard = {
          topic: 'Movimiento Rectilíneo Uniforme (MRU)',
          coreFormula: 'd = v · t  ==>  v = Δx / Δt',
          steps: [
            { num: '01', title: 'Condición de Aceleración Nula', desc: 'En el MRU, a = 0 m/s². La trayectoria es una línea recta y la velocidad no experimenta variaciones temporales.' },
            { num: '02', title: 'Ecuación Horaria de Posición', desc: 'x(t) = x₀ + v · t (Donde x₀ es la posición inicial y v la velocidad constante del móvil).' },
            { num: '03', title: 'Análisis Gráfico (Posición vs Tiempo)', desc: 'La pendiente de la recta en un gráfico x-t representa exactamente el valor numérico de la velocidad.' }
          ]
        };
      } else if (cleanQ.includes('newton') || cleanQ.includes('fuerza') || cleanQ.includes('fisica') || cleanQ.includes('física')) {
        responseText = `Las Leyes de Newton rigen la mecánica clásica. Para la segunda ley, el cambio de movimiento es proporcional a la fuerza motriz impresa. Revísalo en la pizarra.`;
        generatedBoard = {
          topic: 'Segunda Ley de Newton (Dinámica)',
          coreFormula: 'F_net = m · a  [N = kg · m/s²]',
          steps: [
            { num: '01', title: 'Diagrama de Cuerpo Libre (DCL)', desc: 'Identifica y vectoriza todas las fuerzas concurrentes que actúan sobre el objeto de estudio.' },
            { num: '02', title: 'Sumatoria de Fuerzas (ΣF)', desc: 'Aplica la ecuación vectorial ΣF = m·a descomponiendo los ejes cartesianos X e Y.' },
            { num: '03', title: 'Resolución Analítica', desc: 'Despeja la incógnita solicitada (masa, aceleración o magnitud de la fuerza aplicada).' }
          ]
        };
      } else {
        responseText = `Excelente consulta sobre "${userText}". He estructurado los fundamentos analíticos y teóricos de este concepto en la pizarra digital para tu estudio formal.`;
        generatedBoard = {
          topic: `Estudio Analítico: ${userText.toUpperCase()}`,
          coreFormula: 'Principio Teórico / Modelo Base',
          steps: [
            { num: '01', title: 'Definición Conceptual', desc: `Desglose formal de las variables críticas que componen "${userText}".` },
            { num: '02', title: 'Teorema o Ecuación de Gobernanza', desc: 'Relación matemática o lógica que permite calcular el comportamiento del sistema.' },
            { num: '03', title: 'Aplicación Práctica y Validación', desc: 'Criterio de comprobación analítica para evitar errores comunes en pruebas.' }
          ]
        };
      }

      setChatHistory(prev => [...prev, { sender: 'ai', text: responseText }]);
      setBoardContent(generatedBoard);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-cyan-900 rounded-3xl">
      
      {/* 🟢 CABECERA */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b-2 border-cyan-500/40 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
            <h1 className="text-base md:text-lg font-orbitron font-extrabold text-white tracking-widest uppercase">
              CENTRO DE TUTORÍA SOCRÁTICA // ESPECIALISTAS DE MATERIA
            </h1>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1">
            Asistencia conversacional profunda y pizarra digital de desarrollo analítico paso a paso.
          </p>
        </div>
      </header>

      {/* 🟢 SELECTOR DE ESPECIALISTAS (Sincronizado con la Pizarra) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {specialists.map((spec, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedSpecialist(spec)}
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

      {/* 🟢 ZONA DE TRABAJO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Chat */}
        <div className="p-5 rounded-2xl bg-gray-950/90 border-2 border-cyan-500/50 shadow-xl flex flex-col justify-between h-[580px]">
          <div>
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-cyan-900">
              <img src={selectedSpecialist.avatar} alt="Active" className="w-10 h-10 rounded-full object-cover border border-fuchsia-400 shrink-0" />
              <div>
                <h3 className="text-xs font-orbitron font-bold text-white">{selectedSpecialist.name}</h3>
                <span className="text-[9px] font-bold text-green-400">● Tutor Activo</span>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto h-80 pr-2 text-xs">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'ai' 
                      ? 'bg-cyan-950/50 border border-cyan-800/60 text-cyan-200' 
                      : 'bg-fuchsia-950/50 border border-fuchsia-800/60 text-white ml-4'
                  }`}
                >
                  <p className="font-bold text-[10px] text-fuchsia-400 mb-1">{msg.sender === 'ai' ? selectedSpecialist.name : 'Estudiante'}</p>
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 text-xs animate-pulse font-mono">
                  Procesando modelo académico...
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleConsult} className="pt-3 border-t border-cyan-900/60 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Movimiento rectilíneo, Leyes de Newton..."
              className="flex-1 bg-gray-900 border border-cyan-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-fuchsia-500 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-fuchsia-900 border border-fuchsia-400 text-white font-orbitron font-bold text-xs rounded-xl hover:bg-fuchsia-800 transition disabled:opacity-50 cursor-pointer uppercase"
            >
              ENVIAR
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: PIZARRA DINÁMICA (CORREGIDA CON EL NOMBRE DEL PROFESOR ACTIVO) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950 border-2 border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)] flex flex-col justify-between h-[580px] relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

          <div>
            {/* TÍTULO DE LA PIZARRA DINÁMICAMENTE ENLAZADO AL PROFESOR SELECCIONADO */}
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-900 relative z-10">
              <h3 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase truncate max-w-[70%]">
                // PIZARRA SOCRÁTICA DE {selectedSpecialist.name.toUpperCase()}
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                {boardContent.topic}
              </span>
            </div>

            {/* Bloque Principal de Fórmula o Concepto Central */}
            <div className="mb-4 p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl relative z-10">
              <span className="text-[9px] font-orbitron font-bold text-cyan-400 uppercase">// FÓRMULA / MODELO CENTRAL:</span>
              <p className="text-base md:text-lg font-bold font-mono text-emerald-400 tracking-wider mt-1">
                {boardContent.coreFormula}
              </p>
            </div>

            {/* Pasos Analíticos en la Pizarra */}
            <div className="space-y-3 relative z-10 overflow-y-auto h-64 pr-2">
              {boardContent.steps.map((st, idx) => (
                <div key={idx} className="p-3.5 bg-gray-900/90 border border-cyan-500/40 rounded-xl flex items-start gap-3 shadow-lg">
                  <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-300 font-orbitron shrink-0">
                    {st.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white font-orbitron">{st.title}</h4>
                    <p className="text-xs text-cyan-200/90 mt-1 font-sans leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-900/60 flex justify-between items-center text-[10px] text-cyan-400 font-mono font-bold relative z-10">
            <span>MOTOR DE CONTENIDO: ACTIVO</span>
            <button 
              onClick={() => {
                setBoardContent({
                  topic: 'Lienzo Limpio',
                  coreFormula: '---',
                  steps: [{ num: '01', title: 'Pizarra en Espera', desc: 'Escribe una nueva consulta en el chat lateral.' }]
                });
              }}
              className="px-3.5 py-1 bg-cyan-950 border border-cyan-600 rounded text-cyan-300 hover:bg-cyan-900 transition cursor-pointer"
            >
              🧹 LIMPIAR LIENZO
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
