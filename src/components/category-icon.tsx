import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { CategoryType } from "@/lib/types"

export function CategoryIcon({
  icon,
  type,
  size = "md",
}: {
  icon?: string | null
  type: CategoryType
  size?: "sm" | "md"
}) {
  const isIncome = type === "INCOME"

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        size === "sm" ? "size-8 text-sm" : "size-10 text-base",
        isIncome ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
      )}
    >
      {icon ? (
        icon
      ) : isIncome ? (
        <ArrowUpRight className={size === "sm" ? "size-4" : "size-5"} />
      ) : (
        <ArrowDownLeft className={size === "sm" ? "size-4" : "size-5"} />
      )}
    </span>
  )
}
