-- MASTER SCHEMA FIX
-- Run this script to create ALL missing tables and fix the backend logic.

-- 1. SQUADS & MEMBERS
CREATE TABLE IF NOT EXISTS public.squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'mentor', 'apprentice'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.squad_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LIVE CLASS (Questions & Sessions)
-- This table matches what the frontend 'LiveClassroomContext' expects
CREATE TABLE IF NOT EXISTS public.active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  current_question JSONB, -- Stores the active question data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Persistent Question Bank (Requested by User)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  timer_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.active_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DEBATES
CREATE TABLE IF NOT EXISTS public.debates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  timer_seconds INTEGER DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.debate_arguments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team TEXT NOT NULL, -- 'for', 'against'
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ALERTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'SOS', etc.
  content TEXT,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STORE
CREATE TABLE IF NOT EXISTS public.store_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.store_items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RPC FUNCTION (AuCoins)
CREATE OR REPLACE FUNCTION increment_au_coins(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET au_coins = COALESCE(au_coins, 0) + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. ENABLE RLS (Security)
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- 8. GRANT POLICIES (Development Mode: Public Access)
-- IMPORTANT: This is for quick prototyping. Tighten these for production!
CREATE POLICY "Enable all for squads" ON squads FOR ALL USING (true);
CREATE POLICY "Enable all for squad_members" ON squad_members FOR ALL USING (true);
CREATE POLICY "Enable all for squad_messages" ON squad_messages FOR ALL USING (true);
CREATE POLICY "Enable all for active_sessions" ON active_sessions FOR ALL USING (true);
CREATE POLICY "Enable all for questions" ON questions FOR ALL USING (true);
CREATE POLICY "Enable all for student_answers" ON student_answers FOR ALL USING (true);
CREATE POLICY "Enable all for debates" ON debates FOR ALL USING (true);
CREATE POLICY "Enable all for debate_arguments" ON debate_arguments FOR ALL USING (true);
CREATE POLICY "Enable all for alerts" ON alerts FOR ALL USING (true);
CREATE POLICY "Enable all for notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Enable all for store_items" ON store_items FOR ALL USING (true);
CREATE POLICY "Enable all for redemptions" ON redemptions FOR ALL USING (true);
