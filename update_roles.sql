-- INSTRUCTIONS:
-- 1. Go to Supabase > Authentication > Users
-- 2. Click "Copy User UID" for each user (Teacher, Student, Admin)
-- 3. Replace the text 'PEGA_AQUI_...' below with the actual UUIDs
-- 4. Run this in the SQL Editor

-- Set Teacher Role
UPDATE public.profiles 
SET role = 'profesor' 
WHERE id = 'PEGA_AQUI_EL_ID_DEL_PROFESOR'; 

-- Set Student Role
UPDATE public.profiles 
SET role = 'alumno' 
WHERE id = 'PEGA_AQUI_EL_ID_DEL_ALUMNO'; 

-- Set Admin Role
UPDATE public.profiles 
SET role = 'superadmin' 
WHERE id = 'PEGA_AQUI_EL_ID_DEL_ADMIN'; 

-- Verification: Show all users and their roles
SELECT email, role, full_name FROM public.profiles;
