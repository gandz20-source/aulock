-- FINAL ROLE UPDATE SCRIPT
-- Run this in Supabase SQL Editor to fix permissions for your specific users.

-- 1. Profesor (084f319b-e321-43e1-82ef-b5a4c036db46)
UPDATE public.profiles 
SET role = 'profesor' 
WHERE id = '084f319b-e321-43e1-82ef-b5a4c036db46';

-- 2. Alumno (32751c81-48b4-4373-8608-92b2cb329d3c)
UPDATE public.profiles 
SET role = 'alumno' 
WHERE id = '32751c81-48b4-4373-8608-92b2cb329d3c';

-- 3. Admin (7cd82b15-6993-4f49-9084-81c1c57567bb)
UPDATE public.profiles 
SET role = 'superadmin' 
WHERE id = '7cd82b15-6993-4f49-9084-81c1c57567bb';

-- Verification
SELECT email, role, full_name FROM public.profiles WHERE id IN (
    '084f319b-e321-43e1-82ef-b5a4c036db46',
    '32751c81-48b4-4373-8608-92b2cb329d3c',
    '7cd82b15-6993-4f49-9084-81c1c57567bb'
);
