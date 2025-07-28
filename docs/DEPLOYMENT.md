# 🚀 Guía de Despliegue en Vercel

## 📋 Prerrequisitos

### 1. Cuentas Necesarias
- ✅ **GitHub Account** - Para el código fuente
- ✅ **Vercel Account** - Para el despliegue
- ✅ **GitHub OAuth App** - Para autenticación
- ✅ **Base de datos PostgreSQL** - Supabase, Neon, o similar

### 2. Configuración Local Funcionando
- ✅ Proyecto corriendo en `http://localhost:3000`
- ✅ Base de datos configurada y migraciones aplicadas
- ✅ Autenticación con GitHub funcionando localmente
- ✅ Pruebas pasando: `npm test`

## 🔧 Configuración Previa al Despliegue

### 1. Configurar GitHub OAuth App

#### Crear OAuth App en GitHub:
1. Ve a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Completa los campos:
   \`\`\`
   Application name: Mi Proyecto Financiero
   Homepage URL: https://tu-dominio.vercel.app
   Authorization callback URL: https://tu-dominio.vercel.app/api/auth/callback/github
   \`\`\`
3. Guarda el `Client ID` y `Client Secret`

#### Para desarrollo local también configura:
\`\`\`
Authorization callback URL: http://localhost:3000/api/auth/callback/github
\`\`\`

### 2. Preparar Base de Datos

#### Opción A: Supabase (Recomendado)
1. Crea proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > Database
3. Copia la `Connection String` (modo Direct connection)
4. Ejecuta las migraciones:
   \`\`\`bash
   npm run db:push
   \`\`\`

#### Opción B: Neon
1. Crea proyecto en [Neon](https://neon.tech)
2. Copia la connection string
3. Aplica migraciones

#### Opción C: Railway/PlanetScale
Similar proceso, obtén la connection string y aplica migraciones.

### 3. Generar Secretos

#### Better Auth Secret:
\`\`\`bash
# Generar clave secreta aleatoria
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

## 🚀 Despliegue en Vercel

### Método 1: Desde GitHub (Recomendado)

#### 1. Conectar Repositorio
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Importa tu repositorio de GitHub
4. Selecciona "Next.js" como framework

#### 2. Configurar Variables de Entorno
En la sección "Environment Variables" agrega **UNA POR UNA**:

**Variables de Base de Datos:**
\`\`\`
Name: DATABASE_URL
Value: postgresql://usuario:password@host:5432/database
Environment: Production, Preview, Development
\`\`\`

**Variables de GitHub OAuth:**
\`\`\`
Name: GITHUB_CLIENT_ID
Value: tu_github_client_id
Environment: Production, Preview, Development
\`\`\`

\`\`\`
Name: GITHUB_CLIENT_SECRET
Value: tu_github_client_secret
Environment: Production, Preview, Development
\`\`\`

**Variables de Autenticación:**
\`\`\`
Name: BETTER_AUTH_SECRET
Value: tu_clave_secreta_generada_de_32_caracteres
Environment: Production, Preview, Development
\`\`\`

\`\`\`
Name: NEXT_PUBLIC_BETTER_AUTH_URL
Value: https://tu-dominio.vercel.app
Environment: Production, Preview
\`\`\`

\`\`\`
Name: NEXT_PUBLIC_BETTER_AUTH_URL
Value: http://localhost:3000
Environment: Development
\`\`\`

**Variables de Supabase (Opcional):**
\`\`\`
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://tu-proyecto.supabase.co
Environment: Production, Preview, Development
\`\`\`

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: tu_supabase_anon_key
Environment: Production, Preview, Development
\`\`\`

#### 3. Deploy
1. Click "Deploy"
2. Espera a que termine el build
3. Vercel te dará una URL como `https://mi-proyecto-abc123.vercel.app`

### Método 2: Vercel CLI

