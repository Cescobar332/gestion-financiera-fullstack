import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
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
    const sessionToken = req.cookies["session-token"]

    if (!sessionToken) {
      console.log("No session token found")
      return null
    }

    console.log("Session token found:", sessionToken.substring(0, 10) + "...")

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session) {
      console.log("No session found in database")
      return null
    }

    if (session.expires < new Date()) {
      console.log("Session expired")
      // Limpiar sesión expirada
      await prisma.session.delete({ where: { id: session.id } })
      return null
    }

    console.log("Valid session found for user:", session.user.email)

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role as Role,
      } as AuthUser,
      session: {
        id: session.id,
        expires: session.expires,
      },
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
      console.log("withAuth middleware called for:", req.url)
      const sessionData = await getServerSession(req, res)

      if (!sessionData) {
        console.log("No session data, returning 401")
        return res.status(401).json({ error: "No autenticado" })
      }

      const { user } = sessionData

      // Verificar rol si es requerido
      if (options?.requiredRole && !hasRole(user, options.requiredRole)) {
        console.log("User role insufficient:", user.role, "required:", options.requiredRole)
        return res.status(403).json({ error: "Acceso denegado" })
      }

      console.log("Auth middleware passed for user:", user.email)
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
  console.log("requireAuth called for:", context.resolvedUrl)
  const sessionData = await getServerSession(context.req, context.res)

  if (!sessionData) {
    console.log("No session, redirecting to signin")
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
    console.log("Insufficient role, redirecting to unauthorized")
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    }
  }

  console.log("requireAuth passed for user:", user.email)

  return {
    props: {
      user,
    },
  }
}
