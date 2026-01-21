-- DEBATE ARGUMENTS TABLE
-- Run this to enable the chat/arguments in Debate Arena

CREATE TABLE IF NOT EXISTS public.debate_arguments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team TEXT NOT NULL, -- 'for', 'against'
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE debate_arguments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for demo" ON debate_arguments FOR ALL USING (true);
