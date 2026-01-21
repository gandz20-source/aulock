-- DIAGNOSTIC SCRIPT: Teacher Data Visibility
-- Run this to check why the teacher sees "No subjects"

-- 1. Check Schools
SELECT id, name, domain FROM schools;

-- 2. Check Subjects and their School IDs
SELECT s.name, s.school_id, sc.name as school_name 
FROM subjects s
JOIN schools sc ON s.school_id = sc.id;

-- 3. Check the Teacher Profile (The one you are likely logged in as)
-- We check the most recently updated "profesor" profile.
SELECT id, full_name, role, school_id 
FROM profiles 
WHERE role = 'profesor' 
ORDER BY updated_at DESC 
LIMIT 1;

-- 4. DIRECT TEST: Does the School ID match?
-- If this returns "MATCH", everything is good data-wise. If "MISMATCH", that's the bug.
WITH teacher AS (
    SELECT school_id FROM profiles WHERE role = 'profesor' ORDER BY updated_at DESC LIMIT 1
),
subject_sample AS (
    SELECT school_id FROM subjects LIMIT 1
)
SELECT 
    CASE 
        WHEN t.school_id = s.school_id THEN 'MATCH' 
        ELSE 'MISMATCH' 
    END AS status,
    t.school_id as teacher_school,
    s.school_id as subject_school
FROM teacher t, subject_sample s;
