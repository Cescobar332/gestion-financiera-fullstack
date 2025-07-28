import { withAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export default withAuth(async (req, res, user) => {
  if (req.method === "GET") {
    try {
      const { page = "1", limit = "10", type, search } = req.query

      const pageNum = Number.parseInt(page as string)
      const limitNum = Number.parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      // Construir filtros
      const where: any = {}

      // Solo admins pueden ver todas las transacciones, usuarios normales solo las suyas
      if (user.role !== "ADMIN") {
        where.userId = user.id
      }

      if (type && (type === "INCOME" || type === "EXPENSE")) {
        where.type = type
      }

      if (search) {
        where.concept = {
          contains: search as string,
          mode: "insensitive",
        }
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          skip,
          take: limitNum,
        }),
        prisma.transaction.count({ where }),
      ])

      res.status(200).json({
        transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      })
    } catch (error) {
      console.error("Error obteniendo transacciones:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  } else if (req.method === "POST") {
    // Solo admins pueden crear transacciones
    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "Solo los administradores pueden crear transacciones" })
    }

    try {
      const { concept, amount, date, type } = req.body

      if (!concept || !amount || !date || !type) {
        return res.status(400).json({ error: "Todos los campos son requeridos" })
      }

      if (!["INCOME", "EXPENSE"].includes(type)) {
        return res.status(400).json({ error: "Tipo de transacción inválido" })
      }

      const transaction = await prisma.transaction.create({
        data: {
          concept,
          amount: Number.parseFloat(amount),
          date: new Date(date),
          type,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      res.status(201).json(transaction)
    } catch (error) {
      console.error("Error creando transacción:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).json({ error: "Método no permitido" })
  }
})
