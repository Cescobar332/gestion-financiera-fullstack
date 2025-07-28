"use client"


import Head from "next/head"
import type { GetServerSideProps } from "next"
import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/layout"
import { requireAuth, type AuthUser } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog"
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react"

interface Transaction {
  id: string
  concept: string
  amount: number
  date: string
  type: "INCOME" | "EXPENSE"
  user: {
    id: string
    name: string
    email: string
  }
}

interface TransactionsProps {
  user: AuthUser
}

export default function Transactions({ user }: TransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const isAdmin = user.role === "ADMIN"

  useEffect(() => {
    fetchTransactions()
  }, [searchTerm, typeFilter])

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (typeFilter !== "all") params.append("type", typeFilter)

      const response = await fetch(`/api/transactions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions)
      } else {
        console.error("Error fetching transactions:", data.error)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async (formData: any) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        fetchTransactions()
    } else {
      const data = await response.json()
      throw new Error(data.error)
    }
  }

  const handleUpdateTransaction = async (formData: any) => {
    if (!editingTransaction) return

    const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setEditingTransaction(null)
        fetchTransactions()
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    }

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return

    const response = await fetch(`/api/transactions/${deletingTransaction.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setDeletingTransaction(null)
      fetchTransactions()
    } else {
      const data = await response.json()
      throw new Error(data.error)
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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.concept.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  return (
    <>
      <Head>
        <title>Transacciones - Mi Proyecto</title>
        <meta name="description" content="Gestión de ingresos y egresos" />
      </Head>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Transacciones</h1>
            <p className="text-muted-foreground mt-2">Gestiona tus ingresos y egresos</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(balance)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por concepto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="INCOME">Ingresos</SelectItem>
                <SelectItem value="EXPENSE">Egresos</SelectItem>
              </SelectContent>
            </Select>
            {isAdmin && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Transacción
              </Button>
            )}
          </div>

          {/* Transaction Form */}
          {(showForm || editingTransaction) && isAdmin && (
            <div className="mb-6">
              <TransactionForm
                transaction={editingTransaction}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
                onCancel={() => {
                  setShowForm(false)
                  setEditingTransaction(null)
                }}
                isEditing={!!editingTransaction}
                      />
                    </div>
                    
          )}

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Transacciones</CardTitle>
              <CardDescription>{filteredTransactions.length} transacciones encontradas</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Cargando transacciones...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No se encontraron transacciones</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      {isAdmin && <TableHead>Usuario</TableHead>}
                      {isAdmin && <TableHead>Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.concept}</TableCell>
                        <TableCell>
                          <span
                            className={
                              transaction.type === "INCOME"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {transaction.type === "INCOME" ? "+" : "-"}
                            {formatCurrency(Number(transaction.amount))}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === "INCOME" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "INCOME" ? "Ingreso" : "Egreso"}
                          </span>
                        </TableCell>
                        {isAdmin && <TableCell>{transaction.user.name || transaction.user.email}</TableCell>}
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingTransaction(transaction)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setDeletingTransaction(transaction)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Delete Dialog */}
          <DeleteTransactionDialog
            transaction={deletingTransaction}
            open={!!deletingTransaction}
            onOpenChange={(open) => !open && setDeletingTransaction(null)}
            onConfirm={handleDeleteTransaction}
          />
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context)
}
