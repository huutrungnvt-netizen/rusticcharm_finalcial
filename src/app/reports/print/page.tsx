import { Wallet } from "lucide-react"

import { PrintToolbar } from "@/components/print-toolbar"
import { formatCurrency, formatDate, toLocalISODate } from "@/lib/format"
import {
  buildCategoryBreakdown,
  buildProductBreakdown,
  computeTotals,
} from "@/lib/reports"
import { createClient } from "@/lib/supabase/server"
import type { TransactionWithCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

function defaultRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    from: toLocalISODate(from),
    to: toLocalISODate(now),
  }
}

export default async function ReportPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const params = await searchParams
  const defaults = defaultRange()
  const from = params.from || defaults.from
  const to = params.to || defaults.to

  const supabase = await createClient()
  const { data } = await supabase
    .from("transactions")
    .select("*, category:categories(id, name, type, icon)")
    .gte("transaction_date", from)
    .lte("transaction_date", to)
    .order("transaction_date", { ascending: true })

  const transactions = (data ?? []) as TransactionWithCategory[]
  const { totalIncome, totalExpense, balance } = computeTotals(transactions)
  const categoryBreakdown =
    totalExpense > 0 ? buildCategoryBreakdown(transactions) : []
  const productBreakdown =
    totalIncome > 0 ? buildProductBreakdown(transactions) : []

  const generatedAt = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date())

  return (
    <div className="mx-auto max-w-3xl p-6 print:max-w-none print:p-0">
      <PrintToolbar />

      <header className="mb-6 border-b border-black/15 pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Wallet className="size-4" />
          Finance App
        </div>
        <h1 className="mt-2 text-2xl font-bold">Báo cáo thu chi</h1>
        <p className="text-sm text-neutral-600">
          Từ {formatDate(from)} đến {formatDate(to)}
        </p>
        <p className="text-xs text-neutral-400">Xuất lúc {generatedAt}</p>
      </header>

      <section className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-neutral-500">Tổng thu</p>
          <p className="text-lg font-semibold text-income">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-neutral-500">Tổng chi</p>
          <p className="text-lg font-semibold text-expense">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-neutral-500">Số dư</p>
          <p className="text-lg font-semibold">{formatCurrency(balance)}</p>
        </div>
      </section>

      {categoryBreakdown.length > 0 && (
        <section className="mb-6 break-inside-avoid">
          <h2 className="mb-2 text-sm font-semibold">Chi phí theo danh mục</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/15 text-left text-neutral-500">
                <th className="py-1.5 font-medium">Danh mục</th>
                <th className="py-1.5 text-right font-medium">Số tiền</th>
                <th className="py-1.5 text-right font-medium">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((item) => (
                <tr key={item.key} className="border-b border-black/5">
                  <td className="py-1.5">
                    {item.icon ? `${item.icon} ` : ""}
                    {item.label}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {totalExpense > 0
                      ? ((item.amount / totalExpense) * 100).toFixed(0)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {productBreakdown.length > 0 && (
        <section className="mb-6 break-inside-avoid">
          <h2 className="mb-2 text-sm font-semibold">
            Doanh thu theo loại sản phẩm
          </h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/15 text-left text-neutral-500">
                <th className="py-1.5 font-medium">Loại sản phẩm</th>
                <th className="py-1.5 text-right font-medium">Số tiền</th>
                <th className="py-1.5 text-right font-medium">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {productBreakdown.map((item) => (
                <tr key={item.key} className="border-b border-black/5">
                  <td className="py-1.5">
                    {item.icon ? `${item.icon} ` : ""}
                    {item.label}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {totalIncome > 0
                      ? ((item.amount / totalIncome) * 100).toFixed(0)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold">
          Chi tiết giao dịch ({transactions.length})
        </h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Không có giao dịch nào trong khoảng thời gian này.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/15 text-left text-neutral-500">
                <th className="py-1.5 font-medium">Ngày</th>
                <th className="py-1.5 font-medium">Loại</th>
                <th className="py-1.5 font-medium">Danh mục / Sản phẩm</th>
                <th className="py-1.5 font-medium">Ghi chú</th>
                <th className="py-1.5 text-right font-medium">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const isIncome = t.type === "INCOME"
                const label = isIncome
                  ? (t.product_type ?? "Doanh thu")
                  : (t.category?.name ?? "Không có danh mục")
                return (
                  <tr
                    key={t.id}
                    className="break-inside-avoid border-b border-black/5"
                  >
                    <td className="py-1.5 whitespace-nowrap">
                      {formatDate(t.transaction_date)}
                    </td>
                    <td className="py-1.5">{isIncome ? "Thu" : "Chi"}</td>
                    <td className="py-1.5">{label}</td>
                    <td className="py-1.5 text-neutral-500">
                      {t.note ?? ""}
                    </td>
                    <td
                      className={cn(
                        "py-1.5 text-right tabular-nums",
                        isIncome ? "text-income" : "text-expense"
                      )}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
