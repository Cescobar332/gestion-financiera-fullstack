import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "ADMIN",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // 1 día
  },
  callbacks: {
    after: [
      {
        matcher(context) {
          return context.type === "signUp" || context.type === "signIn"
        },
        handler: async (context) => {
          console.log("Auth callback:", context.type, context.user?.id)
          // Asignar rol ADMIN automáticamente a nuevos usuarios
          if (context.user && context.type === "signUp") {
            try {
            await prisma.user.update({
              where: { id: context.user.id },
              data: { role: "ADMIN" },
            })
            console.log("Rol ADMIN asignado al usuario:", context.user.id)
            } catch (error) {
              console.error("Error asignando rol:", error)
            }
          }
        },
      },
    ],
  },
  trustedOrigins: ["http://localhost:3000"],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User