#### 1. Instalar Vercel CLI
\`\`\`bash
npm i -g vercel
\`\`\`

#### 2. Login y Deploy
\`\`\`bash
# Login a Vercel
vercel login

# Deploy desde el directorio del proyecto
vercel

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
vercel env add BETTER_AUTH_SECRET
vercel env add NEXT_PUBLIC_BETTER_AUTH_URL

# Para producción
vercel --prod
\`\`\`

## 🔧 Configuración Post-Despliegue

### 1. Actualizar GitHub OAuth App
1. Ve a tu OAuth App en GitHub
2. Actualiza las URLs:
   \`\`\`
   Homepage URL: https://tu-dominio-real.vercel.app
   Authorization callback URL: https://tu-dominio-real.vercel.app/api/auth/callback/github
   \`\`\`

### 2. Actualizar Variables de Entorno
1. En Vercel Dashboard > Settings > Environment Variables
2. Actualiza `NEXT_PUBLIC_BETTER_AUTH_URL` con tu dominio real
3. Redeploy el proyecto

### 3. Configurar Dominio Personalizado (Opcional)
1. En Vercel Dashboard > Settings > Domains
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones
4. Actualiza las URLs de GitHub OAuth

## ⚠️ Solución de Problemas Comunes

### Error: "Environment Variable references Secret which does not exist"

**Problema:** Vercel no puede encontrar los secretos referenciados.

**Solución:**
1. **NO uses** referencias a secretos como `@database_url` en `vercel.json`
2. **Configura las variables directamente** en Vercel Dashboard
3. **Elimina** la sección `env` del `vercel.json`

### Error: "Build failed"

**Problema:** El build falla durante el despliegue.

**Solución:**
1. Verifica que `npm run build` funciona localmente
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que todas las variables de entorno están configuradas

### Error: "Database connection failed"

**Problema:** No se puede conectar a la base de datos.

**Solución:**
1. Verifica que `DATABASE_URL` está correctamente configurada
2. Asegúrate de que la base de datos acepta conexiones externas
3. Verifica que las migraciones se aplicaron

### Error: "GitHub OAuth failed"

**Problema:** La autenticación con GitHub no funciona.

**Solución:**
1. Verifica que `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` están configurados
2. Actualiza las URLs de callback en GitHub OAuth App
3. Verifica que `NEXT_PUBLIC_BETTER_AUTH_URL` apunta al dominio correcto

## ✅ Verificación del Despliegue

### 1. Pruebas Básicas
- [ ] ✅ Página principal carga correctamente
- [ ] ✅ Navegación funciona
- [ ] ✅ Estilos se aplican correctamente

### 2. Autenticación
- [ ] ✅ Botón "Iniciar sesión con GitHub" aparece
- [ ] ✅ Redirección a GitHub funciona
- [ ] ✅ Callback de GitHub funciona
- [ ] ✅ Usuario se autentica correctamente
- [ ] ✅ Menú de usuario aparece después del login

### 3. Funcionalidades Core
- [ ] ✅ Dashboard carga con datos del usuario
- [ ] ✅ Página de transacciones funciona
- [ ] ✅ Formularios de transacciones (solo admin)
- [ ] ✅ Página de perfil muestra información correcta

### 4. Funcionalidades Admin
- [ ] ✅ Panel de administración accesible solo para admins
- [ ] ✅ Gestión de usuarios funciona
- [ ] ✅ Reportes se generan correctamente
- [ ] ✅ Exportación CSV funciona

### 5. Seguridad y Permisos
- [ ] ✅ Usuarios no autenticados son redirigidos
- [ ] ✅ Usuarios regulares no pueden acceder a admin
- [ ] ✅ API endpoints respetan permisos
- [ ] ✅ Sesiones persisten correctamente

### 6. API y Documentación
- [ ] ✅ `/api-docs` carga correctamente
- [ ] ✅ Documentación OpenAPI es accesible
- [ ] ✅ Endpoints de API responden correctamente

## 🐛 Troubleshooting

### Errores Comunes

#### 1. Error de Build
\`\`\`bash
# Verificar que el build funciona localmente
npm run build

# Revisar logs en Vercel Dashboard > Functions > View Function Logs
\`\`\`

#### 2. Error de Base de Datos
\`\`\`bash
# Verificar connection string
# Asegurar que la base de datos está accesible desde internet
# Verificar que las migraciones se aplicaron
\`\`\`

#### 3. Error de Autenticación
\`\`\`bash
# Verificar URLs de callback en GitHub OAuth App
# Verificar variables de entorno en Vercel
# Revisar logs de función en Vercel
\`\`\`

#### 4. Error 500 en API Routes
\`\`\`bash
# Revisar logs en Vercel Dashboard
# Verificar que todas las variables de entorno están configuradas
# Verificar que la base de datos está accesible
\`\`\`

### Logs y Debugging

#### Ver Logs en Tiempo Real:
\`\`\`bash
vercel logs tu-dominio.vercel.app
\`\`\`

#### Logs en Dashboard:
1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Ve a "Functions" tab
4. Click en cualquier función para ver logs

## 🔄 CI/CD y Actualizaciones

### Despliegue Automático
Vercel automáticamente:
- ✅ Despliega cada push a `main` branch
- ✅ Crea preview deployments para PRs
- ✅ Ejecuta builds y tests
- ✅ Actualiza el dominio de producción

### Configurar Branch Protection
1. En GitHub: Settings > Branches
2. Agregar regla para `main`:
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

### Rollback
Si algo sale mal:
\`\`\`bash
# Ver deployments
vercel ls

# Hacer rollback a deployment anterior
vercel rollback [deployment-url]
\`\`\`

## 📊 Monitoreo y Analytics

### Vercel Analytics
1. En Vercel Dashboard > Analytics
2. Habilitar Web Analytics
3. Ver métricas de performance

### Error Monitoring
Considera integrar:
- **Sentry** - Para tracking de errores
- **LogRocket** - Para session replay
- **Vercel Speed Insights** - Para performance

## 🔒 Seguridad en Producción

### Variables de Entorno
- ✅ Nunca commitear secrets al repositorio
- ✅ Usar variables de entorno para todos los secrets
- ✅ Rotar secrets regularmente
- ✅ Usar diferentes secrets para dev/staging/prod

### Headers de Seguridad
Vercel automáticamente agrega headers de seguridad, pero puedes personalizar en `next.config.js`:

\`\`\`javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
\`\`\`

## 📈 Performance

### Optimizaciones Automáticas de Vercel
- ✅ Edge Network global
- ✅ Automatic HTTPS
- ✅ Image Optimization
- ✅ Static file caching
- ✅ Serverless functions

### Optimizaciones Adicionales
- ✅ Next.js Image component para imágenes
- ✅ Dynamic imports para code splitting
- ✅ ISR (Incremental Static Regeneration) donde sea apropiado

## 🎯 Checklist Final

### Pre-Deploy
- [ ] ✅ Código en GitHub
- [ ] ✅ Tests pasando localmente
- [ ] ✅ Build exitoso localmente
- [ ] ✅ Variables de entorno documentadas
- [ ] ✅ Base de datos configurada
- [ ] ✅ GitHub OAuth App configurada

### Deploy
- [ ] ✅ Proyecto importado en Vercel
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Build exitoso en Vercel
- [ ] ✅ Dominio asignado

### Post-Deploy
- [ ] ✅ URLs actualizadas en GitHub OAuth
- [ ] ✅ Funcionalidades probadas
- [ ] ✅ Permisos verificados
- [ ] ✅ Performance verificada
- [ ] ✅ Documentación actualizada

---

**¡Tu aplicación está lista para producción! 🎉**

\`\`\`

```plaintext file=".env.example"
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/mi_proyecto"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="tu_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_supabase_anon_key"

# GitHub OAuth
GITHUB_CLIENT_ID="tu_github_client_id"
GITHUB_CLIENT_SECRET="tu_github_client_secret"

# Better Auth
BETTER_AUTH_SECRET="una_clave_secreta_muy_larga_y_segura_de_al_menos_32_caracteres"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Para producción en Vercel
# NEXT_PUBLIC_BETTER_AUTH_URL="https://tu-dominio.vercel.app"

# IMPORTANTE: En Vercel, configura estas variables directamente en:
# Dashboard > Settings > Environment Variables
# NO uses referencias a secretos como @database_url