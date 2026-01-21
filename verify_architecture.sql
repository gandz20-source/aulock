-- VERIFICATION QUERIES
-- Run this to see your new School Hierarchy in action!

-- 1. Check the Academic Tree (School -> Grade -> Class -> Subject)
SELECT 
    s.name as "Colegio", 
    g.name as "Nivel", 
    c.name as "Sala/Curso", 
    sb.name as "Asignatura"
FROM schools s
JOIN grades g ON g.school_id = s.id
JOIN classrooms c ON c.grade_id = g.id
JOIN subjects sb ON sb.classroom_id = c.id;

-- 2. Check Users and their School
SELECT email, role, school_id FROM profiles LIMIT 5;
