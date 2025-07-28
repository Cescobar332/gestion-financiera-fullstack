/**
 * Utilidades para validación de formularios
 * Este módulo contiene funciones para validar datos de entrada en formularios
 */

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Datos de transacción para validación
 */
export interface TransactionFormData {
  concept: string
  amount: string | number
  date: string
  type: "INCOME" | "EXPENSE"
}

/**
 * Datos de usuario para validación
 */
export interface UserFormData {
  name: string
  email: string
  phone?: string
  role: "USER" | "ADMIN"
}

/**
 * Valida los datos de un formulario de transacción
 * @param data - Datos del formulario de transacción
 * @returns Resultado de la validación
 *
 * @example
 * ```typescript
 * const formData = {
 *   concept: 'Salario',
 *   amount: '1000',
 *   date: '2024-01-01',
 *   type: 'INCOME'
 * }
 * const result = validateTransactionForm(formData)
 * if (result.isValid) {
 *   // Procesar formulario
 * } else {
 *   // Mostrar errores: result.errors
 * }
 * ```
 */
export function validateTransactionForm(data: TransactionFormData): ValidationResult {
  const errors: string[] = []

  // Validar concepto
  if (!data.concept || typeof data.concept !== "string") {
    errors.push("El concepto es requerido")
  } else if (data.concept.trim().length === 0) {
    errors.push("El concepto no puede estar vacío")
  } else if (data.concept.trim().length < 3) {
    errors.push("El concepto debe tener al menos 3 caracteres")
  } else if (data.concept.trim().length > 100) {
    errors.push("El concepto no puede tener más de 100 caracteres")
  }

  // Validar monto
  if (data.amount === undefined || data.amount === null || data.amount === "") {
    errors.push("El monto es requerido")
  } else {
    const amount = typeof data.amount === "string" ? Number.parseFloat(data.amount) : data.amount

    if (isNaN(amount)) {
      errors.push("El monto debe ser un número válido")
    } else if (amount <= 0) {
      errors.push("El monto debe ser mayor a 0")
    } else if (amount > 999999999) {
      errors.push("El monto no puede ser mayor a 999,999,999")
    }
  }

  // Validar fecha
  if (!data.date || typeof data.date !== "string") {
    errors.push("La fecha es requerida")
  } else {
    const date = new Date(data.date)
    if (isNaN(date.getTime())) {
      errors.push("La fecha debe ser válida")
    } else {
      const today = new Date()
      const maxDate = new Date()
      maxDate.setFullYear(today.getFullYear() + 1) // Máximo 1 año en el futuro

      if (date > maxDate) {
        errors.push("La fecha no puede ser más de 1 año en el futuro")
      }

      const minDate = new Date("1900-01-01")
      if (date < minDate) {
        errors.push("La fecha no puede ser anterior a 1900")
      }
    }
  }

  // Validar tipo
  if (!data.type) {
    errors.push("El tipo de transacción es requerido")
  } else if (data.type !== "INCOME" && data.type !== "EXPENSE") {
    errors.push("El tipo debe ser INCOME o EXPENSE")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Valida los datos de un formulario de usuario
 * @param data - Datos del formulario de usuario
 * @returns Resultado de la validación
 */
export function validateUserForm(data: UserFormData): ValidationResult {
  const errors: string[] = []

  // Validar nombre
  if (!data.name || typeof data.name !== "string") {
    errors.push("El nombre es requerido")
  } else if (data.name.trim().length === 0) {
    errors.push("El nombre no puede estar vacío")
  } else if (data.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres")
  } else if (data.name.trim().length > 50) {
    errors.push("El nombre no puede tener más de 50 caracteres")
  }

  // Validar email
  if (!data.email || typeof data.email !== "string") {
    errors.push("El email es requerido")
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push("El email debe tener un formato válido")
    } else if (data.email.length > 100) {
      errors.push("El email no puede tener más de 100 caracteres")
    }
  }

  // Validar teléfono (opcional)
  if (data.phone && typeof data.phone === "string" && data.phone.trim().length > 0) {
    const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/
    if (!phoneRegex.test(data.phone.trim())) {
      errors.push("El teléfono debe tener un formato válido")
    }
  }

  // Validar rol
  if (!data.role) {
    errors.push("El rol es requerido")
  } else if (data.role !== "USER" && data.role !== "ADMIN") {
    errors.push("El rol debe ser USER o ADMIN")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Valida una dirección de email
 * @param email - Email a validar
 * @returns true si el email es válido
 */


export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false
  if (!email) return false
  if (email.includes("..")) return false
  // Regex básica para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 100
}
/**
 * Valida una contraseña (para futuras implementaciones)
 * @param password - Contraseña a validar
 * @returns Resultado de la validación
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password || typeof password !== "string") {
    errors.push("La contraseña es requerida")
  } else {
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres")
    }
    if (password.length > 128) {
      errors.push("La contraseña no puede tener más de 128 caracteres")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe contener al menos una letra mayúscula")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("La contraseña debe contener al menos una letra minúscula")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("La contraseña debe contener al menos un número")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("La contraseña debe contener al menos un carácter especial")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
