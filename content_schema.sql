-- CONTENT MANAGEMENT SCHEMA
-- Hierarchy Level 4 & 5: Units and Content Blocks

-- 1. UNITS TABLE (e.g., "Unidad 1: Números Reales", "Semana 4")
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0, -- To sort units (1, 2, 3...)
  is_published BOOLEAN DEFAULT FALSE, -- Draft mode
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CONTENT BLOCKS TABLE (e.g., "PDF Guía", "Video YouTube", "Texto Explicativo")
-- We use a JSONB 'content' column to be flexible (store URLs, text, quiz IDs, etc.)
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'video', 'pdf', 'link', 'quiz')),
  data JSONB NOT NULL DEFAULT '{}', -- Stores { url: "...", text: "..." }
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS POLICIES

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- UNITS POLICIES

-- Student: READ ONLY if they are enrolled in the subject (via enrollment -> classroom -> subject)
-- AND if unit is published.
CREATE POLICY "Student View Units" ON units
  FOR SELECT USING (
    is_published = true 
    AND EXISTS (
      SELECT 1 FROM subjects s
      JOIN enrollments e ON e.classroom_id = s.classroom_id
      WHERE s.id = units.subject_id
      AND e.student_id = auth.uid()
    )
  );

-- Teacher: FULL ACCESS if they belong to the School of the subject
CREATE POLICY "Teacher Manage Units" ON units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM subjects s
      JOIN profiles p ON p.school_id = s.school_id
      WHERE s.id = units.subject_id
      AND p.id = auth.uid()
      AND p.role IN ('profesor', 'superadmin')
    )
  );

-- CONTENT BLOCKS POLICIES

-- Student: READ ONLY (Inherits logic from Unit)
CREATE POLICY "Student View Content" ON content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN subjects s ON s.id = u.subject_id
      JOIN enrollments e ON e.classroom_id = s.classroom_id
      WHERE u.id = content_blocks.unit_id
      AND u.is_published = true
      AND e.student_id = auth.uid()
    )
  );

-- Teacher: FULL ACCESS (Inherits logic from Unit)
CREATE POLICY "Teacher Manage Content" ON content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN subjects s ON s.id = u.subject_id
      JOIN profiles p ON p.school_id = s.school_id
      WHERE u.id = content_blocks.unit_id
      AND p.id = auth.uid()
      AND p.role IN ('profesor', 'superadmin')
    )
  );

-- HELPER INDEXES
CREATE INDEX IF NOT EXISTS idx_units_subject ON units(subject_id);
CREATE INDEX IF NOT EXISTS idx_content_unit ON content_blocks(unit_id);
