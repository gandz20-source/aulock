-- ENROLL DATA FIX
-- Run this in Supabase SQL Editor to enroll your user

DO $$
DECLARE
  v_student_id UUID;
  v_classroom_id UUID;
BEGIN
  -- 1. Get the user ID (Hardcoded from your screenshot or dynamic if logged in context, 
  --    but here we pick the user with email 'alumno@aulock.cl' or similar that you are using)
  --    REPLACE 'alumno@aulock.cl' with the email you use to login if different.
  SELECT id INTO v_student_id FROM profiles WHERE role = 'alumno' LIMIT 1;

  -- 2. Get the Classroom ID (1° Medio A)
  SELECT id INTO v_classroom_id FROM classrooms WHERE name = '1° Medio A' LIMIT 1;

  IF v_student_id IS NOT NULL AND v_classroom_id IS NOT NULL THEN
      -- 3. Enroll the student
      INSERT INTO enrollments (student_id, classroom_id)
      VALUES (v_student_id, v_classroom_id)
      ON CONFLICT DO NOTHING;
      
      RAISE NOTICE 'Alumno matriculado exitosamente en 1° Medio A';
  ELSE
      RAISE NOTICE 'No se encontró alumno o clase. Verifica que existan.';
  END IF;
END $$;
