"use client"

import Head from "next/head"
import type { GetServerSideProps } from "next"
import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/layout"
import { requireAuth, type AuthUser } from "@/lib/auth-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IncomeExpenseChart } from "@/components/reports/income-expense-chart"
import { CategoryStats } from "@/components/reports/category-stats"
import { Download, BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface ReportData {
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
    transactionCount: number
    period: string
    startDate: string
    endDate: string
  }
  chartData: Array<{
    date: string
    income: number
    expense: number
  }>
  categoryStats: Array<{
    concept: string
    income: number
    expense: number
    count: number
  }>
}

interface ReportsProps {
  user: AuthUser
}

export default function Reports({ user }: ReportsProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [period])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/reports?period=${period}`)
      const data = await response.json()

      if (response.ok) {
        setReportData(data)
      } else {
        console.error("Error fetching report data:", data.error)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = async () => {
    try {
      setDownloading(true)
      const response = await fetch(`/api/admin/reports?period=${period}&format=csv`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `reporte-${period}-${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Error downloading CSV")
      }
    } catch (error) {
      console.error("Error downloading CSV:", error)
    } finally {
      setDownloading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO")
  }

  return (
    <>
      <Head>
        <title>Reportes - Mi Proyecto</title>
        <meta name="description" content="Reportes financieros y análisis de datos" />
      </Head>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Reportes Financieros</h1>
            <p className="text-muted-foreground mt-2">Análisis detallado de ingresos y egresos</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleDownloadCSV} disabled={downloading || !reportData}>
              <Download className="mr-2 h-4 w-4" />
              {downloading ? "Descargando..." : "Descargar CSV"}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando reportes...</p>
            </div>
          ) : reportData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(reportData.summary.totalIncome)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Período: {formatDate(reportData.summary.startDate)} - {formatDate(reportData.summary.endDate)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(reportData.summary.totalExpense)}
                    </div>
                    <p className="text-xs text-muted-foreground">{reportData.summary.transactionCount} transacciones</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        reportData.summary.balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(reportData.summary.balance)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {reportData.summary.balance >= 0 ? "Superávit" : "Déficit"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.summary.transactionCount}</div>
                    <p className="text-xs text-muted-foreground">En el período seleccionado</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <IncomeExpenseChart data={reportData.chartData} />
                <CategoryStats data={reportData.categoryStats} />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Error cargando los reportes</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context, { requiredRole: "ADMIN" })
}
