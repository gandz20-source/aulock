import React from 'react';

export const DataCard = ({ title, children, className = '', icon }) => {
  return (
    <div className={`relative p-6 rounded-xl bg-black border-l-8 ${className} shadow-xl transition hover:shadow-2xl font-mono`}>
      <div className="flex items-center gap-4 mb-4 border-b border-slate-800/80 pb-3">
        {icon === 'planta' && <span className="text-3xl text-green-400">🌱</span>}
        {icon === 'grafico' && <span className="text-3xl text-blue-400">📊</span>}
        {icon !== 'planta' && icon !== 'grafico' && <span className="text-3xl text-cyan-400">💡</span>}
        <h3 className="text-lg font-orbitron font-extrabold text-white tracking-wide uppercase">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DataCard;
