/**
 * Pruebas unitarias para validación de formularios
 * Estas pruebas verifican que las funciones de validación funcionen correctamente
 */

import {
  validateTransactionForm,
  validateUserForm,
  isValidEmail,
  validatePassword,
  type TransactionFormData,
  type UserFormData,
} from "@/lib/form-validation"

describe("Validación de Formularios", () => {
  describe("validateTransactionForm", () => {
    const validTransactionData: TransactionFormData = {
      concept: "Salario enero",
      amount: "1000",
      date: "2024-01-15",
      type: "INCOME",
    }

    it("debe validar correctamente un formulario válido", () => {
      const result = validateTransactionForm(validTransactionData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("debe validar correctamente con monto numérico", () => {
      const data = { ...validTransactionData, amount: 1000 }
      const result = validateTransactionForm(data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    describe("Validación de concepto", () => {
      it("debe fallar si el concepto está vacío", () => {
        const data = { ...validTransactionData, concept: "" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El concepto es requerido")
      })

      it("debe fallar si el concepto es muy corto", () => {
        const data = { ...validTransactionData, concept: "AB" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El concepto debe tener al menos 3 caracteres")
      })

      it("debe fallar si el concepto es muy largo", () => {
        const data = { ...validTransactionData, concept: "A".repeat(101) }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El concepto no puede tener más de 100 caracteres")
      })

      it("debe fallar si el concepto no es string", () => {
        const data = { ...validTransactionData, concept: null as any }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El concepto es requerido")
      })
    })

    describe("Validación de monto", () => {
      it("debe fallar si el monto está vacío", () => {
        const data = { ...validTransactionData, amount: "" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El monto es requerido")
      })

      it("debe fallar si el monto no es numérico", () => {
        const data = { ...validTransactionData, amount: "abc" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El monto debe ser un número válido")
      })

      it("debe fallar si el monto es cero o negativo", () => {
        const data1 = { ...validTransactionData, amount: "0" }
        const result1 = validateTransactionForm(data1)

        expect(result1.isValid).toBe(false)
        expect(result1.errors).toContain("El monto debe ser mayor a 0")

        const data2 = { ...validTransactionData, amount: "-100" }
        const result2 = validateTransactionForm(data2)

        expect(result2.isValid).toBe(false)
        expect(result2.errors).toContain("El monto debe ser mayor a 0")
      })

      it("debe fallar si el monto es demasiado grande", () => {
        const data = { ...validTransactionData, amount: "1000000000" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El monto no puede ser mayor a 999,999,999")
      })
    })

    describe("Validación de fecha", () => {
      it("debe fallar si la fecha está vacía", () => {
        const data = { ...validTransactionData, date: "" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("La fecha es requerida")
      })

      it("debe fallar si la fecha es inválida", () => {
        const data = { ...validTransactionData, date: "fecha-invalida" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("La fecha debe ser válida")
      })

      it("debe fallar si la fecha es muy antigua", () => {
        const data = { ...validTransactionData, date: "1899-12-31" }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("La fecha no puede ser anterior a 1900")
      })

      it("debe fallar si la fecha es muy futura", () => {
        const futureDate = new Date()
        futureDate.setFullYear(futureDate.getFullYear() + 2)
        const data = { ...validTransactionData, date: futureDate.toISOString().split("T")[0] }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("La fecha no puede ser más de 1 año en el futuro")
      })
    })

    describe("Validación de tipo", () => {
      it("debe fallar si el tipo está vacío", () => {
        const data = { ...validTransactionData, type: "" as any }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El tipo de transacción es requerido")
      })

      it("debe fallar si el tipo es inválido", () => {
        const data = { ...validTransactionData, type: "INVALID" as any }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El tipo debe ser INCOME o EXPENSE")
      })

      it("debe aceptar EXPENSE como tipo válido", () => {
        const data = { ...validTransactionData, type: "EXPENSE" as const }
        const result = validateTransactionForm(data)

        expect(result.isValid).toBe(true)
      })
    })
  })

  describe("validateUserForm", () => {
    const validUserData: UserFormData = {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      phone: "+57 300 123 4567",
      role: "USER",
    }

    it("debe validar correctamente un formulario válido", () => {
      const result = validateUserForm(validUserData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("debe validar correctamente sin teléfono", () => {
      const data = { ...validUserData, phone: undefined }
      const result = validateUserForm(data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    describe("Validación de nombre", () => {
      it("debe fallar si el nombre está vacío", () => {
        const data = { ...validUserData, name: "" }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El nombre es requerido")
      })

      it("debe fallar si el nombre es muy corto", () => {
        const data = { ...validUserData, name: "A" }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El nombre debe tener al menos 2 caracteres")
      })

      it("debe fallar si el nombre es muy largo", () => {
        const data = { ...validUserData, name: "A".repeat(51) }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El nombre no puede tener más de 50 caracteres")
      })
    })

    describe("Validación de email", () => {
      it("debe fallar si el email es inválido", () => {
        const data = { ...validUserData, email: "email-invalido" }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El email debe tener un formato válido")
      })

      it("debe fallar si el email es muy largo", () => {
        const data = { ...validUserData, email: "a".repeat(90) + "@ejemplo.com" }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El email no puede tener más de 100 caracteres")
      })
    })

    describe("Validación de teléfono", () => {
      it("debe fallar si el teléfono tiene formato inválido", () => {
        const data = { ...validUserData, phone: "telefono-invalido" }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El teléfono debe tener un formato válido")
      })

      it("debe aceptar diferentes formatos de teléfono válidos", () => {
        const validPhones = ["+57 300 123 4567", "300-123-4567", "(300) 123-4567", "3001234567"]

        validPhones.forEach((phone) => {
          const data = { ...validUserData, phone }
          const result = validateUserForm(data)
          expect(result.isValid).toBe(true)
        })
      })
    })

    describe("Validación de rol", () => {
      it("debe fallar si el rol es inválido", () => {
        const data = { ...validUserData, role: "INVALID" as any }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(false)
        expect(result.errors).toContain("El rol debe ser USER o ADMIN")
      })

      it("debe aceptar ADMIN como rol válido", () => {
        const data = { ...validUserData, role: "ADMIN" as const }
        const result = validateUserForm(data)

        expect(result.isValid).toBe(true)
      })
    })
  })

  describe("isValidEmail", () => {
    it("debe validar emails correctos", () => {
      const validEmails = [
        "test@ejemplo.com",
        "usuario.nombre@dominio.co",
        "admin+tag@sitio.org",
        "user123@test-domain.com",
      ]

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it("debe rechazar emails incorrectos", () => {
      const invalidEmails = [
        "",
        "email-sin-arroba",
        "@dominio.com",
        "usuario@",
        "usuario@dominio",
        "usuario..doble@dominio.com",
      ]

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false)
      })

      // Casos especiales para null y undefined
      expect(isValidEmail(null as any)).toBe(false)
      expect(isValidEmail(undefined as any)).toBe(false)
    })
  })

  describe("validatePassword", () => {
    it("debe validar una contraseña fuerte", () => {
      const result = validatePassword("MiContraseña123!")

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("debe fallar si la contraseña es muy corta", () => {
      const result = validatePassword("Abc1!")

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("La contraseña debe tener al menos 8 caracteres")
    })

    it("debe fallar si falta mayúscula", () => {
      const result = validatePassword("minuscula123!")

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("La contraseña debe contener al menos una letra mayúscula")
    })

    it("debe fallar si falta minúscula", () => {
      const result = validatePassword("MAYUSCULA123!")

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("La contraseña debe contener al menos una letra minúscula")
    })

    it("debe fallar si falta número", () => {
      const result = validatePassword("SinNumeros!")

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("La contraseña debe contener al menos un número")
    })

    it("debe fallar si falta carácter especial", () => {
      const result = validatePassword("SinEspeciales123")

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("La contraseña debe contener al menos un carácter especial")
    })
  })
})
