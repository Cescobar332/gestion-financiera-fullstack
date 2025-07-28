import { withAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export default withAuth(async (req, res, user) => {
  const { id } = req.query

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" })
  }

  if (req.method === "GET") {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
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

      if (!transaction) {
        return res.status(404).json({ error: "Transacción no encontrada" })
      }

      // Solo admins pueden ver todas las transacciones, usuarios normales solo las suyas
      if (user.role !== "ADMIN" && transaction.userId !== user.id) {
        return res.status(403).json({ error: "Acceso denegado" })
      }

      res.status(200).json(transaction)
    } catch (error) {
      console.error("Error obteniendo transacción:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  } else if (req.method === "PUT") {
    // Solo admins pueden editar transacciones
    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "Solo los administradores pueden editar transacciones" })
    }

    try {
      const { concept, amount, date, type } = req.body

      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      })

      if (!existingTransaction) {
        return res.status(404).json({ error: "Transacción no encontrada" })
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          concept: concept || existingTransaction.concept,
          amount: amount ? Number.parseFloat(amount) : existingTransaction.amount,
          date: date ? new Date(date) : existingTransaction.date,
          type: type || existingTransaction.type,
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

      res.status(200).json(transaction)
    } catch (error) {
      console.error("Error actualizando transacción:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  } else if (req.method === "DELETE") {
    // Solo admins pueden eliminar transacciones
    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "Solo los administradores pueden eliminar transacciones" })
    }

    try {
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      })

      if (!existingTransaction) {
        return res.status(404).json({ error: "Transacción no encontrada" })
      }

      await prisma.transaction.delete({
        where: { id },
      })

      res.status(200).json({ message: "Transacción eliminada correctamente" })
    } catch (error) {
      console.error("Error eliminando transacción:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"])
    res.status(405).json({ error: "Método no permitido" })
  }
})
