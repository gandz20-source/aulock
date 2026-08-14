import React from 'react';
import { BookOpen, Sparkles, Scroll, Flame } from 'lucide-react';

export const StoryScroll = ({ onSelectMission }) => {
    return (
        <div className="bg-slate-900 border border-cyan-500/30 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl text-white">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Scroll className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">CAPÍTULO 1 • EL CISMA DE AETHEL CORP</span>
                    <h3 className="text-lg font-black text-white">Prólogo: La Resistencia del Conocimiento</h3>
                </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                En el año 2026, los Centinelas de Aethel Corp bloquearon el acceso al saber soberano. Cuatro héroes de la Nueva Era —**Ryo el Programador**, **Han el Físico**, **La Sacerdotisa del Lenguaje** y **Yorky el Explorador**— deben descifrar los 5 Desafíos Criptográficos de la Sinergia para liberar a la comunidad.
            </p>

            <div className="flex items-center space-x-2 pt-2 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¡Selecciona una misión de campo en el panel para comenzar la liberación!</span>
            </div>
        </div>
    );
};

export default StoryScroll;
