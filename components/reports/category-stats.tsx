"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CategoryData {
  concept: string
  income: number
  expense: number
  count: number
}

interface CategoryStatsProps {
  data: CategoryData[]
}

export function CategoryStats({ data }: CategoryStatsProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas por Categoría</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Sin categorías para mostrar</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas por Categoría</CardTitle>
        <CardDescription>Transacciones agrupadas por concepto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 10).map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{category.concept}</h4>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                  {category.income > 0 && <span className="text-green-600">+${category.income.toLocaleString()}</span>}
                  {category.expense > 0 && <span className="text-red-600">-${category.expense.toLocaleString()}</span>}
                </div>
              </div>
              <Badge variant="outline">{category.count} transacciones</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
