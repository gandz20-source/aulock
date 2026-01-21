import { supabase } from '../config/supabase';

/**
 * Generates balanced squads based on student performance (Quartile Logic).
 * @param {string} subject - The subject to generate squads for (e.g., 'Matemáticas').
 * @returns {Promise<Array>} - List of proposed squads.
 */
export const generateBalancedSquads = async (subject) => {
    try {
        // 1. Fetch all students
        // In a real app, we would filter by course/grade. For prototype, we fetch all 'alumnos'.
        const { data: students, error } = await supabase
            .from('profiles')
            .select('id, full_name, grade_average, avatar_url')
            .eq('role', 'alumno')
            .order('grade_average', { ascending: false }); // Rank by performance

        if (error) throw error;
        if (!students || students.length < 4) {
            throw new Error("No hay suficientes alumnos para formar squads (mínimo 4).");
        }

        // 2. Split into Quartiles
        const total = students.length;
        const qSize = Math.ceil(total / 4);

        const q1 = students.slice(0, qSize); // Top performers (Mentors)
        const q2 = students.slice(qSize, qSize * 2); // Average High
        const q3 = students.slice(qSize * 2, qSize * 3); // Average Low
        const q4 = students.slice(qSize * 3, total); // Needs Support (Apprentices)

        const squads = [];
        let squadIndex = 1;

        // 3. Form Squads (1 from each quartile)
        // We iterate based on the size of the smallest quartile (usually Q1 or Q4 depending on rounding)
        // But to ensure everyone gets a group, we might need to handle remainders.
        // Strategy: Main loop uses Q1 as the driver for "Mentors".

        // We'll use a pool of students to ensure we pick available ones
        const availableStudents = [...students];
        const pickStudent = (quartileList) => {
            if (quartileList.length === 0) return null;
            const student = quartileList.shift();
            // Remove from main pool just in case
            const idx = availableStudents.findIndex(s => s.id === student.id);
            if (idx > -1) availableStudents.splice(idx, 1);
            return student;
        };

        // While we have enough students to form a decent group (at least 3)
        while (availableStudents.length >= 3) {
            const mentor = pickStudent(q1) || pickStudent(availableStudents); // Fallback to anyone if Q1 empty
            const avg1 = pickStudent(q2) || pickStudent(availableStudents);
            const avg2 = pickStudent(q3) || pickStudent(availableStudents);
            const apprentice = pickStudent(q4) || pickStudent(availableStudents);

            const members = [mentor, avg1, avg2, apprentice].filter(m => m !== null);

            if (members.length > 0) {
                squads.push({
                    name: `Squad ${squadIndex++}`,
                    subject: subject,
                    members: members.map(m => ({
                        ...m,
                        role: determineRole(m, members) // Assign role based on relative rank in group
                    }))
                });
            }
        }

        // Handle any remaining stragglers by adding them to the last groups
        while (availableStudents.length > 0) {
            const straggler = availableStudents.shift();
            // Add to the smallest squad
            const smallestSquad = squads.reduce((prev, curr) => prev.members.length < curr.members.length ? prev : curr);
            smallestSquad.members.push({
                ...straggler,
                role: 'average' // Default role for extras
            });
        }

        return squads;

    } catch (error) {
        console.error("Error generating squads:", error);
        throw error;
    }
};

/**
 * Helper to determine role within the formed group.
 * Simple logic: Highest grade = Mentor, Lowest = Apprentice, Others = Average.
 */
const determineRole = (student, groupMembers) => {
    // Sort group by grade
    const sorted = [...groupMembers].sort((a, b) => b.grade_average - a.grade_average);
    if (student.id === sorted[0].id) return 'mentor';
    if (student.id === sorted[sorted.length - 1].id) return 'apprentice';
    return 'average';
};

/**
 * Saves the generated squads to the database.
 */
export const saveSquadsToDB = async (squads, schoolId) => {
    for (const squad of squads) {
        // 1. Create Squad
        const { data: squadData, error: squadError } = await supabase
            .from('squads')
            .insert({
                name: squad.name,
                subject: squad.subject,
                school_id: schoolId,
                weekly_goal: 'Completar 5 ejercicios colaborativos'
            })
            .select()
            .single();

        if (squadError) throw squadError;

        // 2. Add Members
        const membersData = squad.members.map(m => ({
            squad_id: squadData.id,
            student_id: m.id,
            role: m.role
        }));

        const { error: membersError } = await supabase
            .from('squad_members')
            .insert(membersData);

        if (membersError) throw membersError;
    }
};
