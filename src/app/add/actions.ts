"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { PRODUCT_TYPES } from "@/lib/types"

export type TransactionFormState = { error: string | null }

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const type = String(formData.get("type") ?? "")
  const transactionDate = String(formData.get("transaction_date") ?? "")
  const note = String(formData.get("note") ?? "").trim()
  const paymentMethod = String(formData.get("payment_method") ?? "").trim()

  if (type !== "INCOME" && type !== "EXPENSE") {
    return { error: "Loại giao dịch không hợp lệ." }
  }
  if (!transactionDate) {
    return { error: "Vui lòng chọn ngày giao dịch." }
  }

  const supabase = await createClient()

  if (type === "EXPENSE") {
    const categoryId = String(formData.get("category_id") ?? "")
    const amount = Number(formData.get("amount"))

    if (!categoryId) {
      return { error: "Vui lòng chọn danh mục." }
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: "Số tiền không hợp lệ." }
    }

    const { error } = await supabase.from("transactions").insert({
      type,
      category_id: categoryId,
      amount,
      transaction_date: transactionDate,
      note: note || null,
      payment_method: paymentMethod || null,
    })

    if (error) return { error: error.message }
  } else {
    const orderCode = String(formData.get("order_code") ?? "").trim()
    const productType = String(formData.get("product_type") ?? "")
    const unitPrice = Number(formData.get("unit_price"))
    const quantity = Number(formData.get("quantity"))
    const discount = Number(formData.get("discount") || 0)
    const extraFee = Number(formData.get("extra_fee") || 0)

    if (!orderCode) {
      return { error: "Vui lòng nhập mã đơn." }
    }
    if (!PRODUCT_TYPES.some((p) => p.value === productType)) {
      return { error: "Vui lòng chọn loại sản phẩm." }
    }
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return { error: "Đơn giá không hợp lệ." }
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { error: "Số lượng không hợp lệ." }
    }
    if (!Number.isFinite(discount) || discount < 0) {
      return { error: "Giảm giá không hợp lệ." }
    }
    if (!Number.isFinite(extraFee) || extraFee < 0) {
      return { error: "Phí thêm không hợp lệ." }
    }

    const amount = unitPrice * quantity - discount - extraFee

    if (amount < 0) {
      return {
        error: "Doanh thu tính ra bị âm, kiểm tra lại giảm giá / phí thêm.",
      }
    }

    const { error } = await supabase.from("transactions").insert({
      type,
      category_id: null,
      order_code: orderCode,
      product_type: productType,
      unit_price: unitPrice,
      quantity,
      discount,
      extra_fee: extraFee,
      amount,
      transaction_date: transactionDate,
      note: note || null,
      payment_method: paymentMethod || null,
    })

    if (error) return { error: error.message }
  }

  revalidatePath("/transactions")
  revalidatePath("/")
  redirect("/transactions")
}
