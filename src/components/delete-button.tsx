"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function DeleteButton({
  id,
  action,
  confirmMessage,
}: {
  id: string
  action: (formData: FormData) => void | Promise<void>
  confirmMessage: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon-sm"
        aria-label="Xoá"
        className="text-muted-foreground hover:bg-expense/10 hover:text-expense"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  )
}
