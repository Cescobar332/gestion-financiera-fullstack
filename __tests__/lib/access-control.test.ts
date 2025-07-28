/**
 * Pruebas unitarias para control de acceso
 * Estas pruebas verifican que el sistema de autorización funcione correctamente
 */

import {
  hasRole,
  isAdmin,
  isAuthenticated,
  canAccessResource,
  canViewTransaction,
  canModifyTransaction,
  getUserPermissions,
  requireAccess,
  canAccessPage,
  type User,
  type ProtectedResource,
} from "@/lib/access-control"

// Usuarios de prueba
const adminUser: User = {
  id: "admin-123",
  email: "admin@test.com",
  role: "ADMIN",
  name: "Admin User",
}

const regularUser: User = {
  id: "user-456",
  email: "user@test.com",
  role: "USER",
  name: "Regular User",
}

const nullUser = null

describe("Control de Acceso", () => {
  describe("hasRole", () => {
    it("debe retornar true si el usuario tiene el rol especificado", () => {
      expect(hasRole(adminUser, "ADMIN")).toBe(true)
      expect(hasRole(regularUser, "USER")).toBe(true)
    })

    it("debe retornar false si el usuario no tiene el rol especificado", () => {
      expect(hasRole(adminUser, "USER")).toBe(false)
      expect(hasRole(regularUser, "ADMIN")).toBe(false)
    })

    it("debe retornar false si el usuario es null", () => {
      expect(hasRole(nullUser, "ADMIN")).toBe(false)
      expect(hasRole(nullUser, "USER")).toBe(false)
    })

    it("debe retornar false si el usuario no tiene rol definido", () => {
      const userWithoutRole = { ...adminUser, role: undefined as any }
      expect(hasRole(userWithoutRole, "ADMIN")).toBe(false)
    })
  })

  describe("isAdmin", () => {
    it("debe retornar true para usuarios administradores", () => {
      expect(isAdmin(adminUser)).toBe(true)
    })

    it("debe retornar false para usuarios regulares", () => {
      expect(isAdmin(regularUser)).toBe(false)
    })

    it("debe retornar false para usuarios null", () => {
      expect(isAdmin(nullUser)).toBe(false)
    })
  })

  describe("isAuthenticated", () => {
    it("debe retornar true para usuarios válidos", () => {
      expect(isAuthenticated(adminUser)).toBe(true)
      expect(isAuthenticated(regularUser)).toBe(true)
    })

    it("debe retornar false para usuarios null", () => {
      expect(isAuthenticated(nullUser)).toBe(false)
    })

    it("debe retornar false para usuarios sin ID", () => {
      const userWithoutId = { ...adminUser, id: "" }
      expect(isAuthenticated(userWithoutId)).toBe(false)
    })
  })

  describe("canAccessResource", () => {
    const testCases: Array<{
      user: User | null
      resource: ProtectedResource
      expected: boolean
      description: string
    }> = [
      // Casos para usuario administrador
      { user: adminUser, resource: "transactions:read", expected: true, description: "admin puede leer transacciones" },
      {
        user: adminUser,
        resource: "transactions:write",
        expected: true,
        description: "admin puede escribir transacciones",
      },
      {
        user: adminUser,
        resource: "transactions:delete",
        expected: true,
        description: "admin puede eliminar transacciones",
      },
      { user: adminUser, resource: "users:read", expected: true, description: "admin puede leer usuarios" },
      { user: adminUser, resource: "users:write", expected: true, description: "admin puede escribir usuarios" },
      { user: adminUser, resource: "reports:read", expected: true, description: "admin puede leer reportes" },
      { user: adminUser, resource: "admin:access", expected: true, description: "admin puede acceder a panel admin" },

      // Casos para usuario regular
      {
        user: regularUser,
        resource: "transactions:read",
        expected: true,
        description: "user puede leer transacciones",
      },
      {
        user: regularUser,
        resource: "transactions:write",
        expected: false,
        description: "user no puede escribir transacciones",
      },
      {
        user: regularUser,
        resource: "transactions:delete",
        expected: false,
        description: "user no puede eliminar transacciones",
      },
      { user: regularUser, resource: "users:read", expected: false, description: "user no puede leer usuarios" },
      { user: regularUser, resource: "users:write", expected: false, description: "user no puede escribir usuarios" },
      { user: regularUser, resource: "reports:read", expected: false, description: "user no puede leer reportes" },
      {
        user: regularUser,
        resource: "admin:access",
        expected: false,
        description: "user no puede acceder a panel admin",
      },

      // Casos para usuario no autenticado
      {
        user: nullUser,
        resource: "transactions:read",
        expected: false,
        description: "usuario no autenticado no puede leer transacciones",
      },
      {
        user: nullUser,
        resource: "admin:access",
        expected: false,
        description: "usuario no autenticado no puede acceder a panel admin",
      },
    ]

    testCases.forEach(({ user, resource, expected, description }) => {
      it(`debe ${expected ? "permitir" : "denegar"} acceso: ${description}`, () => {
        expect(canAccessResource(user, resource)).toBe(expected)
      })
    })
  })

  describe("canViewTransaction", () => {
    it("debe permitir a admin ver cualquier transacción", () => {
      expect(canViewTransaction(adminUser, "other-user-id")).toBe(true)
      expect(canViewTransaction(adminUser, adminUser.id)).toBe(true)
    })

    it("debe permitir a usuario ver solo sus propias transacciones", () => {
      expect(canViewTransaction(regularUser, regularUser.id)).toBe(true)
      expect(canViewTransaction(regularUser, "other-user-id")).toBe(false)
    })

    it("debe denegar acceso a usuarios no autenticados", () => {
      expect(canViewTransaction(nullUser, "any-user-id")).toBe(false)
    })
  })

  describe("canModifyTransaction", () => {
    it("debe permitir a admin modificar cualquier transacción", () => {
      expect(canModifyTransaction(adminUser, "any-user-id")).toBe(true)
      expect(canModifyTransaction(adminUser, adminUser.id)).toBe(true)
    })

    it("debe denegar a usuario regular modificar transacciones", () => {
      expect(canModifyTransaction(regularUser, regularUser.id)).toBe(false)
      expect(canModifyTransaction(regularUser, "other-user-id")).toBe(false)
    })

    it("debe denegar acceso a usuarios no autenticados", () => {
      expect(canModifyTransaction(nullUser, "any-user-id")).toBe(false)
    })
  })

  describe("getUserPermissions", () => {
    it("debe retornar todos los permisos para admin", () => {
      const permissions = getUserPermissions(adminUser)

      expect(permissions).toContain("transactions:read")
      expect(permissions).toContain("transactions:write")
      expect(permissions).toContain("transactions:delete")
      expect(permissions).toContain("users:read")
      expect(permissions).toContain("users:write")
      expect(permissions).toContain("reports:read")
      expect(permissions).toContain("admin:access")
    })

    it("debe retornar permisos limitados para usuario regular", () => {
      const permissions = getUserPermissions(regularUser)

      expect(permissions).toContain("transactions:read")
      expect(permissions).not.toContain("transactions:write")
      expect(permissions).not.toContain("transactions:delete")
      expect(permissions).not.toContain("users:read")
      expect(permissions).not.toContain("users:write")
      expect(permissions).not.toContain("reports:read")
      expect(permissions).not.toContain("admin:access")
    })

    it("debe retornar array vacío para usuario no autenticado", () => {
      const permissions = getUserPermissions(nullUser)
      expect(permissions).toEqual([])
    })
  })

  describe("requireAccess", () => {
    it("debe pasar sin error si el usuario tiene acceso", () => {
      expect(() => requireAccess(adminUser, "admin:access")).not.toThrow()
      expect(() => requireAccess(regularUser, "transactions:read")).not.toThrow()
    })

    it("debe lanzar error si el usuario no está autenticado", () => {
      expect(() => requireAccess(nullUser, "transactions:read")).toThrow("Usuario no autenticado")
    })

    it("debe lanzar error si el usuario no tiene permisos", () => {
      expect(() => requireAccess(regularUser, "admin:access")).toThrow(
        "Acceso denegado: se requiere permiso para admin:access",
      )
    })
  })

  describe("canAccessPage", () => {
    const testCases: Array<{
      user: User | null
      page: string
      expected: boolean
      description: string
    }> = [
      // Páginas públicas
      { user: nullUser, page: "/", expected: true, description: "página principal es pública" },
      { user: nullUser, page: "/auth/signin", expected: true, description: "página de login es pública" },
      { user: nullUser, page: "/api-docs", expected: true, description: "documentación API es pública" },
      { user: regularUser, page: "/", expected: true, description: "usuario autenticado puede ver página principal" },

      // Páginas que requieren autenticación
      { user: nullUser, page: "/profile", expected: false, description: "perfil requiere autenticación" },
      { user: nullUser, page: "/transactions", expected: false, description: "transacciones requiere autenticación" },
      { user: nullUser, page: "/dashboard", expected: false, description: "dashboard requiere autenticación" },
      { user: regularUser, page: "/profile", expected: true, description: "usuario autenticado puede ver perfil" },
      {
        user: regularUser,
        page: "/transactions",
        expected: true,
        description: "usuario autenticado puede ver transacciones",
      },

      // Páginas de administrador
      { user: nullUser, page: "/admin/users", expected: false, description: "admin/users requiere ser admin" },
      { user: nullUser, page: "/admin/reports", expected: false, description: "admin/reports requiere ser admin" },
      {
        user: regularUser,
        page: "/admin/users",
        expected: false,
        description: "usuario regular no puede acceder a admin/users",
      },
      {
        user: regularUser,
        page: "/admin/reports",
        expected: false,
        description: "usuario regular no puede acceder a admin/reports",
      },
      { user: adminUser, page: "/admin/users", expected: true, description: "admin puede acceder a admin/users" },
      { user: adminUser, page: "/admin/reports", expected: true, description: "admin puede acceder a admin/reports" },
    ]

    testCases.forEach(({ user, page, expected, description }) => {
      it(`debe ${expected ? "permitir" : "denegar"} acceso: ${description}`, () => {
        expect(canAccessPage(user, page)).toBe(expected)
      })
    })
  })
})
