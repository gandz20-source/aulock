-- SCRIPT: Update Roles by ID
-- NOTE: Please ensure the IDs below are correct UUIDs from Supabase.
-- If 'profe', 'alumno', 'admin' are just placeholders, replace them with the real UUIDs (e.g., 'a0eebc99...').

-- 1. Update Professor
UPDATE public.profiles 
SET role = 'profesor' 
WHERE id = 'profe'; -- REPLACE 'profe' WITH REAL UUID IF NEEDED

-- 2. Update Student
UPDATE public.profiles 
SET role = 'alumno' 
WHERE id = 'alumno'; -- REPLACE 'alumno' WITH REAL UUID IF NEEDED

-- 3. Update Admin
UPDATE public.profiles 
SET role = 'superadmin' 
WHERE id = 'admin'; -- REPLACE 'admin' WITH REAL UUID IF NEEDED

-- 4. Verify
SELECT * FROM public.profiles WHERE id IN ('profe', 'alumno', 'admin');
