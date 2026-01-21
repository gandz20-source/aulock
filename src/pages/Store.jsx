import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Loader, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Store = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const [myRedemptions, setMyRedemptions] = useState([]);

    useEffect(() => {
        fetchItems();
        fetchMyRedemptions();
    }, []);

    const fetchItems = async () => {
        const { data } = await supabase.from('store_items').select('*');
        if (data) setItems(data);
        setLoading(false);
    };

    const fetchMyRedemptions = async () => {
        if (!profile) return;
        const { data } = await supabase
            .from('redemptions')
            .select('*, store_items(name)')
            .eq('student_id', profile.id)
            .order('created_at', { ascending: false });
        if (data) setMyRedemptions(data);
    };

    const handleBuy = async (item) => {
        if (profile.au_coins < item.cost) {
            alert('No tienes suficientes AuCoins');
            return;
        }

        if (!confirm(`¿Quieres canjear "${item.name}" por ${item.cost} AuCoins?`)) return;

        setPurchasing(item.id);

        try {
            // Create redemption request
            const { error } = await supabase.from('redemptions').insert({
                student_id: profile.id,
                item_id: item.id,
                status: 'pending'
            });

            if (error) throw error;

            alert('Solicitud enviada al profesor. Se descontarán las monedas cuando sea aprobada.');
            fetchMyRedemptions();
        } catch (err) {
            console.error(err);
            alert('Error al procesar la solicitud');
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            className="mr-4 text-slate-400 hover:text-slate-600"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                            <ShoppingBag className="w-6 h-6 mr-2 text-blue-600" />
                            Tienda AuLock
                        </h1>
                    </div>
                    <div className="bg-yellow-100 px-4 py-2 rounded-full text-yellow-700 font-bold border border-yellow-200">
                        💰 {profile?.au_coins} AC
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Store Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="font-bold text-slate-700 text-lg">Items Disponibles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-2 text-center py-8"><Loader className="animate-spin mx-auto" /></div>
                            ) : items.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-slate-800 mb-2">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 flex-1">{item.description}</p>
                                    <button
                                        onClick={() => handleBuy(item)}
                                        disabled={purchasing === item.id || profile?.au_coins < item.cost}
                                        className={`w-full py-2 rounded-lg font-bold transition-colors ${profile?.au_coins >= item.cost
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {purchasing === item.id ? 'Procesando...' : `Canjear (${item.cost} AC)`}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History */}
                    <div className="space-y-6">
                        <h2 className="font-bold text-slate-700 text-lg">Mis Canjes</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {myRedemptions.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No has canjeado nada aún.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {myRedemptions.map(redemption => (
                                        <div key={redemption.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{redemption.store_items?.name || 'Item'}</p>
                                                <p className="text-xs text-slate-400">{new Date(redemption.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                {redemption.status === 'pending' && (
                                                    <span className="flex items-center text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                                                        <Clock className="w-3 h-3 mr-1" /> Pendiente
                                                    </span>
                                                )}
                                                {redemption.status === 'approved' && (
                                                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                        <Check className="w-3 h-3 mr-1" /> Aprobado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store;
