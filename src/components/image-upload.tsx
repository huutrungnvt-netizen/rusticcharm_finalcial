"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const BUCKET = "transaction-images"

export function ImageUpload({ defaultUrl }: { defaultUrl?: string | null }) {
  const [imageUrl, setImageUrl] = useState(defaultUrl ?? "")
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus("error")
      setError("File phải là ảnh.")
      return
    }

    setStatus("uploading")
    setError(null)

    const supabase = createClient()
    const ext = file.name.split(".").pop() || "jpg"
    const path = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      setStatus("error")
      setError(uploadError.message)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path)

    setImageUrl(publicUrl)
    setStatus("idle")
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Ảnh đính kèm (tuỳ chọn)</span>
      <input type="hidden" name="image_url" value={imageUrl} />

      {imageUrl ? (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Ảnh giao dịch"
            className="max-h-48 rounded-xl border border-border object-contain"
          />
          <button
            type="button"
            onClick={() => setImageUrl("")}
            aria-label="Gỡ ảnh"
            className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className={cn(
            "flex items-center gap-3 rounded-xl border border-dashed p-3 text-sm transition-colors",
            status === "error"
              ? "border-destructive/40"
              : "border-border hover:border-primary/50"
          )}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {status === "uploading" ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-5" />
            )}
          </span>
          <span className="flex flex-col items-start">
            <span className="font-medium text-foreground">
              {status === "uploading" ? "Đang tải ảnh..." : "Tải ảnh lên"}
            </span>
            <span
              className={cn(
                "text-xs",
                status === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {status === "error"
                ? error
                : "Chụp hóa đơn hoặc ảnh liên quan đến giao dịch"}
            </span>
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
