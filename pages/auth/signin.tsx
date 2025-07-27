"use client"

import Head from "next/head"
import { SignInButton } from "@/components/auth/signin-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function SignIn() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Iniciar Sesión - Mi Proyecto</title>
        <meta name="description" content="Inicia sesión en tu cuenta" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenido</CardTitle>
            <CardDescription>Inicia sesión para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton className="w-full" />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
