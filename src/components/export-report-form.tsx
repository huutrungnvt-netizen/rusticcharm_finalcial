"use client"

import { useMemo, useState } from "react"
import { FileDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toLocalISODate } from "@/lib/format"
import { cn } from "@/lib/utils"

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function presets() {
  const now = new Date()
  const thisMonthStart = startOfMonth(now)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const quarterStart = new Date(now.getFullYear(), now.getMonth() - 2, 1)

  return [
    {
      key: "this_month",
      label: "Tháng này",
      from: toLocalISODate(thisMonthStart),
      to: toLocalISODate(now),
    },
    {
      key: "last_month",
      label: "Tháng trước",
      from: toLocalISODate(lastMonthStart),
      to: toLocalISODate(lastMonthEnd),
    },
    {
      key: "last_3_months",
      label: "3 tháng gần đây",
      from: toLocalISODate(quarterStart),
      to: toLocalISODate(now),
    },
    {
      key: "this_year",
      label: "Năm nay",
      from: toLocalISODate(yearStart),
      to: toLocalISODate(now),
    },
  ]
}

export function ExportReportForm() {
  const presetOptions = useMemo(() => presets(), [])
  const defaultPreset = presetOptions[0]

  const [from, setFrom] = useState(defaultPreset.from)
  const [to, setTo] = useState(defaultPreset.to)
  const [activePreset, setActivePreset] = useState<string | null>(
    defaultPreset.key
  )

  const printHref = `/reports/print?from=${from}&to=${to}`
  const isValidRange = Boolean(from) && Boolean(to) && from <= to

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {presetOptions.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => {
              setFrom(p.from)
              setTo(p.to)
              setActivePreset(p.key)
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activePreset === p.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="export_from">Từ ngày</Label>
          <Input
            id="export_from"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              setActivePreset(null)
            }}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="export_to">Đến ngày</Label>
          <Input
            id="export_to"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              setActivePreset(null)
            }}
            className="w-40"
          />
        </div>

        <Button
          nativeButton={false}
          disabled={!isValidRange}
          render={
            <a href={printHref} target="_blank" rel="noopener noreferrer">
              <FileDown className="size-4" />
              Xuất PDF
            </a>
          }
        />
      </div>

      {!isValidRange && (
        <p className="text-sm text-destructive">
          Ngày &quot;Từ&quot; phải trước hoặc bằng ngày &quot;Đến&quot;.
        </p>
      )}
    </div>
  )
}
