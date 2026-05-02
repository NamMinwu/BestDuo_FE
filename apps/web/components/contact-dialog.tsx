"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string }

interface ContactDialogProps {
  trigger: React.ReactNode
}

const MESSAGE_MAX = 2000

export function ContactDialog({ trigger }: ContactDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<SubmitState>({ kind: "idle" })
  const [nickname, setNickname] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [message, setMessage] = React.useState("")
  const honeypotRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!open) return
    setState({ kind: "idle" })
  }, [open])

  const reset = React.useCallback(() => {
    setNickname("")
    setContact("")
    setMessage("")
    if (honeypotRef.current) honeypotRef.current.value = ""
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state.kind === "submitting") return

    setState({ kind: "submitting" })
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          contact,
          message,
          website: honeypotRef.current?.value ?? "",
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | { success: boolean; error?: string }
        | null

      if (!response.ok || !data?.success) {
        setState({
          kind: "error",
          message: data?.error ?? "전송에 실패했습니다. 잠시 후 다시 시도해주세요",
        })
        return
      }

      setState({ kind: "success" })
      reset()
    } catch {
      setState({
        kind: "error",
        message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
      })
    }
  }

  const isSubmitting = state.kind === "submitting"
  const isSuccess = state.kind === "success"

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogPrimitive.Title className="text-sm font-semibold tracking-tight text-foreground">
                문의하기
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[11px] leading-relaxed text-muted-foreground">
                답변을 받으려면 이메일 또는 Discord ID를 남겨주세요. 보내주신 내용은
                Discord 채널로 전달됩니다.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="닫기"
                className="text-muted-foreground"
              >
                <X />
              </Button>
            </DialogPrimitive.Close>
          </div>

          {isSuccess ? (
            <div className="mt-5 space-y-4 text-xs text-muted-foreground">
              <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-200">
                문의가 전달되었습니다. 빠르게 확인할게요!
              </p>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="contact-nickname">
                  닉네임 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-nickname"
                  required
                  maxLength={40}
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="홍길동"
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-channel">
                  답장받을 연락처{" "}
                  <span className="text-muted-foreground/70">(선택)</span>
                </Label>
                <Input
                  id="contact-channel"
                  maxLength={120}
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="이메일 또는 Discord ID"
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-message">
                  내용 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  required
                  minLength={5}
                  maxLength={MESSAGE_MAX}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="문의하실 내용을 자세히 적어주세요"
                  className="min-h-28"
                  disabled={isSubmitting}
                />
                <p className="text-right text-[10px] text-muted-foreground/60">
                  {message.length} / {MESSAGE_MAX}
                </p>
              </div>

              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {state.kind === "error" ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-[11px] text-destructive">
                  {state.message}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-1">
                <DialogPrimitive.Close asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                </DialogPrimitive.Close>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "전송 중…" : "보내기"}
                </Button>
              </div>
            </form>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
