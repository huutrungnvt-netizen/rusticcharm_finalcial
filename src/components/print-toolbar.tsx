"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintToolbar() {
  useEffect(() => {
    const id = window.setTimeout(() => window.print(), 300)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="mb-6 flex items-center justify-between print:hidden">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={
          <Link href="/reports">
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
        }
      />
      <Button size="sm" onClick={() => window.print()}>
        <Printer className="size-4" />
        In / Lưu PDF
      </Button>
    </div>
  )
}
