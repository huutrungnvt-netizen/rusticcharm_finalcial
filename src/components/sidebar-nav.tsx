"use client"

import Link from "next/link"
import { Tag, Wallet } from "lucide-react"
import { usePathname } from "next/navigation"

import { navItems } from "@/components/nav-items"
import { LogoutButton } from "@/components/logout-button"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const pathname = usePathname()

  if (pathname === "/login") return null

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex print:hidden">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Wallet className="size-4" />
        </span>
        <span className="text-base font-semibold tracking-tight">
          Finance App
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 pt-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/categories"
          aria-current={pathname.startsWith("/categories") ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/categories")
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Tag className="size-[18px]" />
          Danh mục
        </Link>
        <LogoutButton />
      </div>
    </aside>
  )
}
