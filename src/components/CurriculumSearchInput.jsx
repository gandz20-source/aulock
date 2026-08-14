import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchCurriculumAPI } from '../services/AuLockCoreServices';

export const CurriculumSearchInput = ({ onSelect, nivelId = '4° Básico', asignaturaId = 'Ciencias Naturales' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Usamos un debounce para no llamar a la API en cada tecla (esperamos 400ms)
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // Efecto que realiza la búsqueda cuando el término de búsqueda cambia
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            setIsOpen(true);
            try {
                // Llamada al backend que busca en la base de datos `aulock_evaluacion_maestra`
                const results = await searchCurriculumAPI(debouncedSearchTerm, nivelId, asignaturaId);
                setSuggestions(results);
            } catch (error) {
                console.error("Error searching curriculum:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedSearchTerm, nivelId, asignaturaId]);

    // Efecto para cerrar el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectSuggestion = (oa) => {
        onSelect(oa); // Pasamos el OA seleccionado al componente padre
        setSearchTerm(`${oa.codigo} - ${oa.descripcion.substring(0, 50)}...`); // Actualizamos el input con el resumen
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {/* Input de Búsqueda */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Escribe el tema (ej. 'luz', 'ecosistemas', 'el ciclo del agua')..."
                    className="w-full p-3 pl-10 border border-slate-700 bg-slate-950 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-xs transition"
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                {isLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></span>
                )}
            </div>

            {/* Caja de Sugerencias (Resultados MINEDUC) */}
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto py-1 animate-fade-in">
                    {suggestions.map((oa) => (
                        <li
                            key={oa.oa_id}
                            onClick={() => handleSelectSuggestion(oa)}
                            className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-b-0 transition"
                        >
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-cyan-300 text-xs font-mono">{oa.codigo}</span>
                                <span className="font-semibold text-slate-200 text-xs">{oa.eje_aprendizaje}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{oa.descripcion}</p>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && debouncedSearchTerm.length >= 3 && suggestions.length === 0 && !isLoading && (
                <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 text-center text-slate-400 text-xs animate-fade-in">
                    No se encontraron Objetivos de Aprendizaje (OAs) relacionados para {nivelId} y {asignaturaId}.
                </div>
            )}
        </div>
    );
};

export default CurriculumSearchInput;
