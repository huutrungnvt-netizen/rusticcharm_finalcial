"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navItems } from "@/components/nav-items"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === "/login") return null

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="relative grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          const isAdd = item.href === "/add"

          if (isAdd) {
            return (
              <li key={item.href} className="relative flex justify-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="absolute -top-7 flex flex-col items-center gap-1"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95">
                    <item.icon className="size-7" strokeWidth={2.5} />
                  </span>
                </Link>
              </li>
            )
          }

          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 px-3 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full px-3.5 py-0.5 transition-colors",
                    isActive && "bg-primary/10"
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
