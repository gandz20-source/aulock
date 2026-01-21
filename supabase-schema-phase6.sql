-- Phase 6: Squads (Collaborative Learning)

-- 1. Add grade_average to profiles if it doesn't exist (for ranking)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade_average NUMERIC DEFAULT 0;

-- 2. Create Squads Table
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL, -- e.g., 'Matemáticas', 'Historia'
  weekly_goal TEXT,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Squad Members Table
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'mentor', 'average', 'apprentice'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(squad_id, student_id) -- Prevent duplicate membership in same squad
);

-- 4. RLS Policies

-- Squads
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view squads"
  ON squads FOR SELECT
  USING (true); -- Simplified for prototype, ideally scoped to school

CREATE POLICY "Teachers can create squads"
  ON squads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );

-- Squad Members
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view squad members"
  ON squad_members FOR SELECT
  USING (true);

CREATE POLICY "Teachers can manage squad members"
  ON squad_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );
