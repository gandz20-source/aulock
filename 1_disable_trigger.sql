-- STEP 1: PREPARE DATABASE
-- Run this in Supabase SQL Editor

-- 1. Delete the users if they exist partially (to start fresh)
DELETE FROM auth.users WHERE email IN ('profesor@aulock.cl', 'alumno@aulock.cl', 'admin@aulock.cl');

-- 2. DISABLE the automatic automation that is crashing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Ensure School Exists
INSERT INTO schools (name) 
SELECT 'Colegio Demo AuLock' 
WHERE NOT EXISTS (SELECT 1 FROM schools);
