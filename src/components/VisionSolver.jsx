import React, { useState } from 'react';
import { Camera, X, Zap, ArrowRight, CheckCircle, RefreshCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisionSolver = () => {
    const [isActive, setIsActive] = useState(false);
    const [step, setStep] = useState('idle'); // idle, scanning, analyzing, solved

    const startScan = () => {
        setIsActive(true);
        setStep('scanning');
        setTimeout(() => setStep('analyzing'), 2000);
        setTimeout(() => setStep('solved'), 4500);
    };

    const reset = () => {
        setIsActive(false);
        setStep('idle');
    };

    return (
        <>
            {/* Floating Action Button (Trigger) */}
            <motion.div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <button
                    onClick={startScan}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 shadow-lg shadow-pink-500/30 flex items-center justify-center text-white border-4 border-[#0f172a] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Camera size={28} />
                </button>
            </motion.div>

            {/* Overlay Interface */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} className="text-pink-500" />
                                <span className="font-bold text-white tracking-tight">Vision Solver</span>
                            </div>
                            <button onClick={reset} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 relative">

                            {/* Scanning State */}
                            {step === 'scanning' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="relative w-64 h-64 border-2 border-white/20 rounded-2xl overflow-hidden mb-8">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-[scan_2s_linear_infinite]"></div>
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                                            [Cámara Feed Simulado]
                                        </div>
                                    </div>
                                    <p className="text-pink-400 animate-pulse font-medium">Escaneando problema...</p>
                                </div>
                            )}

                            {/* Analyzing State */}
                            {step === 'analyzing' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                        <Zap size={32} className="absolute inset-0 m-auto text-violet-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Analizando Lógica</h3>
                                    <p className="text-slate-400">Descomponiendo variables...</p>
                                </div>
                            )}

                            {/* Solved State (Timeline) */}
                            {step === 'solved' && (
                                <div className="max-w-md mx-auto pb-20">
                                    <div className="mb-8 p-4 bg-slate-900 rounded-xl border border-white/10">
                                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">Problema Detectado</span>
                                        <p className="text-lg text-white font-serif italic">"Calculate the derivative of f(x) = x² * sin(x)"</p>
                                    </div>

                                    <TimelineItem
                                        index={1}
                                        title="Identificar Regla"
                                        desc="Se trata de un producto de dos funciones. Usaremos la Regla del Producto: (uv)' = u'v + uv'."
                                    />
                                    <TimelineItem
                                        index={2}
                                        title="Derivar Componentes"
                                        desc="u = x² → u' = 2x"
                                        subDesc="v = sin(x) → v' = cos(x)"
                                    />
                                    <TimelineItem
                                        index={3}
                                        title="Ensamblar"
                                        desc="f'(x) = (2x)(sin(x)) + (x²)(cos(x))"
                                        isLast={true}
                                    />

                                    <div className="mt-8 p-4 bg-gradient-to-r from-violet-600/20 to-pink-600/20 rounded-xl border border-violet-500/30 flex items-center justify-between">
                                        <div>
                                            <p className="text-violet-300 font-bold text-lg">Resultado Final</p>
                                            <p className="text-white font-mono mt-1">2x·sin(x) + x²·cos(x)</p>
                                        </div>
                                        <button className="p-2 bg-violet-600 rounded-lg text-white shadow-lg hover:bg-violet-500 transition-colors">
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions (Solved) */}
                        {step === 'solved' && (
                            <div className="p-4 bg-slate-900 border-t border-white/10 flex gap-3">
                                <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <RefreshCcw size={18} /> Otro Problema
                                </button>
                                <button className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:opacity-90 text-white rounded-xl font-bold transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20">
                                    <Sparkles size={18} /> Explain in My Way
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const TimelineItem = ({ index, title, desc, subDesc, isLast }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
        className="flex gap-4 relative"
    >
        {/* Line */}
        {!isLast && <div className="absolute left-[19px] top-10 bottom-[-20px] w-0.5 bg-slate-800"></div>}

        <div className="relative z-10 w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-bold shrink-0">
            {index}
        </div>
        <div className="pb-8">
            <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
            <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
            {subDesc && <p className="text-slate-500 mt-1 text-sm font-mono bg-black/20 px-2 py-1 rounded inline-block border border-white/5">{subDesc}</p>}
        </div>
    </motion.div>
);

export default VisionSolver;
