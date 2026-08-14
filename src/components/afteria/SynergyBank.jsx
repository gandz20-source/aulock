import React, { useState } from 'react';
import { Sparkles, Gift, Award, CheckCircle } from 'lucide-react';
import { synergyManager } from '../../services/SynergyManager';

export const SynergyBank = ({ studentPoints, onPointsUpdated }) => {
    const [selectedDecimas, setSelectedDecimas] = useState(0.1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRedeem = async () => {
        setIsProcessing(true);
        try {
            const result = await synergyManager.canjearPuntosPorNota('STUDENT_001', 'Matemáticas', 'EVAL_MAT_01', selectedDecimas);
            alert(result.message);
            if (onPointsUpdated) onPointsUpdated();
        } catch (e) {
            alert(`⚠️ ${e.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const cost = (selectedDecimas / 0.1) * 500;

    return (
        <div className="bg-slate-900 border-2 border-amber-500/40 p-6 rounded-3xl space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl border border-amber-400/40 flex items-center justify-center text-amber-300">
                        <Sparkles className="w-7 h-7 animate-pulse" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">BANCO DE SINERGIA AFTER IA</span>
                        <h3 className="text-xl font-black text-white">{studentPoints} PS Acumulados</h3>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold block">Tasa de Canje:</span>
                    <span className="text-xs font-mono font-bold text-amber-300">500 PS = +0.1 Décima</span>
                </div>
            </div>

            {/* Canje de Décimas Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Seleccionar Bono:</label>
                    <select
                        value={selectedDecimas}
                        onChange={(e) => setSelectedDecimas(parseFloat(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-amber-400"
                    >
                        <option value={0.1}>+0.1 Décima (500 PS)</option>
                        <option value={0.2}>+0.2 Décimas (1000 PS)</option>
                        <option value={0.5}>+0.5 Décimas (2500 PS)</option>
                    </select>
                </div>

                <div className="text-center sm:text-left">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">Costo Total:</span>
                    <strong className="text-sm font-mono text-cyan-300">{cost} PS</strong>
                </div>

                <button
                    onClick={handleRedeem}
                    disabled={isProcessing || studentPoints < cost}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                    <Gift className="w-4 h-4 text-slate-950" />
                    <span>Canjear Décima</span>
                </button>
            </div>
        </div>
    );
};

export default SynergyBank;
