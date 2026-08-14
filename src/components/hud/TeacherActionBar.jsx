import React from 'react';

export default function TeacherActionBar({
  onFeelingsClick,
  onHelpClick,
  onShareScreen,
  onChatClick,
  onRaiseHand,
  onRecordClick,
  onSettingsClick
}) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t-2 border-cyan-900/80 p-3 px-4 md:px-8 flex flex-wrap items-center justify-between gap-3 font-mono shadow-2xl">
      {/* Botones Izquierdos de Respuesta Emocional y Ayuda */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onFeelingsClick || (() => alert("😊 Registro de estado emocional abierto."))}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:bg-amber-300 transition"
        >
          CÓMO TE SIENTES HOY?
        </button>

        <button
          onClick={onHelpClick || (() => alert("🆘 Solicitud de Ayuda enviada."))}
          className="px-4 py-2.5 rounded-2xl bg-sky-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:bg-sky-400 transition"
        >
          BOTÓN DE AYUDA
        </button>
      </div>

      {/* Botones Derecha en Pastillas Neón Cibernéticas */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onShareScreen || (() => alert("🖥️ Transmitiendo pantalla a alumnos..."))}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition flex items-center space-x-2"
        >
          <span>🖥️</span>
          <span>COMPARTIR PANTALLA</span>
        </button>

        <button
          onClick={onChatClick || (() => alert("💬 Abriendo chat de aula..."))}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition flex items-center space-x-2"
        >
          <span>💬</span>
          <span>CHAT</span>
        </button>

        <button
          onClick={onRaiseHand || (() => alert("✋ Mano levantada."))}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition flex items-center space-x-2"
        >
          <span>✋</span>
          <span>LEVANTAR MANO</span>
        </button>

        <button
          onClick={onRecordClick || (() => alert("🔘 Grabación de clase iniciada."))}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition flex items-center space-x-2"
        >
          <span>🔘</span>
          <span>GRABACIÓN</span>
        </button>

        <button
          onClick={onSettingsClick || (() => alert("⚙️ Configuración de sesión..."))}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-950 transition flex items-center space-x-2"
        >
          <span>⚙️</span>
          <span>CONFIGURACIÓN</span>
        </button>
      </div>
    </footer>
  );
}
