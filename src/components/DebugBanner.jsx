import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, GraduationCap, School, ShieldCheck, Sparkles, FileCheck, RefreshCw, Lock } from 'lucide-react';

const DebugBanner = () => {
    const { profile, setProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSwitchRole = (role, defaultPath, name) => {
        const newProfile = {
            id: 'user-' + role + '-123',
            email: role + '@aulock.cl',
            role: role,
            full_name: name
        };
        if (setProfile) setProfile(newProfile);
        navigate(defaultPath);
    };

    const currentRole = profile?.role || 'alumno';

    return (
        <div className="bg-slate-950 text-white text-xs py-2 px-4 z-[9999] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg relative">
            <div className="flex items-center space-x-2 font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">AuLock RBAC Mobile Architecture</span>
                <span className="text-slate-600">|</span>
                <span>Usuario: <strong className="text-emerald-400">{profile?.full_name || 'Juan Carlos Pérez'}</strong></span>
                <span className="text-slate-600">|</span>
                <span>Rol Activo: <strong className="text-indigo-400 uppercase font-mono">[{currentRole}]</strong></span>
            </div>

            {/* Strict Role Switcher */}
            <div className="flex items-center space-x-2 overflow-x-auto py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1 hidden sm:inline">Conmutador de Perfil:</span>
                
                <button
                    onClick={() => handleSwitchRole('alumno', '/student-dashboard', 'Juan Carlos Pérez')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                        currentRole === 'alumno'
                            ? 'bg-indigo-600 text-white shadow-md font-black ring-2 ring-indigo-400'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>🎓 Rol Alumno</span>
                </button>

                <button
                    onClick={() => handleSwitchRole('profesor', '/teacher-dashboard', 'Prof. María González')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                        currentRole === 'profesor'
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>👨‍🏫 Rol Profesor</span>
                </button>

                <button
                    onClick={() => handleSwitchRole('colegio', '/school-dashboard', 'Dirección San Agustín')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                        currentRole === 'colegio'
                            ? 'bg-blue-600 text-white shadow-md font-black ring-2 ring-blue-400'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                >
                    <School className="w-3.5 h-3.5" />
                    <span>🏛️ Rol Colegio 360°</span>
                </button>

                <button
                    onClick={() => navigate('/core-intelligence')}
                    className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 rounded-lg text-[11px] font-bold"
                    title="AuLock Core"
                >
                    🧠 Core
                </button>
            </div>
        </div>
    );
};

export default DebugBanner;
