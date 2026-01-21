-- STEP 2: LINK PROFILES
-- Run this AFTER the setup tool says "Verification Needed" or "Success"

INSERT INTO public.profiles (id, email, full_name, role, school_id)
SELECT 
    id, 
    email, 
    CASE 
        WHEN email = 'profesor@aulock.cl' THEN 'Profesor User'
        WHEN email = 'alumno@aulock.cl' THEN 'Alumno User'
        WHEN email = 'admin@aulock.cl' THEN 'Admin User'
    END,
    CASE 
        WHEN email = 'profesor@aulock.cl' THEN 'profesor'::user_role
        WHEN email = 'alumno@aulock.cl' THEN 'alumno'::user_role
        WHEN email = 'admin@aulock.cl' THEN 'superadmin'::user_role
    END,
    (SELECT id FROM schools LIMIT 1)
FROM auth.users
WHERE email IN ('profesor@aulock.cl', 'alumno@aulock.cl', 'admin@aulock.cl')
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id);
