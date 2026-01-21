import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Home, ArrowRight } from 'lucide-react';
import texts from '../../locales/es.json';

const NexusHub = () => {
    const navigate = useNavigate();
    const t = texts.nexus;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        {t.subtitle}
                    </p>
                </header>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">

                    {/* Card EDU: Bienestar y Foco */}
                    <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between overflow-hidden md:col-span-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div>
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <BookOpen size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t.cards.edu.title}</h2>
                            <p className="text-slate-500 leading-relaxed">
                                {t.cards.edu.description}
                            </p>
                        </div>
                        <button className="mt-8 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                            {t.cards.edu.action} <ArrowRight size={18} className="ml-1" />
                        </button>
                    </div>

                    {/* Card LAB: Vibe Coding (Featured Center) */}
                    <div
                        onClick={() => navigate('/nexus/lab')}
                        className="group relative bg-slate-900 rounded-3xl p-8 shadow-2xl hover:shadow-green-900/20 transition-all duration-300 cursor-pointer border border-slate-800 flex flex-col justify-between overflow-hidden md:col-span-1"
                    >
                        {/* Neon Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-400/30 transition-all"></div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-green-400 border border-slate-700 group-hover:border-green-500/50 transition-colors">
                                <Code size={28} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-wide">
                                {t.cards.lab.title}
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                {t.cards.lab.description}
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 flex items-center justify-between">
                            <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-mono border border-green-500/20 group-hover:bg-green-500 group-hover:text-slate-900 transition-all font-bold">
                                {t.cards.lab.action}
                            </span>
                            <ArrowRight size={24} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Card FAMILY: Salud Mental */}
                    <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between overflow-hidden md:col-span-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div>
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                                <Home size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t.cards.family.title}</h2>
                            <p className="text-slate-500 leading-relaxed">
                                {t.cards.family.description}
                            </p>
                        </div>
                        <button className="mt-8 flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                            {t.cards.family.action} <ArrowRight size={18} className="ml-1" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NexusHub;
