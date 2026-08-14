import React, { useState } from 'react';

export default function AfterIAPresentationSlider() {
  // Las 15 láminas gráficas oficiales extraídas de la presentación (slide_1.png a slide_15.png)
  const slideImages = Array.from({ length: 15 }, (_, i) => `/images/slides/slide_${i + 1}.png`);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => setCurrentIndex((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));

  return (
    <div className="p-5 rounded-2xl bg-gray-950/95 border-2 border-cyan-500/60 shadow-[0_0_30px_rgba(56,235,203,0.25)] relative font-mono">
      
      {/* Cabecera Actualizada */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <h2 className="text-xs font-orbitron font-extrabold text-cyan-300 uppercase">// BIENVENIDA: RESUMEN ESENCIAL DEL LIBRO "AFTER IA"</h2>
        </div>
        <span className="text-[11px] font-orbitron font-bold text-fuchsia-400 bg-fuchsia-950 px-2.5 py-0.5 rounded border border-fuchsia-800">
          LÁMINA {String(currentIndex + 1).padStart(2, '0')} / {slideImages.length}
        </span>
      </div>

      {/* Visor Gráfico Principal (Las 15 láminas de imágenes) */}
      <div className="h-72 md:h-96 rounded-xl bg-black border border-cyan-500/40 relative overflow-hidden flex items-center justify-center shadow-inner group">
        
        <img 
          src={slideImages[currentIndex]} 
          alt={`Lámina ${currentIndex + 1} - Resumen After IA`}
          className="w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
          onClick={() => setIsFullscreen(true)}
          onError={(e) => {
            // Fallback visual si alguna imagen aún no se mapea correctamente en el storage
            e.target.src = `https://placehold.co/1280x720/030712/38ebcb?text=L%C3%A1mina+${currentIndex + 1}+-+Resumen+After+IA`;
          }}
        />

        {/* Botones de navegación laterales */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 border border-cyan-400 text-cyan-300 flex items-center justify-center hover:bg-cyan-950 hover:text-white transition shadow-lg cursor-pointer z-20 font-bold text-lg"
        >
          ❮
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 border border-cyan-400 text-cyan-300 flex items-center justify-center hover:bg-cyan-950 hover:text-white transition shadow-lg cursor-pointer z-20 font-bold text-lg"
        >
          ❯
        </button>

        <div className="absolute bottom-2 right-3 text-[9px] text-cyan-400 bg-black/60 px-2 py-1 rounded pointer-events-none font-mono">
          Haz clic para pantalla completa
        </div>
      </div>

      {/* Controles inferiores y paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
        <div className="flex gap-1 overflow-x-auto max-w-full py-1">
          {slideImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx 
                  ? 'w-5 bg-fuchsia-500 shadow-[0_0_8px_#d946ef]' 
                  : 'w-1.5 bg-cyan-900 hover:bg-cyan-700'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={() => setIsFullscreen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-fuchsia-900 to-cyan-950 border border-fuchsia-500 text-white font-orbitron font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <span>⚡ MODO EXPOSICIÓN (15 LÁMINAS GRÁFICAS)</span>
        </button>
      </div>

      {/* MODAL DE PANTALLA COMPLETA (LIGHTBOX) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 font-mono">
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-orbitron font-bold text-cyan-400">// EXPOSICIÓN GRÁFICA // AFTER IA (LÁMINA {currentIndex + 1} DE {slideImages.length})</span>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-1.5 bg-fuchsia-900 border border-fuchsia-400 text-white font-bold rounded-lg hover:bg-fuchsia-700 cursor-pointer text-xs uppercase tracking-wider"
            >
              ✕ CERRAR PANTALLA COMPLETA
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4">
            <img 
              src={slideImages[currentIndex]} 
              alt={`Slide Full ${currentIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain border border-cyan-500/50 rounded-xl shadow-[0_0_40px_rgba(56,235,203,0.3)]"
              onError={(e) => {
                e.target.src = `https://placehold.co/1280x720/030712/38ebcb?text=L%C3%A1mina+${currentIndex + 1}+-+Resumen+After+IA`;
              }}
            />
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-900/80 border border-cyan-400 text-cyan-300 flex items-center justify-center text-xl hover:bg-cyan-950 hover:text-white transition cursor-pointer font-bold"
            >
              ❮
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-900/80 border border-cyan-400 text-cyan-300 flex items-center justify-center text-xl hover:bg-cyan-950 hover:text-white transition cursor-pointer font-bold"
            >
              ❯
            </button>
          </div>

          <div className="text-center text-[10px] text-cyan-500 font-mono font-bold">
            Navega por todas las láminas del resumen de "After IA".
          </div>
        </div>
      )}

    </div>
  );
}
