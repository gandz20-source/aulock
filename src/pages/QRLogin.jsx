import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, CheckCircle, XCircle, Loader } from 'lucide-react';

const QRLogin = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signInWithToken } = useAuth();

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Verificando código QR...');
    const token = searchParams.get('code');

    useEffect(() => {
        const authenticateWithToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Código QR inválido. Por favor escanea un código válido.');
                return;
            }

            try {
                const { data, error } = await signInWithToken(token);

                if (error) {
                    setStatus('error');
                    setMessage(error.message || 'Error al validar el código QR');
                    return;
                }

                setStatus('success');
                setMessage('¡Acceso concedido! Redirigiendo...');

                // Redirect to student dashboard after short delay
                setTimeout(() => {
                    navigate('/student-dashboard');
                }, 1500);
            } catch (err) {
                setStatus('error');
                setMessage('Error inesperado. Por favor intenta nuevamente.');
            }
        };

        authenticateWithToken();
    }, [token, signInWithToken, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    {/* Icon */}
                    <div className="mb-6">
                        {status === 'loading' && (
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                                <Loader className="w-10 h-10 text-white animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-glow-green">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold mb-2">
                        <span className="gradient-text">AuLock</span>
                    </h1>

                    {/* Message */}
                    <p className={`text-lg mb-6 ${status === 'success' ? 'text-emerald-600' :
                            status === 'error' ? 'text-red-600' :
                                'text-slate-600'
                        }`}>
                        {message}
                    </p>

                    {/* QR Icon */}
                    <div className="flex justify-center mb-6">
                        <QrCode className="w-16 h-16 text-slate-300" />
                    </div>

                    {/* Action Buttons */}
                    {status === 'error' && (
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary w-full"
                            >
                                Intentar Nuevamente
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-secondary w-full"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="text-sm text-slate-500">
                            <p>Por favor espera mientras validamos tu código...</p>
                        </div>
                    )}
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>
                        ¿No tienes un código QR?{' '}
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Contacta a tu profesor
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRLogin;
