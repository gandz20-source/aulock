import React from 'react';
import { Smile, AlertTriangle, ShieldAlert, Star } from 'lucide-react';

export const ActionButton = ({ icon, title, color = '', onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`p-3.5 rounded-2xl border-2 transition-all duration-300 flex items-center space-x-3 text-xs md:text-sm font-black uppercase tracking-wider font-mono shadow-lg hover:scale-[1.03] ${color}`}
        >
            <span className="text-lg">
                {icon === 'emoji' && '😊'}
                {icon === 'ayuda' && '🆘'}
                {icon === 'denuncia' && '🛡️'}
                {icon === 'evaluar' && '⭐'}
            </span>
            <span className="truncate">{title}</span>
        </button>
    );
};

export default ActionButton;
