import '../index.css'; // Ensure styles are loaded
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabase';

const Login = () => {
    const { signIn, signUp } = useAuth();
    const { state, dispatch } = useUI();
    const { platform } = state;
    const [searchParams] = useSearchParams();

    // Sync platform from URL params
    useEffect(() => {
        const platformParam = searchParams.get('plataforma');
        if (platformParam) {
            dispatch({ type: 'SET_PLATFORM', payload: platformParam });
        }
    }, [searchParams, dispatch]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // --- 1. SESSION CLEANUP ON MOUNT ---
    useEffect(() => {
        const cleanupSession = async () => {
            console.log('Cleaning up stale session data...');
            localStorage.clear();
            sessionStorage.clear();

            // Optional: Hard sign out from Supabase ensures clean slate
            await supabase.auth.signOut();

            // Clear all cookies (Brute force for universal cleanup)
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        };
        cleanupSession();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUniversalLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        const { email, password } = formData;
        const targetEmail = 'contacto@aulock.cl';
        const targetPass = 'Aulock2026!';

        try {
            // A. Try Standard Login First
            console.log('Attempting login for:', email);
            let { data, error: signInError } = await signIn(email, password);

            // B. Special Handling for 'contacto@aulock.cl' if User Not Found
            if (signInError && email === targetEmail && password === targetPass) {
                console.log('Login failed for admin. Checking if registration is needed...');

                // Try to create the user if it doesn't exist
                if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('not found')) {
                    // Note: We can't distinguish "Wrong Password" from "User Not Found" securely usually, 
                    // but we will try to Sign Up as a fallback strategy.
                    console.log('Attempting auto-registration for Admin...');
                    const { data: signUpData, error: signUpError } = await signUp(targetEmail, targetPass, {
                        full_name: 'AuLock Admin',
                        role: 'superadmin'
                    });

                    if (!signUpData?.user && !signUpError) {
                        // Some edge case where signUp returns nothing error but no data
                    }

                    if (!signUpError && signUpData?.user) {
                        setMsg('Usuario administrador creado. Iniciando sesión...');
                        // Retry Sign In immediately
                        const result = await signIn(targetEmail, targetPass);
                        signInError = result.error;
                        data = result.data;
                    } else if (signUpError) {
                        console.error('Auto-registration failed:', signUpError);
                        // If sign up fails because user exists, it means the password was definitely wrong in the first step.
                        if (signUpError.message.includes('already registered')) {
                            signInError = { message: 'El usuario existe pero la contraseña es incorrecta. Por favor resetea la contraseña en la base de datos.' };
                        }
                    }
                }
            }

            if (signInError) {
                throw signInError;
            }

            // C. Direct Force Redirection
            if (data?.user) {
                console.log('Login successful. Redirecting to Nexus...');
                // Specific redirect for the admin account
                if (email === targetEmail) {
                    window.location.href = '/nexus';
                } else {
                    // Universal redirect for others too, to be safe
                    window.location.href = '/nexus';
                }
            }

        } catch (err) {
            console.error('Login Error:', err);
            setError(err.message || 'Error al iniciar sesión');
            setLoading(false);
        }
    };

    // Helper for dynamic labels
    const getPlatformLabels = () => {
        switch (platform) {
            case 'tutor': return { title: 'Tutoría', subtitle: 'Tu Asistente de Aprendizaje' };
            case 'preu': return { title: 'Pre-U', subtitle: 'Preparación de Alto Rendimiento' };
            case 'demo': return { title: 'Homeschool', subtitle: 'Gestión Familiar' };
            case 'school': return { title: 'Colegios', subtitle: 'Acceso Universal' };
            default: return { title: 'Nexus', subtitle: 'Bienvenido' };
        }
    };

    const labels = getPlatformLabels();

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-200 relative overflow-hidden">
            {/* Background Effects matching Landing */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">

                    {/* Header */}
                    <div className="relative text-center mb-8">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="absolute -top-4 left-0 text-slate-400 hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center transition-colors"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-4xl font-black mb-2 tracking-tight text-white mt-6">
                            AuLock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                {labels.title}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            {labels.subtitle}
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
                    {msg && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start">
                            <p className="text-green-200 text-sm">{msg}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleUniversalLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 transition-all placeholder-slate-600"
                                    placeholder="contacto@aulock.cl"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 transition-all placeholder-slate-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Acediendo...' : 'Entrar al Nexus'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-800 pt-6">
                        <p className="text-xs text-slate-500">
                            ¿Problemas de acceso? Ejecuta el script <code>fix_access.sql</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
