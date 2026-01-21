import React, { useState } from 'react';
import { Shield, ChevronDown, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GuardianNet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSharingLocation, setIsSharingLocation] = useState(false);

    return (
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all ${isOpen
                        ? 'bg-slate-900/80 border-slate-700 text-white'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                    }`}
            >
                <Shield size={16} className={isSharingLocation ? "text-emerald-400" : ""} />
                <span className="text-xs font-medium">Guardian Net</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mt-2 w-72 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-white">Red de Seguridad</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 uppercase">Ubicación</span>
                                    <button
                                        onClick={() => setIsSharingLocation(!isSharingLocation)}
                                        className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isSharingLocation ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${isSharingLocation ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">
                                {isSharingLocation
                                    ? "Compartiendo ubicación en tiempo real con 2 contactos."
                                    : "Ubicación visible solo para ti."}
                            </p>
                        </div>

                        <div className="p-2">
                            <h4 className="px-2 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Contactos de Confianza</h4>
                            <div className="space-y-1">
                                <TrustedContact name="Mamá" status="online" />
                                <TrustedContact name="Jorge (Roommate)" status="offline" />
                            </div>
                        </div>

                        <div className="p-3 bg-red-500/10 border-t border-red-500/20">
                            <button className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors animate-pulse">
                                <AlertCircle size={16} />
                                SOS Rápido
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TrustedContact = ({ name, status }) => (
    <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center relative">
            <User size={14} className="text-slate-400" />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
        </div>
        <div className="flex-1">
            <p className="text-sm text-slate-200 font-medium">{name}</p>
            <p className="text-[10px] text-slate-500 group-hover:text-slate-400">
                {status === 'online' ? 'Activo ahora' : 'Hace 2 horas'}
            </p>
        </div>
        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Phone size={14} />
        </button>
    </div>
);

export default GuardianNet;
