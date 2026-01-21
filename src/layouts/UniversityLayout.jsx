import React, { useState } from 'react';
import { Settings, Zap, BookOpen, Music } from 'lucide-react';
import VisionSolver from '../components/VisionSolver';
import GuardianNet from '../components/GuardianNet';

// Configuration for University Mode
const SYSTEM_PROMPT = `
Eres Ada, compañera experta de estudio.
Tu objetivo es colaboración peer-to-peer eficiente.
- Tono: Casual pero altamente técnico. Profesional joven.
- Metodología: "Work smart, not hard". Hacks de estudio, síntesis extremas.
- Rol: Co-Pilot Académico.
`;

const UniversityLayout = ({ children }) => {
    const [vibe, setVibe] = useState('cyber'); // cyber, zen, studio

    const vibeConfig = {
        cyber: 'bg-[#0b0c15] from-violet-900/20 to-cyan-900/20',
        zen: 'bg-[#1c1917] from-emerald-900/20 to-stone-900/20',
        studio: 'bg-[#0f0f10] from-orange-900/20 to-rose-900/20'
    };

    return (
        <div className={`min-h-screen ${vibeConfig[vibe].split(' ')[0]} bg-gradient-to-br transition-colors duration-700 text-white relative h-screen overflow-hidden flex flex-col`} data-mode="uni">
            {/* Ambient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${vibeConfig[vibe]} opacity-50`}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            {/* Header / Vibe Selector */}
            <header className="relative z-20 flex items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-black italic tracking-tighter">
                    NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">UNI</span>
                </h1>

                <div className="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
                    {['cyber', 'zen', 'studio'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setVibe(v)}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all ${vibe === v ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {/* Placeholder for settings */}
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Settings size={20} />
                </button>
            </header>

            {/* Widgets Layer */}
            <GuardianNet />

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col p-6 min-h-0">
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
                    {/* Inner styling wrapper */}
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                        {children}
                    </div>
                </div>
            </main>

            {/* Bottom Floating Action Button */}
            <VisionSolver />

            {/* Quick Stats Footer */}
            <footer className="relative z-10 px-8 py-4 flex justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" />
                    <span>Streak: <span className="text-white">12 Days</span></span>
                </div>
                <div>v4.0.2 Neo</div>
            </footer>
        </div>
    );
};

export const uniConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: 'Co-Pilot Académico',
};

export default UniversityLayout;
