import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Zap, 
    Award, 
    Crown, 
    RotateCw, 
    MessageSquarePlus, 
    MoreVertical,
    Shield,
    Brain
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_STUDENTS = [
    { id: 1, name: "Ana Silva", xp: { deepWork: 120, colab: 80 }, topSkills: ['deepWork', 'colab'] },
    { id: 2, name: "Carlos Ruiz", xp: { deepWork: 90, colab: 110 }, topSkills: ['colab', 'deepWork'] },
    { id: 3, name: "Bea Lopez", xp: { deepWork: 100, colab: 95 }, topSkills: ['deepWork', 'colab'] },
    { id: 4, name: "Dani Kim", xp: { deepWork: 115, colab: 60 }, topSkills: ['deepWork', 'colab'] },
    { id: 5, name: "Elena Vo", xp: { deepWork: 85, colab: 90 }, topSkills: ['colab', 'deepWork'] },
];

const MOCK_SQUADS = [
    { 
        id: 's1', 
        name: 'Alpha Squad', 
        members: [
            { id: 101, name: "Leo Messi", xp: { deepWork: 150, colab: 100 }, topSkills: ['deepWork', 'colab'] },
            { id: 102, name: "Cristiano R.", xp: { deepWork: 140, colab: 90 }, topSkills: ['deepWork', 'colab'] }
        ],
        leaderId: 101,
        synchrony: 95 
    },
    { 
        id: 's2', 
        name: 'Beta Squad', 
        members: [],
        leaderId: null,
        synchrony: 50 
    }
];

const SkillIcon = ({ skill, size = 12 }) => {
    if (skill === 'deepWork') return <Zap size={size} className="text-yellow-400" />;
    if (skill === 'colab') return <Users size={size} className="text-blue-400" />;
    return <Award size={size} className="text-purple-400" />;
};

const StudentCard = ({ student, isLeader }) => (
    <motion.div 
        layoutId={`student-${student.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-slate-800/80 p-3 rounded-xl border ${isLeader ? 'border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'border-slate-700'} flex items-center gap-3 cursor-grab active:cursor-grabbing relative group`}
    >
        {isLeader && (
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 p-1 rounded-full shadow-sm z-10">
                <Crown size={10} strokeWidth={3} />
            </div>
        )}
        
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
            {student.name.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-200 truncate">{student.name}</div>
            <div className="flex gap-1 mt-1">
                {student.topSkills.map(skill => (
                    <div key={skill} className="bg-slate-900/50 p-0.5 rounded-md" title={skill}>
                        <SkillIcon skill={skill} />
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

const SquadManager = () => {
    const [availableStudents, setAvailableStudents] = useState(MOCK_STUDENTS);
    const [squads, setSquads] = useState(MOCK_SQUADS);
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const [selectedSquadId, setSelectedSquadId] = useState(null);
    const [challengeText, setChallengeText] = useState('');

    const handleRotateLeader = (squadId) => {
        setSquads(currentSquads => currentSquads.map(sq => {
            if (sq.id !== squadId || sq.members.length === 0) return sq;
            
            const currentLeaderIdx = sq.members.findIndex(m => m.id === sq.leaderId);
            const nextLeaderIdx = (currentLeaderIdx + 1) % sq.members.length;
            
            return {
                ...sq,
                leaderId: sq.members[nextLeaderIdx].id
            };
        }));
    };

    const openChallengeModal = (squadId) => {
        setSelectedSquadId(squadId);
        setIsChallengeModalOpen(true);
    };

    const sendChallenge = () => {
        console.log(`Sending challenge to squad ${selectedSquadId}: ${challengeText}`);
        setIsChallengeModalOpen(false);
        setChallengeText('');
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Gestión de Squads</h1>
                    <p className="text-slate-400 text-sm">Organiza equipos de alto rendimiento</p>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                    <Brain size={18} /> Auto-Organizar (IA)
                </button>
            </div>

            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* LEFT: Available Students */}
                <div className="w-1/3 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold border-b border-slate-700/50 pb-4">
                        <Users size={18} />
                        <h2>Estudiantes Disponibles ({availableStudents.length})</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        <AnimatePresence>
                            {availableStudents.map(student => (
                                <StudentCard key={student.id} student={student} isLeader={false} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT: Squads Grid */}
                <div className="flex-1 bg-slate-900/30 backdrop-blur-md border border-slate-700/30 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {squads.map(squad => (
                            <motion.div 
                                key={squad.id}
                                layout
                                className="bg-slate-800/40 border border-slate-700 rounded-3xl p-5 hover:border-slate-600 transition-colors flex flex-col h-full min-h-[320px]"
                            >
                                {/* Squad Header */}
                                <div className="flex justify-between items-start mb-4 border-b border-slate-700/50 pb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{squad.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`h-2 w-2 rounded-full ${squad.synchrony > 80 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'}`} />
                                            <span className={`text-xs font-semibold ${squad.synchrony > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                Sincronía: {squad.synchrony}%
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-slate-500 hover:text-white transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                {/* Members Grid (4 slots) */}
                                <div className="flex-1 space-y-2 mb-4">
                                    <AnimatePresence>
                                        {squad.members.map(member => (
                                            <StudentCard key={member.id} student={member} isLeader={member.id === squad.leaderId} />
                                        ))}
                                    </AnimatePresence>
                                    
                                    {/* Empty slots placeholders */}
                                    {Array.from({ length: Math.max(0, 4 - squad.members.length) }).map((_, idx) => (
                                        <div key={`empty-${idx}`} className="h-14 border-2 border-dashed border-slate-700/50 rounded-xl flex items-center justify-center text-slate-600 text-xs font-medium">
                                            Espacio Disponible
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-700/50">
                                    <button 
                                        onClick={() => handleRotateLeader(squad.id)}
                                        className="py-2 px-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                        title="Rotar Líder"
                                    >
                                        <RotateCw size={14} /> Rotar Líder
                                    </button>
                                    <button 
                                        onClick={() => openChallengeModal(squad.id)}
                                        className="py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <MessageSquarePlus size={14} /> Retar
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Challenge Modal */}
            <AnimatePresence>
                {isChallengeModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Enviar Reto al Squad</h3>
                            <p className="text-slate-400 text-sm mb-4">Instrucciones privadas para este grupo.</p>
                            
                            <textarea 
                                value={challengeText}
                                onChange={(e) => setChallengeText(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 min-h-[120px] focus:ring-2 focus:ring-blue-500/50 outline-none mb-6 resize-none"
                                placeholder="Escribe el reto aquí..."
                            />
                            
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsChallengeModalOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={sendChallenge}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    Enviar Reto
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SquadManager;
