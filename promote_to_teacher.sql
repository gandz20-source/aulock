-- 1. Create Teacher Profile (Mock Login) or Promote existing
-- This script upgrades a user to 'profesor' role for testing OR updates password.

-- OPTION A: If you want to use the current 'alumno' user as login but swap roles:
-- UPDATE profiles SET role = 'profesor' WHERE email = 'alumno@aulock.cl';

-- OPTION B: Create/Update a dedicated Teacher User
-- Ideally you should have a second user. For now, let's just ensuring we have a user with role 'profesor'.

DO $$
DECLARE
  v_school_id UUID;
BEGIN
  -- Get Default School
  SELECT id INTO v_school_id FROM schools WHERE domain = 'default' LIMIT 1;
  
  -- Insert a mock teacher profile if it doesn't exist (this assumes the AUTH user exists in Supabase Auth underneath, 
  -- but we can't create Auth users from SQL easily without admin functions. 
  -- SO: The easiest way is to UPDATE your current user profile temporarily to 'profesor' to test).

  -- We will just update the 'role' of your currently logged-in user (found by email or just the latest one)
  -- ADJUST THIS EMAIL to your login email if known, or just update the last created user.
  
  -- CAUTION: This will temporarily make you a teacher. You can switch back to 'alumno' later.
  UPDATE profiles 
  SET role = 'profesor', school_id = v_school_id
  WHERE id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1);
  
END $$;
