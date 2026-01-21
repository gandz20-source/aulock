-- Phase 7: Student Squad View

-- 1. Squad Messages (Private Chat)
CREATE TABLE IF NOT EXISTS squad_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Notifications (SOS & System)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Null if system
  type TEXT NOT NULL, -- 'sos', 'system', 'reward'
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Policies

-- Squad Messages
ALTER TABLE squad_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Squad members can view messages"
  ON squad_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM squad_members
      WHERE squad_members.squad_id = squad_messages.squad_id
      AND squad_members.student_id = auth.uid()
    )
  );

CREATE POLICY "Squad members can send messages"
  ON squad_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM squad_members
      WHERE squad_members.squad_id = squad_messages.squad_id
      AND squad_members.student_id = auth.uid()
    )
  );

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can create notifications (SOS)"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = sender_id); -- Or allow anyone to send to anyone for now
