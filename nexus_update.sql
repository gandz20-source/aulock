-- NEXUS COMMAND CENTER SCHEMA UPDATE
-- Features: Attempts Analytics, Vocational Module, Game Switch

-- 1. UTILS: Attempt Analytics
-- Add tracking columns to student_answers
ALTER TABLE public.student_answers 
ADD COLUMN IF NOT EXISTS attempt_count INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS time_spent INT DEFAULT 0; -- In seconds

-- 2. FEATURE: Vocational Module
-- Table to store global career requirements (e.g., 'Medicine' needs High Empathy & Logic)
CREATE TABLE IF NOT EXISTS public.career_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_name TEXT NOT NULL UNIQUE,
    description TEXT,
    required_logic INT DEFAULT 0,
    required_creativity INT DEFAULT 0,
    required_resilience INT DEFAULT 0,
    required_communication INT DEFAULT 0,
    required_empathy INT DEFAULT 0,
    required_ethics INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to link students to their vocational progress/interests
CREATE TABLE IF NOT EXISTS public.vocational_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest_area TEXT, -- e.g., 'STEM', 'Arts', 'Humanities'
    target_career_id UUID REFERENCES public.career_requirements(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.career_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocational_profiles ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for demo)
-- Policies (Idempotent: Drop first to avoid errors)
DROP POLICY IF EXISTS "Public read careers" ON public.career_requirements;
CREATE POLICY "Public read careers" ON public.career_requirements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users read own vocational" ON public.vocational_profiles;
CREATE POLICY "Users read own vocational" ON public.vocational_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own vocational" ON public.vocational_profiles;
CREATE POLICY "Users update own vocational" ON public.vocational_profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers read all vocational" ON public.vocational_profiles;
CREATE POLICY "Teachers read all vocational" ON public.vocational_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('profesor', 'superadmin'))
);

-- 3. FEATURE: Game Switch (Guardian)
-- Global toggle to enable/disable games per school
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS games_enabled BOOLEAN DEFAULT TRUE;

-- Insert some default careers for testing
INSERT INTO public.career_requirements (career_name, required_logic, required_creativity, required_resilience, required_communication, required_empathy, required_ethics)
VALUES 
('Ingeniería de Software', 85, 70, 80, 50, 40, 60),
('Medicina', 90, 40, 95, 85, 90, 100),
('Diseño Gráfico', 40, 95, 60, 75, 70, 50),
('Derecho', 85, 50, 80, 95, 60, 90)
ON CONFLICT (career_name) DO NOTHING;
