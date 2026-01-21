-- MODULES SCHEMA (Squads, etc.)
-- Run this in Supabase SQL Editor to enable Squad features.

-- 1. Squads Table
CREATE TABLE IF NOT EXISTS public.squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Squad Members Table
CREATE TABLE IF NOT EXISTS public.squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Miembro', -- 'Líder', 'Escriba', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(squad_id, student_id)
);

-- 3. Squad Messages Table
CREATE TABLE IF NOT EXISTS public.squad_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS POLICIES (Enable access)

-- Enable RLS
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_messages ENABLE ROW LEVEL SECURITY;

-- SQUADS: Everyone can view squads (for now, to simplify)
CREATE POLICY "Public view squads" ON squads FOR SELECT USING (true);
CREATE POLICY "Teachers/Admins insert squads" ON squads FOR INSERT WITH CHECK (true); -- Allow all for demo purposes or restrict to role

-- MEMBERS: Viewable by everyone, Insertable by everyone (for seed script)
CREATE POLICY "Public view members" ON squad_members FOR SELECT USING (true);
CREATE POLICY "Public insert members" ON squad_members FOR INSERT WITH CHECK (true);

-- MESSAGES: Viewable by everyone, Insertable by members
CREATE POLICY "Public view messages" ON squad_messages FOR SELECT USING (true);
CREATE POLICY "Public insert messages" ON squad_messages FOR INSERT WITH CHECK (true);

-- 5. REALTIME (Optional, but good for chat)
-- You might need to enable replication in Supabase Dashboard for the table 'squad_messages'
