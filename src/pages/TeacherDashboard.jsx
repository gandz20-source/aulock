import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLiveClassroom } from '../context/LiveClassroomContext';
import { useUI } from '../context/UIContext';
import { supabase } from '../config/supabase';
import { academicService } from '../services/academicService';
import Leaderboard from '../components/Leaderboard';
import HumanCoreRadar from '../components/HumanCoreRadar';
import WellnessAlertsPanel from '../components/WellnessAlertsPanel';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Play, Clock, Plus, Trash2, CheckCircle, Users, AlertTriangle, ShieldAlert, ShoppingBag, Check, X, Sparkles, Save, Trophy, Mic, Layout, Timer, GraduationCap, ChevronRight, Gamepad2, BrainCircuit } from 'lucide-react';


const TeacherDashboard = () => {
    const { profile } = useAuth();
    const { state } = useUI(); // Get UI state
    const { platform } = state;

    // ... existing hooks ...

    // ... (skipping to render part) ...

    return (
        <div className="min-h-screen bg-slate-50">
            {/* 🌟 New Modern Header */}
            <div className={`bg-slate-900 text-white pt-8 pb-16 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden ${platform === 'demo' ? 'bg-gradient-to-r from-orange-900 to-slate-900' : ''
                }`}>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold border-2 border-white/20 shadow-lg">
                                {profile?.full_name?.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold leading-tight">
                                    {platform === 'demo' ? 'Panel de Padre/Tutor' : 'Panel de Profesor'}
                                </h1>
                                <p className="text-indigo-200 text-sm">Bienvenido, {profile?.full_name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-xl border flex items-center transition-all ${activeSession?.status === 'active'
                                ? 'bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                : 'bg-white/5 border-white/10 text-slate-400'
                                }`}>
                                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${activeSession?.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
                                    }`}></div>
                                <span className="font-bold text-sm">
                                    {activeSession?.status === 'active' ? 'Sesión En Vivo' : 'Sin Sesión Activa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 🌟 Modern Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 bg-slate-800/50 backdrop-blur-md p-2 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0">
                        <TabButton id="classes" label="Mis Clases" icon={GraduationCap} activeColorClass="text-indigo-600" />
                        <TabButton id="live" label="Aula en Vivo" icon={Play} activeColorClass="text-blue-600" />
                        <TabButton id="squads" label="Squads" icon={Users} activeColorClass="text-purple-600" />
                        <TabButton id="store" label={`Tienda (${redemptions.length})`} icon={ShoppingBag} activeColorClass="text-green-600" />
                        <TabButton id="debate" label="Debate" icon={Mic} activeColorClass="text-red-600" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 pb-20">

                {/* DASHBOARD V2: ANALYTICS & ALERTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* 1. Radar Chart (Class Analytics) */}
                    <div className="lg:col-span-2">
                        <HumanCoreRadar data={classStats} />
                    </div>

                    {/* 2. Wellness Alerts Panel */}
                    <div className="h-[400px]">
                        <WellnessAlertsPanel />
                    </div>

                    {/* 3. Attention Analytics (New Feature) */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <BrainCircuit className="w-6 h-6 mr-2 text-indigo-500" />
                                Nivel de Atención (Attention Score)
                            </h3>
                            <button
                                onClick={toggleGameSwitch}
                                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center transition-all ${gamesEnabled
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                            >
                                <Gamepad2 className="w-4 h-4 mr-2" />
                                {gamesEnabled ? 'Juegos: ON' : 'Juegos: OFF'}
                            </button>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attentionData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="score" radius={[10, 10, 10, 10]}>
                                        {attentionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#4ade80' : entry.score > 50 ? '#facc15' : '#f87171'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Legacy Alerts Removed -> Now in WellnessAlertsPanel */}


                {/* TAB CONTENT: MIS CLASES */}
                {activeTab === 'classes' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                            </div>
                            Gestión de Asignaturas
                        </h2>

                        {subjects.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No hay asignaturas asignadas a tu escuela aún.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subjects.map(subject => (
                                    <div key={subject.id} className="group cursor-pointer">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                                                    <BookOpen className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    {subject.classrooms?.grades?.name}
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{subject.name}</h3>
                                                <p className="text-slate-500 text-sm font-medium flex items-center">
                                                    <Layout className="w-4 h-4 mr-1.5 opacity-70" />
                                                    {subject.classrooms?.name}
                                                </p>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-400">ID: {subject.id.slice(0, 4)}...</span>
                                                <button
                                                    onClick={() => navigate(`/subject/${subject.id}`)}
                                                    className="text-indigo-600 text-sm font-bold group-hover:underline flex items-center"
                                                >
                                                    Ver Curso <ChevronRight className="w-4 h-4 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB CONTENT: LIVE CLASS */}
                {activeTab === 'live' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        {/* LEFT COLUMN: Controls */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="bg-blue-100 p-2.5 rounded-xl">
                                        <Sparkles className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">Lanzar Pregunta</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Enunciado de la Pregunta</label>
                                        <input
                                            type="text"
                                            value={questionText}
                                            onChange={e => setQuestionText(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                            placeholder="Ej: ¿Cuál es la capital de Francia?"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Tipo de Pregunta</label>
                                            <div className="relative">
                                                <select
                                                    value={questionType}
                                                    onChange={e => setQuestionType(e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none font-medium text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                                                >
                                                    <option value="alternatives">Selección Múltiple</option>
                                                    <option value="true_false">Verdadero / Falso</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Tiempo Límite</label>
                                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                                <Clock className="w-5 h-5 text-slate-400 mr-3" />
                                                <input
                                                    type="number"
                                                    value={timer}
                                                    onChange={e => setTimer(Number(e.target.value))}
                                                    className="w-full py-3 bg-transparent focus:outline-none font-bold text-slate-800"
                                                />
                                                <span className="text-slate-400 text-sm font-bold">seg</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100 my-4"></div>

                                    {/* OPTIONS */}
                                    {questionType === 'alternatives' ? (
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-slate-700 ml-1">Opciones de Respuesta</label>
                                            {options.map((opt, idx) => (
                                                <div key={idx} className="flex items-center gap-3 group">
                                                    <button
                                                        onClick={() => setCorrectAnswer(opt)}
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${correctAnswer === opt && opt !== ''
                                                            ? 'bg-green-500 text-white scale-110 shadow-green-200'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                            }`}
                                                    >
                                                        {correctAnswer === opt && opt !== '' ? <Check className="w-6 h-6" /> : <span className="font-bold text-lg">{String.fromCharCode(65 + idx)}</span>}
                                                    </button>

                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={e => {
                                                                const newOpts = [...options];
                                                                newOpts[idx] = e.target.value;
                                                                setOptions(newOpts);
                                                            }}
                                                            className={`w-full p-3 pl-4 bg-white border rounded-xl transition-all ${correctAnswer === opt && opt !== ''
                                                                ? 'border-green-500 ring-4 ring-green-100'
                                                                : 'border-slate-200 focus:border-blue-400'
                                                                }`}
                                                            placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                                                        />
                                                    </div>

                                                    {options.length > 2 && (
                                                        <button onClick={() => removeOption(idx)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {options.length < 6 && (
                                                <button onClick={addOption} className="w-full py-3 mt-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                                    <Plus className="w-5 h-5" /> Añadir otra opción
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Verdadero', 'Falso'].map(val => (
                                                <button
                                                    key={val}
                                                    onClick={() => setCorrectAnswer(val)}
                                                    className={`py-6 rounded-2xl border-2 font-black text-lg transition-all flex items-center justify-center gap-3 ${correctAnswer === val
                                                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100 scale-[1.02]'
                                                        : 'border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500'
                                                        }`}
                                                >
                                                    {val === 'Verdadero' ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            onClick={handleLaunch}
                                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                                        >
                                            <div className="bg-white/20 p-1.5 rounded-lg">
                                                <Play className="w-6 h-6 text-white" fill="currentColor" />
                                            </div>
                                            Lanzar Pregunta Ahora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Active Status & Leaderboard */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                    <Timer className="w-5 h-5 mr-2 text-slate-400" />
                                    Estado de la Clase
                                </h2>

                                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 relative overflow-hidden">
                                    {activeSession?.current_question ? (
                                        <div className="text-center w-full relative z-10 px-4">
                                            <div className="relative w-32 h-32 mx-auto mb-6">
                                                {/* Timer Circle */}
                                                <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="58"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        className="text-slate-100"
                                                    />
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="58"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        strokeDasharray="365"
                                                        strokeDashoffset="0"
                                                        strokeLinecap="round"
                                                        className="text-blue-500 animate-[spin_30s_linear_reverse]"
                                                        style={{ animationDuration: `${activeSession.current_question?.timer_seconds || 30}s` }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-3xl font-black text-blue-600">Active</span>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pregunta Actual</p>
                                                <p className="font-medium text-slate-800 line-clamp-2">"{activeSession.current_question?.text}"</p>
                                            </div>

                                            <button
                                                onClick={endQuestion}
                                                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Users className="w-4 h-4" /> Terminar Ronda
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 text-center">
                                            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                                <Users className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p className="font-bold text-slate-500">Sin actividad</p>
                                            <p className="text-sm mt-1">Lanza una pregunta para comenzar</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                <Leaderboard />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: SQUADS MANAGEMENT */}
                {activeTab === 'squads' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                                <div className="bg-purple-100 p-2 rounded-xl mr-3">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                Gestión de Squads
                            </h2>
                            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <input
                                    type="text"
                                    placeholder="Nombre del Squad"
                                    value={newSquadName}
                                    onChange={(e) => setNewSquadName(e.target.value)}
                                    className="bg-white border-0 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none shadow-sm w-64"
                                />
                                <button
                                    onClick={handleCreateSquad}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 flex items-center shadow-lg shadow-purple-200 transition-all"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Crear
                                </button>
                            </div>
                        </div>

                        {squads.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium text-lg">No hay squads creados aún.</p>
                                <p className="text-slate-400 text-sm mt-2">Crea equipos para fomentar la colaboración.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {squads.map(squad => (
                                    <div key={squad.id} className="p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all bg-white group hover:border-purple-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                {squad.name.charAt(0)}
                                            </div>
                                            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-md font-bold uppercase">{squad.subject || 'General'}</span>
                                        </div>

                                        <h3 className="font-bold text-slate-800 text-lg mb-1">{squad.name}</h3>
                                        <p className="text-sm text-slate-400 mb-6 font-mono bg-slate-50 inline-block px-1 rounded">ID: {squad.id.slice(0, 8)}</p>

                                        <button className="w-full py-3 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                            <Users className="w-4 h-4" /> Gestionar Miembros
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB CONTENT: STORE */}
                {activeTab === 'store' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <div className="bg-green-100 p-2 rounded-xl mr-3">
                                <ShoppingBag className="w-6 h-6 text-green-600" />
                            </div>
                            Solicitudes de Canje
                        </h2>

                        {redemptions.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                <CheckCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">No hay solicitudes pendientes.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {redemptions.map(req => (
                                    <div key={req.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mr-4 border border-green-100">
                                                {req.store_items.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg">{req.store_items.name}</p>
                                                <div className="flex items-center text-sm mt-1">
                                                    <span className="text-slate-500 mr-2">{req.profiles.full_name}</span>
                                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-black flex items-center">
                                                        {req.store_items.cost} 🟡
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleApproveRedemption(req)} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleRejectRedemption(req.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB CONTENT: DEBATE */}
                {activeTab === 'debate' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                                <div className="bg-red-100 p-2 rounded-xl mr-3">
                                    <Mic className="w-6 h-6 text-red-600" />
                                </div>
                                Gestión de Debate
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className={`p-6 rounded-2xl border transition-all ${activeDebate ? 'bg-indigo-50 border-indigo-200' : 'bg-red-50 border-red-100'}`}>
                                    <h3 className={`font-bold mb-2 text-lg ${activeDebate ? 'text-indigo-800' : 'text-red-800'}`}>
                                        {activeDebate ? 'Debate En Curso' : 'Iniciar Nuevo Debate'}
                                    </h3>

                                    {activeDebate ? (
                                        <div className="animate-in fade-in">
                                            <p className="text-indigo-700/70 text-sm mb-6">
                                                Tema: <strong>{activeDebate.topic}</strong>
                                                <br />Estado: <span className="text-green-600 font-bold animate-pulse">● Activo</span>
                                            </p>

                                            <button
                                                onClick={handleEndDebate}
                                                disabled={analyzingDebate}
                                                className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center justify-center transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {analyzingDebate ? (
                                                    <><Sparkles className="w-6 h-6 mr-2 animate-spin" /> Analizando...</>
                                                ) : (
                                                    <><CheckCircle className="w-6 h-6 mr-2" /> Terminar y Analizar (IA)</>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in">
                                            <p className="text-red-700/70 text-sm mb-6">Define un tema controvertido para que tus alumnos discutan en tiempo real.</p>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-red-900 mb-2">Tema de Discusión</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: ¿La IA reemplazará a los profesores?"
                                                        value={debateTopic}
                                                        onChange={(e) => setDebateTopic(e.target.value)}
                                                        className="w-full bg-white border border-red-200 rounded-xl px-4 py-4 focus:ring-4 focus:ring-red-100 outline-none text-slate-800 font-medium placeholder:text-slate-400"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleStartDebate}
                                                    className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-700 shadow-xl shadow-red-200 transition-all flex items-center justify-center transform active:scale-95"
                                                >
                                                    <Play className="w-6 h-6 mr-2" /> Iniciar Debate
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <Users className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="font-bold text-slate-700 text-lg">Vista de Alumnos</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 mb-6">Puedes unirte a la sala de debate para moderar la discusión como un participante más.</p>

                                <button onClick={() => window.location.href = '/debate'} className="w-full max-w-xs bg-white border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center">
                                    Ir al Debate Arena <ChevronRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* AI VERDICT MODAL */}
                {showVerdictModal && verdictData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                                <Sparkles className="w-12 h-12 mx-auto mb-2 relative z-10" />
                                <h3 className="text-2xl font-black relative z-10">Veredicto de la IA</h3>
                                <p className="text-indigo-200 relative z-10">Análisis del Debate Finalizado</p>

                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 opacity-50"></div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-3xl font-black text-indigo-600 mb-1">{verdictData.logic}/10</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">Lógica</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-3xl font-black text-purple-600 mb-1">{verdictData.evidence}/10</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">Evidencia</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-3xl font-black text-pink-600 mb-1">{verdictData.foundation}/10</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">Fundamento</div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                                    <p className="text-indigo-800 italic text-sm text-center">"{verdictData.summary}"</p>
                                </div>

                                <button
                                    onClick={() => setShowVerdictModal(false)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                                >
                                    Cerrar y Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default TeacherDashboard;
