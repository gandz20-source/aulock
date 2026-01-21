-- ==========================================
-- SCRIPT FINAL: SUPERADMIN CON ESCUELA
-- ==========================================

DO $$
DECLARE
  target_uid UUID;
  default_school_id UUID;
BEGIN
  -- 1. Obtener ID del usuario (ya creado manualmnete)
  SELECT id INTO target_uid FROM auth.users WHERE email = 'contacto@aulock.cl';

  -- 2. Obtener (o crear) una escuela por defecto para asignarla
  -- Intentamos tomar la primera que exista, si no hay, creamos una.
  SELECT id INTO default_school_id FROM public.schools LIMIT 1;
  
  IF default_school_id IS NULL THEN
      INSERT INTO public.schools (name) VALUES ('AuLock HQ') RETURNING id INTO default_school_id;
  END IF;

  -- 3. Insertar Perfil Completo (con school_id)
  IF target_uid IS NOT NULL THEN
      INSERT INTO public.profiles (id, email, full_name, role, school_id)
      VALUES (
          target_uid, 
          'contacto@aulock.cl', 
          'Admin Supremo', 
          'superadmin', 
          default_school_id
      )
      ON CONFLICT (id) DO UPDATE 
      SET role = 'superadmin',
          school_id = EXCLUDED.school_id;
          
      RAISE NOTICE '¡Éxito! Admin configurado con School ID: %', default_school_id;
  ELSE
      RAISE NOTICE '❌ Error: Usuario contacto@aulock.cl no encontrado. Créalo en Authentication primero.';
  END IF;
END $$;
