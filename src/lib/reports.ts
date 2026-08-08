import type { BreakdownItem } from "@/components/breakdown-list"
import { chartColor } from "@/lib/chart-colors"
import { PRODUCT_TYPES, type TransactionWithCategory } from "@/lib/types"

export function computeTotals(transactions: TransactionWithCategory[]) {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense }
}

export function buildCategoryBreakdown(
  transactions: TransactionWithCategory[]
): BreakdownItem[] {
  const totals = new Map<
    string,
    { label: string; icon: string | null; amount: number }
  >()

  for (const t of transactions) {
    if (t.type !== "EXPENSE") continue
    const key = t.category?.id ?? "unknown"
    const existing = totals.get(key)
    if (existing) {
      existing.amount += t.amount
    } else {
      totals.set(key, {
        label: t.category?.name ?? "Không có danh mục",
        icon: t.category?.icon ?? null,
        amount: t.amount,
      })
    }
  }

  const sorted = [...totals.entries()].sort(
    (a, b) => b[1].amount - a[1].amount
  )
  const top = sorted.slice(0, 6)
  const rest = sorted.slice(6)
  const restTotal = rest.reduce((sum, [, v]) => sum + v.amount, 0)

  const items: BreakdownItem[] = top.map(([key, v], i) => ({
    key,
    label: v.label,
    icon: v.icon,
    amount: v.amount,
    color: chartColor(i),
  }))

  if (restTotal > 0) {
    items.push({
      key: "other",
      label: "Khác",
      amount: restTotal,
      color: "var(--muted-foreground)",
    })
  }

  return items
}

export function buildProductBreakdown(
  transactions: TransactionWithCategory[]
): BreakdownItem[] {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== "INCOME" || !t.product_type) continue
    totals.set(t.product_type, (totals.get(t.product_type) ?? 0) + t.amount)
  }

  return PRODUCT_TYPES.map((p, i) => ({
    key: p.value,
    label: p.value,
    icon: p.icon,
    amount: totals.get(p.value) ?? 0,
    color: chartColor(i),
  }))
}
