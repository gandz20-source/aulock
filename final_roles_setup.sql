-- FINAL DB SETUP FOR ROLES
-- Run this in Supabase SQL Editor

-- 1. Create PROFILES table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT 'Usuario',
  role TEXT DEFAULT 'alumno', -- 'profesor', 'alumno'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

-- 4. RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- 5. Trigger to Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nuevo Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'alumno')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger to be safe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Add "au_coins" column if missing (for Store feature)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS au_coins INTEGER DEFAULT 0;
