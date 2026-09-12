import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleForceReset = () => {
        try {
            localStorage.removeItem('aulock_afteria_tip_idx');
            localStorage.removeItem('aulock_active_squad_challenge');
        } catch (e) {}

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                regs.forEach(r => r.unregister());
                if ('caches' in window) {
                    caches.keys().then(names => {
                        Promise.all(names.map(n => caches.delete(n))).then(() => {
                            window.location.reload(true);
                        });
                    });
                } else {
                    window.location.reload(true);
                }
            }).catch(() => window.location.reload(true));
        } else {
            window.location.reload(true);
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-slate-950 text-red-100 min-h-screen font-mono flex flex-col items-center justify-center">
                    <div className="max-w-2xl w-full bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 border-b border-red-900/60 pb-4">
                            <span className="text-3xl">⚠️</span>
                            <div>
                                <h1 className="text-xl font-orbitron font-extrabold text-white">RECUPERACIÓN DE SISTEMA // AULOCK</h1>
                                <p className="text-xs text-red-400">Se detectó una excepción en tiempo de ejecución.</p>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-red-900/40 text-xs text-red-300 font-mono overflow-auto max-h-48 whitespace-pre-wrap">
                            {this.state.error ? (this.state.error.stack || this.state.error.toString()) : 'Error desconocido de renderizado.'}
                        </div>

                        {this.state.errorInfo && (
                            <pre className="text-[10px] text-slate-500 overflow-auto max-h-32 p-3 bg-slate-950 rounded-lg">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={this.handleForceReset}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold text-xs uppercase rounded-xl transition shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer"
                            >
                                🔄 Limpiar Caché & Forzar Recarga
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-orbitron font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                            >
                                Ir al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
