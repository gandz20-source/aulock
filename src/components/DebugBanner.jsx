import { useAuth } from '../context/AuthContext';

const DebugBanner = () => {
    const { user, profile, loading } = useAuth();

    return (
        <div className="fixed top-0 left-0 right-0 bg-black/80 text-white text-xs p-1 z-[9999] flex justify-between px-4 font-mono">
            <span>
                USER: {user ? user.email : 'No Auth'} |
                ROLE: <span className="text-red-400 font-bold">{profile?.role || 'UNDEFINED'}</span> |
                ID: {user?.id || 'N/A'}
            </span>
            <span>Status: {loading ? 'Loading...' : 'Ready'}</span>
        </div>
    );
};

export default DebugBanner;
