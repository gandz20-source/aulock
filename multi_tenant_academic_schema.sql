-- MULTI-TENANT & ACADEMIC SCHEMA MIGRATION
-- Run this script in the Supabase SQL Editor

-- 1. SCHOOLS UPDATE (Hierarchy Level 1)
-- Check if columns exist to avoid errors on re-run
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'domain') THEN
        ALTER TABLE schools ADD COLUMN domain TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'school_code') THEN
        ALTER TABLE schools ADD COLUMN school_code TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'logo_url') THEN
        ALTER TABLE schools ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- 2. PROFILES UPDATE (Enforce Tenant)
-- Warning: If you have existing users with NULL school_id, this might fail unless we assign a default.
-- We will try to update specific constraints.

-- Ensure school_id is NOT NULL (Privacy enforcement)
-- FIX: Ensure there is at least one school to assign to orphans
INSERT INTO schools (name, domain, school_code)
VALUES ('Escuela Predeterminada', 'default', 'DEFAULT001')
ON CONFLICT DO NOTHING;

-- FIX: Assign all orphan profiles to the first available school
UPDATE profiles
SET school_id = (SELECT id FROM schools LIMIT 1)
WHERE school_id IS NULL;

-- Now we can enforce NOT NULL
ALTER TABLE profiles ALTER COLUMN school_id SET NOT NULL;


-- 3. ACADEMIC STRUCTURE (Hierarchy Level 2)

-- Grades Table (e.g., "1° Medio", "4° Básico")
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classrooms Table (e.g., "1° Medio B - 2025")
CREATE TABLE IF NOT EXISTS classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT extract(year from now()),
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE, -- Denormalized for easier RLS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments Table (Link User <-> Classroom)
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, classroom_id)
);


-- 4. CONTENT LEVEL (Hierarchy Level 3)

-- Subjects Table (e.g., "Matemáticas", "Historia")
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE, -- Denormalized for easier RLS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. ROW LEVEL SECURITY (RLS) - PRIVACY ENFORCEMENT

-- Enable RLS on all new tables
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- POLICY: TENANT ISOLATION (General)
-- A user can only see data belonging to their own school.

-- Grades
CREATE POLICY "Tenant Isolation: View Grades" ON grades
  FOR SELECT USING (
    school_id = (SELECT school_id FROM profiles WHERE id = auth.uid())
  );

-- Classrooms
CREATE POLICY "Tenant Isolation: View Classrooms" ON classrooms
  FOR SELECT USING (
    school_id = (SELECT school_id FROM profiles WHERE id = auth.uid())
  );

-- POLICY: ACADEMIC ACCESS (Strict)
-- A student can only see Subjects they are enrolled in (via Classroom).

-- Subjects (Tunnel Vision)
CREATE POLICY "Academic Access: Student View Subjects" ON subjects
  FOR SELECT USING (
    -- 1. Must be my school (Optimization)
    school_id = (SELECT school_id FROM profiles WHERE id = auth.uid())
    AND (
      -- 2. Must be enrolled in the classroom of this subject
      EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.student_id = auth.uid()
        AND e.classroom_id = subjects.classroom_id
      )
      OR
      -- 3. Exception for Teachers/Admins (View all subjects in their school)
      EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('profesor', 'superadmin')
      )
    )
  );

-- Enrollments (View own enrollments)
CREATE POLICY "View Own Enrollments" ON enrollments
  FOR SELECT USING (
    student_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('profesor', 'superadmin')
        AND p.school_id = (SELECT school_id FROM classrooms WHERE id = enrollments.classroom_id)
    )
  );

-- Helper Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_school ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_classroom ON enrollments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_subjects_classroom ON subjects(classroom_id);
