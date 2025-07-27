import { withAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export default withAuth(async (req, res, user) => {
  if (req.method === "GET") {
    try {
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!userProfile) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      res.status(200).json(userProfile)
    } catch (error) {
      console.error("Error obteniendo perfil:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).json({ error: "Método no permitido" })
  }
})
