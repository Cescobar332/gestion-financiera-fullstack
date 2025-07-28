# 💰 Mi Proyecto - Sistema de Gestión Financiera

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/mi-proyecto-nextjs)
[![Tests](https://github.com/tu-usuario/mi-proyecto-nextjs/actions/workflows/test.yml/badge.svg)](https://github.com/tu-usuario/mi-proyecto-nextjs/actions/workflows/test.yml)

> **🌐 Demo en vivo**: [https://gestion-financiera-fullstack.vercel.app](https://gestion-financiera-fullstack.vercel.app)

## 📋 Descripción

Sistema integral de gestión financiera desarrollado con **Next.js 14** y **TypeScript**, que permite a usuarios y administradores gestionar transacciones financieras, generar reportes avanzados y controlar accesos mediante un sistema robusto de roles y permisos.

### ✨ Características Principales

- 🔐 **Autenticación Segura** - OAuth con GitHub
- 💳 **Gestión de Transacciones** - CRUD completo de ingresos y egresos
- 👥 **Sistema de Roles** - Control granular USER/ADMIN
- 📊 **Reportes Avanzados** - Gráficos y estadísticas en tiempo real
- 📄 **Exportación CSV** - Descarga de datos financieros
- 🔒 **Seguridad Robusta** - Middleware de autorización y validación
- 📚 **API Documentada** - Especificación OpenAPI/Swagger completa
- 🧪 **Testing Completo** - Cobertura >70% con Jest y RTL
- 📱 **Responsive Design** - Optimizado para todos los dispositivos

## 🚀 Demo y Funcionalidades

### 🎯 Flujo de Usuario Completo

1. **Autenticación**: Login seguro con GitHub OAuth
2. **Dashboard**: Vista general de estadísticas financieras
3. **Transacciones**: Visualización de ingresos y egresos
4. **Perfil**: Gestión de información personal
5. **Admin Panel**: Gestión de usuarios y reportes (solo administradores)

### 👤 Roles y Permisos

#### Usuario Regular (USER)
- ✅ Ver sus propias transacciones
- ✅ Acceder a su perfil y dashboard
- ✅ Consultar documentación de API
- ❌ Crear/editar/eliminar transacciones
- ❌ Ver panel de administración

#### Administrador (ADMIN)
- ✅ **Todas las funcionalidades de USER**
- ✅ Gestionar todas las transacciones (CRUD)
- ✅ Administrar usuarios del sistema
- ✅ Generar y exportar reportes
- ✅ Acceso completo al panel de administración

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - React framework con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **Shadcn/UI** - Componentes de interfaz modernos
- **Lucide React** - Iconografía consistente

### Backend
- **Next.js API Routes** - Endpoints REST
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos relacional
- **Supabase** - Backend as a Service

### Autenticación & Seguridad
- **GitHub OAuth** - Proveedor de autenticación
- **Sesiones HTTP-only** - Manejo seguro de estado
- **Middleware de autorización** - Control de acceso granular
- **Validación exhaustiva** - Sanitización de datos

### Testing & Calidad
- **Jest** - Framework de pruebas unitarias
- **React Testing Library** - Testing de componentes
- **ESLint + Prettier** - Linting y formateo
- **TypeScript strict mode** - Verificación de tipos

## 📦 Instalación Local

### Prerrequisitos
- **Node.js 18+** 
- **PostgreSQL** (local o remoto)
- **Cuenta GitHub** (para OAuth)
- **Git**

### 1. Clonar el Repositorio
\`\`\`bash
git clone https://github.com/Cescobar332/gestion-financiera-fullstack.git
cd gestion-financiera-fullstack
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno

Crea el archivo `.env.local` basado en `.env.example`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Completa las variables requeridas:

\`\`\`env
# Base de datos PostgreSQL
DATABASE_URL='postgres://postgres.jpvhprtxwlhdurznrtui:UAvAVcxxhnxpqIkj@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require'

# GitHub OAuth (crear en https://github.com/settings/applications/new)
GITHUB_CLIENT_ID="Ov23liHDv7tOc9LlNmEH"
GITHUB_CLIENT_SECRET="d65344b6c59df2c1ca19b2cccab20a77d21fe4c3"

# Clave secreta para autenticación (generar aleatoria de 32+ caracteres)
BETTER_AUTH_SECRET="d8c1ae963d0de58b871683c6b425b103d4f60065f938a09c24d7a0f22cc76689"
# URL base de la aplicación
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_supabase_anon_key"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
\`\`\`

### 4. Configurar GitHub OAuth

1. Ve a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Crea una nueva OAuth App:
   \`\`\`
   Application name: Mi Proyecto Financiero (Dev)
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   \`\`\`
3. Copia el `Client ID` y `Client Secret` a tu `.env.local`

### 5. Configurar Base de Datos

#### Opción A: PostgreSQL Local
\`\`\`bash
# Instalar PostgreSQL y crear base de datos
createdb mi_proyecto

# Aplicar migraciones
npm run db:generate
npm run db:push
#### Opción B: Supabase (Recomendado)
1. Crea proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > Database
3. Copia la Connection String
4. Aplica migraciones:
   \`\`\`bash
   npm run db:generate
   npm run db:push
   \`\`\`

### 6. Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

🎉 **¡Aplicación disponible en [http://localhost:3000](http://localhost:3000)!**

### 7. Verificar Instalación

\`\`\`bash
# Ejecutar pruebas
npm test

# Verificar build de producción
npm run build
\`\`\`

## 🚀 Despliegue en Vercel

### Despliegue Rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/mi-proyecto-nextjs)

### Despliegue Manual

#### 1. Preparar Repositorio
\`\`\`bash
# Asegurar que el código está en GitHub
git add .
git commit -m "Preparar para despliegue"
git push origin main
\`\`\`

#### 2. Configurar en Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:

\`\`\`env
DATABASE_URL='postgres://postgres.jpvhprtxwlhdurznrtui:UAvAVcxxhnxpqIkj@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require'



# GitHub OAuth
GITHUB_CLIENT_ID="Ov23liHDv7tOc9LlNmEH"
GITHUB_CLIENT_SECRET="d65344b6c59df2c1ca19b2cccab20a77d21fe4c3"

# Better Auth
BETTER_AUTH_SECRET="d8c1ae963d0de58b871683c6b425b103d4f60065f938a09c24d7a0f22cc76689"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

\`\`\`

#### 3. Actualizar GitHub OAuth
1. Ve a tu OAuth App en GitHub
2. Actualiza las URLs:
   \`\`\`
   Homepage URL: https://tu-dominio.vercel.app
   Authorization callback URL: https://tu-dominio.vercel.app/api/auth/callback/github
   \`\`\`

#### 4. Deploy
1. Click "Deploy" en Vercel
2. Espera a que termine el build
3. ¡Tu aplicación estará disponible en la URL proporcionada!

### Verificación Post-Despliegue

#### ✅ Checklist de Funcionalidades

**Básicas:**
- [ ] Página principal carga correctamente
- [ ] Navegación funciona en todos los dispositivos
- [ ] Estilos se aplican correctamente

**Autenticación:**
- [ ] Botón "Iniciar sesión con GitHub" funciona
- [ ] Proceso de OAuth completo funciona
- [ ] Usuario se autentica y ve su información
- [ ] Cerrar sesión funciona correctamente

**Funcionalidades Core:**
- [ ] Dashboard muestra estadísticas del usuario
- [ ] Página de transacciones carga datos
- [ ] Perfil de usuario muestra información correcta
- [ ] Navegación entre páginas funciona

**Administración (solo para usuarios ADMIN):**
- [ ] Panel de administración es accesible
- [ ] Gestión de usuarios funciona
- [ ] Creación/edición de transacciones funciona
- [ ] Generación de reportes funciona
- [ ] Exportación CSV funciona

**Seguridad:**
- [ ] Usuarios no autenticados son redirigidos
- [ ] Usuarios regulares no pueden acceder a funciones admin
- [ ] API endpoints respetan permisos
- [ ] Sesiones persisten correctamente

**API y Documentación:**
- [ ] `/api-docs` carga la documentación
- [ ] Endpoints de API responden correctamente
- [ ] Especificación OpenAPI es accesible

## 🧪 Testing

### Ejecutar Pruebas

\`\`\`bash
# Todas las pruebas
npm test

# Modo watch para desarrollo
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
\`\`\`
# Para CI/CD
npm run test:ci

### Cobertura de Pruebas
El proyecto mantiene **>70% de cobertura** en:
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

### Tipos de Pruebas Implementadas

- ✅ **Cálculos Financieros** - Lógica de balances y estadísticas
- ✅ **Validación de Formularios** - Reglas de negocio y sanitización
- ✅ **Control de Acceso** - Permisos y roles de usuario
- ✅ **Componentes React** - Renderizado e interacciones
- ✅ **Casos Límite** - Manejo de errores y datos inválidos

## 📚 Documentación

### API Documentation
- **Interfaz Web**: [/api-docs](https://mi-proyecto-financiero.vercel.app/api-docs)
- **Especificación JSON**: [/api/docs](https://mi-proyecto-financiero.vercel.app/api/docs)

### Documentación Técnica
- **Testing**: [docs/TESTING.md](docs/TESTING.md)
- **Despliegue**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Endpoints Principales

#### Autenticación
- `GET /api/auth/session` - Obtener sesión actual
- `POST /api/auth/signout` - Cerrar sesión

#### Transacciones
- `GET /api/transactions` - Listar transacciones
- `POST /api/transactions` - Crear transacción (Admin)
- `PUT /api/transactions/{id}` - Actualizar transacción (Admin)
- `DELETE /api/transactions/{id}` - Eliminar transacción (Admin)

#### Administración
- `GET /api/admin/users` - Gestión de usuarios (Admin)
- `PATCH /api/admin/users` - Actualizar usuario (Admin)
- `GET /api/admin/reports` - Reportes financieros (Admin)


## 🔧 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Aplicar cambios al esquema
npm run db:studio    # Abrir Prisma Studio

# Pruebas
npm test             # Ejecutar pruebas
npm run test:watch   # Pruebas en modo watch
npm run test:coverage # Pruebas con cobertura
npm run test:ci      # Pruebas para CI/CD
\`\`\`

## 🤝 Contribución

### Flujo de Desarrollo

1. **Fork** del repositorio
2. **Crear rama** feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** con pruebas incluidas
4. **Commit** cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
5. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
6. **Crear Pull Request**

### Estándares de Código
- ✅ **TypeScript strict mode**
- ✅ **ESLint + Prettier** configurados
- ✅ **Conventional Commits**
- ✅ **Pruebas unitarias** requeridas
- ✅ **Cobertura mínima** 70%

### Antes de Contribuir

\`\`\`bash
# Verificar que todo funciona
npm run lint
npm test
npm run build
\`\`\`

## 🐛 Troubleshooting

### Problemas Comunes

#### Error de Autenticación
\`\`\`bash
# Verificar variables de entorno
echo $GITHUB_CLIENT_ID
echo $NEXT_PUBLIC_BETTER_AUTH_URL

# Verificar URLs de callback en GitHub OAuth App
\`\`\`

#### Error de Base de Datos
\`\`\`bash
# Verificar conexión
npm run db:studio

# Regenerar cliente Prisma
npm run db:generate
\`\`\`

#### Error de Build
\`\`\`bash
# Limpiar cache
rm -rf .next
npm run build
\`\`\`

### Obtener Ayuda

- 🐛 **Bugs**: [GitHub Issues](https://github.com/tu-usuario/mi-proyecto-nextjs/issues)
- 💬 **Preguntas**: [GitHub Discussions](https://github.com/tu-usuario/mi-proyecto-nextjs/discussions)
- 📧 **Soporte**: soporte@miproyecto.com

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para más detalles.

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] 📱 Aplicación móvil (React Native)
- [ ] 🔔 Notificaciones en tiempo real
- [ ] 🏦 Integración con bancos (Open Banking)
- [ ] 🤖 Análisis predictivo con IA
- [ ] 💱 Soporte para múltiples monedas
- [ ] 🏷️ Categorías personalizables
- [ ] 📊 Dashboard avanzado con más gráficos

### Mejoras Técnicas
- [ ] 🧪 Pruebas E2E con Playwright
- [ ] ⚡ Optimización de performance
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🌍 Internacionalización (i18n)
- [ ] 📴 Modo offline
- [ ] 🔍 Búsqueda avanzada
- [ ] 📈 Analytics y métricas

## 🌟 Agradecimientos

- **Next.js Team** - Por el excelente framework
- **Vercel** - Por la plataforma de despliegue
- **Shadcn** - Por los componentes de UI
- **Prisma Team** - Por el ORM excepcional
- **GitHub** - Por la plataforma de desarrollo

---

<div align="center">

**🚀 ¡Desarrollado con ❤️ usando Next.js y TypeScript!**

[🌐 Demo](https://mi-proyecto-financiero.vercel.app) • [📚 Docs](https://mi-proyecto-financiero.vercel.app/api-docs) • [🐛 Issues](https://github.com/tu-usuario/mi-proyecto-nextjs/issues) • [💬 Discussions](https://github.com/tu-usuario/mi-proyecto-nextjs/discussions)

</div>
\`\`\`

```plaintext file=".gitignore"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/migrations

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
