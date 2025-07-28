"use client"

// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Mock de Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock de variables de entorno para pruebas
process.env.NEXTAUTH_URL = "http://localhost:3000"
process.env.NEXTAUTH_SECRET = "test-secret"
process.env.GITHUB_ID = "test-github-id"
process.env.GITHUB_SECRET = "test-github-secret"
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test"

// Suprimir warnings de console durante las pruebas
const originalError = console.error

beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Warning: ReactDOM.render is no longer supported")) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Mock global de fetch
global.fetch = jest.fn()

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks()
})