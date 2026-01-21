-- FULL CONTENT MIGRATION (Tablas + Policies)
-- Ejecuta esto para crear las tablas 'units' y 'content_blocks' que faltan.

-- 1. TABLA UNITS
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA CONTENT_BLOCKS
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'video', 'pdf', 'link', 'quiz')),
  data JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SEGURIDAD (RLS)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas viejas si existen
DROP POLICY IF EXISTS "Teacher Manage Units" ON units;
DROP POLICY IF EXISTS "Teacher Manage Content" ON content_blocks;
DROP POLICY IF EXISTS "Teacher Manage Units Simple" ON units;
DROP POLICY IF EXISTS "Teacher Manage Content Simple" ON content_blocks;
DROP POLICY IF EXISTS "Student View Units" ON units;
DROP POLICY IF EXISTS "Student View Content" ON content_blocks;

-- Política Profesor (Permiso Total)
CREATE POLICY "Teacher Manage Units Simple" ON units
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('profesor', 'superadmin'))
  );

CREATE POLICY "Teacher Manage Content Simple" ON content_blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('profesor', 'superadmin'))
  );

-- Política Alumno (Solo Lectura y Solo Publicado)
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

-- Indexado para velocidad
CREATE INDEX IF NOT EXISTS idx_units_subject ON units(subject_id);
CREATE INDEX IF NOT EXISTS idx_content_unit ON content_blocks(unit_id);
