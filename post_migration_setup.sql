-- POST-MIGRATION SETUP & SEEDING
-- Run this in Supabase SQL Editor

-- 1. CRITICAL: UPDATE SIGNUP TRIGGER
-- New users need a school_id, otherwise signup fails. We assign the default school.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_school_id UUID;
BEGIN
  -- Find the Default School (or the first one available)
  SELECT id INTO default_school_id FROM schools LIMIT 1;

  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'alumno'),
    default_school_id -- Now mandatory
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. SEED DEMO ACADEMIC DATA (Only if empty)
-- This ensures you have data to test the hierarchy immediately.

DO $$
DECLARE
  v_school_id UUID;
  v_grade_id UUID;
  v_classroom_id UUID;
BEGIN
  -- Get our default school
  SELECT id INTO v_school_id FROM schools LIMIT 1;

  -- A) Create a Grade: "1° Medio"
  INSERT INTO grades (name, school_id)
  VALUES ('1° Medio', v_school_id)
  ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_grade_id FROM grades WHERE name = '1° Medio' AND school_id = v_school_id LIMIT 1;

  -- B) Create a Classroom: "1° Medio A - 2025"
  INSERT INTO classrooms (name, year, grade_id, school_id)
  VALUES ('1° Medio A', 2025, v_grade_id, v_school_id)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_classroom_id FROM classrooms WHERE name = '1° Medio A' AND grade_id = v_grade_id LIMIT 1;

  -- C) Create Subjects linked to that Classroom
  INSERT INTO subjects (name, classroom_id, school_id)
  VALUES 
    ('Matemáticas', v_classroom_id, v_school_id),
    ('Historia', v_classroom_id, v_school_id),
    ('Lenguaje', v_classroom_id, v_school_id)
  ON CONFLICT DO NOTHING;

END $$;
