import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { auth } from "./auth"
import { prisma } from "./prisma"

export type Role = "USER" | "ADMIN"

export interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string
  role: Role
}

// Obtener sesión del servidor
export async function getServerSession(
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"],
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    })

    if (!session) return null

    // Obtener información completa del usuario incluyendo el rol
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    })

    if (!user) return null

    return {
      user: user as AuthUser,
      session,
    }
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

// Verificar si el usuario tiene un rol específico
export function hasRole(user: AuthUser | null, role: Role): boolean {
  if (!user) return false
  return user.role === role
}

// Verificar si el usuario es admin
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, "ADMIN")
}

// Verificar si el usuario está autenticado
export function isAuthenticated(user: AuthUser | null): boolean {
  return user !== null
}

// Middleware para proteger rutas API
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: AuthUser) => Promise<void> | void,
  options?: {
    requiredRole?: Role
  },
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const sessionData = await getServerSession(req, res)

      if (!sessionData) {
        return res.status(401).json({ error: "No autenticado" })
      }

      const { user } = sessionData

      // Verificar rol si es requerido
      if (options?.requiredRole && !hasRole(user, options.requiredRole)) {
        return res.status(403).json({ error: "Acceso denegado" })
      }

      return handler(req, res, user)
    } catch (error) {
      console.error("Error en middleware de autenticación:", error)
      return res.status(500).json({ error: "Error interno del servidor" })
    }
  }
}

// Middleware para proteger páginas
export async function requireAuth(
  context: GetServerSidePropsContext,
  options?: {
    requiredRole?: Role
    redirectTo?: string
  },
) {
  const sessionData = await getServerSession(context.req, context.res)

  if (!sessionData) {
    return {
      redirect: {
        destination: options?.redirectTo || "/auth/signin",
        permanent: false,
      },
    }
  }

  const { user } = sessionData

  // Verificar rol si es requerido
  if (options?.requiredRole && !hasRole(user, options.requiredRole)) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}
