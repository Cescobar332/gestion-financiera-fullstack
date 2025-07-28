# Documentación de Pruebas Unitarias

## Descripción General

Este proyecto implementa un sistema completo de pruebas unitarias utilizando **Jest** y **React Testing Library** para garantizar la calidad y confiabilidad del código. Las pruebas cubren tanto la lógica de negocio como los componentes de la interfaz de usuario.

## Tecnologías Utilizadas

- **Jest**: Framework de pruebas principal
- **React Testing Library**: Para pruebas de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **@testing-library/user-event**: Simulación de interacciones de usuario

## Estructura de Pruebas

\`\`\`
__tests__/
├── lib/                          # Pruebas de lógica de negocio
│   ├── financial-calculations.test.ts
│   ├── form-validation.test.ts
│   └── access-control.test.ts
└── components/                   # Pruebas de componentes
    ├── transactions/
    │   └── transaction-form.test.tsx
    └── auth/
        └── user-menu.test.tsx
\`\`\`

## Configuración

### Jest Configuration (`jest.config.js`)

\`\`\`javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    '!pages/_app.tsx',
    '!pages/_document.tsx',
    '!pages/api/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(config)
\`\`\`

### Setup File (`jest.setup.js`)

- Configuración de `@testing-library/jest-dom`
- Mocks globales para Next.js router
- Mock de `fetch` global
- Mock de `window.location`

## Pruebas Implementadas

### 1. Cálculos Financieros (`financial-calculations.test.ts`)

**Funciones probadas:**
- `calculateBalance()` - Cálculo de saldo total
- `calculateTotalIncome()` - Total de ingresos
- `calculateTotalExpenses()` - Total de egresos
- `calculateFinancialStats()` - Estadísticas completas
- `filterTransactionsByPeriod()` - Filtrado por período

**Casos de prueba:**
- ✅ Cálculo correcto con transacciones mixtas
- ✅ Manejo de arrays vacíos
- ✅ Solo ingresos o solo egresos
- ✅ Montos decimales
- ✅ Validación de parámetros inválidos
- ✅ Manejo de errores

**Ejemplo:**
\`\`\`typescript
it('debe calcular correctamente el saldo con transacciones mixtas', () => {
  const balance = calculateBalance(mockTransactions)
  // Ingresos: 1000 + 2000 = 3000
  // Egresos: 500 + 300 = 800
  // Saldo: 3000 - 800 = 2200
  expect(balance).toBe(2200)
})
\`\`\`

### 2. Validación de Formularios (`form-validation.test.ts`)

**Funciones probadas:**
- `validateTransactionForm()` - Validación de formulario de transacciones
- `validateUserForm()` - Validación de formulario de usuarios
- `isValidEmail()` - Validación de email
- `validatePassword()` - Validación de contraseña

**Casos de prueba:**
- ✅ Formularios válidos
- ✅ Campos requeridos
- ✅ Longitud de campos
- ✅ Formatos específicos (email, teléfono)
- ✅ Rangos de valores
- ✅ Tipos de datos

**Ejemplo:**
\`\`\`typescript
it('debe fallar si el concepto es muy corto', () => {
  const data = { ...validTransactionData, concept: 'AB' }
  const result = validateTransactionForm(data)
  
  expect(result.isValid).toBe(false)
  expect(result.errors).toContain('El concepto debe tener al menos 3 caracteres')
})
\`\`\`

### 3. Control de Acceso (`access-control.test.ts`)

**Funciones probadas:**
- `hasRole()` - Verificación de roles
- `isAdmin()` - Verificación de administrador
- `isAuthenticated()` - Verificación de autenticación
- `canAccessResource()` - Permisos de recursos
- `canViewTransaction()` - Permisos de visualización
- `canModifyTransaction()` - Permisos de modificación
- `canAccessPage()` - Permisos de páginas

**Casos de prueba:**
- ✅ Roles de usuario (USER, ADMIN)
- ✅ Permisos por recurso
- ✅ Acceso a transacciones propias vs ajenas
- ✅ Páginas públicas vs protegidas
- ✅ Usuarios no autenticados

**Ejemplo:**
\`\`\`typescript
it('debe permitir a admin ver cualquier transacción', () => {
  expect(canViewTransaction(adminUser, 'other-user-id')).toBe(true)
  expect(canViewTransaction(adminUser, adminUser.id)).toBe(true)
})

it('debe permitir a usuario ver solo sus propias transacciones', () => {
  expect(canViewTransaction(regularUser, regularUser.id)).toBe(true)
  expect(canViewTransaction(regularUser, 'other-user-id')).toBe(false)
})
\`\`\`

### 4. Componente TransactionForm (`transaction-form.test.tsx`)

**Funcionalidades probadas:**
- Renderizado correcto del formulario
- Prellenado con datos existentes
- Validación de campos requeridos
- Envío de formulario
- Manejo de estados de carga
- Manejo de errores

**Casos de prueba:**
- ✅ Renderizado de elementos del formulario
- ✅ Modo creación vs edición
- ✅ Prellenado de datos
- ✅ Interacciones de usuario
- ✅ Validación de formulario
- ✅ Estados de carga y error

### 5. Componente UserMenu (`user-menu.test.tsx`)

**Funcionalidades probadas:**
- Renderizado según estado de autenticación
- Información del usuario
- Enlaces de navegación
- Permisos de administrador
- Avatar y fallbacks

**Casos de prueba:**
- ✅ Usuario no autenticado
- ✅ Usuario autenticado
- ✅ Usuario administrador
- ✅ Manejo de datos faltantes
- ✅ Enlaces correctos

## Comandos de Pruebas

\`\`\`bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
\`\`\`

## Métricas de Cobertura

El proyecto mantiene los siguientes umbrales mínimos de cobertura:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Estrategias de Testing

### 1. Pruebas de Lógica de Negocio
- **Funciones puras**: Fáciles de probar con entradas y salidas predecibles
- **Casos límite**: Arrays vacíos, valores nulos, datos inválidos
- **Validaciones**: Todos los casos de error y éxito

### 2. Pruebas de Componentes
- **Renderizado**: Verificar que los elementos aparezcan correctamente
- **Interacciones**: Simular clics, escritura, navegación
- **Props**: Probar diferentes combinaciones de propiedades
- **Estados**: Verificar cambios de estado y efectos

### 3. Mocking
- **Dependencias externas**: Next.js router, fetch, etc.
- **Componentes UI**: Simplificar componentes complejos
- **Hooks personalizados**: Controlar estados de autenticación

## Mejores Prácticas

### 1. Nomenclatura
\`\`\`typescript
describe('NombreDelModulo', () => {
  describe('nombreDeLaFuncion', () => {
    it('debe hacer algo específico cuando se cumple una condición', () => {
      // Prueba
    })
  })
})
\`\`\`

### 2. Estructura AAA (Arrange, Act, Assert)
\`\`\`typescript
it('debe calcular el saldo correctamente', () => {
  // Arrange - Preparar datos
  const transactions = [...]
  
  // Act - Ejecutar función
  const balance = calculateBalance(transactions)
  
  // Assert - Verificar resultado
  expect(balance).toBe(expectedValue)
})
\`\`\`

### 3. Datos de Prueba
- Usar datos realistas pero simples
- Crear factories para objetos complejos
- Reutilizar datos entre pruebas relacionadas

### 4. Mocks Específicos
- Mock solo lo necesario
- Usar mocks específicos por prueba cuando sea necesario
- Limpiar mocks entre pruebas

## Integración Continua

Las pruebas se ejecutan automáticamente en:
- **Pre-commit hooks**: Verificar pruebas antes de commit
- **Pull requests**: Validar cambios antes de merge
- **Deployment**: Asegurar calidad en producción

## Herramientas de Desarrollo

### VS Code Extensions Recomendadas
- Jest Runner
- Test Explorer UI
- Coverage Gutters

### Scripts Útiles
\`\`\`json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
\`\`\`

## Próximos Pasos

1. **Pruebas de Integración**: API endpoints y flujos completos
2. **Pruebas E2E**: Cypress o Playwright para pruebas de usuario final
3. **Performance Testing**: Pruebas de rendimiento para componentes
4. **Visual Regression**: Pruebas de regresión visual con Chromatic

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
