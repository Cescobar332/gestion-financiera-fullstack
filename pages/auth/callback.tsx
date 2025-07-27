"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSession } from "@/lib/auth-client"

export default function AuthCallback() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    console.log("Callback - Session:", session, "Pending:", isPending)

    if (!isPending) {
      if (session?.user) {
        console.log("Usuario autenticado, redirigiendo al dashboard")
        router.push("/dashboard")
      } else {
        console.log("No hay sesión, redirigiendo al login")
        router.push("/auth/signin")
      }
    }
  }, [session, isPending, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Procesando autenticación...</p>
        <p className="mt-2 text-sm text-muted-foreground">{isPending ? "Verificando sesión..." : "Redirigiendo..."}</p>
      </div>
    </div>
  )
}
