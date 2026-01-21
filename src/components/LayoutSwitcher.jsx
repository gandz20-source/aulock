import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Navigate } from 'react-router-dom';

// Layouts
import SchoolLayout from '../layouts/SchoolLayout';
import TutoringLayout from '../layouts/TutoringLayout';
import PreULayout from '../layouts/PreULayout';
import DemoLayout from '../layouts/DemoLayout';
import StudentClassLayout from '../layouts/StudentClassLayout';

// Dashboards
import StudentWorkspace from '../pages/StudentWorkspace'; // NEW CACHE-BUSTED DASHBOARD
import TeacherDashboard from '../pages/TeacherDashboard';
import ParentDashboard from '../components/ParentDashboard';
import AICampus from '../pages/AICampus';
import UniversityDashboard from '../pages/UniversityDashboard';

// Import University Layout
import UniversityLayout from '../layouts/UniversityLayout';

const LayoutSwitcher = () => {
    const { profile } = useAuth();
    const { state } = useUI();
    const { platform } = state;

    if (!profile) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-red-600">Error de Perfil</h2>
                <p className="text-slate-600">No se pudo cargar la información del perfil del usuario.</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
                >
                    Volver al Login
                </button>
            </div>
        );
    }

    const role = profile.role?.toLowerCase();

    // 1. UNIVERSITY CHECK (Top Priority based on Profile)
    if (profile.academic_stage === 'UNIVERSITY') {
        return (
            <UniversityLayout>
                <UniversityDashboard />
            </UniversityLayout>
        );
    }

    // 2. PARENT CHECK
    if (role === 'apoderado' || role === 'parent') {
        return <ParentDashboard />;
    }

    // 3. STUDENT CHECK (Force StudentClassLayout for all students unless specifically in another mode)
    // If we want to allow platform switching, we keep it, but maybe verify default behavior.
    // The user wants 'alumno' to ALWAYS see StudentClassLayout immediately. 
    // If the platform is 'tutor', they might see something else, but for now let's prioritize the Class Experience.
    // 3. STUDENT CHECK (Force StudentClassLayout for all students unless specifically in another mode)
    // We check for both 'alumno' and 'student' to avoid database inconsistency issues.
    const isStudent = role === 'alumno' || role === 'student';
    if (isStudent) {
        return (
            <StudentClassLayout>
                <StudentWorkspace />
            </StudentClassLayout>
        );
    }

    // 4. PLATFORM SPECIFIC (Legacy/Specific modes)
    if (platform === 'school') {
        // Teacher fallback
        return (
            <SchoolLayout>
                <TeacherDashboard />
            </SchoolLayout>
        );
    }

    if (platform === 'tutor') {
        return (
            <TutoringLayout>
                <AICampus />
            </TutoringLayout>
        );
    }

    if (platform === 'preu') {
        return (
            <PreULayout>
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
                    <h1 className="text-3xl font-black text-purple-700 mb-4">Pre-Universitario Nexus</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                </div>
            </PreULayout>
        );
    }

    if (platform === 'demo') {
        return (
            <DemoLayout>
                {(role === 'profesor' || role === 'superadmin') ? <TeacherDashboard /> : <StudentWorkspace />}
            </DemoLayout>
        );
    }

    return <Navigate to="/app/student-dashboard" replace />;
};

export default LayoutSwitcher;
