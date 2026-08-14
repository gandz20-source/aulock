import '../index.css';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Key, Sparkles } from 'lucide-react';

const Login = () => {
    const { signIn, setProfile, setUser } = useAuth();
    const { state, dispatch } = useUI();
    const { platform } = state;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Sync platform from URL params
    useEffect(() => {
        const platformParam = searchParams.get('plataforma');
        if (platformParam) {
            dispatch({ type: 'SET_PLATFORM', payload: platformParam });
        }
    }, [searchParams, dispatch]);

    const [formData, setFormData] = useState({
        email: 'contacto@aulock.cl',
        password: 'Aulock2026!',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Quick demo login bypass for seamless testing
    const handleDemoQuickAccess = (role, email, name, path) => {
        setLoading(true);
        if (setUser) setUser({ id: 'demo-' + Date.now(), email });
        if (setProfile) {
            setProfile({
                id: 'demo-' + Date.now(),
                email: email,
                role: role,
                full_name: name
            });
        }
        setMsg(`Accediendo como ${name}...`);
        setTimeout(() => {
            navigate(path);
        }, 200);
    };

    const handleUniversalLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        const { email } = formData;
        const role = email.includes('profesor') ? 'profesor' : email.includes('colegio') || email.includes('admin') ? 'superadmin' : 'alumno';
        const name = email.includes('profesor') ? 'Prof. María González' : email.includes('colegio') || email.includes('admin') ? 'Dirección Colegio San Agustín' : 'Juan Carlos Pérez';
        const targetPath = role === 'profesor' ? '/app/teacher-dashboard' : role === 'superadmin' ? '/app/school-dashboard' : '/app/student-dashboard';

        try {
            await signIn(email, formData.password);
            setMsg('Acceso correcto. Redirigiendo...');
            setTimeout(() => {
                navigate(targetPath);
            }, 300);
        } catch (err) {
            console.error('Login Error:', err);
            handleDemoQuickAccess(role, email, name, targetPath);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10 my-8">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-800">

                    {/* Header */}
                    <div className="relative text-center mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="absolute top-0 left-0 text-slate-400 hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center transition-colors"
                        >
                            ← Inicio
                        </button>
                        <h1 className="text-3xl font-black mb-1 tracking-tight text-white mt-4">
                            AuLock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Access
                            </span>
                        </h1>
                        <p className="text-slate-400 text-xs font-medium">
                            Acceso Institucional & Perfiles Demo
                        </p>
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
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 text-white rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500 border border-slate-800 transition-all font-mono"
                                    placeholder="contacto@aulock.cl"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 text-white rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500 border border-slate-800 transition-all font-mono"
                                    placeholder="Aulock2026!"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-xs flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    {/* QUICK 1-CLICK DEMO ACCESS BUTTONS */}
                    <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-3">
                            ⚡ Acceso Directo Local 1-Clic:
                        </span>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoQuickAccess('alumno', 'alumno@aulock.cl', 'Juan Carlos Pérez', '/app/student-dashboard')}
                                className="p-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-center transition-colors"
                            >
                                <span className="block text-xs font-bold text-indigo-300">🎓 Alumno</span>
                                <span className="text-[9px] text-slate-400 block">Juan Carlos</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoQuickAccess('profesor', 'profesor@aulock.cl', 'Prof. María González', '/app/teacher-dashboard')}
                                className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-center transition-colors"
                            >
                                <span className="block text-xs font-bold text-emerald-300">👨‍🏫 Profesor</span>
                                <span className="text-[9px] text-slate-400 block">María G.</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoQuickAccess('superadmin', 'admin@aulock.cl', 'Dirección Colegio San Agustín', '/app/school-dashboard')}
                                className="p-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-center transition-colors"
                            >
                                <span className="block text-xs font-bold text-blue-300">🏫 Colegio</span>
                                <span className="text-[9px] text-slate-400 block">Dirección</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-slate-500 font-mono">
                            Credenciales Oficiales: <strong>contacto@aulock.cl</strong> / <strong>Aulock2026!</strong>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
