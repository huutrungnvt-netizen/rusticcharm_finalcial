import { Wallet } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </span>
          <h1 className="text-lg font-semibold tracking-tight">
            Finance App
          </h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập để quản lý thu chi.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
