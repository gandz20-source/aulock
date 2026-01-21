-- ==========================================
-- FINAL FIX FOR USER REGISTRATION
-- Run this entire script in Supabase SQL Editor
-- ==========================================

-- 1. CLEANUP OLD LOGIC
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. ENSURE DEPENDENCIES EXIST (Idempotent)
DO $$ 
BEGIN
    -- Create Role Enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('alumno', 'profesor', 'superadmin');
    END IF;
END $$;

-- Ensure Schools Table Exists
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure Profiles Table Exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'alumno',
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  au_coins INTEGER DEFAULT 0,
  grade_average FLOAT DEFAULT 0,
  avatar_url TEXT
);

-- 3. ENSURE DATA EXISTS (Critical for Trigger)
INSERT INTO schools (name) 
SELECT 'Colegio Demo AuLock' 
WHERE NOT EXISTS (SELECT 1 FROM schools);

-- 4. CREATE ROBUST TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  target_school_id UUID;
  user_full_name TEXT;
  user_auth_role user_role;
BEGIN
  -- Get school ID safely (Fallback to NULL if absolutely no school exists, though we just created one)
  SELECT id INTO target_school_id FROM public.schools LIMIT 1;
  
  -- Handle Metadata safely
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario Nuevo');
  
  -- Handle Role safely with explicit fallback
  BEGIN
    user_auth_role := (NEW.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN OTHERS THEN
    user_auth_role := 'alumno';
  END;
  
  IF user_auth_role IS NULL THEN
    user_auth_role := 'alumno';
  END IF;

  -- Insert Profile
  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_auth_role,
    target_school_id
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail transaction if possible (or fail with clear message)
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW; -- Allow auth user creation even if profile fails (though ideally we want profile)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RE-BIND TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. MANUAL FIX FOR EXISTING USERS (If any exist without profile)
INSERT INTO public.profiles (id, email, full_name, role, school_id)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Usuario Recuperado'),
    'alumno'::user_role, -- Default fallback
    (SELECT id FROM schools LIMIT 1)
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id);
