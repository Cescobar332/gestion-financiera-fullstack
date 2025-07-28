"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ChartData {
  date: string
  income: number
  expense: number
}

interface IncomeExpenseChartProps {
  data: ChartData[]
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Egresos</CardTitle>
          <CardDescription>No hay datos disponibles para mostrar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Sin datos para el período seleccionado</div>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.income, d.expense)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Egresos</CardTitle>
        <CardDescription>Comparación diaria de ingresos y egresos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{new Date(item.date).toLocaleDateString("es-CO")}</span>
                <div className="flex gap-4">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />${item.income.toLocaleString()}
                  </span>
                  <span className="text-red-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />${item.expense.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 h-6">
                <div
                  className="bg-green-500 rounded-l"
                  style={{
                    width: `${maxValue > 0 ? (item.income / maxValue) * 100 : 0}%`,
                  }}
                />
                <div
                  className="bg-red-500 rounded-r"
                  style={{
                    width: `${maxValue > 0 ? (item.expense / maxValue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span>Ingresos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span>Egresos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
