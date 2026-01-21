import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TeacherDashboard from './TeacherDashboard'; // Reuse existing dashboard for Teacher
import StudentWorkspace from './StudentWorkspace'; // NEW WORKSPACE
import { Loader } from 'lucide-react';

const LiveClass = () => {
    const { profile, loading } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null); // For manual override if needed

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    // 1. Force Login / Selector if no profile
    if (!profile && !selectedRole) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">No se detectó usuario</h1>
                    <p className="text-slate-500 mb-6">Por favor inicia sesión o selecciona un rol para probar.</p>

                    <div className="space-y-3">
                        <button onClick={() => window.location.href = '/login?role=profesor'} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                            Ir a Login de Profesor
                        </button>
                        <button onClick={() => window.location.href = '/login?role=alumno'} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">
                            Ir a Login de Alumno
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Route based on Role
    const effectiveRole = selectedRole || profile?.role;

    // Normalize role to lowercase just in case
    const normalizedRole = effectiveRole?.toLowerCase();

    // Check for Teacher/Admin roles (Spanish & English variants + 'admin' per user request)
    if (['profesor', 'teacher', 'admin', 'superadmin'].includes(normalizedRole)) {
        return <TeacherDashboard />;
    }

    // Check for Student roles
    if (['alumno', 'student'].includes(normalizedRole)) {
        return <StudentWorkspace />;
    }

    // Fallback if role exists but is unknown
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Rol desconocido: {effectiveRole}</p>
        </div>
    );
};

export default LiveClass;
