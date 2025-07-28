/**
 * Utilidades para cálculos financieros
 * Este módulo contiene funciones puras para realizar cálculos relacionados con transacciones financieras
 */

export interface Transaction {
  id: string
  amount: number
  type: "INCOME" | "EXPENSE"
  date: string
  concept: string
}

/**
 * Calcula el saldo total basado en una lista de transacciones
 * @param transactions - Array de transacciones
 * @returns El saldo total (ingresos - egresos)
 *
 * @example
 * ```typescript
 * const transactions = [
 *   { id: '1', amount: 1000, type: 'INCOME', date: '2024-01-01', concept: 'Salario' },
 *   { id: '2', amount: 500, type: 'EXPENSE', date: '2024-01-02', concept: 'Compras' }
 * ]
 * const balance = calculateBalance(transactions) // 500
 * ```
 */
export function calculateBalance(transactions: Transaction[]): number {
  if (!Array.isArray(transactions)) {
    throw new Error("Las transacciones deben ser un array")
  }

  return transactions.reduce((balance, transaction) => {
    // Validar que la transacción tenga la estructura correcta
    if (!transaction || typeof transaction.amount !== "number" || !transaction.type) {
      throw new Error("Transacción inválida: debe tener amount (número) y type")
    }

    // Validar que el tipo sea válido
    if (transaction.type !== "INCOME" && transaction.type !== "EXPENSE") {
      throw new Error(`Tipo de transacción inválido: ${transaction.type}. Debe ser 'INCOME' o 'EXPENSE'`)
    }

    // Sumar ingresos y restar egresos
    return transaction.type === "INCOME" ? balance + transaction.amount : balance - transaction.amount
  }, 0)
}

/**
 * Calcula el total de ingresos de una lista de transacciones
 * @param transactions - Array de transacciones
 * @returns El total de ingresos
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  if (!Array.isArray(transactions)) {
    throw new Error("Las transacciones deben ser un array")
  }

  return transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calcula el total de egresos de una lista de transacciones
 * @param transactions - Array de transacciones
 * @returns El total de egresos
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  if (!Array.isArray(transactions)) {
    throw new Error("Las transacciones deben ser un array")
  }

  return transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calcula estadísticas financieras completas
 * @param transactions - Array de transacciones
 * @returns Objeto con estadísticas financieras
 */
export function calculateFinancialStats(transactions: Transaction[]) {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const balance = totalIncome - totalExpenses
  const transactionCount = transactions.length

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactionCount,
    averageIncome: transactionCount > 0 ? totalIncome / transactionCount : 0,
    averageExpense: transactionCount > 0 ? totalExpenses / transactionCount : 0,
  }
}

/**
 * Filtra transacciones por período de tiempo
 * @param transactions - Array de transacciones
 * @param startDate - Fecha de inicio (ISO string)
 * @param endDate - Fecha de fin (ISO string)
 * @returns Array de transacciones filtradas
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  startDate: string,
  endDate: string,
): Transaction[] {
  if (!Array.isArray(transactions)) {
    throw new Error("Las transacciones deben ser un array")
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Las fechas deben ser válidas")
  }

  if (start > end) {
    throw new Error("La fecha de inicio debe ser anterior a la fecha de fin")
  }

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= start && transactionDate <= end
  })
}
