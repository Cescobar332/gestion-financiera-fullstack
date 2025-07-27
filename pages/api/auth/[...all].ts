import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Auth API called:", req.method, req.url)

    // Manejar las rutas de autenticación manualmente
    const path = req.query.all as string[]
    const fullPath = path ? path.join("/") : ""

    console.log("Full path:", fullPath)

    if (fullPath === "signin/github") {
      // Redirigir a GitHub OAuth
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/callback/github`,
      )}&scope=user:email`

      console.log("Redirecting to GitHub:", githubAuthUrl)
      return res.redirect(302, githubAuthUrl)
    }

    if (fullPath === "callback/github") {
      const { code } = req.query

      if (!code) {
        return res.status(400).json({ error: "No authorization code provided" })
      }

      console.log("GitHub callback with code:", code)

      try {
        // Intercambiar código por token de acceso
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        })

        const tokenData = await tokenResponse.json()
        console.log("Token response:", tokenData)

        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error)
        }

        // Obtener información del usuario
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: "application/vnd.github.v3+json",
          },
        })

        const userData = await userResponse.json()
        console.log("User data:", userData)

        // Obtener email del usuario
        const emailResponse = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: "application/vnd.github.v3+json",
          },
        })

        const emailData = await emailResponse.json()
        const primaryEmail = emailData.find((email: any) => email.primary)?.email || userData.email

        // Crear o actualizar usuario en la base de datos
        const { prisma } = await import("@/lib/prisma")

        let user = await prisma.user.findUnique({
          where: { email: primaryEmail },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: primaryEmail,
              name: userData.name || userData.login,
              image: userData.avatar_url,
              role: "ADMIN",
            },
          })
          console.log("New user created:", user.id)
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: userData.name || userData.login,
              image: userData.avatar_url,
            },
          })
          console.log("User updated:", user.id)
        }

        // Crear sesión
        const sessionToken = generateSessionToken()
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días

        await prisma.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires,
          },
        })

        // Establecer cookie de sesión
        res.setHeader(
          "Set-Cookie",
          `session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
        )

        console.log("Session created, redirecting to dashboard")
        return res.redirect(302, "/dashboard")
      } catch (error) {
        console.error("Error in GitHub callback:", error)
        return res.status(500).json({ error: "Authentication failed" })
      }
    }

    if (fullPath === "session") {
      // Obtener sesión actual
      const sessionToken = req.cookies["session-token"]

      if (!sessionToken) {
        return res.status(200).json({ user: null, session: null })
      }

      const { prisma } = await import("@/lib/prisma")

      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })

      if (!session || session.expires < new Date()) {
        // Limpiar sesión expirada
        if (session) {
          await prisma.session.delete({ where: { id: session.id } })
        }
        res.setHeader("Set-Cookie", "session-token=; Path=/; HttpOnly; Max-Age=0")
        return res.status(200).json({ user: null, session: null })
      }

      return res.status(200).json({
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: session.user.role,
        },
        session: {
          id: session.id,
          expires: session.expires,
        },
      })
    }

    if (fullPath === "signout") {
      const sessionToken = req.cookies["session-token"]

      if (sessionToken) {
        const { prisma } = await import("@/lib/prisma")
        await prisma.session.deleteMany({
          where: { sessionToken },
        })
      }

      res.setHeader("Set-Cookie", "session-token=; Path=/; HttpOnly; Max-Age=0")
      return res.status(200).json({ success: true })
    }

    return res.status(404).json({ error: "Not found" })
  } catch (error) {
    console.error("Auth API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
}