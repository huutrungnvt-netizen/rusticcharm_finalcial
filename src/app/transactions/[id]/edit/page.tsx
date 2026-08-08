import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { TransactionForm } from "@/components/transaction-form"
import { createClient } from "@/lib/supabase/server"
import type { Category, Transaction } from "@/lib/types"

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: transaction }, { data: categoriesData }] = await Promise.all([
    supabase.from("transactions").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("categories")
      .select("*")
      .eq("type", "EXPENSE")
      .order("name"),
  ])

  if (!transaction) {
    notFound()
  }

  const categories = (categoriesData ?? []) as Category[]

  return (
    <PageContainer>
      <PageHeader
        title="Sửa giao dịch"
        description="Cập nhật thông tin giao dịch đã ghi."
        action={
          <Link
            href="/transactions"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <TransactionForm
          categories={categories}
          transaction={transaction as Transaction}
        />
      </div>
    </PageContainer>
  )
}
