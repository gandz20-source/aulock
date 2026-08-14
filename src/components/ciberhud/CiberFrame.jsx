import React from 'react';

export const CiberFrame = ({ imgSrc, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={imgSrc || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'}
        alt="Avatar"
        className="relative z-10 object-cover w-full h-full rounded-full border-2 border-cyan-400"
        style={{
            // EFECTO DE NEÓN MÚLTIPLE (El truco visual)
            boxShadow: `
                0 0 10px #22d3ee,
                0 0 20px #0891b2,
                0 0 40px #06b6d4,
                0 0 80px #164e63,
                inset 0 0 15px #22d3ee
            `
        }}
      />
      {/* Elemento decorativo rotando detrás */}
      <div className="absolute -inset-3 z-0 border-2 border-dashed border-cyan-500/60 rounded-full animate-spin-slow opacity-70 pointer-events-none" />
    </div>
  );
};

export default CiberFrame;
