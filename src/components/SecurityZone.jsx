import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Shield,
    X,
    Music,
    Phone,
    Camera,
    AlertTriangle,
    Send
} from 'lucide-react';

const SecurityZone = () => {
    const [activeModal, setActiveModal] = useState(null); // 'teasisto' | 'guardian' | null
    const [reportText, setReportText] = useState('');

    const toggleModal = (mode) => {
        setActiveModal(activeModal === mode ? null : mode);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                {/* TEAsisto FAB */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleModal('teasisto')}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white relative group"
                >
                    <Heart fill="currentColor" size={24} />
                    <span className="absolute right-full mr-3 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        TEAsisto
                    </span>
                </motion.button>

                {/* Guardian FAB */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleModal('guardian')}
                    className="w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-indigo-400 relative group"
                >
                    <Shield size={28} />
                    <span className="absolute right-full mr-3 bg-indigo-900 text-indigo-200 text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Guardian
                    </span>
                    {/* Status Dot */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                </motion.button>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {/* TEAsisto Modal (Calm Aesthetics) */}
                {activeModal === 'teasisto' && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-96 bg-[#f0fdfa] rounded-3xl shadow-2xl overflow-hidden z-50 border-4 border-teal-100"
                    >
                        <div className="bg-teal-100 p-4 flex justify-between items-center">
                            <h3 className="text-teal-800 font-bold text-lg flex items-center gap-2">
                                <Heart className="text-teal-600" size={20} fill="currentColor" />
                                Zona de Calma
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-teal-200 rounded-full text-teal-700 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 bg-gradient-to-b from-teal-50 to-purple-50">
                            <p className="text-slate-600 mb-6 text-sm text-center font-medium">
                                "Respira profundo. Estás en un lugar seguro."
                            </p>

                            {/* Sound Player Mock */}
                            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-4 border border-teal-100">
                                <div className="bg-teal-100 p-3 rounded-full">
                                    <Music className="text-teal-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-700">Lluvia Suave</div>
                                    <div className="h-1 bg-slate-100 rounded-full mt-2 w-full">
                                        <div className="h-1 bg-teal-400 rounded-full w-2/3"></div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-purple-400 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200">
                                <Phone size={20} /> Solicitar Ayuda Humana
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Guardian Modal (Emergency/Report) */}
                {activeModal === 'guardian' && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-96 bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-50 border border-slate-700"
                    >
                        <div className="bg-slate-950 p-4 flex justify-between items-center border-b border-slate-800">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <Shield className="text-indigo-500" size={20} />
                                Denuncia Segura
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-slate-950 rounded-xl aspect-video mb-4 flex flex-col items-center justify-center text-slate-600 border border-slate-800 relative overflow-hidden group">
                                <Camera size={32} className="mb-2" />
                                <span className="text-xs font-mono">CÁMARA DE EVIDENCIA</span>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Clic para Activar</span>
                                </div>
                            </div>

                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4 min-h-[80px]"
                                placeholder="Describe la situación. Esto es anónimo y seguro."
                            />

                            <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/30">
                                <AlertTriangle size={18} /> Enviar Reporte
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SecurityZone;
