import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, GraduationCap, School, ShieldCheck, Sparkles, FileCheck, BrainCircuit, Activity } from 'lucide-react';

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
        <div className="bg-slate-950 text-white py-3 px-4 md:px-6 z-[9999] border-b-2 border-cyan-500/50 shadow-[0_4px_30px_rgba(6,182,212,0.3)] backdrop-blur-xl relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
                
                {/* ARCHITECTURE TITLE & USER IDENTITY */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs md:text-sm font-mono text-slate-300">
                    <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/40">
                        <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        <span className="font-extrabold text-white tracking-wide">AuLock RBAC System</span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">|</span>
                    <span className="text-xs text-slate-400">
                        User: <strong className="text-cyan-300 font-bold">{profile?.full_name || 'Juan Carlos Pérez'}</strong>
                    </span>
                </div>

                {/* 4 HIGH-VISIBILITY NEON ROLE CONTROL BUTTONS */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full lg:w-auto">
                    
                    {/* 1. STUDENT PANEL */}
                    <button
                        onClick={() => handleSwitchRole('alumno', '/student-dashboard', 'Juan Carlos Pérez')}
                        className={`px-4 py-2.5 rounded-2xl font-orbitron font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shadow-lg cursor-pointer ${
                            currentRole === 'alumno' || location.pathname === '/student-dashboard'
                                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white border-2 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] scale-105 z-10'
                                : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-2 border-indigo-500/40 hover:border-indigo-400'
                        }`}
                    >
                        <GraduationCap className="w-5 h-5 text-cyan-300" />
                        <span>🎓 PANEL ALUMNO</span>
                    </button>

                    {/* 2. TEACHER PANEL */}
                    <button
                        onClick={() => handleSwitchRole('profesor', '/teacher-dashboard', 'Prof. María González')}
                        className={`px-4 py-2.5 rounded-2xl font-orbitron font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shadow-lg cursor-pointer ${
                            currentRole === 'profesor' || location.pathname === '/teacher-dashboard'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-400 text-slate-950 border-2 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.8)] scale-105 z-10'
                                : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border-2 border-emerald-500/40 hover:border-emerald-400'
                        }`}
                    >
                        <Users className="w-5 h-5 text-emerald-300" />
                        <span>👨‍🏫 PANEL PROFESOR</span>
                    </button>

                    {/* 3. SCHOOL ADMIN PANEL */}
                    <button
                        onClick={() => handleSwitchRole('colegio', '/school-admin', 'Dirección San Agustín')}
                        className={`px-4 py-2.5 rounded-2xl font-orbitron font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shadow-lg cursor-pointer ${
                            currentRole === 'colegio' || location.pathname === '/school-admin' || location.pathname === '/school-dashboard'
                                ? 'bg-gradient-to-r from-sky-600 to-blue-500 text-white border-2 border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.8)] scale-105 z-10'
                                : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-2 border-sky-500/40 hover:border-sky-400'
                        }`}
                    >
                        <School className="w-5 h-5 text-sky-300" />
                        <span>🏫 PANEL COLEGIO</span>
                    </button>

                    {/* 4. CORE INTELLIGENCE */}
                    <button
                        onClick={() => navigate('/core-intelligence')}
                        className={`px-4 py-2.5 rounded-2xl font-orbitron font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shadow-lg cursor-pointer ${
                            location.pathname === '/core-intelligence'
                                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-2 border-fuchsia-300 shadow-[0_0_25px_rgba(217,70,239,0.8)] scale-105 z-10'
                                : 'bg-slate-900 hover:bg-slate-800 text-fuchsia-300 border-2 border-fuchsia-500/40 hover:border-fuchsia-400'
                        }`}
                        title="AuLock Core Intelligence Engine"
                    >
                        <BrainCircuit className="w-5 h-5 text-fuchsia-300" />
                        <span>🧠 CORE</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DebugBanner;
