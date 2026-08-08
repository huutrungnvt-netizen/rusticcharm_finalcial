"use client"

import { useActionState, useRef, useState } from "react"

import { createCategory } from "@/app/categories/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { CategoryType } from "@/lib/types"

type State = { error: string | null }

async function submitCategory(_prevState: State, formData: FormData) {
  try {
    await createCategory(formData)
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Có lỗi xảy ra." }
  }
}

export function CategoryForm() {
  const [state, action, pending] = useActionState(submitCategory, {
    error: null,
  })
  const [type, setType] = useState<CategoryType>("EXPENSE")
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData)
        formRef.current?.reset()
        setType("EXPENSE")
      }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="name">Tên danh mục</Label>
        <Input
          id="name"
          name="name"
          placeholder="VD: Doanh thu bán hàng"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Loại</Label>
        <input type="hidden" name="type" value={type} />
        <div className="flex overflow-hidden rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors",
              type === "EXPENSE"
                ? "bg-expense/10 text-expense"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Chi
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors",
              type === "INCOME"
                ? "bg-income/10 text-income"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Thu
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="icon">Icon (tuỳ chọn)</Label>
        <Input id="icon" name="icon" placeholder="VD: 💰" className="sm:w-24" />
      </div>

      <Button type="submit" disabled={pending} className="sm:w-auto">
        {pending ? "Đang lưu..." : "Thêm danh mục"}
      </Button>

      {state.error && (
        <p className="text-sm text-destructive sm:basis-full">
          {state.error}
        </p>
      )}
    </form>
  )
}
