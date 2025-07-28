/**
 * Pruebas unitarias para cálculos financieros
 * Estas pruebas verifican que las funciones de cálculo financiero funcionen correctamente
 */

import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateFinancialStats,
  filterTransactionsByPeriod,
  type Transaction,
} from "@/lib/financial-calculations"

// Datos de prueba
const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1000,
    type: "INCOME",
    date: "2024-01-15",
    concept: "Salario",
  },
  {
    id: "2",
    amount: 500,
    type: "EXPENSE",
    date: "2024-01-16",
    concept: "Compras",
  },
  {
    id: "3",
    amount: 2000,
    type: "INCOME",
    date: "2024-01-17",
    concept: "Freelance",
  },
  {
    id: "4",
    amount: 300,
    type: "EXPENSE",
    date: "2024-01-18",
    concept: "Transporte",
  },
]

describe("Cálculos Financieros", () => {
  describe("calculateBalance", () => {
    it("debe calcular correctamente el saldo con transacciones mixtas", () => {
      const balance = calculateBalance(mockTransactions)
      // Ingresos: 1000 + 2000 = 3000
      // Egresos: 500 + 300 = 800
      // Saldo: 3000 - 800 = 2200
      expect(balance).toBe(2200)
    })

    it("debe retornar 0 para un array vacío", () => {
      const balance = calculateBalance([])
      expect(balance).toBe(0)
    })

    it("debe calcular correctamente solo con ingresos", () => {
      const incomeOnly: Transaction[] = [
        { id: "1", amount: 1000, type: "INCOME", date: "2024-01-01", concept: "Salario" },
        { id: "2", amount: 500, type: "INCOME", date: "2024-01-02", concept: "Bonus" },
      ]
      const balance = calculateBalance(incomeOnly)
      expect(balance).toBe(1500)
    })

    it("debe calcular correctamente solo con egresos", () => {
      const expensesOnly: Transaction[] = [
        { id: "1", amount: 300, type: "EXPENSE", date: "2024-01-01", concept: "Comida" },
        { id: "2", amount: 200, type: "EXPENSE", date: "2024-01-02", concept: "Transporte" },
      ]
      const balance = calculateBalance(expensesOnly)
      expect(balance).toBe(-500)
    })

    it("debe manejar montos decimales correctamente", () => {
      const decimalTransactions: Transaction[] = [
        { id: "1", amount: 1000.5, type: "INCOME", date: "2024-01-01", concept: "Salario" },
        { id: "2", amount: 250.25, type: "EXPENSE", date: "2024-01-02", concept: "Compras" },
      ]
      const balance = calculateBalance(decimalTransactions)
      expect(balance).toBe(750.25)
    })

    it("debe lanzar error si el parámetro no es un array", () => {
      expect(() => calculateBalance(null as any)).toThrow("Las transacciones deben ser un array")
      expect(() => calculateBalance(undefined as any)).toThrow("Las transacciones deben ser un array")
      expect(() => calculateBalance("invalid" as any)).toThrow("Las transacciones deben ser un array")
    })

    it("debe lanzar error si una transacción es inválida", () => {
      const invalidTransactions = [
        { id: "1", amount: "invalid", type: "INCOME", date: "2024-01-01", concept: "Test" },
      ] as any
      expect(() => calculateBalance(invalidTransactions)).toThrow("Transacción inválida")
    })

    it("debe lanzar error si el tipo de transacción es inválido", () => {
      const invalidTypeTransactions = [
        { id: "1", amount: 1000, type: "INVALID", date: "2024-01-01", concept: "Test" },
      ] as any
      expect(() => calculateBalance(invalidTypeTransactions)).toThrow("Tipo de transacción inválido")
    })
  })

  describe("calculateTotalIncome", () => {
    it("debe calcular correctamente el total de ingresos", () => {
      const totalIncome = calculateTotalIncome(mockTransactions)
      expect(totalIncome).toBe(3000) // 1000 + 2000
    })

    it("debe retornar 0 si no hay ingresos", () => {
      const expensesOnly: Transaction[] = [
        { id: "1", amount: 500, type: "EXPENSE", date: "2024-01-01", concept: "Compras" },
      ]
      const totalIncome = calculateTotalIncome(expensesOnly)
      expect(totalIncome).toBe(0)
    })

    it("debe retornar 0 para array vacío", () => {
      const totalIncome = calculateTotalIncome([])
      expect(totalIncome).toBe(0)
    })
  })

  describe("calculateTotalExpenses", () => {
    it("debe calcular correctamente el total de egresos", () => {
      const totalExpenses = calculateTotalExpenses(mockTransactions)
      expect(totalExpenses).toBe(800) // 500 + 300
    })

    it("debe retornar 0 si no hay egresos", () => {
      const incomeOnly: Transaction[] = [
        { id: "1", amount: 1000, type: "INCOME", date: "2024-01-01", concept: "Salario" },
      ]
      const totalExpenses = calculateTotalExpenses(incomeOnly)
      expect(totalExpenses).toBe(0)
    })
  })

  describe("calculateFinancialStats", () => {
    it("debe calcular todas las estadísticas correctamente", () => {
      const stats = calculateFinancialStats(mockTransactions)

      expect(stats.totalIncome).toBe(3000)
      expect(stats.totalExpenses).toBe(800)
      expect(stats.balance).toBe(2200)
      expect(stats.transactionCount).toBe(4)
      expect(stats.averageIncome).toBe(750) // 3000 / 4
      expect(stats.averageExpense).toBe(200) // 800 / 4
    })

    it("debe manejar array vacío sin errores", () => {
      const stats = calculateFinancialStats([])

      expect(stats.totalIncome).toBe(0)
      expect(stats.totalExpenses).toBe(0)
      expect(stats.balance).toBe(0)
      expect(stats.transactionCount).toBe(0)
      expect(stats.averageIncome).toBe(0)
      expect(stats.averageExpense).toBe(0)
    })
  })

  describe("filterTransactionsByPeriod", () => {
    it("debe filtrar transacciones por período correctamente", () => {
      const filtered = filterTransactionsByPeriod(mockTransactions, "2024-01-16", "2024-01-17")

      expect(filtered).toHaveLength(2)
      expect(filtered[0].id).toBe("2")
      expect(filtered[1].id).toBe("3")
    })

    it("debe retornar array vacío si no hay transacciones en el período", () => {
      const filtered = filterTransactionsByPeriod(mockTransactions, "2024-02-01", "2024-02-28")

      expect(filtered).toHaveLength(0)
    })

    it("debe lanzar error si las fechas son inválidas", () => {
      expect(() => filterTransactionsByPeriod(mockTransactions, "invalid", "2024-01-01")).toThrow(
        "Las fechas deben ser válidas",
      )
    })

    it("debe lanzar error si la fecha de inicio es posterior a la de fin", () => {
      expect(() => filterTransactionsByPeriod(mockTransactions, "2024-01-31", "2024-01-01")).toThrow(
        "La fecha de inicio debe ser anterior a la fecha de fin",
      )
    })
  })
})
