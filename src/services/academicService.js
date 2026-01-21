import { supabase } from '../config/supabase';

/**
 * Academic Service
 * Handles fetching data related to the student's academic life
 * (Subjects, Grades, Classrooms)
 */
export const academicService = {

    /**
     * Get all subjects the current user is enrolled in.
     * RLS policies automatically filter this to only show:
     * 1. Subjects from the user's school
     * 2. Subjects linked to a classroom the user is enrolled in
     */
    getMySubjects: async () => {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .select('*')
                .order('name');

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching subjects:', error);
            return { data: null, error };
        }
    },

    getTeacherSubjects: async () => {
        // PROTOTYPE: Fetch ALL subjects for the school (RLS filters by school_id automatically)
        const { data, error } = await supabase
            .from('subjects')
            .select(`
                *,
                classrooms (
                    name,
                    grades ( name )
                )
            `)
            .order('created_at');

        return { data, error };
    },

    getSubjectUnits: async (subjectId) => {
        const { data, error } = await supabase
            .from('units')
            .select(`
                *,
                content_blocks (*)
            `)
            .eq('subject_id', subjectId)
            .order('order_index', { ascending: true });

        // Sort content blocks per unit manually if needed, or use order logic in frontend
        if (data) {
            data.forEach(unit => {
                if (unit.content_blocks) {
                    unit.content_blocks.sort((a, b) => a.order_index - b.order_index);
                }
            });
        }

        return { data, error };
    },

    createUnit: async (unitData) => {
        const { data, error } = await supabase
            .from('units')
            .insert(unitData)
            .select()
            .single();
        return { data, error };
    },

    createContentBlock: async (blockData) => {
        const { data, error } = await supabase
            .from('content_blocks')
            .insert(blockData)
            .select()
            .single();
        return { data, error };
    },

    toggleUnitPublish: async (unitId, isPublished) => {
        const { data, error } = await supabase
            .from('units')
            .update({ is_published: isPublished })
            .eq('id', unitId)
            .select()
            .single();
        return { data, error };
    }
};


