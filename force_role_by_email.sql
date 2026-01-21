-- FORCE ROLE BY EMAIL
-- Replace 'tu_email@ejemplo.com' with your actual email login.

UPDATE public.profiles
SET role = 'profesor'
WHERE email = 'PON_TU_EMAIL_AQUI';

-- Verify the change
SELECT email, role FROM public.profiles WHERE email = 'PON_TU_EMAIL_AQUI';
