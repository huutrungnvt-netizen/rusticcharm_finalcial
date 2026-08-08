import { ChartPie, History, Home, Plus, type LucideIcon } from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/transactions", label: "Lịch sử", icon: History },
  { href: "/add", label: "Nhập liệu", icon: Plus },
  { href: "/reports", label: "Báo cáo", icon: ChartPie },
]
