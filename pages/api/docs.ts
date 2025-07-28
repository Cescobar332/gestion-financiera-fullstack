import type { NextApiRequest, NextApiResponse } from "next"

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Mi Proyecto API",
    version: "1.0.0",
    description: "API para gestión financiera con autenticación y control de roles",
    contact: {
      name: "Soporte API",
      email: "soporte@miproyecto.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
      description: "Servidor de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      SessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "session-token",
        description: "Token de sesión almacenado en cookie",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID único del usuario" },
          email: { type: "string", format: "email", description: "Email del usuario" },
          name: { type: "string", nullable: true, description: "Nombre completo del usuario" },
          phone: { type: "string", nullable: true, description: "Teléfono del usuario" },
          image: { type: "string", nullable: true, description: "URL de la imagen de perfil" },
          role: { type: "string", enum: ["USER", "ADMIN"], description: "Rol del usuario" },
          createdAt: { type: "string", format: "date-time", description: "Fecha de creación" },
          updatedAt: { type: "string", format: "date-time", description: "Fecha de última actualización" },
        },
        required: ["id", "email", "role"],
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID único de la transacción" },
          concept: { type: "string", description: "Concepto o descripción de la transacción" },
          amount: { type: "number", format: "decimal", description: "Monto de la transacción" },
          date: { type: "string", format: "date-time", description: "Fecha de la transacción" },
          type: { type: "string", enum: ["INCOME", "EXPENSE"], description: "Tipo de transacción" },
          userId: { type: "string", description: "ID del usuario propietario" },
          createdAt: { type: "string", format: "date-time", description: "Fecha de creación" },
          updatedAt: { type: "string", format: "date-time", description: "Fecha de última actualización" },
          user: { $ref: "#/components/schemas/UserBasic" },
        },
        required: ["id", "concept", "amount", "date", "type", "userId"],
      },
      UserBasic: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", nullable: true },
          email: { type: "string" },
        },
      },
      ReportSummary: {
        type: "object",
        properties: {
          totalIncome: { type: "number", description: "Total de ingresos" },
          totalExpense: { type: "number", description: "Total de egresos" },
          balance: { type: "number", description: "Balance (ingresos - egresos)" },
          transactionCount: { type: "integer", description: "Número total de transacciones" },
          period: { type: "string", description: "Período del reporte" },
          startDate: { type: "string", format: "date-time", description: "Fecha de inicio" },
          endDate: { type: "string", format: "date-time", description: "Fecha de fin" },
        },
      },
      ChartData: {
        type: "object",
        properties: {
          date: { type: "string", format: "date", description: "Fecha" },
          income: { type: "number", description: "Ingresos del día" },
          expense: { type: "number", description: "Egresos del día" },
        },
      },
      CategoryStats: {
        type: "object",
        properties: {
          concept: { type: "string", description: "Concepto de la categoría" },
          income: { type: "number", description: "Total de ingresos en esta categoría" },
          expense: { type: "number", description: "Total de egresos en esta categoría" },
          count: { type: "integer", description: "Número de transacciones" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", description: "Mensaje de error" },
        },
        required: ["error"],
      },
      PaginationInfo: {
        type: "object",
        properties: {
          page: { type: "integer", description: "Página actual" },
          limit: { type: "integer", description: "Elementos por página" },
          total: { type: "integer", description: "Total de elementos" },
          pages: { type: "integer", description: "Total de páginas" },
        },
      },
    },
  },
  paths: {
    "/api/auth/session": {
      get: {
        tags: ["Autenticación"],
        summary: "Obtener sesión actual",
        description: "Retorna la información de la sesión actual del usuario autenticado",
        responses: {
          200: {
            description: "Sesión obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    session: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        expires: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
                examples: {
                  authenticated: {
                    summary: "Usuario autenticado",
                    value: {
                      user: {
                        id: "clx1234567890",
                        email: "usuario@ejemplo.com",
                        name: "Juan Pérez",
                        phone: "+57 300 123 4567",
                        role: "USER",
                        image: "https://avatars.githubusercontent.com/u/123456",
                      },
                      session: {
                        id: "sess_123456789",
                        expires: "2024-02-01T12:00:00.000Z",
                      },
                    },
                  },
                  unauthenticated: {
                    summary: "Usuario no autenticado",
                    value: {
                      user: null,
                      session: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/signout": {
      post: {
        tags: ["Autenticación"],
        summary: "Cerrar sesión",
        description: "Cierra la sesión actual del usuario",
        responses: {
          200: {
            description: "Sesión cerrada exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                  },
                },
                example: { success: true },
              },
            },
          },
        },
      },
    },
    "/api/user/profile": {
      get: {
        tags: ["Usuario"],
        summary: "Obtener perfil del usuario",
        description: "Retorna la información del perfil del usuario autenticado",
        security: [{ SessionAuth: [] }],
        responses: {
          200: {
            description: "Perfil obtenido exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
                example: {
                  id: "clx1234567890",
                  email: "usuario@ejemplo.com",
                  name: "Juan Pérez",
                  phone: "+57 300 123 4567",
                  role: "USER",
                  image: "https://avatars.githubusercontent.com/u/123456",
                  createdAt: "2024-01-01T12:00:00.000Z",
                  updatedAt: "2024-01-15T12:00:00.000Z",
                },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "No autenticado" },
              },
            },
          },
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Usuario no encontrado" },
              },
            },
          },
        },
      },
    },
    "/api/transactions": {
      get: {
        tags: ["Transacciones"],
        summary: "Listar transacciones",
        description:
          "Obtiene una lista paginada de transacciones. Los usuarios normales solo ven sus transacciones, los ADMIN ven todas.",
        security: [{ SessionAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Número de página",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Elementos por página",
            schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
          },
          {
            name: "type",
            in: "query",
            description: "Filtrar por tipo de transacción",
            schema: { type: "string", enum: ["INCOME", "EXPENSE"] },
          },
          {
            name: "search",
            in: "query",
            description: "Buscar por concepto",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Lista de transacciones obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    transactions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Transaction" },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
                example: {
                  transactions: [
                    {
                      id: "clx1234567890",
                      concept: "Salario enero",
                      amount: 3000000,
                      date: "2024-01-31T12:00:00.000Z",
                      type: "INCOME",
                      userId: "clx0987654321",
                      user: {
                        id: "clx0987654321",
                        name: "Juan Pérez",
                        email: "juan@ejemplo.com",
                      },
                    },
                  ],
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: 25,
                    pages: 3,
                  },
                },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "No autenticado" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Transacciones"],
        summary: "Crear transacción",
        description: "Crea una nueva transacción. Solo disponible para usuarios ADMIN.",
        security: [{ SessionAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  concept: { type: "string", description: "Concepto de la transacción" },
                  amount: { type: "number", description: "Monto de la transacción" },
                  date: { type: "string", format: "date", description: "Fecha de la transacción" },
                  type: { type: "string", enum: ["INCOME", "EXPENSE"], description: "Tipo de transacción" },
                },
                required: ["concept", "amount", "date", "type"],
              },
              example: {
                concept: "Venta de producto",
                amount: 150000,
                date: "2024-01-31",
                type: "INCOME",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Transacción creada exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Transaction" },
              },
            },
          },
          400: {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Todos los campos son requeridos" },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "No autenticado" },
              },
            },
          },
          403: {
            description: "Sin permisos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Solo los administradores pueden crear transacciones" },
              },
            },
          },
        },
      },
    },
    "/api/transactions/{id}": {
      get: {
        tags: ["Transacciones"],
        summary: "Obtener transacción por ID",
        description: "Obtiene una transacción específica por su ID",
        security: [{ SessionAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID de la transacción",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Transacción obtenida exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Transaction" },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Sin permisos para ver esta transacción",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Acceso denegado" },
              },
            },
          },
          404: {
            description: "Transacción no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Transacción no encontrada" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Transacciones"],
        summary: "Actualizar transacción",
        description: "Actualiza una transacción existente. Solo disponible para usuarios ADMIN.",
        security: [{ SessionAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID de la transacción",
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  concept: { type: "string" },
                  amount: { type: "number" },
                  date: { type: "string", format: "date" },
                  type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                },
              },
              example: {
                concept: "Venta de producto actualizada",
                amount: 200000,
                date: "2024-01-31",
                type: "INCOME",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Transacción actualizada exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Transaction" },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Sin permisos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Solo los administradores pueden editar transacciones" },
              },
            },
          },
          404: {
            description: "Transacción no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Transacciones"],
        summary: "Eliminar transacción",
        description: "Elimina una transacción existente. Solo disponible para usuarios ADMIN.",
        security: [{ SessionAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID de la transacción",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Transacción eliminada exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
                example: { message: "Transacción eliminada correctamente" },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Sin permisos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Solo los administradores pueden eliminar transacciones" },
              },
            },
          },
          404: {
            description: "Transacción no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/admin/users": {
      get: {
        tags: ["Administración - Usuarios"],
        summary: "Listar usuarios (Solo ADMIN)",
        description:
          "Obtiene una lista paginada de todos los usuarios del sistema. Solo disponible para administradores.",
        security: [{ SessionAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Número de página",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Elementos por página",
            schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
          },
          {
            name: "search",
            in: "query",
            description: "Buscar por nombre, email o teléfono",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Lista de usuarios obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: {
                        allOf: [
                          { $ref: "#/components/schemas/User" },
                          {
                            type: "object",
                            properties: {
                              _count: {
                                type: "object",
                                properties: {
                                  transactions: { type: "integer" },
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
                example: {
                  users: [
                    {
                      id: "clx1234567890",
                      email: "admin@ejemplo.com",
                      name: "Administrador",
                      phone: "+57 300 123 4567",
                      role: "ADMIN",
                      image: "https://avatars.githubusercontent.com/u/123456",
                      createdAt: "2024-01-01T12:00:00.000Z",
                      updatedAt: "2024-01-15T12:00:00.000Z",
                      _count: { transactions: 15 },
                    },
                  ],
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: 5,
                    pages: 1,
                  },
                },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Sin permisos de administrador",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Acceso denegado" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Administración - Usuarios"],
        summary: "Actualizar usuario (Solo ADMIN)",
        description: "Actualiza la información de un usuario. Solo disponible para administradores.",
        security: [{ SessionAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string", description: "ID del usuario a actualizar" },
                  name: { type: "string", description: "Nuevo nombre del usuario" },
                  phone: { type: "string", description: "Nuevo teléfono del usuario" },
                  role: { type: "string", enum: ["USER", "ADMIN"], description: "Nuevo rol del usuario" },
                },
                required: ["userId"],
              },
              example: {
                userId: "clx1234567890",
                name: "Juan Pérez Actualizado",
                phone: "+57 300 999 8888",
                role: "ADMIN",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuario actualizado exitosamente",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/User" },
                    {
                      type: "object",
                      properties: {
                        _count: {
                          type: "object",
                          properties: {
                            transactions: { type: "integer" },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "userId es requerido" },
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Sin permisos de administrador",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/admin/reports": {
      get: {
        tags: ["Administración - Reportes"],
        summary: "Generar reportes financieros (Solo ADMIN)",
        description:
          "Genera reportes financieros con estadísticas, gráficos y opción de exportación CSV. Solo disponible para administradores.",
        security: [{ SessionAuth: [] }],
        parameters: [
          {
            name: "period",
            in: "query",
            description: "Período del reporte",
            schema: { type: "string", enum: ["week", "month", "year"], default: "month" },
          },
          {
            name: "format",
            in: "query",
            description: "Formato de respuesta",
            schema: { type: "string", enum: ["json", "csv"], default: "json" },
          },
        ],
        responses: {
          200: {
            description: "Reporte generado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    summary: { $ref: "#/components/schemas/ReportSummary" },
                    chartData: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ChartData" },
                    },
                    categoryStats: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CategoryStats" },
                    },
                    transactions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Transaction" },
                      description: "Últimas 10 transacciones para resumen",
                    },
                  },
                },
                example: {
                  summary: {
                    totalIncome: 5000000,
                    totalExpense: 3000000,
                    balance: 2000000,
                    transactionCount: 25,
                    period: "month",
                    startDate: "2024-01-01T00:00:00.000Z",
                    endDate: "2024-01-31T23:59:59.999Z",
                  },
                  chartData: [
                    {
                      date: "2024-01-15",
                      income: 500000,
                      expense: 200000,
                    },
                  ],
                  categoryStats: [
                    {
                      concept: "Salario",
                      income: 3000000,
                      expense: 0,
                      count: 1,
                    },
                  ],
                },
              },
              "text/csv": {
                schema: { type: "string" },
                example: "Fecha,Concepto,Monto,Tipo,Usuario\n2024-01-31,Salario enero,3000000,Ingreso,Juan Pérez",
              },
            },
          },
          401: {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Sin permisos de administrador",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Autenticación",
      description: "Endpoints para manejo de sesiones y autenticación",
    },
    {
      name: "Usuario",
      description: "Endpoints para gestión del perfil de usuario",
    },
    {
      name: "Transacciones",
      description: "Endpoints para gestión de ingresos y egresos",
    },
    {
      name: "Administración - Usuarios",
      description: "Endpoints administrativos para gestión de usuarios (Solo ADMIN)",
    },
    {
      name: "Administración - Reportes",
      description: "Endpoints administrativos para reportes financieros (Solo ADMIN)",
    },
  ],
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Retornar la especificación OpenAPI
    res.status(200).json(swaggerSpec)
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).json({ error: "Método no permitido" })
  }
}
