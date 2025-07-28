/**
 * Utilidades para control de acceso y autorización
 * Este módulo contiene funciones para verificar permisos y roles de usuario
 */

/**
 * Roles disponibles en el sistema
 */
export type UserRole = "USER" | "ADMIN"

/**
 * Información básica del usuario para control de acceso
 */
export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
}

/**
 * Recursos protegidos del sistema
 */
export type ProtectedResource =
  | "transactions:read"
  | "transactions:write"
  | "transactions:delete"
  | "users:read"
  | "users:write"
  | "reports:read"
  | "admin:access"

/**
 * Verifica si un usuario tiene un rol específico
 * @param user - Usuario a verificar
 * @param role - Rol requerido
 * @returns true si el usuario tiene el rol especificado
 *
 * @example
 * ```typescript
 * const user = { id: '1', email: 'admin@test.com', role: 'ADMIN' }
 * const isAdmin = hasRole(user, 'ADMIN') // true
 * ```
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) {
    return false
  }

  if (!user.role) {
    return false
  }

  return user.role === role
}

/**
 * Verifica si un usuario es administrador
 * @param user - Usuario a verificar
 * @returns true si el usuario es administrador
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, "ADMIN")
}

/**
 * Verifica si un usuario está autenticado
 * @param user - Usuario a verificar
 * @returns true si el usuario está autenticado
 */
export function isAuthenticated(user: User | null): boolean {
  return user !== null && typeof user.id === "string" && user.id.length > 0
}

/**
 * Verifica si un usuario puede acceder a un recurso específico
 * @param user - Usuario a verificar
 * @param resource - Recurso al que se quiere acceder
 * @returns true si el usuario puede acceder al recurso
 *
 * @example
 * ```typescript
 * const user = { id: '1', email: 'user@test.com', role: 'USER' }
 * const canRead = canAccessResource(user, 'transactions:read') // true
 * const canDelete = canAccessResource(user, 'transactions:delete') // false
 * ```
 */
export function canAccessResource(user: User | null, resource: ProtectedResource): boolean {
  // Usuario no autenticado no puede acceder a ningún recurso
  if (!isAuthenticated(user)) {
    return false
  }

  // Definir permisos por rol
  const permissions: Record<UserRole, ProtectedResource[]> = {
    USER: [
      "transactions:read", // Los usuarios pueden leer sus propias transacciones
    ],
    ADMIN: [
      "transactions:read",
      "transactions:write",
      "transactions:delete",
      "users:read",
      "users:write",
      "reports:read",
      "admin:access",
    ],
  }

  const userPermissions = permissions[user!.role] || []
  return userPermissions.includes(resource)
}

/**
 * Verifica si un usuario puede ver una transacción específica
 * @param user - Usuario que quiere ver la transacción
 * @param transactionUserId - ID del usuario propietario de la transacción
 * @returns true si el usuario puede ver la transacción
 */
export function canViewTransaction(user: User | null, transactionUserId: string): boolean {
  if (!isAuthenticated(user)) {
    return false
  }

  // Los administradores pueden ver todas las transacciones
  if (isAdmin(user)) {
    return true
  }

  // Los usuarios solo pueden ver sus propias transacciones
  return user!.id === transactionUserId
}

/**
 * Verifica si un usuario puede modificar una transacción específica
 * @param user - Usuario que quiere modificar la transacción
 * @param transactionUserId - ID del usuario propietario de la transacción
 * @returns true si el usuario puede modificar la transacción
 */
export function canModifyTransaction(user: User | null, transactionUserId: string): boolean {
  if (!isAuthenticated(user)) {
    return false
  }

  // Solo los administradores pueden modificar transacciones
  return isAdmin(user)
}

/**
 * Obtiene una lista de recursos a los que un usuario puede acceder
 * @param user - Usuario
 * @returns Array de recursos accesibles
 */
export function getUserPermissions(user: User | null): ProtectedResource[] {
  if (!isAuthenticated(user)) {
    return []
  }

  const allResources: ProtectedResource[] = [
    "transactions:read",
    "transactions:write",
    "transactions:delete",
    "users:read",
    "users:write",
    "reports:read",
    "admin:access",
  ]

  return allResources.filter((resource) => canAccessResource(user, resource))
}

/**
 * Middleware de autorización para verificar acceso a recursos
 * @param user - Usuario actual
 * @param requiredResource - Recurso requerido
 * @throws Error si el usuario no tiene acceso
 */
export function requireAccess(user: User | null, requiredResource: ProtectedResource): void {
  if (!canAccessResource(user, requiredResource)) {
    if (!isAuthenticated(user)) {
      throw new Error("Usuario no autenticado")
    } else {
      throw new Error(`Acceso denegado: se requiere permiso para ${requiredResource}`)
    }
  }
}

/**
 * Verifica si un usuario puede acceder a una página específica
 * @param user - Usuario actual
 * @param page - Página a la que se quiere acceder
 * @returns true si el usuario puede acceder a la página
 */
export function canAccessPage(user: User | null, page: string): boolean {
  // Páginas públicas
  const publicPages = ["/", "/auth/signin", "/api-docs"]
  if (publicPages.includes(page)) {
    return true
  }

  // Páginas que requieren autenticación
  const authPages = ["/profile", "/transactions", "/dashboard"]
  if (authPages.includes(page)) {
    return isAuthenticated(user)
  }

  // Páginas de administrador
  const adminPages = ["/admin/users", "/admin/reports"]
  if (adminPages.some((adminPage) => page.startsWith(adminPage))) {
    return isAdmin(user)
  }

  // Por defecto, requerir autenticación
  return isAuthenticated(user)
}
