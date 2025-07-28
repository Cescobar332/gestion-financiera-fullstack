import { render, screen } from "@testing-library/react"
import { UserMenu } from "@/components/auth/user-menu"

// Mock del hook useAuth
const mockUseAuth = jest.fn()
jest.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock de los componentes
jest.mock("@/components/auth/signin-button", () => ({
  SignInButton: () => <button>Iniciar sesión</button>,
}))

jest.mock("@/components/auth/signout-button", () => ({
  SignOutButton: ({ children, ...props }: any) => <button {...props}>{children || "Cerrar sesión"}</button>,
}))

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="avatar" {...props}>
      {children}
    </div>
  ),
  AvatarFallback: ({ children, ...props }: any) => (
    <div data-testid="avatar-fallback" {...props}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt, ...props }: any) => (
    <img src={src || "/placeholder.svg"} alt={alt} data-testid="avatar-image" {...props} />
  ),
}))

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, asChild, ...props }: any) =>
    asChild ? (
      children
    ) : (
      <div data-testid="dropdown-item" {...props}>
        {children}
      </div>
    ),
  DropdownMenuLabel: ({ children }: any) => <div data-testid="dropdown-label">{children}</div>,
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
  DropdownMenuTrigger: ({ children, asChild, ...props }: any) =>
    asChild ? children : <button {...props}>{children}</button>,
}))

jest.mock("next/link", () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

describe("UserMenu", () => {
  const mockUser = {
    id: "user-123",
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    role: "USER",
    image: "https://example.com/avatar.jpg",
  }

  const mockAdminUser = {
    ...mockUser,
    role: "ADMIN",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe mostrar SignInButton cuando el usuario no está autenticado", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    })

    render(<UserMenu />)

    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument()
    expect(screen.queryByTestId("avatar")).not.toBeInTheDocument()
  })

  it("debe mostrar el menú de usuario cuando está autenticado", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(<UserMenu />)

    expect(screen.getByTestId("avatar")).toBeInTheDocument()
    expect(screen.getByTestId("avatar-image")).toHaveAttribute("src", mockUser.image)
    expect(screen.getByTestId("avatar-image")).toHaveAttribute("alt", mockUser.name)
  })

  it("debe mostrar el fallback del avatar cuando no hay imagen", () => {
    const userWithoutImage = { ...mockUser, image: null }
    mockUseAuth.mockReturnValue({
      user: userWithoutImage,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(<UserMenu />)

    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument()
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("J") // Primera letra del nombre
  })

  it("debe mostrar información del usuario en el dropdown", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(<UserMenu />)

    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(`Rol: ${mockUser.role}`)).toBeInTheDocument()
  })

  it("debe mostrar enlaces de navegación estándar", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(<UserMenu />)

    expect(screen.getByText("Perfil")).toBeInTheDocument()
    expect(screen.getByText("Configuración")).toBeInTheDocument()
  })

  it("debe mostrar enlace de admin solo para administradores", () => {
    // Usuario regular - no debe ver enlace de admin
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
    })

    const { rerender } = render(<UserMenu />)

    expect(screen.queryByText("Panel de Admin")).not.toBeInTheDocument()

    // Usuario admin - debe ver enlace de admin
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      isAuthenticated: true,
      isAdmin: true,
    })

    rerender(<UserMenu />)

    expect(screen.getByText("Panel de Admin")).toBeInTheDocument()
  })

  it("debe mostrar el botón de cerrar sesión", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(<UserMenu />)

    // El SignOutButton debe estar presente en el menú
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument()
  })

  it("debe manejar usuario sin nombre correctamente", () => {
    const userWithoutName = { ...mockUser, name: null }
    mockUseAuth.mockReturnValue({
      user: userWithoutName,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(<UserMenu />)

    // Debe usar "U" como fallback cuando no hay nombre
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("U")
    expect(screen.getByText(userWithoutName.email)).toBeInTheDocument()
  })

  it("debe tener los enlaces correctos", () => {
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      isAuthenticated: true,
      isAdmin: true,
    })

    render(<UserMenu />)

    // Verificar que los enlaces tengan las rutas correctas
    expect(screen.getByText("Perfil").closest("a")).toHaveAttribute("href", "/profile")
    expect(screen.getByText("Configuración").closest("a")).toHaveAttribute("href", "/settings")
    expect(screen.getByText("Panel de Admin").closest("a")).toHaveAttribute("href", "/admin")
  })
})
