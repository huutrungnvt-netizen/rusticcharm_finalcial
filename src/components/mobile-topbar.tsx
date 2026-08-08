import { Wallet } from "lucide-react"

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden print:hidden">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-4" />
      </span>
      <span className="text-base font-semibold tracking-tight">
        Finance App
      </span>
    </header>
  )
}
