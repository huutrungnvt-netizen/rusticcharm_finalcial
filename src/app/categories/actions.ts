"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const type = String(formData.get("type") ?? "")
  const icon = String(formData.get("icon") ?? "").trim()

  if (!name || (type !== "INCOME" && type !== "EXPENSE")) {
    throw new Error("Thiếu tên hoặc loại danh mục không hợp lệ.")
  }

  const supabase = await createClient()
  const { error } = await supabase.from("categories").insert({
    name,
    type,
    icon: icon || null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/categories")
  revalidatePath("/add")
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = await createClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/categories")
  revalidatePath("/add")
}
