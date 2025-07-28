import { withAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export default withAuth(
  async (req, res, user) => {
    if (req.method === "GET") {
      try {
        const { period = "month", format } = req.query

        // Calcular fechas según el período
        const now = new Date()
        let startDate: Date
        const endDate = now

        switch (period) {
          case "week":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
            break
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1)
            break
          default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        }

        // Obtener transacciones del período
        const transactions = await prisma.transaction.findMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
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
          orderBy: {
            date: "desc",
          },
        })

        // Calcular totales
        const totalIncome = transactions
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => sum + Number(t.amount), 0)

        const totalExpense = transactions
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => sum + Number(t.amount), 0)

        const balance = totalIncome - totalExpense

        // Agrupar por fecha para el gráfico
        const dailyData = transactions.reduce((acc: any, transaction) => {
          const date = transaction.date.toISOString().split("T")[0]
          if (!acc[date]) {
            acc[date] = { date, income: 0, expense: 0 }
          }
          if (transaction.type === "INCOME") {
            acc[date].income += Number(transaction.amount)
          } else {
            acc[date].expense += Number(transaction.amount)
          }
          return acc
        }, {})

        const chartData = Object.values(dailyData).sort((a: any, b: any) => a.date.localeCompare(b.date))

        // Agrupar por categoría (concepto)
        const categoryData = transactions.reduce((acc: any, transaction) => {
          const concept = transaction.concept
          if (!acc[concept]) {
            acc[concept] = { concept, income: 0, expense: 0, count: 0 }
          }
          if (transaction.type === "INCOME") {
            acc[concept].income += Number(transaction.amount)
          } else {
            acc[concept].expense += Number(transaction.amount)
          }
          acc[concept].count += 1
          return acc
        }, {})

        const categoryStats = Object.values(categoryData).sort((a: any, b: any) => b.count - a.count)

        // Si se solicita formato CSV
        if (format === "csv") {
          const csvData = transactions.map((t) => ({
            Fecha: t.date.toISOString().split("T")[0],
            Concepto: t.concept,
            Monto: Number(t.amount),
            Tipo: t.type === "INCOME" ? "Ingreso" : "Egreso",
            Usuario: t.user.name || t.user.email,
          }))

          res.setHeader("Content-Type", "text/csv")
          res.setHeader("Content-Disposition", `attachment; filename="reporte-${period}-${Date.now()}.csv"`)

          // Crear CSV
          const headers = Object.keys(csvData[0] || {}).join(",")
          const rows = csvData.map((row) => Object.values(row).join(",")).join("\n")
          const csv = `${headers}\n${rows}`

          return res.status(200).send(csv)
        }

        // Respuesta JSON normal
        res.status(200).json({
          summary: {
            totalIncome,
            totalExpense,
            balance,
            transactionCount: transactions.length,
            period,
            startDate,
            endDate,
          },
          chartData,
          categoryStats,
          transactions: transactions.slice(0, 10), // Solo las últimas 10 para el resumen
        })
      } catch (error) {
        console.error("Error generando reporte:", error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    } else {
      res.setHeader("Allow", ["GET"])
      res.status(405).json({ error: "Método no permitido" })
    }
  },
  { requiredRole: "ADMIN" },
)
