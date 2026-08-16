import React, { useState } from 'react';

export default function AiTutorInteractiveWhiteboard() {
  const [selectedTutor, setSelectedTutor] = useState({
    name: 'Tutor Tecnología & Código',
    role: 'Ciencia de Datos & Computación (STEM)',
    avatar: '💻',
    welcome: '¡Hola! ¿Qué concepto científico, informático o matemático exploramos hoy en la pizarra?'
  });

  const [activePersona, setActivePersona] = useState('Videojuegos');
  
  // Estado para el chat conversacional con el tutor
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: '¡Hola! Analicemos las leyes físicas o matemáticas. Pregúntame lo que necesites resolver o escanea tu ejercicio.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Estado para la Pizarra Paso a Paso (Simulando trazo de plumón digital)
  const [whiteboardState, setWhiteboardState] = useState('READY'); // READY, TEACHING
  const [mathSteps, setMathSteps] = useState([
    { step: '01', notation: 'f(x) = 2x + 5 = 27', note: 'Planteamiento inicial de la ecuación interceptada.' },
    { step: '02', notation: '2x = 27 - 5  ==>  2x = 22', note: 'Despejando términos semejantes aplicando el principio de equivalencia.' },
    { step: '03', notation: 'x = 22 / 2  ==>  x = 11', note: '¡Resultado final obtenido con éxito en la pizarra!' }
  ]);

  const tutorsList = [
    { 
      name: 'Tutor Tecnología & Código', 
      role: 'STEM & Computación', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2306B6D4' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23164E63' stroke='%2322D3EE' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='24' fill='%2322D3EE' text-anchor='middle'>%3C/%3E</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='18' fill='%23A5F3FC' text-anchor='middle'>1 0 1 0 1</text></svg>", 
      welcome: '¡Hola! Pregúntame tus dudas de ciencia, algoritmia o código.' 
    },
    { 
      name: 'Tutor Física & Química', 
      role: 'Física y Química', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2310B981' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23064E3B' stroke='%2334D399' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='18' fill='%2334D399' text-anchor='middle'>H%E2%82%82O %E2%80%A2 CO%E2%82%82</text><text x='60' y='78' font-family='sans-serif' font-weight='900' font-size='22' fill='%23A7F3D0' text-anchor='middle'>%E2%9A%97%EF%B8%8F NaCl</text></svg>", 
      welcome: 'Resolvamos ecuaciones y fórmulas químicas en la pizarra.' 
    },
    { 
      name: 'Tutor Biología & Ciencias', 
      role: 'Ciencias de la Vida', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%23059669' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23065F46' stroke='%236EE7B7' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='20' fill='%236EE7B7' text-anchor='middle'>%F0%9F%A8%AC DNA</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='18' fill='%23FCD34D' text-anchor='middle'>A-T G-C</text></svg>", 
      welcome: 'Analicemos procesos biológicos y ecológicos paso a paso.' 
    },
    { 
      name: 'Tutor Matemática & Cálculo', 
      role: 'Números & Cálculo', 
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%233B82F6' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%231E293B' stroke='%2360A5FA' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='20' fill='%2360A5FA' text-anchor='middle'>%E2%88%91 %E2%88%9A%CF%80</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='24' fill='%23F59E0B' text-anchor='middle'>1 2 3</text></svg>", 
      welcome: 'Calculemos fórmulas, números, ecuaciones y vectores.' 
    },
  ];

  const personas = ['Fútbol', 'Videojuegos', 'Música y Trap', 'Cocina', 'Anime', 'Fórmula 1'];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const cleanText = userText.toLowerCase();
    
    // 1. Registramos la duda del alumno
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setWhiteboardState('TEACHING');

    // 2. Motor de IA Didáctico (Simulando la potencia de Gemini conectado al backend)
    let aiResponseText = "";
    let dynamicSteps = [];

    if (cleanText.includes('reactivo') || cleanText.includes('quimica') || cleanText.includes('química') || cleanText.includes('reaccion') || cleanText.includes('reacción')) {
      aiResponseText = `¡Excelente pregunta! En ${activePersona}, los reactivos son exactamente igual a los **ítems de inventario o materiales base** que juntas en la mesa de crafteo antes de presionar "Crear". Si no tienes los materiales correctos, la poción o el arma (el producto) jamás se materializa.`;
      
      dynamicSteps = [
        { step: '01', notation: 'Inventario Base = [ Reactivos ]', note: 'Son los ingredientes o sustancias iniciales antes del cambio químico.' },
        { step: '02', notation: 'Mesa de Crafteo = [ Activación / Energía ]', note: `El proceso o choque entre partículas necesario para que inicie la quest (${activePersona}).` },
        { step: '03', notation: 'Nuevo Ítem Creado = [ Productos ]', note: 'El resultado final de la transformación con nuevas propiedades.' }
      ];
    } else if (cleanText.includes('fuerza') || cleanText.includes('newton') || cleanText.includes('fisica') || cleanText.includes('física')) {
      aiResponseText = `Pensemos en la física como las físicas del motor de un juego (${activePersona}). Cuando tu personaje empuja un objeto pesado, la fuerza aplicada determina qué tan rápido acelera según su masa.`;
      
      dynamicSteps = [
        { step: '01', notation: 'F = m · a', note: 'La fuerza es directamente proporcional a la masa y la aceleración del cuerpo.' },
        { step: '02', notation: 'Inercia y Resistencia', note: 'Todo objeto en reposo resiste el cambio de movimiento hasta que aplicas un input.' }
      ];
    } else {
      // Explicación socrática general de alta calidad
      aiResponseText = `Para entender "${userText}" bajo la lógica de ${activePersona}, debemos descomponer el problema en sus reglas fundamentales. Observa el desglose en la pizarra digital para ver cómo interactúan las variables.`;
      
      dynamicSteps = [
        { step: '01', notation: `Concepto Clave: ${userText.toUpperCase()}`, note: `Definición central adaptada al ecosistema de ${activePersona}.` },
        { step: '02', notation: 'Análisis de Variables', note: 'Identificamos qué elementos provocan el cambio y qué reglas aplican.' },
        { step: '03', notation: 'Conclusión Aplicada ✓', note: 'Estrategia mental lista para resolver ejercicios similares en tus evaluaciones.' }
      ];
    }

    // 3. Sincronizamos el chat y la pizarra con contenido real y satisfactorio
    setTimeout(() => {
      setMathSteps(dynamicSteps);
      setChatMessages(prev => [
        ...prev, 
        { sender: 'ai', text: aiResponseText }
      ]);
    }, 900);
  };

  const handleClearWhiteboard = () => {
    setMathSteps([
      { step: '01', notation: 'Pizarra Limpia', note: 'Ingresa una nueva consulta o ecuación para comenzar el desglose.' }
    ]);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-cyan-900 rounded-3xl">
      
      {/* 🟢 CABECERA DE MÓDULO */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b-2 border-cyan-500/40 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
            <h1 className="text-base md:text-lg font-orbitron font-extrabold text-white tracking-widest uppercase">
              TUTORES SOCRÁTICOS IA // NÚCLEO DE APRENDIZAJE PERSONALIZADO
            </h1>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1">
            Asistencia conversacional libre y pizarra digital de desarrollo matemático avanzado.
          </p>
        </div>
      </header>

      {/* 🟢 SELECTOR DE TUTORES (Fotos de estudiantes latinos) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {tutorsList.map((tutor, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedTutor(tutor)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
              selectedTutor.name === tutor.name
                ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_15px_rgba(56,235,203,0.3)] text-white'
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

      {/* 🟢 MOTOR DE PERSONALIZACIÓN */}
      <div className="p-3 mb-6 rounded-xl bg-gray-950 border border-cyan-900/80 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-orbitron font-bold text-cyan-400 uppercase">⚡ ANALOGÍA ACTIVA:</span>
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

      {/* 🟢 ZONA CENTRAL: CHAT CONVERSACIONAL + PIZARRA DE TIZAS Y NÚMEROS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Chat Conversacional Libre con el Tutor */}
        <div className="p-5 rounded-2xl bg-gray-950/90 border-2 border-cyan-500/50 shadow-xl flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-cyan-900">
              <img src={selectedTutor.avatar} alt="Tutor" className="w-10 h-10 rounded-full object-cover border border-cyan-400 shrink-0" />
              <div>
                <h3 className="text-xs font-orbitron font-bold text-white">{selectedTutor.name}</h3>
                <span className="text-[9px] font-bold text-green-400">● Tutor Conversacional Activo</span>
              </div>
            </div>

            {/* Contenedor de Mensajes del Chat */}
            <div className="space-y-3 overflow-y-auto h-72 pr-2 text-xs">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'ai' 
                      ? 'bg-cyan-950/50 border border-cyan-800/60 text-cyan-200' 
                      : 'bg-fuchsia-950/50 border border-fuchsia-800/60 text-white ml-6'
                  }`}
                >
                  <p className="font-bold text-[10px] text-fuchsia-400 mb-1">{msg.sender === 'ai' ? selectedTutor.name : 'Tú (Estudiante)'}</p>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          {/* Input para preguntar cualquier cosa */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-cyan-900/60 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Pregúntale algo al tutor o pide un ejercicio..."
              className="flex-1 bg-gray-900 border border-cyan-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-fuchsia-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-fuchsia-900 border border-fuchsia-400 text-white font-orbitron font-bold text-xs rounded-xl hover:bg-fuchsia-800 transition cursor-pointer uppercase"
            >
              ENVIAR
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: LA PIZARRA DIGITAL (Estilo Plumón y Fórmulas Numéricas) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950 border-2 border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)] flex flex-col justify-between h-[520px] relative overflow-hidden">
          
          {/* Fondo simulando textura de pizarra digital o pizarrón oscuro */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

          <div>
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-900 relative z-10">
              <h3 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase">// PIZARRA SOCRÁTICA DIGITAL (DESARROLLO PASO A PASO)</h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">MODO PIZARRA ACTIVO</span>
            </div>

            {/* Contenido Visual con Fórmulas Numéricas Grandes */}
            <div className="space-y-4 relative z-10 overflow-y-auto h-80 pr-2">
              <p className="text-xs text-cyan-300/80 italic mb-2">// Explicación gráfica generada por {selectedTutor.name} (Enfoque: {activePersona}):</p>
              
              {mathSteps.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-900/90 border border-cyan-500/40 rounded-xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-300 font-orbitron shrink-0">
                      {item.step}
                    </span>
                    <div>
                      {/* Notación matemática grande simulando plumón */}
                      <p className="text-base md:text-lg font-bold font-mono text-emerald-400 tracking-wider mb-1">
                        {item.notation}
                      </p>
                      <p className="text-[11px] text-cyan-200/90 font-sans leading-relaxed">{item.note}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-fuchsia-400 font-mono font-bold hidden sm:inline">PASO VALIDADO</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-900/60 flex justify-between items-center text-[10px] text-cyan-400 font-mono font-bold relative z-10">
            <span>TRAZO DE PLUMÓN DIGITAL: ACTIVO</span>
            <button 
              onClick={handleClearWhiteboard}
              className="px-3 py-1 bg-cyan-950 border border-cyan-600 rounded text-cyan-300 hover:bg-cyan-900 transition cursor-pointer"
            >
              🧹 LIMPIAR PIZARRA
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
