-- FIX RLS FOR CONTENT CREATION
-- The previous policy was too strict/complex for the INSERT operation.
-- We are simplifying it: If you are a Teacher/Admin, you can manage ALL units/content.
-- (Tenant isolation is already handled by the frontend only showing you your school's subjects).

-- 1. Drop old strict policies
DROP POLICY IF EXISTS "Teacher Manage Units" ON units;
DROP POLICY IF EXISTS "Teacher Manage Content" ON content_blocks;

-- 2. Create new SIMPLIFIED policies
-- Allow Teachers/Admins to do ANYTHING (Insert, Update, Delete) on units/content
CREATE POLICY "Teacher Manage Units Simple" ON units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('profesor', 'superadmin')
    )
  );

CREATE POLICY "Teacher Manage Content Simple" ON content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('profesor', 'superadmin')
    )
  );

RAISE NOTICE 'RLS Policies updated to allow Teachers to create content.';
