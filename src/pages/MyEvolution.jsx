import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { Award, TrendingUp, Zap, Target, BookOpen, Trophy, Compass, ArrowUpRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const MyEvolution = () => {
    const { profile } = useAuth();
    const [stats, setStats] = useState(null);
    const [careers, setCareers] = useState([]);
    const [selectedCareerId, setSelectedCareerId] = useState(null);
    const [radarData, setRadarData] = useState([]);

    useEffect(() => {
        if (profile) fetchUserData();
        fetchCareers();
    }, [profile]);

    useEffect(() => {
        if (selectedCareerId && stats) {
            generateRadarData();
        }
    }, [selectedCareerId, stats]);

    const fetchUserData = async () => {
        // Fetch User Stats
        setStats(profile.stats || { logic: 0, creativity: 0, resilience: 0, communication: 0, empathy: 0, ethics: 0 });

        // Fetch Selected Career from Vocational Profile
        const { data } = await supabase.from('vocational_profiles').select('target_career_id').eq('user_id', profile.id).single();
        if (data) setSelectedCareerId(data.target_career_id);
    };

    const fetchCareers = async () => {
        const { data } = await supabase.from('career_requirements').select('*');
        if (data) setCareers(data);
    };

    const handleCareerChange = async (e) => {
        const newId = e.target.value;
        setSelectedCareerId(newId);

        // Save preference
        await supabase.from('vocational_profiles').upsert({
            user_id: profile.id,
            target_career_id: newId
        });
    };

    const generateRadarData = () => {
        const target = careers.find(c => c.id === selectedCareerId);
        if (!target || !stats) return;

        const subjects = [
            { subject: 'Lógica', key: 'logic', req: 'required_logic' },
            { subject: 'Creatividad', key: 'creativity', req: 'required_creativity' },
            { subject: 'Resiliencia', key: 'resilience', req: 'required_resilience' },
            { subject: 'Comunicación', key: 'communication', req: 'required_communication' },
            { subject: 'Empatía', key: 'empathy', req: 'required_empathy' },
            { subject: 'Ética', key: 'ethics', req: 'required_ethics' },
        ];

        const data = subjects.map(s => ({
            subject: s.subject,
            A: stats[s.key] || 0, // Student
            B: target[s.req] || 100, // Target
            fullMark: 100,
        }));

        setRadarData(data);
    };

    if (!stats) return <div className="p-10 text-center">Cargando evolución...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-20">
            <div className="max-w-xl mx-auto space-y-6">

                {/* Header Profile */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
                    <div className="relative z-10 mt-10">
                        <div className="w-24 h-24 bg-white p-1 rounded-full mx-auto shadow-xl mb-4">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {profile?.full_name?.charAt(0)}
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">{profile?.full_name}</h1>
                        <p className="text-slate-500 font-medium">Nivel {Math.floor(((stats.logic || 0) + (stats.creativity || 0)) / 20)} • Explorador Vocacional</p>
                    </div>
                </div>

                {/* VOCATIONAL MODULE */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-indigo-100 p-2.5 rounded-xl">
                            <Compass className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Brújula Vocacional</h2>
                            <p className="text-xs text-slate-400">Compara tu perfil con carreras universitarias</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Meta Profesional</label>
                        <select
                            value={selectedCareerId || ''}
                            onChange={handleCareerChange}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-indigo-100 outline-none"
                        >
                            <option value="">Selecciona una carrera...</option>
                            {careers.map(c => (
                                <option key={c.id} value={c.id}>{c.career_name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCareerId && radarData.length > 0 ? (
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid opacity={0.3} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                                    <Radar
                                        name="Tu Perfil"
                                        dataKey="A"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        fill="#4f46e5"
                                        fillOpacity={0.3}
                                    />
                                    <Radar
                                        name="Requisito"
                                        dataKey="B"
                                        stroke="#cbd5e1"
                                        strokeDasharray="5 5"
                                        fill="transparent"
                                        fillOpacity={0.1}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div className="absolute bottom-0 w-full flex justify-center gap-6 text-xs font-bold">
                                <span className="flex items-center"><div className="w-3 h-3 bg-indigo-500 rounded-full mr-1.5 opacity-50"></div> Tu Nivel</span>
                                <span className="flex items-center"><div className="w-3 h-3 bg-slate-400 rounded-full mr-1.5 opacity-50"></div> Requisito de Carrera</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Selecciona una carrera para ver la comparativa</p>
                        </div>
                    )}
                </div>

                {/* Legacy Stats Grid (Mini) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <span className="text-xs text-slate-400 uppercase font-bold">Puntos Totales</span>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                            {Object.values(stats).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0)} XP
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <span className="text-xs text-indigo-200 uppercase font-bold">Próximo Hito</span>
                        <div className="text-lg font-bold mt-1 flex items-center">
                            Becario <ArrowUpRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyEvolution;
