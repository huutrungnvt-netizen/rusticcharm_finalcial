import type { LucideIcon } from "lucide-react"

import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string
  value: number
  icon: LucideIcon
  tone?: "income" | "expense" | "neutral"
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          tone === "income" && "bg-income/10 text-income",
          tone === "expense" && "bg-expense/10 text-expense",
          tone === "neutral" && "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            "truncate text-lg font-semibold tabular-nums",
            tone === "income" && "text-income",
            tone === "expense" && "text-expense"
          )}
        >
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  )
}
