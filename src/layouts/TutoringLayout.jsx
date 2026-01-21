import React from 'react';
import VideoHub from '../components/VideoHub';
import GemaSidekick from '../components/GemaSidekick';

// Configuration for Tutoring Mode
const SYSTEM_PROMPT = `
Eres Ada, tu Tutora Personal Pro.
Tu objetivo es refuerzo y apoyo académico personalizado.
- Respuesta: Cercana, motivadora, paciente.
- Rol: Tutora Privada / Profesora Remota.
- Enfócate en explicar conceptos difíciles con ejemplos del mundo real.
`;

const TutoringLayout = ({ children }) => {
    return (
        <div className="tutoring-layout bg-slate-50 h-screen flex overflow-hidden" data-mode="tutor">
            {/* Main Content Area - Video Hub occupies most space */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-950 p-4">
                <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
                    <header className="mb-4 flex items-center justify-between text-white">
                        <h1 className="text-xl font-bold tracking-tight">Aula Virtual <span className="text-indigo-400">Nexus</span></h1>
                        <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                            Sesión Privada
                        </span>
                    </header>

                    <div className="flex-1 min-h-0 mb-4">
                        <VideoHub />
                    </div>
                </div>
            </div>

            {/* Sidebar - Gema Notes */}
            <GemaSidekick />
        </div>
    );
};

export const tutoringConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: 'Remote Professor',
};

export default TutoringLayout;
