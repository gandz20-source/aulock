-- 1. CLEANUP (To ensure a fresh start)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. CREATE TABLES
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('alumno', 'profesor', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

CREATE TABLE IF NOT EXISTS public.qr_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 3. INSERT DEFAULT SCHOOL (Required for the trigger)
INSERT INTO schools (name) 
SELECT 'Colegio Demo AuLock' 
WHERE NOT EXISTS (SELECT 1 FROM schools);

-- 4. CREATE TRIGGER FUNCTION (Robust version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  target_school_id UUID;
  user_full_name TEXT;
  user_auth_role user_role;
BEGIN
  -- Get school ID (fail-safe)
  SELECT id INTO target_school_id FROM public.schools LIMIT 1;
  
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario Nuevo');
  
  -- Determine role safely
  BEGIN
    user_auth_role := (NEW.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN OTHERS THEN
    user_auth_role := 'alumno';
  END;

  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    COALESCE(user_auth_role, 'alumno'),
    target_school_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ACTIVATE TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
