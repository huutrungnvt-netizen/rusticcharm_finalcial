"use client"

import { useState } from "react"

import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

export type MonthlyTrendPoint = {
  key: string
  label: string
  income: number
  expense: number
}

const CHART_HEIGHT = 176

function niceMax(value: number) {
  if (value <= 0) return 100000
  const exponent = Math.floor(Math.log10(value))
  const magnitude = 10 ** exponent
  const residual = value / magnitude
  const niceResidual = residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1
  return niceResidual * magnitude
}

export function MonthlyTrendChart({ data }: { data: MonthlyTrendPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const maxValue = niceMax(Math.max(1, ...data.flatMap((d) => [d.income, d.expense])))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => maxValue * f)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-income" />
          Thu
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-expense" />
          Chi
        </span>
      </div>

      <div className="flex gap-2">
        <div
          className="flex shrink-0 flex-col justify-between text-right text-[11px] text-muted-foreground"
          style={{ height: CHART_HEIGHT }}
        >
          {[...ticks].reverse().map((tick) => (
            <span key={tick}>{formatCompactCurrency(tick)}</span>
          ))}
        </div>

        <div className="relative flex-1">
          <div
            className="absolute inset-x-0 top-0 flex flex-col justify-between"
            style={{ height: CHART_HEIGHT }}
            aria-hidden
          >
            {ticks.map((tick) => (
              <div key={tick} className="h-px bg-border" />
            ))}
          </div>

          <div
            className="relative flex items-end justify-between gap-1"
            style={{ height: CHART_HEIGHT }}
          >
            {data.map((point, index) => {
              const incomeHeight = (point.income / maxValue) * CHART_HEIGHT
              const expenseHeight = (point.expense / maxValue) * CHART_HEIGHT
              const isActive = activeIndex === index

              return (
                <div
                  key={point.key}
                  role="group"
                  tabIndex={0}
                  aria-label={`${point.label}: Thu ${formatCurrency(point.income)}, Chi ${formatCurrency(point.expense)}`}
                  className="relative flex h-full flex-1 items-end justify-center gap-[3px] outline-none"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                >
                  {isActive && (
                    <div className="pointer-events-none absolute bottom-full z-10 mb-2 flex w-max flex-col gap-1 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                      <span className="font-medium text-foreground">
                        {point.label}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-3 rounded-full bg-income" />
                        <span className="text-muted-foreground">Thu</span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatCurrency(point.income)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-3 rounded-full bg-expense" />
                        <span className="text-muted-foreground">Chi</span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatCurrency(point.expense)}
                        </span>
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "w-full max-w-3 rounded-t-[4px] bg-income transition-opacity",
                      isActive ? "opacity-100" : "opacity-90"
                    )}
                    style={{ height: Math.max(incomeHeight, 2) }}
                  />
                  <div
                    className={cn(
                      "w-full max-w-3 rounded-t-[4px] bg-expense transition-opacity",
                      isActive ? "opacity-100" : "opacity-90"
                    )}
                    style={{ height: Math.max(expenseHeight, 2) }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pl-[38px]">
        {data.map((point) => (
          <span
            key={point.key}
            className="flex-1 text-center text-[11px] text-muted-foreground"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}
