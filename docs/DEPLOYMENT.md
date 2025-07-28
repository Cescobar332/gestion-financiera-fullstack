# Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar la aplicación Next.js en Vercel paso a paso.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [GitHub](https://github.com)
- ✅ Base de datos PostgreSQL (Supabase/Neon recomendado)
- ✅ Código subido a un repositorio de GitHub

## 🚀 Pasos de Despliegue

### 1. Preparar el Repositorio

\`\`\`bash
# Asegúrate de que todos los cambios estén committeados
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
\`\`\`

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js

### 3. Configurar Variables de Entorno

**⚠️ IMPORTANTE**: Configura las variables directamente en Vercel Dashboard, NO uses referencias a secretos.

Ve a **Project Settings** → **Environment Variables** y agrega:

#### Variables Requeridas:

\`\`\`env
# Base de datos
DATABASE_URL=postgresql://usuario:password@host:puerto/database

# Autenticación GitHub
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret

# Better Auth
BETTER_AUTH_SECRET=tu_secret_de_32_caracteres_minimo
NEXT_PUBLIC_BETTER_AUTH_URL=https://tu-dominio.vercel.app

# Next.js
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=otro_secret_de_32_caracteres
\`\`\`

#### Para cada variable:
1. Haz clic en "Add New"
2. Ingresa el **Name** y **Value**
3. Selecciona los entornos: **Production**, **Preview**, **Development**
4. Haz clic en "Save"

### 4. Configurar GitHub OAuth App

1. Ve a GitHub → Settings → Developer settings → OAuth Apps
2. Haz clic en "New OAuth App"
3. Completa:
   - **Application name**: Mi Proyecto Financiero
   - **Homepage URL**: `https://tu-dominio.vercel.app`
   - **Authorization callback URL**: `https://tu-dominio.vercel.app/api/auth/callback/github`
4. Copia el **Client ID** y **Client Secret** a las variables de Vercel

### 5. Configurar Base de Datos

#### Opción A: Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings → Database
4. Copia la **Connection String** (URI)
5. Úsala como `DATABASE_URL` en Vercel

#### Opción B: Neon
1. Ve a [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la **Connection String**
4. Úsala como `DATABASE_URL` en Vercel

### 6. Ejecutar Migraciones

Después del primer despliegue, ejecuta las migraciones:

\`\`\`bash
# Localmente con la URL de producción
DATABASE_URL="tu_database_url_de_produccion" npx prisma db push
\`\`\`

O usa el script SQL directamente en tu base de datos:

\`\`\`sql
-- Ejecuta el contenido de scripts/init-database.sql
-- en tu consola de base de datos
\`\`\`

### 7. Desplegar

1. Haz clic en **"Deploy"** en Vercel
2. Espera a que termine el build
3. Si hay errores, revisa los logs en la pestaña **"Functions"**

## 🔧 Solución de Problemas Comunes

### Error: "Environment Variable references Secret which does not exist"

**Solución**: No uses referencias como `@database_url`. Configura las variables directamente:

❌ **Incorrecto**:
\`\`\`json
{
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
\`\`\`

✅ **Correcto**: Configurar directamente en Vercel Dashboard

### Error: "Failed to collect page data"

**Causa**: Problema de conexión a base de datos durante el build.

**Solución**:
1. Verifica que `DATABASE_URL` esté configurada correctamente
2. Asegúrate de que la base de datos esté accesible
3. Revisa que las migraciones se hayan ejecutado

### Error: "GitHub OAuth not working"

**Solución**:
1. Verifica que las URLs de callback sean correctas
2. Asegúrate de que `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` estén configurados
3. Revisa que `NEXT_PUBLIC_BETTER_AUTH_URL` apunte al dominio correcto

### Error: "Prisma Client not found"

**Solución**:
\`\`\`bash
# Regenerar el cliente Prisma
npx prisma generate
git add .
git commit -m "Regenerar Prisma client"
git push
\`\`\`

## 📊 Verificación Post-Despliegue

### Checklist de Verificación:

- [ ] ✅ La aplicación carga correctamente
- [ ] ✅ El login con GitHub funciona
- [ ] ✅ Se pueden crear transacciones
- [ ] ✅ Los reportes se generan correctamente
- [ ] ✅ El panel de administrador es accesible
- [ ] ✅ La documentación API funciona en `/api-docs`

### URLs Importantes:

- **Aplicación**: `https://tu-dominio.vercel.app`
- **API Docs**: `https://tu-dominio.vercel.app/api-docs`
- **Admin Panel**: `https://tu-dominio.vercel.app/admin/users`

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

\`\`\`bash
git add .
git commit -m "Descripción de cambios"
git push origin main
\`\`\`

Vercel desplegará automáticamente los cambios.

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel Dashboard → Functions
2. Verifica las variables de entorno
3. Consulta la documentación de [Vercel](https://vercel.com/docs)
4. Revisa la configuración de la base de datos

---

¡Tu aplicación debería estar funcionando correctamente en producción! 🎉
\`\`\`

```plaintext file=".env.example"
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/mi_proyecto"

# Autenticación GitHub OAuth
GITHUB_CLIENT_ID="tu_github_client_id"
GITHUB_CLIENT_SECRET="tu_github_client_secret"

# Better Auth - Generar con: openssl rand -base64 32
BETTER_AUTH_SECRET="tu_secret_de_32_caracteres_minimo"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Next.js Auth (opcional, para compatibilidad)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="otro_secret_de_32_caracteres"

# Configuración de desarrollo
NODE_ENV="development"

# IMPORTANTE PARA VERCEL:
# NO uses referencias como @database_url en vercel.json
# Configura estas variables directamente en Vercel Dashboard:
# Project Settings → Environment Variables
