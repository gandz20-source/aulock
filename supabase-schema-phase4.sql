-- AuLock Phase 4: Economy & Admin Schema

-- 1. Store Items Table
CREATE TABLE IF NOT EXISTS store_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  icon TEXT, -- Emoji or icon name
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Redemptions Table
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES store_items(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Policies

-- Store Items: Everyone can read, only Admins/Teachers can manage (simplified for prototype: everyone reads)
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view store items"
  ON store_items FOR SELECT
  USING (true);

-- Redemptions: 
-- Students can insert their own requests and view them
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create redemptions"
  ON redemptions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own redemptions"
  ON redemptions FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers/Admins can view and update all redemptions
CREATE POLICY "Teachers can view all redemptions"
  ON redemptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );

CREATE POLICY "Teachers can update redemptions"
  ON redemptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('profesor', 'superadmin')
    )
  );

-- 4. Seed Data for Store Items (Generic items for all schools for now)
INSERT INTO store_items (name, cost, icon, description) VALUES
('Décima', 100, '📝', 'Una décima extra para la próxima evaluación.'),
('Permiso de Baño', 50, '🚽', 'Permiso para ir al baño durante la clase.'),
('Snack Saludable', 200, '🍎', 'Un snack saludable en el recreo.'),
('Elegir Música', 150, '🎵', 'Elige una canción para escuchar al final de la clase.');
