# Reporte de Estado de Salud - AuLock Nexus

## 1. Chequeo de Base de Datos
*   **Estado:** **Estable y Consistente**.
*   **Conexión:** El proyecto utiliza Supabase (no Prisma), por lo que la conexión se gestiona vía cliente HTTP (`@supabase/supabase-js`).
*   **Esquema:**
    *   **User Table:** SI existe. Supabase maneja los usuarios en la tabla interna `auth.users`.
    *   **Profiles Table:** SI existe (definida en `supabase-schema.sql`). Extiende `auth.users` y contiene los campos esperados: `id`, `email`, `role` (enum: 'alumno', 'profesor', 'superadmin'), `school_id`, `full_name`.
    *   **Coincidencia:** El código en `AuthContext.jsx` realiza consultas (`select('*, schools(name)')`) que coinciden plenamente con la estructura definida en los archivos SQL.
    *   **Conclusión:** No hay discrepancias de esquema que causen errores de "Failed to create user" por falta de columnas.

## 2. Auditoría de Variables de Entorno
*   **DATABASE_URL:** 🔴 **UNDEFINED** (Falta en `.env`).
    *   *Impacto:* Crítico si se planea usar Prisma o conexiones de servidor. Para el cliente actual de Vite/Supabase no es bloqueante, pero **es la razón por la que cualquier script de backend fallaría**.
*   **NEXTAUTH_SECRET:** 🔴 **UNDEFINED** (Falta en `.env`).
    *   *Impacto:* El proyecto actual usa Vite + React Router + Supabase Auth directo. **NO usa NextAuth**, por lo que esta variable no es necesaria para la arquitectura actual. Si se planea migrar a Next.js, es mandatoria.
*   **VITE_OPENAI_API_KEY:** ⚠️ **WARNING** (Presente pero Placeholder).
    *   Valor actual: `your_openai_api_key`.
    *   *Impacto:* Las funciones de IA (Chat, Campus) **fallarán** hasta que se ponga una llave real.
*   **VITE_SUPABASE_URL / ANON_KEY:** ✅ **CORRECTO**. Cargadas correctamente.

## 3. Detección de Bucles (Routing)
*   **Middleware:** No existe middleware de servidor (Vite App).
*   **Router Principal (`src/App.jsx`):**
    *   Usa `DashboardRouter` para redirigir según el rol (`profile.role`).
    *   **Riesgo Detectado:** Si un usuario tiene un rol válido pero la ruta destino (`/app/student-dashboard`) falla en `ProtectedRoute`, podría ser enviado a `/login`.
    *   **Veredicto sobre `/nexus`:** Añadir una ruta `/nexus` **ES SEGURO**, siempre que se añada explícitamente en `src/App.jsx`. No hay lógica de "catch-all" agresiva que cause bucles infinitos inmediatos, ya que el redireccionamiento por defecto (`*`) va a `/` (Landing Page).

## 4. Punto de Guardado (Lista de No Tocar)
Para garantizar que la Landing Page y el Login actual sigan funcionando, **NO MODIFICAR** los siguientes archivos sin respaldo previo:

1.  `c:\Users\GONZALO\aulocktracker\aulock-tracker\src\App.jsx` (Lógica central de rutas).
2.  `c:\Users\GONZALO\aulocktracker\aulock-tracker\src\context\AuthContext.jsx` (Gestión de sesión y perfiles).
3.  `c:\Users\GONZALO\aulocktracker\aulock-tracker\src\pages\LandingPage.jsx` (Tu Landing Page recién desplegada).
4.  `c:\Users\GONZALO\aulocktracker\aulock-tracker\src\pages\LandingPage.css` (Estilos de la Landing).
5.  `c:\Users\GONZALO\aulocktracker\aulock-tracker\src\components\ProtectedRoute.jsx` (Seguridad de rutas).

---
**Recomendación Inmediata:**
Antes de expandir a 'AuLock Nexus', **debes definir las variables de entorno faltantes (`DATABASE_URL`, `OPENAI_API_KEY`)** si planeas funcionalidad de backend real o IA. Para el frontend actual, el sistema es estable.
