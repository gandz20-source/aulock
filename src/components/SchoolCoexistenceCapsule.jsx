import React, { useEffect, useState } from 'react';
import { useFocusMode } from '../context/FocusModeProvider';
import { WEEKLY_CLASSROOM_AGREEMENTS } from '../data/AuLockMineducConvivenciaDataset';

export const SchoolCoexistenceCapsule = () => {
    const { isPhoneInCase } = useFocusMode();
    const [agreement, setAgreement] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar el acuerdo de la semana actual
    useEffect(() => {
        const fetchAgreement = async () => {
            setIsLoading(true);
            try {
                // Recuperar el acuerdo semanal ISO del dataset MINEDUC
                const currentAgreement = WEEKLY_CLASSROOM_AGREEMENTS[0]?.contenido || {
                    titulo: "¡Nuestra Cultura Escolar!",
                    mensaje_corto: "Practiquemos el respeto y la empatía en cada interacción.",
                    descripcion_larga: "Para que todos podamos aprender, es fundamental respetar los tiempos de los demás.",
                    icono_emoji: "🤝"
                };
                setAgreement(currentAgreement);
            } catch (error) {
                console.error("Error cargando acuerdo de convivencia:", error);
                setAgreement({
                    titulo: "¡Nuestra Cultura Escolar!",
                    mensaje_corto: "Practiquemos el respeto y la empatía en cada interacción.",
                    icono_emoji: "🤝"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgreement();

    }, []);

    // --- UI DE LA CÁPSULA DE CONVIVENCIA ---
    if (isLoading) {
        return <div className="bg-slate-50 h-24 rounded-3xl animate-pulse flex items-center justify-center text-slate-400 px-8">Cargando acuerdos de convivencia...</div>;
    }

    if (!agreement) return null;

    return (
        <div className={`bg-pink-50 border border-pink-100 p-6 rounded-3xl shadow-inner transition-all duration-700 ${isPhoneInCase ? 'opacity-0 translate-y-10 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-5">
                {/* Ícono / Emoticon de la semana */}
                <div className="text-4xl bg-white p-4 rounded-full shadow-sm shrink-0">{agreement.icono_emoji || '🤝'}</div>

                {/* Texto del Acuerdo */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-pink-900 mb-1">{agreement.titulo}</h3>
                    <p className="text-pink-950 font-medium text-base">
                        {agreement.mensaje_corto}
                    </p>
                    {/* Descripción larga */}
                    {agreement.descripcion_larga && (
                        <p className="text-pink-800/80 text-sm mt-2 leading-relaxed font-normal">
                            {agreement.descripcion_larga}
                        </p>
                    )}
                </div>

                {/* Insignia semanal (Gamificación) */}
                <div className="flex flex-col items-center gap-1 text-center shrink-0">
                    <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-dashed border-pink-200 shadow-sm">🎖️</div>
                    <span className="text-xs text-pink-800 font-semibold">Insignia Semanal</span>
                </div>
            </div>
        </div>
    );
};

export default SchoolCoexistenceCapsule;
