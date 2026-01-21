-- ==========================================
-- SCRIPT DE EMERGENCIA: DESBLOQUEO DE USUARIOS
-- ==========================================

-- 1. ELIMINAR EL TRIGGER BLOQUEANTE
-- Esto permitirá que el botón "Create User" funcione de nuevo.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

RAISE NOTICE 'Trigger eliminado. Ahora puedes crear el usuario en el panel.';

-- DESPUÉS DE EJECUTAR ESTO:
-- 1. Vuelve a "Authentication" -> "Users" y crea el usuario contacto@aulock.cl
-- 2. Una vez creado, vuelve aquí y ejecuta el bloque de abajo (seleccionalo y dale Run):

/*
-- BLOQUE 2: DAR PODERES DE SUPERADMIN (Ejecutar SOLO después de crear el usuario)
DO $$
DECLARE
  target_uid UUID;
BEGIN
  SELECT id INTO target_uid FROM auth.users WHERE email = 'contacto@aulock.cl';

  IF target_uid IS NOT NULL THEN
      INSERT INTO public.profiles (id, email, full_name, role)
      VALUES (target_uid, 'contacto@aulock.cl', 'Admin Supremo', 'superadmin')
      ON CONFLICT (id) DO UPDATE SET role = 'superadmin';
      RAISE NOTICE '¡Éxito! Usuario configurado como Superadmin.';
  ELSE
      RAISE NOTICE 'Error: No se encontró el usuario. Créalo primero en el panel.';
  END IF;
END $$;
*/
