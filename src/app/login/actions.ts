"use server"

import { redirect } from "next/navigation"

import { usernameToEmail } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type LoginFormState = { error: string | null }

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!username || !password) {
    return { error: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  })

  if (error) {
    return { error: "Tài khoản hoặc mật khẩu không đúng." }
  }

  redirect("/")
}
