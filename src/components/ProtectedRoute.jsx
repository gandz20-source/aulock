import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                    <p className="mt-3 text-slate-400 text-xs font-medium">Cargando AuLock Node...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
