"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useState } from "react"

interface SignInButtonProps {
  className?: string
}

export function SignInButton({ className }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      console.log("Iniciando proceso de login con GitHub...")

      window.location.href = "/api/auth/signin/github"
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSignIn} className={className} disabled={isLoading}>
      <Github className="mr-2 h-4 w-4" />
      {isLoading ? "Redirigiendo..." : "Iniciar sesión con GitHub"}
    </Button>
  )
}
