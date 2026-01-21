import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator,
    FlaskConical,
    Languages,
    Code2,
    Landmark,
    Menu,
    MessageSquare
} from 'lucide-react';

import EnergyCore from '../components/EnergyCore';
import SecurityZone from '../components/SecurityZone';
import { useUI } from '../context/UIContext';
import { Toaster, toast } from 'sonner';

// --- AGENT CONFIG ---
const ACADEMIC_AGENTS = [
    { id: 'math', name: 'Profe Mate', icon: Calculator, color: 'text-blue-400', bg: 'bg-blue-500/10', systemPrompt: "Eres el Profe Mate. Usa el método socrático. No des respuestas, haz preguntas." },
    { id: 'science', name: 'Profe Ciencias', icon: FlaskConical, color: 'text-green-400', bg: 'bg-green-500/10', systemPrompt: "Eres el Profe Ciencias. Fomenta la indagación y el método científico." },
    { id: 'english', name: 'Profe Inglés', icon: Languages, color: 'text-purple-400', bg: 'bg-purple-500/10', systemPrompt: "You are the English Teacher. Speak mostly in English, correct grammar gently." },
    { id: 'ada', name: 'Ada', icon: Code2, color: 'text-pink-400', bg: 'bg-pink-500/10', systemPrompt: "Soy Ada. Experta en lógica y programación. Vibe Coding style." },
    { id: 'civic', name: 'CivicMind', icon: Landmark, color: 'text-yellow-400', bg: 'bg-yellow-500/10', systemPrompt: "Soy CivicMind. Enseño historia y formación ciudadana. Contexto histórico es clave." },
];

// --- MIND MIDDLEWARE MOCK ---
const STRESS_KEYWORDS = ['ayuda', 'no entiendo nada', 'odio esto', 'estupido', 'soy tonto', 'me quiero ir', 'auxilio', 'cansado'];

const StudentClassLayout = ({ children }) => {
    const { state } = useUI();
    const [activeAgent, setActiveAgent] = useState('ada'); // Default agent
    const [mindAlert, setMindAlert] = useState(null);

    // Mock "Chat Stream" Listener - In reality, this would hook into the chat component's state or context
    // Here we simulate checking inputs
    const checkMindTrigger = (inputText) => {
        const lowerInput = inputText.toLowerCase();
        const detected = STRESS_KEYWORDS.some(word => lowerInput.includes(word));

        if (detected) {
            toast('¿Todo bien? 👋', {
                description: 'Noto que podrías estar frustrado. ¿Necesitas una pausa o cambiar de enfoque?',
                action: {
                    label: 'Sí, pausa',
                    onClick: () => console.log('Pause requested'),
                },
                duration: 5000,
            });
        }
    };

    // Expose this function globally or via context for children to use? 
    // For now, let's assume Children (Chat) will call a provided prop or we mock it.
    // In a real app, use Context.

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden flex">
            <Toaster theme="dark" position="top-center" />

            {/* LEFT DOCK (Academic Sidebar) */}
            <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center lg:items-stretch py-6 z-20">
                <div className="mb-8 px-4 flex items-center justify-center lg:justify-start gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30">
                        N
                    </div>
                    <span className="hidden lg:block font-bold text-xl tracking-tight text-white">Nexus</span>
                </div>

                <div className="flex-1 space-y-2 px-2 overflow-y-auto custom-scrollbar">
                    {ACADEMIC_AGENTS.map(agent => (
                        <button
                            key={agent.id}
                            onClick={() => setActiveAgent(agent.id)}
                            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${activeAgent === agent.id
                                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.bg} ${agent.color}`}>
                                <agent.icon size={18} />
                            </div>
                            <span className="hidden lg:block text-sm font-medium">{agent.name}</span>
                            {activeAgent === agent.id && (
                                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-auto px-4 pt-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Tu Guía Actual</span>
                        <div className="font-bold text-indigo-400 text-sm">
                            {ACADEMIC_AGENTS.find(a => a.id === activeAgent)?.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col relative">

                {/* TOP BAR: Energy Core & Status */}
                <div className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 relative z-10">
                    <div className="w-20">
                        {/* Empty/Menu Trigger */}
                        <button className="lg:hidden p-2 text-slate-400"><Menu /></button>
                    </div>

                    {/* ENERGY CORE (Centered) */}
                    <div className="absolute left-1/2 top-2 -translate-x-1/2">
                        <EnergyCore weeklyAverage={6.8} xp={1450} />
                    </div>

                    <div className="w-20 flex justify-end">
                        {/* Profile/User Menu Placeholder */}
                        <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600"></div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* Render Children (The Chat Interface usually) */}
                    {/* We pass the active agent system prompt down via props or context if children can accept it */}
                    <div className="h-full relative z-10">
                        {/* 
                           NOTE: In a real app, we would clone children to pass props, or use Context.
                           For visual demo, we assume children is the StudentDashboard content.
                           Also, we expose a mock input for testing Mind Middleware in development.
                        */}
                        {children}

                        {/* DEV ONLY: MOCK CHAT INPUT TO TEST MIND */}
                        {/* <div className="absolute top-4 left-4 bg-red-500/20 p-2 rounded">
                            <input 
                                placeholder="Test Mind Middleware..." 
                                onChange={(e) => checkMindTrigger(e.target.value)} 
                                className="bg-black/50 text-white p-1"
                            />
                        </div> */}
                    </div>
                </div>
            </div>

            {/* SECURITY ZONE (Floating) */}
            <SecurityZone />
        </div>
    );
};

export default StudentClassLayout;
