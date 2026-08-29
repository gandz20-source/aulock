import { supabase } from '../config/supabase';
import { generateAISquadsClustering } from './GeminiService';

export const COURSE_STUDENT_ROSTER_DATASET = [
    { 
        id: 'st-1', 
        name: 'Juan Carlos Pérez', 
        course: '4° Medio A',
        gpa: 6.8, 
        subjects: { math: 7.0, biology: 4.3, history: 6.8, physics: 6.9, chemistry: 5.8 }, 
        focus_metric: '96%',
        tab_exits_count: 0,
        strengths: ['Matemáticas (7.0)', 'Física (6.9)'], 
        weaknesses: ['Biología Orgánica (4.3)'],
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-2', 
        name: 'Mateo Rojas', 
        course: '4° Medio A',
        gpa: 6.2, 
        subjects: { math: 4.5, biology: 6.8, history: 5.8, physics: 5.5, chemistry: 6.5 }, 
        focus_metric: '88%',
        tab_exits_count: 1,
        strengths: ['Biología Celular (6.8)', 'Química (6.5)'], 
        weaknesses: ['Matemática Avanzada (4.5)'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-3', 
        name: 'Sofía Martínez', 
        course: '4° Medio A',
        gpa: 6.5, 
        subjects: { math: 5.2, biology: 5.9, history: 6.9, language: 6.8, physics: 4.8 }, 
        focus_metric: '94%',
        tab_exits_count: 0,
        strengths: ['Historia & Formación Ciudadana (6.9)', 'Lenguaje (6.8)'], 
        weaknesses: ['Física Aplicada (4.8)'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-4', 
        name: 'Camila Silva', 
        course: '4° Medio A',
        gpa: 6.4, 
        subjects: { math: 4.8, biology: 5.0, history: 6.5, language: 6.9, chemistry: 4.6 }, 
        focus_metric: '91%',
        tab_exits_count: 0,
        strengths: ['Lenguaje & Debate Crítico (6.9)'], 
        weaknesses: ['Química Estequiométrica (4.6)'],
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-5', 
        name: 'Lucas Fernández', 
        course: '4° Medio A',
        gpa: 6.1, 
        subjects: { math: 4.4, biology: 5.8, history: 5.5, arts: 6.9, tech: 6.7 }, 
        focus_metric: '86%',
        tab_exits_count: 2,
        strengths: ['Diseño Visual & UI (6.9)', 'Educación Tecnológica (6.7)'], 
        weaknesses: ['Cálculo & Derivadas (4.4)'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-6', 
        name: 'Valentina Soto', 
        course: '4° Medio A',
        gpa: 6.6, 
        subjects: { math: 6.5, biology: 6.7, chemistry: 6.8, history: 4.5, physics: 6.6 }, 
        focus_metric: '95%',
        tab_exits_count: 0,
        strengths: ['Química & Física Teórica (6.8)'], 
        weaknesses: ['Historia y Geografía (4.5)'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-7', 
        name: 'Diego Morales', 
        course: '4° Medio A',
        gpa: 6.3, 
        subjects: { math: 6.8, coding: 7.0, language: 4.6, history: 5.0, physics: 6.2 }, 
        focus_metric: '93%',
        tab_exits_count: 0,
        strengths: ['Programación & Lógica Computacional (7.0)'], 
        weaknesses: ['Comprensión Lectora (4.6)'],
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
    },
    { 
        id: 'st-8', 
        name: 'Constanza Silva', 
        course: '4° Medio A',
        gpa: 6.2, 
        subjects: { math: 4.2, english: 7.0, language: 6.8, science: 5.2, history: 6.0 }, 
        focus_metric: '90%',
        tab_exits_count: 1,
        strengths: ['Inglés Técnico & Redacción (7.0)'], 
        weaknesses: ['Álgebra Lineal (4.2)'],
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    }
];

/**
 * Ingestion from Supabase or Fallback Roster
 */
export async function fetchStudentRosterForClustering(courseName = '4° Medio A') {
    try {
        const { data: students, error } = await supabase
            .from('profiles')
            .select('id, full_name, grade_average, avatar_url, role')
            .eq('role', 'alumno');

        if (error || !students || students.length < 4) {
            return COURSE_STUDENT_ROSTER_DATASET;
        }

        // Map supabase records with local academic richness
        return students.map((s, idx) => {
            const defaultMatch = COURSE_STUDENT_ROSTER_DATASET[idx % COURSE_STUDENT_ROSTER_DATASET.length];
            return {
                id: s.id,
                name: s.full_name || defaultMatch.name,
                course: courseName,
                gpa: s.grade_average || defaultMatch.gpa,
                subjects: defaultMatch.subjects,
                focus_metric: defaultMatch.focus_metric,
                strengths: defaultMatch.strengths,
                weaknesses: defaultMatch.weaknesses,
                avatar: s.avatar_url || defaultMatch.avatar
            };
        });
    } catch (err) {
        console.warn("Supabase fetch failed, using rich local dataset:", err);
        return COURSE_STUDENT_ROSTER_DATASET;
    }
}

/**
 * Executes the AI Heterogeneous Clustering Engine
 */
export async function executeAIClusteringEngine(courseName = '4° Medio A', subject = 'STEM & Humanidades') {
    const roster = await fetchStudentRosterForClustering(courseName);
    const clusteringResult = await generateAISquadsClustering({
        roster,
        courseName,
        subject
    });
    return clusteringResult;
}

/**
 * Locks the squads for the semester, saving to Supabase and LocalStorage
 */
export async function lockSquadsForSemester(squads, courseName = '4° Medio A') {
    const payload = {
        lockedAt: new Date().toISOString(),
        course: courseName,
        status: 'LOCKED_SEMESTER',
        squads
    };

    localStorage.setItem('aulock_active_squads_v4', JSON.stringify(payload));
    localStorage.setItem('aulock_teacher_squads_v3', JSON.stringify(squads));

    try {
        for (const sq of squads) {
            const { data: squadData } = await supabase
                .from('squads')
                .upsert({
                    name: sq.name,
                    subject: sq.specialty || 'General',
                    school_id: 'school_central_1',
                    weekly_goal: 'Completar desafíos de peer mentoring y optimización'
                })
                .select()
                .single();

            if (squadData && sq.members) {
                const membersData = sq.members.map(m => ({
                    squad_id: squadData.id,
                    student_id: m.id,
                    role: m.role
                }));
                await supabase.from('squad_members').upsert(membersData);
            }
        }
    } catch (err) {
        console.warn("Supabase lock sync non-fatal error:", err);
    }

    return payload;
}

/**
 * Retrieves the active assigned squad for the logged-in student
 */
export function getActiveSquadForStudent(studentName = 'Juan Carlos Pérez') {
    const saved = localStorage.getItem('aulock_active_squads_v4') || localStorage.getItem('aulock_teacher_squads_v3');
    let squadList = [];

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            squadList = parsed.squads || parsed;
        } catch (e) {
            squadList = [];
        }
    }

    if (!squadList || squadList.length === 0) {
        squadList = [
            {
                id: 'sq-1',
                name: 'Squad Alfa STEM',
                course: '4° Medio A',
                specialty: 'Ciencias Exactas & Tecnología',
                pedagogical_rationale: 'Emparejamiento de alta sinergia entre Juan Carlos (líder en cálculo) y Mateo (tutor en biología).',
                average_gpa: 6.4,
                collaboration_index: '95%',
                members: [
                    { id: 'st-1', name: 'Juan Carlos Pérez', gpa: 6.8, role: 'Líder Lógico', best_subject: 'Matemáticas (7.0)', growth_area: 'Biología (4.3)', focus_metric: '96%' },
                    { id: 'st-2', name: 'Mateo Rojas', gpa: 6.2, role: 'Mentor de Pares (Ciencias)', best_subject: 'Biología (6.8)', growth_area: 'Matemática Avanzada (4.5)', focus_metric: '88%' },
                    { id: 'st-5', name: 'Lucas Fernández', gpa: 6.1, role: 'Colaborador Creativo & UI', best_subject: 'Diseño & Tech (6.9)', growth_area: 'Cálculo (4.4)', focus_metric: '86%' },
                    { id: 'st-7', name: 'Diego Morales', gpa: 6.3, role: 'Coordinador de Algoritmos', best_subject: 'Programación (7.0)', growth_area: 'Comprensión Lectora (4.6)', focus_metric: '93%' }
                ],
                synergies: [
                    { mentor: 'Juan Carlos Pérez', apprentice: 'Mateo Rojas', area: 'Matemáticas & Cálculo', reason: 'Juan Carlos (7.0) refuerza derivadas y optimización a Mateo (4.5).' },
                    { mentor: 'Mateo Rojas', apprentice: 'Juan Carlos Pérez', area: 'Biología Orgánica', reason: 'Mateo (6.8) guía el laboratorio de ecosistemas a Juan Carlos (4.3).' }
                ]
            }
        ];
    }

    const matched = squadList.find(sq => sq.members && sq.members.some(m => (m.name || '').toLowerCase() === (studentName || '').toLowerCase())) || squadList[0];
    return matched;
}
