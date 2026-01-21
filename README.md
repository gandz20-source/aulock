# 🎓 AuLock - Plataforma Educativa Progresiva

Una aplicación web progresiva (PWA) moderna para la gestión educativa con autenticación basada en roles y login por QR para estudiantes.

## ✨ Características

- 🔐 **Autenticación Multi-Rol**: Sistema de login diferenciado para Alumnos, Profesores y SuperAdmins
- 📱 **QR Login**: Acceso rápido para estudiantes mediante códigos QR únicos
- 🎨 **Diseño EdTech Moderno**: Interfaz limpia con paleta azul tecnológico y verde neón
- 📲 **PWA**: Instalable como app nativa con funcionalidad offline
- 🔒 **Seguridad**: Row Level Security (RLS) en Supabase para protección de datos
- ⚡ **Tiempo Real**: Base de datos en tiempo real con Supabase

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- Cuenta de Supabase (gratis)

### Instalación

1. **Clonar el repositorio** (o navegar al directorio del proyecto)

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Supabase**
   - Sigue las instrucciones detalladas en [SETUP.md](./SETUP.md)
   - Crea un proyecto en Supabase
   - Ejecuta el schema SQL
   - Configura las variables de entorno

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
aulock-tracker/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Rutas protegidas por rol
│   ├── config/
│   │   └── supabase.js            # Cliente de Supabase
│   ├── context/
│   │   └── AuthContext.jsx        # Contexto de autenticación
│   ├── pages/
│   │   ├── LandingPage.jsx        # Página de inicio
│   │   ├── Login.jsx              # Login email/password
│   │   ├── QRLogin.jsx            # Login por QR token
│   │   └── Dashboard.jsx          # Dashboards por rol
│   ├── App.jsx                    # Configuración de rutas
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── supabase-schema.sql            # Schema de base de datos
├── SETUP.md                       # Guía de configuración
└── vite.config.js                 # Configuración PWA
```

## 🎯 Roles de Usuario

### 👨‍🎓 Alumno
- Acceso mediante QR token
- URL: `/access?code=TOKEN`
- Dashboard personalizado para estudiantes

### 👨‍🏫 Profesor
- Login con email y contraseña
- Gestión de clases y estudiantes
- Generación de QR tokens

### 🛡️ SuperAdmin
- Login con email y contraseña
- Panel de administración completo
- Gestión de escuelas y usuarios

## 🔑 Autenticación

### Login Email/Password (Profesores y Admins)
```
URL: /login?role=profesor
URL: /login?role=superadmin
```

### Login QR Token (Alumnos)
```
URL: /access?code=UNIQUE_TOKEN
URL: /qr-login
```

## 🎨 Diseño

- **Tipografía**: Inter (Google Fonts)
- **Colores Primarios**: Azul Tecnológico (#2563eb)
- **Colores de Acento**: Verde Neón (#10b981)
- **Fondo**: Gris claro (#f8fafc)
- **Efectos**: Glassmorphism, gradientes suaves, micro-animaciones

## 🛠️ Tecnologías

- **Frontend**: React 19 + Vite
- **Estilos**: CSS personalizado (sin Tailwind en esta versión)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **PWA**: vite-plugin-pwa
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Mobile**: Capacitor (opcional)

## 📱 PWA

La aplicación es una Progressive Web App que puede:
- Instalarse en dispositivos móviles y desktop
- Funcionar offline (caché de recursos estáticos)
- Recibir actualizaciones automáticas

Para probar PWA:
```bash
npm run build
npm run preview
```

## 📲 App Móvil (Opcional)

Para compilar como app nativa Android:
```bash
npm run build
npm run cap:sync
npm run cap:open:android
```

Ver [MOBILE_BUILD.md](./MOBILE_BUILD.md) para más detalles.

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter
- `npm run cap:sync` - Sincronizar con Capacitor
- `npm run cap:open:android` - Abrir proyecto Android

## 📝 Próximas Fases

### Fase 2: Funcionalidad Core
- Dashboard completo para profesores
- Gestión de cursos y sesiones
- Estadísticas y reportes
- Generador de QR tokens

### Fase 3: Características Avanzadas
- Notificaciones en tiempo real
- Chat entre profesores y alumnos
- Sistema de tareas y evaluaciones
- Integración con calendario

## 🐛 Troubleshooting

Ver [SETUP.md](./SETUP.md) para solución de problemas comunes.

## 📄 Licencia

Proyecto privado - AuLock © 2025

## 🤝 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.
