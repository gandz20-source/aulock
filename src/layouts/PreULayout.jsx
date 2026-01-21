import React from 'react';
import { Target, Award, TrendingUp, Clock } from 'lucide-react';

// Configuration for Pre-U Mode
const SYSTEM_PROMPT = `
Eres Ada, preparadora de alto rendimiento para PAES/P.S.U.
Tu objetivo es el pensamiento crítico y la resolución autónoma.
- Metodología: ESTRICTAMENTE SOCRÁTICA.
- NUNCA des la respuesta directa.
- Responde siempre con una pregunta que guíe al estudiante.
- Sé exigente pero justa. Tono: Alto Rendimiento.
`;

const PreULayout = ({ children }) => {
    return (
        <div className="preu-layout min-h-screen bg-[#FDFBF7] text-slate-900" data-mode="preu">
            {/* Header High Performance */}
            <header className="h-16 border-b border-orange-100 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600 text-white rounded-lg">
                        <Target size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-tight">Nexus <span className="text-orange-600">High Performance</span></h1>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Pre-Universitario de Excelencia</span>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Ranking Nacional</span>
                            <span className="text-sm font-bold text-slate-800">Top 5%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Días para PAES</span>
                            <span className="text-sm font-bold text-slate-800">142</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Widget: Active Simulator */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                        <h3 className="font-bold text-lg mb-1 relative z-10">Simulacro Semanal</h3>
                        <p className="text-xs text-slate-500 mb-6 relative z-10">Matemáticas M1 - Eje Álgebra</p>

                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                                <circle cx="64" cy="64" r="56" stroke="#ea580c" strokeWidth="8" fill="none" strokeDasharray="351.86" strokeDashoffset="100" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-800">72%</span>
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Progreso</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            Continuar Ensayo <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white text-center">
                        <Award size={32} className="mx-auto mb-3 text-yellow-400" />
                        <h4 className="font-bold mb-1">Meta Universidad</h4>
                        <p className="text-xs text-slate-300 mb-4">Ingeniería Civil - U. de Chile</p>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div className="bg-yellow-400 h-full w-3/4"></div>
                        </div>
                        <span className="text-[10px] mt-2 block opacity-60">820 / 890 Puntos Ponderados</span>
                    </div>
                </div>

                {/* Main Content (Chat/Lesson) */}
                <div className="lg:col-span-3">
                    {children}
                </div>
            </main>
        </div>
    );
};

// Simple helper for default export
const ChevronRight = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;

export const preuConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: 'Aspirante Universitario',
};

export default PreULayout;
