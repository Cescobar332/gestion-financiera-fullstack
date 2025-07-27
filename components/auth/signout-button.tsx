"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

interface SignOutButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function SignOutButton({ className, variant = "outline" }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      window.location.href = "/"
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSignOut} variant={variant} className={className} disabled={isLoading}>
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Cerrando..." : "Cerrar sesión"}
    </Button>
  )
}
