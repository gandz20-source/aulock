/**
 * DataImportService.js
 * Bulk Importer & Data Management for AuLock 2.0
 */

const STORAGE_STUDENTS = 'aulock_custom_students';
const STORAGE_TEACHERS = 'aulock_custom_teachers';
const STORAGE_TEACHER_RATINGS = 'aulock_teacher_ratings_secret';

// Parse CSV text into array of objects
export function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentLine = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = currentLine[index] || '';
        });
        result.push(obj);
    }
    return result;
}

// Save Teachers Rating (Secretly visible ONLY to School Direction)
export function submitSecretTeacherRating({ teacherName, subject, emojiRating, reviewText, studentId }) {
    const saved = localStorage.getItem(STORAGE_TEACHER_RATINGS);
    const ratings = saved ? JSON.parse(saved) : [];

    const newRating = {
        id: 'rating-' + Date.now(),
        teacherName: teacherName || 'Prof. María González',
        subject: subject || 'Matemática Avanzada',
        emojiRating: emojiRating, // '😍' | '🙂' | '😐' | '🙁'
        scoreValue: emojiRating === '😍' ? 7.0 : emojiRating === '🙂' ? 6.0 : emojiRating === '😐' ? 4.5 : 3.0,
        reviewText: reviewText || 'Sin reseña escrita',
        submittedAt: new Date().toLocaleString(),
        anonymousStudentHash: 'ANON-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    const updated = [newRating, ...ratings];
    localStorage.setItem(STORAGE_TEACHER_RATINGS, JSON.stringify(updated));
    return updated;
}

// Retrieve Secret Ratings (School Only)
export function getSecretTeacherRatings() {
    const saved = localStorage.getItem(STORAGE_TEACHER_RATINGS);
    return saved ? JSON.parse(saved) : [
        {
            id: 'r-demo-1',
            teacherName: 'Prof. María González',
            subject: 'Matemática Avanzada & Cálculo',
            emojiRating: '😍',
            scoreValue: 7.0,
            reviewText: 'La presentación corta de NotebookLLM sobre Derivadas fue súper clara y dinámica.',
            submittedAt: '2026-08-04 11:30',
            anonymousStudentHash: 'ANON-8F92A1'
        },
        {
            id: 'r-demo-2',
            teacherName: 'Prof. María González',
            subject: 'Matemática Avanzada & Cálculo',
            emojiRating: '🙂',
            scoreValue: 6.0,
            reviewText: 'Buena clase, me gustó el ejercicio en Squad.',
            submittedAt: '2026-08-04 11:32',
            anonymousStudentHash: 'ANON-3K90P4'
        }
    ];
}

// Bulk Upload Students CSV Template Generator
export function getStudentsCSVTemplate() {
    return `nombre,curso,rut,apoderado,telefono,aptitud_destacada
"Juan Carlos Pérez","4° Medio A","21.482.910-K","Patricia Pérez","+56 9 8492 1029","Matemáticas & Lógica"
"Sofía Martínez","4° Medio A","21.902.148-3","Fernando Martínez","+56 9 7712 9012","Historia & Idiomas"
"Mateo Rojas","4° Medio A","21.501.992-1","Elena Rojas","+56 9 9120 4411","Biología & Ciencias"`;
}

// Bulk Upload Teachers CSV Template Generator
export function getTeachersCSVTemplate() {
    return `nombre,email,asignatura,curso_asignado,sala
"Prof. María González","maria.gonzalez@aulock.cl","Matemática Avanzada & Cálculo","4° Medio A","Sala 204 STEM"
"Prof. Roberto Silva","roberto.silva@aulock.cl","Idiomas & Lingüística","4° Medio A","Aula Magna"
"Prof. Carmen Tapia","carmen.tapia@aulock.cl","Historia & Formación","3° Medio A","Sala 102"`;
}
