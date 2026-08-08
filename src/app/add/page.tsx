import Link from "next/link"
import { Tag } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { TransactionForm } from "@/components/transaction-form"
import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/lib/types"

export default async function AddTransactionPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("type", "EXPENSE")
    .order("name")

  const categories = (data ?? []) as Category[]

  return (
    <PageContainer>
      <PageHeader
        title="Nhập liệu"
        description="Ghi lại một khoản thu hoặc chi."
        action={
          <Link
            href="/categories"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Tag className="size-4" />
            Quản lý danh mục
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <TransactionForm categories={categories} />
      </div>
    </PageContainer>
  )
}
