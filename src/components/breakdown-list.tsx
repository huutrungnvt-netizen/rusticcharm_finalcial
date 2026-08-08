import { formatCurrency } from "@/lib/format"

export type BreakdownItem = {
  key: string
  label: string
  icon?: string | null
  amount: number
  color: string
}

export function BreakdownList({
  items,
  total,
  emptyLabel,
}: {
  items: BreakdownItem[]
  total: number
  emptyLabel: string
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const percent = total > 0 ? (item.amount / total) * 100 : 0
        return (
          <li key={item.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-1.5 font-medium">
                {item.icon && <span>{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatCurrency(item.amount)}
                <span className="ml-1.5 text-xs">
                  ({percent.toFixed(0)}%)
                </span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.max(percent, percent > 0 ? 2 : 0)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
