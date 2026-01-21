import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, ChevronRight, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GemaSidekick = () => {
    const [isListening, setIsListening] = useState(true);
    const [notes, setNotes] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Simulate listening stream
    useEffect(() => {
        if (!isListening) return;

        const fakePoints = [
            "La derivada mide la tasa de cambio instantánea.",
            "Regla de la Cadena: f'(g(x)) * g'(x).",
            "Aplicación: Velocidad es la derivada de la posición.",
            "Recordar repasar límites trigonométricos."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < fakePoints.length) {
                setNotes(prev => [...prev, { id: Date.now(), text: fakePoints[i] }]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 5000); // Add a note every 5 seconds

        return () => clearInterval(interval);
    }, [isListening]);

    return (
        <div className={`transition-all duration-300 ease-in-out border-l border-slate-200 bg-white flex flex-col ${isCollapsed ? 'w-12' : 'w-80'}`}>

            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Gema Notes</h3>
                            <span className="text-xs text-indigo-500 font-medium flex items-center gap-1">
                                {isListening ? (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                        Escuchando clase...
                                    </>
                                ) : "En pausa"}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 hover:bg-slate-200 rounded-md text-slate-500 transition-colors"
                >
                    <ChevronRight size={16} className={`transition-transformDuration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Content List */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence>
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-100 shadow-sm rounded-lg p-3 text-sm text-slate-600 group hover:border-indigo-100 transition-colors"
                            >
                                <div className="flex items-start gap-2">
                                    <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2 shrink-0" />
                                    <p className="leading-snug">{note.text}</p>
                                </div>
                                <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                                        <Copy size={10} /> Copiar
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {notes.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <FileText size={40} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs">Esperando contenido relevante...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer Actions */}
            {!isCollapsed && (
                <div className="p-4 border-t border-slate-100 bg-white">
                    <button className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Check size={16} />
                        Guardar Resumen
                    </button>
                </div>
            )}
        </div>
    );
};

export default GemaSidekick;
