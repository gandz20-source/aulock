import React from 'react';

export const HudCard = ({ 
    title = "DATOS DE MISIÓN: COORDENADAS", 
    subtitle = "OBJETIVO: AETHEL CORP // SECTOR GAMMA", 
    color = "hud-blue",
    width = "100%",
    height = "140px",
    children 
}) => {
    return (
        <div className={`hud-panel ${color} relative select-none`} style={{ width, minHeight: height }}>
            {/* SVG Borde Vectorial Responsivo con Coordenadas HUD */}
            <svg viewBox="0 0 450 150" preserveAspectRatio="none" className="hud-svg-border">
                {/* Borde rectangular principal con esquinas achaflanadas */}
                <path d="M20 10 H430 L450 30 V120 L430 140 H20 L0 120 V30 Z" fill="none" strokeWidth="2" />
                {/* Líneas decorativas interiores */}
                <path d="M20 50 H450 M20 70 H430 M20 90 H400" fill="none" strokeWidth="0.5" className="hud-divider-line" />
                {/* Conector de datos */}
                <circle cx="435" cy="125" r="4" className="data-point" />
            </svg>

            {/* Contenido HTML Superpuesto */}
            <div className="panel-content space-y-1" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <h4 className="ciber-text font-black text-sm tracking-widest">{title}</h4>
                {subtitle && <p className="ciber-text small-text text-xs opacity-90">{subtitle}</p>}
                {children}
            </div>
        </div>
    );
};

export default HudCard;
