-- SEED DATA SCRIPT
-- Run this in Supabase SQL Editor to visualize the "Squads" interface.

-- 1. Create a Demo Squad
INSERT INTO public.squads (id, name, subject)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Squad Alpha (Demo)', 'Programación Avanzada')
ON CONFLICT (id) DO NOTHING;

-- 2. Add Student as Member (Using the ID you provided: 32751...)
INSERT INTO public.squad_members (squad_id, student_id, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '32751c81-48b4-4373-8608-92b2cb329d3c', 'Líder')
ON CONFLICT (squad_id, student_id) DO NOTHING;

-- 3. Add a Demo Message
INSERT INTO public.squad_messages (squad_id, sender_id, content)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '32751c81-48b4-4373-8608-92b2cb329d3c', '¡Hola equipo! El sistema S.O.S. está activo.')
ON CONFLICT DO NOTHING;

-- Verification
SELECT * FROM public.squads;
