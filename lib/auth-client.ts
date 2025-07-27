"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: string
}

interface Session {
  id: string
  expires: string
}

interface SessionData {
  user: User | null
  session: Session | null
}

// Hook personalizado para manejar la sesión
export function useSession() {
  const [data, setData] = useState<SessionData | null>(null)
  const [isPending, setIsPending] = useState(true)

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const sessionData = await response.json()
      setData(sessionData)
    } catch (error) {
      console.error("Error fetching session:", error)
      setData({ user: null, session: null })
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  return { data, isPending, refetch: fetchSession }
}

// Función para iniciar sesión con GitHub
export const signInWithGitHub = async () => {
  window.location.href = "/api/auth/signin/github"
}

// Función para cerrar sesión
export const signOutUser = async () => {
  try {
    await fetch("/api/auth/signout", { method: "POST" })
          window.location.href = "/"
  } catch (error) {
    console.error("Error signing out:", error)
  }
}

// Objetos de compatibilidad con Better Auth
export const signIn = {
  social: ({ provider }: { provider: string; callbackURL?: string }) => {
    if (provider === "github") {
      return signInWithGitHub()
    }
  },
}

export const signOut = () => signOutUser()