"use client"

import { LogOut, Wallet } from "lucide-react"
import { usePathname } from "next/navigation"

import { logout } from "@/app/logout/actions"

export function MobileTopBar() {
  const pathname = usePathname()

  if (pathname === "/login") return null

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden print:hidden">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-4" />
      </span>
      <span className="text-base font-semibold tracking-tight">
        Finance App
      </span>
      <form action={logout} className="ml-auto">
        <button
          type="submit"
          aria-label="Đăng xuất"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </header>
  )
}
