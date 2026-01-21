-- ==========================================
-- SCRIPT DE REPARACIÓN DE ACCESO Y TRIGGERS
-- ==========================================

-- 1. REPARACIÓN DE PERFIL (contacto@aulock.cl)
-- Busca el usuario en auth.users e inserta/actualiza su perfil en public.profiles
DO $$
DECLARE
    target_email TEXT := 'contacto@aulock.cl';
    user_record auth.users%ROWTYPE;
BEGIN
    -- Buscar el usuario en la tabla de autenticación
    SELECT * INTO user_record FROM auth.users WHERE email = target_email;

    IF user_record.id IS NOT NULL THEN
        -- Insertar o actualizar el perfil
        INSERT INTO public.profiles (id, email, full_name, role)
        VALUES (
            user_record.id, 
            user_record.email, 
            COALESCE(user_record.raw_user_meta_data->>'full_name', 'Admin AuLock'), 
            'superadmin'
        )
        ON CONFLICT (id) DO UPDATE
        SET role = 'superadmin',
            email = EXCLUDED.email; -- Asegurar que el email esté sincronizado
            
        RAISE NOTICE 'Perfil reparado para: % (ID: %)', target_email, user_record.id;
    ELSE
        RAISE NOTICE 'Usuario % no encontrado en auth.users. Debes registrarlo primero.', target_email;
    END IF;
END $$;

-- 2. CONFIGURACIÓN ROBUSTA DEL TRIGGER (Root Cause Fix)
-- Eliminamos el trigger y funcion existentes para recrearlos desde cero y evitar errores
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear la función manejadora
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    -- Usar metadatos si existen, si no, valores por defecto seguros
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario Nuevo'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'alumno') -- Default a alumno
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email, -- Mantener email sincronizado
      updated_at = NOW();
      
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER es clave para que corra con permisos de admin

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE 'Trigger on_auth_user_created configurado exitosamente.';

-- 3. VERIFICACIÓN Y CORRECCIÓN DE POLÍTICAS RLS
-- Aseguramos que los usuarios puedan leer sus propios perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Borrar política existente para evitar duplicados/conflictos
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Crear política permisiva para lectura propia
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Crear política para que Superadmins vean todo (opcional pero recomendada)
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON public.profiles;
CREATE POLICY "SuperAdmins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

RAISE NOTICE 'Políticas RLS verificadas.';
