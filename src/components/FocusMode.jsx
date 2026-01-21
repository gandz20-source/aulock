import React, { useState, useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { supabase } from '../config/supabase';
import { Timer, Smartphone, Lock, CheckCircle, XCircle } from 'lucide-react';

const FocusMode = ({ isOpen, onClose }) => {
    const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 minutes default
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle', 'running', 'success', 'failed'
    const [selectedDuration, setSelectedDuration] = useState(25);
    const backgroundListener = useRef(null);

    // Initial setup for Capacitor App Listener
    useEffect(() => {
        const setupListener = async () => {
            backgroundListener.current = await App.addListener('appStateChange', ({ isActive }) => {
                if (!isActive) {
                    console.log('App went to background!');
                    handleAppBackgrounded();
                }
            });
        };
        setupListener();

        return () => {
            if (backgroundListener.current) {
                backgroundListener.current.remove();
            }
        };
    }, [status]); // Re-bind if status changes (though verifying status inside handler is better)

    // Timer Interval
    useEffect(() => {
        let interval = null;
        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isActive) {
            handleSuccess();
        }
        return () => clearInterval(interval);
    }, [isActive, secondsLeft]);

    const handleAppBackgrounded = () => {
        // Only fail if currently running
        // NOTE: We need to access the LATEST value of status. 
        // Using a ref or functional update in a global store would be cleaner, 
        // but for this component scope, we can check state if looking at the closure correctly.
        // Actually, the listener closure might capture old state. 
        // A ref is safest for the listener.
        if (statusRef.current === 'running') {
            failSession();
        }
    };

    // Ref to track status for the event listener closure
    const statusRef = useRef(status);
    useEffect(() => { statusRef.current = status; }, [status]);


    const startSession = () => {
        setSecondsLeft(selectedDuration * 60);
        setIsActive(true);
        setStatus('running');
    };

    const failSession = () => {
        setIsActive(false);
        setStatus('failed');
    };

    const handleSuccess = async () => {
        setIsActive(false);
        setStatus('success');
        await grantRewards();
    };

    const grantRewards = async () => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const userId = user.data.user.id;

        // 1. Grant XP (Logic/Deep Work) using existing RPC
        await supabase.rpc('update_human_core_xp', {
            user_id: userId,
            xp_updates: { logic: 20, resilience: 10 } // "Deep Work" maps to core stats
        });

        // 2. Grant AuCoins
        // We need a way to increment coin. Assuming update on profile for now manually or RPC
        const { data: profile } = await supabase.from('profiles').select('au_coins').eq('id', userId).single();
        if (profile) {
            await supabase.from('profiles').update({ au_coins: profile.au_coins + 10 }).eq('id', userId);
        }
    };

    const reset = () => {
        setIsActive(false);
        setStatus('idle');
        setSecondsLeft(selectedDuration * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md mx-4 bg-white rounded-3xl p-8 relative shadow-2xl overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 z-10"
                    disabled={status === 'running'}
                >
                    {status !== 'running' && <XCircle className="w-8 h-8" />}
                </button>

                {/* Idle State */}
                {status === 'idle' && (
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                            <Lock className="w-12 h-12 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">Modo Estuche</h2>
                            <p className="text-slate-500 mt-2">Bloquea distracciones. Si sales de la app, pierdes.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[15, 25, 45].map(min => (
                                <button
                                    key={min}
                                    onClick={() => setSelectedDuration(min)}
                                    className={`py-3 rounded-xl font-bold transition-all ${selectedDuration === min
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {min} min
                                </button>
                            ))}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                            🏆 <span className="font-bold">Recompensa:</span> +20 XP Deep Work & +10 AuCoins
                        </div>

                        <button
                            onClick={startSession}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                        >
                            ACTIVAR BLOQUEO
                        </button>
                    </div>
                )}

                {/* Running State */}
                {status === 'running' && (
                    <div className="text-center space-y-8 py-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 rounded-full"></div>
                            <div className="text-7xl font-black font-mono text-indigo-600 tracking-tighter relative z-10">
                                {formatTime(secondsLeft)}
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium animate-pulse">Mantén la app abierta...</p>
                        <div className="flex justify-center">
                            <Smartphone className="w-12 h-12 text-slate-300" />
                        </div>
                        <button
                            onClick={failSession}
                            className="text-slate-400 text-sm underline hover:text-red-500"
                        >
                            Rendirse
                        </button>
                    </div>
                )}

                {/* Failed State */}
                {status === 'failed' && (
                    <div className="text-center space-y-6 pt-6">
                        <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">¡Misión Fallida!</h2>
                            <p className="text-red-500 font-bold mt-2">Detectamos que saliste de la app.</p>
                            <p className="text-slate-400 text-sm mt-1">Omega ha ganado terreno.</p>
                        </div>
                        <button
                            onClick={reset}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black"
                        >
                            Intentar de Nuevo
                        </button>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="text-center space-y-6 pt-6">
                        <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">¡Excelente!</h2>
                            <p className="text-green-600 font-bold mt-2">Sesión de Deep Work completada.</p>
                        </div>

                        <div className="flex justify-center gap-4">
                            <div className="bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
                                <p className="text-xs text-indigo-400 font-bold uppercase">XP</p>
                                <p className="text-2xl font-black text-indigo-700">+20</p>
                            </div>
                            <div className="bg-yellow-50 px-4 py-3 rounded-xl border border-yellow-100">
                                <p className="text-xs text-yellow-500 font-bold uppercase">AuCoins</p>
                                <p className="text-2xl font-black text-yellow-600">+10</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200"
                        >
                            Continuar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FocusMode;
