"use client"

/**
 * Pruebas unitarias para el componente TransactionForm
 * Estas pruebas verifican que el formulario de transacciones funcione correctamente
 */

import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TransactionForm } from "@/components/transactions/transaction-form"
import React from "react"

// Mock de los componentes UI
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, type, variant, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}))

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange, ...props }: any) => (
    <div data-testid="select" data-value={value} {...props}>
      <select
        id="type"
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        data-testid="select-input"
      >
        <option value="INCOME">Ingreso</option>
        <option value="EXPENSE">Egreso</option>
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}))

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor, ...props }: any) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  ),
}))

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange, id = "type", ...props }: any) => (
    <div data-testid="select" data-value={value} {...props}>
      <select
        id={id}
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        data-testid="select-input"
      >
        <option value="INCOME">Ingreso</option>
        <option value="EXPENSE">Egreso</option>
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}))

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h2 data-testid="card-title" {...props}>
      {children}
    </h2>
  ),
}))

describe("TransactionForm", () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isEditing: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe renderizar el formulario correctamente", () => {
    render(<TransactionForm {...defaultProps} />)

    expect(screen.getByText("Nueva Transacción")).toBeInTheDocument()
    expect(screen.getByText("Agrega un nuevo ingreso o egreso")).toBeInTheDocument()
    expect(screen.getByLabelText("Concepto")).toBeInTheDocument()
    expect(screen.getByLabelText("Monto")).toBeInTheDocument()
    expect(screen.getByLabelText("Fecha")).toBeInTheDocument()
    expect(screen.getByTestId("select-input")).toBeInTheDocument()
    expect(screen.getByText("Crear Transacción")).toBeInTheDocument()
    expect(screen.getByText("Cancelar")).toBeInTheDocument()
  })

  it("debe mostrar título de edición cuando isEditing es true", () => {
    render(<TransactionForm {...defaultProps} isEditing={true} />)

    expect(screen.getByText("Editar Transacción")).toBeInTheDocument()
    expect(screen.getByText("Modifica los datos de la transacción")).toBeInTheDocument()
    expect(screen.getByText("Actualizar")).toBeInTheDocument()
  })

  it("debe prellenar el formulario con datos de transacción existente", () => {
    const existingTransaction = {
      id: "1",
      concept: "Salario",
      amount: 1000,
      date: "2024-01-15",
      type: "INCOME" as const,
    }

    render(<TransactionForm {...defaultProps} transaction={existingTransaction} isEditing={true} />)

    expect(screen.getByDisplayValue("Salario")).toBeInTheDocument()
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument()
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument()
  })

  it("debe llamar onSubmit con los datos correctos", async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    // Llenar el formulario usando act
    await act(async () => {
      await user.clear(screen.getByLabelText("Concepto"))
      await user.type(screen.getByLabelText("Concepto"), "Salario enero")
    })

    await act(async () => {
      await user.clear(screen.getByLabelText("Monto"))
      await user.type(screen.getByLabelText("Monto"), "1000")
    })

    await act(async () => {
      await user.clear(screen.getByLabelText("Fecha"))
      await user.type(screen.getByLabelText("Fecha"), "2024-01-15")
    })

    // Enviar formulario
    await act(async () => {
      await user.click(screen.getByText("Crear Transacción"))
    })

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        concept: "Salario enero",
        amount: "1000",
        date: "2024-01-15",
        type: "INCOME",
      })
    })
  })

  it("debe llamar onCancel cuando se hace clic en cancelar", async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    await act(async () => {
      await user.click(screen.getByText("Cancelar"))
    })

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it("debe deshabilitar el botón de envío durante la carga", async () => {
    const slowOnSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    const user = userEvent.setup()

    render(<TransactionForm {...defaultProps} onSubmit={slowOnSubmit} />)

    // Llenar campos requeridos
    await act(async () => {
      await user.type(screen.getByLabelText("Concepto"), "Test")
      await user.type(screen.getByLabelText("Monto"), "100")
    })

    // Enviar formulario
    await act(async () => {
      await user.click(screen.getByText("Crear Transacción"))
    })

    // El botón debe estar deshabilitado y mostrar texto de carga
    expect(screen.getByText("Guardando...")).toBeInTheDocument()
    expect(screen.getByText("Guardando...")).toBeDisabled()
  })

  it("debe validar campos requeridos", async () => {
    render(<TransactionForm {...defaultProps} />)

    // Los campos requeridos deben tener el atributo required
    expect(screen.getByLabelText("Concepto")).toBeRequired()
    expect(screen.getByLabelText("Monto")).toBeRequired()
    expect(screen.getByLabelText("Fecha")).toBeRequired()
  })

  it("debe establecer la fecha actual por defecto", () => {
    render(<TransactionForm {...defaultProps} />)

    const dateInput = screen.getByLabelText("Fecha") as HTMLInputElement
    const today = new Date().toISOString().split("T")[0]

    expect(dateInput.value).toBe(today)
  })

  it("debe manejar errores en onSubmit sin mostrar console.error", async () => {
    // Mock console.error para este test específico
    const originalConsoleError = console.error
    console.error = jest.fn()

    const errorOnSubmit = jest.fn().mockRejectedValue(new Error("Error de prueba"))
    const user = userEvent.setup()

    render(<TransactionForm {...defaultProps} onSubmit={errorOnSubmit} />)

    // Llenar campos requeridos
    await act(async () => {
      await user.type(screen.getByLabelText("Concepto"), "Test")
      await user.type(screen.getByLabelText("Monto"), "100")
    })

    // Enviar formulario
    await act(async () => {
      await user.click(screen.getByText("Crear Transacción"))
    })

    await waitFor(() => {
      expect(errorOnSubmit).toHaveBeenCalled()
    })

    // El botón debe volver a estar habilitado después del error
    await waitFor(() => {
      expect(screen.getByText("Crear Transacción")).not.toBeDisabled()
    })

    // Restaurar console.error
    console.error = originalConsoleError
  })
})
