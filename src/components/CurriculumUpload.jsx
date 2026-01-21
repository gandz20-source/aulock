import React, { useState } from 'react';
import { Upload, Loader, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { parseCurriculum } from '../services/OpenAIService';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const CurriculumUpload = ({ onSlotsUpdated }) => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [parsedSubjects, setParsedSubjects] = useState([]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        setParsedSubjects([]);

        // Preview
        const reader = new FileReader();
        reader.onloadend = async () => {
            setPreview(reader.result);

            try {
                // Call AI to parse
                console.log("Analyzing curriculum...");
                const subjects = await parseCurriculum(reader.result);
                console.log("Parsed subjects:", subjects);
                setParsedSubjects(subjects);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("No se pudo analizar la imagen. Intenta con una foto más clara.");
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveSlots = async () => {
        if (!parsedSubjects.length) return;

        setLoading(true);
        try {
            // Save to 'custom_slots' table
            const inserts = parsedSubjects.map(subject => ({
                user_id: profile.id,
                subject_name: subject,
                analyzed_from_file: true
            }));

            const { error } = await supabase.from('custom_slots').insert(inserts);

            if (error) throw error;

            alert('¡Malla cargada exitosamente! Tus slots de tutoría han sido creados.');
            if (onSlotsUpdated) onSlotsUpdated();
            setPreview(null);
            setParsedSubjects([]);

        } catch (err) {
            console.error(err);
            setError("Error al guardar los ramos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Cargar Malla Curricular
            </h3>

            {!preview && !loading && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Sube una foto de tu malla</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG</p>
                </div>
            )}

            {loading && (
                <div className="py-10 text-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 animate-pulse">Analizando estructura académica...</p>
                </div>
            )}

            {parsedSubjects.length > 0 && !loading && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center text-green-800 font-bold mb-2">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {parsedSubjects.length} Ramos Detectados
                        </div>
                        <ul className="text-sm text-green-700 grid grid-cols-2 gap-1 list-disc list-inside">
                            {parsedSubjects.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={handleSaveSlots}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Confirmar y Crear Slots
                    </button>
                    <button
                        onClick={() => { setPreview(null); setParsedSubjects([]); }}
                        className="w-full mt-2 py-2 text-slate-400 hover:text-red-500 text-sm font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {error}
                    <button
                        onClick={() => { setError(null); setPreview(null); }}
                        className="ml-auto underline"
                    >Reintentar</button>
                </div>
            )}
        </div>
    );
};

export default CurriculumUpload;
