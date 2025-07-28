"use client"

import Head from "next/head"
import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Book,
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  ExternalLink,
  Key,
  Server,
  Shield,
  User,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react"

interface ApiSpec {
  info: {
    title: string
    version: string
    description: string
  }
  paths: Record<string, any>
  components: {
    schemas: Record<string, any>
  }
  tags: Array<{
    name: string
    description: string
  }>
}

export default function ApiDocs() {
  const [apiSpec, setApiSpec] = useState<ApiSpec | null>(null)
  const [loading, setLoading] = useState(true)
  const [openEndpoints, setOpenEndpoints] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchApiSpec()
  }, [])

  const fetchApiSpec = async () => {
    try {
      const response = await fetch("/api/docs")
      const data = await response.json()
      setApiSpec(data)
    } catch (error) {
      console.error("Error fetching API spec:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEndpoint = (key: string) => {
    setOpenEndpoints((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getMethodColor = (method: string) => {
    const colors = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800",
      PUT: "bg-yellow-100 text-yellow-800",
      PATCH: "bg-orange-100 text-orange-800",
      DELETE: "bg-red-100 text-red-800",
    }
    return colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTagIcon = (tagName: string) => {
    const icons = {
      Autenticación: Shield,
      Usuario: User,
      Transacciones: DollarSign,
      "Administración - Usuarios": Users,
      "Administración - Reportes": BarChart3,
    }
    return icons[tagName as keyof typeof icons] || Server
  }

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando documentación...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!apiSpec) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Error cargando la documentación de la API</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Documentación API - Mi Proyecto</title>
        <meta name="description" content="Documentación completa de la API REST" />
      </Head>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Book className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">{apiSpec.info.title}</h1>
                <p className="text-muted-foreground">Versión {apiSpec.info.version}</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">{apiSpec.info.description}</p>
          </div>

          <Tabs defaultValue="endpoints" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="schemas">Esquemas</TabsTrigger>
              <TabsTrigger value="authentication">Autenticación</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-6">
              {apiSpec.tags.map((tag) => {
                const TagIcon = getTagIcon(tag.name)
                const tagEndpoints = Object.entries(apiSpec.paths).filter(([path, methods]) =>
                  Object.values(methods).some((method: any) => method.tags?.includes(tag.name)),
                )

                return (
                  <Card key={tag.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TagIcon className="h-5 w-5" />
                        {tag.name}
                      </CardTitle>
                      <CardDescription>{tag.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tagEndpoints.map(([path, methods]) =>
                        Object.entries(methods).map(([method, details]: [string, any]) => {
                          const endpointKey = `${method}-${path}`
                          const isOpen = openEndpoints[endpointKey]

                          return (
                            <Collapsible key={endpointKey}>
                              <CollapsibleTrigger
                                className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                onClick={() => toggleEndpoint(endpointKey)}
                              >
                                <div className="flex items-center gap-3">
                                  <Badge className={getMethodColor(method.toUpperCase())}>{method.toUpperCase()}</Badge>
                                  <code className="font-mono text-sm">{path}</code>
                                  <span className="text-sm text-muted-foreground">{details.summary}</span>
                                </div>
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-4 p-4 border-l-2 border-primary/20 ml-4 space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Descripción</h4>
                                  <p className="text-sm text-muted-foreground">{details.description}</p>
                                </div>

                                {details.parameters && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Parámetros</h4>
                                    <div className="space-y-2">
                                      {details.parameters.map((param: any, index: number) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                          <Badge variant="outline">{param.in}</Badge>
                                          <code className="font-mono">{param.name}</code>
                                          <span className="text-muted-foreground">- {param.description}</span>
                                          {param.required && (
                                            <Badge variant="destructive" className="text-xs">
                                              Requerido
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {details.requestBody && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Cuerpo de la Petición</h4>
                                    <div className="bg-muted p-3 rounded-lg">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-mono">application/json</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              JSON.stringify(
                                                details.requestBody.content["application/json"].example,
                                                null,
                                                2,
                                              ),
                                            )
                                          }
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <pre className="text-xs overflow-x-auto">
                                        {JSON.stringify(
                                          details.requestBody.content["application/json"].example,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-semibold mb-2">Respuestas</h4>
                                  <div className="space-y-2">
                                    {Object.entries(details.responses).map(([status, response]: [string, any]) => (
                                      <div key={status} className="border rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge variant={status.startsWith("2") ? "default" : "destructive"}>
                                            {status}
                                          </Badge>
                                          <span className="text-sm">{response.description}</span>
                                        </div>
                                        {response.content?.["application/json"]?.example && (
                                          <div className="bg-muted p-2 rounded text-xs">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-mono">Ejemplo:</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  copyToClipboard(
                                                    JSON.stringify(
                                                      response.content["application/json"].example,
                                                      null,
                                                      2,
                                                    ),
                                                  )
                                                }
                                              >
                                                <Copy className="h-3 w-3" />
                                              </Button>
                                            </div>
                                            <pre className="overflow-x-auto">
                                              {JSON.stringify(response.content["application/json"].example, null, 2)}
                                            </pre>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        }),
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="schemas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Esquemas de Datos
                  </CardTitle>
                  <CardDescription>Estructuras de datos utilizadas en la API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(apiSpec.components.schemas).map(([name, schema]: [string, any]) => (
                    <Collapsible key={name}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{name}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {schema.description || "Esquema de datos"}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-3 bg-muted rounded-lg">
                        <pre className="text-xs overflow-x-auto">{JSON.stringify(schema, null, 2)}</pre>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Autenticación
                  </CardTitle>
                  <CardDescription>Cómo autenticarse con la API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Método de Autenticación</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      La API utiliza autenticación basada en sesiones con cookies HTTP-only. El token de sesión se
                      almacena automáticamente en una cookie llamada <code>session-token</code>.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Flujo de Autenticación</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>El usuario inicia sesión a través de GitHub OAuth</li>
                      <li>
                        El servidor crea una sesión y establece la cookie <code>session-token</code>
                      </li>
                      <li>Las peticiones subsecuentes incluyen automáticamente la cookie</li>
                      <li>El servidor valida la sesión en cada petición protegida</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Roles de Usuario</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge>USER</Badge>
                        <span className="text-sm">Puede ver y gestionar sus propias transacciones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">ADMIN</Badge>
                        <span className="text-sm">Acceso completo a todas las funcionalidades</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Endpoints Públicos</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <code>GET /api/auth/session</code> - Obtener información de sesión
                      </li>
                      <li>
                        <code>POST /api/auth/signout</code> - Cerrar sesión
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Endpoints Protegidos</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Todos los demás endpoints requieren autenticación. Los endpoints que comienzan con
                      <code>/api/admin/</code> requieren rol de ADMIN.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              ¿Necesitas ayuda? Contacta al equipo de desarrollo o consulta los ejemplos de código.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/api/docs" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver JSON Raw
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
