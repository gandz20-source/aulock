-- GET DEMO CREDENTIALS
-- Run this to see the email of your demo Student and Teacher users.

SELECT email, role, id, full_name 
FROM public.profiles 
WHERE role IN ('alumno', 'profesor')
LIMIT 5;
