import React, { useState, useRef } from 'react';
import { handleTutorQueryService, analyzeExerciseImageWithGemini } from '../../services/GeminiService';
import MathRenderer from '../common/MathRenderer';
import { Camera, X, Sparkles } from 'lucide-react';

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
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraInputRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hola. Soy tu tutor socrático STEM. Escribe cualquier concepto o usa **📷 Escanear Cuaderno** para que analice tus ejercicios paso a paso con LaTeX.' }
  ]);
  
  // Estado real de la pizarra sincronizado dinámicamente con Gemini 2.5 Flash
  const [boardContent, setBoardContent] = useState({
    topic: 'Cálculo Diferencial: Derivadas y Razón de Cambio',
    coreFormula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = \\frac{df}{dx}",
    steps: [
      { num: '01', title: 'Definición Conceptual', desc: 'La derivada mide la tasa de cambio instantánea de una función con respecto a su variable independiente, geométricamente equivalente a la pendiente de la recta tangente a la curva en un punto dado.' },
      { num: '02', title: 'Teorema o Ecuación de Gobernanza', desc: 'Regla de la Potencia: d/dx(xⁿ) = n·xⁿ⁻¹ | Regla de la Cadena: (f∘g)\'(x) = f\'(g(x))·g\'(x) | Regla del Producto: (f·g)\' = f\'g + fg\'' },
      { num: '03', title: 'Aplicación Práctica y Validación', desc: 'Optimización de Sistemas: Se determinan puntos críticos haciendo f\'(x) = 0. Si f\'\'(x) < 0 se confirma un máximo absoluto (máxima ganancia, menor pérdida de energía).' }
    ]
  });

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCapturedImage(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Motor analítico socrático conectado a Gemini con soporte Multimodal
  const handleConsult = async (e) => {
    e.preventDefault();
    if ((!query.trim() && !capturedImage) || loading) return;

    const userText = query.trim();
    const imageCopy = capturedImage;
    
    setChatHistory(prev => [...prev, { 
      sender: 'user', 
      text: userText || (imageCopy ? 'Foto de mi cuaderno escaneada.' : ''),
      image: imageCopy
    }]);
    setQuery('');
    setCapturedImage(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    setLoading(true);

    try {
      if (imageCopy) {
        // Multimodal Vision AI Call (Gemini 1.5 Flash Socratic Lens)
        const responseText = await analyzeExerciseImageWithGemini({
          tutorName: selectedSpecialist.name,
          imageBase64: imageCopy,
          mimeType: 'image/jpeg',
          promptText: userText || 'Lee exactamente lo que escribí en la foto de mi cuaderno y guíame socráticamente.'
        });

        setChatHistory(prev => [...prev, { sender: 'ai', text: responseText }]);

        // Sincronizar pizarra con la lectura real
        setBoardContent({
          topic: `Lectura de Cuaderno // ${selectedSpecialist.subject}`,
          coreFormula: userText || 'Operación / Expresión Identificada',
          steps: [
            { num: '01', title: 'Lectura Base', desc: 'Identificación exacta de los números, signos y variables escritos en la foto sin inventar datos.' },
            { num: '02', title: 'Revisión Socrática', desc: 'Análisis del procedimiento para formular una pregunta guía si existe un paso por completar o corregir.' },
            { num: '03', title: 'Siguiente Paso Lógico', desc: 'Responde la pregunta del tutor para avanzar hacia la resolución paso a paso.' }
          ]
        });
      } else {
        const responseData = await handleTutorQueryService({
          specialist: selectedSpecialist.name,
          query: userText,
          mode: 'SOCRATIC'
        });

        const responseText = responseData.chat_response || responseData.tutor_response;
        const bb = responseData.blackboard || {};

        const dynamicBoard = {
          topic: bb.topic || `Análisis Analítico: ${userText.toUpperCase()}`,
          coreFormula: bb.core_equation || 'f(x) = y',
          steps: [
            {
              num: '01',
              title: 'Definición Conceptual',
              desc: bb.definition || `Estudio riguroso de las variables y fundamentos conceptuales de "${userText}".`
            },
            {
              num: '02',
              title: 'Teorema o Ecuación de Gobernanza',
              desc: bb.equation_governance || 'Relación analítica y fórmulas rectoras para el cálculo del sistema.'
            },
            {
              num: '03',
              title: 'Aplicación Práctica y Validación',
              desc: bb.practical_application || 'Criterio de validación empírica y comprobación dimensional para evaluaciones.'
            }
          ]
        };

        setChatHistory(prev => [...prev, { sender: 'ai', text: responseText }]);
        setBoardContent(dynamicBoard);
      }
    } catch (err) {
      console.error("Error consultando tutor socrático:", err);
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: `Imagina que estás modelando este fenómeno como una balanza en equilibrio. Si alteramos las condiciones iniciales de "${userText}", ¿qué variable crees que responderá primero?` 
      }]);
    } finally {
      setLoading(false);
    }
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
            Asistencia conversacional multimodal profunda y pizarra digital de desarrollo analítico con LaTeX.
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
                  className={`p-3.5 rounded-xl leading-relaxed ${
                    msg.sender === 'ai' 
                      ? 'bg-cyan-950/50 border border-cyan-800/60 text-cyan-200' 
                      : 'bg-fuchsia-950/50 border border-fuchsia-800/60 text-white ml-4'
                  }`}
                >
                  <p className="font-bold text-[10px] text-fuchsia-400 mb-1.5">{msg.sender === 'ai' ? selectedSpecialist.name : 'Estudiante'}</p>
                  
                  {msg.image && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-white/20 max-w-xs shadow">
                      <img src={msg.image} alt="Cuaderno Escaneado" className="w-full h-auto max-h-36 object-cover" />
                      <div className="bg-slate-950/90 px-2 py-0.5 text-[9px] font-mono text-cyan-300 flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>📷 Cuaderno Escaneado</span>
                      </div>
                    </div>
                  )}

                  <MathRenderer content={msg.text} />
                </div>
              ))}
              {loading && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 text-xs animate-pulse font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Procesando modelo académico y expresiones LaTeX...</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-cyan-900/60">
            {capturedImage && (
              <div className="p-2 bg-slate-900 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-2 text-[11px] text-emerald-300">
                <div className="flex items-center gap-2">
                  <img src={capturedImage} alt="Preview" className="w-9 h-9 object-cover rounded-lg border border-emerald-400" />
                  <span>📷 Cuaderno listo para auditoría STEM</span>
                </div>
                <button type="button" onClick={removeImage} className="text-slate-400 hover:text-rose-400 p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleConsult} className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={cameraInputRef}
                onChange={handleImageCapture}
              />

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-2.5 py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 border border-emerald-400 text-white font-orbitron font-bold text-[10px] rounded-xl flex items-center gap-1 transition shrink-0 cursor-pointer shadow-md"
                title="Escanear cuaderno con cámara (The Socratic Lens)"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-200" />
                <span>📷 Escanear</span>
              </button>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pregunta o consulta matemática..."
                className="flex-1 bg-gray-900 border border-cyan-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-fuchsia-500 font-mono"
              />
              <button
                type="submit"
                disabled={loading || (!query.trim() && !capturedImage)}
                className="px-3 py-2 bg-fuchsia-900 border border-fuchsia-400 text-white font-orbitron font-bold text-xs rounded-xl hover:bg-fuchsia-800 transition disabled:opacity-50 cursor-pointer uppercase shrink-0"
              >
                ENVIAR
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: PIZARRA DINÁMICA CON LATEX */}
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

            {/* Bloque Principal de Fórmula o Concepto Central con MathRenderer LaTeX */}
            <div className="mb-4 p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl relative z-10">
              <span className="text-[9px] font-orbitron font-bold text-cyan-400 uppercase tracking-widest">// FÓRMULA / MODELO CENTRAL:</span>
              <div className="mt-1">
                <MathRenderer content={`$$${boardContent.coreFormula.replace(/^\$\$|\$\$$/g, '')}$$`} />
              </div>
            </div>

            {/* Pasos Analíticos en la Pizarra */}
            <div className="space-y-3 relative z-10 overflow-y-auto h-64 pr-2">
              {boardContent.steps.map((st, idx) => (
                <div key={idx} className="p-3.5 bg-gray-900/90 border border-cyan-500/40 rounded-xl flex items-start gap-3 shadow-lg">
                  <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-300 font-orbitron shrink-0">
                    {st.num}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-white font-orbitron">{st.title}</h4>
                    <div className="text-xs text-cyan-200/90 mt-1 font-sans leading-relaxed">
                      <MathRenderer content={st.desc} />
                    </div>
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
