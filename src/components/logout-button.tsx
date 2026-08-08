"use client"

import { LogOut } from "lucide-react"

import { logout } from "@/app/logout/actions"
import { cn } from "@/lib/utils"

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          className
        )}
      >
        <LogOut className="size-[18px]" />
        Đăng xuất
      </button>
    </form>
  )
}
