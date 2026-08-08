"use client"

import { useActionState, useMemo, useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { createTransaction, type TransactionFormState } from "@/app/add/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, toLocalISODate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { PRODUCT_TYPES, type Category, type CategoryType } from "@/lib/types"

const paymentMethods = [
  "Tiền mặt",
  "Chuyển khoản ngân hàng",
  "Thẻ",
  "Ví điện tử",
  "Khác",
]

const initialState: TransactionFormState = { error: null }

export function TransactionForm({ categories }: { categories: Category[] }) {
  const [type, setType] = useState<CategoryType>("EXPENSE")
  const [state, action, pending] = useActionState(
    createTransaction,
    initialState
  )

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "EXPENSE"),
    [categories]
  )

  const today = useMemo(() => toLocalISODate(new Date()), [])

  const [unitPrice, setUnitPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [discount, setDiscount] = useState("")
  const [extraFee, setExtraFee] = useState("")

  const revenue = useMemo(() => {
    const price = Number(unitPrice) || 0
    const qty = Number(quantity) || 0
    const disc = Number(discount) || 0
    const fee = Number(extraFee) || 0
    return price * qty - disc - fee
  }, [unitPrice, quantity, discount, extraFee])

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="type" value={type} />

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-1.5">
        <button
          type="button"
          onClick={() => setType("EXPENSE")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors",
            type === "EXPENSE"
              ? "bg-expense/10 text-expense shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingDown className="size-4" />
          Chi phí
        </button>
        <button
          type="button"
          onClick={() => setType("INCOME")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors",
            type === "INCOME"
              ? "bg-income/10 text-income shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp className="size-4" />
          Doanh thu
        </button>
      </div>

      {type === "EXPENSE" ? (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Số tiền (VND)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              inputMode="numeric"
              min="0"
              step="1000"
              placeholder="0"
              className="h-11 text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category_id">Danh mục</Label>
            {expenseCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có danh mục chi nào.{" "}
                <a href="/categories" className="text-primary underline">
                  Tạo danh mục
                </a>
                .
              </p>
            ) : (
              <Select name="category_id">
                <SelectTrigger id="category_id" className="w-full">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon ? `${category.icon} ` : ""}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order_code">Mã đơn</Label>
            <Input id="order_code" name="order_code" placeholder="VD: DH001" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product_type">Loại sản phẩm</Label>
            <Select name="product_type">
              <SelectTrigger id="product_type" className="w-full">
                <SelectValue placeholder="Chọn loại sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.icon} {p.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="unit_price">Đơn giá (VND)</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                inputMode="numeric"
                min="0"
                step="1000"
                placeholder="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="discount">Giảm giá (VND)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                inputMode="numeric"
                min="0"
                step="1000"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="extra_fee">Phí thêm (VND)</Label>
              <Input
                id="extra_fee"
                name="extra_fee"
                type="number"
                inputMode="numeric"
                min="0"
                step="1000"
                placeholder="0"
                value={extraFee}
                onChange={(e) => setExtraFee(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-income/10 px-4 py-3">
            <span className="text-sm font-medium text-income">
              Doanh thu đơn hàng
            </span>
            <span className="text-lg font-semibold tabular-nums text-income">
              {formatCurrency(revenue)}
            </span>
          </div>
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction_date">Ngày giao dịch</Label>
        <Input
          id="transaction_date"
          name="transaction_date"
          type="date"
          defaultValue={today}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="payment_method">Phương thức thanh toán</Label>
        <Select name="payment_method" defaultValue={paymentMethods[0]}>
          <SelectTrigger id="payment_method" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea id="note" name="note" placeholder="Ghi chú (tuỳ chọn)" />
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={pending || (type === "EXPENSE" && expenseCategories.length === 0)}
        size="lg"
        className="h-11"
      >
        {pending ? "Đang lưu..." : "Lưu giao dịch"}
      </Button>
    </form>
  )
}
