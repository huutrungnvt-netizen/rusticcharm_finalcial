import Link from "next/link"
import { Pencil, Plus, Receipt, Scale, TrendingDown, TrendingUp } from "lucide-react"

import { deleteTransaction } from "@/app/transactions/actions"
import { CategoryIcon } from "@/components/category-icon"
import { DeleteButton } from "@/components/delete-button"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/format"
import { createClient } from "@/lib/supabase/server"
import { productTypeIcon, type TransactionWithCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(id, name, type, icon)")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })

  const transactions = (data ?? []) as TransactionWithCategory[]

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <PageContainer>
      <PageHeader
        title="Lịch sử"
        description="Toàn bộ giao dịch đã ghi lại."
        action={
          <Button
            size="sm"
            nativeButton={false}
            render={
              <Link href="/add">
                <Plus className="size-4" />
                Nhập giao dịch
              </Link>
            }
          />
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Tổng thu" value={totalIncome} icon={TrendingUp} tone="income" />
        <StatCard label="Tổng chi" value={totalExpense} icon={TrendingDown} tone="expense" />
        <StatCard
          label="Số dư"
          value={totalIncome - totalExpense}
          icon={Scale}
          tone="neutral"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Không tải được giao dịch: {error.message}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Receipt className="size-6" />
            </span>
            <p className="text-sm text-muted-foreground">
              Chưa có giao dịch nào. Vào mục Nhập liệu để thêm giao dịch đầu
              tiên.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {transactions.map((t) => {
              const isIncome = t.type === "INCOME"
              const title = isIncome
                ? (t.product_type ?? "Doanh thu")
                : (t.category?.name ?? "Không có danh mục")
              const icon = isIncome
                ? productTypeIcon(t.product_type)
                : t.category?.icon
              const subtitleParts = isIncome
                ? [
                    t.order_code ? `Mã đơn: ${t.order_code}` : null,
                    t.quantity != null && t.unit_price != null
                      ? `SL: ${t.quantity} × ${formatCurrency(t.unit_price)}`
                      : null,
                  ]
                : [
                    formatDate(t.transaction_date),
                    t.payment_method,
                    t.note,
                  ]
              if (isIncome) subtitleParts.unshift(formatDate(t.transaction_date))

              return (
                <li
                  key={t.id}
                  className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CategoryIcon icon={icon} type={isIncome ? "INCOME" : "EXPENSE"} />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {subtitleParts.filter(Boolean).join(" · ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        isIncome ? "text-income" : "text-expense"
                      )}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </span>
                    <Link
                      href={`/transactions/${t.id}/edit`}
                      aria-label="Sửa giao dịch"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton
                      id={t.id}
                      action={deleteTransaction}
                      confirmMessage="Xoá giao dịch này?"
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </PageContainer>
  )
}
