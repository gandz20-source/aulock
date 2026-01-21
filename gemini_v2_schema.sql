-- GEMINI V2 INTEGRATION SCHEMA
-- Adds support for 'Human Core' stats, Mental Health alerts, and XP updates.

-- 1. Enable Stats in Profiles (Using JSONB for flexibility)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}'::jsonb;

-- 2. Mental Health Alerts Table
CREATE TABLE IF NOT EXISTS public.mental_health_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  flag TEXT NOT NULL, -- e.g., 'STRESS', 'ANXIETY', 'depression_risk'
  context TEXT, -- The user input or conversation context snippet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.mental_health_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Only Admins/Teachers can view alerts, System inserts them
CREATE POLICY "Admins/Teachers view alerts" 
  ON public.mental_health_alerts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );

CREATE POLICY "System inserts alerts" 
  ON public.mental_health_alerts FOR INSERT 
  WITH CHECK (true); -- Ideally restrict to service role, but 'true' for client-side trigger demo

-- 3. RPC: Update Human Core XP
-- This function takes a set of XP updates (e.g., {"creativity": 10, "logic": 5}) and adds them to the user's current stats.
CREATE OR REPLACE FUNCTION update_human_core_xp(user_id UUID, xp_updates JSONB)
RETURNS VOID AS $$
DECLARE
  key TEXT;
  val NUMERIC;
  current_val NUMERIC;
BEGIN
  -- Loop through each key in the input JSON
  FOR key, val IN SELECT * FROM jsonb_each_text(xp_updates)
  LOOP
    -- Get current value (default to 0 if missing)
    SELECT COALESCE((stats ->> key)::NUMERIC, 0) INTO current_val
    FROM public.profiles
    WHERE id = user_id;

    -- Update the specific key in the JSONB column
    UPDATE public.profiles
    SET stats = jsonb_set(
        COALESCE(stats, '{}'::jsonb), 
        array[key], 
        to_jsonb(current_val + val)
    )
    WHERE id = user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
