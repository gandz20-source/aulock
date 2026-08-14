import React, { useState } from 'react';

export default function ActiveGameModal({ game, onClose, onSubmitScore }) {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS

  // Banco de desafíos reales por cada Nodo de Hackeo
  const gameChallenges = {
    'CÓDIGO RESISTENCIA': {
      problem: "Desafío Lógico: Si el algoritmo de Aethel Corp encripta una secuencia con la regla f(x) = 2x + 5, y el resultado interceptado es 27, ¿cuál era el valor original de x?",
      placeholder: "Escribe el valor numérico o la fórmula de descifrado..."
    },
    'ISLA PROHIBIDA (MODO COOPERATIVO)': {
      problem: "Dilema Cooperativo: Tu escuadrón debe cruzar el sector de Servidores Hostiles. Si el ancho de banda disponible se reduce a la mitad cada 10 minutos y partes con 512 MB, ¿cuántos MB quedan tras 30 minutos?",
      placeholder: "Calcula los MB restantes e ingresa el resultado..."
    },
    'CORTAFUEGOS CYBERPUNK': {
      problem: "Completar Código: Rellena el operador faltante en JavaScript para que la condición valide si un usuario es de la Resistencia: `if (user.token ____ 'ACTIVE_RESISTANCE')`",
      placeholder: "Escribe el operador (ej. ===, !==, etc.)..."
    },
    'PROTOCOLO BABEL': {
      problem: "Traducción de Datos: Traduce al inglés técnico y escribe el comando para iniciar ruta segura: 'Iniciar protocolo de escape en la red'.",
      placeholder: "Escribe la sentencia en código o inglés técnico..."
    }
  };

  const currentChallenge = (game && gameChallenges[game.title]) || {
    problem: "Resuelve el desafío algorítmico en vivo enviado por el Profesor para desarmar el cortafuegos.",
    placeholder: "Escribe aquí la solución al reto..."
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setStatus('SUBMITTING');
    
    // Validación simulada con el servidor
    setTimeout(() => {
      setStatus('SUCCESS');
      if (onSubmitScore) {
        onSubmitScore(game?.psReward || game?.reward || 60);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg p-6 bg-gray-950 border-2 border-cyan-400 rounded-2xl shadow-[0_0_35px_rgba(56,235,203,0.5)] font-mono">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400 hover:text-white text-lg font-bold cursor-pointer z-10"
        >
          ✕
        </button>

        {/* Título */}
        <div className="border-b border-cyan-800 pb-3 mb-4">
          <span className="text-[10px] text-fuchsia-400 tracking-widest uppercase font-bold block">// NODO DE HACKEO ACTIVO</span>
          <h2 className="text-lg font-orbitron font-extrabold text-white mt-1">{game?.title || "Misión de Resistencia"}</h2>
        </div>

        {/* Problema / Desafío Matemático o Lógico */}
        <div className="mb-4 bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-800/60">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1 font-bold">// DESAFÍO TÁCTICO ASIGNADO:</p>
          <p className="text-xs text-cyan-100 leading-relaxed font-sans font-medium">
            {currentChallenge.problem}
          </p>
        </div>

        {/* Área Interactiva de Escritura */}
        {status === 'SUCCESS' ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500 rounded-xl text-center space-y-1">
            <p className="text-emerald-400 font-bold font-orbitron text-sm">¡ACCESO CONCEDIDO!</p>
            <p className="text-xs text-emerald-200 mt-1">+{game?.psReward || game?.reward || 60} PS Sincronizados con el Núcleo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-cyan-400 mb-2 font-bold">// INGRESE RESPUESTA O CÓDIGO DE INTERVENCIÓN:</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={currentChallenge.placeholder}
                className="w-full h-28 bg-gray-900 border border-cyan-600 rounded-xl p-3 text-white text-xs focus:border-fuchsia-500 outline-none resize-none pointer-events-auto font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'SUBMITTING'}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-orbitron font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(56,235,203,0.5)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
            >
              {status === 'SUBMITTING' ? 'VERIFICANDO CREDENCIALES...' : '⚡ INTERVENIR Y GANAR RECOMPENSA'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
