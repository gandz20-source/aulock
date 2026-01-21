import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { ShieldAlert, CheckCircle, Bell, X } from 'lucide-react';

const WellnessAlertsPanel = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchAlerts();

        const channel = supabase
            .channel('realtime:mental_health_alerts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mental_health_alerts' }, (payload) => {
                console.log('🔔 New Alert:', payload.new);
                setAlerts((current) => [payload.new, ...current]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchAlerts = async () => {
        const { data, error } = await supabase
            .from('mental_health_alerts')
            .select(`
                *,
                profiles:user_id (full_name, email)
            `)
            .eq('resolved', false) // Only unresolved alerts
            .order('created_at', { ascending: false });

        if (data) setAlerts(data);
    };

    const handleResolve = async (id) => {
        const { error } = await supabase
            .from('mental_health_alerts')
            .update({ resolved: true })
            .eq('id', id);

        if (!error) {
            setAlerts((current) => current.filter(a => a.id !== id));
        }
    };

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <div className="bg-green-50 p-4 rounded-full mb-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-slate-700 font-bold text-lg">Todo en Orden</h3>
                <p className="text-slate-400 text-sm">No hay alertas de bienestar activas.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-lg shadow-red-50 h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-xl animate-pulse">
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-red-900 font-bold text-lg">Alertas de Bienestar</h3>
                </div>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {alerts.length} Nueva(s)
                </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.map((alert) => (
                    <div key={alert.id} className="bg-red-50/50 p-4 rounded-2xl border border-red-100 hover:bg-red-50 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold border border-red-100 text-xs">
                                    {alert.profiles?.full_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{alert.profiles?.full_name || 'Estudiante'}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{new Date(alert.created_at).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleResolve(alert.id)}
                                className="text-red-300 hover:text-red-500 transition-colors p-1"
                                title="Resolver Alerta"
                            >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-red-100/50 shadow-sm">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Bell className="w-3 h-3" /> {alert.flag}
                            </p>
                            {alert.context && (
                                <p className="text-xs text-slate-600 italic line-clamp-3">
                                    "{typeof alert.context === 'string' ? alert.context : JSON.stringify(alert.context)}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WellnessAlertsPanel;
