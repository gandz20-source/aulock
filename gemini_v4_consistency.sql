-- GEMINI V4 CONSISTENCY FIX
-- Adds specific XP columns and tier_level to profiles.

-- 1. Add 'tier_level' for routing logic (SCHOOL vs UNI vs PRO)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tier_level TEXT DEFAULT 'SCHOOL';

-- 2. Add explicit XP columns (Synced with 'stats' JSONB via triggers in future if needed, but adding as request)
-- Note: 'stats' JSONB is flexible, but having columns allows easier strict typing if V4 requires it.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS critical_thinking_xp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS deep_work_xp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS problem_solving_xp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS dialectic_xp NUMERIC DEFAULT 0;

-- 3. Update 'update_human_core_xp' RPC to ALSO update these columns if present in JSON
-- This ensures backward compatibility with the JSON service sending these keys.
CREATE OR REPLACE FUNCTION update_human_core_xp(user_id UUID, xp_updates JSONB)
RETURNS VOID AS $$
DECLARE
  key TEXT;
  val NUMERIC;
  current_val NUMERIC;
BEGIN
  -- A. Update the JSONB 'stats' (Flexible Storage) - RETAINING EXISTING LOGIC
  FOR key, val IN SELECT * FROM jsonb_each_text(xp_updates)
  LOOP
    SELECT COALESCE((stats ->> key)::NUMERIC, 0) INTO current_val
    FROM public.profiles
    WHERE id = user_id;

    UPDATE public.profiles
    SET stats = jsonb_set(
        COALESCE(stats, '{}'::jsonb), 
        array[key], 
        to_jsonb(current_val + val)
    )
    WHERE id = user_id;
  END LOOP;

  -- B. Update Specific Columns (Hard Schema) - NEW FOR V4
  -- We explicitly check for the 4 critical keys and update columns if they exist in the update payload.
  
  -- Critical Thinking
  IF xp_updates ? 'critical_thinking_xp' THEN
      UPDATE public.profiles 
      SET critical_thinking_xp = COALESCE(critical_thinking_xp, 0) + (xp_updates->>'critical_thinking_xp')::NUMERIC
      WHERE id = user_id;
  END IF;

  -- Deep Work
  IF xp_updates ? 'deep_work_xp' THEN
      UPDATE public.profiles 
      SET deep_work_xp = COALESCE(deep_work_xp, 0) + (xp_updates->>'deep_work_xp')::NUMERIC
      WHERE id = user_id;
  END IF;

  -- Problem Solving
  IF xp_updates ? 'problem_solving_xp' THEN
      UPDATE public.profiles 
      SET problem_solving_xp = COALESCE(problem_solving_xp, 0) + (xp_updates->>'problem_solving_xp')::NUMERIC
      WHERE id = user_id;
  END IF;

  -- Dialectic
  IF xp_updates ? 'dialectic_xp' THEN
      UPDATE public.profiles 
      SET dialectic_xp = COALESCE(dialectic_xp, 0) + (xp_updates->>'dialectic_xp')::NUMERIC
      WHERE id = user_id;
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
