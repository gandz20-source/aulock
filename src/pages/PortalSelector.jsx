import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { School, GraduationCap, BookOpen, Home, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';

const PortalSelector = () => {
    const navigate = useNavigate();
    const { dispatch } = useUI();

    const portals = [
        {
            id: 'school',
            title: 'Colegios',
            subtitle: 'Gestión Escolar Integral',
            description: 'Plataforma institucional para colegios, administración docente, asistencia y seguimiento curricular.',
            icon: School,
            gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
            glowColor: 'group-hover:shadow-blue-500/25',
            badge: 'Modo Institucional',
            badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        },
        {
            id: 'tutor',
            title: 'Tutoría Pro',
            subtitle: 'Mentoría IA 24/7',
            description: 'Acompañamiento académico personalizado, resolución instantánea de dudas y tutores virtuales especialistas.',
            icon: BookOpen,
            gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
            glowColor: 'group-hover:shadow-emerald-500/25',
            badge: 'IA Personalizada',
            badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        },
        {
            id: 'preu',
            title: 'Pre-Universitario',
            subtitle: 'Preparación de Alto Nivel',
            description: 'Entrenamiento intensivo para exámen PAES / Selección universitaria con ensayos y analítica predictiva.',
            icon: GraduationCap,
            gradient: 'from-purple-600 via-violet-600 to-fuchsia-500',
            glowColor: 'group-hover:shadow-purple-500/25',
            badge: 'Rendimiento PAES',
            badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        },
        {
            id: 'homeschool',
            title: 'Educación en Casa',
            subtitle: 'Homeschooling Autónomo',
            description: 'Herramientas avanzadas para familias, tutores particulares y aprendizaje autorregulado en el hogar.',
            icon: Home,
            gradient: 'from-amber-500 via-orange-500 to-rose-500',
            glowColor: 'group-hover:shadow-amber-500/25',
            badge: 'Modo Familia',
            badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }
    ];

    const handleSelect = (platformId) => {
        dispatch({ type: 'SET_PLATFORM', payload: platformId });
        navigate(`/login?plataforma=${platformId}`);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header / Brand */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white">AuLock <span className="text-indigo-400 font-medium text-sm">Nexus</span></span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800 text-xs font-semibold text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Plataforma Multimodal Activa</span>
                </div>
            </header>

            {/* Main Portal Selection Container */}
            <main className="max-w-6xl w-full mx-auto my-auto relative z-10 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <Award className="w-3.5 h-3.5" />
                        <span>Selecciona tu Entorno Educativo</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
                        Bienvenido al ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AuLock</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Elige tu portal de ingreso para acceder a dashboards personalizados, analítica vocacional y tutoría inteligente adaptada a tu modalidad.
                    </p>
                </div>

                {/* 4 Portal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portals.map((portal) => {
                        const Icon = portal.icon;
                        return (
                            <div
                                key={portal.id}
                                onClick={() => handleSelect(portal.id)}
                                className={`group relative cursor-pointer bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:border-slate-700 ${portal.glowColor} hover:shadow-2xl flex flex-col justify-between overflow-hidden`}
                            >
                                {/* Top Accent Bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${portal.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <div className="w-full h-full bg-slate-950/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center text-white">
                                                <Icon className="w-7 h-7" />
                                            </div>
                                        </div>

                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${portal.badgeBg}`}>
                                            {portal.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-extrabold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 transition-colors">
                                        {portal.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-400 mb-3">{portal.subtitle}</p>

                                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                        {portal.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                    <span>Ingresar al Portal</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto py-4 text-center border-t border-slate-900/80 text-xs text-slate-500 font-medium relative z-10 flex flex-col md:flex-row items-center justify-between gap-2">
                <span>© 2026 AuLock Learning Technologies. Todos los derechos reservados.</span>
                <span className="flex items-center space-x-1 text-slate-400">
                    <span>Desarrollado para el Desafío XPRIZE Build with Gemini</span>
                </span>
            </footer>
        </div>
    );
};

export default PortalSelector;
