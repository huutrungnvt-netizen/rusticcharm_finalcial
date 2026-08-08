import Link from "next/link"
import { ArrowRight, Plus, Scale, TrendingDown, TrendingUp } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/format"
import { createClient } from "@/lib/supabase/server"
import { productTypeIcon, type TransactionWithCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase
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
  const recent = transactions.slice(0, 5)

  return (
    <PageContainer>
      <PageHeader
        title="Trang chủ"
        description="Tổng quan thu chi của bạn."
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
        <StatCard
          label="Tổng thu"
          value={totalIncome}
          icon={TrendingUp}
          tone="income"
        />
        <StatCard
          label="Tổng chi"
          value={totalExpense}
          icon={TrendingDown}
          tone="expense"
        />
        <StatCard
          label="Số dư"
          value={totalIncome - totalExpense}
          icon={Scale}
          tone="neutral"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Giao dịch gần đây</h2>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Xem tất cả
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có giao dịch nào.
            </p>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href="/add">Nhập giao dịch đầu tiên</Link>}
            />
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {recent.map((t) => {
              const isIncome = t.type === "INCOME"
              const title = isIncome
                ? (t.product_type ?? "Doanh thu")
                : (t.category?.name ?? "Không có danh mục")
              const icon = isIncome
                ? productTypeIcon(t.product_type)
                : t.category?.icon
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CategoryIcon
                      icon={icon}
                      type={isIncome ? "INCOME" : "EXPENSE"}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(t.transaction_date)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      isIncome ? "text-income" : "text-expense"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </PageContainer>
  )
}
