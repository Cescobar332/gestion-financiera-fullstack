import { withAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export default withAuth(
  async (req, res, user) => {
    if (req.method === "GET") {
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        res.status(200).json(users)
      } catch (error) {
        console.error("Error obteniendo usuarios:", error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    } else if (req.method === "PATCH") {
      try {
        const { userId, role } = req.body

        if (!userId || !role) {
          return res.status(400).json({ error: "userId y role son requeridos" })
        }

        if (!["USER", "ADMIN"].includes(role)) {
          return res.status(400).json({ error: "Rol inválido" })
        }

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        })

        res.status(200).json(updatedUser)
      } catch (error) {
        console.error("Error actualizando usuario:", error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    } else {
      res.setHeader("Allow", ["GET", "PATCH"])
      res.status(405).json({ error: "Método no permitido" })
    }
  },
  { requiredRole: "ADMIN" },
)
