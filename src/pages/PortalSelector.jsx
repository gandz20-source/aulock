import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { School, GraduationCap, BookOpen, Rocket } from 'lucide-react';

const PortalSelector = () => {
    const navigate = useNavigate();
    const { dispatch } = useUI();

    const portals = [
        {
            id: 'school',
            title: 'Colegios',
            description: 'Plataforma integral para gestión escolar y aprendizaje.',
            icon: School,
            color: 'bg-blue-500',
            borderColor: 'hover:border-blue-500',
            bgHover: 'group-hover:bg-blue-50'
        },
        {
            id: 'tutor',
            title: 'Tutoría Pro',
            description: 'Asistencia personalizada 24/7 con IA avanzada.',
            icon: BookOpen,
            color: 'bg-emerald-500',
            borderColor: 'hover:border-emerald-500',
            bgHover: 'group-hover:bg-emerald-50'
        },
        {
            id: 'preu',
            title: 'Pre-Universitario',
            description: 'Preparación intensiva para exámenes de admisión.',
            icon: GraduationCap,
            color: 'bg-purple-500',
            borderColor: 'hover:border-purple-500',
            bgHover: 'group-hover:bg-purple-50'
        },
        {
            id: 'demo',
            title: 'Homeschool / Demo',
            description: 'Herramientas para padres y tutores en casa.',
            icon: Rocket,
            color: 'bg-orange-500',
            borderColor: 'hover:border-orange-500',
            bgHover: 'group-hover:bg-orange-50'
        }
    ];

    const handleSelect = (platformId) => {
        dispatch({ type: 'SET_PLATFORM', payload: platformId });
        navigate(`/login?plataforma=${platformId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AuLock</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Selecciona tu portal de acceso para ingresar a la experiencia personalizada.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portals.map((portal) => (
                        <button
                            key={portal.id}
                            onClick={() => handleSelect(portal.id)}
                            className={`bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 transition-all duration-300 text-left group border border-slate-100 relative overflow-hidden ${portal.borderColor} hover:scale-105 hover:shadow-2xl`}
                        >
                            <div className={`absolute inset-0 opacity-0 ${portal.bgHover} transition-opacity duration-300`}></div>

                            <div className={`${portal.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-md relative z-10`}>
                                <portal.icon size={28} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 relative z-10">
                                {portal.title}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed relative z-10">
                                {portal.description}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        © 2026 AuLock Learning Technologies
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortalSelector;
