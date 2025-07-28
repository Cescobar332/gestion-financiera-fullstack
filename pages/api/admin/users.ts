import { withAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export default withAuth(
  async (req, res, user) => {
    if (req.method === "GET") {
      try {
        const { page = "1", limit = "10", search } = req.query

        const pageNum = Number.parseInt(page as string)
        const limitNum = Number.parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        // Construir filtros
        const where: any = {}

        if (search) {
          where.OR = [
            {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          ]
        }

        const [users, total] = await Promise.all([
          prisma.user.findMany({
            where,
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                  transactions: true,
                },
              },
          },
          orderBy: {
            createdAt: "desc",
          },
        skip,
            take: limitNum,
          }),
          prisma.user.count({ where }),
        ])

        res.status(200).json({
          users,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          },
        })
      } catch (error) {
        console.error("Error obteniendo usuarios:", error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    } else if (req.method === "PATCH") {
      try {
        const { userId, name, role } = req.body

        if (!userId) {
          return res.status(400).json({ error: "userId es requerido" })
        }

        if (role && !["USER", "ADMIN"].includes(role)) {
          return res.status(400).json({ error: "Rol inválido" })
        }

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (role !== undefined) updateData.role = role

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                transactions: true,
              },
            },
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
