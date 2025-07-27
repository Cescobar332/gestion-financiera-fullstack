import { DollarSign, Users, BarChart3, Shield, Clock, TrendingUp } from "lucide-react"

const features = [
  {
    name: "Gestión de Transacciones",
    description: "Registra y categoriza tus ingresos y egresos de manera sencilla y organizada.",
    icon: DollarSign,
  },
  {
    name: "Control de Usuarios",
    description: "Administra usuarios y permisos con un sistema de roles robusto y seguro.",
    icon: Users,
  },
  {
    name: "Reportes Detallados",
    description: "Genera reportes financieros completos con gráficos y análisis avanzados.",
    icon: BarChart3,
  },
  {
    name: "Seguridad Avanzada",
    description: "Autenticación segura con GitHub y protección de datos de nivel empresarial.",
    icon: Shield,
  },
  {
    name: "Tiempo Real",
    description: "Visualiza tus datos financieros actualizados en tiempo real.",
    icon: Clock,
  },
  {
    name: "Análisis de Tendencias",
    description: "Identifica patrones y tendencias en tus finanzas para tomar mejores decisiones.",
    icon: TrendingUp,
  },
]

export function FeaturesSection() {
  return (
    <div className="bg-muted/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todo lo que necesitas para gestionar tus finanzas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Una plataforma completa con todas las herramientas necesarias para el control financiero personal y
            empresarial.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">{feature.name}</h3>
                  </div>
                </div>
                <div className="mt-2 ml-16">
                  <p className="text-base text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
