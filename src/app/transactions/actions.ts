"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export async function deleteTransaction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = await createClient()
  const { error } = await supabase.from("transactions").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/transactions")
  revalidatePath("/")
}
