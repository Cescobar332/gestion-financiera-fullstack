"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/components/auth/auth-provider"
import { UserMenu } from "@/components/auth/user-menu"
import { SignInButton } from "@/components/auth/signin-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, DollarSign, Users, BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Inicio", href: "/", icon: Home, public: true },
  { name: "Ingresos/Egresos", href: "/transactions", icon: DollarSign, public: false },
  { name: "Usuarios", href: "/admin/users", icon: Users, adminOnly: true },
  { name: "Reportes", href: "/admin/reports", icon: BarChart3, adminOnly: true },
]

export function Navbar() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredNavigation = navigation.filter((item) => {
    if (item.public) return true
    if (item.adminOnly) return isAdmin
    return isAuthenticated
  })

  return (
    <nav className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Mi Proyecto
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavigation.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? <UserMenu /> : <SignInButton />}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {filteredNavigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block py-2 pl-3 pr-4 text-base font-medium border-l-4 transition-colors",
                    isActive
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="border-t border-border pb-3 pt-4">
            <div className="px-4">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserMenu />
                  </div>
                </div>
              ) : (
                <SignInButton className="w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
