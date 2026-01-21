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
import StudentDashboard from '../pages/StudentDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import AICampus from '../pages/AICampus';
import UniversityDashboard from '../pages/UniversityDashboard';

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

    // 1. SCHOOL PLATFORM (Official AuLock)
    if (platform === 'school') {
        const isStudent = role === 'alumno';

        if (isStudent) {
            return (
                <StudentClassLayout>
                    <StudentDashboard />
                </StudentClassLayout>
            );
        }

        return (
            <SchoolLayout>
                <TeacherDashboard />
            </SchoolLayout>
        );
    }

    // 2. TUTOR PLATFORM (Focus on AI)
    if (platform === 'tutor') {
        // Both students and teachers go to AI Campus for now in Tutor mode
        return (
            <TutoringLayout>
                <AICampus />
            </TutoringLayout>
        );
    }

    // 3. PRE-U PLATFORM (Includes University Partner)
    if (platform === 'preu') {
        const isUniversity = profile.academic_stage === 'UNIVERSITY';

        if (isUniversity) {
            return (
                <PreULayout>
                    <UniversityDashboard />
                </PreULayout>
            );
        }

        return (
            <PreULayout>
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
                    <h1 className="text-3xl font-black text-purple-700 mb-4">Pre-Universitario Nexus</h1>
                    <p className="text-slate-600 mb-8 max-w-md text-center">
                        Bienvenido al módulo de preparación intensiva. Los simuladores PAES y el ranking nacional se están cargando...
                    </p>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm max-w-md">
                        <p><strong>¿Ya estás en la U?</strong> Contacta a soporte para activar tu modo <em>University Partner</em>.</p>
                    </div>
                </div>
            </PreULayout>
        );
    }

    // 4. DEMO / HOMESCHOOL PLATFORM
    if (platform === 'demo') {
        // Teachers act as "Parents/Tutors" here
        return (
            <DemoLayout>
                {(role === 'profesor' || role === 'superadmin') ? <TeacherDashboard /> : <StudentDashboard />}
            </DemoLayout>
        );
    }

    // Fallback default
    return <Navigate to="/app/student-dashboard" replace />;
};

export default LayoutSwitcher;
