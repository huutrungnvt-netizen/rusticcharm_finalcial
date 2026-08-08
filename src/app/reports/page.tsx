import { Scale, TrendingDown, TrendingUp } from "lucide-react"

import { BreakdownList } from "@/components/breakdown-list"
import { ExportReportForm } from "@/components/export-report-form"
import { MonthlyTrendChart, type MonthlyTrendPoint } from "@/components/monthly-trend-chart"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import {
  buildCategoryBreakdown,
  buildProductBreakdown,
  computeTotals,
} from "@/lib/reports"
import { createClient } from "@/lib/supabase/server"
import type { TransactionWithCategory } from "@/lib/types"

function buildMonthlyTrend(
  transactions: TransactionWithCategory[]
): MonthlyTrendPoint[] {
  const now = new Date()
  const months: MonthlyTrendPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    months.push({ key, label: `Th${d.getMonth() + 1}`, income: 0, expense: 0 })
  }

  const monthIndex = new Map(months.map((m, i) => [m.key, i]))

  for (const t of transactions) {
    const key = t.transaction_date.slice(0, 7)
    const idx = monthIndex.get(key)
    if (idx === undefined) continue
    if (t.type === "INCOME") months[idx].income += t.amount
    else months[idx].expense += t.amount
  }

  return months
}

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(id, name, type, icon)")
    .order("transaction_date", { ascending: false })

  const transactions = (data ?? []) as TransactionWithCategory[]

  const { totalIncome, totalExpense } = computeTotals(transactions)

  const monthlyTrend = buildMonthlyTrend(transactions)
  const categoryBreakdown =
    totalExpense > 0 ? buildCategoryBreakdown(transactions) : []
  const productBreakdown = totalIncome > 0 ? buildProductBreakdown(transactions) : []

  return (
    <PageContainer>
      <PageHeader
        title="Báo cáo"
        description="Biểu đồ và thống kê thu chi theo thời gian."
      />

      {error && (
        <p className="text-sm text-destructive">
          Không tải được dữ liệu: {error.message}
        </p>
      )}

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

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Thu chi 6 tháng gần đây
        </h2>
        <MonthlyTrendChart data={monthlyTrend} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-sm font-semibold">Chi phí theo danh mục</h2>
          <BreakdownList
            items={categoryBreakdown}
            total={totalExpense}
            emptyLabel="Chưa có chi phí nào được ghi nhận."
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-sm font-semibold">
            Doanh thu theo loại sản phẩm
          </h2>
          <BreakdownList
            items={productBreakdown}
            total={totalIncome}
            emptyLabel="Chưa có doanh thu nào được ghi nhận."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h2 className="mb-1 text-sm font-semibold">Xuất báo cáo PDF</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Chọn khoảng thời gian rồi xuất — trang mở ra có thể lưu thành PDF
          bằng tính năng In của trình duyệt.
        </p>
        <ExportReportForm />
      </div>
    </PageContainer>
  )
}
