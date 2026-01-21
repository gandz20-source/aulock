-- MODULE EVOLUTION SCHEMA
-- Features: Academic Stage, University Partner, Custom Slots

-- 1. Academic Stage Enum
DO $$ BEGIN
    CREATE TYPE academic_stage_enum AS ENUM ('SCHOOL', 'PRE_U', 'UNIVERSITY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add column to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS academic_stage academic_stage_enum DEFAULT 'SCHOOL';

-- 3. Custom Slots (For Malla Parser results)
CREATE TABLE IF NOT EXISTS public.custom_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    professor_name TEXT,
    schedule_summary TEXT,
    analyzed_from_file BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Custom Slots
ALTER TABLE public.custom_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own slots" ON public.custom_slots;
CREATE POLICY "Users manage own slots" ON public.custom_slots
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Initial University Users (Optional: Update for testing)
-- UPDATE profiles SET academic_stage = 'UNIVERSITY' WHERE email = 'contacto@aulock.cl';
