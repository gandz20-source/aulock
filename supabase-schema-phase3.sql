-- AuLock Phase 3: AI Assistants Schema

-- 1. Create Alerts table (for Guardián system)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'bullying', 'depression', 'other'
  content TEXT NOT NULL, -- The message that triggered the alert
  status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for alerts

-- Students can insert their own alerts (triggered by system)
-- Ideally this would be "service role only" if we had a backend, 
-- but for client-side prototype we allow insert
CREATE POLICY "System can insert alerts for students"
  ON alerts FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Teachers and SuperAdmins can view all alerts
CREATE POLICY "Teachers can view alerts"
  ON alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );

-- Teachers can update alerts (mark as read/resolved)
CREATE POLICY "Teachers can update alerts"
  ON alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );
