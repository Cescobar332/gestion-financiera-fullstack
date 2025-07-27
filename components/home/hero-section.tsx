"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { SignInButton } from "@/components/auth/signin-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, DollarSign, BarChart3 } from "lucide-react"

export function HeroSection() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Gestiona tus finanzas</span>
              <span className="block text-primary">de manera inteligente</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Controla tus ingresos y egresos, genera reportes detallados y toma decisiones financieras informadas con
              nuestra plataforma integral.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link href="/transactions">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Ver Transacciones
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="outline" size="lg">
                      <Link href="/admin/reports">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Ver Reportes
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <SignInButton className="text-lg px-8 py-3" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
