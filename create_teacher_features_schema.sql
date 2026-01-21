-- TEACHER FEATURES SCHEMA
-- Run this in Supabase SQL Editor to enable Live Class, Store, Alerts, and Debates.

-- 1. ACTIVE SESSIONS (For Live Class)
CREATE TABLE IF NOT EXISTS public.active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  current_question JSONB, -- Stores the full question object { text, options, correct, timer }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENT ANSWERS
CREATE TABLE IF NOT EXISTS public.student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.active_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ALERTS (Guardian System)
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'SOS', 'Inactivity', 'Distraction'
  content TEXT,
  status TEXT DEFAULT 'unread', -- 'unread', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. STORE ITEMS
CREATE TABLE IF NOT EXISTS public.store_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  icon TEXT, -- Emoji or icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REDEMPTIONS (Store Purchases)
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.store_items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DEBATES (For Debate Arena Management)
CREATE TABLE IF NOT EXISTS public.debates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  timer_seconds INTEGER DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RPC: Increment AuCoins
CREATE OR REPLACE FUNCTION increment_au_coins(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET au_coins = COALESCE(au_coins, 0) + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. RLS POLICIES

ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;

-- Permissive policies for Demo (You can restrict these later)
CREATE POLICY "Public enable sections" ON active_sessions FOR ALL USING (true);
CREATE POLICY "Public enable answers" ON student_answers FOR ALL USING (true);
CREATE POLICY "Public enable alerts" ON alerts FOR ALL USING (true);
CREATE POLICY "Public enable store" ON store_items FOR ALL USING (true);
CREATE POLICY "Public enable redemptions" ON redemptions FOR ALL USING (true);
CREATE POLICY "Public enable debates" ON debates FOR ALL USING (true);

-- 9. SEED DEFAULT STORE ITEMS
INSERT INTO public.store_items (name, cost, icon) VALUES
('Pase al Baño', 50, '🧻'),
('Puntos Extra en Prueba', 500, '💯'),
('Elegir Música de Fondo', 100, '🎵'),
('Avatar Personalizado', 200, '👾')
ON CONFLICT DO NOTHING;
