---
description: How to safely develop, test, and deploy changes without breaking production.
---

# Flujo de Trabajo Seguro (Safe Deployment Workflow)

Este flujo de trabajo permite realizar cambios, probarlos y, solo cuando estén listos, actualizarlos en la plataforma oficial (`aulock.cl`), evitando errores en vivo.

## Conceptos Clave

1.  **Rama `main` (Producción)**: Es la versión sagrada. Lo que hay aquí es lo que ven tus usuarios en `aulock.cl`. NUNCA trabajamos directamente aquí.
2.  **Rama `dev` (Desarrollo)**: Aquí es donde "ensuciamos las manos". Hacemos cambios, rompemos cosas y arreglamos.
3.  **Deployments de Vercel (Previews)**: Vercel crea automáticamente una URL única para cada cambio que hacemos (ej: `aulock-git-dev-usuario.vercel.app`). Esto sirve como tu "Entorno de Pruebas".

## Paso a Paso

### 1. Crear/Cambiar a Rama de Desarrollo
Siempre que empieces una nueva funcionalidad o arreglo, asegúrate de estar en una rama segura.

```powershell
# Ver en qué rama estás
git branch

# Crear y cambiar a una rama de desarrollo (si no existe)
git checkout -b dev

# O si ya existe, cambiar a ella
git checkout dev
```

### 2. Guardar tu Trabajo (Punto de Restauración)
Cada vez que logres algo que funcione, guárdalo. Esto es tu "Punto de Restauración".

```powershell
# Ver qué archivos cambiaste
git status

# Agregar todos los cambios
git add .

# Guardar con un mensaje descriptivo ("Commit")
git commit -m "Descripción de lo que arreglé o agregué"
```

### 3. Probar en la Nube (Sin afectar aulock.cl)
Para ver tus cambios online y probarlos en tu celular u otros PC sin tocar el sitio oficial:

```powershell
# Subir tus cambios a Vercel (Creará una URL de Preview)
npx vercel
```
*Vercel te preguntará si quieres desplegar. Dile que sí. Al final te dará una URL (ej: `https://aulock-tracker-8374gd.vercel.app`).*
**¡Esta URL es tu entorno de pruebas! Úsala para verificar todo.**

### 4. Lanzar a Producción (Actualizar aulock.cl)
Solo cuando hayas probado la URL del paso 3 y estés 100% seguro de que todo funciona:

```powershell
# Fusionar cambios a la rama principal
git checkout main
git merge dev

# Desplegar a Producción Oficial
npx vercel --prod
```
*Esto actualizará `aulock.cl`. Si algo falla, siempre puedes volver al "commit" anterior.*

## Resumen de Emergencia (Deshacer Cambios)
Si rompiste algo y quieres volver atrás:

```powershell
# Deshacer cambios en tu archivo actual (volver al último guardado)
git checkout -- src/App.jsx  (o el archivo que sea)
```
