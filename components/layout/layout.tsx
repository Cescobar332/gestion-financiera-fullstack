import type { ReactNode } from "react"
import { Navbar } from "./navbar"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
