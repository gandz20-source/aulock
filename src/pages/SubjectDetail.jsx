import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { academicService } from '../services/academicService';
import { ArrowLeft, BookOpen, Layers, Plus, FileText, Video, Link as LinkIcon, Lock, Unlock, ChevronDown, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';

const SubjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();

    // State
    const [subject, setSubject] = useState(null);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    // Teacher Controls
    const isTeacher = profile?.role === 'profesor' || profile?.role === 'superadmin';
    const [isEditing, setIsEditing] = useState(false);
    const [showNewUnitModal, setShowNewUnitModal] = useState(false);
    const [newUnitTitle, setNewUnitTitle] = useState('');

    // Content Creation State
    const [contentModal, setContentModal] = useState({ isOpen: false, type: null, unitId: null });
    const [contentTitle, setContentTitle] = useState('');
    const [contentUrl, setContentUrl] = useState('');


    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // 1. Fetch Subject Info
            const { data: subjectData, error: subError } = await supabase
                .from('subjects')
                .select('*, classrooms(name, grades(name))')
                .eq('id', id)
                .single();

            if (subError) throw subError;
            setSubject(subjectData);

            // 2. Fetch Units & Content
            fetchUnits();

        } catch (error) {
            console.error('Error fetching subject:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnits = async () => {
        setLoading(true);
        const { data } = await academicService.getSubjectUnits(id);
        if (data) setUnits(data);
        setLoading(false);
    };

    const handleCreateUnit = async () => {
        if (!newUnitTitle.trim()) return;

        const { data, error } = await academicService.createUnit({
            subject_id: id,
            title: newUnitTitle,
            order_index: units.length + 1,
            is_published: false // Draft by default
        });

        if (data) {
            setUnits([...units, { ...data, content_blocks: [] }]);
            setShowNewUnitModal(false);
            setNewUnitTitle('');
        } else {
            alert('Error al crear unidad');
        }
    };

    const handleOpenContentModal = (unitId, type) => {
        setContentModal({ isOpen: true, type, unitId });
        setContentTitle('');
        setContentUrl('');
    };

    const handleCreateContent = async () => {
        if (!contentTitle.trim()) return;

        const { data, error } = await academicService.createContentBlock({
            unit_id: contentModal.unitId,
            title: contentTitle,
            type: contentModal.type, // 'video', 'pdf', 'link'
            data: { url: contentUrl },
            order_index: 999 // Append to end
        });

        if (data) {
            // Update local state to show new content immediately
            const updatedUnits = units.map(u => {
                if (u.id === contentModal.unitId) {
                    return { ...u, content_blocks: [...(u.content_blocks || []), data] };
                }
                return u;
            });
            setUnits(updatedUnits);
            setContentModal({ isOpen: false, type: null, unitId: null });
        } else {
            console.error(error);
            alert('Error al crear contenido');
        }
    };


    const handleTogglePublish = async (unit) => {
        const newState = !unit.is_published;
        const { data } = await academicService.toggleUnitPublish(unit.id, newState);

        if (data) {
            const updatedUnits = units.map(u => u.id === unit.id ? { ...u, is_published: newState } : u);
            setUnits(updatedUnits);
        }
    };

    if (loading && !subject) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Navbar Placeholder since we don't have a global layout yet */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm flex justify-between items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Volver
                </button>
                {isTeacher && (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400 uppercase mr-2">Modo Profesor</span>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isEditing ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            {isEditing ? 'Ver como Alumno' : 'Activar Edición'}
                        </button>
                    </div>
                )}
            </div>

            <div className="max-w-3xl mx-auto p-6">
                {/* Course Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                {subject?.classrooms?.grades?.name}
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                                {subject?.classrooms?.name}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">{subject?.name}</h1>
                        <p className="text-slate-500 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {units.length} Unidades Publicadas
                        </p>
                    </div>
                </div>

                {/* Units List */}
                <div className="space-y-6">
                    {/* Add Unit Button (Teacher) */}
                    {isTeacher && isEditing && (
                        <button
                            onClick={() => setShowNewUnitModal(true)}
                            className="w-full py-4 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-blue-200">
                                <Plus className="w-5 h-5" />
                            </div>
                            Crear Nueva Unidad
                        </button>
                    )}

                    {/* New Unit Modal (Inline) */}
                    {showNewUnitModal && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-fade-in-up">
                            <h3 className="font-bold text-slate-800 mb-4">Nueva Unidad</h3>
                            <input
                                type="text"
                                placeholder="Título de la unidad (ej: Álgebra)"
                                value={newUnitTitle}
                                onChange={(e) => setNewUnitTitle(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                autoFocus
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowNewUnitModal(false)}
                                    className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateUnit}
                                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                >
                                    Crear Unidad
                                </button>
                            </div>
                        </div>
                    )}

                    {/* New Content Modal */}
                    {contentModal.isOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                                <h3 className="font-bold text-slate-800 text-xl mb-4">
                                    {contentModal.type === 'pdf' ? 'Añadir Documento' : 'Añadir Video / Enlace'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1">Título del Recurso</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Guía de Ejercicios, Video Explicativo..."
                                            value={contentTitle}
                                            onChange={(e) => setContentTitle(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1">
                                            {contentModal.type === 'pdf' ? 'URL del Documento (PDF)' : 'URL del Video / Sitio Web'}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={contentUrl}
                                            onChange={(e) => setContentUrl(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">
                                            * Por ahora solo se admiten enlaces externos (Google Drive, YouTube, etc).
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 mt-6">
                                    <button
                                        onClick={() => setContentModal({ ...contentModal, isOpen: false })}
                                        className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateContent}
                                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                    >
                                        Guardar Recurso
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Units Display */}
                    {units.length === 0 ? (

                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Layers className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-slate-600 font-medium">Aún no hay contenido.</h3>
                            {isTeacher && <p className="text-slate-400 text-sm">¡Activa el modo edición para empezar!</p>}
                        </div>
                    ) : (
                        units.map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                isTeacher={isTeacher && isEditing}
                                onTogglePublish={() => handleTogglePublish(unit)}
                                onAddContent={handleOpenContentModal}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Subcomponent for each Unit (to handle expanded state independently)
const UnitCard = ({ unit, isTeacher, onTogglePublish, onAddContent }) => {
    const [expanded, setExpanded] = useState(false);


    return (
        <div className={`bg-white rounded-xl shadow-sm border transition-all ${!unit.is_published && !isTeacher ? 'hidden' : ''} ${!unit.is_published ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}>
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors rounded-xl"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${unit.is_published ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center">
                            {unit.title}
                            {!unit.is_published && (
                                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase">Borrador</span>
                            )}
                        </h3>
                        <p className="text-sm text-slate-500">{unit.content_blocks?.length || 0} recursos</p>
                    </div>
                </div>

                {/* Teacher Actions Row */}
                {isTeacher && (
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={onTogglePublish}
                            title={unit.is_published ? "Ocultar a alumnos" : "Publicar para alumnos"}
                            className={`p-2 rounded-full transition-colors ${unit.is_published ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                        >
                            {unit.is_published ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t border-slate-100 p-5 bg-slate-50 rounded-b-xl">
                    <div className="space-y-3">
                        {/* Empty State for Content */}
                        {(!unit.content_blocks || unit.content_blocks.length === 0) && (
                            <p className="text-sm text-slate-400 italic pl-2">No hay recursos en esta unidad.</p>
                        )}

                        {/* Content Blocks */}
                        {unit.content_blocks?.map(block => (
                            <div key={block.id} className="flex items-center bg-white p-3 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                                <div className="mr-3">
                                    {block.type === 'video' && <Video className="w-5 h-5 text-red-500" />}
                                    {block.type === 'pdf' && <FileText className="w-5 h-5 text-orange-500" />}
                                    {block.type === 'link' && <LinkIcon className="w-5 h-5 text-blue-500" />}
                                    {block.type === 'text' && <FileText className="w-5 h-5 text-slate-500" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-700 text-sm">{block.title}</h4>
                                </div>
                            </div>
                        ))}

                        {/* Add Content Buttons */}
                        {isTeacher && (
                            <div className="mt-4 pt-4 border-t border-dashed border-slate-300 grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => onAddContent(unit.id, 'pdf')}
                                    className="py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-colors"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Documento / PDF
                                </button>
                                <button
                                    onClick={() => onAddContent(unit.id, 'video')}
                                    className="py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-colors"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Video / Link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectDetail;
