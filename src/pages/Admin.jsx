import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, ShieldAlert, School, Plus } from 'lucide-react';

const Admin = () => {
    const { profile } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalAlerts: 0,
        totalSchools: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Count students
            const { count: studentCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'alumno');

            // Count alerts
            const { count: alertCount } = await supabase
                .from('alerts')
                .select('*', { count: 'exact', head: true });

            // Count schools
            const { count: schoolCount } = await supabase
                .from('schools')
                .select('*', { count: 'exact', head: true });

            setStats({
                totalStudents: studentCount || 0,
                totalAlerts: alertCount || 0,
                totalSchools: schoolCount || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchool = async (e) => {
        e.preventDefault();
        const name = e.target.schoolName.value;
        if (!name) return;

        const { error } = await supabase.from('schools').insert({ name });
        if (error) {
            alert('Error al crear colegio');
        } else {
            alert('Colegio creado exitosamente');
            e.target.reset();
            fetchStats();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-8">Panel de SuperAdmin</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Total Alumnos</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats.totalStudents}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                            <ShieldAlert className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Alertas Generadas</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats.totalAlerts}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                            <School className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Colegios Registrados</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats.totalSchools}</h3>
                        </div>
                    </div>
                </div>

                {/* Create School Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-md">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Plus className="w-5 h-5 mr-2" /> Nuevo Colegio
                    </h2>
                    <form onSubmit={handleCreateSchool} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Colegio</label>
                            <input
                                name="schoolName"
                                type="text"
                                className="input w-full"
                                placeholder="Ej: Colegio San Agustín"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full py-2">
                            Crear Colegio
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Admin;
