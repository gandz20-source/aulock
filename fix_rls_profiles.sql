-- FIX RLS POLICIES FOR PROFILES
-- Run this script in Supabase SQL Editor to unblock profile reading.

-- OPTION 1: DISABLE RLS (NUCLEAR OPTION - FOR DIAGNOSIS)
-- Uncomment the next line if you want to completely disable security checks to confirm the issue.
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- OPTION 2: CORRECT CONFIGURATION (RECOMMENDED)
-- First, ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any potentially conflicting policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- CREATE READ POLICY (CRITICAL FIX)
-- This allows the app to fetch the 'role' field.
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- CREATE UPDATE POLICY
-- Allows users to update their own data (like avatar or coins)
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- CREATE INSERT POLICY
-- Essential for registration
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- VERIFICATION
-- After running, try logging in again.
