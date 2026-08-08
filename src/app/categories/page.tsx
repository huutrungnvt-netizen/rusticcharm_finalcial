import { deleteCategory } from "@/app/categories/actions"
import { CategoryForm } from "@/components/category-form"
import { CategoryIcon } from "@/components/category-icon"
import { DeleteButton } from "@/components/delete-button"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/lib/types"

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("name")

  const categories = (data ?? []) as Category[]
  const income = categories.filter((c) => c.type === "INCOME")
  const expense = categories.filter((c) => c.type === "EXPENSE")

  return (
    <PageContainer>
      <PageHeader
        title="Danh mục"
        description="Quản lý danh mục thu / chi dùng khi nhập giao dịch."
      />

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <CategoryForm />
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Không tải được danh mục: {error.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <CategoryList title="Danh mục Thu" items={income} />
        <CategoryList title="Danh mục Chi" items={expense} />
      </div>
    </PageContainer>
  )
}

function CategoryList({
  title,
  items,
}: {
  title: string
  items: Category[]
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Chưa có danh mục nào.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {items.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
            >
              <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium">
                <CategoryIcon
                  icon={category.icon}
                  type={category.type}
                  size="sm"
                />
                <span className="truncate">{category.name}</span>
              </span>
              <DeleteButton
                id={category.id}
                action={deleteCategory}
                confirmMessage={`Xoá danh mục "${category.name}"?`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
