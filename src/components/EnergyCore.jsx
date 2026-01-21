import React from 'react';
import { motion } from 'framer-motion';

const EnergyCore = ({ weeklyAverage = 6.5, xp = 1250 }) => {
    // Determine core state based on performance
    const isHighPerformance = weeklyAverage >= 6.0;

    // Aesthetic configurations
    const coreColors = isHighPerformance
        ? { glow: 'shadow-[0_0_50px_rgba(250,204,21,0.6)]', border: 'border-yellow-400', center: 'bg-yellow-100' }
        : { glow: 'shadow-[0_0_50px_rgba(59,130,246,0.6)]', border: 'border-blue-500', center: 'bg-blue-100' };

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            {/* Outer Rings */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Rotating Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-full border-2 border-dashed ${isHighPerformance ? 'border-yellow-500/30' : 'border-blue-500/30'}`}
                />

                {/* Rotating Inner Ring (Reverse) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-2 rounded-full border border-dotted ${isHighPerformance ? 'border-yellow-500/50' : 'border-blue-500/50'}`}
                />

                {/* The CORE */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-12 h-12 rounded-full ${coreColors.center} ${coreColors.border} ${coreColors.glow} border-2 z-10 flex items-center justify-center`}
                >
                    <span className={`text-sm font-black ${isHighPerformance ? 'text-yellow-700' : 'text-blue-700'}`}>
                        {weeklyAverage.toFixed(1)}
                    </span>
                </motion.div>
            </div>

            {/* Stats Label */}
            <div className="mt-2 text-center">
                <div className={`text-xs font-bold uppercase tracking-widest ${isHighPerformance ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {isHighPerformance ? 'Nivel Platino' : 'Nivel Estándar'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                    XP: {xp}
                </div>
            </div>
        </div>
    );
};

export default EnergyCore;
