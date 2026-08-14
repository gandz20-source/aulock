import React, { useState } from 'react';
import HeaderNav from '../components/hud/HeaderNav';
import ProfileFrame from '../components/hud/ProfileFrame';
import DataCard from '../components/hud/DataCard';
import ActionButton from '../components/hud/ActionButton';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(1);

  const studentData = {
    nombre: "JUAN CARLOS PÉREZ",
    carrera: "CIENCIA, TECNOLOGÍA, INGENIERÍA Y MATEMÁTICAS (STEM) ESPECIALIZADA",
    colegio: "Colegio San Agustín",
    nivel: "4° Medio A",
    promedio: 6.14,
    badges: [
      { text: '★ 7.0 Lógica', color: 'yellow' },
      { text: '⚡ Equipo de tutores Alfa', color: 'purple' },
      { text: '🛡️ Formación Ciudadana', color: 'blue' }
    ]
  };

  return (
    // FONDO OSCURO CON CIRCUITO RADIAL
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-8 relative selection:bg-cyan-800 overflow-x-hidden pb-32">
      {/* Fondo sutil de rejilla */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

      {/* 🟢 1. CABECERA DE NAVEGACIÓN */}
      <HeaderNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 🟢 2. CONTENIDO PRINCIPAL (Layout 3 Columnas) */}
      <main className="grid grid-cols-1 lg:grid-cols-[1fr,minmax(400px,auto),1fr] gap-8 items-center mt-8 lg:mt-12">
        
        {/* COLUMNA IZQUIERDA: Tarjeta "SEAMOS COMUNIDAD" */}
        <DataCard 
          title="SEAMOS COMUNIDAD" 
          colorBorder="cyan" 
          icon="🌱"
        >
          <p className="text-xs md:text-sm text-cyan-300/80 leading-relaxed italic">
            "¿Cómo demuestras empatía hoy con un compañero que estaba solo? Te invitamos a: Invita a alguien nuevo a tu grupo en el recreo."
          </p>
          <button 
            onClick={() => alert("✨ Abriendo cápsula pedagógica de reflexión MINEDUC...")}
            className="mt-4 text-xs text-cyan-400 hover:text-white underline underline-offset-4 decoration-dotted font-mono"
          >
            Ver cápsula de reflexión del día ▼
          </button>
        </DataCard>

        {/* COLUMNA CENTRAL: Marco de Perfil y Datos Personales */}
        <div className="flex flex-col items-center col-span-1 relative">
          {/* Líneas de circuitería conectando elementos */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 800 600">
             <path d="M200 300 L100 300 M600 300 L700 300 M400 150 L400 50 M400 450 L400 550" stroke="#38EBCB" strokeWidth="1" fill="none" />
          </svg>
          
          {/* El Marco de la Foto */}
          <ProfileFrame imgSrc="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80" />
          
          {/* Datos Personales */}
          <div className="text-center mt-8 relative z-10 space-y-3">
            <h1 className="text-3xl md:text-5xl font-orbitron font-extrabold text-white tracking-wider">{studentData.nombre}</h1>
            <p className="text-xs text-cyan-400 bg-black/60 inline-block px-3 py-1 rounded border border-cyan-800 uppercase tracking-widest font-sans">{studentData.carrera}</p>
            <p className="text-cyan-300 text-xs md:text-sm tracking-wide">
              {studentData.nivel} • {studentData.colegio} • Promedio: <span className='font-bold text-amber-300 text-xl font-orbitron'>{studentData.promedio}</span>
            </p>
            
            {/* Insignias (Badges) */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 font-sans">
              {studentData.badges.map((badge, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  badge.color === 'yellow' ? 'bg-amber-950/80 text-amber-200 border-amber-700' : 
                  badge.color === 'purple' ? 'bg-purple-950/80 text-purple-200 border-purple-700' : 
                  'bg-blue-950/80 text-blue-200 border-blue-700'
                }`}>
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Espacio para analítica */}
        <DataCard title="ANALÍTICA ACADÉMICA" colorBorder="blue" icon="📊">
           <div className='h-48 flex flex-col items-center justify-center text-cyan-500/70 text-center space-y-2'>
             <span className="text-4xl">📈</span>
             <p className="text-xs uppercase tracking-widest font-orbitron">Gráfico de Progreso Socrático</p>
             <p className="text-[10px] text-slate-500 font-mono">98% Asistencia • 5/5 Misiones Completadas</p>
           </div>
        </DataCard>
        
      </main>

      {/* 🟢 3. PIE DE PÁGINA (Botones de Acción Inferiores) */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-md border-t border-cyan-900/60 flex flex-wrap justify-center gap-3 z-50">
        <ActionButton icon="😊" text="¿Cómo te sientes hoy?" color="yellow" onClick={() => alert("😊 Registro de estado emocional abierto.")} />
        <ActionButton icon="🆘" text="Botón de Ayuda" color="blue" onClick={() => alert("🆘 Solicitud de Ayuda enviada.")} />
        <ActionButton icon="⚠️" text="Denuncia Segura" color="red" onClick={() => alert("⚠️ Formulario de denuncia confidencial abierto.")} />
        <ActionButton icon="⭐" text="Evaluar Clase" color="purple" onClick={() => alert("⭐ Evaluación de clase en curso.")} />
      </footer>

    </div>
  );
};

export default StudentDashboard;
