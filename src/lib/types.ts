export type CategoryType = "INCOME" | "EXPENSE"

export type ProductType = "Mơ" | "Mận" | "Táo mèo"

export const PRODUCT_TYPES: { value: ProductType; icon: string }[] = [
  { value: "Mơ", icon: "🍑" },
  { value: "Mận", icon: "🫐" },
  { value: "Táo mèo", icon: "🍎" },
]

export function productTypeIcon(productType: string | null | undefined) {
  return PRODUCT_TYPES.find((p) => p.value === productType)?.icon ?? null
}

export type Category = {
  id: string
  user_id: string | null
  name: string
  type: CategoryType
  icon: string | null
  created_at: string
}

export type Transaction = {
  id: string
  user_id: string | null
  type: CategoryType
  category_id: string | null
  order_code: string | null
  product_type: ProductType | null
  unit_price: number | null
  quantity: number | null
  discount: number
  extra_fee: number
  amount: number
  transaction_date: string
  note: string | null
  payment_method: string | null
  image_url: string | null
  created_at: string
}

export type TransactionWithCategory = Transaction & {
  category: Pick<Category, "id" | "name" | "type" | "icon"> | null
}
