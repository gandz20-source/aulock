/**
 * VocationalEngine.js
 * Longitudinal Skill Tracker & Career Requirement Matcher for AuLock 2.0
 */

// Definición del Vector de Trayectoria del Alumno
export const DEFAULT_VOCATIONAL_VECTOR = {
  logic: 85,
  creativity: 70,
  synergy: 92, // Alto gracias al rol en Escuadrones
  communication: 78,
  resilience: 88,
  recommendedPath: {
    title: "INGENIERÍA E INNOVACIÓN SOCIAL",
    match: "94%",
    reason: "Tu alto nivel de sinergia sumado a tu capacidad lógica permite liderar proyectos interdisciplinarios."
  }
};

const DEFAULT_METRICS = {
    stats: {
        logic: 85,
        communication: 78,
        naturalSciences: 70,
        humanities: 72,
        creativity: 70,
        resilience: 88,
        synergy: 92
    },
    activitiesHistory: [
        { id: 'act-1', type: 'Prueba de Diagnóstico', title: 'Ensayo PAES Matemáticas', score: 98, date: '2026-08-01', dimension: 'logic' },
        { id: 'act-2', type: 'Debate Arena', title: 'Debate sobre Ética en IA', score: 92, date: '2026-08-03', dimension: 'communication' },
        { id: 'act-3', type: 'Trabajo en Squad', title: 'Trivia Colaborativa de Física', score: 85, date: '2026-08-04', dimension: 'resilience' }
    ]
};

// Database of University Careers and Cognitive Requirements
export const CAREERS_DATABASE = [
    {
        id: 'ing-informatica',
        name: 'Ingeniería Civil Informática & Ciencia de Datos',
        category: 'Ingeniería & Tecnología',
        weights: { logic: 0.45, communication: 0.20, naturalSciences: 0.10, humanities: 0.05, creativity: 0.10, resilience: 0.10 },
        cutoffPoints: 840,
        employability: '98%',
        averageSalaryYear1: '$1.800.000'
    },
    {
        id: 'ling-comp',
        name: 'Lingüística Computacional & Modelos de Lenguaje (IA)',
        category: 'Interdisciplinar',
        weights: { logic: 0.35, communication: 0.35, naturalSciences: 0.05, humanities: 0.10, creativity: 0.10, resilience: 0.05 },
        cutoffPoints: 810,
        employability: '95%',
        averageSalaryYear1: '$1.650.000'
    },
    {
        id: 'ing-matematica',
        name: 'Ingeniería en Matemáticas Aplicadas & Finanzas Quant',
        category: 'Ciencias Exactas',
        weights: { logic: 0.50, communication: 0.15, naturalSciences: 0.10, humanities: 0.05, creativity: 0.10, resilience: 0.10 },
        cutoffPoints: 855,
        employability: '96%',
        averageSalaryYear1: '$1.900.000'
    },
    {
        id: 'medicina',
        name: 'Medicina & Bioingeniería Clínica',
        category: 'Salud & Biología',
        weights: { logic: 0.20, communication: 0.15, naturalSciences: 0.45, humanities: 0.05, creativity: 0.05, resilience: 0.10 },
        cutoffPoints: 890,
        employability: '99%',
        averageSalaryYear1: '$2.400.000'
    }
];

// Export alias for singular import compatibility
export const CAREER_DATABASE = CAREERS_DATABASE;

// Retrieve current student cognitive profile
export function getStudentProfileMetrics() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_METRICS;
}

// Generate vocational report for MyEvolution.jsx
export function getVocationalReport() {
    const { stats, activitiesHistory } = getStudentProfileMetrics();
    const matches = calculateVocationalMatches();

    return {
        stats,
        activitiesHistory,
        primaryCareerMatch: matches[0],
        allMatches: matches,
        qualitativeSummary: "Estudiante con perfil sobresaliente en el área Lógica-Matemática e Idiomas (percentil 98). Muestra alta resiliencia y aptitudes algorítmicas con oportunidad de nivelación en ciencias orgánicas."
    };
}

// Record a new student activity (Q&A, Debate, Quiz, Squad Trivia) and recalculate metrics
export function recordStudentActivity({ type, title, score, dimension, details }) {
    const current = getStudentProfileMetrics();
    
    // Calculate new dimension score weighted average
    const oldScore = current.stats[dimension] || 75;
    const updatedScore = Math.min(100, Math.max(40, Math.round(oldScore * 0.8 + score * 0.2)));

    const newActivity = {
        id: 'act-' + Date.now(),
        type: type || 'Evaluación',
        title: title || 'Actividad AuLock',
        score: score,
        date: new Date().toISOString().split('T')[0],
        dimension: dimension,
        details: details || ''
    };

    const updatedData = {
        ...current,
        stats: {
            ...current.stats,
            [dimension]: updatedScore
        },
        activitiesHistory: [newActivity, ...current.activitiesHistory]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Also update AuLock Core Intelligence state if present
    const coreSaved = localStorage.getItem('aulock_core_data_v2');
    if (coreSaved) {
        try {
            const coreData = JSON.parse(coreSaved);
            if (dimension === 'logic' && coreData.studentModel?.grades[0]) {
                coreData.studentModel.grades[0].m4 = (updatedScore / 14.2).toFixed(1);
            }
            localStorage.setItem('aulock_core_data_v2', JSON.stringify(coreData));
        } catch (e) {
            console.error(e);
        }
    }

    return updatedData;
}

// Calculate vocational report with match percentages
export function calculateVocationalMatches() {
    const { stats } = getStudentProfileMetrics();

    return CAREERS_DATABASE.map(career => {
        let matchScore = 0;
        Object.keys(career.weights).forEach(dim => {
            const studentVal = stats[dim] || 70;
            const weight = career.weights[dim];
            matchScore += studentVal * weight;
        });

        return {
            ...career,
            matchPercentage: Math.min(99, Math.round(matchScore))
        };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}
