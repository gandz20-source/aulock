import React from 'react';

export const CharacterCard = ({ name, title, description, avatar, color = 'cyan', onSelect }) => {
    const isMagenta = color === 'magenta';
    const borderColorClass = isMagenta ? 'border-fuchsia-600' : 'border-cyan-600';
    const shadowColorClass = isMagenta ? 'shadow-fuchsia-900/30' : 'shadow-cyan-900/30';
    const textColorClass = isMagenta ? 'text-fuchsia-300' : 'text-cyan-300';
    const buttonBgClass = isMagenta ? 'bg-fuchsia-950 text-fuchsia-100 hover:bg-fuchsia-900 border-fuchsia-700' : 'bg-cyan-950 text-cyan-100 hover:bg-cyan-900 border-cyan-700';

    return (
        <div className={`bg-slate-950 p-6 rounded-2xl border-2 ${borderColorClass} ${shadowColorClass} shadow-lg flex flex-col items-center text-center space-y-4 transition-transform hover:-translate-y-2 font-sans`}>
            <img src={avatar} alt={name} className={`w-28 h-28 rounded-full border-4 ${borderColorClass} object-cover shadow-md`} />
            <div>
                <h4 className="text-2xl font-bold text-white font-mono">{name}</h4>
                <p className={`text-xs font-bold ${textColorClass} uppercase tracking-widest mt-1`}>{title}</p>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed flex-grow">{description}</p>
            <button 
                onClick={onSelect}
                className={`mt-4 w-full px-4 py-2.5 ${buttonBgClass} border rounded-xl text-xs font-black uppercase tracking-wider transition shadow`}
            >
                Ver Misiones
            </button>
        </div>
    );
};

export default CharacterCard;
