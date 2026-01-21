-- FIX UUID MISMATCH & FORCE TEACHER
-- This script finds your ACTUAL Login ID and forces the profile to exist and be a teacher.

-- 1. Insert or Update Profile for the REAL Auth User
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  'Profesor (Restored)', 
  'profesor'
FROM auth.users
WHERE email = 'profesor@aulock.cl'  -- REEMPLAZA CON TU EMAIL SI ES DIFERENTE
ON CONFLICT (id) DO UPDATE
SET role = 'profesor', full_name = 'Profesor (Restored)';

-- 2. Verify what the system sees now
SELECT p.email, p.role, p.id, u.id as auth_id 
FROM public.profiles p
JOIN auth.users u ON p.email = u.email
WHERE p.email = 'profesor@aulock.cl';
