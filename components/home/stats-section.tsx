"use client"

import { useAuth } from "@/components/auth/auth-provider"

const stats = [
  { id: 1, name: "Usuarios Activos", value: "2,000+" },
  { id: 2, name: "Transacciones Procesadas", value: "50,000+" },
  { id: 3, name: "Reportes Generados", value: "10,000+" },
  { id: 4, name: "Tiempo de Actividad", value: "99.9%" },
]

export function StatsSection() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Confiado por miles de usuarios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Nuestra plataforma ha ayudado a miles de personas y empresas a gestionar mejor sus finanzas.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-lg font-medium text-foreground">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
