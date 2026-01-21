import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-slate-600 font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!user || !profile) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on role
        const redirectMap = {
            alumno: '/app/student-dashboard',
            profesor: '/app/teacher-dashboard',
            superadmin: '/app/admin-dashboard',
        };
        return <Navigate to={redirectMap[profile.role] || '/login'} replace />;
    }

    // Optional: Add logic here if specific routes require specific tiers
    // e.g. if (requiredTier && profile.tier_level !== requiredTier) ...

    return children;
};

export default ProtectedRoute;
