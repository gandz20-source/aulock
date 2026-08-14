import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActiveGameModal from './ActiveGameModal';
import AfterIAPresentationSlider from './AfterIAPresentationSlider';

export default function AfterIAPortal({ activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }) {
  const navigate = useNavigate();
  const [internalActiveTab, setInternalActiveTab] = useState('afteria');

  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;

  const navModules = [
    { id: 1, key: 'profile', name: '1. MI PERFIL' },
    { id: 2, key: 'afteria', name: '2. AFTER IA', active: true },
    { id: 3, key: 'live_classroom', name: '3. AULA EN VIVO' },
    { id: 4, key: 'tutors', name: '4. TUTORES IA' },
    { id: 5, key: 'squad', name: '5. M. ESCUADRÓN ALFA' },
    { id: 6, key: 'academic', name: '6. DESEMPEÑO' },
    { id: 7, key: 'passport', name: '7. PASAPORTE AULOCK' },
  ];

  // Interactive Game & PS State
  const [psPoints, setPsPoints] = useState(120);
  const [activeModal, setActiveModal] = useState(null); // 'chapter' | 'riu' | 'rewards'
  const [activeGame, setActiveGame] = useState(null);

  // Estado para controlar el capítulo activo en la vista superior
  const [currentChapter, setCurrentChapter] = useState(3);

  const storyChapters = {
    1: {
      title: "CAPÍTULO 1: EL APAGÓN DIGITAL",
      summary: "Las inteligencias artificiales centralizadas de Aethel Corp tomaron el control de las redes globales. El acceso al conocimiento libre fue prohibido bajo pena de confinamiento en la Cúpula."
    },
    2: {
      title: "CAPÍTULO 2: EL SURGIMIENTO DE RYO",
      summary: "En los páramos exteriores, Ryo y su hermana Riu construjeron los primeros terminales analógicos de resistencia, usando hardware reciclado y lógica de código abierto."
    },
    3: {
      title: "CAPÍTULO 3: LA RESISTENCIA DEL CONOCIMIENTO",
      summary: "Año 2026. Aethel Corp ha bloqueado todo conocimiento soberano. Tú eres la Resistencia. Usa el poder del estudio para romper las cadenas digitales y liberar los nodos de la ciudad."
    }
  };

  const gameNodes = [
    { id: 1, title: 'CÓDIGO RESISTENCIA', type: 'GRUPO VS GRUPO', desc: 'Batalla de preguntas lógicas en equipo contra el algoritmo Aethel Corp.', psReward: 50 },
    { id: 2, title: 'ISLA PROHIBIDA (MODO COOPERATIVO)', type: 'COOPERATIVO', desc: 'Despeja el sector de cultivos sincronizando respuestas con tu escuadrón.', psReward: 75 },
    { id: 3, title: 'CORTAFUEGOS CYBERPUNK', type: 'AHORCADO POR EQUIPOS', desc: 'Descifra la palabra clave de la matriz antes de que expire el tiempo.', psReward: 40 },
    { id: 4, title: 'PROTOCOLO BABEL', type: 'TUTTI-FRUTTI POR EQUIPOS', desc: 'Completa las categorías del vocabulario técnico antes que el bot enemigo.', psReward: 60 },
  ];

  const squadMembers = [
    { name: 'Juan Carlos Pérez', role: 'Juan Carlos Pérez', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
    { name: 'Sofía Martínez', role: 'Sofía Martínez', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    { name: 'Mateo Rojas', role: 'Updated Activa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
  ];

  const riuMissions = [
    { id: 'm1', title: 'Misión 1: Hackear Servidor de Cultivos', target: 'Módulo Aethel-09', reward: '+30 PS', status: 'Disponible' },
    { id: 'm2', title: 'Misión 2: Decodificar Canal de Radio RYO', target: 'Frecuencia 108.4 MHz', reward: '+45 PS', status: 'Bloqueado' },
    { id: 'm3', title: 'Misión 3: Sobrecargar Nivelador de Estrés', target: 'Nodo Central 360°', reward: '+60 PS', status: 'Bloqueado' },
  ];

  const rewardsList = [
    { id: 'r1', name: 'Insignia Escuadrón Soberano', cost: 100, icon: '🛡️' },
    { id: 'r2', name: 'Pase de Tiempo Libre en Laboratorio STEM', cost: 200, icon: '🧪' },
    { id: 'r3', name: 'Avatar Cibernético Edición Limitada RYO', cost: 350, icon: '🤖' },
  ];

  const handleModuleClick = (mod) => {
    const targetKey = mod.key || (
      mod.id === 1 ? 'profile' :
      mod.id === 2 ? 'afteria' :
      mod.id === 3 ? 'live_classroom' :
      mod.id === 4 ? 'tutors' :
      mod.id === 5 ? 'squad' :
      mod.id === 6 ? 'academic' : 'passport'
    );

    if (externalSetActiveTab) {
      externalSetActiveTab(targetKey);
    } else {
      setInternalActiveTab(targetKey);
    }

    if (targetKey !== 'afteria' && window.location.pathname.includes('/after-ia')) {
      navigate('/student-dashboard', { state: { activeTab: targetKey } });
    }
  };

  const handleOpenGame = (node) => {
    setActiveGame(node);
  };

  const handleCompleteChapter = () => {
    setPsPoints(prev => prev + 50);
    setActiveModal(null);
    alert("⚡ ¡Transmisión descifrada! Has obtenido +50 Puntos de Sinergia (PS).");
  };

  const handleRedeemReward = (reward) => {
    if (psPoints >= reward.cost) {
      setPsPoints(prev => prev - reward.cost);
      alert(`🎉 ¡Recompensa "${reward.name}" canjeada con éxito!`);
    } else {
      alert(`❌ Requieres ${reward.cost} PS para este canje. ¡Sigue completando misiones!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-100 font-mono p-3 md:p-6 relative selection:bg-fuchsia-900 overflow-x-hidden select-none">
      
      {/* 🔴 OVERLAY TRAZOS PCB VECTORES FONDO (Exacto a la Imagen 6) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <svg className="w-full h-full stroke-fuchsia-500/40 stroke-[1.5] fill-none">
          <path d="M 30 100 V 400 H 120 V 900" />
          <path d="M 98% 120 V 600 H 90% V 1100" />
          <path d="M 50% 200 V 450" />
          <circle cx="30" cy="100" r="3" className="fill-fuchsia-500" />
          <circle cx="120" cy="400" r="3" className="fill-cyan-400" />
          <circle cx="98%" cy="120" r="3" className="fill-fuchsia-500" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-5">

        {/* 🔴 LÍNEA DE ENCABEZADO SUPERIOR RBAC (Sin duplicación) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/90 border border-cyan-900/80 p-2.5 px-4 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-2 text-cyan-300">
            <strong className="text-white">Arquitectura móvil AuLock RBAC</strong>
            <span>|</span>
            <span>Usuario: <strong className="text-cyan-200">Juan Carlos Pérez</strong></span>
            <span>|</span>
            <span>Rol Activo: <strong className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700">[ ALUMNO ]</strong></span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-bold">
            <span className="text-slate-400">CONMUTADOR DE PERFIL:</span>
            <span className="px-2.5 py-0.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              Rol Alumno ✓
            </span>
            <button onClick={() => navigate('/teacher-dashboard')} className="px-2.5 py-0.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white">
              Rol Profesor
            </button>
            <button onClick={() => navigate('/school-dashboard')} className="px-2.5 py-0.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white">
              Rol Colegio 360°
            </button>
          </div>
        </div>

        {/* 🔴 1. 7 PESTAÑAS HUD CALLOUT CON BORDE NEÓN FUCSIA EN TAB 2 (Exacto a la Imagen 6) */}
        <header className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {navModules.map((mod) => {
            const isSelected = mod.key === 'afteria' || mod.id === 2;
            return (
              <div
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={`p-2.5 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 select-none ${
                  isSelected
                    ? 'border-fuchsia-500 bg-fuchsia-950/80 text-white font-black shadow-[0_0_25px_rgba(217,70,239,0.8)] scale-[1.03] z-10'
                    : 'border-cyan-950 bg-slate-950/80 text-cyan-400 hover:border-cyan-700 hover:bg-slate-900'
                }`}
              >
                <span className="text-[11px] font-orbitron font-extrabold tracking-wider block uppercase">
                  {mod.name}
                </span>
              </div>
            );
          })}
        </header>

        {/* 🔴 2. BARRA DE TÍTULO CAJA NEÓN FUCSIA DOBLE MARCO (Exacto a la Imagen 6) */}
        <div className="p-4 bg-slate-950/90 border-2 border-fuchsia-500 rounded-3xl shadow-[0_0_30px_rgba(217,70,239,0.4)] flex flex-col md:flex-row justify-between items-center gap-3">
          <h1 className="text-sm md:text-base font-orbitron font-black text-fuchsia-300 tracking-widest uppercase">
            PÓRTICO: AFTER IA - EL DESPERTAR DEL CONOCIMIENTO & LIBERTAD SOBERANA
          </h1>
          <span className="text-xs text-cyan-300 font-bold bg-cyan-950 px-3.5 py-1.5 rounded-2xl border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            ESTADO: SINERGIA ALTA
          </span>
        </div>

        {/* 🔴 3. CONTENIDO PRINCIPAL LAYOUT 2 COLUMNAS (Exacto a la Imagen 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ==================== COLUMNA IZQUIERDA Y CENTRAL (7/12) ==================== */}
          <div className="lg:col-span-7 space-y-6">

            {/* VISOR DE CRÓNICAS NARRATIVAS / CARRUSEL 3D GALERÍA ANIME */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cyan-900/60 pb-2">
                <h2 className="text-xs font-orbitron font-extrabold text-white tracking-wider uppercase">
                  // {storyChapters[currentChapter]?.title || "AFTER IA: EL DESPERTAR DEL CONOCIMIENTO"}
                </h2>

                {/* Selector de Capítulos 1, 2 y 3 */}
                <div className="flex space-x-1">
                  {[1, 2, 3].map(ch => (
                    <button
                      key={ch}
                      onClick={() => setCurrentChapter(ch)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-orbitron font-bold border transition ${
                        currentChapter === ch 
                          ? 'bg-fuchsia-950 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.5)]' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      CAP. {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* GALERÍA 3D DE IMÁGENES ANIME CIBERNÉTICAS (Exacto a la referencia) */}
              <div className="h-56 md:h-64 rounded-2xl border-2 border-cyan-500/60 overflow-hidden relative shadow-2xl group">
                <img 
                  src="/images/after_ia_ryo_hero.jpg" 
                  alt="Resistencia AFTER IA RYO"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-4">
                  <span className="text-xs text-cyan-200 font-bold bg-slate-950/80 px-3 py-1 rounded-xl border border-cyan-500/40 font-mono">
                    [ TRANSMISIÓN {storyChapters[currentChapter]?.title} CARGADA ]
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {storyChapters[currentChapter]?.summary}
              </p>

              {/* BOTÓN NEÓN NEÓN FUCSIA CHAFLÁN CON MUESCAS VECTORIALES */}
              <button
                onClick={() => setActiveModal('chapter')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-900 via-purple-900 to-fuchsia-900 border-2 border-fuchsia-500 text-white font-orbitron font-black text-xs md:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(217,70,239,0.8)] hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
              >
                <span>// DESCIFRAR TRANSMISIÓN (CAPÍTULO {currentChapter})</span>
              </button>
            </div>

            {/* DOSSIER TÁCTICO: PRESENTACIÓN SLIDER AFTER IA (15 SLIDES EN POWERPOINT) */}
            <AfterIAPresentationSlider />

            {/* // NODO DE HACKEO - MISIONES DE CONOCIMIENTO (4 Botones Neón Chaflán cibernéticos) */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
              <h3 className="text-xs font-orbitron font-extrabold text-white tracking-wider uppercase border-b border-cyan-900/60 pb-2">
                // NODO DE HACKEO - MISIONES DE CONOCIMIENTO
              </h3>

              <div className="space-y-3.5">
                {gameNodes.map((node, index) => (
                  <div
                    key={node.id || index}
                    onClick={() => setActiveGame(node)}
                    className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-cyan-400 hover:border-fuchsia-500 text-cyan-200 hover:text-white font-orbitron font-black text-xs md:text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] hover:scale-[1.01] group text-center cursor-pointer select-none"
                  >
                    <span className="w-full text-center group-hover:tracking-widest transition-all">
                      {node.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ==================== COLUMNA DERECHA (5/12) ==================== */}
          <div className="lg:col-span-5 space-y-6">

            {/* CARD 1: // SOPORTE TÁCTICO (Mapa Isométrico de Cúpula) */}
            <div className="p-5 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/80 shadow-xl space-y-3">
              <h3 className="text-xs font-orbitron font-extrabold text-white uppercase tracking-wider border-b border-cyan-900/60 pb-2">
                // SOPORTE TÁCTICO
              </h3>

              <div className="h-44 rounded-2xl border-2 border-cyan-500/60 overflow-hidden relative shadow-lg">
                <img 
                  src="/images/after_ia_dome_map.jpg" 
                  alt="Mapa Isométrico de Cúpula & Zonas Aethel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* CARD 2: // SOPORTE TÁCTICO -> RIU LA ARTESANA CIBERNÉTICA */}
            <div className="p-5 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3)] space-y-3">
              <h3 className="text-xs font-orbitron font-extrabold text-white uppercase tracking-wider border-b border-cyan-900/60 pb-2">
                // SOPORTE TÁCTICO
              </h3>

              {/* Marco de Retrato Anime de RIU */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-32 h-36 rounded-2xl border-2 border-cyan-400 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                  <img 
                    src="/images/after_ia_riu_portrait.jpg" 
                    alt="RIU La Artesana Cibernética"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-orbitron font-bold text-cyan-300">// RIU</h4>
                  <p className="text-[11px] font-orbitron font-extrabold text-white uppercase">// LA ARTESANA CIBERNÉTICA</p>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Hermana de RYO. Especialista en ingeniería y hacking. Controla el sector de CULTIVOS.
                </p>

                <button
                  onClick={() => setActiveModal('riu')}
                  className="w-full py-3 rounded-2xl bg-slate-950 border-2 border-fuchsia-500 text-fuchsia-300 font-orbitron font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:bg-fuchsia-950 transition"
                >
                  // VER MISIONES DE RIU
                </button>
              </div>
            </div>

            {/* CARD 3: // ESCUADRÓN ALFA (STATUS) */}
            <div className="p-5 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/80 shadow-xl space-y-3">
              <h3 className="text-xs font-orbitron font-extrabold text-white uppercase tracking-wider border-b border-cyan-900/60 pb-2">
                // ESCUADRÓN ALFA (STATUS)
              </h3>

              <div className="space-y-2.5">
                {squadMembers.map((member, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-cyan-950 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-xl object-cover border border-cyan-500/60" />
                      <div>
                        <strong className="text-white block font-bold">{member.name}</strong>
                        <span className="text-[10px] text-slate-400">{member.role}</span>
                      </div>
                    </div>
                    {member.active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-end space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  <span>Sinergia Activa</span>
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* 🔴 4. MARCADOR GLOBAL DE PS (PUNTOS DE SINERGIA) (Exacto a la Imagen 6) */}
        <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
          <h3 className="text-xs font-orbitron font-extrabold text-white uppercase tracking-wider border-b border-cyan-900/60 pb-2">
            // MARCADOR GLOBAL DE PS (PUNTOS DE SINERGIA)
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-2/3 space-y-2">
              <div className="text-xl font-orbitron font-black text-white">
                {psPoints} / 500 PS ACUMULADOS
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-cyan-500/40">
                <div 
                  style={{ width: `${(psPoints / 500) * 100}%` }}
                  className="bg-cyan-400 h-full shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all duration-500" 
                />
              </div>
            </div>

            <button
              onClick={() => setActiveModal('rewards')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-950 border-2 border-cyan-400 text-cyan-300 font-orbitron font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:bg-cyan-950 transition shrink-0"
            >
              CANJEAR RECOMPENSA DEL CURSO
            </button>
          </div>
        </div>

      </div>

      {/* 🔴 MODAL TRANSMISIÓN CAPÍTULO 3 */}
      {activeModal === 'chapter' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-fuchsia-500 rounded-3xl max-w-lg w-full p-6 space-y-4 font-mono shadow-[0_0_40px_rgba(217,70,239,0.5)]">
            <div className="flex justify-between items-center border-b border-fuchsia-900 pb-3">
              <h3 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase">
                // TRANSMISIÓN CAPÍTULO 3: EL DESPERTAR
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              "Los servidores de Aethel Corp intentan silenciar la verdad sobre los OA de ciencias y matemáticas. Tu escuadrón debe mantener la sinergia para decodificar la clave principal."
            </p>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-cyan-500/40 text-xs text-cyan-300">
              Recompensa por completar capítulo: <strong>+50 PS</strong>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={handleCompleteChapter} className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-orbitron font-bold text-xs rounded-xl shadow">
                ⚡ Completar & Reclamar PS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 MODAL JUEGO NODO DE HACKEO INDEPENDIENTE */}
      {activeGame && (
        <ActiveGameModal 
          game={activeGame} 
          onClose={() => setActiveGame(null)} 
          onSubmitScore={(points) => {
            console.log(`Sumados ${points} PS`);
            setPsPoints(prev => prev + points);
            setActiveGame(null);
          }} 
        />
      )}

      {/* 🔴 MODAL MISIONES DE RIU */}
      {activeModal === 'riu' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-fuchsia-500 rounded-3xl max-w-lg w-full p-6 space-y-4 font-mono shadow-[0_0_40px_rgba(217,70,239,0.5)]">
            <div className="flex justify-between items-center border-b border-fuchsia-900 pb-3">
              <h3 className="text-xs font-orbitron font-extrabold text-fuchsia-300 uppercase">
                // MISIONES TÁCTICAS DE RIU
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {riuMissions.map((m) => (
                <div key={m.id} className="p-3.5 bg-slate-900 rounded-2xl border border-fuchsia-500/40 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-white block">{m.title}</strong>
                    <span className="text-[10px] text-slate-400">{m.target}</span>
                  </div>
                  <span className="text-[10px] font-bold text-fuchsia-300 bg-fuchsia-950 px-2.5 py-1 rounded border border-fuchsia-800">
                    {m.reward}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-900 text-slate-300 text-xs rounded-xl">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 MODAL CANJE DE RECOMPENSAS */}
      {activeModal === 'rewards' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-cyan-400 rounded-3xl max-w-lg w-full p-6 space-y-4 font-mono shadow-[0_0_40px_rgba(6,182,212,0.5)]">
            <div className="flex justify-between items-center border-b border-cyan-900 pb-3">
              <h3 className="text-xs font-orbitron font-extrabold text-cyan-300 uppercase">
                // CANJE DE RECOMPENSAS DEL CURSO (PS)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {rewardsList.map((r) => (
                <div key={r.id} className="p-3.5 bg-slate-900 rounded-2xl border border-cyan-500/40 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <strong className="text-white block">{r.name}</strong>
                      <span className="text-[10px] text-cyan-400 font-bold">{r.cost} PS</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRedeemReward(r)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Canjear
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-900 text-slate-300 text-xs rounded-xl">Cerrar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
