"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession } from "@/lib/auth-client"
import type { AuthUser } from "@/lib/auth-utils"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  console.log("AuthProvider - Session:", session, "Pending:", isPending)

  const user = session?.user
    ? ({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role || "USER",
      } as AuthUser)
    : null

  const value: AuthContextType = {
    user,
    isLoading: isPending,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  }

  console.log("AuthProvider - Value:", value)

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
