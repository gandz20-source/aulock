import '../index.css';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Key, GraduationCap, School } from 'lucide-react';

const Login = () => {
    const { signIn, setProfile, setUser } = useAuth();
    const { state, dispatch } = useUI();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState('Student'); // 'Student' | 'Teacher' | 'School Admin'

    useEffect(() => {
        const platformParam = searchParams.get('plataforma');
        if (platformParam) {
            dispatch({ type: 'SET_PLATFORM', payload: platformParam });
        }
    }, [searchParams, dispatch]);

    const [formData, setFormData] = useState({
        email: 'student@aulock.com',
        password: 'AuLock2026!',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        if (role === 'Student') {
            setFormData({ email: 'student@aulock.com', password: 'AuLock2026!' });
        } else if (role === 'Teacher') {
            setFormData({ email: 'teacher@aulock.com', password: 'AuLock2026!' });
        } else {
            setFormData({ email: 'admin@aulock.com', password: 'AuLock2026!' });
        }
    };

    const handleDemoQuickAccess = (role, email, name, path) => {
        setLoading(true);
        if (setUser) setUser({ id: 'user-' + Date.now(), email });
        if (setProfile) {
            setProfile({
                id: 'user-' + Date.now(),
                email: email,
                role: role.toLowerCase(),
                full_name: name
            });
        }
        setMsg(`Authenticating as ${role}: ${name}...`);
        setTimeout(() => {
            navigate(path);
        }, 200);
    };

    const handleUniversalLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        let targetPath = '/student-dashboard';
        let roleName = 'Juan Carlos Pérez';

        if (selectedRole === 'Teacher') {
            targetPath = '/teacher-dashboard';
            roleName = 'Prof. Carlos Rivas';
        } else if (selectedRole === 'School Admin') {
            targetPath = '/school-admin';
            roleName = 'San Agustín School Direction';
        }

        handleDemoQuickAccess(selectedRole, formData.email, roleName, targetPath);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10 my-8">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-800">

                    {/* Header */}
                    <div className="relative text-center mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="absolute top-0 left-0 text-slate-400 hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center transition-colors"
                        >
                            ← Home
                        </button>
                        <h1 className="text-3xl font-black mb-1 tracking-tight text-white mt-4 font-orbitron">
                            AuLock <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                                Access Portal
                            </span>
                        </h1>
                        <p className="text-slate-400 text-xs font-medium">
                            Role-Based Institutional Authentication
                        </p>
                    </div>

                    {/* ROLE SELECTOR TABS */}
                    <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6 text-xs font-bold font-orbitron">
                        <button
                            type="button"
                            onClick={() => handleRoleSelect('Student')}
                            className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
                                selectedRole === 'Student'
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Student</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleSelect('Teacher')}
                            className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
                                selectedRole === 'Teacher'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>Teacher</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleSelect('School Admin')}
                            className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
                                selectedRole === 'School Admin'
                                    ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <School className="w-4 h-4" />
                            <span>School Admin</span>
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-xs">
                            <AlertCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 shrink-0" />
                            <p className="text-red-200">{error}</p>
                        </div>
                    )}
                    {msg && (
                        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-bold text-center">
                            {msg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleUniversalLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 text-white rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500 border border-slate-800 transition-all font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 text-white rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500 border border-slate-800 transition-all font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2 font-orbitron uppercase tracking-wider"
                        >
                            {loading ? 'Authenticating...' : `Login as ${selectedRole}`}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    {/* 1-CLICK DEMO SHORTCUTS */}
                    <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-3">
                          ⚡ 1-Click Role Access:
                        </span>

                        <div className="grid grid-cols-3 gap-2 font-mono">
                            <button
                                type="button"
                                onClick={() => handleDemoQuickAccess('Student', 'student@aulock.com', 'Juan Carlos Pérez', '/student-dashboard')}
                                className="p-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-center transition-colors"
                            >
                                <span className="block text-xs font-bold text-cyan-300">🎓 Student</span>
                                <span className="text-[9px] text-slate-400 block">Juan Carlos</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoQuickAccess('Teacher', 'teacher@aulock.com', 'Prof. Carlos Rivas', '/teacher-dashboard')}
                                className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-center transition-colors"
                            >
                                <span className="block text-xs font-bold text-emerald-300">👨‍🏫 Teacher</span>
                                <span className="text-[9px] text-slate-400 block">Prof. Carlos</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoQuickAccess('School Admin', 'admin@aulock.com', 'San Agustín Direction', '/school-admin')}
                                className="p-2.5 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 border border-fuchsia-500/30 rounded-xl text-center transition-colors"
                            >
                                <span className="block text-xs font-bold text-fuchsia-300">🏫 Admin</span>
                                <span className="text-[9px] text-slate-400 block">San Agustín</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
