-- FIX DATA MISMATCH
-- This script aligns the Teacher's School ID with the Subjects' School ID.

DO $$
DECLARE
  v_target_school_id UUID;
BEGIN
  -- 1. Get the School ID from the 'Matemáticas' subject (since we know that one exists and works)
  SELECT school_id INTO v_target_school_id FROM subjects WHERE name = 'Matemáticas' LIMIT 1;
  
  -- 2. Update the Teacher to belong to THAT school
  -- This ensures the RLS Policy "Tenant Isolation" allows them to see the data.
  UPDATE profiles 
  SET school_id = v_target_school_id
  WHERE role = 'profesor'
  AND id = (SELECT id FROM profiles WHERE role = 'profesor' ORDER BY updated_at DESC LIMIT 1);
  
  RAISE NOTICE 'Profesor movido a la escuela correcta: %', v_target_school_id;
  
END $$;
