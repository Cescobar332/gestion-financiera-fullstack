import Head from "next/head"
import type { GetServerSideProps } from "next"
import { Layout } from "@/components/layout/layout"
import { requireAuth, type AuthUser } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProfileProps {
  user: AuthUser
}

export default function Profile({ user }: ProfileProps) {
  return (
    <>
      <Head>
        <title>Perfil - Mi Proyecto</title>
        <meta name="description" content="Información del perfil de usuario" />
      </Head>
      <Layout>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground mt-2">Información de tu cuenta</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Detalles de tu cuenta y configuración</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="text-lg">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.name || "Usuario"}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="mt-2">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rol</h3>
                  <p className="text-muted-foreground">{user.role === "ADMIN" ? "Administrador" : "Usuario"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nombre</h3>
                  <p className="text-muted-foreground">{user.name || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ID de Usuario</h3>
                  <p className="text-muted-foreground font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context)
}
