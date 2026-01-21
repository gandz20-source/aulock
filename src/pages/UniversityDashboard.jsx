import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import CurriculumUpload from '../components/CurriculumUpload';
import { Book, GraduationCap, Calendar, MessageSquare } from 'lucide-react';

const UniversityDashboard = () => {
    const { profile } = useAuth();
    const [slots, setSlots] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (profile) fetchSlots();
    }, [profile]);

    const fetchSlots = async () => {
        const { data } = await supabase.from('custom_slots').select('*').eq('user_id', profile.id);
        if (data) setSlots(data);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">

            {/* Header: University Style */}
            <header className="bg-slate-900 text-white pt-10 pb-20 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>

                <div className="max-w-6xl mx-auto flex justify-between items-end relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 mb-2 font-mono text-xs uppercase tracking-widest">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            University Partner
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-slate-100">
                            Hola, <span className="italic text-indigo-300">{profile?.full_name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-slate-400 mt-2 max-w-lg">
                            Gestiona tu avance académico, bibliografía y tutorías especializadas.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <GraduationCap className="w-8 h-8 text-indigo-300" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Custom Slots / Malla */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Slots Grid */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[400px]">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                <Book className="w-6 h-6 mr-3 text-indigo-600" />
                                Mis Asignaturas
                            </h2>

                            {slots.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="bg-slate-50 p-6 rounded-2xl inline-block mb-4">
                                        <GraduationCap className="w-12 h-12 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 mb-6">Aún no has cargado tu malla curricular.</p>
                                    <div className="max-w-sm mx-auto p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-sm">
                                        💡 Sube una foto de tu malla para que la IA genere tus espacios de estudio automáticamente.
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {slots.map(slot => (
                                        <div key={slot.id} className="p-5 border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                                                    {slot.subject_name}
                                                </h3>
                                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                                                    {slot.analyzed_from_file ? 'IA' : 'MANUAL'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-4">Sin profesor asignado</p>

                                            <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                                                <MessageSquare className="w-4 h-4" /> Tutoría IA
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Tools & Upload */}
                    <div className="space-y-6">
                        <CurriculumUpload onSlotsUpdated={fetchSlots} />

                        {/* Quick Actions */}
                        <div className="bg-slate-900 text-slate-300 p-6 rounded-3xl shadow-lg">
                            <h3 className="font-bold text-white mb-4">Accesos Rápidos</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center transition-colors">
                                    <Calendar className="w-5 h-5 mr-3 text-emerald-400" />
                                    Agenda Académica
                                </button>
                                <button className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center transition-colors">
                                    <Book className="w-5 h-5 mr-3 text-blue-400" />
                                    Bibliografía Digital
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default UniversityDashboard;
