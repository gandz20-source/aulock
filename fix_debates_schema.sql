-- FIX DEBATES SCHEMA
-- Run this entire script to fix the missing table error.

-- 1. Create DEBATES table first (Parent table)
CREATE TABLE IF NOT EXISTS public.debates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  timer_seconds INTEGER DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create DEBATE_ARGUMENTS table (Child table)
CREATE TABLE IF NOT EXISTS public.debate_arguments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team TEXT NOT NULL, -- 'for', 'against'
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS and Policies for both
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate_arguments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for debates" ON debates FOR ALL USING (true);
CREATE POLICY "Enable all access for arguments" ON debate_arguments FOR ALL USING (true);
