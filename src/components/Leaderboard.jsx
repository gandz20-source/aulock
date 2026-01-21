import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Trophy, Medal, User } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, au_coins, school_id')
                    .eq('role', 'alumno')
                    .order('au_coins', { ascending: false })
                    .limit(10);

                if (error) throw error;
                setLeaders(data || []);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Subscribe to changes in profiles (coins updates)
        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
                fetchLeaderboard();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) return <div className="p-4 text-center text-slate-500">Cargando ranking...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white mr-2" />
                <h2 className="text-white font-bold text-lg">Top 10 Alumnos</h2>
            </div>

            <div className="divide-y divide-slate-100">
                {leaders.map((student, index) => (
                    <div key={index} className="flex items-center p-4 hover:bg-slate-50 transition-colors">
                        <div className="w-8 flex-shrink-0 font-bold text-slate-400 text-lg text-center">
                            {index === 0 && <span className="text-2xl">🥇</span>}
                            {index === 1 && <span className="text-2xl">🥈</span>}
                            {index === 2 && <span className="text-2xl">🥉</span>}
                            {index > 2 && `#${index + 1}`}
                        </div>
                        <div className="flex-1 ml-4">
                            <p className="font-bold text-slate-800">{student.full_name}</p>
                        </div>
                        <div className="font-bold text-yellow-600 flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                            {student.au_coins} <span className="text-xs ml-1 text-yellow-600/70">AC</span>
                        </div>
                    </div>
                ))}

                {leaders.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        No hay alumnos registrados aún.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
