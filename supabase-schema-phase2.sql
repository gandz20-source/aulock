-- AuLock Phase 2: Live Classroom Schema

-- 1. Add AuCoins to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS au_coins INTEGER DEFAULT 0;

-- 2. Create Active Sessions table (for Realtime sync)
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  current_question JSONB, -- Stores the full question object
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Student Answers table
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES active_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for active_sessions

-- Teachers can manage their own sessions
CREATE POLICY "Teachers can manage their own sessions"
  ON active_sessions FOR ALL
  USING (teacher_id = auth.uid());

-- Students can view active sessions (to subscribe)
-- In a real app, we might restrict this to the student's school/class
CREATE POLICY "Students can view active sessions"
  ON active_sessions FOR SELECT
  USING (true); 

-- 6. RLS Policies for student_answers

-- Students can insert their own answers
CREATE POLICY "Students can insert their own answers"
  ON student_answers FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Teachers can view answers for their sessions
CREATE POLICY "Teachers can view answers for their sessions"
  ON student_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM active_sessions
      WHERE active_sessions.id = student_answers.session_id
      AND active_sessions.teacher_id = auth.uid()
    )
  );

-- 7. Realtime Setup
-- Enable Realtime for active_sessions table
-- Note: This usually needs to be done in the Supabase Dashboard > Database > Replication
-- But we can try to enable it via SQL if the publication exists
-- ALTER PUBLICATION supabase_realtime ADD TABLE active_sessions;
